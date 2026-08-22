import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, Search, Calendar, ShieldCheck, Heart, Award, Star } from 'lucide-react';

export default function HeroBanner({ onFindClick, className = '', headingAs = 'h1' }) {
  const { t } = useLanguage();
  const Heading = headingAs;

  return (
    <section className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-500 text-white p-8 sm:p-12 lg:p-16 shadow-xl shadow-primary-900/15 ${className}`}>
      {/* Decorative backdrop elements */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-secondary-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
        {/* AI Badge Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>{t('home.hero.badge', 'AI-Powered Elder Companion Matching')}</span>
        </div>

        {/* Main Headline */}
        <Heading className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
          {t('home.hero.title', 'ให้ CareMate ดูแลคนที่คุณรัก ในทุกช่วงเวลาสำคัญ')}
        </Heading>

        {/* Subtitle */}
        <p className="text-base sm:text-lg lg:text-xl text-sub1-50 max-w-2xl mx-auto leading-relaxed">
          {t('home.hero.subtitle', 'บริการจับคู่ผู้ดูแลมืออาชีพที่ผ่านการตรวจสอบประวัติ พาผู้สูงอายุไปพบแพทย์ ท่องเที่ยว หรือทำกิจกรรมนอกบ้านอย่างอบอุ่นใจ เสมือนมีลูกหลานอยู่เคียงข้าง')}
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            to="/find"
            onClick={onFindClick}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm sm:text-base bg-sub1-50 hover:bg-sub1-100 text-primary-900 shadow-lg shadow-primary-900/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Search className="w-5 h-5" />
            <span>{t('home.hero.ctaPrimary', 'ค้นหาผู้ดูแล')}</span>
          </Link>
          <Link
            to="/bookings"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm sm:text-base bg-white/15 hover:bg-white/25 text-white border border-white/40 backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Calendar className="w-5 h-5" />
            <span>{t('home.hero.ctaSecondary', 'การจองของฉัน')}</span>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 text-xs font-semibold text-white">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-secondary-200" />
            {t('home.hero.trustBadge1', 'ตรวจสอบประวัติ 100%')}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 shadow-xs">
            <Heart className="w-4 h-4 text-rose-300" />
            {t('home.hero.trustBadge2', 'ผ่านการอบรมปฐมพยาบาล & CPR')}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 shadow-xs">
            <Award className="w-4 h-4 text-amber-300" />
            {t('home.hero.trustBadge3', 'ประกันอุบัติเหตุคุ้มครองทุกทริป')}
          </span>
        </div>

        {/* Social Proof Rating */}
        <div className="flex items-center justify-center gap-1.5 pt-2 text-xs sm:text-sm font-medium text-sub1-100">
          <div className="flex items-center text-amber-300">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-300" />
            ))}
          </div>
          <span>{t('home.hero.trustScore', 'คะแนนความพึงพอใจ 4.95/5 จากกว่า 1,200 ครอบครัว')}</span>
        </div>
      </div>
    </section>
  );
}
