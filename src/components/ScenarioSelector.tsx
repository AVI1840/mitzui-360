/**
 * מיצוי 360 — מסך 0: בחירת תרחיש
 */
import React from 'react';
import { SCENARIOS, scenColor, scenBadge } from '../data/scenarios';

interface ScenarioSelectorProps {
  onSelect: (id: string) => void;
}

const COMING_SOON = [
  { icon: '🏠', name: 'קשיש/ה — הכנסה נמוכה', sub: 'קשיש 67+' },
  { icon: '🕊️', name: 'שכול — אלמן/ה', sub: 'אלמנה/אלמן' },
  { icon: '💼', name: 'פיטורין / אבטלה', sub: 'עובד שפוטר' },
];

export function ScenarioSelector({ onSelect }: ScenarioSelectorProps) {
  const active = SCENARIOS.filter(s => s.active);

  return (
    <section className="animate-fade-in space-y-6">
      {/* Welcome card */}
      <div className="bg-[#0c3058] text-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-1">ברוכים הבאים למיצוי 360</h2>
        <p className="text-[#b8d4f0] text-sm mb-5">כלי סיוע לפקידים במיצוי זכויות — ביטוח לאומי</p>
        <p className="text-[#e8f3ff] text-sm mb-4">המערכת מסייעת לזהות את מלוא הזכויות המגיעות למבוטח. התהליך בנוי ב-3 שלבים:</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { n: '1️⃣', title: 'בדיקות פקיד', sub: 'בדוק במערכת סטטוסים וזכאויות' },
            { n: '2️⃣', title: 'שאלון למשפחה', sub: 'שאלות למילוי בפגישה' },
            { n: '3️⃣', title: 'ממצאים ומימוש', sub: 'סיכום פעולות להדפסה' },
          ].map(({ n, title, sub }) => (
            <div key={n} className="bg-white/10 rounded-xl p-3 text-center">
              <div className="text-xl mb-1">{n}</div>
              <p className="text-white text-xs font-semibold">{title}</p>
              <p className="text-[#b8d4f0] text-[10px] mt-0.5">{sub}</p>
            </div>
          ))}
        </div>
        <p className="text-[#ffd700] text-xs mt-4">🔒 אין שמירת מידע אישי — הנתונים נמחקים בסגירת הדף</p>
      </div>

      {/* Active scenarios */}
      <div>
        <h3 className="text-base font-bold text-[#0c3058] mb-1">בחר תרחיש</h3>
        <p className="text-sm text-[#266794] mb-4">{active.length} תרחישים פעילים</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {active.map(s => (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              className={`rounded-xl border-2 p-5 text-right transition-all hover:shadow-md cursor-pointer ${scenColor[s.color]}`}>
              <div className="flex items-start justify-between mb-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${scenBadge[s.color]}`}>פעיל</span>
                <span className="text-2xl">{s.icon}</span>
              </div>
              <h4 className="font-bold text-base text-gray-900 mb-1">{s.name}</h4>
              <p className="text-xs text-gray-500">{s.profile}</p>
              <p className="text-xs text-gray-400 mt-2">{s.domains.length} נושאים</p>
            </button>
          ))}
        </div>
      </div>

      {/* Coming soon */}
      <div>
        <p className="text-sm font-semibold text-[#0c3058] mb-3">תרחישים נוספים — בהמשך..</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {COMING_SOON.map((s, i) => (
            <div key={i} className="rounded-xl border-2 border-dashed border-gray-200 p-5 text-right bg-gray-50 opacity-60">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-400">בהמשך..</span>
                <span className="text-2xl">{s.icon}</span>
              </div>
              <h4 className="font-bold text-base text-gray-400 mb-1">{s.name}</h4>
              <p className="text-xs text-gray-400">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
