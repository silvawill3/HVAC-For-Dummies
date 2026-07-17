import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import {
  Account, StoredLead, LogEntry, STATUS_DEFS,
  DEFAULT_ACCOUNTS, LEADS_KEY, SESSION_KEY, REPS_KEY, CITY_ASSIGN_KEY,
} from '@/data/accounts';
import { LEADS_BY_CITY } from '@/data/leads';

// ── Helpers ───────────────────────────────────────────────────────────────────
function normalizeCity(city: string): string {
  return city.trim().replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

// ── Storage helpers ───────────────────────────────────────────────────────────
function loadCityAssignments(): Record<string, string[]> {
  try {
    const r = localStorage.getItem(CITY_ASSIGN_KEY);
    if (r) {
      const parsed = JSON.parse(r);
      const out: Record<string, string[]> = {};
      for (const [city, val] of Object.entries(parsed)) {
        const key = normalizeCity(city);
        const arr = Array.isArray(val) ? (val as string[]) : val ? [val as string] : [];
        out[key] = [...(out[key] || []), ...arr];
      }
      return out;
    }
  } catch {}
  return {};
}

function buildLeadsFromCityData(): StoredLead[] {
  let nextId = 1;
  const out: StoredLead[] = [];
  LEADS_BY_CITY.forEach(block => {
    block.leads.forEach(l => {
      out.push({ id: nextId++, name: l.name, address: l.address, city: normalizeCity(block.city), phone: (l as any).phone || '', category: l.category || '', repUsername: '', status: null, notes: '', appointment: '', photos: [], fromList: true });
    });
  });
  return out;
}

function applyCityAssignments(leads: StoredLead[]): StoredLead[] {
  // No-op: city assignments now control visibility, not per-lead repUsername
  return leads;
}

function loadAccounts(): Account[] {
  const admins = DEFAULT_ACCOUNTS.filter(a => a.role === 'admin');
  try {
    const r = localStorage.getItem(REPS_KEY);
    if (r) { const reps = JSON.parse(r); if (Array.isArray(reps) && reps.length) return [...admins, ...reps]; }
  } catch {}
  return DEFAULT_ACCOUNTS.slice();
}

function saveRepsToStorage(accounts: Account[]) {
  try { localStorage.setItem(REPS_KEY, JSON.stringify(accounts.filter(a => a.role === 'rep'))); } catch {}
}

function loadLeads(): StoredLead[] {
  const fresh = buildLeadsFromCityData();
  let stored: StoredLead[] | null = null;
  try { const r = localStorage.getItem(LEADS_KEY); if (r) stored = JSON.parse(r); } catch {}

  if (!stored || !stored.length) return fresh;

  // Merge: match by name+address (stable across ID changes) so user data
  // (repUsername, status, notes, log) survives any restructuring of static data.
  const storedByKey = new Map(stored.map(l => [`${l.name}|${l.address}`, l]));
  const merged = fresh.map(l => {
    const key = `${l.name}|${l.address}`;
    const s = storedByKey.get(key);
    if (!s) return l;
    // Use fresh id and city (both may have shifted); preserve all user-entered fields
    return { ...s, id: l.id, city: l.city };
  });

  // Persist the merged result immediately so new leads are saved going forward.
  try { localStorage.setItem(LEADS_KEY, JSON.stringify(merged)); } catch {}

  return merged;
}

function saveLeads(leads: StoredLead[]) {
  try { localStorage.setItem(LEADS_KEY, JSON.stringify(leads)); } catch {}
}

function openMaps(address: string) {
  const q = encodeURIComponent(address);
  window.open(`https://maps.apple.com/?q=${q}`, '_blank', 'noopener');
}

function fmtAppt(v: string) {
  if (!v) return 'No appointment set';
  const d = new Date(v);
  if (isNaN(d.getTime())) return 'No appointment set';
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function badgeStyle(status: string | null) {
  const def = STATUS_DEFS.find(s => s.key === status);
  if (!def) return { bg: 'transparent', color: '#5d6b64', label: 'Not logged' };
  return { bg: def.color + '2a', color: def.color, label: def.label };
}

// ── Shared styles ─────────────────────────────────────────────────────────────
const INPUT_S: React.CSSProperties = { width: '100%', background: '#182019', border: '1px solid #232d28', color: '#eef3f0', padding: '10px 12px', borderRadius: 9, fontSize: 13.5, fontFamily: "'Inter', sans-serif" };
const LABEL_S: React.CSSProperties = { fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5d6b64', margin: '20px 0 8px', fontWeight: 600, display: 'block' };
const BTN_GREEN: React.CSSProperties = { flex: 1, textAlign: 'center', background: '#121815', border: '1px solid #5f8577', color: '#8abfb0', padding: '9px 14px', borderRadius: 8, fontSize: 13, fontFamily: "'Inter',sans-serif", fontWeight: 500, cursor: 'pointer' };
const BTN_GREY: React.CSSProperties = { ...BTN_GREEN, border: '1px solid #232d28', color: '#9caea5' };

// ── Lead detail panel ─────────────────────────────────────────────────────────
interface PanelProps {
  lead: StoredLead;
  isAdmin: boolean;
  repOptions: Account[];
  session: Account;
  onClose: () => void;
  onSave: (updated: StoredLead) => void;
}

function fmtLog(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' · ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function LeadPanel({ lead, isAdmin, repOptions, session, onClose, onSave }: PanelProps) {
  const [draftPhone, setDraftPhone] = useState(lead.phone || '');
  const [draftAppt, setDraftAppt] = useState(lead.appointment || '');
  const [draftNotes, setDraftNotes] = useState(lead.notes || '');
  const [draftStatus, setDraftStatus] = useState<string | null>(lead.status);
  const [draftPhotos, setDraftPhotos] = useState<string[]>(lead.photos || []);
  const [draftRep, setDraftRep] = useState(lead.repUsername || '');

  function save() {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      status: draftStatus,
      notes: draftNotes.trim(),
      byUsername: session.username,
      byName: session.name,
    };
    const prevLog = lead.log || [];
    onSave({ ...lead, phone: draftPhone, appointment: draftAppt, notes: draftNotes, status: draftStatus, photos: draftPhotos, repUsername: draftRep, repOverridden: draftRep !== lead.repUsername ? true : lead.repOverridden, log: [...prevLog, entry] });
    onClose();
  }

  function addPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setDraftPhotos(p => [...p, ev.target!.result as string]);
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(4,7,6,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 50 }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: '#121815', border: '1px solid #324038', borderRadius: 14, width: '100%', maxWidth: 460, padding: 22, maxHeight: '88vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <div>
            <div style={{ fontSize: 11, color: '#8abfb0', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>{repOptions.find(r => r.username === draftRep)?.name || draftRep}</div>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 24, fontWeight: 600, margin: '2px 0' }}>
              {lead.name}{lead.fromList && <span style={{ marginLeft: 8, fontSize: 13, fontWeight: 600, color: '#7aacb8', fontFamily: "'Inter',sans-serif", verticalAlign: 'middle' }}>(BE Install)</span>}
            </div>
            <div onClick={e => { e.stopPropagation(); openMaps(lead.address); }} style={{ fontSize: 13.5, color: '#9caea5', cursor: 'pointer', textDecoration: 'underline', textDecorationColor: 'rgba(155,217,189,0.4)' }}>{lead.address}</div>
            {lead.category && <div style={{ marginTop: 6, fontSize: 11, color: lead.category.startsWith('TARGET') ? '#dcb45c' : lead.category === 'Recent HVAC permit' ? '#6fae8f' : '#7d8883', fontWeight: 600, letterSpacing: '0.05em' }}>📋 {lead.category}</div>}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#5d6b64', fontSize: 18, cursor: 'pointer', lineHeight: 1, padding: 4 }}>✕</button>
        </div>

        {isAdmin && (
          <>
            <label style={LABEL_S}>Assign to rep</label>
            <select value={draftRep} onChange={e => setDraftRep(e.target.value)} style={INPUT_S}>
              {repOptions.map(r => <option key={r.username} value={r.username}>{r.name}</option>)}
            </select>
          </>
        )}

        <label style={LABEL_S}>Phone</label>
        <input type="text" value={draftPhone} onChange={e => setDraftPhone(e.target.value)} placeholder="(555) 555-5555" style={INPUT_S} />
        {draftPhone.trim() && (
          <div style={{ display: 'flex', gap: 8, marginTop: 6, marginBottom: 4 }}>
            <a href={`tel:${draftPhone.replace(/\D/g, '')}`} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#182019', border: '1px solid #3a5c4a', color: '#8abfb0', padding: '9px 10px', borderRadius: 8, fontSize: 13, fontFamily: "'Inter',sans-serif", fontWeight: 600, textDecoration: 'none' }}>
              📞 Call
            </a>
            <a href={`sms:${draftPhone.replace(/\D/g, '')}`} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#182019', border: '1px solid #3a5c4a', color: '#8abfb0', padding: '9px 10px', borderRadius: 8, fontSize: 13, fontFamily: "'Inter',sans-serif", fontWeight: 600, textDecoration: 'none' }}>
              💬 Text
            </a>
          </div>
        )}

        <label style={LABEL_S}>Appointment</label>
        <input type="datetime-local" value={draftAppt} onChange={e => setDraftAppt(e.target.value)} style={INPUT_S} />

        <label style={LABEL_S}>Status</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {STATUS_DEFS.map(s => {
            const selected = draftStatus === s.key;
            return (
              <div key={s.key} onClick={() => setDraftStatus(prev => prev === s.key ? null : s.key)} style={{ border: `1px solid ${selected ? s.color : '#232d28'}`, background: selected ? s.color + '2a' : '#182019', color: selected ? s.color : '#9caea5', padding: '12px 10px', borderRadius: 9, fontSize: 13, fontWeight: 500, fontFamily: "'Inter',sans-serif", cursor: 'pointer', textAlign: 'center' }}>{s.label}</div>
            );
          })}
        </div>

        <label style={LABEL_S}>Notes / history</label>
        <textarea value={draftNotes} onChange={e => setDraftNotes(e.target.value)} placeholder="What happened at the door…" style={{ ...INPUT_S, minHeight: 80, resize: 'vertical' }} />

        <label style={LABEL_S}>Photos</label>
        {draftPhotos.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
            {draftPhotos.map((src, i) => <img key={i} src={src} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, border: '1px solid #232d28' }} />)}
          </div>
        )}
        <label style={{ display: 'inline-flex', alignItems: 'center', background: '#121815', border: '1px solid #232d28', color: '#9caea5', padding: '9px 14px', borderRadius: 8, fontSize: 13, fontFamily: "'Inter',sans-serif", fontWeight: 500, cursor: 'pointer' }}>
          Upload photo
          <input type="file" accept="image/*" onChange={addPhoto} style={{ display: 'none' }} />
        </label>

        <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
          <button onClick={save} style={BTN_GREEN}>Save</button>
          <button onClick={() => { setDraftStatus(null); setDraftNotes(''); }} style={BTN_GREY}>Clear status</button>
        </div>

        {(lead.log && lead.log.length > 0) && (
          <>
            <div style={{ ...LABEL_S, marginTop: 22 }}>Activity log</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative' }}>
              {/* vertical line */}
              <div style={{ position: 'absolute', left: 7, top: 8, bottom: 8, width: 1, background: '#232d28' }} />
              {[...lead.log].reverse().map((entry, i) => {
                const sd = STATUS_DEFS.find(s => s.key === entry.status);
                return (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '16px 1fr', gap: 10, paddingBottom: 14, position: 'relative' }}>
                    {/* dot */}
                    <div style={{ width: 15, height: 15, borderRadius: '50%', background: sd ? sd.color : '#232d28', border: '2px solid #121815', marginTop: 1, flexShrink: 0, zIndex: 1 }} />
                    <div style={{ background: '#0e1410', border: '1px solid #1e2820', borderRadius: 9, padding: '9px 11px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 11.5, fontWeight: 700, color: sd ? sd.color : '#5d6b64', textTransform: 'uppercase', letterSpacing: '.05em' }}>
                          {sd ? sd.label : 'No status'}
                        </span>
                        <span style={{ fontSize: 10.5, color: '#4a5a52' }}>{fmtLog(entry.timestamp)}</span>
                      </div>
                      <div style={{ fontSize: 11, color: '#8abfb0', marginTop: 3 }}>{entry.byName}</div>
                      {entry.notes && <div style={{ fontSize: 12.5, color: '#9caea5', marginTop: 6, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{entry.notes}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Add lead form ─────────────────────────────────────────────────────────────
interface AddLeadProps { repOptions: Account[]; onClose: () => void; onAdd: (lead: StoredLead) => void; nextId: number; }

function AddLeadForm({ repOptions, onClose, onAdd, nextId }: AddLeadProps) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [rep, setRep] = useState(repOptions[0]?.username || '');
  const [appt, setAppt] = useState('');

  function submit() {
    if (!name.trim() || !address.trim()) return;
    onAdd({ id: nextId, name: name.trim(), address: address.trim(), phone: phone.trim(), repUsername: rep, status: null, notes: '', appointment: appt, photos: [] });
    onClose();
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(4,7,6,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 50 }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: '#121815', border: '1px solid #324038', borderRadius: 14, width: '100%', maxWidth: 460, padding: 22, maxHeight: '88vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 24, fontWeight: 600 }}>Add lead</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#5d6b64', fontSize: 18, cursor: 'pointer', lineHeight: 1, padding: 4 }}>✕</button>
        </div>
        <label style={LABEL_S}>Homeowner name</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Jane Homeowner" style={INPUT_S} />
        <label style={LABEL_S}>Address</label>
        <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="12345 Example St, Moreno Valley, CA" style={INPUT_S} />
        <label style={LABEL_S}>Phone</label>
        <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(555) 555-5555" style={INPUT_S} />
        <label style={LABEL_S}>Assign to rep</label>
        <select value={rep} onChange={e => setRep(e.target.value)} style={INPUT_S}>
          {repOptions.map(r => <option key={r.username} value={r.username}>{r.name}</option>)}
        </select>
        <label style={LABEL_S}>Appointment (optional)</label>
        <input type="datetime-local" value={appt} onChange={e => setAppt(e.target.value)} style={INPUT_S} />
        <button onClick={submit} style={{ width: '100%', marginTop: 20, background: '#121815', border: '1px solid #5f8577', color: '#8abfb0', padding: '11px 14px', borderRadius: 8, fontSize: 13.5, fontFamily: "'Inter',sans-serif", fontWeight: 600, cursor: 'pointer' }}>Add lead</button>
      </div>
    </div>
  );
}

// ── Manage closers panel ──────────────────────────────────────────────────────
interface ClosersPanelProps { accounts: Account[]; leads: StoredLead[]; onClose: () => void; onUpdate: (accounts: Account[]) => void; }

function ClosersPanel({ accounts, leads, onClose, onUpdate }: ClosersPanelProps) {
  const [newName, setNewName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [err, setErr] = useState('');

  const reps = accounts.filter(a => a.role === 'rep');

  function addRep() {
    if (!newName.trim() || !newUsername.trim() || !newPassword.trim()) { setErr('Fill in name, username, and password.'); return; }
    if (accounts.some(a => a.username === newUsername.trim())) { setErr('That username is already taken.'); return; }
    const updated = [...accounts, { username: newUsername.trim(), password: newPassword.trim(), role: 'rep' as const, name: newName.trim() }];
    onUpdate(updated);
    saveRepsToStorage(updated);
    setNewName(''); setNewUsername(''); setNewPassword(''); setErr('');
  }

  function removeRep(username: string) {
    const updated = accounts.filter(a => a.username !== username);
    onUpdate(updated);
    saveRepsToStorage(updated);
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(4,7,6,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 50 }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: '#121815', border: '1px solid #324038', borderRadius: 14, width: '100%', maxWidth: 460, padding: 22, maxHeight: '88vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 24, fontWeight: 600 }}>Closers</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#5d6b64', fontSize: 18, cursor: 'pointer', lineHeight: 1, padding: 4 }}>✕</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
          {reps.map(r => (
            <div key={r.username} style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 10, background: '#182019', border: '1px solid #232d28', borderRadius: 9, padding: '10px 12px' }}>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 500, color: '#eef3f0' }}>{r.name}</div>
                <div style={{ fontSize: 11.5, color: '#9caea5', marginTop: 2 }}>{r.username} · {leads.filter(l => l.repUsername === r.username).length} leads</div>
              </div>
              <button onClick={() => removeRep(r.username)} style={{ background: 'none', border: '1px solid #232d28', color: '#a15a5a', padding: '6px 10px', borderRadius: 7, fontSize: 12, fontFamily: "'Inter',sans-serif", cursor: 'pointer' }}>Remove</button>
            </div>
          ))}
        </div>
        <div style={{ ...LABEL_S, marginTop: 4 }}>Add a closer</div>
        <label style={LABEL_S}>Name</label>
        <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Jane Closer" style={INPUT_S} />
        <label style={LABEL_S}>Username</label>
        <input type="text" value={newUsername} onChange={e => setNewUsername(e.target.value)} placeholder="jcloser" style={INPUT_S} />
        <label style={LABEL_S}>Password</label>
        <input type="text" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="sales123" style={INPUT_S} />
        {err && <div style={{ color: '#a15a5a', fontSize: 12.5, marginTop: 10 }}>{err}</div>}
        <button onClick={addRep} style={{ width: '100%', marginTop: 16, background: '#121815', border: '1px solid #5f8577', color: '#8abfb0', padding: '11px 14px', borderRadius: 8, fontSize: 13.5, fontFamily: "'Inter',sans-serif", fontWeight: 600, cursor: 'pointer' }}>Add closer</button>
      </div>
    </div>
  );
}

// ── Main portal page ──────────────────────────────────────────────────────────
export default function SalesRepPortal() {
  const [, navigate] = useLocation();
  const [session, setSession] = useState<Account | null>(null);
  const [accounts, setAccounts] = useState<Account[]>(loadAccounts);
  const [leads, setLeads] = useState<StoredLead[]>(loadLeads);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [repFilter, setRepFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [panelLeadId, setPanelLeadId] = useState<number | null>(null);
  const [addFormOpen, setAddFormOpen] = useState(false);
  const [repsPanelOpen, setRepsPanelOpen] = useState(false);
  const [expandedRepCities, setExpandedRepCities] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const username = JSON.parse(raw);
        const acc = accounts.find(a => a.username === username);
        if (acc) setSession(acc);
      }
    } catch {}
  }, []);

  function persistLeads(next: StoredLead[]) { setLeads(next); saveLeads(next); }

  function login() {
    const u = loginUsername.trim();
    const acc = accounts.find(a => a.username === u && a.password === loginPassword);
    if (!acc) { setLoginError('Incorrect username or password.'); return; }
    setSession(acc); setLoginError('');
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(acc.username)); } catch {}
  }

  function logout() {
    setSession(null);
    try { localStorage.removeItem(SESSION_KEY); } catch {}
  }

  const isAdmin = !!session && session.role === 'admin';
  const repOptions = accounts.filter(a => a.role === 'rep' || a.isCloser);

  // For reps/closers: show all leads in cities they've been assigned to
  const scopedLeads = isAdmin ? leads : (() => {
    const cityAssignments = loadCityAssignments();
    const myCities = new Set(
      Object.entries(cityAssignments)
        .filter(([, users]) => users.includes(session?.username || ''))
        .map(([city]) => city)
    );
    return leads.filter(l => l.city && myCities.has(l.city));
  })();

  const repFiltered = isAdmin && repFilter !== 'all' ? scopedLeads.filter(l => l.repUsername === repFilter) : scopedLeads;
  const statusFiltered = statusFilter === 'all' ? repFiltered : repFiltered.filter(l => (l.status || 'none') === statusFilter);
  const term = searchTerm.trim().toLowerCase();
  const visibleLeads = !term ? statusFiltered : statusFiltered.filter(l => l.name.toLowerCase().includes(term) || l.address.toLowerCase().includes(term));

  const countBase = isAdmin ? repFiltered : scopedLeads;
  const counts: Record<string, number> = { nothome: 0, interested: 0, callback: 0, closed: 0, dq: 0, none: 0 };
  countBase.forEach(l => { const k = l.status || 'none'; counts[k] = (counts[k] || 0) + 1; });

  const statCards = [
    { key: 'all', label: 'All leads', num: countBase.length, borderColor: statusFilter === 'all' ? '#8abfb0' : '#232d28', onClick: () => setStatusFilter('all') },
    ...STATUS_DEFS.map(s => ({ key: s.key, label: s.label, num: counts[s.key] || 0, borderColor: statusFilter === s.key ? '#8abfb0' : '#232d28', onClick: () => setStatusFilter(prev => prev === s.key ? 'all' : s.key) })),
  ];

  const logged = countBase.length - (counts.none || 0);
  const pct = countBase.length ? Math.round((logged / countBase.length) * 100) : 0;
  const panelLead = leads.find(l => l.id === panelLeadId) || null;
  const nextId = leads.reduce((m, l) => Math.max(m, l.id), 0) + 1;

  // ── Login screen ──────────────────────────────────────────────────────────
  if (!session) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0e0d', color: '#eef3f0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: "'Inter', sans-serif" }}>
        <div style={{ width: '100%', maxWidth: 360, background: '#121815', border: '1px solid #232d28', borderRadius: 14, padding: '32px 28px' }}>
          <p style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8abfb0', fontWeight: 600, margin: '0 0 6px' }}>Riv Comfort · Field Sales</p>
          <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 30, margin: '0 0 22px', color: '#eef3f0' }}>Sign in</h1>
          <div style={{ ...LABEL_S, marginTop: 0 }}>Username</div>
          <input type="text" value={loginUsername} onChange={e => setLoginUsername(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} placeholder="e.g. jmartinez" style={{ ...INPUT_S, marginBottom: 16 }} />
          <div style={LABEL_S}>Password</div>
          <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} placeholder="••••••••" style={{ ...INPUT_S, marginBottom: 8 }} />
          {loginError && <div style={{ color: '#a15a5a', fontSize: 12.5, marginBottom: 10 }}>{loginError}</div>}
          <button onClick={login} style={{ width: '100%', marginTop: 8, background: '#182019', border: '1px solid #5f8577', color: '#8abfb0', padding: '12px 14px', borderRadius: 9, fontSize: 14, fontFamily: "'Inter',sans-serif", fontWeight: 600, cursor: 'pointer' }}>Log in</button>
        </div>
      </div>
    );
  }

  // ── Logged in ─────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#0a0e0d', color: '#eef3f0', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: 1040, margin: '0 auto', padding: '28px 20px 80px' }}>

        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, paddingBottom: 20, borderBottom: '1px solid #232d28', marginBottom: 20 }}>
          <div>
            <p style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8abfb0', fontWeight: 600, margin: '0 0 6px' }}>Riv Comfort · Field Sales</p>
            <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 34, letterSpacing: '0.01em', margin: 0, color: '#eef3f0' }}>{isAdmin ? 'Lead assignment' : 'My leads'}</h1>
            <p style={{ color: '#9caea5', fontSize: 14, marginTop: 6 }}>{isAdmin ? 'Assign leads to reps and track status across the field.' : 'Leads assigned to you — tap a house to log a visit.'}</p>
          </div>
          <div style={{ textAlign: 'right', color: '#9caea5', fontSize: 13, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div>
              <span style={{ display: 'block', fontFamily: "'Barlow Condensed',sans-serif", fontSize: 20, fontWeight: 600, color: '#eef3f0', lineHeight: 1.1 }}>{session.name}</span>
              {session.role === 'admin' ? 'Admin' : 'Sales Rep'}
            </div>
            <button onClick={() => navigate('/')} style={BTN_GREY}>HVAC guide</button>
            {isAdmin && <button onClick={() => navigate('/leads')} style={BTN_GREY}>Leads by city</button>}
            <button onClick={logout} style={BTN_GREY}>Log out</button>
          </div>
        </header>

        {/* Admin view */}
        {isAdmin && (
          <div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              <select value={repFilter} onChange={e => setRepFilter(e.target.value)} style={{ background: '#121815', border: '1px solid #232d28', color: '#eef3f0', padding: '9px 12px', borderRadius: 8, fontSize: 13, fontFamily: "'Inter',sans-serif" }}>
                <option value="all">All reps</option>
                {repOptions.map(r => <option key={r.username} value={r.username}>{r.name}</option>)}
              </select>
              <input type="text" placeholder="Search name or address…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ flex: 1, minWidth: 180, background: '#121815', border: '1px solid #232d28', color: '#eef3f0', padding: '9px 12px', borderRadius: 8, fontSize: 14, fontFamily: "'Inter',sans-serif" }} />
              <button onClick={() => setAddFormOpen(true)} style={{ ...BTN_GREEN, flex: 'none' }}>+ Add lead</button>
              <button onClick={() => setRepsPanelOpen(true)} style={{ ...BTN_GREY, flex: 'none' }}>Manage closers</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(96px,1fr))', gap: 10, marginBottom: 20 }}>
              {statCards.map(card => (
                <div key={card.key} onClick={card.onClick} style={{ background: '#121815', border: `1px solid ${card.borderColor}`, borderRadius: 10, padding: '12px 14px', cursor: 'pointer' }}>
                  <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 24, fontWeight: 600, lineHeight: 1 }}>{card.num}</div>
                  <div style={{ fontSize: 11, color: '#9caea5', textTransform: 'uppercase', letterSpacing: '.06em', marginTop: 4 }}>{card.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {visibleLeads.map(lead => {
                const bs = badgeStyle(lead.status);
                const rep = accounts.find(a => a.username === lead.repUsername);
                return (
                  <div key={lead.id} onClick={() => setPanelLeadId(lead.id)} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', alignItems: 'center', gap: 14, background: '#121815', border: '1px solid #232d28', borderRadius: 10, padding: '12px 14px', cursor: 'pointer' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: '#eef3f0' }}>{lead.name}{lead.fromList && <span style={{ marginLeft: 7, fontSize: 11, fontWeight: 600, color: '#7aacb8' }}>(BE Install)</span>}</div>
                      <div onClick={e => { e.stopPropagation(); openMaps(lead.address); }} style={{ fontSize: 12.5, color: '#9caea5', marginTop: 2, cursor: 'pointer', textDecoration: 'underline', textDecorationColor: 'rgba(155,217,189,0.4)' }}>{lead.address}</div>
                      <div style={{ fontSize: 11, color: '#5d6b64', marginTop: 2 }}>{rep?.name || lead.repUsername} · {fmtAppt(lead.appointment)}{lead.category ? ` · ${lead.category}` : ''}</div>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 600, padding: '5px 10px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '.04em', whiteSpace: 'nowrap', background: bs.bg, color: bs.color }}>{bs.label}</div>
                  </div>
                );
              })}
            </div>
            {visibleLeads.length === 0 && <div style={{ textAlign: 'center', padding: '50px 20px', color: '#5d6b64', fontSize: 14 }}>No leads match your search or filter.</div>}
          </div>
        )}

        {/* Rep view */}
        {!isAdmin && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
              <div style={{ flex: 1, height: 6, borderRadius: 3, background: '#182019', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: '#8abfb0', borderRadius: 3, width: pct + '%' }} />
              </div>
              <span style={{ fontSize: 12, color: '#9caea5', whiteSpace: 'nowrap' }}>{pct}% complete</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(96px,1fr))', gap: 10, marginBottom: 20 }}>
              {statCards.map(card => (
                <div key={card.key} onClick={card.onClick} style={{ background: '#121815', border: `1px solid ${card.borderColor}`, borderRadius: 10, padding: '12px 14px', cursor: 'pointer' }}>
                  <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 24, fontWeight: 600, lineHeight: 1 }}>{card.num}</div>
                  <div style={{ fontSize: 11, color: '#9caea5', textTransform: 'uppercase', letterSpacing: '.06em', marginTop: 4 }}>{card.label}</div>
                </div>
              ))}
            </div>
            {(() => {
              // Group visible leads by city
              const cityOrder: string[] = [];
              const byCity: Record<string, StoredLead[]> = {};
              visibleLeads.forEach(lead => {
                const c = lead.city ? normalizeCity(lead.city) : 'Uncategorized';
                if (!byCity[c]) { byCity[c] = []; cityOrder.push(c); }
                byCity[c].push(lead);
              });

              if (cityOrder.length === 0) return <div style={{ textAlign: 'center', padding: '50px 20px', color: '#5d6b64', fontSize: 14 }}>No stops match your filter.</div>;

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {cityOrder.map(city => {
                    const cityLeads = byCity[city];
                    const logged = cityLeads.filter(l => l.status && l.status !== 'none').length;
                    const isOpen = expandedRepCities.has(city);
                    return (
                      <div key={city} style={{ border: '1px solid #232d28', borderRadius: 10, background: '#121815' }}>
                        <div
                          onClick={() => setExpandedRepCities(prev => {
                            const next = new Set(prev);
                            next.has(city) ? next.delete(city) : next.add(city);
                            return next;
                          })}
                          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', cursor: 'pointer' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 12, color: '#5d6b64', transition: 'transform .12s', transform: isOpen ? 'rotate(90deg)' : 'none', display: 'inline-block' }}>▶</span>
                            <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 20, fontWeight: 600, color: '#eef3f0' }}>{city}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: 12, color: '#9caea5' }}>{cityLeads.length} stops</span>
                            <span style={{ fontSize: 11, color: logged === cityLeads.length ? '#6fae8f' : '#5d6b64', fontWeight: 600 }}>{logged}/{cityLeads.length} logged</span>
                          </div>
                        </div>
                        {isOpen && (
                          <div style={{ padding: '0 12px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {cityLeads.map(lead => {
                              const bs = badgeStyle(lead.status);
                              return (
                                <div key={lead.id} onClick={() => setPanelLeadId(lead.id)} style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 14, background: '#182019', border: '1px solid #232d28', borderRadius: 9, padding: '12px 14px', cursor: 'pointer' }}>
                                  <div>
                                    <div style={{ fontSize: 14, fontWeight: 500, color: '#eef3f0' }}>{lead.name}{lead.fromList && <span style={{ marginLeft: 7, fontSize: 11, fontWeight: 600, color: '#7aacb8' }}>(BE Install)</span>}</div>
                                    <div onClick={e => { e.stopPropagation(); openMaps(lead.address); }} style={{ fontSize: 12.5, color: '#9caea5', marginTop: 2, cursor: 'pointer', textDecoration: 'underline', textDecorationColor: 'rgba(155,217,189,0.4)' }}>{lead.address}</div>
                                    <div style={{ fontSize: 11, color: '#5d6b64', marginTop: 2 }}>{fmtAppt(lead.appointment)}{lead.category ? ` · ${lead.category}` : ''}</div>
                                  </div>
                                  <div style={{ fontSize: 11, fontWeight: 600, padding: '5px 10px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '.04em', whiteSpace: 'nowrap', background: bs.bg, color: bs.color }}>{bs.label}</div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Panels */}
      {panelLead && (
        <LeadPanel lead={panelLead} isAdmin={isAdmin} repOptions={repOptions} session={session!} onClose={() => setPanelLeadId(null)}
          onSave={updated => persistLeads(leads.map(l => l.id === updated.id ? updated : l))}
        />
      )}
      {addFormOpen && (
        <AddLeadForm repOptions={repOptions} onClose={() => setAddFormOpen(false)} nextId={nextId}
          onAdd={lead => persistLeads([...leads, lead])}
        />
      )}
      {repsPanelOpen && (
        <ClosersPanel accounts={accounts} leads={leads} onClose={() => setRepsPanelOpen(false)}
          onUpdate={updated => { setAccounts(updated); }}
        />
      )}
    </div>
  );
}
