import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'wouter';
import {
  Account, StoredLead, LogEntry, LeadType, STATUS_DEFS,
  DEFAULT_ACCOUNTS, LEADS_KEY, SESSION_KEY, REPS_KEY, CITY_ASSIGN_KEY,
} from '@/data/accounts';
import { LEADS_BY_CITY } from '@/data/leads';
import RepCalendar from '@/components/RepCalendar';
import { RepTracker, AdminTrackerDashboard } from '@/components/DailyTracker';

// ── Helpers ───────────────────────────────────────────────────────────────────
function normalizeCity(city: string): string {
  return city.trim().replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

function loadCityAssignments(): Record<string, string[]> {
  try {
    const r = localStorage.getItem(CITY_ASSIGN_KEY);
    if (r) {
      const parsed = JSON.parse(r);
      const out: Record<string, string[]> = {};
      for (const [city, val] of Object.entries(parsed)) {
        const key = normalizeCity(city);
        const arr = Array.isArray(val) ? (val as string[]) : val ? [val as string] : [];
        if (arr.length) out[key] = [...(out[key] || []), ...arr];
      }
      localStorage.setItem(CITY_ASSIGN_KEY, JSON.stringify(out));
      return out;
    }
  } catch {}
  return {};
}

function buildStaticLeads(): StoredLead[] {
  let id = 1;
  const out: StoredLead[] = [];
  LEADS_BY_CITY.forEach(block => {
    block.leads.forEach(l => {
      out.push({
        id: id++, name: l.name, address: l.address,
        city: normalizeCity(block.city), phone: (l as any).phone || '',
        category: l.category || '', repUsername: '', status: null,
        notes: '', appointment: '', photos: [], fromList: true, leadType: 'be',
      });
    });
  });
  return out;
}

function loadLeads(): StoredLead[] {
  const fresh = buildStaticLeads();
  let stored: StoredLead[] | null = null;
  try { const r = localStorage.getItem(LEADS_KEY); if (r) stored = JSON.parse(r); } catch {}

  if (!stored || !stored.length) return fresh;

  const freshKeySet = new Set(fresh.map(l => `${l.name}|${l.address}`));
  const storedByKey = new Map(stored.map(l => [`${l.name}|${l.address}`, l]));

  // Merge static leads (preserve user data, use fresh id+city)
  const merged = fresh.map(l => {
    const s = storedByKey.get(`${l.name}|${l.address}`);
    if (!s) return l;
    return { ...s, id: l.id, city: l.city, leadType: (s.leadType || 'be') as LeadType };
  });

  // Keep non-static leads (funnel, personal) — these aren't in fresh
  const extras = stored.filter(l => !freshKeySet.has(`${l.name}|${l.address}`));

  const all = [...merged, ...extras];
  try { localStorage.setItem(LEADS_KEY, JSON.stringify(all)); } catch {}
  return all;
}

function saveLeads(leads: StoredLead[]) {
  try { localStorage.setItem(LEADS_KEY, JSON.stringify(leads)); } catch {}
}

function loadAccounts(): Account[] {
  const admins = DEFAULT_ACCOUNTS.filter(a => a.role === 'admin');
  try {
    const r = localStorage.getItem(REPS_KEY);
    if (r) { const reps = JSON.parse(r); if (Array.isArray(reps) && reps.length) return [...admins, ...reps]; }
  } catch {}
  return DEFAULT_ACCOUNTS.slice();
}

function saveReps(accounts: Account[]) {
  try { localStorage.setItem(REPS_KEY, JSON.stringify(accounts.filter(a => a.role === 'rep'))); } catch {}
}

function openMaps(address: string) {
  window.open(`https://maps.apple.com/?q=${encodeURIComponent(address)}`, '_blank', 'noopener');
}

function fmtAppt(v: string) {
  if (!v) return '';
  const d = new Date(v);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function fmtLog(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    + ' · ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function badgeStyle(status: string | null) {
  const def = STATUS_DEFS.find(s => s.key === status);
  if (!def) return { bg: 'transparent', color: '#5d6b64', label: 'Not logged' };
  return { bg: def.color + '2a', color: def.color, label: def.label };
}

function parseCSV(text: string): { name: string; address: string; phone: string; notes: string }[] {
  const lines = text.trim().split('\n').filter(Boolean);
  if (!lines.length) return [];
  const first = lines[0].toLowerCase();
  const hasHeader = first.includes('name') || first.includes('address') || first.includes('phone');
  const data = hasHeader ? lines.slice(1) : lines;
  return data.map(line => {
    const cols = parseCSVLine(line);
    return { name: cols[0]?.trim() || '', address: cols[1]?.trim() || '', phone: cols[2]?.trim() || '', notes: cols[3]?.trim() || '' };
  }).filter(r => r.name || r.address);
}

function parseCSVLine(line: string): string[] {
  const out: string[] = []; let cur = ''; let inQ = false;
  for (const c of line) {
    if (c === '"') { inQ = !inQ; continue; }
    if (c === ',' && !inQ) { out.push(cur); cur = ''; continue; }
    cur += c;
  }
  out.push(cur);
  return out;
}

// ── Shared styles ─────────────────────────────────────────────────────────────
const INPUT_S: React.CSSProperties = { width: '100%', background: '#182019', border: '1px solid #232d28', color: '#eef3f0', padding: '10px 12px', borderRadius: 9, fontSize: 13.5, fontFamily: "'Inter', sans-serif", boxSizing: 'border-box' };
const LABEL_S: React.CSSProperties = { fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5d6b64', margin: '16px 0 7px', fontWeight: 600, display: 'block' };
const BTN_G: React.CSSProperties = { textAlign: 'center', background: '#121815', border: '1px solid #5f8577', color: '#8abfb0', padding: '9px 14px', borderRadius: 8, fontSize: 13, fontFamily: "'Inter',sans-serif", fontWeight: 500, cursor: 'pointer' };
const BTN_GR: React.CSSProperties = { ...BTN_G, border: '1px solid #232d28', color: '#9caea5' };

// ── Lead Panel ────────────────────────────────────────────────────────────────
function LeadPanel({ lead, isAdmin, repOptions, session, onClose, onSave }: {
  lead: StoredLead; isAdmin: boolean; repOptions: Account[]; session: Account;
  onClose: () => void; onSave: (l: StoredLead) => void;
}) {
  const [phone, setPhone] = useState(lead.phone || '');
  const [appt, setAppt] = useState(lead.appointment || '');
  const [notes, setNotes] = useState(lead.notes || '');
  const [status, setStatus] = useState<string | null>(lead.status);
  const [photos, setPhotos] = useState<string[]>(lead.photos || []);
  const [rep, setRep] = useState(lead.repUsername || '');

  function save() {
    const entry: LogEntry = { timestamp: new Date().toISOString(), status, notes: notes.trim(), byUsername: session.username, byName: session.name };
    onSave({ ...lead, phone, appointment: appt, notes, status, photos, repUsername: rep, log: [...(lead.log || []), entry] });
    onClose();
  }

  const sectionLabel = lead.leadType === 'funnel' ? 'Funnel' : lead.leadType === 'personal' ? 'My Solar' : 'Better Earth';
  const sectionColor = lead.leadType === 'funnel' ? '#d08a52' : lead.leadType === 'personal' ? '#8abfb0' : '#7aacb8';

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(4,7,6,.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 50 }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: '#121815', border: '1px solid #324038', borderRadius: 14, width: '100%', maxWidth: 460, padding: 22, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 10, fontWeight: 700, background: sectionColor + '20', color: sectionColor, padding: '3px 8px', borderRadius: 10, textTransform: 'uppercase', letterSpacing: '.06em' }}>{sectionLabel}</span>
              {lead.city && <span style={{ fontSize: 11, color: '#5d6b64' }}>{lead.city}</span>}
            </div>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 24, fontWeight: 600, lineHeight: 1.1 }}>{lead.name}</div>
            <div onClick={e => { e.stopPropagation(); openMaps(lead.address); }} style={{ fontSize: 13, color: '#9caea5', marginTop: 3, cursor: 'pointer', textDecoration: 'underline', textDecorationColor: 'rgba(155,217,189,0.3)' }}>{lead.address}</div>
            {lead.category && <div style={{ fontSize: 11, color: '#7d8883', marginTop: 4, fontWeight: 600 }}>📋 {lead.category}</div>}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#5d6b64', fontSize: 18, cursor: 'pointer', padding: 4, lineHeight: 1 }}>✕</button>
        </div>

        {isAdmin && (
          <>
            <label style={LABEL_S}>Assign to rep</label>
            <select value={rep} onChange={e => setRep(e.target.value)} style={INPUT_S}>
              <option value="">— unassigned —</option>
              {repOptions.map(r => <option key={r.username} value={r.username}>{r.name}</option>)}
            </select>
          </>
        )}

        <label style={LABEL_S}>Phone</label>
        <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(555) 555-5555" style={INPUT_S} />
        {phone.trim() && (
          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            <a href={`tel:${phone.replace(/\D/g,'')}`} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#182019', border: '1px solid #3a5c4a', color: '#8abfb0', padding: '9px', borderRadius: 8, fontSize: 13, fontFamily: "'Inter',sans-serif", fontWeight: 600, textDecoration: 'none' }}>📞 Call</a>
            <a href={`sms:${phone.replace(/\D/g,'')}`} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#182019', border: '1px solid #3a5c4a', color: '#8abfb0', padding: '9px', borderRadius: 8, fontSize: 13, fontFamily: "'Inter',sans-serif", fontWeight: 600, textDecoration: 'none' }}>💬 Text</a>
          </div>
        )}

        <label style={LABEL_S}>Appointment</label>
        <input type="datetime-local" value={appt} onChange={e => setAppt(e.target.value)} style={INPUT_S} />

        <label style={LABEL_S}>Status</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {STATUS_DEFS.map(s => {
            const sel = status === s.key;
            return <div key={s.key} onClick={() => setStatus(p => p === s.key ? null : s.key)} style={{ border: `1px solid ${sel ? s.color : '#232d28'}`, background: sel ? s.color + '2a' : '#182019', color: sel ? s.color : '#9caea5', padding: '11px 8px', borderRadius: 9, fontSize: 13, fontWeight: 500, cursor: 'pointer', textAlign: 'center' }}>{s.label}</div>;
          })}
        </div>

        <label style={LABEL_S}>Notes</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="What happened at the door…" style={{ ...INPUT_S, minHeight: 80, resize: 'vertical' }} />

        <label style={LABEL_S}>Photos</label>
        {photos.length > 0 && <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>{photos.map((src, i) => <img key={i} src={src} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, border: '1px solid #232d28' }} />)}</div>}
        <label style={{ display: 'inline-flex', alignItems: 'center', background: '#121815', border: '1px solid #232d28', color: '#9caea5', padding: '9px 14px', borderRadius: 8, fontSize: 13, fontFamily: "'Inter',sans-serif", cursor: 'pointer' }}>
          Upload photo
          <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = ev => setPhotos(p => [...p, ev.target!.result as string]); r.readAsDataURL(f); e.target.value = ''; }} style={{ display: 'none' }} />
        </label>

        <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
          <button onClick={save} style={{ ...BTN_G, flex: 1 }}>Save</button>
          <button onClick={() => { setStatus(null); setNotes(''); }} style={{ ...BTN_GR, flex: 1 }}>Clear status</button>
        </div>

        {lead.log && lead.log.length > 0 && (
          <>
            <div style={{ ...LABEL_S, marginTop: 22 }}>Activity log</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative' }}>
              <div style={{ position: 'absolute', left: 7, top: 8, bottom: 8, width: 1, background: '#232d28' }} />
              {[...lead.log].reverse().map((entry, i) => {
                const sd = STATUS_DEFS.find(s => s.key === entry.status);
                return (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '16px 1fr', gap: 10, paddingBottom: 14, position: 'relative' }}>
                    <div style={{ width: 15, height: 15, borderRadius: '50%', background: sd ? sd.color : '#232d28', border: '2px solid #121815', marginTop: 1, zIndex: 1 }} />
                    <div style={{ background: '#0e1410', border: '1px solid #1e2820', borderRadius: 9, padding: '9px 11px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 11.5, fontWeight: 700, color: sd ? sd.color : '#5d6b64', textTransform: 'uppercase', letterSpacing: '.05em' }}>{sd ? sd.label : 'No status'}</span>
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

// ── Add Lead Form (admin: be/funnel; rep: personal) ───────────────────────────
function AddLeadForm({ type, repOptions, session, onClose, onAdd, nextId }: {
  type: LeadType; repOptions: Account[]; session: Account;
  onClose: () => void; onAdd: (l: StoredLead) => void; nextId: number;
}) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');
  const [appt, setAppt] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [repUser, setRepUser] = useState(repOptions[0]?.username || '');

  const titles: Record<LeadType, string> = { be: 'Add Better Earth Lead', funnel: 'Add Funnel Lead', personal: 'Add Solar Lead' };
  const colors: Record<LeadType, string> = { be: '#7aacb8', funnel: '#d08a52', personal: '#8abfb0' };

  function submit() {
    if (!name.trim()) return;
    const lead: StoredLead = {
      id: nextId, name: name.trim(), address: address.trim(),
      city: city.trim() ? normalizeCity(city.trim()) : undefined,
      phone: phone.trim(), repUsername: type === 'personal' ? session.username : repUser,
      status, notes: notes.trim(), appointment: appt, photos: [],
      fromList: type === 'be', leadType: type,
      log: notes.trim() ? [{ timestamp: new Date().toISOString(), status, notes: notes.trim(), byUsername: session.username, byName: session.name }] : [],
    };
    onAdd(lead);
    onClose();
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(4,7,6,.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 50 }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: '#121815', border: '1px solid #324038', borderRadius: 14, width: '100%', maxWidth: 460, padding: 22, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: colors[type], textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>{type === 'be' ? 'Better Earth' : type === 'funnel' ? 'Funnel' : 'My Solar'}</div>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 22, fontWeight: 600 }}>{titles[type]}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#5d6b64', fontSize: 18, cursor: 'pointer', padding: 4 }}>✕</button>
        </div>

        <label style={LABEL_S}>Homeowner name *</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Jane Homeowner" style={INPUT_S} />
        <label style={LABEL_S}>Address</label>
        <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="12345 Main St, City, CA" style={INPUT_S} />
        <label style={LABEL_S}>City</label>
        <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="Riverside" style={INPUT_S} />
        <label style={LABEL_S}>Phone</label>
        <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(555) 555-5555" style={INPUT_S} />

        {(type === 'be' || type === 'funnel') && (
          <>
            <label style={LABEL_S}>Assign to rep</label>
            <select value={repUser} onChange={e => setRepUser(e.target.value)} style={INPUT_S}>
              {repOptions.map(r => <option key={r.username} value={r.username}>{r.name}</option>)}
            </select>
          </>
        )}

        {type === 'personal' && (
          <>
            <label style={LABEL_S}>Status</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {STATUS_DEFS.map(s => {
                const sel = status === s.key;
                return <div key={s.key} onClick={() => setStatus(p => p === s.key ? null : s.key)} style={{ border: `1px solid ${sel ? s.color : '#232d28'}`, background: sel ? s.color + '2a' : '#182019', color: sel ? s.color : '#9caea5', padding: '10px 8px', borderRadius: 9, fontSize: 12.5, fontWeight: 500, cursor: 'pointer', textAlign: 'center' }}>{s.label}</div>;
              })}
            </div>
          </>
        )}

        <label style={LABEL_S}>Appointment (optional)</label>
        <input type="datetime-local" value={appt} onChange={e => setAppt(e.target.value)} style={INPUT_S} />
        <label style={LABEL_S}>Notes (optional)</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any notes…" style={{ ...INPUT_S, minHeight: 70, resize: 'vertical' }} />
        <button onClick={submit} disabled={!name.trim()} style={{ width: '100%', marginTop: 18, background: '#121815', border: `1px solid ${colors[type]}80`, color: colors[type], padding: '12px', borderRadius: 8, fontSize: 13.5, fontFamily: "'Inter',sans-serif", fontWeight: 600, cursor: 'pointer', opacity: !name.trim() ? 0.5 : 1 }}>Add lead</button>
      </div>
    </div>
  );
}

// ── CSV Upload (My Solar Leads) ───────────────────────────────────────────────
function CSVUpload({ session, onAdd, nextId, onClose }: { session: Account; onAdd: (leads: StoredLead[]) => void; nextId: number; onClose: () => void }) {
  const [preview, setPreview] = useState<{ name: string; address: string; phone: string; notes: string }[]>([]);
  const [error, setError] = useState('');

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    setError('');
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const text = ev.target?.result as string;
      const rows = parseCSV(text);
      if (!rows.length) { setError('No valid rows found. Expected columns: Name, Address, Phone, Notes'); return; }
      setPreview(rows);
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function importAll() {
    const leads: StoredLead[] = preview.map((row, i) => ({
      id: nextId + i, name: row.name, address: row.address,
      city: row.address ? normalizeCity(row.address.split(',').slice(-2, -1)[0]?.trim() || '') : undefined,
      phone: row.phone, repUsername: session.username, status: null,
      notes: row.notes, appointment: '', photos: [], leadType: 'personal',
    }));
    onAdd(leads);
    onClose();
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(4,7,6,.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 50 }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: '#121815', border: '1px solid #324038', borderRadius: 14, width: '100%', maxWidth: 500, padding: 22, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 22, fontWeight: 600 }}>Upload CSV</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#5d6b64', fontSize: 18, cursor: 'pointer', padding: 4 }}>✕</button>
        </div>
        <div style={{ fontSize: 12.5, color: '#5d6b64', marginBottom: 14, lineHeight: 1.6 }}>
          CSV format: <code style={{ background: '#0e1410', padding: '2px 6px', borderRadius: 4, color: '#9caea5' }}>Name, Address, Phone, Notes</code><br />
          First row can be a header — it'll be skipped automatically.
        </div>
        {!preview.length ? (
          <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed #232d28', borderRadius: 10, padding: '32px 20px', cursor: 'pointer', gap: 8 }}>
            <div style={{ fontSize: 28 }}>📄</div>
            <div style={{ fontSize: 13, color: '#9caea5', fontWeight: 500 }}>Tap to select a CSV file</div>
            <input type="file" accept=".csv,text/csv" onChange={handleFile} style={{ display: 'none' }} />
          </label>
        ) : (
          <>
            <div style={{ fontSize: 12, color: '#8abfb0', marginBottom: 10, fontWeight: 600 }}>{preview.length} leads ready to import</div>
            <div style={{ maxHeight: 240, overflowY: 'auto', border: '1px solid #1e2820', borderRadius: 9, marginBottom: 16 }}>
              {preview.map((row, i) => (
                <div key={i} style={{ padding: '8px 12px', borderBottom: '1px solid #1a2220', display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#eef3f0' }}>{row.name || '—'}</div>
                  <div style={{ fontSize: 11.5, color: '#9caea5' }}>{row.address} {row.phone ? `· ${row.phone}` : ''}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={importAll} style={{ flex: 1, ...BTN_G }}>Import {preview.length} leads</button>
              <button onClick={() => setPreview([])} style={{ flex: 1, ...BTN_GR }}>Re-upload</button>
            </div>
          </>
        )}
        {error && <div style={{ color: '#a15a5a', fontSize: 12, marginTop: 12 }}>{error}</div>}
      </div>
    </div>
  );
}

// ── Manage Closers ─────────────────────────────────────────────────────────────
function ClosersPanel({ accounts, leads, onClose, onUpdate }: { accounts: Account[]; leads: StoredLead[]; onClose: () => void; onUpdate: (a: Account[]) => void }) {
  const [newName, setNewName] = useState('');
  const [newUser, setNewUser] = useState('');
  const [newPass, setNewPass] = useState('');
  const [err, setErr] = useState('');
  const reps = accounts.filter(a => a.role === 'rep');

  function add() {
    if (!newName.trim() || !newUser.trim() || !newPass.trim()) { setErr('Fill in all fields.'); return; }
    if (accounts.some(a => a.username === newUser.trim())) { setErr('Username taken.'); return; }
    const updated = [...accounts, { username: newUser.trim(), password: newPass.trim(), role: 'rep' as const, name: newName.trim() }];
    onUpdate(updated); saveReps(updated);
    setNewName(''); setNewUser(''); setNewPass(''); setErr('');
  }

  function remove(username: string) {
    const updated = accounts.filter(a => a.username !== username);
    onUpdate(updated); saveReps(updated);
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(4,7,6,.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 50 }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: '#121815', border: '1px solid #324038', borderRadius: 14, width: '100%', maxWidth: 460, padding: 22, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 24, fontWeight: 600 }}>Closers</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#5d6b64', fontSize: 18, cursor: 'pointer', padding: 4 }}>✕</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
          {reps.map(r => (
            <div key={r.username} style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 10, background: '#182019', border: '1px solid #232d28', borderRadius: 9, padding: '10px 12px' }}>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 500, color: '#eef3f0' }}>{r.name}</div>
                <div style={{ fontSize: 11.5, color: '#9caea5', marginTop: 2 }}>{r.username} · {leads.filter(l => l.repUsername === r.username).length} leads</div>
              </div>
              <button onClick={() => remove(r.username)} style={{ background: 'none', border: '1px solid #232d28', color: '#a15a5a', padding: '6px 10px', borderRadius: 7, fontSize: 12, fontFamily: "'Inter',sans-serif", cursor: 'pointer' }}>Remove</button>
            </div>
          ))}
        </div>
        <div style={{ ...LABEL_S, marginTop: 4 }}>Add a closer</div>
        <label style={LABEL_S}>Name</label>
        <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Jane Closer" style={INPUT_S} />
        <label style={LABEL_S}>Username</label>
        <input type="text" value={newUser} onChange={e => setNewUser(e.target.value)} placeholder="jcloser" style={INPUT_S} />
        <label style={LABEL_S}>Password</label>
        <input type="text" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="sales123" style={INPUT_S} />
        {err && <div style={{ color: '#a15a5a', fontSize: 12, marginTop: 8 }}>{err}</div>}
        <button onClick={add} style={{ width: '100%', marginTop: 16, ...BTN_G }}>Add closer</button>
      </div>
    </div>
  );
}

// ── City-grouped lead section ─────────────────────────────────────────────────
function CitySection({ title, accentColor, leads, onOpen, emptyMsg }: {
  title: string; accentColor: string; leads: StoredLead[];
  onOpen: (id: number) => void; emptyMsg: string;
}) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [filtersOpen, setFiltersOpen] = useState(false);

  const cities = useMemo(() => [...new Set(leads.map(l => l.city || 'Uncategorized').filter(Boolean))].sort(), [leads]);

  const filtered = useMemo(() => {
    let out = leads;
    if (statusFilter !== 'all') out = out.filter(l => (l.status || 'none') === statusFilter);
    if (cityFilter) out = out.filter(l => (l.city || 'Uncategorized') === cityFilter);
    const t = search.trim().toLowerCase();
    if (t) out = out.filter(l => l.name.toLowerCase().includes(t) || l.address.toLowerCase().includes(t) || (l.city || '').toLowerCase().includes(t));
    return out;
  }, [leads, statusFilter, cityFilter, search]);

  // Group by city
  const cityOrder: string[] = [];
  const byCity: Record<string, StoredLead[]> = {};
  filtered.forEach(l => {
    const c = l.city ? normalizeCity(l.city) : 'Uncategorized';
    if (!byCity[c]) { byCity[c] = []; cityOrder.push(c); }
    byCity[c].push(l);
  });

  const totalLogged = leads.filter(l => l.status && l.status !== 'none').length;

  function toggleCity(c: string) {
    setExpanded(prev => { const n = new Set(prev); n.has(c) ? n.delete(c) : n.add(c); return n; });
  }

  const activeFilters = (statusFilter !== 'all' ? 1 : 0) + (cityFilter ? 1 : 0) + (search ? 1 : 0);

  return (
    <div style={{ marginBottom: 32 }}>
      {/* Section header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 20, borderRadius: 2, background: accentColor }} />
          <div>
            <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 22, fontWeight: 600 }}>{title}</span>
            <span style={{ marginLeft: 10, fontSize: 12, color: '#5d6b64' }}>{leads.length} leads · {totalLogged} logged</span>
          </div>
        </div>
        <button
          onClick={() => setFiltersOpen(o => !o)}
          style={{ ...BTN_GR, fontSize: 11.5, padding: '6px 12px', border: `1px solid ${activeFilters ? accentColor + '60' : '#232d28'}`, color: activeFilters ? accentColor : '#9caea5' }}
        >
          {activeFilters ? `Filters (${activeFilters})` : 'Filter'}
        </button>
      </div>

      {/* Filters */}
      {filtersOpen && (
        <div style={{ background: '#0e1410', border: '1px solid #1e2820', borderRadius: 10, padding: 14, marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input type="text" placeholder="Search name, address, city…" value={search} onChange={e => setSearch(e.target.value)} style={{ ...INPUT_S, padding: '8px 12px', fontSize: 13 }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <select value={cityFilter} onChange={e => setCityFilter(e.target.value)} style={{ ...INPUT_S, flex: 1, padding: '8px 10px', fontSize: 12 }}>
              <option value="">All cities</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...INPUT_S, flex: 1, padding: '8px 10px', fontSize: 12 }}>
              <option value="all">All statuses</option>
              <option value="none">Not logged</option>
              {STATUS_DEFS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </div>
          {activeFilters > 0 && (
            <button onClick={() => { setSearch(''); setCityFilter(''); setStatusFilter('all'); }} style={{ ...BTN_GR, fontSize: 11.5, padding: '6px 12px' }}>Clear filters</button>
          )}
        </div>
      )}

      {/* City accordions */}
      {cityOrder.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '30px 20px', color: '#5d6b64', fontSize: 13 }}>{activeFilters > 0 ? 'No leads match your filters.' : emptyMsg}</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {cityOrder.map(city => {
            const cityLeads = byCity[city];
            const logged = cityLeads.filter(l => l.status && l.status !== 'none').length;
            const isOpen = expanded.has(city);
            return (
              <div key={city} style={{ border: '1px solid #232d28', borderRadius: 10, background: '#121815', overflow: 'hidden' }}>
                <div onClick={() => toggleCity(city)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', cursor: 'pointer', userSelect: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#5d6b64', fontSize: 10, transition: 'transform .12s', display: 'inline-block', transform: isOpen ? 'rotate(90deg)' : 'none' }}>▶</span>
                    <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 19, fontWeight: 600 }}>{city}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 11.5, color: '#9caea5' }}>{cityLeads.length} stops</span>
                    <span style={{ fontSize: 11, color: logged === cityLeads.length && cityLeads.length > 0 ? '#6fae8f' : '#5d6b64', fontWeight: 600 }}>{logged}/{cityLeads.length} logged</span>
                  </div>
                </div>
                {isOpen && (
                  <div style={{ padding: '0 10px 10px', display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {cityLeads.map(lead => {
                      const bs = badgeStyle(lead.status);
                      const apptStr = fmtAppt(lead.appointment);
                      return (
                        <div key={lead.id} onClick={() => onOpen(lead.id)} style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 12, background: '#182019', border: '1px solid #1e2820', borderRadius: 9, padding: '11px 13px', cursor: 'pointer' }}>
                          <div>
                            <div style={{ fontSize: 13.5, fontWeight: 500, color: '#eef3f0' }}>{lead.name}</div>
                            <div onClick={e => { e.stopPropagation(); openMaps(lead.address); }} style={{ fontSize: 12, color: '#9caea5', marginTop: 2, cursor: 'pointer', textDecoration: 'underline', textDecorationColor: 'rgba(155,217,189,0.3)' }}>{lead.address}</div>
                            {apptStr && <div style={{ fontSize: 10.5, color: '#5a8fd0', marginTop: 3, fontWeight: 600 }}>📅 {apptStr}</div>}
                          </div>
                          <div style={{ fontSize: 10.5, fontWeight: 700, padding: '5px 9px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '.04em', whiteSpace: 'nowrap', background: bs.bg, color: bs.color }}>{bs.label}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── My Solar Leads section (personal, private) ────────────────────────────────
function MySolarSection({ leads, onOpen, onAddLead, onUploadCSV, session, nextId }: {
  leads: StoredLead[]; onOpen: (id: number) => void;
  onAddLead: (l: StoredLead) => void; onUploadCSV: (ls: StoredLead[]) => void;
  session: Account; nextId: number;
}) {
  const [addOpen, setAddOpen] = useState(false);
  const [csvOpen, setCsvOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let out = leads;
    if (statusFilter !== 'all') out = out.filter(l => (l.status || 'none') === statusFilter);
    const t = search.trim().toLowerCase();
    if (t) out = out.filter(l => l.name.toLowerCase().includes(t) || l.address.toLowerCase().includes(t));
    return out;
  }, [leads, statusFilter, search]);

  const totalLogged = leads.filter(l => l.status && l.status !== 'none').length;
  const activeFilters = (statusFilter !== 'all' ? 1 : 0) + (search ? 1 : 0);

  function handleCSVImport(ls: StoredLead[]) {
    ls.forEach(l => onAddLead(l));
  }

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 3, height: 20, borderRadius: 2, background: '#8abfb0' }} />
          <div>
            <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 22, fontWeight: 600 }}>My Solar Leads</span>
            <span style={{ marginLeft: 10, fontSize: 12, color: '#5d6b64' }}>{leads.length} leads · {totalLogged} logged</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => setAddOpen(true)} style={{ ...BTN_G, fontSize: 12, padding: '7px 12px' }}>+ Add lead</button>
          <button onClick={() => setCsvOpen(true)} style={{ ...BTN_GR, fontSize: 12, padding: '7px 12px' }}>⬆ CSV</button>
          <button onClick={() => setFiltersOpen(o => !o)} style={{ ...BTN_GR, fontSize: 11.5, padding: '7px 12px', border: `1px solid ${activeFilters ? '#8abfb060' : '#232d28'}`, color: activeFilters ? '#8abfb0' : '#9caea5' }}>Filter{activeFilters ? ` (${activeFilters})` : ''}</button>
        </div>
      </div>

      {filtersOpen && (
        <div style={{ background: '#0e1410', border: '1px solid #1e2820', borderRadius: 10, padding: 14, marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input type="text" placeholder="Search name or address…" value={search} onChange={e => setSearch(e.target.value)} style={{ ...INPUT_S, padding: '8px 12px', fontSize: 13 }} />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...INPUT_S, padding: '8px 10px', fontSize: 12 }}>
            <option value="all">All statuses</option>
            <option value="none">Not logged</option>
            {STATUS_DEFS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
          {activeFilters > 0 && <button onClick={() => { setSearch(''); setStatusFilter('all'); }} style={{ ...BTN_GR, fontSize: 11.5, padding: '6px 12px' }}>Clear</button>}
        </div>
      )}

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '30px 20px', color: '#5d6b64', fontSize: 13 }}>
          {leads.length === 0 ? 'Your personal leads will appear here. Add them manually or upload a CSV.' : 'No leads match your filters.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {filtered.map(lead => {
            const bs = badgeStyle(lead.status);
            const apptStr = fmtAppt(lead.appointment);
            return (
              <div key={lead.id} onClick={() => onOpen(lead.id)} style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 12, background: '#121815', border: '1px solid #232d28', borderRadius: 10, padding: '12px 14px', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 500, color: '#eef3f0' }}>{lead.name}</div>
                  {lead.city && <div style={{ fontSize: 10.5, color: '#8abfb0', fontWeight: 600, marginTop: 1 }}>{lead.city}</div>}
                  <div onClick={e => { e.stopPropagation(); openMaps(lead.address); }} style={{ fontSize: 12, color: '#9caea5', marginTop: 2, cursor: 'pointer', textDecoration: 'underline', textDecorationColor: 'rgba(155,217,189,0.3)' }}>{lead.address}</div>
                  {apptStr && <div style={{ fontSize: 10.5, color: '#5a8fd0', marginTop: 3, fontWeight: 600 }}>📅 {apptStr}</div>}
                </div>
                <div style={{ fontSize: 10.5, fontWeight: 700, padding: '5px 9px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '.04em', whiteSpace: 'nowrap', background: bs.bg, color: bs.color }}>{bs.label}</div>
              </div>
            );
          })}
        </div>
      )}

      {addOpen && <AddLeadForm type="personal" repOptions={[]} session={session} onClose={() => setAddOpen(false)} onAdd={l => { onAddLead(l); setAddOpen(false); }} nextId={nextId} />}
      {csvOpen && <CSVUpload session={session} onAdd={handleCSVImport} nextId={nextId} onClose={() => setCsvOpen(false)} />}
    </div>
  );
}

// ── Tab bar ───────────────────────────────────────────────────────────────────
function TabBar({ tab, setTab }: { tab: string; setTab: (t: any) => void }) {
  const tabs = [{ id: 'leads', label: 'Leads' }, { id: 'calendar', label: 'Calendar' }, { id: 'numbers', label: 'Numbers' }];
  return (
    <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '1px solid #232d28' }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, background: 'none', border: 'none', borderBottom: tab === t.id ? '2px solid #8abfb0' : '2px solid transparent', color: tab === t.id ? '#8abfb0' : '#5d6b64', padding: '10px 8px', fontSize: 13.5, fontFamily: "'Inter',sans-serif", fontWeight: tab === t.id ? 600 : 400, cursor: 'pointer', marginBottom: -1 }}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function SalesRepPortal() {
  const [, navigate] = useLocation();
  const [session, setSession] = useState<Account | null>(null);
  const [accounts, setAccounts] = useState<Account[]>(loadAccounts);
  const [leads, setLeads] = useState<StoredLead[]>(loadLeads);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginErr, setLoginErr] = useState('');

  // Admin state
  const [repFilter, setRepFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [adminTab, setAdminTab] = useState<'leads' | 'numbers'>('leads');
  const [addBEOpen, setAddBEOpen] = useState(false);
  const [addFunnelOpen, setAddFunnelOpen] = useState(false);
  const [repsPanelOpen, setRepsPanelOpen] = useState(false);

  // Rep state
  const [repTab, setRepTab] = useState<'leads' | 'calendar' | 'numbers'>('leads');

  // Shared
  const [panelLeadId, setPanelLeadId] = useState<number | null>(null);

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
    const u = loginUser.trim();
    const acc = accounts.find(a => a.username === u && a.password === loginPass);
    if (!acc) { setLoginErr('Incorrect username or password.'); return; }
    setSession(acc); setLoginErr('');
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(acc.username)); } catch {}
  }

  function logout() {
    setSession(null);
    try { localStorage.removeItem(SESSION_KEY); } catch {}
  }

  const isAdmin = !!session && session.role === 'admin';
  const repOptions = accounts.filter(a => a.role === 'rep' || a.isCloser);
  const nextId = leads.reduce((m, l) => Math.max(m, l.id), 0) + 1;

  // ── Rep scoping ─────────────────────────────────────────────────────────────
  const { beLeads, funnelLeads, personalLeads, allRepLeads } = useMemo(() => {
    if (!session || isAdmin) return { beLeads: [], funnelLeads: [], personalLeads: [], allRepLeads: [] };
    const cityAssignments = loadCityAssignments();
    const myCities = new Set(
      Object.entries(cityAssignments)
        .filter(([, users]) => users.includes(session.username))
        .map(([city]) => city)
    );
    const be = leads.filter(l =>
      (l.fromList || l.leadType === 'be') &&
      l.leadType !== 'funnel' &&
      l.leadType !== 'personal' &&
      (
        (l.city && myCities.has(l.city)) ||
        l.repUsername === session.username
      )
    );
    const funnel = leads.filter(l => l.leadType === 'funnel' && l.repUsername === session.username);
    const personal = leads.filter(l => l.leadType === 'personal' && l.repUsername === session.username);
    return { beLeads: be, funnelLeads: funnel, personalLeads: personal, allRepLeads: [...be, ...funnel, ...personal] };
  }, [leads, session, isAdmin]);

  // ── Admin lead filtering ────────────────────────────────────────────────────
  const adminLeads = useMemo(() => {
    let out = leads.filter(l => l.leadType !== 'personal');
    if (repFilter !== 'all') out = out.filter(l => l.repUsername === repFilter);
    if (statusFilter !== 'all') out = out.filter(l => (l.status || 'none') === statusFilter);
    const t = search.trim().toLowerCase();
    if (t) out = out.filter(l => l.name.toLowerCase().includes(t) || l.address.toLowerCase().includes(t) || (l.city || '').toLowerCase().includes(t));
    return out;
  }, [leads, repFilter, statusFilter, search]);

  const adminCounts = useMemo(() => {
    const base = leads.filter(l => l.leadType !== 'personal' && (repFilter === 'all' || l.repUsername === repFilter));
    const c: Record<string, number> = { total: base.length };
    STATUS_DEFS.forEach(s => { c[s.key] = base.filter(l => l.status === s.key).length; });
    c.none = base.filter(l => !l.status).length;
    return c;
  }, [leads, repFilter]);

  const panelLead = leads.find(l => l.id === panelLeadId) || null;

  // ── Login ──────────────────────────────────────────────────────────────────
  if (!session) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0e0d', color: '#eef3f0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: "'Inter', sans-serif" }}>
        <div style={{ width: '100%', maxWidth: 360, background: '#121815', border: '1px solid #232d28', borderRadius: 14, padding: '32px 28px' }}>
          <p style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8abfb0', fontWeight: 600, margin: '0 0 6px' }}>Riv Comfort · Field Sales</p>
          <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 30, margin: '0 0 22px' }}>Sign in</h1>
          <label style={{ ...LABEL_S, marginTop: 0 }}>Username</label>
          <input type="text" value={loginUser} onChange={e => setLoginUser(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} placeholder="e.g. cbuckland" style={{ ...INPUT_S, marginBottom: 14 }} />
          <label style={LABEL_S}>Password</label>
          <input type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} placeholder="••••••••" style={{ ...INPUT_S, marginBottom: 8 }} />
          {loginErr && <div style={{ color: '#a15a5a', fontSize: 12.5, marginBottom: 10 }}>{loginErr}</div>}
          <button onClick={login} style={{ width: '100%', marginTop: 8, background: '#182019', border: '1px solid #5f8577', color: '#8abfb0', padding: '12px', borderRadius: 9, fontSize: 14, fontFamily: "'Inter',sans-serif", fontWeight: 600, cursor: 'pointer' }}>Log in</button>
        </div>
      </div>
    );
  }

  // ── Shared header ──────────────────────────────────────────────────────────
  const Header = () => (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 14, paddingBottom: 18, borderBottom: '1px solid #232d28', marginBottom: 20 }}>
      <div>
        <p style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8abfb0', fontWeight: 600, margin: '0 0 4px' }}>Riv Comfort · Field Sales</p>
        <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 32, margin: 0 }}>{isAdmin ? 'Admin Dashboard' : session.name}</h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, color: '#5d6b64' }}>{isAdmin ? 'Admin' : 'Sales Rep'}</span>
        <button onClick={() => navigate('/')} style={BTN_GR}>HVAC guide</button>
        {isAdmin && <button onClick={() => navigate('/leads')} style={BTN_GR}>Route sheet</button>}
        <button onClick={logout} style={BTN_GR}>Log out</button>
      </div>
    </header>
  );

  // ── Admin view ─────────────────────────────────────────────────────────────
  if (isAdmin) {
    const AdminTabBar = () => (
      <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderBottom: '1px solid #232d28' }}>
        {[{ id: 'leads', label: 'Leads' }, { id: 'numbers', label: 'Rep Numbers' }].map(t => (
          <button key={t.id} onClick={() => setAdminTab(t.id as any)} style={{ flex: 1, background: 'none', border: 'none', borderBottom: adminTab === t.id ? '2px solid #8abfb0' : '2px solid transparent', color: adminTab === t.id ? '#8abfb0' : '#5d6b64', padding: '10px 8px', fontSize: 13.5, fontFamily: "'Inter',sans-serif", fontWeight: adminTab === t.id ? 600 : 400, cursor: 'pointer', marginBottom: -1 }}>{t.label}</button>
        ))}
      </div>
    );

    return (
      <div style={{ minHeight: '100vh', background: '#0a0e0d', color: '#eef3f0', fontFamily: "'Inter', sans-serif" }}>
        <div style={{ maxWidth: 1040, margin: '0 auto', padding: '24px 16px 80px' }}>
          <Header />
          <AdminTabBar />

          {adminTab === 'leads' && (
            <>
              {/* Toolbar */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
                <select value={repFilter} onChange={e => setRepFilter(e.target.value)} style={{ background: '#121815', border: '1px solid #232d28', color: '#eef3f0', padding: '8px 12px', borderRadius: 8, fontSize: 12.5, fontFamily: "'Inter',sans-serif" }}>
                  <option value="all">All reps</option>
                  {repOptions.map(r => <option key={r.username} value={r.username}>{r.name}</option>)}
                </select>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ background: '#121815', border: '1px solid #232d28', color: '#eef3f0', padding: '8px 12px', borderRadius: 8, fontSize: 12.5, fontFamily: "'Inter',sans-serif" }}>
                  <option value="all">All statuses</option>
                  <option value="none">Not logged</option>
                  {STATUS_DEFS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
                <input type="text" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, minWidth: 140, background: '#121815', border: '1px solid #232d28', color: '#eef3f0', padding: '8px 12px', borderRadius: 8, fontSize: 13, fontFamily: "'Inter',sans-serif" }} />
                <button onClick={() => setAddBEOpen(true)} style={{ ...BTN_G, fontSize: 12, padding: '8px 12px', flex: 'none' }}>+ BE Lead</button>
                <button onClick={() => setAddFunnelOpen(true)} style={{ background: '#121815', border: '1px solid #d08a5260', color: '#d08a52', padding: '8px 12px', borderRadius: 8, fontSize: 12, fontFamily: "'Inter',sans-serif", fontWeight: 500, cursor: 'pointer', flex: 'none' }}>+ Funnel Lead</button>
                <button onClick={() => setRepsPanelOpen(true)} style={{ ...BTN_GR, fontSize: 12, padding: '8px 12px', flex: 'none' }}>Closers</button>
              </div>

              {/* Stat cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(88px,1fr))', gap: 8, marginBottom: 18 }}>
                {[{ key: 'all', label: 'Total', num: adminCounts.total }, ...STATUS_DEFS.map(s => ({ key: s.key, label: s.label, num: adminCounts[s.key] || 0 })), { key: 'none', label: 'Not logged', num: adminCounts.none || 0 }].map(card => (
                  <div key={card.key} onClick={() => setStatusFilter(prev => prev === card.key ? 'all' : card.key)} style={{ background: '#121815', border: `1px solid ${statusFilter === card.key ? '#8abfb0' : '#232d28'}`, borderRadius: 10, padding: '10px 12px', cursor: 'pointer' }}>
                    <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 22, fontWeight: 600, lineHeight: 1 }}>{card.num}</div>
                    <div style={{ fontSize: 10, color: '#9caea5', textTransform: 'uppercase', letterSpacing: '.06em', marginTop: 4 }}>{card.label}</div>
                  </div>
                ))}
              </div>

              {/* Lead list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {adminLeads.map(lead => {
                  const bs = badgeStyle(lead.status);
                  const rep = accounts.find(a => a.username === lead.repUsername);
                  const typeColor = lead.leadType === 'funnel' ? '#d08a52' : '#7aacb8';
                  const typeLabel = lead.leadType === 'funnel' ? 'Funnel' : 'BE';
                  return (
                    <div key={lead.id} onClick={() => setPanelLeadId(lead.id)} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', alignItems: 'center', gap: 12, background: '#121815', border: '1px solid #232d28', borderRadius: 10, padding: '11px 14px', cursor: 'pointer' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 13.5, fontWeight: 500, color: '#eef3f0' }}>{lead.name}</span>
                          <span style={{ fontSize: 9.5, fontWeight: 700, background: typeColor + '20', color: typeColor, padding: '2px 6px', borderRadius: 8, textTransform: 'uppercase', letterSpacing: '.05em' }}>{typeLabel}</span>
                        </div>
                        <div style={{ fontSize: 11.5, color: '#9caea5', marginTop: 2 }}>{lead.city} · {rep?.name || lead.repUsername || 'Unassigned'}</div>
                        <div onClick={e => { e.stopPropagation(); openMaps(lead.address); }} style={{ fontSize: 11, color: '#5d6b64', marginTop: 1, cursor: 'pointer' }}>{lead.address}</div>
                      </div>
                      <div style={{ fontSize: 10.5, fontWeight: 700, padding: '4px 8px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '.04em', whiteSpace: 'nowrap', background: bs.bg, color: bs.color }}>{bs.label}</div>
                    </div>
                  );
                })}
              </div>
              {adminLeads.length === 0 && <div style={{ textAlign: 'center', padding: '40px 20px', color: '#5d6b64', fontSize: 13 }}>No leads match your filters.</div>}
            </>
          )}

          {adminTab === 'numbers' && <AdminTrackerDashboard repOptions={repOptions} />}

          {/* Modals */}
          {addBEOpen && <AddLeadForm type="be" repOptions={repOptions} session={session!} onClose={() => setAddBEOpen(false)} onAdd={l => { persistLeads([...leads, l]); setAddBEOpen(false); }} nextId={nextId} />}
          {addFunnelOpen && <AddLeadForm type="funnel" repOptions={repOptions} session={session!} onClose={() => setAddFunnelOpen(false)} onAdd={l => { persistLeads([...leads, l]); setAddFunnelOpen(false); }} nextId={nextId} />}
          {repsPanelOpen && <ClosersPanel accounts={accounts} leads={leads} onClose={() => setRepsPanelOpen(false)} onUpdate={setAccounts} />}
          {panelLead && <LeadPanel lead={panelLead} isAdmin={isAdmin} repOptions={repOptions} session={session!} onClose={() => setPanelLeadId(null)} onSave={updated => { persistLeads(leads.map(l => l.id === updated.id ? updated : l)); setPanelLeadId(null); }} />}
        </div>
      </div>
    );
  }

  // ── Rep view ───────────────────────────────────────────────────────────────
  const totalLogged = allRepLeads.filter(l => l.status && l.status !== 'none').length;
  const pct = allRepLeads.length ? Math.round((totalLogged / allRepLeads.length) * 100) : 0;

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e0d', color: '#eef3f0', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px 80px' }}>
        <Header />

        {/* Progress bar */}
        {allRepLeads.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 5, borderRadius: 3, background: '#182019', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: '#8abfb0', borderRadius: 3, width: pct + '%', transition: 'width .4s' }} />
            </div>
            <span style={{ fontSize: 11.5, color: '#9caea5', whiteSpace: 'nowrap' }}>{pct}% logged</span>
          </div>
        )}

        <TabBar tab={repTab} setTab={setRepTab} />

        {/* Leads tab */}
        {repTab === 'leads' && (
          <>
            <CitySection title="Better Earth Leads" accentColor="#7aacb8" leads={beLeads} onOpen={setPanelLeadId} emptyMsg="No Better Earth leads assigned yet. Contact admin to get cities assigned." />
            <CitySection title="Funnel Leads" accentColor="#d08a52" leads={funnelLeads} onOpen={setPanelLeadId} emptyMsg="No funnel leads assigned yet." />
            <MySolarSection leads={personalLeads} onOpen={setPanelLeadId} onAddLead={l => persistLeads([...leads, l])} onUploadCSV={ls => persistLeads([...leads, ...ls])} session={session!} nextId={nextId + personalLeads.length} />
          </>
        )}

        {/* Calendar tab */}
        {repTab === 'calendar' && (
          <RepCalendar repUsername={session!.username} repName={session!.name} leads={allRepLeads} />
        )}

        {/* Numbers tab */}
        {repTab === 'numbers' && (
          <RepTracker repUsername={session!.username} repName={session!.name} />
        )}

        {/* Lead panel */}
        {panelLead && (
          <LeadPanel
            lead={panelLead} isAdmin={false} repOptions={repOptions} session={session!}
            onClose={() => setPanelLeadId(null)}
            onSave={updated => { persistLeads(leads.map(l => l.id === updated.id ? updated : l)); setPanelLeadId(null); }}
          />
        )}
      </div>
    </div>
  );
}
