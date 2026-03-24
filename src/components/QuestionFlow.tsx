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
}

export function QuestionFlow({ activeDoms, di, setDi, ans, sa, allAnswered, onBack, onNext }: QuestionFlowProps) {
  const curDom = activeDoms[di];
  const curQs = curDom ? curDom.qs.filter(q => !q.showIf || q.showIf(ans)) : [];

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
