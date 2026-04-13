/**
 * מיצוי 360 — מסך 2: שאלות ממוקדות
 */
import React from 'react';
import type { Q, A, Domain } from '../types';

interface QuestionFlowProps {
  activeDoms: Domain[];
  di: number;
  setDi: (i: number) => void;
  ans: A;
  sa: (id: string, v: any) => void;
  allAnswered: boolean;
  onBack: () => void;
  onNext: () => void;
  scenName?: string;
  domSt?: Record<string, any>;
  allActiveDoms?: Domain[];
}

export function QuestionFlow({ activeDoms, di, setDi, ans, sa, allAnswered, onBack, onNext, scenName, domSt, allActiveDoms }: QuestionFlowProps) {
  const curDom = activeDoms[di];
  const curQs = curDom ? curDom.qs.filter(q => !q.showIf || q.showIf(ans)) : [];
  const isLastDomain = di === activeDoms.length - 1;
  const [showInterim, setShowInterim] = React.useState(false);

  // Global extra question shown on last domain
  const EXTRA_Q_ID = '_extra_info';
  const EXTRA_Q_DETAIL_ID = '_extra_info_detail';
  const showExtraDetail = ans[EXTRA_Q_ID] === true;

  if (activeDoms.length === 0) {
    return (
      <section>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-3">לא נבחרו תחומים רלוונטיים</p>
          <button onClick={onBack} className="text-[#0368b0] underline text-sm">חזרה לסריקה</button>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-bold text-gray-800">{curDom?.n}</h2>
          <span className="text-sm text-gray-400">תחום {di + 1} מתוך {activeDoms.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-[#0368b0] h-2 rounded-full transition-all" style={{ width: `${((di + 1) / activeDoms.length) * 100}%` }} />
        </div>
      </div>

      <div className="space-y-4">
        {/* Interim report button */}
        <div className="flex justify-end mb-2">
          <button onClick={() => setShowInterim(true)}
            className="px-4 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 font-medium text-sm shadow transition-colors flex items-center gap-2">
            📋 הפק דו"ח ביניים (לסיוע למשפחה)
          </button>
        </div>

        {/* Interim report modal */}
        {showInterim && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setShowInterim(false)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6" dir="rtl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[#0c3058]">📋 דו"ח ביניים — ממצאי בדיקת פקיד</h2>
                <button onClick={() => setShowInterim(false)} className="text-gray-400 hover:text-gray-700 text-xl font-bold">×</button>
              </div>
              <p className="text-sm text-gray-500 mb-4">תרחיש: {scenName || ''} | {new Date().toLocaleDateString('he-IL', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <div className="space-y-3">
                {(allActiveDoms || activeDoms).filter(d => domSt && (domSt[d.id] === 'relevant' || domSt[d.id] === 'check')).map(d => (
                  <div key={d.id} className={`rounded-xl border p-4 ${domSt && domSt[d.id] === 'relevant' ? 'border-green-300 bg-green-50' : 'border-amber-300 bg-amber-50'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${domSt && domSt[d.id] === 'relevant' ? 'bg-green-200 text-green-800' : 'bg-amber-200 text-amber-800'}`}>
                        {domSt && domSt[d.id] === 'relevant' ? 'רלוונטי' : 'לבדיקה'}
                      </span>
                      <span className="font-bold text-sm text-gray-900">{d.n}</span>
                    </div>
                    <p className="text-xs text-gray-600">{d.b} — {d.am}</p>
                    <p className="text-xs text-gray-500 mt-1">{d.ds}</p>
                  </div>
                ))}
                {(allActiveDoms || activeDoms).filter(d => domSt && domSt[d.id] === 'not_relevant').length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-400 mb-2">תחומים שנבדקו ונמצאו לא רלוונטיים:</p>
                    {(allActiveDoms || activeDoms).map(d => domSt && domSt[d.id] === 'not_relevant' ? (
                      <span key={d.id} className="inline-block text-xs bg-gray-100 text-gray-400 rounded-full px-2 py-0.5 ml-1 mb-1">{d.n}</span>
                    ) : null)}
                  </div>
                )}
              </div>
              <div className="mt-5 flex gap-3">
                <button onClick={() => { setShowInterim(false); window.print(); }}
                  className="px-5 py-2.5 rounded-xl bg-[#0368b0] text-white hover:bg-[#025a8f] font-bold text-sm shadow">
                  🖨️ הדפסה
                </button>
                <button onClick={() => setShowInterim(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium text-sm">
                  סגור
                </button>
              </div>
            </div>
          </div>
        )}

        {curQs.map(q => (
          <div key={q.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <label className="block font-medium text-sm mb-3 text-gray-800">{q.text}</label>

            {q.at === 'boolean' && (
              <div className="flex gap-3">
                {[true, false].map(v => (
                  <button key={String(v)} onClick={() => sa(q.id, v)}
                    className={`flex-1 py-3 rounded-lg text-base font-bold transition-colors border ${ans[q.id] === v ? (v ? 'bg-green-600 text-white border-green-600' : 'bg-red-500 text-white border-red-500') : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                    {v ? 'כן' : 'לא'}
                  </button>
                ))}
              </div>
            )}

            {q.at === 'number' && (
              <input type="number" value={ans[q.id] ?? ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => sa(q.id, e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base text-right focus:ring-2 focus:ring-[#0068f5] focus:border-[#0068f5] outline-none" />
            )}

            {q.at === 'text' && (
              <input type="text" value={ans[q.id] ?? ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => sa(q.id, e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base text-right focus:ring-2 focus:ring-[#0068f5] focus:border-[#0068f5] outline-none" />
            )}

            {q.at === 'select' && q.opts && (
              <div className="flex flex-wrap gap-2">
                {q.opts.map((opt: string) => (
                  <button key={opt} onClick={() => sa(q.id, opt)}
                    className={`flex-1 min-w-fit py-2.5 px-3 rounded-lg text-sm font-medium transition-colors border ${ans[q.id] === opt ? 'bg-[#0368b0] text-white border-[#0368b0]' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {q.warn && q.warn(ans) && (
              <div className="mt-3 flex items-start gap-2 bg-orange-50 border border-orange-300 rounded-lg p-3 text-orange-800 text-xs">
                <span className="shrink-0">⚠️</span><span>{q.warn(ans)}</span>
              </div>
            )}
            {q.info && (
              <div className="mt-3 flex items-start gap-2 bg-[#e8f3ff] border border-[#0368b0]/20 rounded-lg p-3 text-[#0c3058] text-xs">
                <span className="shrink-0">ℹ️</span><span>{q.info}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Global extra question — shown on last domain */}
      {isLastDomain && (
        <div className="mt-6 bg-white rounded-xl border-2 border-[#0368b0]/30 p-5 shadow-sm">
          <label className="block font-medium text-sm mb-3 text-gray-800">האם יש גמלה / מידע נוסף שנבדק וחשוב לציין?</label>
          <div className="flex gap-3 mb-3">
            {[true, false].map(v => (
              <button key={String(v)} onClick={() => { sa(EXTRA_Q_ID, v); if (!v) sa(EXTRA_Q_DETAIL_ID, ''); }}
                className={`flex-1 py-3 rounded-lg text-base font-bold transition-colors border ${ans[EXTRA_Q_ID] === v ? (v ? 'bg-green-600 text-white border-green-600' : 'bg-red-500 text-white border-red-500') : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                {v ? 'כן' : 'לא'}
              </button>
            ))}
          </div>
          {showExtraDetail && (
            <textarea value={ans[EXTRA_Q_DETAIL_ID] ?? ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => sa(EXTRA_Q_DETAIL_ID, e.target.value)}
              placeholder="פרט כאן..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base text-right focus:ring-2 focus:ring-[#0068f5] focus:border-[#0068f5] outline-none resize-none min-h-[80px]" />
          )}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <button onClick={() => di > 0 ? setDi(di - 1) : onBack()}
          className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium transition-colors text-sm">
          → הקודם
        </button>
        {di < activeDoms.length - 1 ? (
          <button onClick={() => setDi(di + 1)}
            className="px-6 py-2.5 rounded-xl bg-[#0368b0] text-white hover:bg-[#025a8f] font-medium shadow transition-colors text-sm">
            הבא ←
          </button>
        ) : (
          <button disabled={!allAnswered} onClick={onNext}
            className={`px-8 py-3 rounded-xl font-bold text-base transition-colors ${allAnswered ? 'bg-green-600 text-white hover:bg-green-700 shadow-md' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
            לסיכום ←
          </button>
        )}
      </div>
    </section>
  );
}
