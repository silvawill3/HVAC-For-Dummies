import { useState, useMemo } from 'react';
import { PermitLead, PERMIT_LEADS_KEY } from '@/data/accounts';

// ── Storage ───────────────────────────────────────────────────────────────────
function loadPermitLeads(): PermitLead[] {
  try { const r = localStorage.getItem(PERMIT_LEADS_KEY); return r ? JSON.parse(r) : []; } catch { return []; }
}
function savePermitLeads(leads: PermitLead[]) {
  try { localStorage.setItem(PERMIT_LEADS_KEY, JSON.stringify(leads)); } catch {}
}

// ── Priority helpers ──────────────────────────────────────────────────────────
function yearToPriority(year: number): 'high' | 'medium' | 'low' {
  if (year <= 2011) return 'high';
  if (year <= 2015) return 'medium';
  return 'low';
}
const PRIORITY_META = {
  high:   { label: 'High priority',   dot: '🔴', color: '#e05252', bg: 'rgba(224,82,82,0.14)' },
  medium: { label: 'Medium priority', dot: '🟡', color: '#dcb45c', bg: 'rgba(220,180,92,0.14)' },
  low:    { label: 'Low priority',    dot: '🟢', color: '#6fae8f', bg: 'rgba(111,174,143,0.14)' },
};

// ── CSV parser ────────────────────────────────────────────────────────────────
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

function parseNum(v: string): number | null {
  const n = parseFloat(v.replace(/[^0-9.\-]/g, ''));
  return isNaN(n) ? null : n;
}

function parsePermitCSV(text: string): PermitLead[] {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];

  // Find header row
  const header = parseCSVLine(lines[0]).map(h => h.trim().toLowerCase());
  const col = (names: string[]) => {
    for (const n of names) {
      const i = header.findIndex(h => h.includes(n.toLowerCase()));
      if (i >= 0) return i;
    }
    return -1;
  };

  const iAddr   = col(['address']);
  const iCity   = col(['city']);
  const iIssued = col(['permit issued', 'issued', 'permit date', 'date']);
  const iYear   = col(['year']);
  const iPri    = col(['priority']);
  const iCon    = col(['contractor name', 'contractor']);
  const iPhone  = col(['contractor phone', 'phone']);
  const iDesc   = col(['description']);
  const iAge    = col(['system age', 'age']);
  const iVal    = col(['valuation', 'value']);
  const iLat    = col(['lat']);
  const iLng    = col(['lng', 'lon']);

  const results: PermitLead[] = [];
  const seen = new Set<string>();

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    const get = (idx: number) => (idx >= 0 ? (cols[idx] || '').trim() : '');

    const address = get(iAddr);
    const city    = get(iCity) || 'Unknown';
    if (!address) continue;

    const yearRaw = get(iYear);
    const issued  = get(iIssued);
    let year = parseInt(yearRaw);
    if (isNaN(year) && issued) year = new Date(issued).getFullYear();
    if (isNaN(year)) year = 0;

    const priRaw = get(iPri).toLowerCase();
    const priority: PermitLead['priority'] =
      priRaw.includes('high') ? 'high' :
      priRaw.includes('med')  ? 'medium' :
      priRaw.includes('low')  ? 'low' :
      year ? yearToPriority(year) : 'low';

    const key = `${address}|${city}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const lat = parseNum(get(iLat));
    const lng = parseNum(get(iLng));

    results.push({
      id: key,
      address, city,
      permitIssued: issued,
      year,
      priority,
      contractorName:  get(iCon),
      contractorPhone: get(iPhone),
      description:     get(iDesc),
      systemAge:       parseNum(get(iAge)),
      jobValuation:    parseNum(get(iVal)),
      lat, lng,
      // Tracking defaults
      knocked: false, spokeToHomeowner: false, appointment: '',
      membership: false, followUpDate: '', notes: '',
    });
  }
  return results;
}

// ── Nearest-neighbor route sort ───────────────────────────────────────────────
function optimizeRoute(leads: PermitLead[]): PermitLead[] {
  const withCoords = leads.filter(l => l.lat !== null && l.lng !== null);
  const noCoords   = leads.filter(l => l.lat === null || l.lng === null);
  if (!withCoords.length) return leads;

  const remaining = [...withCoords];
  const route: PermitLead[] = [remaining.shift()!];

  while (remaining.length) {
    const last = route[route.length - 1];
    let bestIdx = 0, bestDist = Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const dx = (last.lat! - remaining[i].lat!);
      const dy = (last.lng! - remaining[i].lng!);
      const d = dx * dx + dy * dy;
      if (d < bestDist) { bestDist = d; bestIdx = i; }
    }
    route.push(remaining.splice(bestIdx, 1)[0]);
  }
  return [...route, ...noCoords];
}

// ── Maps link ─────────────────────────────────────────────────────────────────
function openMaps(address: string, city: string) {
  const q = encodeURIComponent(`${address}, ${city}`);
  window.open(`https://maps.apple.com/?q=${q}`, '_blank', 'noopener');
}

// ── Shared styles ─────────────────────────────────────────────────────────────
const INPUT_S: React.CSSProperties = {
  width: '100%', background: '#182019', border: '1px solid #232d28',
  color: '#eef3f0', padding: '9px 12px', borderRadius: 8,
  fontSize: 13, fontFamily: "'Inter', sans-serif", boxSizing: 'border-box',
};
const LABEL_S: React.CSSProperties = {
  fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em',
  color: '#5d6b64', margin: '14px 0 6px', fontWeight: 600, display: 'block',
};
const BTN_G: React.CSSProperties = {
  background: '#121815', border: '1px solid #5f8577', color: '#8abfb0',
  padding: '8px 14px', borderRadius: 8, fontSize: 13,
  fontFamily: "'Inter',sans-serif", fontWeight: 500, cursor: 'pointer',
};
const BTN_GR: React.CSSProperties = {
  ...BTN_G, border: '1px solid #232d28', color: '#9caea5',
};

// ── Lead tracking panel ───────────────────────────────────────────────────────
function TrackingPanel({ lead, onClose, onSave }: {
  lead: PermitLead; onClose: () => void; onSave: (l: PermitLead) => void;
}) {
  const [knocked,          setKnocked]          = useState(lead.knocked);
  const [spokeToHomeowner, setSpokeToHomeowner] = useState(lead.spokeToHomeowner);
  const [appointment,      setAppointment]      = useState(lead.appointment);
  const [membership,       setMembership]       = useState(lead.membership);
  const [followUpDate,     setFollowUpDate]     = useState(lead.followUpDate);
  const [notes,            setNotes]            = useState(lead.notes);

  const pm = PRIORITY_META[lead.priority];

  function save() {
    onSave({ ...lead, knocked, spokeToHomeowner, appointment, membership, followUpDate, notes });
    onClose();
  }

  const CheckRow = ({ label, val, set }: { label: string; val: boolean; set: (v: boolean) => void }) => (
    <div
      onClick={() => set(!val)}
      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 13px', borderRadius: 9, background: val ? 'rgba(138,191,176,0.08)' : '#182019', border: `1px solid ${val ? '#5f8577' : '#232d28'}`, cursor: 'pointer', marginBottom: 8 }}
    >
      <div style={{ width: 20, height: 20, borderRadius: 5, flexShrink: 0, border: `1.5px solid ${val ? '#8abfb0' : '#3a4840'}`, background: val ? '#8abfb0' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {val && <span style={{ color: '#0a0e0d', fontSize: 11, fontWeight: 700 }}>✓</span>}
      </div>
      <span style={{ fontSize: 13.5, color: val ? '#eef3f0' : '#9caea5', fontWeight: val ? 500 : 400 }}>{label}</span>
    </div>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(4,7,6,.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 50 }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: '#121815', border: '1px solid #324038', borderRadius: 14, width: '100%', maxWidth: 480, padding: 22, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <div style={{ flex: 1, paddingRight: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, fontWeight: 700, background: pm.bg, color: pm.color, padding: '3px 9px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '.06em' }}>{pm.dot} {pm.label}</span>
              {lead.year > 0 && <span style={{ fontSize: 11, color: '#5d6b64' }}>{lead.year}</span>}
              {lead.systemAge !== null && <span style={{ fontSize: 11, color: '#9caea5' }}>~{lead.systemAge} yr old system</span>}
            </div>
            <div
              onClick={() => openMaps(lead.address, lead.city)}
              style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 22, fontWeight: 600, lineHeight: 1.2, cursor: 'pointer', textDecoration: 'underline', textDecorationColor: 'rgba(155,217,189,0.3)', color: '#eef3f0' }}
            >
              {lead.address}
            </div>
            <div style={{ fontSize: 12, color: '#9caea5', marginTop: 3 }}>{lead.city}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#5d6b64', fontSize: 18, cursor: 'pointer', padding: 4, lineHeight: 1, flexShrink: 0 }}>✕</button>
        </div>

        {/* Contractor info */}
        {(lead.contractorName || lead.contractorPhone) && (
          <div style={{ background: '#0e1410', border: '1px solid #1e2820', borderRadius: 9, padding: '10px 13px', marginBottom: 14 }}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.08em', color: '#5d6b64', fontWeight: 600, marginBottom: 4 }}>Last serviced by</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#eef3f0' }}>{lead.contractorName || '—'}</div>
            {lead.contractorPhone && (
              <a href={`tel:${lead.contractorPhone.replace(/\D/g,'')}`} style={{ fontSize: 12.5, color: '#7aacb8', marginTop: 3, display: 'block', textDecoration: 'none' }}>📞 {lead.contractorPhone}</a>
            )}
          </div>
        )}

        {/* Description */}
        {lead.description && (
          <div style={{ background: '#0e1410', border: '1px solid #1e2820', borderRadius: 9, padding: '10px 13px', marginBottom: 14 }}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.08em', color: '#5d6b64', fontWeight: 600, marginBottom: 4 }}>Permit description</div>
            <div style={{ fontSize: 12.5, color: '#9caea5', lineHeight: 1.5 }}>{lead.description}</div>
          </div>
        )}

        {lead.jobValuation !== null && (
          <div style={{ fontSize: 12, color: '#5d6b64', marginBottom: 14 }}>
            Job valuation: <span style={{ color: '#9caea5', fontWeight: 600 }}>${lead.jobValuation.toLocaleString()}</span>
          </div>
        )}

        {/* Tracking */}
        <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '.08em', color: '#5d6b64', fontWeight: 600, marginBottom: 10 }}>Tracking</div>

        <CheckRow label="Knocked"            val={knocked}          set={setKnocked} />
        <CheckRow label="Spoke to homeowner" val={spokeToHomeowner} set={setSpokeToHomeowner} />
        <CheckRow label="Membership sold"    val={membership}       set={setMembership} />

        <label style={LABEL_S}>Appointment date</label>
        <input type="datetime-local" value={appointment} onChange={e => setAppointment(e.target.value)} style={INPUT_S} />

        <label style={LABEL_S}>Follow-up date</label>
        <input type="date" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)} style={INPUT_S} />

        <label style={LABEL_S}>Notes</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="What happened at the door…" style={{ ...INPUT_S, minHeight: 80, resize: 'vertical' }} />

        <button onClick={save} style={{ width: '100%', marginTop: 18, ...BTN_G, padding: '12px' }}>Save</button>
      </div>
    </div>
  );
}

// ── Lead card (compact) ───────────────────────────────────────────────────────
function LeadCard({ lead, stopNum, onOpen }: { lead: PermitLead; stopNum?: number; onOpen: () => void }) {
  const pm = PRIORITY_META[lead.priority];
  const hasActivity = lead.knocked || lead.spokeToHomeowner || lead.membership || lead.appointment || lead.followUpDate || lead.notes;

  return (
    <div style={{ background: '#182019', border: `1px solid ${hasActivity ? '#2a3d32' : '#1e2820'}`, borderRadius: 10, padding: '12px 14px', cursor: 'pointer' }} onClick={onOpen}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
        <div style={{ flex: 1 }}>
          {/* Address row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            {stopNum !== undefined && (
              <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 13, fontWeight: 700, color: '#5d6b64', flexShrink: 0, marginTop: 2, minWidth: 20, textAlign: 'center' }}>{stopNum}</span>
            )}
            <div
              onClick={e => { e.stopPropagation(); openMaps(lead.address, lead.city); }}
              style={{ fontSize: 13.5, fontWeight: 500, color: '#8abfb0', textDecoration: 'underline', textDecorationColor: 'rgba(138,191,176,0.3)', lineHeight: 1.3 }}
            >
              {lead.address}
            </div>
          </div>

          {/* Year / age / priority */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5, flexWrap: 'wrap' }}>
            {lead.year > 0 && <span style={{ fontSize: 11, color: '#5d6b64' }}>{lead.year}</span>}
            {lead.systemAge !== null && <span style={{ fontSize: 11, color: '#7d8883' }}>~{lead.systemAge} yr system</span>}
            <span style={{ fontSize: 10.5, fontWeight: 700, background: pm.bg, color: pm.color, padding: '2px 8px', borderRadius: 20, letterSpacing: '.04em' }}>{pm.dot} {pm.label}</span>
          </div>

          {/* Contractor */}
          {lead.contractorName && (
            <div style={{ marginTop: 6, fontSize: 12, lineHeight: 1.4 }}>
              <span style={{ color: '#5d6b64', fontWeight: 600 }}>Last serviced by: </span>
              <span style={{ color: '#9caea5' }}>{lead.contractorName}</span>
              {lead.contractorPhone && (
                <span onClick={e => { e.stopPropagation(); }} style={{ color: '#7aacb8', marginLeft: 5 }}>
                  <a href={`tel:${lead.contractorPhone.replace(/\D/g,'')}`} style={{ color: 'inherit', textDecoration: 'none' }}>{lead.contractorPhone}</a>
                </span>
              )}
            </div>
          )}

          {/* Description */}
          {lead.description && (
            <div style={{ marginTop: 4, fontSize: 11, color: '#5d6b64', lineHeight: 1.4 }}>{lead.description}</div>
          )}
        </div>

        {/* Activity badges */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
          {lead.knocked         && <span style={{ fontSize: 9.5, fontWeight: 700, color: '#7d8883',  background: 'rgba(125,136,131,.15)', padding: '2px 7px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '.04em', whiteSpace: 'nowrap' }}>Knocked</span>}
          {lead.spokeToHomeowner && <span style={{ fontSize: 9.5, fontWeight: 700, color: '#dcb45c', background: 'rgba(220,180,92,.15)',  padding: '2px 7px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '.04em', whiteSpace: 'nowrap' }}>Spoke</span>}
          {lead.membership       && <span style={{ fontSize: 9.5, fontWeight: 700, color: '#6fae8f', background: 'rgba(111,174,143,.15)', padding: '2px 7px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '.04em', whiteSpace: 'nowrap' }}>Member</span>}
          {lead.appointment      && <span style={{ fontSize: 9.5, fontWeight: 700, color: '#5a8fd0', background: 'rgba(90,143,208,.15)',  padding: '2px 7px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '.04em', whiteSpace: 'nowrap' }}>Appt</span>}
        </div>
      </div>
    </div>
  );
}

// ── City lead list view ───────────────────────────────────────────────────────
function CityView({ city, allLeads, onBack, onUpdate }: {
  city: string; allLeads: PermitLead[];
  onBack: () => void; onUpdate: (leads: PermitLead[]) => void;
}) {
  const [yearFilter, setYearFilter]         = useState('all');
  const [contractorSearch, setContractorSearch] = useState('');
  const [routeMode, setRouteMode]           = useState(false);
  const [panelId, setPanelId]               = useState<string | null>(null);

  const cityLeads = useMemo(() => allLeads.filter(l => l.city === city), [allLeads, city]);
  const years = useMemo(() => [...new Set(cityLeads.map(l => l.year).filter(y => y > 0))].sort((a,b) => a - b), [cityLeads]);

  // Filter
  const filtered = useMemo(() => {
    let out = cityLeads;

    if (yearFilter === 'high')   out = out.filter(l => l.priority === 'high');
    else if (yearFilter === 'medium') out = out.filter(l => l.priority === 'medium');
    else if (yearFilter === 'low')    out = out.filter(l => l.priority === 'low');
    else if (yearFilter !== 'all') {
      const y = parseInt(yearFilter);
      out = out.filter(l => l.year === y);
    }

    if (contractorSearch.trim()) {
      const t = contractorSearch.trim().toLowerCase();
      out = out.filter(l => l.contractorName.toLowerCase().includes(t));
    }

    return out;
  }, [cityLeads, yearFilter, contractorSearch]);

  // Only show "Optimize Route" when all visible leads are high or medium
  const canOptimize = filtered.length > 0 && filtered.every(l => l.priority === 'high' || l.priority === 'medium');

  const displayed = useMemo(() => {
    if (routeMode && canOptimize) return optimizeRoute(filtered);
    return filtered;
  }, [filtered, routeMode, canOptimize]);

  const panelLead = allLeads.find(l => l.id === panelId) || null;

  function handleSave(updated: PermitLead) {
    const next = allLeads.map(l => l.id === updated.id ? updated : l);
    onUpdate(next);
  }

  // Counts
  const highCount   = cityLeads.filter(l => l.priority === 'high').length;
  const medCount    = cityLeads.filter(l => l.priority === 'medium').length;
  const lowCount    = cityLeads.filter(l => l.priority === 'low').length;
  const trackedCount = cityLeads.filter(l => l.knocked || l.spokeToHomeowner || l.appointment || l.membership).length;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <button onClick={() => { setRouteMode(false); onBack(); }} style={{ background: 'none', border: 'none', color: '#9caea5', fontSize: 20, cursor: 'pointer', padding: 0, lineHeight: 1 }}>←</button>
        <div>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 26, fontWeight: 700, lineHeight: 1 }}>{city}</div>
          <div style={{ fontSize: 11, color: '#5d6b64', marginTop: 3 }}>
            {cityLeads.length} leads · <span style={{ color: '#e05252' }}>🔴 {highCount} high</span> · <span style={{ color: '#dcb45c' }}>🟡 {medCount} med</span> · <span style={{ color: '#6fae8f' }}>🟢 {lowCount} low</span> · {trackedCount} logged
          </div>
        </div>
      </div>

      {/* Filters row */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <select
          value={yearFilter}
          onChange={e => { setYearFilter(e.target.value); setRouteMode(false); }}
          style={{ background: '#121815', border: '1px solid #232d28', color: '#eef3f0', padding: '8px 10px', borderRadius: 8, fontSize: 12.5, fontFamily: "'Inter',sans-serif", flex: '0 0 auto' }}
        >
          <option value="all">All years</option>
          <option value="high">🔴 High priority (2000–2011)</option>
          <option value="medium">🟡 Medium priority (2012–2015)</option>
          <option value="low">🟢 Low priority (2016–2026)</option>
          <option disabled>──────────────</option>
          {years.map(y => <option key={y} value={String(y)}>{y}</option>)}
        </select>

        <input
          type="text"
          placeholder="Search contractor…"
          value={contractorSearch}
          onChange={e => setContractorSearch(e.target.value)}
          style={{ ...INPUT_S, flex: 1, minWidth: 140, padding: '8px 12px', fontSize: 12.5 }}
        />

        {canOptimize && (
          <button
            onClick={() => setRouteMode(r => !r)}
            style={{ ...BTN_G, fontSize: 12, padding: '8px 12px', border: `1px solid ${routeMode ? '#5a8fd0' : '#5f8577'}`, color: routeMode ? '#5a8fd0' : '#8abfb0', whiteSpace: 'nowrap', flex: '0 0 auto' }}
          >
            {routeMode ? '📍 Route on' : '🗺 Optimize route'}
          </button>
        )}
      </div>

      {/* Result count */}
      <div style={{ fontSize: 11.5, color: '#5d6b64', marginBottom: 10 }}>
        {displayed.length} lead{displayed.length !== 1 ? 's' : ''}
        {routeMode && canOptimize && <span style={{ color: '#5a8fd0', marginLeft: 8 }}>● Route optimized</span>}
      </div>

      {/* Lead list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {displayed.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 20px', color: '#5d6b64', fontSize: 13 }}>No leads match your filters.</div>
        ) : (
          displayed.map((lead, idx) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              stopNum={routeMode && canOptimize ? idx + 1 : undefined}
              onOpen={() => setPanelId(lead.id)}
            />
          ))
        )}
      </div>

      {panelLead && (
        <TrackingPanel lead={panelLead} onClose={() => setPanelId(null)} onSave={l => { handleSave(l); setPanelId(null); }} />
      )}
    </div>
  );
}

// ── CSV Upload modal ──────────────────────────────────────────────────────────
function CSVUploadModal({ existing, onClose, onImport }: {
  existing: PermitLead[]; onClose: () => void; onImport: (leads: PermitLead[]) => void;
}) {
  const [preview, setPreview] = useState<PermitLead[]>([]);
  const [error, setError]     = useState('');
  const [mode, setMode]       = useState<'replace' | 'merge'>('merge');

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    setError('');
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const text = ev.target?.result as string;
      const rows = parsePermitCSV(text);
      if (!rows.length) {
        setError('No valid rows found. Check that your CSV has an Address column.');
        return;
      }
      setPreview(rows);
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function doImport() {
    if (mode === 'replace') {
      onImport(preview);
    } else {
      // Merge: keep existing tracking on known addresses, add new
      const existingMap = new Map(existing.map(l => [l.id, l]));
      const merged = preview.map(l => {
        const ex = existingMap.get(l.id);
        if (!ex) return l;
        return { ...l, knocked: ex.knocked, spokeToHomeowner: ex.spokeToHomeowner, appointment: ex.appointment, membership: ex.membership, followUpDate: ex.followUpDate, notes: ex.notes };
      });
      onImport(merged);
    }
  }

  // Cities in preview
  const cities = [...new Set(preview.map(l => l.city))].sort();

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(4,7,6,.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 50 }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: '#121815', border: '1px solid #324038', borderRadius: 14, width: '100%', maxWidth: 500, padding: 22, maxHeight: '92vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 24, fontWeight: 600 }}>Upload Permit Leads CSV</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#5d6b64', fontSize: 18, cursor: 'pointer', padding: 4 }}>✕</button>
        </div>

        <div style={{ fontSize: 12.5, color: '#5d6b64', marginBottom: 14, lineHeight: 1.7, background: '#0e1410', border: '1px solid #1e2820', borderRadius: 9, padding: '10px 13px' }}>
          Expected columns (order flexible):<br/>
          <code style={{ color: '#9caea5', fontSize: 11 }}>Address, City, Permit Issued, Year, Priority, Contractor Name, Contractor Phone, Description, Est. System Age (Yrs), Job Valuation, Lat, Lng</code>
          <br/><br/>
          Priority column optional — if missing, it's derived from Year (≤2011 High, ≤2015 Medium, else Low).
        </div>

        {!preview.length ? (
          <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed #232d28', borderRadius: 10, padding: '36px 20px', cursor: 'pointer', gap: 8 }}>
            <div style={{ fontSize: 32 }}>📄</div>
            <div style={{ fontSize: 13.5, color: '#9caea5', fontWeight: 500 }}>Tap to select your CSV file</div>
            <div style={{ fontSize: 11, color: '#5d6b64' }}>Supported: .csv or .txt</div>
            <input type="file" accept=".csv,.txt,text/csv,text/plain" onChange={handleFile} style={{ display: 'none' }} />
          </label>
        ) : (
          <>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 13, color: '#8abfb0', fontWeight: 600, marginBottom: 8 }}>{preview.length} leads found across {cities.length} {cities.length === 1 ? 'city' : 'cities'}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                {cities.map(c => {
                  const count = preview.filter(l => l.city === c).length;
                  const high = preview.filter(l => l.city === c && l.priority === 'high').length;
                  const med  = preview.filter(l => l.city === c && l.priority === 'medium').length;
                  return (
                    <div key={c} style={{ background: '#0e1410', border: '1px solid #1e2820', borderRadius: 8, padding: '7px 11px', fontSize: 12 }}>
                      <span style={{ color: '#eef3f0', fontWeight: 500 }}>{c}</span>
                      <span style={{ color: '#5d6b64', marginLeft: 6 }}>{count} leads</span>
                      {high > 0 && <span style={{ color: '#e05252', marginLeft: 5 }}>· 🔴{high}</span>}
                      {med  > 0 && <span style={{ color: '#dcb45c', marginLeft: 4 }}>· 🟡{med}</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {existing.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.08em', color: '#5d6b64', fontWeight: 600, marginBottom: 8 }}>Import mode</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {(['merge', 'replace'] as const).map(m => (
                    <div key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: '10px 12px', borderRadius: 9, border: `1px solid ${mode === m ? '#5f8577' : '#232d28'}`, background: mode === m ? 'rgba(138,191,176,0.08)' : '#182019', cursor: 'pointer' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: mode === m ? '#8abfb0' : '#9caea5', marginBottom: 2 }}>{m === 'merge' ? 'Merge' : 'Replace'}</div>
                      <div style={{ fontSize: 11, color: '#5d6b64' }}>{m === 'merge' ? 'Keep existing notes & tracking' : 'Start fresh, overwrite all'}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={doImport} style={{ flex: 1, ...BTN_G, padding: '12px' }}>Import {preview.length} leads</button>
              <button onClick={() => setPreview([])} style={{ flex: 1, ...BTN_GR, padding: '12px' }}>Re-upload</button>
            </div>
          </>
        )}

        {error && <div style={{ color: '#e05252', fontSize: 12, marginTop: 12 }}>{error}</div>}
      </div>
    </div>
  );
}

// ── Main PermitLeads component ────────────────────────────────────────────────
export default function PermitLeads() {
  const [leads, setLeads]         = useState<PermitLead[]>(loadPermitLeads);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [uploadOpen, setUploadOpen]     = useState(false);

  function handleImport(imported: PermitLead[]) {
    setLeads(imported);
    savePermitLeads(imported);
    setUploadOpen(false);
  }

  function handleUpdate(updated: PermitLead[]) {
    setLeads(updated);
    savePermitLeads(updated);
  }

  // City index
  const cities = useMemo(() => {
    const map: Record<string, { count: number; high: number; medium: number; low: number; logged: number }> = {};
    for (const l of leads) {
      if (!map[l.city]) map[l.city] = { count: 0, high: 0, medium: 0, low: 0, logged: 0 };
      map[l.city].count++;
      map[l.city][l.priority]++;
      if (l.knocked || l.spokeToHomeowner || l.appointment || l.membership) map[l.city].logged++;
    }
    return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0]));
  }, [leads]);

  // City view
  if (selectedCity) {
    return (
      <CityView
        city={selectedCity}
        allLeads={leads}
        onBack={() => setSelectedCity(null)}
        onUpdate={handleUpdate}
      />
    );
  }

  // City index / empty state
  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 26, fontWeight: 700, lineHeight: 1 }}>Permit Leads</div>
          {leads.length > 0 && (
            <div style={{ fontSize: 11.5, color: '#5d6b64', marginTop: 4 }}>
              {leads.length} leads across {cities.length} {cities.length === 1 ? 'city' : 'cities'}
            </div>
          )}
        </div>
        <button onClick={() => setUploadOpen(true)} style={{ ...BTN_G, fontSize: 13 }}>⬆ Upload CSV</button>
      </div>

      {/* Cities */}
      {cities.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 20px', border: '2px dashed #1e2820', borderRadius: 12 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🏠</div>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 22, fontWeight: 600, marginBottom: 8 }}>No permit leads yet</div>
          <div style={{ fontSize: 13, color: '#5d6b64', lineHeight: 1.6, marginBottom: 20 }}>
            Upload your permit leads CSV to get started.<br/>
            Each city will appear as a tappable card.
          </div>
          <button onClick={() => setUploadOpen(true)} style={{ ...BTN_G, fontSize: 14, padding: '11px 20px' }}>Upload CSV</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {cities.map(([city, stats]) => {
            const pct = stats.count > 0 ? Math.round((stats.logged / stats.count) * 100) : 0;
            return (
              <div
                key={city}
                onClick={() => setSelectedCity(city)}
                style={{ background: '#121815', border: '1px solid #232d28', borderRadius: 12, padding: '16px 18px', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                  <div>
                    <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 22, fontWeight: 600, marginBottom: 6 }}>{city}</div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{ fontSize: 12.5, color: '#9caea5' }}>{stats.count} leads</span>
                      {stats.high   > 0 && <span style={{ fontSize: 11.5, color: '#e05252' }}>🔴 {stats.high} high</span>}
                      {stats.medium > 0 && <span style={{ fontSize: 11.5, color: '#dcb45c' }}>🟡 {stats.medium} med</span>}
                      {stats.low    > 0 && <span style={{ fontSize: 11.5, color: '#6fae8f' }}>🟢 {stats.low} low</span>}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 28, fontWeight: 700, color: pct === 100 && stats.count > 0 ? '#6fae8f' : '#eef3f0', lineHeight: 1 }}>{pct}%</div>
                    <div style={{ fontSize: 10, color: '#5d6b64', textTransform: 'uppercase', letterSpacing: '.06em', marginTop: 2 }}>logged</div>
                  </div>
                </div>
                {stats.count > 0 && (
                  <div style={{ marginTop: 10, height: 4, borderRadius: 2, background: '#182019', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 2, background: '#8abfb0', width: pct + '%', transition: 'width .4s' }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {leads.length > 0 && (
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <button onClick={() => setUploadOpen(true)} style={{ ...BTN_GR, fontSize: 12, padding: '7px 14px' }}>Re-upload / update CSV</button>
        </div>
      )}

      {uploadOpen && (
        <CSVUploadModal existing={leads} onClose={() => setUploadOpen(false)} onImport={handleImport} />
      )}
    </div>
  );
}
