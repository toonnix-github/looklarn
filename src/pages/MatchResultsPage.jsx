import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { MatchSummaryHeader } from '../components/matches/MatchSummaryHeader';
import { CaretakerMatchCard } from '../components/matches/CaretakerMatchCard';
import { CaretakerBadgePills } from '../components/matches/CaretakerBadgePills';
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

  // Display a deep result set while keeping the strongest match highlighted.
  const topMatches = sortedCaretakers.slice(0, 20);
  const topMatch = topMatches[0];
  const secondaryMatches = topMatches.slice(1);
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
    { id: 'matchScore', label: 'AI score' },
    { id: 'rating', label: language === 'th' ? 'รีวิว' : 'Reviews' },
    { id: 'trips', label: language === 'th' ? 'ทริป' : 'Trips' },
  ];
  const renderAiScore = (score, isTop = false) => (
    <div
      className={`flex min-w-0 flex-col items-center justify-center rounded-full border font-black leading-none shadow-sm ${isTop ? 'self-start' : 'self-center'} ${
        isTop
          ? 'border-secondary-300 bg-primary-700 px-[1.6vw] py-[0.55dvh] text-white shadow-primary-900/15'
          : 'border-sub1-200 bg-sub1-50 px-[1.4vw] py-[0.42dvh] text-primary-700'
      }`}
    >
      <span className={isTop ? 'text-[length:var(--app-text-2xs)]' : 'text-[length:var(--app-text-3xs)]'}>
        AI match
      </span>
      <span className={isTop ? 'text-[length:var(--app-text-sm)]' : 'text-[length:var(--app-text-xs)]'}>
        {score}%
      </span>
    </div>
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
              <h1 className="text-[length:var(--app-text-xl)] font-black leading-tight text-slate-950">
                {language === 'th' ? `ผู้ดูแลที่เหมาะกับ${elderNickname}` : `Best caretakers for ${elderNickname}`}
              </h1>
              <p className="mt-[0.25dvh] text-[length:var(--app-text-xs)] font-bold leading-tight text-slate-500">
                {language === 'th' ? `เจอ ${topMatches.length} คนที่ตรงกับนัดนี้` : `${topMatches.length} matches for this outing`}
              </p>
            </div>
            <Link
              to="/find"
              aria-label={language === 'th' ? 'ปรับเงื่อนไข' : 'Refine search'}
              className="grid aspect-square h-[4.3dvh] shrink-0 place-items-center rounded-full bg-sub1-50 text-primary-700 ring-1 ring-sub1-200 active:scale-95"
            >
              <SlidersHorizontal className="h-[2dvh] w-[2dvh]" />
            </Link>
          </div>

          <div className="mb-[0.95dvh] flex flex-wrap gap-[1.2vw]">
            <span className="inline-flex items-center gap-[0.9vw] rounded-full bg-sky-50 px-[2vw] py-[0.42dvh] text-[length:var(--app-text-2xs)] font-black text-sky-700 ring-1 ring-sky-100">
              <Sparkles className="h-[1.3dvh] w-[1.3dvh]" />
              {activityName}
            </span>
            <span className="inline-flex items-center gap-[0.9vw] rounded-full bg-emerald-50 px-[2vw] py-[0.42dvh] text-[length:var(--app-text-2xs)] font-black text-emerald-700 ring-1 ring-emerald-100">
              <CalendarDays className="h-[1.3dvh] w-[1.3dvh]" />
              {formattedDate}
            </span>
            <span className="inline-flex items-center gap-[0.9vw] rounded-full bg-slate-100 px-[2vw] py-[0.42dvh] text-[length:var(--app-text-2xs)] font-black text-slate-700">
              <Clock3 className="h-[1.3dvh] w-[1.3dvh]" />
              {timeRange}
            </span>
            <span className="rounded-full bg-indigo-50 px-[2vw] py-[0.42dvh] text-[length:var(--app-text-2xs)] font-black text-indigo-700 ring-1 ring-indigo-100">
              {mobilityName}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-[1.5vw] rounded-full bg-slate-100 p-[0.55dvh] ring-1 ring-slate-200">
            {sortOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setSortBy(option.id)}
                className={`h-[3.6dvh] rounded-full text-[length:var(--app-text-xs)] font-black transition active:scale-[0.985] ${
                  sortBy === option.id
                    ? 'bg-white text-primary-700 shadow-sm'
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
            <article className="relative grid min-h-0 basis-[40%] grid-cols-[25vw_minmax(0,1fr)_auto] grid-rows-[auto_auto] gap-x-[2.2vw] gap-y-[1dvh] overflow-hidden rounded-[min(5vw,1.25rem)] border border-sub1-200 bg-gradient-to-br from-sub1-50 via-white to-secondary-50 p-[3vw] shadow-lg shadow-primary-900/10 ring-1 ring-secondary-300">
              <div className="absolute inset-x-0 top-0 h-[0.55dvh] bg-gradient-to-r from-primary-800 via-primary-600 to-secondary-400" />
              <div className="relative self-start overflow-hidden rounded-[min(4.2vw,1.05rem)] border-2 border-white bg-slate-100 shadow-md shadow-primary-900/10 ring-1 ring-sub1-200">
                <img
                  src={topMatch.photo}
                  alt={getLocalized(topMatch, 'name')}
                  className="aspect-square h-[9.8dvh] w-full object-cover"
                />
                <span className="absolute left-[0.6dvh] top-[0.6dvh] rounded-full bg-primary-700 px-[1.4vw] py-[0.25dvh] text-[length:var(--app-text-2xs)] font-black text-white shadow-sm">
                  #1
                </span>
                <span className="absolute bottom-[0.6dvh] right-[0.6dvh] grid aspect-square h-[2.4dvh] place-items-center rounded-full bg-secondary-700 text-sub1-50 shadow-sm">
                  <CheckCircle2 className="h-[1.45dvh] w-[1.45dvh]" />
                </span>
              </div>
              <div className="min-w-0 pt-[0.25dvh]">
                <span className="mb-[0.45dvh] inline-flex rounded-full bg-sub1-100 px-[1.8vw] py-[0.3dvh] text-[length:var(--app-text-2xs)] font-black text-primary-700 ring-1 ring-sub1-200">
                  {language === 'th' ? 'ตัวเลือกอันดับหนึ่ง' : 'Top candidate'}
                </span>
                <h2 className="truncate text-[length:var(--app-text-lg)] font-black leading-tight text-slate-950">
                  {getLocalized(topMatch, 'name')}
                </h2>
                <p className="truncate text-[length:var(--app-text-2xs)] font-bold leading-tight text-slate-500">
                  {topMatch.age} {language === 'th' ? 'ปี' : 'yrs'}
                </p>
                <div className="mt-[0.75dvh] grid grid-cols-2 gap-[1.2vw]">
                  <span className="rounded-[min(2.6vw,0.65rem)] border border-amber-100 bg-white px-[1.6vw] py-[0.52dvh] text-center shadow-sm">
                    <span className="block text-[length:var(--app-text-3xs)] font-black leading-none text-sub2-500">
                      {language === 'th' ? 'รีวิว' : 'Rating'}
                    </span>
                    <span className="text-[length:var(--app-text-2xs)] font-black text-slate-800">
                      <Star className="mr-[0.35vw] inline h-[1.05dvh] w-[1.05dvh] fill-amber-400 text-amber-400" />
                      {topMatch.rating}
                    </span>
                  </span>
                  <span className="rounded-[min(2.6vw,0.65rem)] border border-sky-100 bg-white px-[1.6vw] py-[0.52dvh] text-center shadow-sm">
                    <span className="block text-[length:var(--app-text-3xs)] font-black leading-none text-sub2-500">
                      {language === 'th' ? 'บริการ' : 'Services'}
                    </span>
                    <span className="text-[length:var(--app-text-2xs)] font-black text-slate-800">
                      {topMatch.completedTrips}+
                    </span>
                  </span>
                </div>
              </div>
              <Link
                to={`/caretaker/${topMatch.id}`}
                className="flex h-[3.8dvh] min-w-[17vw] items-center justify-center self-start rounded-full bg-sub1-50 px-[2vw] text-[length:var(--app-text-2xs)] font-black text-primary-700 shadow-sm ring-1 ring-sub1-200 active:scale-[0.985]"
              >
                {language === 'th' ? 'โปรไฟล์' : 'Profile'}
              </Link>
              {renderAiScore(topMatch.matchScore, true)}
              <div className="min-w-0 self-start rounded-full bg-white/80 px-[1.3vw] py-[0.45dvh] shadow-sm ring-1 ring-white">
                <CaretakerBadgePills caretaker={topMatch} compact />
              </div>
              <Link
                to={`/book/${topMatch.id}`}
                className="flex h-[3.8dvh] min-w-[17vw] items-center justify-center gap-[1vw] rounded-full bg-secondary-700 px-[2vw] text-[length:var(--app-text-2xs)] font-black text-sub1-50 shadow-lg shadow-secondary-700/20 active:scale-[0.985]"
              >
                {language === 'th' ? 'จอง' : 'Book'}
                <ArrowRight className="h-[1.55dvh] w-[1.55dvh]" />
              </Link>
            </article>
          )}

          <div className="mt-[1dvh] min-h-0 flex-1 space-y-[0.75dvh] overflow-y-auto pr-[0.4vw]">
            {secondaryMatches.map((caretaker) => (
              <article
                key={caretaker.id}
                className="grid min-h-0 shrink-0 grid-cols-[18vw_minmax(0,1fr)_auto] grid-rows-[auto_auto] gap-x-[2vw] gap-y-[0.55dvh] rounded-[min(3.8vw,0.95rem)] bg-slate-50 px-[2.4vw] py-[0.85dvh] ring-1 ring-slate-100"
              >
                <div className="min-w-0 self-start">
                  <div className="mx-auto aspect-square h-[5.3dvh] overflow-hidden rounded-[min(2.8vw,0.7rem)] bg-slate-100">
                    <img src={caretaker.photo} alt={getLocalized(caretaker, 'name')} className="h-full w-full object-cover" />
                  </div>
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-[length:var(--app-text-sm)] font-black leading-tight text-slate-950">
                    {getLocalized(caretaker, 'name')}
                  </h3>
                  <p className="text-[length:var(--app-text-2xs)] font-bold leading-tight text-slate-500">
                    {caretaker.age} {language === 'th' ? 'ปี' : 'yrs'} · {caretaker.completedTrips}+ {language === 'th' ? 'บริการ' : 'services'} · ★ {caretaker.rating}
                  </p>
                </div>
                <Link
                  to={`/caretaker/${caretaker.id}`}
                  aria-label={`${language === 'th' ? 'ดูโปรไฟล์' : 'View profile'} ${getLocalized(caretaker, 'nickname') || getLocalized(caretaker, 'name')}`}
                  className="flex h-[3dvh] min-w-[14vw] items-center justify-center self-start rounded-full bg-white px-[1.8vw] text-[length:var(--app-text-2xs)] font-black text-slate-700 shadow-sm ring-1 ring-slate-200 active:scale-95"
                >
                  {language === 'th' ? 'โปรไฟล์' : 'Profile'}
                </Link>
                {renderAiScore(caretaker.matchScore)}
                <CaretakerBadgePills caretaker={caretaker} compact className="min-w-0 self-center" />
                <Link
                  to={`/book/${caretaker.id}`}
                  aria-label={`${language === 'th' ? 'จอง' : 'Book'} ${getLocalized(caretaker, 'nickname') || getLocalized(caretaker, 'name')}`}
                  className="flex h-[3dvh] min-w-[14vw] items-center justify-center self-center rounded-full bg-sub1-50 px-[1.8vw] text-[length:var(--app-text-2xs)] font-black text-primary-700 shadow-sm ring-1 ring-sub1-200 active:scale-95"
                >
                  {language === 'th' ? 'จอง' : 'Book'}
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
            {t('matches.trustBannerTitle', 'มั่นใจทุกการดูแลด้วยมาตรฐาน CareMate')}
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
              <p className="text-[11px] text-sub2-500">
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
              <p className="text-[11px] text-sub2-500">
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
              <p className="text-[11px] text-sub2-500">
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
