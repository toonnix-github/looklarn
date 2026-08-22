import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { appointmentEventOptions, getEnumLabel } from '../../constants/careEnums';
import { Calendar, Clock3 } from 'lucide-react';

const TIME_PRESETS = [
  {
    id: 'morning',
    startTime: '08:00',
    endTime: '12:00',
    durationHours: 4,
    label: { th: 'ครึ่งวันเช้า', en: 'Half day AM' },
    detail: { th: '08:00 - 12:00', en: '08:00 - 12:00' },
  },
  {
    id: 'evening',
    startTime: '13:00',
    endTime: '17:00',
    durationHours: 4,
    label: { th: 'ครึ่งวันเย็น', en: 'Half day PM' },
    detail: { th: '13:00 - 17:00', en: '13:00 - 17:00' },
  },
  {
    id: 'full_day',
    startTime: '08:00',
    endTime: '17:00',
    durationHours: 8,
    label: { th: 'เต็มวัน', en: 'Full day' },
    detail: { th: '08:00 - 17:00', en: '08:00 - 17:00' },
  },
];

const getPresetLabel = (preset, language, key = 'label') =>
  preset[key]?.[language] || preset[key]?.th || preset[key]?.en || '';

export default function Step1Activity({ formData, setFormData }) {
  const { language } = useLanguage();
  const selectedPreset =
    TIME_PRESETS.find((preset) => preset.id === formData.timeSlot) || TIME_PRESETS[0];

  const updateActivity = (activityType) => {
    setFormData({ ...formData, activityType });
  };

  const updateTimePreset = (preset) => {
    setFormData({
      ...formData,
      timeSlot: preset.id,
      startTime: preset.startTime,
      endTime: preset.endTime,
      durationHours: preset.durationHours,
    });
  };

  return (
    <div className="h-full min-h-0 space-y-[1.05dvh] sm:h-auto sm:space-y-5">
      <div className="space-y-[0.65dvh]">
        <label className="block text-[clamp(0.72rem,3vw,0.84rem)] font-black text-slate-800 sm:text-sm">
          {language === 'th' ? 'กิจกรรม' : 'Activity'}
        </label>
        <select
          value={formData.activityType}
          onChange={(event) => updateActivity(event.target.value)}
          className="h-[5.2dvh] w-full rounded-[min(3.6vw,0.9rem)] border border-slate-200 bg-white px-[3.2vw] text-[clamp(0.82rem,3.5vw,0.98rem)] font-black text-slate-950 shadow-xs focus:outline-none focus:ring-2 focus:ring-primary-500 sm:h-auto sm:rounded-2xl sm:p-3 sm:text-sm"
        >
          {appointmentEventOptions.map((activity) => (
            <option key={activity.id} value={activity.id}>
              {getEnumLabel(activity, language, 'label')}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-[0.65dvh]">
        <div className="space-y-[0.65dvh]">
          <label className="flex items-center gap-1.5 text-[clamp(0.72rem,3vw,0.84rem)] font-black text-slate-800 sm:text-sm">
            <Calendar className="h-[1.8dvh] w-[1.8dvh] text-primary-500 sm:h-4 sm:w-4" />
            {language === 'th' ? 'วันที่' : 'Date'}
          </label>
          <input
            type="date"
            value={formData.date || ''}
            min={new Date().toISOString().split('T')[0]}
            onChange={(event) => setFormData({ ...formData, date: event.target.value })}
            className="h-[5.1dvh] w-full rounded-[min(3.5vw,0.9rem)] border border-slate-200 bg-white px-[2.6vw] text-[clamp(0.76rem,3.2vw,0.9rem)] font-bold text-slate-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-primary-500 sm:h-auto sm:rounded-2xl sm:p-3 sm:text-sm"
          />
        </div>

        <div className="space-y-[0.65dvh]">
          <label className="flex items-center gap-1.5 text-[clamp(0.72rem,3vw,0.84rem)] font-black text-slate-800 sm:text-sm">
            <Clock3 className="h-[1.8dvh] w-[1.8dvh] text-secondary-600 sm:h-4 sm:w-4" />
            {language === 'th' ? 'ช่วงเวลา' : 'Time'}
          </label>
          <div className="grid grid-cols-3 gap-[1vw]">
            {TIME_PRESETS.map((preset) => {
              const isSelected = selectedPreset.id === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => updateTimePreset(preset)}
                  className={`flex h-[5.1dvh] min-w-0 flex-col items-center justify-center rounded-[min(3.1vw,0.78rem)] border px-[1vw] text-center transition active:scale-[0.985] ${
                    isSelected
                      ? 'border-primary-600 bg-primary-700 text-white shadow-md shadow-primary-900/20'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <span className="block max-w-full truncate text-[clamp(0.56rem,2.32vw,0.66rem)] font-black leading-tight">
                    {getPresetLabel(preset, language)}
                  </span>
                  <span className={`block text-[clamp(0.48rem,2vw,0.58rem)] font-bold leading-tight ${isSelected ? 'text-sub1-100' : 'text-sub2-500'}`}>
                    {getPresetLabel(preset, language, 'detail')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
