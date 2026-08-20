import React, { useState } from 'react';
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
  Plus,
  ShoppingBag,
  Stethoscope,
  Trees,
  Users,
  X,
} from 'lucide-react';
import { APPOINTMENT_EVENTS, appointmentEventOptions, getEnumLabel } from '../../constants/careEnums';

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
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const quickActivityIds = [
    APPOINTMENT_EVENTS.HOSPITAL,
    APPOINTMENT_EVENTS.INPATIENT_WATCH,
    APPOINTMENT_EVENTS.TEMPLE,
    APPOINTMENT_EVENTS.TOUR,
  ];
  const quickActivities = quickActivityIds
    .map((id) => appointmentEventOptions.find((activity) => activity.id === id))
    .filter(Boolean);
  const selectedActivity = appointmentEventOptions.find((act) => act.id === formData.activityType) || appointmentEventOptions[0];
  const selectActivity = (activityType) => setFormData({ ...formData, activityType });
  const renderIcon = (act, className = 'w-6 h-6') => {
    const ActivityIcon = iconMap[act.icon] || HeartPulse;
    const iconClassName = iconToneClass[act.tone] || 'text-sky-500';
    return <ActivityIcon className={`${className} ${iconClassName}`} />;
  };

  return (
    <div className="h-full min-h-0 space-y-[1.1dvh] sm:h-auto sm:space-y-5">
      <div className="space-y-[0.25dvh] sm:space-y-1">
        <CardTitle as="h2" className="text-[clamp(1rem,4.8vw,1.22rem)] font-black leading-tight text-slate-900 sm:text-2xl">
          {language === 'th' ? 'ครั้งนี้จะพาไปไหน?' : "Where are we going this time?"}
        </CardTitle>
        <p className="text-[clamp(0.62rem,2.75vw,0.74rem)] font-semibold leading-tight text-slate-500 sm:text-sm">
          {language === 'th'
            ? 'เลือกกิจกรรมหลักก่อน แล้วค่อยใส่รายละเอียดนัดหมาย'
            : 'Choose the activity type so the caretaker can prepare accordingly.'}
        </p>
      </div>

      <div className="sm:hidden">
        <div className="mb-[1dvh] flex items-center justify-between rounded-[min(3.6vw,0.9rem)] bg-sky-50 px-[3vw] py-[0.9dvh] ring-1 ring-sky-100">
          <span className="flex min-w-0 items-center gap-[2vw]">
            <span className="grid aspect-square h-[3.9dvh] place-items-center rounded-full bg-white shadow-sm ring-1 ring-sky-100">
              {renderIcon(selectedActivity, 'h-[2dvh] w-[2dvh]')}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[clamp(0.72rem,3.2vw,0.84rem)] font-black text-slate-950">
                {getEnumLabel(selectedActivity, language, 'label')}
              </span>
              <span className="block truncate text-[clamp(0.52rem,2.25vw,0.62rem)] font-bold text-slate-500">
                {getEnumLabel(selectedActivity, language, 'helper')}
              </span>
            </span>
          </span>
          <span className="rounded-full bg-white px-[2.2vw] py-[0.4dvh] text-[clamp(0.52rem,2.25vw,0.62rem)] font-black text-sky-700 ring-1 ring-sky-100">
            เลือกแล้ว
          </span>
        </div>

        <div className="grid grid-cols-2 gap-[2vw]">
          {quickActivities.map((act) => {
            const isSelected = formData.activityType === act.id;
            const ActivityIcon = iconMap[act.icon] || HeartPulse;
            const iconClassName = isSelected ? 'text-white' : iconToneClass[act.tone] || 'text-sky-500';
            return (
              <button
                key={act.id}
                type="button"
                onClick={() => selectActivity(act.id)}
                className={`relative grid min-h-[10.2dvh] grid-cols-[auto_1fr] items-center gap-[2.3vw] overflow-hidden rounded-[min(4vw,1rem)] p-[2.6vw] text-left transition active:scale-[0.985] ${
                  isSelected
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-700/20 ring-1 ring-sky-300'
                    : 'bg-slate-50 text-slate-900 shadow-sm ring-1 ring-slate-100'
                }`}
              >
                <span className={`grid aspect-square h-[4.7dvh] place-items-center rounded-[min(2.8vw,0.7rem)] ${isSelected ? 'bg-white/20' : 'bg-white shadow-sm ring-1 ring-slate-100'}`}>
                  <ActivityIcon className={`h-[2.25dvh] w-[2.25dvh] ${iconClassName}`} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[clamp(0.68rem,3vw,0.8rem)] font-black leading-tight">
                    {getEnumLabel(act, language, 'label')}
                  </span>
                  <span className={`block truncate text-[clamp(0.5rem,2.2vw,0.62rem)] font-bold leading-tight ${isSelected ? 'text-sky-100' : 'text-slate-500'}`}>
                    {getEnumLabel(act, language, 'helper')}
                  </span>
                </span>
                {isSelected && (
                  <CheckCircle2 className="absolute right-[2vw] top-[1dvh] h-[1.9dvh] w-[1.9dvh] text-white" />
                )}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setActivityModalOpen(true)}
          className="mt-[1dvh] flex h-[4.6dvh] w-full items-center justify-center gap-[2vw] rounded-full bg-white text-[clamp(0.64rem,2.85vw,0.76rem)] font-black text-sky-700 shadow-sm ring-1 ring-sky-100 active:scale-[0.985]"
        >
          <Plus className="h-[1.9dvh] w-[1.9dvh]" />
          {language === 'th' ? 'ดูกิจกรรมอื่นเพิ่มเติม' : 'More activities'}
        </button>
      </div>

      <div className="hidden grid-cols-1 gap-3 sm:grid sm:grid-cols-2">
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
                onChange={() => selectActivity(act.id)}
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

      {activityModalOpen && (
        <div className="fixed inset-0 z-[70] sm:hidden" role="dialog" aria-modal="true" aria-label="เลือกกิจกรรมทั้งหมด">
          <button
            type="button"
            aria-label="ปิดรายการกิจกรรม"
            className="absolute inset-0 bg-slate-950/35"
            onClick={() => setActivityModalOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 rounded-t-[1.4rem] bg-white px-4 pb-[max(env(safe-area-inset-bottom),1rem)] pt-3 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-black leading-tight text-slate-950">
                  {language === 'th' ? 'เลือกกิจกรรมทั้งหมด' : 'All activities'}
                </h2>
                <p className="text-xs font-semibold text-slate-500">
                  {language === 'th' ? 'เลือกกิจกรรม แล้วไปกำหนดวันเวลา' : 'Pick one, then schedule the outing.'}
                </p>
              </div>
              <button
                type="button"
                className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-600"
                onClick={() => setActivityModalOpen(false)}
                aria-label="ปิด"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {appointmentEventOptions.map((act) => {
                const isSelected = formData.activityType === act.id;
                return (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => {
                      selectActivity(act.id);
                      setActivityModalOpen(false);
                    }}
                    className={`grid grid-cols-[auto_1fr] items-center gap-3 rounded-2xl p-3 text-left ring-1 active:scale-[0.99] ${
                      isSelected ? 'bg-sky-50 ring-sky-200' : 'bg-slate-50 ring-slate-100'
                    }`}
                  >
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
                      {renderIcon(act, 'h-5 w-5')}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-black text-slate-900">
                        {getEnumLabel(act, language, 'label')}
                      </span>
                      <span className="block truncate text-xs font-bold text-slate-500">
                        {getEnumLabel(act, language, 'helper')}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
