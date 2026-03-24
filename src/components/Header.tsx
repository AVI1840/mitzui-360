/**
 * מיצוי 360 — Header + Step Navigation
 */
import React, { Fragment } from 'react';
import { STEPS } from '../data/scenarios';

interface HeaderProps {
  step: number;
  setStep: (s: number) => void;
  resetPending: boolean;
  setResetPending: (v: boolean) => void;
  doReset: () => void;
}

export function Header({ step, setStep, resetPending, setResetPending, doReset }: HeaderProps) {
  return (
    <>
      <header className="no-print bg-[#0c3058] text-[#f5f9ff] py-4 px-6 shadow-[0_2px_8px_rgba(6,77,173,0.15)]">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl font-bold">360</div>
            <div>
              <h1 className="text-xl font-bold leading-none">מיצוי 360</h1>
              <p className="text-[#e8f3ff]/70 text-xs mt-0.5">כלי מיצוי זכויות — v4.2</p>
            </div>
          </div>
          {step > 0 && (
            <button
              onClick={() => resetPending ? doReset() : setResetPending(true)}
              onBlur={() => setResetPending(false)}
              className={`text-sm px-4 py-2 rounded-lg font-medium transition-all ${resetPending ? 'bg-red-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
              {resetPending ? '⚠️ לחץ שוב לאיפוס' : '↺ פגישה חדשה'}
            </button>
          )}
        </div>
      </header>

      <nav className="no-print bg-white border-b border-black/10 py-3 px-6 shadow-[0_2px_8px_rgba(6,77,173,0.1)]">
        <div className="max-w-5xl mx-auto flex items-center gap-1">
          {STEPS.map((label, i) => (
            <Fragment key={i}>
              {i > 0 && <div className={`flex-1 h-0.5 transition-colors ${i <= step ? 'bg-[#0368b0]' : 'bg-gray-200'}`} />}
              <button
                onClick={() => { if (i < step) { setStep(i); setResetPending(false); } }}
                disabled={i > step}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0068f5] focus-visible:ring-offset-2 ${i === step ? 'bg-[#0368b0] text-[#f5f9ff] shadow' : i < step ? 'bg-[#e8f3ff] text-[#0368b0] cursor-pointer hover:bg-[#d0e6fa]' : 'bg-gray-50 text-gray-400 cursor-default'}`}>
                <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold ${i < step ? 'bg-[#0368b0] text-white' : ''}`}>{i < step ? '✓' : i + 1}</span>
                {label}
              </button>
            </Fragment>
          ))}
        </div>
      </nav>
    </>
  );
}
