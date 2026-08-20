import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Check } from 'lucide-react';

const STEPS = {
  th: [
    { number: 1, label: 'ไปไหน?' },
    { number: 2, label: 'วันเวลา & สถานที่' },
    { number: 3, label: 'งบประมาณ' },
  ],
  en: [
    { number: 1, label: 'Activity' },
    { number: 2, label: 'Schedule & Location' },
    { number: 3, label: 'Budget' },
  ],
};

export default function StepIndicator({ currentStep, onStepClick, className = '' }) {
  const { language } = useLanguage();
  const steps = STEPS[language] || STEPS.th;
  const progressPercent = currentStep === 1 ? '33.33%' : currentStep === 2 ? '66.66%' : '100%';

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Progress bar */}
      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: progressPercent }}
        />
      </div>

      {/* Step pills */}
      <div className="flex gap-2">
        {steps.map((step) => {
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;
          return (
            <button
              key={step.number}
              type="button"
              onClick={() => onStepClick?.(step.number)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-500/20 ring-2 ring-sky-500/20'
                  : isCompleted
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100/70'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              {isCompleted
                ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                : <span className={`inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-black shrink-0 ${isActive ? 'bg-white/30' : 'bg-slate-200 text-slate-600'}`}>{step.number}</span>
              }
              <span className="truncate">{step.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
