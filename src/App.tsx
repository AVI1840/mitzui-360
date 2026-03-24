/**
 * מיצוי 360 — כלי מיצוי זכויות לפקידים
 * Based on: btl-domain-engine v4.1.0 + rights-decision-engine v2.1.0
 * No data persistence — every session resets on refresh (security requirement)
 */
import React, { useState, useMemo, useCallback } from 'react';
import type { DS, Urg, A, SMap, RB, FeedbackEntry } from './types';
import { rel } from './helpers';
import { SCENARIOS } from './data/scenarios';
import { Header } from './components/Header';
import { ScenarioSelector } from './components/ScenarioSelector';
import { DomainScanner } from './components/DomainScanner';
import { QuestionFlow } from './components/QuestionFlow';
import { SummaryReport } from './components/SummaryReport';
import { FeedbackModal } from './components/FeedbackModal';

export default function App() {
  const [step, setStep] = useState(0);
  const [scenId, setScenId] = useState<string | null>(null);
  const [domSt, setDomSt] = useState<SMap>({});
  const [ans, setAns] = useState<A>({});
  const [di, setDi] = useState(0);
  const [resetPending, setResetPending] = useState(false);
  const [feedbackItems, setFeedbackItems] = useState<FeedbackEntry[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);

  const scen = useMemo(() => SCENARIOS.find(s => s.id === scenId) || null, [scenId]);
  const allDoms = scen?.domains || [];
  const activeDoms = useMemo(() => allDoms.filter(d => rel(domSt[d.id])), [allDoms, domSt]);
  const allSelected = allDoms.length > 0 && allDoms.every(d => domSt[d.id] != null);

  const allAnswered = useMemo(() => {
    for (const dom of activeDoms) {
      const qs = dom.qs.filter(q => !q.showIf || q.showIf(ans));
      for (const q of qs) if (ans[q.id] === undefined || ans[q.id] === '') return false;
    }
    return activeDoms.length > 0;
  }, [activeDoms, ans]);

  const actions = useMemo(() => {
    const res: { urg: Urg; text: string; tag: string }[] = [];
    for (const dom of activeDoms) {
      for (const ar of dom.ars) {
        if (ar.cond(ans, domSt)) {
          res.push({
            urg: ar.urg,
            text: typeof ar.text === 'function' ? ar.text(ans) : ar.text,
            tag: dom.n,
          });
        }
      }
    }
    const order: Record<Urg, number> = { urgent: 0, within30: 1, planning: 2 };
    return res.sort((a, b) => order[a.urg] - order[b.urg]);
  }, [activeDoms, ans, domSt]);

  const traps = useMemo(() => {
    const res: { text: string; fix?: string }[] = [];
    for (const dom of activeDoms) {
      for (const tr of dom.trs || []) {
        if (tr.cond(ans)) res.push({ text: tr.text, fix: tr.fix });
      }
    }
    return res;
  }, [activeDoms, ans]);

  const related = useMemo(() => {
    const res: RB[] = [];
    for (const dom of activeDoms) {
      for (const rb of dom.related || []) res.push(rb);
    }
    return res;
  }, [activeDoms]);

  const sa = useCallback((id: string, v: any) => setAns(p => ({ ...p, [id]: v })), []);
  const sd = useCallback((id: string, v: DS) => setDomSt(p => ({ ...p, [id]: v })), []);

  const doReset = () => {
    setStep(0); setScenId(null); setDomSt({}); setAns({}); setDi(0); setResetPending(false);
  };

  const handleSelectScenario = (id: string) => {
    setScenId(id); setDomSt({}); setAns({}); setDi(0); setStep(1);
  };

  const today = new Date().toLocaleDateString('he-IL', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-[#f5f9ff] text-[#0c3058]" dir="rtl">
      <Header step={step} setStep={setStep} resetPending={resetPending} setResetPending={setResetPending} doReset={doReset} />

      <main className="max-w-5xl mx-auto p-4 sm:p-6">
        {step === 0 && <ScenarioSelector onSelect={handleSelectScenario} />}

        {step === 1 && scen && (
          <DomainScanner scen={scen} domSt={domSt} sd={sd} allSelected={allSelected} onNext={() => { setDi(0); setStep(2); }} />
        )}

        {step === 2 && scen && (
          <QuestionFlow activeDoms={activeDoms} di={di} setDi={setDi} ans={ans} sa={sa} allAnswered={allAnswered} onBack={() => setStep(1)} onNext={() => setStep(3)} />
        )}

        {step === 3 && scen && (
          <SummaryReport scen={scen} actions={actions} traps={traps} related={related} today={today} onBackToQuestions={() => setStep(2)} doReset={doReset} />
        )}
      </main>

      <footer className="no-print text-center py-4 text-xs text-[#266794] border-t border-black/10 mt-10">
        מצפן הטבות — כלי מיצוי זכויות 360 לפקידי ביטוח לאומי | אין שמירת מידע | אביעד יצחקי, מינהל גמלאות, ביטוח לאומי | {today}
        <div className="mt-1 opacity-60">עדכון אחרון: 24.03.2026</div>
      </footer>

      {/* Floating feedback button */}
      <div className="no-print fixed bottom-6 left-6 z-40 flex flex-col items-end gap-2">
        {feedbackItems.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-full px-3 py-1 text-xs text-gray-600 shadow-md">
            {feedbackItems.length} הערות
          </div>
        )}
        <button
          onClick={() => setShowFeedback(true)}
          title="משוב מקצועי — פיילוט"
          className="w-14 h-14 rounded-full bg-purple-700 text-white shadow-xl hover:bg-purple-800 transition-all hover:scale-105 flex items-center justify-center text-2xl font-bold">
          💬
        </button>
      </div>

      {showFeedback && (
        <FeedbackModal
          items={feedbackItems}
          scenName={scen?.name || ''}
          onAdd={e => setFeedbackItems(prev => [...prev, e])}
          onClose={() => setShowFeedback(false)}
        />
      )}
    </div>
  );
}
