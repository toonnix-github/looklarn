import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Award, Briefcase, Star, Clock } from 'lucide-react';

export function CaretakerStats({ caretaker, className = '' }) {
  const { t, language } = useLanguage();

  if (!caretaker) return null;

  const stats = [
    {
      label: t('caretaker.stats.experienceLabel', 'ประสบการณ์'),
      value: language === 'th' ? `${caretaker.experienceYears} ปี` : `${caretaker.experienceYears} Years`,
      subtext: language === 'th' ? 'ดูแลผู้สูงอายุ' : 'Elder care background',
      icon: Briefcase,
      color: 'text-sky-600 bg-sky-50',
    },
    {
      label: t('caretaker.stats.tripsLabel', 'ดูแลสำเร็จ'),
      value: `${caretaker.completedTrips}+ ${language === 'th' ? 'ครั้ง' : 'Trips'}`,
      subtext: language === 'th' ? 'ทริปที่เสร็จสิ้น' : 'Completed escorts',
      icon: Award,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: t('caretaker.stats.ratingLabel', 'คะแนนพึงพอใจ'),
      value: `${caretaker.rating} / 5.0`,
      subtext: `(${caretaker.reviewsCount} ${language === 'th' ? 'คะแนน' : 'ratings'})`,
      icon: Star,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      label: t('caretaker.stats.responseLabel', 'อัตราการตอบกลับ'),
      value: t('caretaker.stats.responseValue', '100% (ภายใน 15 นาที)'),
      subtext: language === 'th' ? 'ติดต่อรวดเร็ว' : 'Fast response time',
      icon: Clock,
      color: 'text-indigo-600 bg-indigo-50',
    },
  ];

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 ${className}`}>
      {stats.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="p-4 bg-white rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                {item.label}
              </span>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${item.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                {item.value}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                {item.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CaretakerStats;
