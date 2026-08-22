import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Check } from 'lucide-react';

const STEPS = {
  th: [
    { number: 1, label: 'กิจกรรม' },
    { number: 2, label: 'สถานที่' },
    { number: 3, label: 'ผู้ดูแล' },
  ],
  en: [
    { number: 1, label: 'Activity' },
    { number: 2, label: 'Location' },
    { number: 3, label: 'Caretaker' },
  ],
};

export default function StepIndicator({ currentStep, onStepClick, className = '' }) {
  const { language } = useLanguage();
  const steps = STEPS[language] || STEPS.th;
  const progressPercent = `${(currentStep / steps.length) * 100}%`;

  return (
    <div className={`space-y-[0.7dvh] sm:space-y-3 ${className}`}>
      {/* Progress bar */}
      <div className="h-[0.55dvh] w-full overflow-hidden rounded-full bg-slate-200 sm:h-1.5">
        <div
          className="h-full bg-gradient-to-r from-primary-700 to-secondary-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: progressPercent }}
        />
      </div>

      {/* Step pills */}
      <div className="flex gap-[1.6vw] sm:gap-2">
        {steps.map((step) => {
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;
          return (
            <button
              key={step.number}
              type="button"
              onClick={() => onStepClick?.(step.number)}
              className={`flex flex-1 items-center justify-center gap-[1vw] rounded-[min(3.2vw,0.8rem)] border px-[1.8vw] py-[0.75dvh] text-[clamp(0.62rem,2.62vw,0.74rem)] font-black transition-all cursor-pointer sm:gap-1.5 sm:rounded-xl sm:px-2 sm:py-2 sm:text-xs ${
                isActive
                  ? 'bg-primary-700 text-white border-primary-700 shadow-md shadow-primary-900/20 ring-2 ring-primary-500/20'
                  : isCompleted
                  ? 'bg-sub1-50 text-primary-700 border-sub1-200 hover:bg-sub1-100'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              {isCompleted
                ? <Check className="h-[1.65dvh] w-[1.65dvh] shrink-0 text-primary-600 sm:h-3.5 sm:w-3.5" />
                : <span className={`inline-flex h-[2.15dvh] w-[2.15dvh] shrink-0 items-center justify-center rounded-full text-[clamp(0.52rem,2.1vw,0.62rem)] font-black sm:h-4 sm:w-4 sm:text-[10px] ${isActive ? 'bg-white/30' : 'bg-slate-200 text-slate-600'}`}>{step.number}</span>
              }
              <span className="truncate">{step.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
