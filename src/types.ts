/**
 * מיצוי 360 — טיפוסים
 */

export type AT = 'boolean' | 'number' | 'text' | 'select';
export type DS = 'relevant' | 'not_relevant' | 'check' | null;
export type Urg = 'urgent' | 'within30' | 'planning';
export type A = Record<string, any>;
export type SMap = Record<string, DS>;

export interface Q {
  id: string;
  text: string;
  at: AT;
  opts?: string[];
  showIf?: (a: A) => boolean;
  warn?: (a: A) => string | null;
  info?: string;
  ok?: (a: A) => string | null;
}

export interface AR {
  urg: Urg;
  cond: (a: A, s: SMap) => boolean;
  text: string | ((a: A) => string);
  tag?: string;
}

export interface TR {
  cond: (a: A) => boolean;
  text: string;
  fix?: string;
}

export interface RB {
  name: string;
  body: string;
  note?: string;
}

export interface Domain {
  id: string;
  n: string;
  b: string;
  am: string;
  ds: string;
  priority?: 'high' | 'medium';
  scanOnly?: boolean;
  qs: Q[];
  ars: AR[];
  trs?: TR[];
  related?: RB[];
}

export interface Scenario {
  id: string;
  name: string;
  icon: string;
  profile: string;
  active: boolean;
  color: string;
  domains: Domain[];
}

// ═══════════════════════════════════════════════
// FEEDBACK TYPES
// ═══════════════════════════════════════════════
export type FeedbackCategory = 'professional' | 'ux' | 'process' | 'data';
export type FeedbackSeverity = 'critical' | 'improvement' | 'minor';

export interface FeedbackEntry {
  id: number;
  category: FeedbackCategory;
  severity: FeedbackSeverity;
  screen: string;
  description: string;
  suggestion: string;
  ts: string;
}
