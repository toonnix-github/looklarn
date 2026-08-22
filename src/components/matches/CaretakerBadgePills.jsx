import React from 'react';
import {
  Award,
  BadgeCheck,
  Car,
  FileCheck,
  HeartPulse,
  Landmark,
  ShieldCheck,
  Stethoscope,
  UserCheck,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import {
  CARETAKER_BADGES,
  CARETAKER_BADGE_META,
  getCaretakerBadgeIds,
} from '../../constants/caretakerBadges';

const badgeIconMap = {
  [CARETAKER_BADGES.CRIMINAL_CHECK]: ShieldCheck,
  [CARETAKER_BADGES.ID_VERIFIED]: UserCheck,
  [CARETAKER_BADGES.CERTIFIED_CAREGIVER]: Award,
  [CARETAKER_BADGES.CPR_FIRST_AID]: HeartPulse,
  [CARETAKER_BADGES.HOSPITAL_ESCORT]: Landmark,
  [CARETAKER_BADGES.REGISTERED_NURSE]: BadgeCheck,
  [CARETAKER_BADGES.DEMENTIA_CARE]: FileCheck,
  [CARETAKER_BADGES.MEDICAL_TRAINING]: Stethoscope,
  [CARETAKER_BADGES.SAFE_DRIVER]: Car,
  [CARETAKER_BADGES.TOUR_GUIDE]: Landmark,
};

const badgeToneClass = {
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  indigo: 'border-indigo-200 bg-indigo-50 text-indigo-700',
  sky: 'border-sky-200 bg-sky-50 text-sky-700',
  rose: 'border-rose-200 bg-rose-50 text-rose-700',
  cyan: 'border-cyan-200 bg-cyan-50 text-cyan-700',
  violet: 'border-violet-200 bg-violet-50 text-violet-700',
  amber: 'border-amber-200 bg-amber-50 text-amber-800',
  blue: 'border-blue-200 bg-blue-50 text-blue-700',
  slate: 'border-slate-200 bg-slate-50 text-slate-700',
  teal: 'border-teal-200 bg-teal-50 text-teal-700',
};

export function CaretakerBadgePills({ caretaker, limit = 2, className = '', compact = false }) {
  const { language } = useLanguage();
  const allBadgeIds = getCaretakerBadgeIds(caretaker);
  const badgeIds = allBadgeIds.slice(0, limit);
  const hiddenCount = Math.max(0, allBadgeIds.length - badgeIds.length);

  return (
    <div className={`flex gap-1 ${compact ? 'flex-nowrap overflow-hidden' : 'flex-wrap'} ${className}`}>
      {badgeIds.map((badgeId) => {
        const meta = CARETAKER_BADGE_META[badgeId];
        const Icon = badgeIconMap[badgeId] || ShieldCheck;
        return (
          <span
            key={badgeId}
            className={`inline-flex min-w-0 max-w-full items-center gap-1 rounded-full border px-2 py-0.5 font-black leading-none ${badgeToneClass[meta.tone] || badgeToneClass.slate} ${
              compact ? 'text-[length:var(--app-text-2xs)]' : 'text-[length:var(--app-text-xs)]'
            }`}
          >
            <Icon className={compact ? 'h-[1.25dvh] w-[1.25dvh] shrink-0 sm:h-3 sm:w-3' : 'h-[1.45dvh] w-[1.45dvh] shrink-0 sm:h-3.5 sm:w-3.5'} />
            <span className="truncate">{meta.label[language] || meta.label.en}</span>
          </span>
        );
      })}
      {hiddenCount > 0 && (
        <span
          className={`inline-flex shrink-0 items-center rounded-full border border-slate-200 bg-white px-2 py-0.5 font-black leading-none text-slate-500 ${
            compact ? 'text-[length:var(--app-text-2xs)]' : 'text-[length:var(--app-text-xs)]'
          }`}
          aria-label={`${hiddenCount} more badges`}
        >
          +{hiddenCount}
        </span>
      )}
    </div>
  );
}

export default CaretakerBadgePills;
