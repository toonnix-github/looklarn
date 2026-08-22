import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Badge } from '../ui/Badge';
import { Copy, Check, Sparkles, ShieldCheck } from 'lucide-react';

export default function PromoBanner({ className = '' }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText('CAREMATE');
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className={`relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-900 via-primary-800 to-secondary-500 text-white p-6 sm:p-10 shadow-lg shadow-primary-900/15 ${className}`}>
      {/* Decorative glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl space-y-4">
        <Badge variant="warning" className="bg-amber-400 text-slate-950 border-none font-bold px-3 py-1 text-xs">
          <Sparkles className="w-3.5 h-3.5 mr-1" />
          {t('home.promo.badge', 'สิทธิพิเศษสมาชิกใหม่')}
        </Badge>

        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {t('home.promo.title', 'รับส่วนลดพิเศษสำหรับสถานพยาบาลพันธมิตร')}
        </h3>

        <p className="text-sm sm:text-base text-sub1-50 leading-relaxed max-w-2xl">
          {t('home.promo.desc', 'รับส่วนลด 150 บาท สำหรับการนัดหมายพาผู้สูงอายุไปคลินิกและศูนย์การแพทย์พันธมิตรครั้งแรก')}
        </p>

        {/* Promo code strip */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <span className="text-xs text-sub1-100 font-medium">{t('home.promo.codeLabel', 'โค้ดส่วนลด:')}</span>
          <span className="px-3.5 py-1.5 bg-white/20 backdrop-blur-md rounded-xl font-mono font-black tracking-widest text-sm text-white border border-white/30 shadow-inner">
            CAREMATE
          </span>
          <button
            type="button"
            onClick={handleCopyCode}
            aria-label="Copy promo code"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-sub1-50 text-primary-700 hover:bg-sub1-100 active:scale-95 font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-secondary-700" /> : <Copy className="w-4 h-4 text-primary-700" />}
            <span>{copied ? t('home.promo.codeCopied', 'คัดลอกโค้ดแล้ว!') : t('home.promo.copyCode', 'คัดลอกโค้ด')}</span>
          </button>
        </div>

        {/* Partner list and insurance badge */}
        <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-sub1-100">
          <p>
            {t('home.promo.partnerHospitals', 'ศูนย์การแพทย์พันธมิตร: รพ.ศิริราช • รพ.จุฬาลงกรณ์ • รพ.รามาธิบดี • รพ.พระมงกุฎเกล้า')}
          </p>
          <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-md text-[11px] font-medium text-white border border-white/20">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            {t('home.promo.insuranceBadge', 'คุ้มครองอุบัติเหตุ 100% ตลอดการเดินทาง')}
          </span>
        </div>
      </div>
    </section>
  );
}
