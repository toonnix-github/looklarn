import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { MatchSummaryHeader } from '../components/matches/MatchSummaryHeader';
import { CaretakerMatchCard } from '../components/matches/CaretakerMatchCard';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileCheck,
  HeartPulse,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
} from 'lucide-react';
import { formatDate } from '../utils/formatters';
import {
  getAppointmentEventLabel,
  getElderMobilityMeta,
  getEnumLabel,
} from '../constants/careEnums';
import { calculateCarePrice } from '../utils/pricing';

export default function MatchResultsPage() {
  const { t, language, getLocalized } = useLanguage();
  const { caretakers, searchCriteria, elder } = useApp();
  const [sortBy, setSortBy] = useState('matchScore');

  // Sorted list of caretakers
  const sortedCaretakers = useMemo(() => {
    const list = [...(caretakers || [])];
    switch (sortBy) {
      case 'rating':
        return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'trips':
        return list.sort((a, b) => (b.completedTrips || 0) - (a.completedTrips || 0));
      case 'matchScore':
      default:
        return list.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    }
  }, [caretakers, sortBy]);

  // Display top 3 matched candidates
  const topMatches = sortedCaretakers.slice(0, 3);
  const topMatch = topMatches[0];
  const secondaryMatches = topMatches.slice(1, 3);
  const priceQuote = calculateCarePrice(searchCriteria);
  const elderNickname = elder ? getLocalized(elder, 'nickname') : (language === 'th' ? 'ยายพร' : 'Grandma Porn');
  const activityName = getAppointmentEventLabel(searchCriteria.activityType, language, 'label');
  const mobilityName = getEnumLabel(getElderMobilityMeta(searchCriteria.mobility), language, 'shortLabel');
  const formattedDate = searchCriteria.date
    ? formatDate(searchCriteria.date, language, 'short')
    : (language === 'th' ? '28 ส.ค. 69' : '28 Aug 26');
  const timeRange = searchCriteria.startTime && searchCriteria.endTime
    ? `${searchCriteria.startTime}-${searchCriteria.endTime}`
    : searchCriteria.timeSlot && searchCriteria.timeSlot.includes(':')
    ? searchCriteria.timeSlot
    : '08:00-12:00';
  const sortOptions = [
    { id: 'matchScore', label: language === 'th' ? 'เหมาะสุด' : 'Best' },
    { id: 'rating', label: language === 'th' ? 'รีวิว' : 'Reviews' },
    { id: 'trips', label: language === 'th' ? 'ทริป' : 'Trips' },
  ];

  const renderScore = (score, className = '') => (
    <span className={`inline-flex items-center justify-center rounded-full bg-emerald-50 font-black text-emerald-700 ring-1 ring-emerald-100 ${className}`}>
      {score}%
    </span>
  );

  return (
    <div
      data-testid="page-matches"
      className="h-full max-h-full overflow-hidden bg-slate-100 px-[4.1vw] py-[1.35dvh] sm:mx-auto sm:h-auto sm:max-h-none sm:max-w-7xl sm:space-y-6 sm:overflow-visible sm:bg-transparent sm:px-6 sm:py-5 lg:px-8 lg:py-8"
    >
      <section className="grid h-full min-h-0 grid-rows-[auto_1fr] gap-[1.15dvh] sm:hidden" aria-label="ผลลัพธ์ผู้ดูแล">
        <div className="overflow-hidden rounded-[min(5vw,1.25rem)] bg-white p-[3.1vw] shadow-sm ring-1 ring-slate-200/75">
          <div className="mb-[1dvh] flex items-start justify-between gap-[2vw]">
            <div className="min-w-0">
              <h1 className="text-[clamp(1.12rem,5.2vw,1.36rem)] font-black leading-tight text-slate-950">
                {language === 'th' ? `ผู้ดูแลที่เหมาะกับ${elderNickname}` : `Best caretakers for ${elderNickname}`}
              </h1>
              <p className="mt-[0.25dvh] text-[clamp(0.58rem,2.55vw,0.68rem)] font-bold leading-tight text-slate-500">
                {language === 'th' ? `เจอ ${topMatches.length} คนที่ตรงกับนัดนี้` : `${topMatches.length} matches for this outing`}
              </p>
            </div>
            <Link
              to="/find"
              aria-label={language === 'th' ? 'ปรับเงื่อนไข' : 'Refine search'}
              className="grid aspect-square h-[4.3dvh] shrink-0 place-items-center rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-100 active:scale-95"
            >
              <SlidersHorizontal className="h-[2dvh] w-[2dvh]" />
            </Link>
          </div>

          <div className="mb-[0.95dvh] flex flex-wrap gap-[1.2vw]">
            <span className="inline-flex items-center gap-[0.9vw] rounded-full bg-sky-50 px-[2vw] py-[0.42dvh] text-[clamp(0.52rem,2.25vw,0.62rem)] font-black text-sky-700 ring-1 ring-sky-100">
              <Sparkles className="h-[1.3dvh] w-[1.3dvh]" />
              {activityName}
            </span>
            <span className="inline-flex items-center gap-[0.9vw] rounded-full bg-emerald-50 px-[2vw] py-[0.42dvh] text-[clamp(0.52rem,2.25vw,0.62rem)] font-black text-emerald-700 ring-1 ring-emerald-100">
              <CalendarDays className="h-[1.3dvh] w-[1.3dvh]" />
              {formattedDate}
            </span>
            <span className="inline-flex items-center gap-[0.9vw] rounded-full bg-slate-100 px-[2vw] py-[0.42dvh] text-[clamp(0.52rem,2.25vw,0.62rem)] font-black text-slate-700">
              <Clock3 className="h-[1.3dvh] w-[1.3dvh]" />
              {timeRange}
            </span>
            <span className="rounded-full bg-indigo-50 px-[2vw] py-[0.42dvh] text-[clamp(0.52rem,2.25vw,0.62rem)] font-black text-indigo-700 ring-1 ring-indigo-100">
              {mobilityName}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-[1.5vw] rounded-full bg-slate-100 p-[0.55dvh] ring-1 ring-slate-200">
            {sortOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setSortBy(option.id)}
                className={`h-[3.6dvh] rounded-full text-[clamp(0.55rem,2.4vw,0.66rem)] font-black transition active:scale-[0.985] ${
                  sortBy === option.id
                    ? 'bg-white text-sky-700 shadow-sm'
                    : 'text-slate-500'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <section className="flex min-h-0 flex-col overflow-hidden rounded-[min(5vw,1.25rem)] bg-white p-[3.1vw] shadow-sm ring-1 ring-slate-200/75">
          {topMatch && (
            <article className="flex min-h-0 basis-[56%] flex-col justify-between overflow-hidden rounded-[min(4.4vw,1.1rem)] bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-[3vw] ring-2 ring-emerald-200">
              <div className="flex items-start justify-between gap-[2vw]">
                <span className="inline-flex items-center gap-[1vw] rounded-full bg-white px-[2vw] py-[0.45dvh] text-[clamp(0.52rem,2.25vw,0.62rem)] font-black text-emerald-700 shadow-sm ring-1 ring-emerald-100">
                  <Sparkles className="h-[1.4dvh] w-[1.4dvh]" />
                  {language === 'th' ? 'แนะนำสูงสุด' : 'Top pick'}
                </span>
                {renderScore(topMatch.matchScore, 'h-[4.9dvh] w-[4.9dvh] text-[clamp(0.72rem,3.1vw,0.86rem)]')}
              </div>

              <div className="grid min-h-0 grid-cols-[auto_1fr] items-center gap-[2.7vw]">
                <div className="relative aspect-square h-[9.4dvh] overflow-hidden rounded-[min(3.8vw,0.95rem)] bg-slate-100 shadow-sm ring-1 ring-white">
                  <img
                    src={topMatch.photo}
                    alt={getLocalized(topMatch, 'name')}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute bottom-[0.6dvh] right-[0.6dvh] grid aspect-square h-[2.4dvh] place-items-center rounded-full bg-emerald-500 text-white shadow-sm">
                    <CheckCircle2 className="h-[1.45dvh] w-[1.45dvh]" />
                  </span>
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-[clamp(1rem,4.3vw,1.14rem)] font-black leading-tight text-slate-950">
                    {getLocalized(topMatch, 'nickname') || getLocalized(topMatch, 'name')}
                  </h2>
                  <p className="line-clamp-2 text-[clamp(0.58rem,2.55vw,0.7rem)] font-bold leading-tight text-sky-700">
                    {getLocalized(topMatch, 'tierName')}
                  </p>
                  <div className="mt-[0.8dvh] grid grid-cols-3 gap-[1.2vw]">
                    <span className="rounded-full bg-white px-[1.6vw] py-[0.38dvh] text-center text-[clamp(0.5rem,2.12vw,0.6rem)] font-black text-slate-700 shadow-sm">
                      <Star className="mr-[0.5vw] inline h-[1.15dvh] w-[1.15dvh] fill-amber-400 text-amber-400" />
                      {topMatch.rating}
                    </span>
                    <span className="rounded-full bg-white px-[1.6vw] py-[0.38dvh] text-center text-[clamp(0.5rem,2.12vw,0.6rem)] font-black text-slate-700 shadow-sm">
                      {topMatch.experienceYears} ปี
                    </span>
                    <span className="rounded-full bg-white px-[1.6vw] py-[0.38dvh] text-center text-[clamp(0.5rem,2.12vw,0.6rem)] font-black text-emerald-700 shadow-sm">
                      ฿{priceQuote.totalPrice}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-[1.5vw]">
                {(topMatch.specialties || []).slice(0, 2).map((specialty, index) => (
                  <span
                    key={index}
                    className="truncate rounded-full bg-white/85 px-[2vw] py-[0.5dvh] text-[clamp(0.5rem,2.12vw,0.6rem)] font-black text-slate-600 ring-1 ring-slate-100"
                  >
                    {getLocalized(specialty)}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-[0.85fr_1.15fr] gap-[2vw]">
                <Link
                  to={`/caretaker/${topMatch.id}`}
                  className="flex h-[4.5dvh] items-center justify-center rounded-full bg-white text-[clamp(0.62rem,2.75vw,0.74rem)] font-black text-slate-700 shadow-sm ring-1 ring-slate-200 active:scale-[0.985]"
                >
                  ดูโปรไฟล์
                </Link>
                <Link
                  to={`/book/${topMatch.id}`}
                  className="flex h-[4.5dvh] items-center justify-center gap-[1.5vw] rounded-full bg-emerald-500 text-[clamp(0.62rem,2.75vw,0.74rem)] font-black text-white shadow-lg shadow-emerald-700/20 active:scale-[0.985]"
                >
                  จองคนนี้
                  <ArrowRight className="h-[1.7dvh] w-[1.7dvh]" />
                </Link>
              </div>
            </article>
          )}

          <div className="mt-[1dvh] grid min-h-0 flex-1 gap-[0.75dvh]">
            {secondaryMatches.map((caretaker) => (
              <article
                key={caretaker.id}
                className="grid min-h-0 grid-cols-[auto_1fr_auto] items-center gap-[2.2vw] rounded-[min(3.8vw,0.95rem)] bg-slate-50 px-[2.4vw] py-[0.8dvh] ring-1 ring-slate-100"
              >
                <div className="relative aspect-square h-[5.5dvh] overflow-hidden rounded-[min(2.8vw,0.7rem)] bg-slate-100">
                  <img src={caretaker.photo} alt={getLocalized(caretaker, 'name')} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-[1.4vw]">
                    <h3 className="truncate text-[clamp(0.72rem,3.1vw,0.84rem)] font-black leading-tight text-slate-950">
                      {getLocalized(caretaker, 'nickname') || getLocalized(caretaker, 'name')}
                    </h3>
                    {renderScore(caretaker.matchScore, 'h-[2.8dvh] px-[1.6vw] text-[clamp(0.48rem,2vw,0.58rem)]')}
                  </div>
                  <p className="truncate text-[clamp(0.52rem,2.25vw,0.62rem)] font-bold leading-tight text-slate-500">
                    {getLocalized(caretaker, 'tierName')}
                  </p>
                  <p className="text-[clamp(0.5rem,2.12vw,0.6rem)] font-black leading-tight text-slate-500">
                    ★ {caretaker.rating} · ฿{priceQuote.totalPrice}/นัด
                  </p>
                </div>
                <Link
                  to={`/book/${caretaker.id}`}
                  aria-label={`${language === 'th' ? 'จอง' : 'Book'} ${getLocalized(caretaker, 'nickname') || getLocalized(caretaker, 'name')}`}
                  className="grid aspect-square h-[4.1dvh] place-items-center rounded-full bg-white text-sky-700 shadow-sm ring-1 ring-sky-100 active:scale-95"
                >
                  <ArrowRight className="h-[1.9dvh] w-[1.9dvh]" />
                </Link>
              </article>
            ))}
          </div>
        </section>
      </section>

      <div className="hidden sm:block sm:space-y-6">
      {/* 1. Header with search summary & sorting controls */}
      <MatchSummaryHeader
        searchCriteria={searchCriteria}
        sortBy={sortBy}
        onSortChange={setSortBy}
        totalMatches={topMatches.length}
      />

      {/* 2. Top 3 Caretaker Match Cards Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {topMatches.map((caretaker, index) => (
          <CaretakerMatchCard
            key={caretaker.id}
            caretaker={caretaker}
            isTopMatch={index === 0 && sortBy === 'matchScore'}
            rank={index + 1}
          />
        ))}
      </div>

      {/* 3. Trust & Safety Guarantee Banner */}
      <div className="p-5 sm:p-6 bg-white rounded-2xl border border-sky-100 shadow-sm">
        <div className="max-w-2xl mb-5">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
            {t('matches.trustBannerTitle', 'มั่นใจทุกการดูแลด้วยมาตรฐาน Looklarn')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === 'th'
              ? 'ผู้ดูแลทุกคนผ่านการคัดกรองอย่างเข้มงวดและมีประกันอุบัติเหตุคุ้มครองตลอดระยะเวลาการให้บริการ'
              : 'Every companion undergoes rigorous verification and is covered by comprehensive outing insurance.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3.5 bg-white/90 backdrop-blur-xs rounded-2xl border border-slate-100 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                {t('matches.trustBanner1', 'ตรวจสอบประวัติอาชญากรรม 100%')}
              </h4>
              <p className="text-[11px] text-slate-400">
                {language === 'th' ? 'สำนักงานตำรวจแห่งชาติ' : 'Royal Thai Police'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 bg-white/90 backdrop-blur-xs rounded-2xl border border-slate-100 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 shrink-0">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                {t('matches.trustBanner2', 'ผ่านการฝึกอบรม CPR & ปฐมพยาบาล')}
              </h4>
              <p className="text-[11px] text-slate-400">
                {language === 'th' ? 'สภากาชาดไทย & สธ.' : 'Thai Red Cross Society'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 bg-white/90 backdrop-blur-xs rounded-2xl border border-slate-100 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                {t('matches.trustBanner3', 'ประกันอุบัติเหตุคุ้มครองตลอดทริป')}
              </h4>
              <p className="text-[11px] text-slate-400">
                {language === 'th' ? 'วงเงินสูงสุด 100,000 บาท' : 'Up to ฿100,000 coverage'}
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
