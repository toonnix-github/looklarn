import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/Button';
import { Sparkles, SlidersHorizontal, Calendar, Clock, DollarSign, Activity, ArrowUpDown } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { getAppointmentEventLabel, getElderMobilityMeta, getEnumLabel } from '../../constants/careEnums';
import { calculateCarePrice } from '../../utils/pricing';

export function MatchSummaryHeader({
  searchCriteria = {},
  sortBy = 'matchScore',
  onSortChange,
  totalMatches = 3,
}) {
  const { t, language } = useLanguage();

  const getMobilityLabel = (mob) => {
    return getEnumLabel(getElderMobilityMeta(mob), language, 'shortLabel');
  };

  const formattedDate = searchCriteria.date
    ? formatDate(searchCriteria.date, language)
    : (language === 'th' ? '28 ส.ค. 2569' : '28 Aug 2026');

  const duration = searchCriteria.durationHours || 4;
  const priceQuote = calculateCarePrice(searchCriteria);
  const activityName = getAppointmentEventLabel(searchCriteria.activityType, language, 'fullLabel');
  const mobilityName = getMobilityLabel(searchCriteria.mobility);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-5">
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-600 border border-sky-200/60 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-sky-500 animate-pulse" />
            <span>{t('matches.badge', 'AI Matching Completed')}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
            {t('matches.title', 'ผลการจับคู่ผู้ดูแลที่เหมาะสมที่สุด')}
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            {t('matches.subtitle', 'ระบบ Looklarn AI คัดเลือก 3 ผู้ดูแลที่มีคะแนนความเข้ากันได้สูงสุดตามความต้องการของคุณ')}
          </p>
        </div>

        <Link to="/find" className="self-start md:self-center">
          <Button variant="outline" size="sm" leftIcon={<SlidersHorizontal className="w-4 h-4" />}>
            {t('matches.refineBtn', 'ปรับแต่งเงื่อนไขการค้นหา')}
          </Button>
        </Link>
      </div>

      {/* Search Criteria Pill Overview */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
          <span className="font-bold text-slate-700">{t('matches.criteriaTitle', 'เงื่อนไขการค้นหาของคุณ')}:</span>
          
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-sky-50 text-sky-700 font-medium rounded-lg border border-sky-100">
            <Activity className="w-3.5 h-3.5 text-sky-500" />
            {activityName}
          </span>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 font-medium rounded-lg border border-emerald-100">
            <Calendar className="w-3.5 h-3.5 text-emerald-500" />
            {formattedDate}
          </span>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 font-medium rounded-lg">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            {duration} {language === 'th' ? 'ชั่วโมง' : 'hours'}
          </span>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-700 font-medium rounded-lg border border-indigo-100">
            {mobilityName}
          </span>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-800 font-medium rounded-lg border border-amber-100">
            <DollarSign className="w-3.5 h-3.5 text-amber-600" />
            ฿{priceQuote.totalPrice} / {language === 'th' ? 'นัด' : 'booking'}
          </span>
        </div>
      </div>

      {/* Sort Bar & Count Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="text-sm font-semibold text-slate-700">
          {t('matches.resultsFound', { count: totalMatches })}
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" />
            {t('matches.sortByLabel', 'เรียงตาม:')}
          </span>
          <div className="inline-flex max-w-full overflow-x-auto p-0.5 bg-slate-100 rounded-xl border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => onSortChange && onSortChange('matchScore')}
              className={`shrink-0 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                sortBy === 'matchScore'
                  ? 'bg-white text-sky-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('matches.sortMatchScore', 'คะแนนความเข้ากันได้ (สูงสุด)')}
            </button>
            <button
              type="button"
              onClick={() => onSortChange && onSortChange('rating')}
              className={`shrink-0 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                sortBy === 'rating'
                  ? 'bg-white text-sky-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('matches.sortRating', 'คะแนนรีวิว (สูงสุด)')}
            </button>
            <button
              type="button"
              onClick={() => onSortChange && onSortChange('trips')}
              className={`shrink-0 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                sortBy === 'trips'
                  ? 'bg-white text-sky-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'th' ? 'จำนวนทริปสำเร็จ' : 'Completed trips'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MatchSummaryHeader;
