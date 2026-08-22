import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { MatchScoreRing } from '../ui/MatchScoreRing';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Star, ShieldCheck, ArrowLeft, Share2, Sparkles, Check } from 'lucide-react';

export function CaretakerWaveHero({ caretaker }) {
  const { t, getLocalized, language } = useLanguage();
  const [copied, setCopied] = useState(false);

  if (!caretaker) return null;

  const handleShare = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-sky-600 via-sky-500 to-teal-500 text-white shadow-xl shadow-sky-500/15">
      {/* Top Action Bar */}
      <div className="relative z-10 flex items-center justify-between p-4 sm:p-6 pb-0">
        <Link to="/matches">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-semibold backdrop-blur-md border border-white/20 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('caretaker.backToMatches', 'กลับสู่ผลการจับคู่')}</span>
          </button>
        </Link>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-semibold backdrop-blur-md border border-white/20 transition-all cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
          <span>{copied ? t('caretaker.shareCopied', 'คัดลอกลิงก์โปรไฟล์แล้ว!') : t('caretaker.shareProfile', 'แชร์โปรไฟล์')}</span>
        </button>
      </div>

      {/* Main Profile Content */}
      <div className="relative z-10 p-6 sm:p-10 pt-4 sm:pt-6 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 sm:gap-8">
        {/* Left Side: Avatar + Details */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 text-center sm:text-left">
          {/* Avatar with Verified check badge */}
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden bg-white/20 border-4 border-white/90 shadow-2xl shrink-0">
            <img
              src={caretaker.photo}
              alt={getLocalized(caretaker, 'name')}
              className="w-full h-full object-cover"
            />
            <div
              className="absolute bottom-1 right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md"
              title="Verified Companion"
            >
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {getLocalized(caretaker, 'name')}
              </h1>
              {caretaker.nickname && (
                <span className="text-lg sm:text-xl font-medium text-sky-100">
                  ({getLocalized(caretaker, 'nickname')})
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-xs border border-white/30">
                {getLocalized(caretaker, 'tierName')}
              </span>
              <Badge variant="verified" className="bg-emerald-500/80 text-white border-white/30 backdrop-blur-xs">
                {t('caretaker.verified', 'ผ่านการตรวจสอบประวัติ')}
              </Badge>
            </div>

            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 text-xs sm:text-sm text-sky-50 pt-1">
              <span className="flex items-center gap-1 font-bold">
                <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                {caretaker.rating}
                <span className="font-normal text-sky-100">
                  ({caretaker.reviewsCount})
                </span>
              </span>
              <span>•</span>
              <span>{caretaker.experienceYears} {language === 'th' ? 'ปี' : 'years'}</span>
              <span>•</span>
              <span>{caretaker.completedTrips}+ {language === 'th' ? 'ทริปสำเร็จ' : 'trips'}</span>
            </div>
          </div>
        </div>

        {/* Right Side: AI Matching Score Glassmorphic Card */}
        <div className="bg-white/15 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-white/25 flex flex-col items-center justify-center text-center shadow-lg shrink-0 w-full sm:w-44">
          <MatchScoreRing
            score={caretaker.matchScore}
            size="lg"
            className="text-white"
          />
          <span className="text-xs font-extrabold text-white mt-2">
            AI Matching Score
          </span>
          <span className="text-[11px] text-sky-100 font-medium">
            {t('caretaker.compatibilityRate', 'ความเข้ากันได้')}
          </span>
        </div>
      </div>

      {/* Decorative Wave Divider at Bottom */}
      <div className="relative w-full overflow-hidden leading-none z-0">
        <svg
          className="relative block w-full h-8 sm:h-12 text-[#F8FBFF]"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C150,90 350,-40 500,60 C650,160 900,10 1200,40 L1200,120 L0,120 Z"
            fill="currentColor"
            opacity="0.25"
          />
          <path
            d="M0,30 C200,110 450,10 700,70 C950,130 1100,50 1200,60 L1200,120 L0,120 Z"
            fill="currentColor"
            opacity="0.4"
          />
          <path
            d="M0,60 C150,120 350,40 600,90 C850,140 1050,70 1200,80 L1200,120 L0,120 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );
}

export default CaretakerWaveHero;
