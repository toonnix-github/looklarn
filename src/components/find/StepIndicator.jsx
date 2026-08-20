import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Check } from 'lucide-react';

export default function StepIndicator({ currentStep, onStepClick, className = '' }) {
  const { t } = useLanguage();

  const steps = [
    { number: 1, label: t('find.step1Tab', '1. ร่างกาย & สุขภาพ') },
    { number: 2, label: t('find.step2Tab', '2. ความชอบ & กิจกรรม') },
    { number: 3, label: t('find.step3Tab', '3. วันเวลา & ค่าใช้จ่าย') },
  ];

  const progressPercent = currentStep === 1 ? '33.33%' : currentStep === 2 ? '66.66%' : '100%';

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Animated continuous progress bar */}
      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: progressPercent }}
        />
      </div>

      {/* 3 Step Buttons Grid */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
        {steps.map((step) => {
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;

          return (
            <button
              key={step.number}
              type="button"
              onClick={() => onStepClick?.(step.number)}
              className={`p-3 sm:p-4 rounded-2xl border text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                isActive
                  ? 'bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-500/20 ring-2 ring-sky-500/20 scale-[1.02]'
                  : isCompleted
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100/70'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              {isCompleted && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
              <span className="truncate">{step.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
