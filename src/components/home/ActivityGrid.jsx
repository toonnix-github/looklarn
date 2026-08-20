import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Stethoscope, Sun, ShoppingBag, Trees, ArrowRight, Sparkles, Check } from 'lucide-react';

const iconMap = {
  hospital: <Stethoscope className="w-5 h-5 text-sky-500" />,
  temple: <Sun className="w-5 h-5 text-amber-500" />,
  tour: <ShoppingBag className="w-5 h-5 text-teal-500" />,
  park: <Trees className="w-5 h-5 text-emerald-500" />,
};

export default function ActivityGrid({ onSelectActivity, className = '' }) {
  const { t, getLocalized } = useLanguage();
  const { activities, updateSearchCriteria } = useApp();
  const navigate = useNavigate();

  const handleCardClick = (act) => {
    const selectedType = act.type || 'hospital';
    updateSearchCriteria({ activityType: selectedType });
    if (onSelectActivity) {
      onSelectActivity(selectedType);
    }
    navigate(`/find?activity=${selectedType}`);
  };

  return (
    <section className={`space-y-4 sm:space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl space-y-1.5 sm:space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md border border-sky-200/50">
            {t('home.activities.tag', 'กิจกรรมยอดนิยม')}
          </span>
          <h2 className="text-xl sm:text-3xl font-black text-slate-900">
            {t('home.activities.title', 'เลือกกิจกรรมที่เหมาะกับคนที่คุณรัก')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {t('home.activities.subtitle', 'ครอบคลุมทุกความต้องการ ทั้งการดูแลสุขภาพ นันทนาการ และงานสังคม')}
          </p>
        </div>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {(activities || []).map((act) => {
          const actTitle = getLocalized(act, 'title');
          const actSubtitle = getLocalized(act, 'subtitle');
          const actDesc = getLocalized(act, 'description');
          const actPrice = getLocalized(act, 'priceEstimate');
          const actDuration = getLocalized(act, 'avgDuration');

          return (
            <div
              key={act.id}
              onClick={() => handleCardClick(act)}
              className="group block h-full cursor-pointer focus:outline-hidden"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCardClick(act);
                }
              }}
            >
              <Card hoverEffect className="h-full flex flex-col justify-between overflow-hidden border-slate-200/80 hover:border-sky-300 hover:shadow-lg transition-all duration-300 rounded-2xl bg-white">
                {/* Image & Tag */}
                <div className="h-44 overflow-hidden relative bg-slate-100">
                  <img
                    src={act.image}
                    alt={actTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  {actSubtitle && (
                    <div className="absolute left-2.5 top-2.5 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 shadow-xs border border-white/60">
                      {actSubtitle}
                    </div>
                  )}
                  {actDuration && (
                    <div className="absolute bottom-2.5 right-2.5 bg-slate-950/75 backdrop-blur-md px-2.5 py-0.5 rounded-md text-[11px] font-semibold text-white">
                      {actDuration}
                    </div>
                  )}
                </div>

                {/* Body Content */}
                <CardHeader className="p-4 pb-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-sky-50 border border-sky-100 shrink-0">
                      {iconMap[act.type] || <Sparkles className="w-5 h-5 text-sky-500" />}
                    </div>
                    <CardTitle as="h3" className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors leading-tight">
                      {actTitle}
                    </CardTitle>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {actDesc}
                  </p>

                  {/* Highlights */}
                  {Array.isArray(act.highlights) && act.highlights.length > 0 && (
                    <ul className="mt-3 space-y-1 text-[11px] text-slate-600 pt-1">
                      {act.highlights.slice(0, 2).map((hl, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate">{typeof hl === 'object' ? getLocalized(hl) : hl}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardHeader>

                {/* Footer Strip */}
                <div className="p-4 pt-3 flex items-center justify-between text-xs border-t border-slate-100 bg-slate-50/50 mt-auto">
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200/50">
                    {actPrice}
                  </span>
                  <span className="flex items-center gap-1 text-sky-600 font-bold group-hover:translate-x-1 transition-transform">
                    <span>{t('common.next', 'ถัดไป')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </section>
  );
}

