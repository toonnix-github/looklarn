import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CardTitle } from '../ui/Card';
import {
  Activity,
  Building2,
  CheckCircle2,
  ClipboardList,
  Coffee,
  HeartPulse,
  Home as HomeIcon,
  Landmark,
  Pill,
  ShoppingBag,
  Stethoscope,
  Trees,
  Users,
} from 'lucide-react';
import { appointmentEventOptions, getEnumLabel } from '../../constants/careEnums';

const iconMap = {
  Activity,
  Building2,
  ClipboardList,
  Coffee,
  HeartPulse,
  Home: HomeIcon,
  Landmark,
  Pill,
  ShoppingBag,
  Stethoscope,
  Trees,
  Users,
};

const iconToneClass = {
  amber: 'text-amber-500',
  emerald: 'text-emerald-500',
  rose: 'text-rose-500',
  sky: 'text-sky-500',
  slate: 'text-slate-500',
  teal: 'text-teal-500',
};

export default function Step1Activity({ formData, setFormData }) {
  const { language } = useLanguage();

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <CardTitle as="h2" className="text-xl sm:text-2xl font-black text-slate-900">
          {language === 'th' ? 'ครั้งนี้จะพาไปไหน?' : "Where are we going this time?"}
        </CardTitle>
        <p className="text-sm text-slate-500">
          {language === 'th'
            ? 'เลือกประเภทกิจกรรมที่ต้องการ ผู้ดูแลจะเตรียมตัวให้พร้อมสำหรับสถานที่นั้นๆ'
            : 'Choose the activity type so the caretaker can prepare accordingly.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {appointmentEventOptions.map((act) => {
          const isSelected = formData.activityType === act.id;
          const ActivityIcon = iconMap[act.icon] || HeartPulse;
          const iconClassName = iconToneClass[act.tone] || 'text-sky-500';
          return (
            <label
              key={act.id}
              className={`relative flex items-start gap-3.5 rounded-2xl border p-4 cursor-pointer transition-all ${
                isSelected
                  ? 'border-sky-500 bg-sky-50/70 ring-2 ring-sky-500/15 shadow-sm'
                  : 'border-slate-200 hover:bg-slate-50/80 hover:border-slate-300'
              }`}
            >
              <input
                type="radio"
                name="activityType"
                value={act.id}
                checked={isSelected}
                onChange={() => setFormData({ ...formData, activityType: act.id })}
                className="sr-only"
              />

              {/* Icon box */}
              <div className={`shrink-0 rounded-xl p-2 ${isSelected ? 'bg-white shadow-sm' : 'bg-slate-100'}`}>
                <ActivityIcon className={`w-6 h-6 ${iconClassName}`} />
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-black leading-tight ${isSelected ? 'text-sky-900' : 'text-slate-800'}`}>
                  {getEnumLabel(act, language, 'fullLabel')}
                </p>
                <p className="mt-0.5 text-xs text-slate-400 leading-snug">
                  {getEnumLabel(act, language, 'description')}
                </p>
              </div>

              {/* Check */}
              {isSelected && (
                <CheckCircle2 className="absolute right-3 top-3 h-5 w-5 text-sky-500 shrink-0" />
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
}
