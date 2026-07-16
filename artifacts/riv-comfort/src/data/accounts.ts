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
];

export const STATUS_DEFS = [
  { key: 'nothome', label: 'Not home', color: '#7d8883' },
  { key: 'interested', label: 'Interested', color: '#dcb45c' },
  { key: 'callback', label: 'Callback', color: '#d08a52' },
  { key: 'closed', label: 'Closed', color: '#6fae8f' },
  { key: 'dq', label: 'DQ', color: '#a15a5a' },
];

export interface StoredLead {
  id: number;
  name: string;
  address: string;
  city?: string;
  phone: string;
  repUsername: string;
  status: string | null;
  notes: string;
  appointment: string;
  photos: string[];
  repOverridden?: boolean;
}

export const LEADS_KEY = 'rivcomfort_leads_v2';
export const SESSION_KEY = 'rivcomfort_session_v1';
export const REPS_KEY = 'rivcomfort_reps_v1';
export const CITY_ASSIGN_KEY = 'rivcomfort_city_assignments_v1';
