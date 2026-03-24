/**
 * מיצוי 360 — רכיב משוב מקצועי
 */
import React, { useState } from 'react';

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

const catLabel: Record<FeedbackCategory, string> = {
  professional: '📋 תוכן מקצועי',
  ux: '🖥️ ממשק / UI‑UX',
  process: '🔄 זרימת תהליך',
  data: '📊 נתונים / סכומים',
};
const sevLabel: Record<FeedbackSeverity, string> = {
  critical: '🔴 קריטי',
  improvement: '🟡 שיפור',
  minor: '🟢 מינורי',
};

export function FeedbackModal({
  items, scenName, onAdd, onClose,
}: {
  items: FeedbackEntry[];
  scenName: string;
  onAdd: (e: FeedbackEntry) => void;
  onClose: () => void;
}) {
  const [cat, setCat] = useState<FeedbackCategory>('professional');
  const [sev, setSev] = useState<FeedbackSeverity>('improvement');
  const [desc, setDesc] = useState('');
  const [sugg, setSugg] = useState('');
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<'add' | 'list'>('add');

  const submit = () => {
    if (!desc.trim()) return;
    onAdd({
      id: Date.now(), category: cat, severity: sev,
      screen: scenName || 'כללי',
      description: desc.trim(),
      suggestion: sugg.trim(),
      ts: new Date().toLocaleTimeString('he-IL'),
    });
    setDesc(''); setSugg(''); setTab('list');
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
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${tab === t ? 'border-b-2 border-[#0368b0] text-[#0368b0]' : 'text-gray-500 hover:text-gray-700'}`}>
              {t === 'add' ? '+ הוסף הערה' : `הערות (${items.length})`}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto flex-1 p-5">
          {tab === 'add' && (
            <div className="space-y-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">קטגוריה</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(catLabel) as FeedbackCategory[]).map(c => (
                    <button key={c} onClick={() => setCat(c)}
                      className={`py-2 px-3 rounded-lg text-xs font-medium border transition-colors ${cat === c ? 'bg-[#0368b0] text-white border-[#0368b0]' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
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
                      className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${sev === s ? 'bg-[#0368b0] text-white border-[#0368b0]' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                      {sevLabel[s]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">תיאור הבעיה / הצורך *</label>
                <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} placeholder="תאר את הבעיה או את מה שצריך שיפור..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-right resize-none focus:ring-2 focus:ring-[#0068f5] outline-none" />
              </div>

              {/* Suggestion */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">הצעה לתיקון / שיפור (אופציונלי)</label>
                <textarea value={sugg} onChange={e => setSugg(e.target.value)} rows={2} placeholder="הצע פתרון או שיפור..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-right resize-none focus:ring-2 focus:ring-[#0068f5] outline-none" />
              </div>

              <button onClick={submit} disabled={!desc.trim()}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-colors ${desc.trim() ? 'bg-[#0368b0] text-white hover:bg-[#025a8f]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                שמור הערה
              </button>
            </div>
          )}

          {tab === 'list' && (
            <div className="space-y-3">
              {items.length === 0 && <p className="text-gray-400 text-sm text-center py-6">אין הערות עדיין</p>}
              {items.map((e, i) => (
                <div key={e.id} className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-xs font-bold text-[#0368b0]">{catLabel[e.category]}</span>
                    <span className="text-xs">{sevLabel[e.severity]}</span>
                    <span className="text-xs text-gray-400 mr-auto">{e.ts}</span>
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
            <p className="text-xs text-gray-400 text-center mt-2">הדבק באימייל / Slack ושלח לצוות הפיתוח</p>
          </div>
        )}
      </div>
    </div>
  );
}
