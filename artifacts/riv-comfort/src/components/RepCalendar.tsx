import { useState, useMemo } from 'react';
import { StoredLead, CalendarEvent, CALENDAR_KEY } from '@/data/accounts';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function toYMD(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function parseYMD(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function fmt12(time: string) {
  if (!time) return '';
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m).padStart(2,'0')} ${ampm}`;
}

function loadEvents(repUsername: string): CalendarEvent[] {
  try {
    const r = localStorage.getItem(CALENDAR_KEY);
    if (r) {
      const all: CalendarEvent[] = JSON.parse(r);
      return all.filter(e => e.repUsername === repUsername);
    }
  } catch {}
  return [];
}
function saveEvents(repUsername: string, myEvents: CalendarEvent[]) {
  try {
    const r = localStorage.getItem(CALENDAR_KEY);
    const all: CalendarEvent[] = r ? JSON.parse(r) : [];
    const others = all.filter(e => e.repUsername !== repUsername);
    localStorage.setItem(CALENDAR_KEY, JSON.stringify([...others, ...myEvents]));
  } catch {}
}

// Admin: load all reps' events
export function loadAllEvents(): CalendarEvent[] {
  try {
    const r = localStorage.getItem(CALENDAR_KEY);
    return r ? JSON.parse(r) : [];
  } catch { return []; }
}

const INPUT_S: React.CSSProperties = {
  width: '100%', background: '#182019', border: '1px solid #232d28',
  color: '#eef3f0', padding: '10px 12px', borderRadius: 9,
  fontSize: 13.5, fontFamily: "'Inter', sans-serif", boxSizing: 'border-box',
};
const LABEL_S: React.CSSProperties = {
  fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em',
  color: '#5d6b64', marginTop: 16, marginBottom: 6, fontWeight: 600, display: 'block',
};

interface Props {
  repUsername: string;
  repName: string;
  leads: StoredLead[]; // all leads visible to this rep
}

interface AddFormState {
  title: string; date: string; time: string; notes: string;
}

export default function RepCalendar({ repUsername, repName, leads }: Props) {
  const today = new Date();
  const todayYMD = toYMD(today);

  const [view, setView] = useState<'month' | 'week'>('month');
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState<string | null>(todayYMD);
  const [events, setEvents] = useState<CalendarEvent[]>(() => loadEvents(repUsername));
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<AddFormState>({ title: '', date: todayYMD, time: '', notes: '' });

  // Auto-pull appointments from leads
  const leadEvents = useMemo<CalendarEvent[]>(() => {
    return leads
      .filter(l => l.appointment)
      .map(l => {
        const d = new Date(l.appointment);
        if (isNaN(d.getTime())) return null;
        const date = toYMD(d);
        const time = `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
        return {
          id: `lead-${l.id}`,
          title: l.name,
          date,
          time: time === '00:00' ? '' : time,
          notes: l.address,
          linkedLeadId: l.id,
          repUsername,
        } as CalendarEvent;
      })
      .filter(Boolean) as CalendarEvent[];
  }, [leads, repUsername]);

  const allEvents = useMemo(() => [...leadEvents, ...events], [leadEvents, events]);

  function eventsByDay(ymd: string) {
    return allEvents.filter(e => e.date === ymd).sort((a, b) => a.time.localeCompare(b.time));
  }

  function saveNewEvent() {
    if (!form.title.trim() || !form.date) return;
    const e: CalendarEvent = {
      id: `manual-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title: form.title.trim(),
      date: form.date,
      time: form.time,
      notes: form.notes.trim(),
      repUsername,
    };
    const next = [...events, e];
    setEvents(next);
    saveEvents(repUsername, next);
    setShowAdd(false);
    setForm({ title: '', date: todayYMD, time: '', notes: '' });
    setSelectedDay(form.date);
  }

  function deleteEvent(id: string) {
    const next = events.filter(e => e.id !== id);
    setEvents(next);
    saveEvents(repUsername, next);
  }

  // ── Month view ──────────────────────────────────────────────────────────────
  function MonthView() {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstDow = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: (string | null)[] = [
      ...Array(firstDow).fill(null),
      ...Array.from({ length: daysInMonth }, (_, i) => {
        const d = new Date(year, month, i + 1);
        return toYMD(d);
      }),
    ];
    // pad to complete rows
    while (cells.length % 7 !== 0) cells.push(null);

    return (
      <div>
        {/* Day-of-week header */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, marginBottom: 4 }}>
          {DAYS.map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: 10, color: '#5d6b64', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', padding: '4px 0' }}>{d}</div>
          ))}
        </div>
        {/* Weeks */}
        {Array.from({ length: cells.length / 7 }, (_, wi) => (
          <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, marginBottom: 2 }}>
            {cells.slice(wi * 7, wi * 7 + 7).map((ymd, di) => {
              if (!ymd) return <div key={di} />;
              const dayEvts = eventsByDay(ymd);
              const isToday = ymd === todayYMD;
              const isSelected = ymd === selectedDay;
              const dayNum = parseYMD(ymd).getDate();
              return (
                <div
                  key={ymd}
                  onClick={() => setSelectedDay(prev => prev === ymd ? null : ymd)}
                  style={{
                    minHeight: 52, padding: '5px 4px', borderRadius: 8, cursor: 'pointer',
                    background: isSelected ? '#1a2e26' : isToday ? '#182019' : '#121815',
                    border: `1px solid ${isSelected ? '#5f8577' : isToday ? '#324038' : '#1a2220'}`,
                    position: 'relative',
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: isToday ? 700 : 400, color: isToday ? '#8abfb0' : '#9caea5', marginBottom: 3 }}>{dayNum}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    {dayEvts.slice(0, 3).map(e => (
                      <div key={e.id} style={{ width: 6, height: 6, borderRadius: '50%', background: e.linkedLeadId ? '#5a8fd0' : '#8abfb0', flexShrink: 0 }} />
                    ))}
                    {dayEvts.length > 3 && <div style={{ fontSize: 8, color: '#5d6b64' }}>+{dayEvts.length - 3}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  // ── Week view ───────────────────────────────────────────────────────────────
  function WeekView() {
    const dow = cursor.getDay();
    const weekStart = new Date(cursor);
    weekStart.setDate(cursor.getDate() - dow);
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      return { ymd: toYMD(d), d };
    });
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {days.map(({ ymd, d }) => {
          const dayEvts = eventsByDay(ymd);
          const isToday = ymd === todayYMD;
          const isSelected = ymd === selectedDay;
          return (
            <div
              key={ymd}
              onClick={() => setSelectedDay(prev => prev === ymd ? null : ymd)}
              style={{ border: `1px solid ${isSelected ? '#5f8577' : isToday ? '#324038' : '#1a2220'}`, borderRadius: 10, padding: '10px 14px', background: isSelected ? '#1a2e26' : '#121815', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.08em', color: '#5d6b64', fontWeight: 600 }}>{DAYS[d.getDay()]} </span>
                  <span style={{ fontSize: 15, fontWeight: isToday ? 700 : 500, color: isToday ? '#8abfb0' : '#eef3f0' }}>{d.getDate()}</span>
                </div>
                {dayEvts.length > 0 && (
                  <div style={{ fontSize: 11, color: '#5a8fd0', fontWeight: 600 }}>{dayEvts.length} event{dayEvts.length !== 1 ? 's' : ''}</div>
                )}
              </div>
              {isSelected && dayEvts.length > 0 && (
                <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {dayEvts.map(e => (
                    <EventRow key={e.id} event={e} onDelete={e.linkedLeadId ? undefined : () => deleteEvent(e.id)} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  function EventRow({ event, onDelete }: { event: CalendarEvent; onDelete?: () => void }) {
    return (
      <div style={{ background: '#0e1410', border: '1px solid #1e2820', borderRadius: 8, padding: '8px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: event.linkedLeadId ? '#5a8fd0' : '#8abfb0', flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#eef3f0' }}>{event.title}</span>
            {event.time && <span style={{ fontSize: 11, color: '#8abfb0' }}>{fmt12(event.time)}</span>}
            {event.linkedLeadId && <span style={{ fontSize: 10, background: '#5a8fd020', color: '#5a8fd0', padding: '2px 6px', borderRadius: 10 }}>Lead</span>}
          </div>
          {event.notes && <div style={{ fontSize: 11.5, color: '#9caea5', marginTop: 4, lineHeight: 1.4 }}>{event.notes}</div>}
        </div>
        {onDelete && (
          <button onClick={e => { e.stopPropagation(); onDelete(); }} style={{ background: 'none', border: 'none', color: '#5d6b64', fontSize: 14, cursor: 'pointer', padding: '0 2px', lineHeight: 1 }}>✕</button>
        )}
      </div>
    );
  }

  // Navigate
  function prev() {
    if (view === 'month') {
      setCursor(c => new Date(c.getFullYear(), c.getMonth() - 1, 1));
    } else {
      setCursor(c => { const d = new Date(c); d.setDate(d.getDate() - 7); return d; });
    }
  }
  function next() {
    if (view === 'month') {
      setCursor(c => new Date(c.getFullYear(), c.getMonth() + 1, 1));
    } else {
      setCursor(c => { const d = new Date(c); d.setDate(d.getDate() + 7); return d; });
    }
  }

  const selectedDayEvents = selectedDay ? eventsByDay(selectedDay) : [];

  return (
    <div>
      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={prev} style={{ background: '#121815', border: '1px solid #232d28', color: '#9caea5', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>‹</button>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 20, fontWeight: 600, minWidth: 160, textAlign: 'center' }}>
            {view === 'month'
              ? `${MONTHS[cursor.getMonth()]} ${cursor.getFullYear()}`
              : (() => {
                  const dow = cursor.getDay();
                  const ws = new Date(cursor); ws.setDate(cursor.getDate() - dow);
                  const we = new Date(ws); we.setDate(ws.getDate() + 6);
                  return `${MONTHS[ws.getMonth()].slice(0,3)} ${ws.getDate()} – ${MONTHS[we.getMonth()].slice(0,3)} ${we.getDate()}`;
                })()
            }
          </div>
          <button onClick={next} style={{ background: '#121815', border: '1px solid #232d28', color: '#9caea5', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>›</button>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['month','week'] as const).map(v => (
            <button key={v} onClick={() => setView(v)} style={{ background: view === v ? '#1a2e26' : '#121815', border: `1px solid ${view === v ? '#5f8577' : '#232d28'}`, color: view === v ? '#8abfb0' : '#9caea5', padding: '6px 14px', borderRadius: 8, fontSize: 12, fontFamily: "'Inter',sans-serif", cursor: 'pointer', textTransform: 'capitalize' }}>{v}</button>
          ))}
          <button onClick={() => { setForm(f => ({ ...f, date: todayYMD })); setShowAdd(true); }} style={{ background: '#121815', border: '1px solid #5f8577', color: '#8abfb0', padding: '6px 14px', borderRadius: 8, fontSize: 12, fontFamily: "'Inter',sans-serif", cursor: 'pointer', fontWeight: 600 }}>+ Event</button>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#5d6b64' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#5a8fd0' }} /> Lead appt
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#5d6b64' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#8abfb0' }} /> My event
        </div>
      </div>

      {/* Calendar grid */}
      {view === 'month' ? <MonthView /> : <WeekView />}

      {/* Selected day events (month view) */}
      {view === 'month' && selectedDay && (
        <div style={{ marginTop: 14, background: '#0e1410', border: '1px solid #1e2820', borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#8abfb0', marginBottom: 10 }}>
            {parseYMD(selectedDay).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
          {selectedDayEvents.length === 0
            ? <div style={{ fontSize: 13, color: '#5d6b64' }}>No events — <span onClick={() => { setForm(f => ({ ...f, date: selectedDay })); setShowAdd(true); }} style={{ color: '#8abfb0', cursor: 'pointer', textDecoration: 'underline' }}>add one</span></div>
            : <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {selectedDayEvents.map(e => <EventRow key={e.id} event={e} onDelete={e.linkedLeadId ? undefined : () => deleteEvent(e.id)} />)}
              </div>
          }
        </div>
      )}

      {/* Add event modal */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(4,7,6,.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 60 }} onClick={e => { if (e.target === e.currentTarget) setShowAdd(false); }}>
          <div style={{ background: '#121815', border: '1px solid #324038', borderRadius: 14, width: '100%', maxWidth: 420, padding: 22 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 22, fontWeight: 600 }}>Add event</div>
              <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', color: '#5d6b64', fontSize: 18, cursor: 'pointer' }}>✕</button>
            </div>
            <label style={LABEL_S}>Title</label>
            <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Appointment with…" style={INPUT_S} />
            <label style={LABEL_S}>Date</label>
            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={INPUT_S} />
            <label style={LABEL_S}>Time (optional)</label>
            <input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} style={INPUT_S} />
            <label style={LABEL_S}>Notes (optional)</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Any details…" style={{ ...INPUT_S, minHeight: 70, resize: 'vertical' }} />
            <button onClick={saveNewEvent} disabled={!form.title.trim() || !form.date} style={{ width: '100%', marginTop: 18, background: '#121815', border: '1px solid #5f8577', color: '#8abfb0', padding: '11px 14px', borderRadius: 8, fontSize: 13.5, fontFamily: "'Inter',sans-serif", fontWeight: 600, cursor: 'pointer', opacity: !form.title.trim() || !form.date ? 0.5 : 1 }}>Save event</button>
          </div>
        </div>
      )}
    </div>
  );
}
