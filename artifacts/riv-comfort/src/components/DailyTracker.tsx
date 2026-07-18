import { useState, useMemo } from 'react';
import { DailyEntry, TRACKER_KEY, Account } from '@/data/accounts';

function todayYMD() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function fmtDate(ymd: string) {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function loadEntries(): DailyEntry[] {
  try { const r = localStorage.getItem(TRACKER_KEY); return r ? JSON.parse(r) : []; } catch { return []; }
}
function saveEntries(entries: DailyEntry[]) {
  try { localStorage.setItem(TRACKER_KEY, JSON.stringify(entries)); } catch {}
}

const METRICS: { key: keyof Omit<DailyEntry, 'repUsername' | 'date'>; label: string; color: string }[] = [
  { key: 'doorsKnocked',    label: 'Doors knocked',   color: '#9caea5' },
  { key: 'notHome',         label: 'Not home',         color: '#7d8883' },
  { key: 'notInterested',   label: 'Not interested',   color: '#a15a5a' },
  { key: 'appointmentsSet', label: 'Appts set',        color: '#5a8fd0' },
  { key: 'appointmentsSat', label: 'Appts sat',        color: '#dcb45c' },
  { key: 'dealsClosed',     label: 'Deals closed',     color: '#6fae8f' },
];

const BLANK: Omit<DailyEntry, 'repUsername' | 'date'> = {
  doorsKnocked: 0, notHome: 0, notInterested: 0,
  appointmentsSet: 0, appointmentsSat: 0, dealsClosed: 0,
};

const INPUT_S: React.CSSProperties = {
  width: '100%', background: '#182019', border: '1px solid #232d28',
  color: '#eef3f0', padding: '10px 12px', borderRadius: 9,
  fontSize: 14, fontFamily: "'Inter', sans-serif", textAlign: 'center',
  boxSizing: 'border-box',
};

// ── Rep tracker ───────────────────────────────────────────────────────────────
export function RepTracker({ repUsername, repName }: { repUsername: string; repName: string }) {
  const today = todayYMD();
  const [allEntries, setAllEntries] = useState<DailyEntry[]>(loadEntries);
  const [historyOpen, setHistoryOpen] = useState(false);

  const myEntries = useMemo(() =>
    allEntries.filter(e => e.repUsername === repUsername).sort((a, b) => b.date.localeCompare(a.date)),
  [allEntries, repUsername]);

  const todayEntry = myEntries.find(e => e.date === today);
  const [draft, setDraft] = useState<Omit<DailyEntry, 'repUsername' | 'date'>>(
    todayEntry ? { ...todayEntry } : { ...BLANK }
  );

  function save() {
    const entry: DailyEntry = { repUsername, date: today, ...draft };
    const next = allEntries.filter(e => !(e.repUsername === repUsername && e.date === today));
    const updated = [...next, entry];
    setAllEntries(updated);
    saveEntries(updated);
  }

  function setMetric(key: keyof typeof BLANK, val: number) {
    setDraft(d => ({ ...d, [key]: Math.max(0, isNaN(val) ? 0 : val) }));
  }

  const closeRate = draft.appointmentsSet > 0
    ? Math.round((draft.dealsClosed / draft.appointmentsSet) * 100) : 0;
  const contactRate = draft.doorsKnocked > 0
    ? Math.round(((draft.doorsKnocked - draft.notHome) / draft.doorsKnocked) * 100) : 0;

  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 22, fontWeight: 600, marginBottom: 4 }}>Today's numbers</div>
        <div style={{ fontSize: 12, color: '#5d6b64' }}>{fmtDate(today)}</div>
      </div>

      {/* Input grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        {METRICS.map(m => (
          <div key={m.key} style={{ background: '#121815', border: '1px solid #232d28', borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.08em', color: m.color, fontWeight: 600, marginBottom: 8 }}>{m.label}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <button onClick={() => setMetric(m.key, draft[m.key] - 1)} style={{ width: 32, height: 32, borderRadius: 8, background: '#182019', border: '1px solid #232d28', color: '#9caea5', fontSize: 18, cursor: 'pointer', lineHeight: 1 }}>−</button>
              <input
                type="number"
                value={draft[m.key]}
                onChange={e => setMetric(m.key, parseInt(e.target.value))}
                style={{ ...INPUT_S, width: 60, padding: '6px 8px' }}
              />
              <button onClick={() => setMetric(m.key, draft[m.key] + 1)} style={{ width: 32, height: 32, borderRadius: 8, background: '#182019', border: '1px solid #232d28', color: '#8abfb0', fontSize: 18, cursor: 'pointer', lineHeight: 1 }}>+</button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        <div style={{ background: '#0e1a14', border: '1px solid #1e2e24', borderRadius: 10, padding: '10px 14px', textAlign: 'center' }}>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 28, fontWeight: 700, color: '#6fae8f' }}>{contactRate}%</div>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.08em', color: '#5d6b64', marginTop: 2 }}>Contact rate</div>
        </div>
        <div style={{ background: '#0e1a14', border: '1px solid #1e2e24', borderRadius: 10, padding: '10px 14px', textAlign: 'center' }}>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 28, fontWeight: 700, color: '#dcb45c' }}>{closeRate}%</div>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.08em', color: '#5d6b64', marginTop: 2 }}>Close rate</div>
        </div>
      </div>

      <button onClick={save} style={{ width: '100%', background: '#121815', border: '1px solid #5f8577', color: '#8abfb0', padding: '13px', borderRadius: 9, fontSize: 14, fontFamily: "'Inter',sans-serif", fontWeight: 600, cursor: 'pointer', marginBottom: 20 }}>
        Save today's numbers
      </button>

      {/* History */}
      <div>
        <button onClick={() => setHistoryOpen(o => !o)} style={{ background: 'none', border: 'none', color: '#9caea5', fontSize: 13, cursor: 'pointer', fontFamily: "'Inter',sans-serif", padding: 0, display: 'flex', alignItems: 'center', gap: 6, marginBottom: historyOpen ? 12 : 0 }}>
          <span style={{ display: 'inline-block', transition: 'transform .12s', transform: historyOpen ? 'rotate(90deg)' : 'none' }}>▶</span>
          History ({myEntries.length} days)
        </button>
        {historyOpen && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {myEntries.length === 0 && <div style={{ fontSize: 13, color: '#5d6b64', padding: '16px 0' }}>No history yet.</div>}
            {myEntries.map(e => (
              <HistoryRow key={e.date} entry={e} isToday={e.date === today} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function HistoryRow({ entry, isToday }: { entry: DailyEntry; isToday: boolean }) {
  const [open, setOpen] = useState(false);
  const cr = entry.doorsKnocked > 0 ? Math.round(((entry.doorsKnocked - entry.notHome) / entry.doorsKnocked) * 100) : 0;
  return (
    <div style={{ border: '1px solid #1e2820', borderRadius: 10, background: '#0e1410', overflow: 'hidden' }}>
      <div onClick={() => setOpen(o => !o)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', cursor: 'pointer' }}>
        <div>
          <span style={{ fontSize: 13, fontWeight: 500, color: isToday ? '#8abfb0' : '#eef3f0' }}>{fmtDate(entry.date)}</span>
          {isToday && <span style={{ marginLeft: 8, fontSize: 10, background: '#8abfb020', color: '#8abfb0', padding: '2px 7px', borderRadius: 8 }}>today</span>}
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#9caea5' }}>{entry.doorsKnocked} 🚪</span>
          <span style={{ fontSize: 12, color: '#5a8fd0' }}>{entry.appointmentsSet} appts</span>
          <span style={{ fontSize: 12, color: '#6fae8f' }}>{entry.dealsClosed} closed</span>
          <span style={{ fontSize: 11, color: '#5d6b64', transition: 'transform .12s', display: 'inline-block', transform: open ? 'rotate(90deg)' : 'none' }}>▶</span>
        </div>
      </div>
      {open && (
        <div style={{ padding: '0 14px 12px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
          {METRICS.map(m => (
            <div key={m.key} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 22, fontWeight: 700, color: m.color }}>{entry[m.key]}</div>
              <div style={{ fontSize: 9.5, textTransform: 'uppercase', letterSpacing: '.06em', color: '#5d6b64' }}>{m.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Admin dashboard ───────────────────────────────────────────────────────────
export function AdminTrackerDashboard({ repOptions }: { repOptions: Account[] }) {
  const today = todayYMD();
  const [date, setDate] = useState(today);
  const [allEntries] = useState<DailyEntry[]>(loadEntries);

  const entriesForDate = useMemo(() =>
    allEntries.filter(e => e.date === date),
  [allEntries, date]);

  const totals = useMemo(() => METRICS.reduce((acc, m) => {
    acc[m.key] = entriesForDate.reduce((s, e) => s + (e[m.key] || 0), 0);
    return acc;
  }, {} as Record<string, number>), [entriesForDate]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 22, fontWeight: 600 }}>Rep numbers</div>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ background: '#121815', border: '1px solid #232d28', color: '#eef3f0', padding: '8px 12px', borderRadius: 8, fontSize: 13, fontFamily: "'Inter',sans-serif" }} />
      </div>

      {/* Totals row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 18 }}>
        {METRICS.map(m => (
          <div key={m.key} style={{ background: '#0e1410', border: '1px solid #1e2820', borderRadius: 9, padding: '10px 12px', textAlign: 'center' }}>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 24, fontWeight: 700, color: m.color }}>{totals[m.key] || 0}</div>
            <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '.06em', color: '#5d6b64', marginTop: 2 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Per-rep rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {repOptions.map(rep => {
          const entry = entriesForDate.find(e => e.repUsername === rep.username);
          const cr = entry && entry.doorsKnocked > 0
            ? Math.round(((entry.doorsKnocked - entry.notHome) / entry.doorsKnocked) * 100) : 0;
          return (
            <div key={rep.username} style={{ border: '1px solid #1e2820', borderRadius: 10, background: '#0e1410', padding: '12px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: entry ? 10 : 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 500, color: entry ? '#eef3f0' : '#5d6b64' }}>{rep.name}</div>
                {!entry && <div style={{ fontSize: 11, color: '#5d6b64' }}>No entry</div>}
                {entry && <div style={{ fontSize: 11, color: '#6fae8f', fontWeight: 600 }}>{cr}% contact</div>}
              </div>
              {entry && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 4 }}>
                  {METRICS.map(m => (
                    <div key={m.key} style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 20, fontWeight: 700, color: m.color }}>{entry[m.key]}</div>
                      <div style={{ fontSize: 8.5, textTransform: 'uppercase', letterSpacing: '.04em', color: '#5d6b64', lineHeight: 1.2 }}>{m.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
