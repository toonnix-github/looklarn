import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CardTitle } from '../ui/Card';
import { Calendar, Clock, MapPin } from 'lucide-react';

const TIME_SLOTS = [
  { id: 'morning',   th: 'ช่วงเช้า', en: 'Morning',   range: '08:00 – 12:00' },
  { id: 'afternoon', th: 'ช่วงบ่าย', en: 'Afternoon', range: '13:00 – 17:00' },
  { id: 'evening',   th: 'ช่วงเย็น', en: 'Evening',   range: '17:00 – 21:00' },
  { id: 'full_day',  th: 'เต็มวัน',  en: 'Full Day',  range: '08:00 – 17:00' },
];

const DURATIONS = [2, 3, 4, 6, 8];

export default function Step2Schedule({ formData, setFormData }) {
  const { language } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <CardTitle as="h2" className="text-xl sm:text-2xl font-black text-slate-900">
          {language === 'th' ? 'นัดหมายวันและสถานที่' : 'Schedule & Location'}
        </CardTitle>
        <p className="text-sm text-slate-500">
          {language === 'th'
            ? 'กำหนดวันที่ เวลา และสถานที่สำหรับการออกไปครั้งนี้'
            : 'Set the date, time, and locations for this outing.'}
        </p>
      </div>

      {/* Date + Duration */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
            <Calendar className="w-4 h-4 text-sky-500" />
            {language === 'th' ? 'วันที่รับบริการ' : 'Date'}
          </label>
          <input
            type="date"
            value={formData.date || ''}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm font-medium shadow-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
            <Clock className="w-4 h-4 text-emerald-500" />
            {language === 'th' ? 'ระยะเวลาที่ต้องการ (ชั่วโมง)' : 'Duration (hours)'}
          </label>
          <div className="flex gap-2">
            {DURATIONS.map((hrs) => (
              <button
                key={hrs}
                type="button"
                onClick={() => setFormData({ ...formData, durationHours: hrs })}
                className={`flex-1 rounded-xl border py-2.5 text-sm font-bold transition-all cursor-pointer ${
                  formData.durationHours === hrs
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {hrs}
                <span className="text-[10px] font-normal ml-0.5">
                  {language === 'th' ? 'ชม.' : 'hr'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Time Slot */}
      <div className="space-y-2">
        <label className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
          <Clock className="w-4 h-4 text-sky-500" />
          {language === 'th' ? 'ช่วงเวลาที่สะดวก' : 'Preferred Time'}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {TIME_SLOTS.map((slot) => {
            const isSelected = formData.timeSlot === slot.id;
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => setFormData({ ...formData, timeSlot: slot.id })}
                className={`flex flex-col items-center gap-0.5 rounded-2xl border p-3 text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-sky-500 text-white border-sky-500 shadow-sm ring-2 ring-sky-500/20'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="text-sm font-black">{language === 'th' ? slot.th : slot.en}</span>
                <span className={`text-[11px] font-medium ${isSelected ? 'text-sky-100' : 'text-slate-400'}`}>
                  {slot.range}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pickup Address */}
      <div className="space-y-2">
        <label className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
          <MapPin className="w-4 h-4 text-sky-500" />
          {language === 'th' ? 'จุดรับ (บ้านหรือสถานที่ปัจจุบัน)' : 'Pickup Location'}
        </label>
        <input
          type="text"
          value={formData.pickupAddress || ''}
          onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
          placeholder={language === 'th' ? 'เช่น 128/4 ซอยสุขุมวิท 39 เขตวัฒนา กรุงเทพฯ' : 'e.g. 128/4 Sukhumvit 39, Bangkok'}
          className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm font-medium shadow-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>

      {/* Destination */}
      <div className="space-y-2">
        <label className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
          <MapPin className="w-4 h-4 text-rose-500" />
          {language === 'th' ? 'สถานที่ปลายทาง' : 'Destination'}
        </label>
        <input
          type="text"
          value={formData.destination || ''}
          onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
          placeholder={language === 'th' ? 'เช่น โรงพยาบาลศิริราช, วัดพระแก้ว' : 'e.g. Siriraj Hospital, Wat Phra Kaew'}
          className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm font-medium shadow-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>
    </div>
  );
}
