import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { MatchScoreRing } from '../ui/MatchScoreRing';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Star, ShieldCheck, CheckCircle2, Award, Sparkles, Clock, ArrowRight } from 'lucide-react';

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
      <div className="p-5 sm:p-6 space-y-5">
        {/* Top Header: Score Ring + Badges */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <MatchScoreRing
              score={caretaker.matchScore}
              size="md"
              showSublabel
              sublabel={t('matches.matchScoreLabel', 'ความเข้ากันได้')}
            />
          </div>

          <div className="flex flex-col items-end gap-1.5">
            {isBest ? (
              <Badge variant="match">
                {t('matches.bestMatchBadge', '★ แนะนำสูงสุด 96%')}
              </Badge>
            ) : (
              <Badge variant="verified">
                {t('matches.verifiedBadge', 'ผ่านการตรวจสอบประวัติ')}
              </Badge>
            )}

            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {t('matches.availableStatus', 'พร้อมให้บริการ')}
            </span>
          </div>
        </div>

        {/* Profile Details */}
        <div className="flex items-center gap-3.5 pt-1">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/80 shadow-xs">
            <img
              src={caretaker.photo}
              alt={getLocalized(caretaker, 'name')}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {caretaker.verifiedBadges && (
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[10px] shadow-xs">
                ✓
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg leading-tight truncate">
              {getLocalized(caretaker, 'name')}
            </h3>
            <p className="text-xs text-sky-600 font-semibold mt-0.5 line-clamp-1">
              {getLocalized(caretaker, 'tierName')}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {caretaker.experienceYears} {language === 'th' ? 'ปีประสบการณ์' : 'yrs experience'} • {caretaker.completedTrips}+ {language === 'th' ? 'ทริปสำเร็จ' : 'trips'}
            </p>
          </div>
        </div>

        {/* Rating & Rate Strip */}
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
            <span className="font-black text-slate-800 text-sm">{caretaker.rating}</span>
            <span className="text-xs text-slate-400 font-normal">
              ({caretaker.reviewsCount} {language === 'th' ? 'รีวิว' : 'reviews'})
            </span>
          </div>

          <div className="text-right">
            <span className="text-base sm:text-lg font-black text-emerald-600">
              ฿{caretaker.hourlyRate}
            </span>
            <span className="text-xs font-semibold text-slate-500 ml-1">
              / {t('common.hrShort', 'ชม.')}
            </span>
          </div>
        </div>

        {/* Specialty Chips */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            {t('matches.specialtyTagsTitle', 'ความเชี่ยวชาญ:')}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {(caretaker.specialties || []).slice(0, 3).map((sp, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-[11px] font-medium bg-sky-50 text-sky-800 px-2.5 py-1 rounded-lg border border-sky-100"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                <span>{getLocalized(sp)}</span>
              </span>
            ))}
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
          <Button variant="accent" size="sm" className="w-full font-bold shadow-xs">
            {t('matches.bookNowBtn', 'จองทันที')}
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default CaretakerMatchCard;
