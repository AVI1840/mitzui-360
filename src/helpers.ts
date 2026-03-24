/**
 * מיצוי 360 — פונקציות עזר
 */
import type { DS, Urg } from './types';

// ═══════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════
export const rel = (s: DS) => s === 'relevant' || s === 'check';
export const CY = new Date().getFullYear();
export const inMonths = (n: number) => {
  const d = new Date();
  d.setMonth(d.getMonth() + n);
  return d.toLocaleDateString('he-IL', { month: 'long', year: 'numeric' });
};

// ═══════════════════════════════════════════════
// UI HELPERS
// ═══════════════════════════════════════════════
export const uLbl = (u: Urg) => u === 'urgent' ? 'דחוף' : u === 'within30' ? 'תוך 30 יום' : 'לתכנון';
export const uClr = (u: Urg) =>
  u === 'urgent' ? 'bg-red-100 text-red-800 border-red-300' :
  u === 'within30' ? 'bg-amber-100 text-amber-800 border-amber-300' :
  'bg-sky-100 text-sky-800 border-sky-300';
export const uDot = (u: Urg) =>
  u === 'urgent' ? 'bg-red-500' :
  u === 'within30' ? 'bg-amber-500' :
  'bg-sky-500';
