export interface Account {
  username: string;
  password: string;
  role: 'admin' | 'rep';
  name: string;
  isCloser?: boolean;
}

export const DEFAULT_ACCOUNTS: Account[] = [
  { username: 'admin', password: 'admin123', role: 'admin', name: 'Admin' },
  { username: 'wsilva', password: 'admin123', role: 'admin', isCloser: true, name: 'Will Silva' },
  { username: 'vsilva', password: 'sales123', role: 'rep', name: 'Vic Silva' },
  { username: 'msetzer', password: 'sales123', role: 'rep', name: 'Miles Setzer' },
  { username: 'jsmith', password: 'sales123', role: 'rep', name: 'Jonathan Smith' },
  { username: 'athomas', password: 'sales123', role: 'rep', name: 'Atreyu Thomas' },
  { username: 'cbuckland', password: 'sales123', role: 'rep', name: 'Chris Buckland' },
  { username: 'arusso', password: 'sales123', role: 'rep', name: 'Antonio Russo' },
  { username: 'afuller', password: 'sales123', role: 'rep', name: 'Andrew Fuller' },
];

export const STATUS_DEFS = [
  { key: 'nothome',    label: 'Not home',   color: '#7d8883' },
  { key: 'interested', label: 'Interested', color: '#dcb45c' },
  { key: 'callback',   label: 'Callback',   color: '#d08a52' },
  { key: 'apptset',    label: 'Appt set',   color: '#5a8fd0' },
  { key: 'closed',     label: 'Closed',     color: '#6fae8f' },
  { key: 'dq',         label: 'DQ',         color: '#a15a5a' },
  { key: 'nogo',       label: 'No go',      color: '#6b4f7a' },
];

export type LeadType = 'be' | 'funnel' | 'personal';

export interface LogEntry {
  timestamp: string;
  status: string | null;
  notes: string;
  byUsername: string;
  byName: string;
}

export interface StoredLead {
  id: number;
  name: string;
  address: string;
  city?: string;
  phone: string;
  category?: string;
  repUsername: string;
  status: string | null;
  notes: string;
  appointment: string;
  photos: string[];
  repOverridden?: boolean;
  fromList?: boolean;
  leadType?: LeadType;
  log?: LogEntry[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;   // YYYY-MM-DD
  time: string;   // HH:MM or ''
  notes: string;
  linkedLeadId?: number;
  repUsername: string;
}

export interface DailyEntry {
  repUsername: string;
  date: string; // YYYY-MM-DD
  doorsKnocked: number;
  notHome: number;
  notInterested: number;
  appointmentsSet: number;
  appointmentsSat: number;
  dealsClosed: number;
}

export interface PermitLead {
  id: string;
  address: string;
  city: string;
  permitIssued: string;
  year: number;
  priority: 'high' | 'medium' | 'low';
  contractorName: string;
  contractorPhone: string;
  description: string;
  systemAge: number | null;
  jobValuation: number | null;
  lat: number | null;
  lng: number | null;
  // Tracking fields
  knocked: boolean;
  spokeToHomeowner: boolean;
  appointment: string;
  membership: boolean;
  followUpDate: string;
  notes: string;
}

export const LEADS_KEY        = 'rivcomfort_leads_v2';
export const SESSION_KEY      = 'rivcomfort_session_v1';
export const REPS_KEY         = 'rivcomfort_reps_v1';
export const CITY_ASSIGN_KEY  = 'rivcomfort_city_assignments_v1';
export const CALENDAR_KEY     = 'rivcomfort_calendar_v1';
export const TRACKER_KEY      = 'rivcomfort_tracker_v1';
export const PERMIT_LEADS_KEY = 'rivcomfort_permit_leads_v1';
