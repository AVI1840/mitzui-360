/**
 * מיצוי 360 — מסך 1: סריקה ראשונית
 */
import React from 'react';
import type { DS, SMap, Scenario, Domain } from '../types';

interface DomainScannerProps {
  scen: Scenario;
  domSt: SMap;
  sd: (id: string, v: DS) => void;
  ans: Record<string, any>;
  sa: (id: string, v: any) => void;
  allSelected: boolean;
  onNext: () => void;
}

export function DomainScanner({ scen, domSt, sd, ans, sa, allSelected, onNext }: DomainScannerProps) {
  const allDoms = scen.domains;

  return (
    <section>
      <div className="flex items-center gap-3 mb-1">
        <span className="text-2xl">{scen.icon}</span>
        <h2 className="text-lg font-bold text-gray-800">שלב 1 — סריקה ראשונית: {scen.name}</h2>
      </div>
      <p className="text-sm text-gray-500 mb-5">סמן לכל תחום: רלוונטי / לא רלוונטי / לבדיקה</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allDoms.map(d => {
          const v = domSt[d.id];
          return (
            <div key={d.id} className={`rounded-xl border p-4 shadow-sm transition-all ${v === 'relevant' ? 'border-green-400 bg-green-50' : v === 'check' ? 'border-amber-400 bg-amber-50' : v === 'not_relevant' ? 'border-gray-200 bg-gray-50 opacity-60' : 'border-gray-200 bg-white'}`}>
              <div className="flex items-start justify-between mb-1.5">
                <h3 className="font-bold text-sm text-gray-900 flex-1 ml-2">{d.n}</h3>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-xs bg-[#e8f3ff] text-[#0368b0] px-2 py-0.5 rounded-full whitespace-nowrap">{d.b}</span>
                  {d.priority === 'high' && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">עדיפות גבוהה</span>}
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-1">{d.ds}</p>
              <p className="text-xs font-semibold text-[#0c3058] mb-3">{d.am}</p>
              <div className="flex gap-2">
                {(['relevant', 'check', 'not_relevant'] as DS[]).map(x => {
                  const lb = x === 'relevant' ? 'רלוונטי' : x === 'not_relevant' ? 'לא רלוונטי' : 'לבדיקה';
                  const ac = x === 'relevant' ? 'bg-green-600 text-white' : x === 'not_relevant' ? 'bg-gray-500 text-white' : 'bg-amber-500 text-white';
                  return (
                    <button key={x} onClick={() => sd(d.id, x!)}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${v === x ? ac : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                      {lb}
                    </button>
                  );
                })}
              </div>
              {/* Inline questions for scanOnly domains */}
              {d.scanOnly && (v === 'relevant' || v === 'check') && (
                <div className="mt-3 pt-3 border-t border-gray-200 space-y-3">
                  {d.qs.filter(q => !q.showIf || q.showIf(ans)).map(q => (
                    <div key={q.id}>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">{q.text}</label>
                      {q.at === 'boolean' && (
                        <div className="flex gap-2">
                          {[true, false].map(bv => (
                            <button key={String(bv)} onClick={() => sa(q.id, bv)}
                              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors border ${ans[q.id] === bv ? (bv ? 'bg-green-600 text-white border-green-600' : 'bg-red-500 text-white border-red-500') : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                              {bv ? 'כן' : 'לא'}
                            </button>
                          ))}
                        </div>
                      )}
                      {q.at === 'text' && (
                        <input type="text" value={ans[q.id] ?? ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => sa(q.id, e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-right focus:ring-2 focus:ring-[#0068f5] outline-none" />
                      )}
                      {q.info && (
                        <p className="text-[10px] text-[#0c3058] bg-[#e8f3ff] rounded p-1.5 mt-1">ℹ️ {q.info}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex justify-start">
        <button disabled={!allSelected} onClick={onNext}
          className={`px-8 py-3 rounded-xl font-bold text-base transition-colors ${allSelected ? 'bg-[#0368b0] text-white hover:bg-[#025a8f] shadow-md' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
          המשך לשאלות ←
        </button>
      </div>
    </section>
  );
}
