import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/Button';
import { Sparkles, Star } from 'lucide-react';

export function StickyBookingBar({ caretaker, className = '' }) {
  const { t, getLocalized, language } = useLanguage();

  if (!caretaker) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl px-4 sm:px-8 py-3 sm:py-4 transition-transform duration-300 ${className}`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Caretaker Info & Pricing */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-xs">
            <img
              src={caretaker.photo}
              alt={getLocalized(caretaker, 'name')}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight truncate max-w-[160px] sm:max-w-xs">
                {getLocalized(caretaker, 'name')}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                {caretaker.rating}
              </span>
            </div>

            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xs text-slate-400 font-medium">
                {t('caretaker.stickyBar.rateLabel', 'อัตราค่าบริการ')}:
              </span>
              <span className="text-lg sm:text-2xl font-black text-emerald-600">
                ฿{caretaker.hourlyRate}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                / {t('common.hrShort', 'ชม.')}
              </span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div>
          <Link to={`/book/${caretaker.id}`}>
            <Button
              variant="accent"
              size="lg"
              className="font-bold shadow-lg shadow-emerald-500/25 px-5 sm:px-8 py-3 text-sm sm:text-base whitespace-nowrap"
            >
              {t('caretaker.bookThisCaretaker', 'จองผู้ดูแลคนนี้')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default StickyBookingBar;
