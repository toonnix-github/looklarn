import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles } from 'lucide-react';

export default function CtaSection({ className = '' }) {
  const { t } = useLanguage();

  return (
    <section className={`relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-900 via-primary-800 to-secondary-500 text-white p-8 sm:p-12 text-center shadow-xl shadow-primary-900/15 ${className}`}>
      {/* Decorative backdrop */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-secondary-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto space-y-4">
        <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          {t('home.ctaBanner.title', 'พร้อมมอบความสุขและความอบอุ่นใจให้ผู้สูงอายุของคุณแล้วหรือยัง?')}
        </h3>
        <p className="text-sm sm:text-base text-sub1-50 leading-relaxed">
          {t('home.ctaBanner.subtitle', 'เริ่มต้นจับคู่ผู้ดูแลที่ตรงใจกับ CareMate วันนี้ ไม่มีข้อผูกมัด จองง่ายใน 3 นาที')}
        </p>
        <div className="pt-3">
          <Link
            to="/find"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black text-sm sm:text-base bg-sub1-50 hover:bg-sub1-100 text-primary-900 shadow-lg shadow-primary-900/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-5 h-5" />
            <span>{t('home.ctaBanner.button', 'ค้นหาผู้ดูแล')}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
