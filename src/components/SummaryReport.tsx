/**
 * מיצוי 360 — מסך 3: סיכום ופעולות
 */
import React from 'react';
import type { Urg, RB, Scenario } from '../types';
import { uLbl, uClr, uDot } from '../helpers';

interface Action { urg: Urg; text: string; tag: string; }
interface Trap { text: string; fix?: string; }

interface SummaryReportProps {
  scen: Scenario;
  actions: Action[];
  traps: Trap[];
  related: RB[];
  today: string;
  onBackToQuestions: () => void;
  doReset: () => void;
}

export function SummaryReport({ scen, actions, traps, related, today, onBackToQuestions, doReset }: SummaryReportProps) {
  const urgentCount = actions.filter(a => a.urg === 'urgent').length;

  return (
    <section>
      {/* Print header */}
      <div className="hidden print:block mb-6 border-b-2 border-gray-800 pb-4">
        <h1 className="text-2xl font-bold">מיצוי 360 — סיכום פגישה</h1>
        <p className="text-gray-600">{today} | תרחיש: {scen.name}</p>
        <p className="text-xs text-gray-400 mt-1">אמת פרטים מעודכנים ב-btl.gov.il או *6050 לפני הגשה</p>
      </div>

      {/* Screen header */}
      <div className="no-print flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-800">סיכום מיצוי — {scen.name}</h2>
          <p className="text-sm text-gray-500">{today} | מוכן להדפסה</p>
        </div>
        <div className="flex gap-2">
          {urgentCount > 0 && (
            <span className="bg-red-100 text-red-800 text-sm font-bold px-3 py-1.5 rounded-full border border-red-300">
              {urgentCount} פעולות דחופות
            </span>
          )}
          <button onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0368b0] text-white hover:bg-[#025a8f] font-bold shadow transition-colors text-sm">
            🖨️ הדפסה / PDF
          </button>
        </div>
      </div>

      {/* SECTION A — פעולות נדרשות */}
      <div className="mb-6 print-summary">
        <h3 className="text-base font-bold mb-3 text-[#0c3058] border-b-2 border-[#0368b0]/20 pb-2">
          פעולות נדרשות ({actions.length})
        </h3>
        {actions.length === 0 ? (
          <p className="text-gray-400 py-4 text-sm">לא נמצאו פעולות נדרשות על בסיס התשובות</p>
        ) : (
          <div className="space-y-2">
            {actions.map((act, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-start gap-3">
                <div className={`shrink-0 w-2 h-2 rounded-full mt-2 ${uDot(act.urg)}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${uClr(act.urg)}`}>{uLbl(act.urg)}</span>
                    <span className="text-xs text-gray-400">{act.tag}</span>
                  </div>
                  <p className="font-medium text-sm text-gray-900">{act.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION B — מלכודות */}
      {traps.length > 0 && (
        <div className="mb-6 print-summary">
          <h3 className="text-base font-bold mb-3 text-orange-800 border-b-2 border-orange-200 pb-2">
            אזהרות ומלכודות ({traps.length})
          </h3>
          <div className="space-y-2">
            {traps.map((tr, i) => (
              <div key={i} className="bg-orange-50 border border-orange-300 rounded-xl p-4">
                <p className="font-bold text-sm text-orange-800 mb-1">⚠️ {tr.text}</p>
                {tr.fix && <p className="text-xs text-orange-700">פעולה מונעת: {tr.fix}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION C — זכויות נלוות */}
      {related.length > 0 && (
        <div className="mb-6 print-summary">
          <h3 className="text-base font-bold mb-3 text-teal-800 border-b-2 border-teal-200 pb-2">
            זכויות נלוות — דומינו-אפקט ({related.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {related.map((rb, i) => (
              <div key={i} className="bg-teal-50 border border-teal-200 rounded-xl p-3 flex items-start gap-2">
                <span className="text-teal-600 text-sm font-bold shrink-0">↗</span>
                <div>
                  <p className="font-semibold text-sm text-teal-900">{rb.name}</p>
                  <p className="text-xs text-teal-700">{rb.body}{rb.note ? ` — ${rb.note}` : ''}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION D — סיכום ידע פקיד */}
      <div className="mb-6 print-summary bg-gray-50 border border-gray-200 rounded-xl p-4">
        <h3 className="text-sm font-bold text-gray-700 mb-2">מצב פגישה</h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="text-2xl font-bold text-red-600">{actions.filter(a => a.urg === 'urgent').length}</div>
            <div className="text-xs text-gray-500">דחוף</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="text-2xl font-bold text-amber-600">{actions.filter(a => a.urg === 'within30').length}</div>
            <div className="text-xs text-gray-500">תוך 30 יום</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="text-2xl font-bold text-sky-600">{actions.filter(a => a.urg === 'planning').length}</div>
            <div className="text-xs text-gray-500">לתכנון</div>
          </div>
        </div>
      </div>

      {/* Footer disclaimer */}
      <div className="border-t border-gray-200 pt-4 text-xs text-gray-400 print-summary">
        <p>⚠️ <strong>אמת פרטים מעודכנים ב-btl.gov.il או *6050 לפני הגשה.</strong></p>
        <p className="mt-1">מיצוי 360 v2.0 | btl-domain-engine v4.1.0 | {today} | אין שמירת מידע — כל הנתונים נמחקים בסגירת הדף</p>
      </div>

      {/* Nav buttons */}
      <div className="mt-6 no-print flex gap-3">
        <button onClick={onBackToQuestions}
          className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium transition-colors text-sm">
          → חזרה לשאלות
        </button>
        <button onClick={doReset}
          className="px-5 py-2.5 rounded-xl bg-[#0368b0] text-white hover:bg-[#025a8f] font-medium transition-colors text-sm">
          פגישה חדשה ↺
        </button>
      </div>
    </section>
  );
}
