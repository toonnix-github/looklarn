import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { MatchSummaryHeader } from '../components/matches/MatchSummaryHeader';
import { CaretakerMatchCard } from '../components/matches/CaretakerMatchCard';
import { ShieldCheck, HeartPulse, Award, FileCheck, CheckCircle2 } from 'lucide-react';

export default function MatchResultsPage() {
  const { t, language } = useLanguage();
  const { caretakers, searchCriteria } = useApp();
  const [sortBy, setSortBy] = useState('matchScore');

  // Sorted list of caretakers
  const sortedCaretakers = useMemo(() => {
    const list = [...(caretakers || [])];
    switch (sortBy) {
      case 'rating':
        return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'price_asc':
        return list.sort((a, b) => (a.hourlyRate || 0) - (b.hourlyRate || 0));
      case 'price_desc':
        return list.sort((a, b) => (b.hourlyRate || 0) - (a.hourlyRate || 0));
      case 'trips':
        return list.sort((a, b) => (b.completedTrips || 0) - (a.completedTrips || 0));
      case 'matchScore':
      default:
        return list.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    }
  }, [caretakers, sortBy]);

  // Display top 3 matched candidates
  const topMatches = sortedCaretakers.slice(0, 3);

  return (
    <div data-testid="page-matches" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* 1. Header with search summary & sorting controls */}
      <MatchSummaryHeader
        searchCriteria={searchCriteria}
        sortBy={sortBy}
        onSortChange={setSortBy}
        totalMatches={topMatches.length}
      />

      {/* 2. Top 3 Caretaker Match Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      <div className="p-6 sm:p-8 bg-gradient-to-r from-sky-50 via-ice-100 to-emerald-50 rounded-3xl border border-sky-100/80 shadow-xs">
        <div className="text-center max-w-2xl mx-auto mb-6">
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
  );
}
