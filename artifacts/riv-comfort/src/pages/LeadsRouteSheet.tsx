import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { LEADS_BY_CITY } from '@/data/leads';
import { CITY_ASSIGN_KEY, SESSION_KEY, REPS_KEY, DEFAULT_ACCOUNTS, Account } from '@/data/accounts';

const ADMIN_ACCOUNTS = [
  { username: 'admin', role: 'admin' },
  { username: 'wsilva', role: 'admin' },
];

function currentAccount(): { username: string; role: string } | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const username = JSON.parse(raw);
    const admin = ADMIN_ACCOUNTS.find(a => a.username === username);
    if (admin) return admin;
    const repsRaw = localStorage.getItem(REPS_KEY);
    const reps = repsRaw ? JSON.parse(repsRaw) : [];
    return (reps as Account[]).find(a => a.username === username) || null;
  } catch { return null; }
}

// assignments: city → string[] of usernames
function loadAssignments(): Record<string, string[]> {
  try {
    const r = localStorage.getItem(CITY_ASSIGN_KEY);
    if (r) {
      const parsed = JSON.parse(r);
      // migrate old format (string values) to arrays
      const out: Record<string, string[]> = {};
      for (const [city, val] of Object.entries(parsed)) {
        out[city] = Array.isArray(val) ? (val as string[]) : val ? [val as string] : [];
      }
      return out;
    }
  } catch {}
  return {};
}

function saveAssignments(a: Record<string, string[]>) {
  try { localStorage.setItem(CITY_ASSIGN_KEY, JSON.stringify(a)); } catch {}
}

function loadRepOptions(): Account[] {
  const admins = DEFAULT_ACCOUNTS.filter(a => a.role === 'admin');
  try {
    const r = localStorage.getItem(REPS_KEY);
    if (r) {
      const reps = JSON.parse(r) as Account[];
      if (Array.isArray(reps) && reps.length) return [...admins, ...reps];
    }
  } catch {}
  return DEFAULT_ACCOUNTS.slice();
}

function openMaps(address: string) {
  const q = encodeURIComponent(address);
  window.open(`https://maps.apple.com/?q=${q}`, '_blank', 'noopener');
}

function badgeStyle(category: string) {
  const c = (category || '').trim();
  if (c.startsWith('TARGET')) return { bg: 'rgba(220,180,92,.16)', color: '#dcb45c', label: 'Target' };
  if (c === 'Recent HVAC permit') return { bg: 'rgba(111,174,143,.18)', color: '#6fae8f', label: 'Recent permit' };
  if (c === 'Address not in Shovels DB') return { bg: 'transparent', color: '#5d6b64', label: 'No data' };
  return { bg: 'rgba(125,136,131,.18)', color: '#b7c2bd', label: 'No permit' };
}

const BTN_GREY: React.CSSProperties = {
  background: '#121815', border: '1px solid #232d28', color: '#9caea5',
  padding: '9px 14px', borderRadius: 8, fontSize: 13, fontFamily: "'Inter',sans-serif",
  fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap',
};

// ── Multi-select closer dropdown ─────────────────────────────────────────────
interface CloserPickerProps {
  city: string;
  selected: string[];
  repOptions: Account[];
  onChange: (city: string, usernames: string[]) => void;
}

function CloserPicker({ city, selected, repOptions, onChange }: CloserPickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function toggle(username: string) {
    const next = selected.includes(username)
      ? selected.filter(u => u !== username)
      : [...selected, username];
    onChange(city, next);
  }

  const label = selected.length === 0
    ? 'Unassigned'
    : selected.length === 1
      ? (repOptions.find(r => r.username === selected[0])?.name || selected[0])
      : `${selected.length} closers`;

  return (
    <div ref={ref} style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: selected.length ? '#182019' : '#121815',
          border: `1px solid ${selected.length ? '#5f8577' : '#232d28'}`,
          color: selected.length ? '#8abfb0' : '#5d6b64',
          padding: '7px 10px', borderRadius: 7, fontSize: 12.5,
          fontFamily: "'Inter',sans-serif", cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
        }}
      >
        {label}
        <span style={{ fontSize: 9, opacity: 0.6 }}>▼</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 50,
          background: '#121815', border: '1px solid #324038', borderRadius: 10,
          minWidth: 200, padding: '6px 0', boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
        }}>
          {repOptions.map(r => {
            const checked = selected.includes(r.username);
            return (
              <div
                key={r.username}
                onClick={() => toggle(r.username)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 14px', cursor: 'pointer',
                  background: checked ? 'rgba(138,191,176,0.08)' : 'transparent',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                onMouseLeave={e => (e.currentTarget.style.background = checked ? 'rgba(138,191,176,0.08)' : 'transparent')}
              >
                <div style={{
                  width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                  border: `1.5px solid ${checked ? '#8abfb0' : '#3a4840'}`,
                  background: checked ? '#8abfb0' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {checked && <span style={{ color: '#0a0e0d', fontSize: 10, fontWeight: 700, lineHeight: 1 }}>✓</span>}
                </div>
                <span style={{ fontSize: 13, color: checked ? '#eef3f0' : '#9caea5', fontFamily: "'Inter',sans-serif" }}>{r.name}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function LeadsRouteSheet() {
  const [, navigate] = useLocation();
  const account = currentAccount();
  const isAdmin = !!account && account.role === 'admin';

  const [searchTerm, setSearchTerm] = useState('');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [assignments, setAssignments] = useState<Record<string, string[]>>(loadAssignments);
  const [savedCity, setSavedCity] = useState<string | null>(null);
  const repOptions = loadRepOptions();

  function toggleCity(city: string) {
    setExpanded(e => ({ ...e, [city]: !e[city] }));
  }

  function expandAll() {
    const next: Record<string, boolean> = {};
    LEADS_BY_CITY.forEach(b => { next[b.city] = true; });
    setExpanded(next);
  }

  function collapseAll() { setExpanded({}); }

  function handleAssign(city: string, usernames: string[]) {
    const next = { ...assignments, [city]: usernames };
    setAssignments(next);
    saveAssignments(next);
    setSavedCity(city);
    setTimeout(() => setSavedCity(c => c === city ? null : c), 1800);
  }

  function exportCsv() {
    const rows = [['City', 'Assigned Closers', 'Stop', 'Name', 'Address', 'Category']];
    LEADS_BY_CITY.forEach(b => {
      const names = (assignments[b.city] || [])
        .map(u => repOptions.find(r => r.username === u)?.name || u)
        .join(', ') || 'Unassigned';
      b.leads.forEach(l => rows.push([b.city, names, String(l.stop), l.name, l.address, l.category]));
    });
    const csv = rows.map(r => r.map(v => '"' + String(v).replace(/"/g, '""') + '"').join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'riv_comfort_leads_route_' + new Date().toISOString().slice(0, 10) + '.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── Not admin ────────────────────────────────────────────────────────────
  if (!isAdmin) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0e0d', color: '#eef3f0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: "'Inter',sans-serif" }}>
        <div style={{ width: '100%', maxWidth: 360, background: '#121815', border: '1px solid #232d28', borderRadius: 14, padding: '32px 28px', textAlign: 'center' }}>
          <p style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8abfb0', fontWeight: 600, margin: '0 0 6px' }}>Riv Comfort · Field Sales</p>
          <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 26, margin: '0 0 10px', color: '#eef3f0' }}>Admins only</h1>
          <p style={{ color: '#9caea5', fontSize: 13.5, lineHeight: 1.5, margin: '0 0 20px' }}>This page is restricted to admin accounts. Log in as an admin from the Rep Portal to view it.</p>
          <button onClick={() => navigate('/portal')} style={{ ...BTN_GREY, border: '1px solid #5f8577', color: '#8abfb0', padding: '11px 18px', borderRadius: 9, fontSize: 14, fontWeight: 600 }}>Go to Rep Portal</button>
        </div>
      </div>
    );
  }

  const term = searchTerm.trim().toLowerCase();
  const totalCount = LEADS_BY_CITY.reduce((s, b) => s + b.count, 0);

  const cityBlocks = LEADS_BY_CITY.map(block => {
    const filteredLeads = !term ? block.leads : block.leads.filter(l =>
      l.name.toLowerCase().includes(term) ||
      l.address.toLowerCase().includes(term) ||
      block.city.toLowerCase().includes(term)
    );
    const isExpanded = !!expanded[block.city] || (!!term && filteredLeads.length > 0);
    return { ...block, filteredLeads, isExpanded };
  }).filter(b => !term || b.filteredLeads.length > 0);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e0d', color: '#eef3f0', fontFamily: "'Inter',sans-serif" }}>
      <div style={{ maxWidth: 920, margin: '0 auto', padding: '28px 20px 80px' }}>

        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, paddingBottom: 20, borderBottom: '1px solid #232d28', marginBottom: 20 }}>
          <div>
            <p style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8abfb0', fontWeight: 600, margin: '0 0 6px' }}>Riv Comfort · Field Sales</p>
            <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 34, letterSpacing: '0.01em', margin: 0, color: '#eef3f0' }}>Leads route sheet</h1>
            <p style={{ color: '#9caea5', fontSize: 14, marginTop: 6 }}>{LEADS_BY_CITY.length} cities · {totalCount} leads · sorted by street for efficient driving order</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => navigate('/portal')} style={BTN_GREY}>← Rep portal</button>
            <button onClick={exportCsv} style={BTN_GREY}>Export CSV</button>
          </div>
        </header>

        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          <input type="text" placeholder="Search name, address, or city…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ flex: 1, minWidth: 220, background: '#121815', border: '1px solid #232d28', color: '#eef3f0', padding: '9px 12px', borderRadius: 8, fontSize: 14, fontFamily: "'Inter',sans-serif" }} />
          <button onClick={expandAll} style={BTN_GREY}>Expand all</button>
          <button onClick={collapseAll} style={BTN_GREY}>Collapse all</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {cityBlocks.map(block => {
            const isSaved = savedCity === block.city;
            return (
              <div key={block.city} style={{ background: '#121815', border: '1px solid #232d28', borderRadius: 10, overflow: 'hidden' }}>
                <div onClick={() => toggleCity(block.city)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 12, color: '#5d6b64', display: 'inline-block', transition: 'transform .12s ease', transform: block.isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
                    <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 20, fontWeight: 600, color: '#eef3f0' }}>{block.city}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }} onClick={e => e.stopPropagation()}>
                    <span style={{ fontSize: 12, color: '#9caea5' }}>{block.count} stops</span>
                    {isSaved && (
                      <span style={{ fontSize: 11, color: '#6fae8f', fontWeight: 600, letterSpacing: '0.05em' }}>✓ Saved</span>
                    )}
                    <CloserPicker
                      city={block.city}
                      selected={assignments[block.city] || []}
                      repOptions={repOptions}
                      onChange={handleAssign}
                    />
                  </div>
                </div>

                {block.isExpanded && (
                  <div style={{ padding: '0 12px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {block.filteredLeads.map((lead, i) => {
                      const bs = badgeStyle(lead.category);
                      return (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '32px 1fr auto', alignItems: 'center', gap: 12, background: '#182019', border: '1px solid #232d28', borderRadius: 9, padding: '10px 12px' }}>
                          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 14, fontWeight: 600, color: '#5d6b64', textAlign: 'center' }}>{lead.stop}</div>
                          <div>
                            <div style={{ fontSize: 13.5, fontWeight: 500, color: '#eef3f0' }}>{lead.name}<span style={{ marginLeft: 7, fontSize: 11, fontWeight: 600, color: '#7aacb8' }}>(BE Install)</span></div>
                            <div onClick={() => openMaps(lead.address)} style={{ fontSize: 12, color: '#9caea5', marginTop: 2, cursor: 'pointer', textDecoration: 'underline', textDecorationColor: 'rgba(155,217,189,0.4)' }}>{lead.address}</div>
                          </div>
                          <div style={{ fontSize: 10.5, fontWeight: 600, padding: '4px 9px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '.04em', whiteSpace: 'nowrap', background: bs.bg, color: bs.color }}>{bs.label}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {term && cityBlocks.length === 0 && (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: '#5d6b64', fontSize: 14 }}>No leads match your search.</div>
        )}
      </div>
    </div>
  );
}
