import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, Loader2 } from 'lucide-react';

export default function AiMatchingLoader({ onComplete, className = '' }) {
  const { t } = useLanguage();
  const [phase, setPhase] = useState(1);
  const [progress, setProgress] = useState(20);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setPhase(2);
      setProgress(60);
    }, 600);

    const timer2 = setTimeout(() => {
      setPhase(3);
      setProgress(90);
    }, 1300);

    const timer3 = setTimeout(() => {
      setProgress(100);
      if (onComplete) {
        onComplete();
      }
    }, 1900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []); // Run once on mount

  const statusText =
    phase === 1
      ? t('find.matchingLoader.step1', 'ประมวลผลข้อมูลความต้องการด้านร่างกายและโรคประจำตัว...')
      : phase === 2
      ? t('find.matchingLoader.step2', 'ตรวจสอบประวัติ ใบรับรอง และตารางเวลาว่าง...')
      : t('find.matchingLoader.step3', 'คำนวณคะแนนความเข้ากันได้ และคัดเลือก 3 ผู้ดูแลอันดับสูงสุด...');

  return (
    <div className={`max-w-xl mx-auto px-4 py-16 sm:py-24 text-center space-y-8 ${className}`}>
      {/* Radar Pulse / Ring Animation */}
      <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
        {/* Outer glowing halo */}
        <div className="absolute inset-0 rounded-full bg-sky-400 animate-ping opacity-25" />
        <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-sky-400 to-emerald-400 opacity-20 blur-lg animate-pulse" />

        {/* Outer spinning ring */}
        <div className="absolute inset-0 rounded-full border-4 border-sky-100 border-t-sky-500 animate-spin" />

        {/* Center icon badge */}
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-sky-500 via-sky-600 to-emerald-500 flex items-center justify-center text-white shadow-xl shadow-sky-500/30">
          <Sparkles className="w-10 h-10 text-white animate-bounce" />
        </div>
      </div>

      {/* Title & Subtitle */}
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {t('find.matchingLoader.title', 'AI กำลังค้นหาผู้ดูแลที่เหมาะสม...')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          {t('find.matchingLoader.subtitle', 'ระบบกำลังประมวลผลข้อมูลสุขภาพ ทักษะ และตารางเวลาเพื่อคัดสรรผู้ดูแลที่ดีที่สุด')}
        </p>
      </div>

      {/* Animated Status Pill */}
      <div className="p-4 sm:p-5 bg-sky-50 rounded-2xl border border-sky-200/80 text-xs sm:text-sm font-bold text-sky-800 shadow-xs flex items-center justify-center gap-2.5 transition-all duration-300">
        <Loader2 className="w-4 h-4 text-sky-600 animate-spin shrink-0" />
        <span>{statusText}</span>
      </div>

      {/* Linear progress bar */}
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
        <div
          className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
