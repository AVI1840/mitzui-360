/**
 * מיצוי 360 — רכיב משוב מקצועי עם שליחה לגוגל שיטס
 */
import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'btl-feedback-mitzui-360';
const APP_NAME = 'מיצוי זכויות 360';
const NAME_KEY = 'btl-feedback-user-name';
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbwD8CMFoP5XoOwRLwK_OxMMOFKF8fS2CRpbJkNdOHjbnJIepkOLzlGrg3GQNGRqbwB6bA/exec';

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
  name?: string;
  sent?: boolean;
}

const catLabel: Record<FeedbackCategory, string> = {
  professional: '📋 תוכן מקצועי',
  ux: '🖥️ ממשק / UI‑UX',
  process: '🔄 זרימת תהליך',
  data: '📊 נתונים / סכומים',
};
const catToSheet: Record<FeedbackCategory, string> = {
  professional: '📋 תוכן מקצועי',
  ux: '🎨 עיצוב',
  process: '💡 שיפור',
  data: '📊 נתונים',
};
const sevLabel: Record<FeedbackSeverity, string> = {
  critical: '🔴 קריטי',
  improvement: '🟡 שיפור',
  minor: '🟢 מינורי',
};
const sevToSheet: Record<FeedbackSeverity, string> = {
  critical: 'קריטי', improvement: 'שיפור', minor: 'קטן',
};

async function sendToSheet(entry: FeedbackEntry): Promise<boolean> {
  try {
    await fetch(SHEET_URL, {
      method: 'POST', mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app: APP_NAME, name: entry.name || 'אנונימי',
        category: catToSheet[entry.category] || 'כללי',
        severity: sevToSheet[entry.severity] || '—',
        text: entry.description + (entry.suggestion ? ` | הצעה: ${entry.suggestion}` : ''),
        page: entry.screen || window.location.pathname,
      }),
    });
    return true;
  } catch { return false; }
}

export function FeedbackModal({
  items, scenName, onAdd, onClose,
}: {
  items: FeedbackEntry[];
  scenName: string;
  onAdd: (e: FeedbackEntry) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(() => localStorage.getItem(NAME_KEY) || '');
  const [cat, setCat] = useState<FeedbackCategory>('professional');
  const [sev, setSev] = useState<FeedbackSeverity>('improvement');
  const [desc, setDesc] = useState('');
  const [sugg, setSugg] = useState('');
  const [tab, setTab] = useState<'add' | 'list'>('add');
  const [sending, setSending] = useState(false);
  const [lastStatus, setLastStatus] = useState<'' | 'ok' | 'offline'>('');
  const [copied, setCopied] = useState(false);

  // Retry unsent items on open
  useEffect(() => {
    const unsent = items.filter(i => !i.sent);
    if (!unsent.length) return;
    Promise.all(unsent.map(i => sendToSheet(i)));
  }, []);

  const submit = async () => {
    if (!desc.trim() || !name.trim()) return;
    localStorage.setItem(NAME_KEY, name.trim());
    setSending(true); setLastStatus('');
    const entry: FeedbackEntry = {
      id: Date.now(), category: cat, severity: sev,
      screen: scenName || 'כללי',
      description: desc.trim(),
      suggestion: sugg.trim(),
      ts: new Date().toLocaleTimeString('he-IL'),
      name: name.trim(),
      sent: false,
    };
    const ok = await sendToSheet(entry);
    entry.sent = ok;
    onAdd(entry);
    setDesc(''); setSugg('');
    setSending(false); setLastStatus(ok ? 'ok' : 'offline');
    setTimeout(() => setLastStatus(''), 3000);
    setTab('list');
  };

  const exportText = () => {
    const lines = [
      `=== משוב פיילוט מיצוי 360 ===`,
      `תרחיש: ${scenName || 'כללי'} | ${new Date().toLocaleDateString('he-IL')}`,
      '',
      ...items.map((e, i) => [
        `--- הערה ${i + 1} ---`,
        `קטגוריה: ${catLabel[e.category]}`,
        `חומרה: ${sevLabel[e.severity]}`,
        `תיאור: ${e.description}`,
        e.suggestion ? `הצעה: ${e.suggestion}` : '',
        `שעה: ${e.ts}`,
      ].filter(Boolean).join('\n')),
      '',
      '=== סוף משוב ===',
    ].join('\n');
    navigator.clipboard.writeText(lines).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div>
            <h2 className="font-bold text-gray-900 text-base">משוב מקצועי — פיילוט</h2>
            <p className="text-xs text-gray-500 mt-0.5">{items.length} הערות בפגישה זו</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl font-bold leading-none">×</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {(['add', 'list'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${tab === t ? 'border-b-2 border-[#1B3A5C] text-[#1B3A5C]' : 'text-gray-500 hover:text-gray-700'}`}>
              {t === 'add' ? '+ הוסף הערה' : `הערות (${items.length})`}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto flex-1 p-5">
          {tab === 'add' && (
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">שם</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="השם שלך"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-right" dir="rtl" />
              </div>
              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">קטגוריה</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(catLabel) as FeedbackCategory[]).map(c => (
                    <button key={c} onClick={() => setCat(c)}
                      className={`py-2 px-3 rounded-lg text-xs font-medium border transition-colors ${cat === c ? 'bg-[#1B3A5C] text-white border-[#1B3A5C]' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                      {catLabel[c]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Severity */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">חומרה / עדיפות</label>
                <div className="flex gap-2">
                  {(Object.keys(sevLabel) as FeedbackSeverity[]).map(s => (
                    <button key={s} onClick={() => setSev(s)}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${sev === s ? 'bg-[#1B3A5C] text-white border-[#1B3A5C]' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                      {sevLabel[s]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">תיאור הבעיה / הצורך *</label>
                <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} placeholder="תאר את הבעיה או את מה שצריך שיפור..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-right resize-none focus:ring-2 focus:ring-[#1B3A5C] outline-none" />
              </div>

              {/* Suggestion */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">הצעה לתיקון / שיפור (אופציונלי)</label>
                <textarea value={sugg} onChange={e => setSugg(e.target.value)} rows={2} placeholder="הצע פתרון או שיפור..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-right resize-none focus:ring-2 focus:ring-[#1B3A5C] outline-none" />
              </div>

              <button onClick={submit} disabled={!desc.trim() || !name.trim() || sending}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-colors ${desc.trim() && name.trim() && !sending ? 'bg-[#1B3A5C] text-white hover:bg-[#2A5A8C]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                {sending ? 'שולח...' : 'שמור הערה'}
              </button>
              {lastStatus === 'ok' && <p className="text-xs text-green-600 text-center">✅ נשלח בהצלחה</p>}
              {lastStatus === 'offline' && <p className="text-xs text-orange-500 text-center">📱 נשמר מקומית — יישלח כשיהיה חיבור</p>}
            </div>
          )}

          {tab === 'list' && (
            <div className="space-y-3">
              {items.length === 0 && <p className="text-gray-400 text-sm text-center py-6">אין הערות עדיין</p>}
              {items.map((e) => (
                <div key={e.id} className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-xs font-bold text-[#1B3A5C]">{catLabel[e.category]}</span>
                    <span className="text-xs">{sevLabel[e.severity]}</span>
                    {e.sent ? <span className="text-xs text-green-600">✅</span> : <span className="text-xs text-orange-500">⏳</span>}
                    <span className="text-xs text-gray-400 mr-auto">{e.name && `${e.name} · `}{e.ts}</span>
                  </div>
                  <p className="text-sm text-gray-800 font-medium">{e.description}</p>
                  {e.suggestion && <p className="text-xs text-gray-500 mt-1">💡 {e.suggestion}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with export */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-2xl">
            <button onClick={exportText}
              className={`w-full py-2.5 rounded-xl text-sm font-bold transition-colors ${copied ? 'bg-green-600 text-white' : 'bg-gray-800 text-white hover:bg-gray-900'}`}>
              {copied ? '✓ הועתק ללוח!' : `📋 העתק ${items.length} הערות (לשליחה למפתח)`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}