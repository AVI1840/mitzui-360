/**
 * מיצוי 360 — מסך 0: בחירת תרחיש
 */
import React from 'react';
import type { SMap, A } from '../types';
import { SCENARIOS, scenColor, scenBadge } from '../data/scenarios';

interface ScenarioSelectorProps {
  onSelect: (id: string) => void;
}

export function ScenarioSelector({ onSelect }: ScenarioSelectorProps) {
  return (
    <section className="animate-fade-in">
      <h2 className="text-lg font-bold mb-1 text-[#0c3058]">בחר תרחיש</h2>
      <p className="text-sm text-[#266794] mb-5">6 תרחישים מובנים לפי פרופילים קריטיים מ-btl-domain-engine</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SCENARIOS.map(s => (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={`rounded-xl border-2 p-5 text-right transition-all hover:shadow-md cursor-pointer ${scenColor[s.color]}`}>
            <div className="flex items-start justify-between mb-2">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${scenBadge[s.color]}`}>פעיל</span>
              <span className="text-2xl">{s.icon}</span>
            </div>
            <h3 className="font-bold text-base text-gray-900 mb-1">{s.name}</h3>
            <p className="text-xs text-gray-500">{s.profile}</p>
            <p className="text-xs text-gray-400 mt-2">{s.domains.length} תחומים</p>
          </button>
        ))}
      </div>
      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
        <strong>הוראות שימוש:</strong> בחר תרחיש לפי אירוע החיים של המבוטח. המערכת תנחה אותך שלב אחר שלב. הפלט מוכן להדפסה ולתיעוד תיק.
      </div>
    </section>
  );
}
