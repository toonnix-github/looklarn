import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CardTitle } from '../ui/Card';
import { Calendar, Clock, MapPin } from 'lucide-react';

const DEFAULT_START_BY_SLOT = {
  morning: '08:00',
  afternoon: '13:00',
  evening: '17:00',
  full_day: '08:00',
};

const TIME_OPTIONS = Array.from({ length: 29 }, (_, index) => {
  const minutes = 7 * 60 + index * 30;
  return {
    value: `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`,
    label: `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`,
  };
});

const timeToMinutes = (time) => {
  const [hours = 0, minutes = 0] = String(time || '00:00').split(':').map(Number);
  return hours * 60 + minutes;
};

const minutesToTime = (totalMinutes) => {
  const normalized = Math.max(0, Math.min(23 * 60 + 59, totalMinutes));
  const hours = String(Math.floor(normalized / 60)).padStart(2, '0');
  const minutes = String(normalized % 60).padStart(2, '0');
  return `${hours}:${minutes}`;
};

const addHours = (time, hours) => minutesToTime(timeToMinutes(time) + hours * 60);

const calculateDurationHours = (startTime, endTime) => {
  const diff = timeToMinutes(endTime) - timeToMinutes(startTime);
  return diff > 0 ? Math.round((diff / 60) * 10) / 10 : 0;
};

export default function Step2Schedule({ formData, setFormData }) {
  const { language } = useLanguage();
  const startTime = formData.startTime || DEFAULT_START_BY_SLOT[formData.timeSlot] || '08:00';
  const endTime = formData.endTime || addHours(startTime, formData.durationHours || 4);
  const durationHours = calculateDurationHours(startTime, endTime);
  const durationLabel = durationHours > 0
    ? `${durationHours} ${language === 'th' ? 'ชม.' : durationHours === 1 ? 'hr' : 'hrs'}`
    : language === 'th' ? 'กรุณาเลือกเวลาจบหลังเวลาเริ่ม' : 'End time must be after start time';

  const updateTimeRange = (nextStart, nextEnd) => {
    const nextDurationHours = calculateDurationHours(nextStart, nextEnd);
    setFormData({
      ...formData,
      startTime: nextStart,
      endTime: nextEnd,
      timeSlot: `${nextStart} - ${nextEnd}`,
      durationHours: nextDurationHours || formData.durationHours || 1,
    });
  };

  const handleStartChange = (value) => {
    const currentEnd = formData.endTime || endTime;
    const nextEnd = timeToMinutes(currentEnd) > timeToMinutes(value)
      ? currentEnd
      : addHours(value, Math.max(formData.durationHours || 4, 1));
    updateTimeRange(value, nextEnd);
  };

  const handleEndChange = (value) => {
    updateTimeRange(startTime, value);
  };

  return (
    <div className="h-full min-h-0 space-y-[1.2dvh] sm:h-auto sm:space-y-6">
      <div className="space-y-[0.25dvh] sm:space-y-1">
        <CardTitle as="h2" className="text-[clamp(1.08rem,5vw,1.28rem)] font-black leading-tight text-slate-900 sm:text-2xl">
          {language === 'th' ? 'นัดหมายวันและสถานที่' : 'Schedule & Location'}
        </CardTitle>
        <p className="text-[clamp(0.7rem,2.95vw,0.82rem)] font-semibold leading-tight text-slate-500 sm:text-sm">
          {language === 'th'
            ? 'เลือกวัน เวลาเริ่ม-จบ แล้วใส่จุดรับกับปลายทาง'
            : 'Set the date, time, and locations for this outing.'}
        </p>
      </div>

      {/* Date + Time Range */}
      <div className="grid grid-cols-1 gap-[1dvh] sm:grid-cols-2 sm:gap-4">
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-[clamp(0.7rem,2.95vw,0.82rem)] font-black text-slate-800 sm:text-sm">
            <Calendar className="h-[1.8dvh] w-[1.8dvh] text-sky-500 sm:h-4 sm:w-4" />
            {language === 'th' ? 'วันที่รับบริการ' : 'Date'}
          </label>
          <input
            type="date"
            value={formData.date || ''}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="h-[5.1dvh] w-full rounded-[min(3.5vw,0.9rem)] border border-slate-200 bg-white px-[3vw] text-[clamp(0.78rem,3.3vw,0.92rem)] font-bold text-slate-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-sky-500 sm:h-auto sm:rounded-2xl sm:p-3 sm:text-sm"
          />
        </div>

        <div className="grid grid-cols-[1fr_1fr] gap-[2vw] sm:gap-3">
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-[clamp(0.7rem,2.95vw,0.82rem)] font-black text-slate-800 sm:text-sm">
              <Clock className="h-[1.8dvh] w-[1.8dvh] text-emerald-500 sm:h-4 sm:w-4" />
              {language === 'th' ? 'เริ่ม' : 'Start'}
            </label>
            <select
              value={startTime}
              onChange={(e) => handleStartChange(e.target.value)}
              className="h-[5.1dvh] w-full rounded-[min(3.5vw,0.9rem)] border border-slate-200 bg-white px-[3vw] text-[clamp(0.82rem,3.5vw,0.98rem)] font-black text-slate-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-sky-500 sm:h-auto sm:rounded-2xl sm:p-3 sm:text-sm"
            >
              {TIME_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-[clamp(0.7rem,2.95vw,0.82rem)] font-black text-slate-800 sm:text-sm">
              <Clock className="h-[1.8dvh] w-[1.8dvh] text-rose-500 sm:h-4 sm:w-4" />
              {language === 'th' ? 'จบ' : 'End'}
            </label>
            <select
              value={endTime}
              onChange={(e) => handleEndChange(e.target.value)}
              className="h-[5.1dvh] w-full rounded-[min(3.5vw,0.9rem)] border border-slate-200 bg-white px-[3vw] text-[clamp(0.82rem,3.5vw,0.98rem)] font-black text-slate-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-sky-500 sm:h-auto sm:rounded-2xl sm:p-3 sm:text-sm"
            >
              {TIME_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className={`flex items-center justify-between rounded-[min(3.8vw,0.95rem)] px-[3vw] py-[1dvh] ring-1 sm:rounded-2xl sm:px-4 sm:py-3 ${
        durationHours > 0 ? 'bg-emerald-50 text-emerald-800 ring-emerald-100' : 'bg-rose-50 text-rose-700 ring-rose-100'
      }`}>
        <span className="text-[clamp(0.72rem,3vw,0.84rem)] font-black sm:text-sm">
          {language === 'th' ? 'สรุประยะเวลา' : 'Total duration'}
        </span>
        <span className="text-[clamp(0.82rem,3.45vw,0.98rem)] font-black">
          {durationLabel}
        </span>
      </div>

      {/* Pickup Address */}
      <div className="space-y-2">
        <label className="flex items-center gap-1.5 text-[clamp(0.7rem,2.95vw,0.82rem)] font-black text-slate-800 sm:text-sm">
          <MapPin className="h-[1.8dvh] w-[1.8dvh] text-sky-500 sm:h-4 sm:w-4" />
          {language === 'th' ? 'จุดรับ (บ้านหรือสถานที่ปัจจุบัน)' : 'Pickup Location'}
        </label>
        <input
          type="text"
          value={formData.pickupAddress || ''}
          onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
          placeholder={language === 'th' ? 'เช่น 128/4 ซอยสุขุมวิท 39 เขตวัฒนา กรุงเทพฯ' : 'e.g. 128/4 Sukhumvit 39, Bangkok'}
          className="h-[5.1dvh] w-full rounded-[min(3.5vw,0.9rem)] border border-slate-200 bg-white px-[3vw] text-[clamp(0.76rem,3.2vw,0.9rem)] font-bold text-slate-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-sky-500 sm:h-auto sm:rounded-2xl sm:p-3 sm:text-sm"
        />
      </div>

      {/* Destination */}
      <div className="space-y-2">
        <label className="flex items-center gap-1.5 text-[clamp(0.7rem,2.95vw,0.82rem)] font-black text-slate-800 sm:text-sm">
          <MapPin className="h-[1.8dvh] w-[1.8dvh] text-rose-500 sm:h-4 sm:w-4" />
          {language === 'th' ? 'สถานที่ปลายทาง' : 'Destination'}
        </label>
        <input
          type="text"
          value={formData.destination || ''}
          onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
          placeholder={language === 'th' ? 'เช่น โรงพยาบาลศิริราช, วัดพระแก้ว' : 'e.g. Siriraj Hospital, Wat Phra Kaew'}
          className="h-[5.1dvh] w-full rounded-[min(3.5vw,0.9rem)] border border-slate-200 bg-white px-[3vw] text-[clamp(0.76rem,3.2vw,0.9rem)] font-bold text-slate-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-sky-500 sm:h-auto sm:rounded-2xl sm:p-3 sm:text-sm"
        />
      </div>
    </div>
  );
}
