/**
 * מיצוי 360 — מסך 3: סיכום ופעולות — דו"ח מקצועי
 */
import React, { useState } from 'react';
import type { Urg, RB, Scenario, A } from '../types';
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
  ans?: A;
}

// BTL Logo as inline SVG (simplified official logo shape)
function BtlLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-lg bg-[#0c3058] flex items-center justify-center text-white font-bold text-lg shadow">
        <svg viewBox="0 0 48 48" width="36" height="36" fill="none">
          <rect width="48" height="48" rx="8" fill="#0c3058"/>
          <text x="24" y="20" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="Arial">ביטוח</text>
          <text x="24" y="32" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="Arial">לאומי</text>
          <rect x="8" y="38" width="32" height="2" rx="1" fill="#4da6ff"/>
        </svg>
      </div>
      <div>
        <p className="text-[#0c3058] font-bold text-base leading-tight">המוסד לביטוח לאומי</p>
        <p className="text-[#266794] text-xs">כלי סיוע לפקידים במיצוי זכויות — מיצוי 360</p>
      </div>
    </div>
  );
}

export function SummaryReport({ scen, actions, traps, related, today, onBackToQuestions, doReset, ans }: SummaryReportProps) {
  const urgentCount = actions.filter(a => a.urg === 'urgent').length;
  const [emailMode, setEmailMode] = useState(false);
  const extraInfo = ans?.['_extra_info_detail'];

  return (
    <section>
      {/* ═══ PRINT-ONLY: Professional report header ═══ */}
      <div className="hidden print:block mb-6">
        <div className="flex items-center justify-between border-b-2 border-[#0c3058] pb-4 mb-4">
          <BtlLogo />
          <div className="text-left text-xs text-gray-500">
            <p>תאריך: {today}</p>
            <p>מסמך: דו"ח מיצוי זכויות</p>
          </div>
        </div>
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-[#0c3058]">דו"ח מיצוי זכויות — {scen.name}</h1>
          <p className="text-sm text-gray-500 mt-1">מסמך זה הופק באמצעות כלי מיצוי זכויות 360 לפקידי ביטוח לאומי</p>
          <div className="w-24 h-1 bg-[#0368b0] mx-auto mt-3 rounded-full" />
        </div>
      </div>

      {/* ═══ SCREEN: Header with actions ═══ */}
      <div className="no-print">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-5 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <BtlLogo />
            </div>
            <div className="flex gap-2 flex-wrap">
              {urgentCount > 0 && (
                <span className="bg-red-100 text-red-800 text-sm font-bold px-3 py-1.5 rounded-full border border-red-300">
                  {urgentCount} פעולות דחופות
                </span>
              )}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100">
            <h2 className="text-lg font-bold text-[#0c3058]">דו"ח מיצוי זכויות — {scen.name}</h2>
            <p className="text-sm text-gray-500">{today}</p>
          </div>
          <div className="mt-3 flex gap-2 flex-wrap">
            <button onClick={() => window.print()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0368b0] text-white hover:bg-[#025a8f] font-bold shadow transition-colors text-sm">
              🖨️ הדפסה / PDF
            </button>
            <button onClick={() => setEmailMode(!emailMode)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#0368b0] text-[#0368b0] hover:bg-[#e8f3ff] font-medium transition-colors text-sm">
              ✉️ {emailMode ? 'סגור תצוגת מייל' : 'תצוגת מייל למשפחה'}
            </button>
          </div>
        </div>
      </div>

      {/* ═══ EMAIL MODE: Clean professional view ═══ */}
      {emailMode && (
        <div className="no-print mb-6 bg-white rounded-2xl border-2 border-[#0368b0] p-6 shadow-lg">
          <div className="text-center mb-5">
            <BtlLogo />
            <h3 className="text-xl font-bold text-[#0c3058] mt-4">סיכום פגישה — מיצוי זכויות</h3>
            <p className="text-sm text-gray-500 mt-1">תרחיש: {scen.name} | {today}</p>
            <div className="w-16 h-0.5 bg-[#0368b0] mx-auto mt-3" />
          </div>
          <div className="space-y-3 mb-4">
            <p className="text-sm text-gray-700 font-medium">שלום רב,</p>
            <p className="text-sm text-gray-600">להלן סיכום הזכויות שנמצאו רלוונטיות עבורכם בפגישה:</p>
          </div>
          {actions.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-bold text-[#0c3058] mb-2 border-b border-gray-200 pb-1">פעולות נדרשות</h4>
              <ol className="space-y-2 list-decimal list-inside">
                {actions.map((act, i) => (
                  <li key={i} className="text-sm text-gray-800">
                    <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded mr-1 ${uClr(act.urg)}`}>{uLbl(act.urg)}</span>
                    {act.text}
                  </li>
                ))}
              </ol>
            </div>
          )}
          {related.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-bold text-[#0c3058] mb-2 border-b border-gray-200 pb-1">זכויות נלוות שכדאי לבדוק</h4>
              <ul className="space-y-1">
                {related.map((rb, i) => (
                  <li key={i} className="text-sm text-gray-700">• {rb.name} ({rb.body}){rb.note ? ` — ${rb.note}` : ''}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-5 pt-3 border-t border-gray-200 text-xs text-gray-400 text-center">
            <p>המוסד לביטוח לאומי | כלי מיצוי זכויות 360 | {today}</p>
            <p className="mt-1">לבירורים: *6050 | btl.gov.il</p>
          </div>
          <div className="mt-3 text-center">
            <button onClick={() => {
              const el = document.querySelector('.email-copy-target');
              if (el) { const range = document.createRange(); range.selectNodeContents(el); const sel = window.getSelection(); sel?.removeAllRanges(); sel?.addRange(range); document.execCommand('copy'); sel?.removeAllRanges(); }
            }}
              className="text-xs text-[#0368b0] underline hover:text-[#025a8f]">📋 העתק טקסט לשליחה</button>
          </div>
        </div>
      )}

      {/* ═══ SECTION A — פעולות נדרשות ═══ */}
      <div className="mb-6 print-summary">
        <h3 className="text-base font-bold mb-3 text-[#0c3058] border-b-2 border-[#0368b0]/20 pb-2">
          א. פעולות נדרשות ({actions.length})
        </h3>
        {actions.length === 0 ? (
          <p className="text-gray-400 py-4 text-sm">לא נמצאו פעולות נדרשות על בסיס התשובות</p>
        ) : (
          <div className="space-y-2">
            {actions.map((act, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-start gap-3 print:shadow-none print:border-gray-300">
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

      {/* ═══ SECTION B — מלכודות ═══ */}
      {traps.length > 0 && (
        <div className="mb-6 print-summary">
          <h3 className="text-base font-bold mb-3 text-orange-800 border-b-2 border-orange-200 pb-2">
            ב. אזהרות ומלכודות ({traps.length})
          </h3>
          <div className="space-y-2">
            {traps.map((tr, i) => (
              <div key={i} className="bg-orange-50 border border-orange-300 rounded-xl p-4 print:bg-white print:border-orange-400">
                <p className="font-bold text-sm text-orange-800 mb-1">⚠️ {tr.text}</p>
                {tr.fix && <p className="text-xs text-orange-700">פעולה מונעת: {tr.fix}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ SECTION C — זכויות נלוות ═══ */}
      {related.length > 0 && (
        <div className="mb-6 print-summary">
          <h3 className="text-base font-bold mb-3 text-teal-800 border-b-2 border-teal-200 pb-2">
            ג. זכויות נלוות — דומינו-אפקט ({related.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {related.map((rb, i) => (
              <div key={i} className="bg-teal-50 border border-teal-200 rounded-xl p-3 flex items-start gap-2 print:bg-white print:border-teal-300">
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

      {/* ═══ Extra info from questionnaire ═══ */}
      {extraInfo && (
        <div className="mb-6 print-summary bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="text-sm font-bold text-[#0c3058] mb-1">הערות נוספות מהפגישה</h3>
          <p className="text-sm text-gray-800">{extraInfo}</p>
        </div>
      )}

      {/* ═══ SECTION D — סיכום מספרי ═══ */}
      <div className="mb-6 print-summary bg-gray-50 border border-gray-200 rounded-xl p-4">
        <h3 className="text-sm font-bold text-gray-700 mb-2">ד. סיכום מצב</h3>
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

      {/* ═══ Print footer ═══ */}
      <div className="border-t-2 border-[#0c3058]/20 pt-4 text-xs text-gray-400 print-summary">
        <div className="flex items-center justify-between">
          <p>⚠️ <strong>אמת פרטים מעודכנים ב-btl.gov.il או *6050 לפני הגשה.</strong></p>
          <p className="hidden print:block text-[10px]">עמוד 1</p>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
          <p>כלי סיוע לפקידים במיצוי זכויות | מיצוי 360 | {today}</p>
          <p className="hidden print:block text-[10px]">המוסד לביטוח לאומי</p>
        </div>
      </div>

      {/* ═══ Nav buttons ═══ */}
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
