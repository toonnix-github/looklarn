import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/Button';
import { Star, BriefcaseBusiness, Sparkles } from 'lucide-react';
import { CaretakerBadgePills } from './CaretakerBadgePills';

export function CaretakerMatchCard({
  caretaker,
  isTopMatch = false,
  rank = 1,
}) {
  const { t, getLocalized, language } = useLanguage();

  if (!caretaker) return null;

  const isBest = isTopMatch || caretaker.matchScore >= 95 || rank === 1;

  return (
    <div
      className={`group relative rounded-3xl transition-all duration-300 flex flex-col justify-between overflow-hidden bg-white border ${
        isBest
          ? 'border-emerald-300 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-400/40'
          : 'border-slate-100 shadow-sm hover:border-sky-200 hover:shadow-md'
      }`}
    >
      <div className="grid grid-cols-[5rem_1fr] gap-4 p-5 sm:grid-cols-[5.75rem_1fr] sm:p-6">
        <div className="min-w-0">
          <div className="relative mx-auto h-16 w-16 overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 shadow-xs sm:h-20 sm:w-20">
            <img
              src={caretaker.photo}
              alt={getLocalized(caretaker, 'name')}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {caretaker.verifiedBadges && (
              <span className="absolute bottom-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white shadow-xs">
                ✓
              </span>
            )}
          </div>
          <CaretakerBadgePills caretaker={caretaker} compact className="mt-2 justify-center" />
        </div>

        <div className="min-w-0 space-y-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg leading-tight truncate">
              {getLocalized(caretaker, 'name')}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {caretaker.age} {language === 'th' ? 'ปี' : 'yrs'}
            </p>
          </div>

          <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50 p-3">
            <div className="flex items-center gap-1.5 rounded-xl bg-emerald-50 px-2 py-1 ring-1 ring-emerald-100">
              <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="font-black text-emerald-700 text-sm">{caretaker.matchScore}%</span>
              <span className="text-xs text-emerald-700 font-bold">
                AI match
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
              <span className="font-black text-slate-800 text-sm">{caretaker.rating}</span>
              <span className="text-xs text-slate-400 font-normal">
                {language === 'th' ? 'คะแนนรีวิว' : 'review score'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <BriefcaseBusiness className="w-4 h-4 text-sky-500 shrink-0" />
              <span className="font-black text-slate-800 text-sm">{caretaker.completedTrips}+</span>
              <span className="text-xs text-slate-400 font-normal">
                {language === 'th' ? 'บริการ' : 'services'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-5 pt-0 flex items-center gap-2">
        <Link to={`/caretaker/${caretaker.id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full font-semibold">
            {t('matches.viewProfileBtn', 'ดูโปรไฟล์')}
          </Button>
        </Link>
        <Link to={`/book/${caretaker.id}`} className="flex-1">
          <Button variant="secondary" size="sm" className="w-full font-bold shadow-xs">
            {t('matches.bookNowBtn', 'จองทันที')}
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default CaretakerMatchCard;
