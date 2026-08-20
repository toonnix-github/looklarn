import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { CardTitle } from '../ui/Card';
import { Calendar, Clock, DollarSign, MapPin, FileText, Sparkles } from 'lucide-react';

export default function Step3Schedule({ formData, setFormData }) {
  const { t } = useLanguage();

  const timeSlots = [
    { id: 'morning', label: t('find.step3.timeMorning', 'ช่วงเช้า (08:00 - 12:00)') },
    { id: 'afternoon', label: t('find.step3.timeAfternoon', 'ช่วงบ่าย (13:00 - 17:00)') },
    { id: 'evening', label: t('find.step3.timeEvening', 'ช่วงเย็น (17:00 - 21:00)') },
    { id: 'full_day', label: t('find.step3.timeFullDay', 'เต็มวัน (08:00 - 16:00)') },
  ];

  const durations = [2, 3, 4, 6, 8];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <CardTitle as="h2" className="text-xl sm:text-2xl font-bold text-slate-900">
          {t('find.step3.title', 'วันและเวลานัดหมาย')}
        </CardTitle>
        <p className="text-xs sm:text-sm text-slate-500">
          {t('find.step3.desc', 'กำหนดวันที่ ระยะเวลานัดหมาย และช่วงงบประมาณที่เหมาะสม')}
        </p>
      </div>

      {/* 1. Date & Duration */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-sky-500" />
            {t('find.step3.dateLabel', 'เลือกวันที่รับบริการ')}
          </label>
          <input
            type="date"
            value={formData.date || '2026-08-28'}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full p-3 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500 shadow-xs"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-emerald-500" />
            {t('find.step3.durationLabel', 'ชั่วโมงที่ต้องการรับบริการ')}
          </label>
          <div className="flex items-center gap-2">
            {durations.map((hrs) => (
              <button
                key={hrs}
                type="button"
                onClick={() => setFormData({ ...formData, durationHours: hrs })}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                  formData.durationHours === hrs
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-xs ring-2 ring-emerald-500/20'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {hrs} {t('common.hrShort', 'ชม.')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Preferred Time Slot */}
      <div className="space-y-3 pt-2">
        <label className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-sky-500" />
          {t('find.step3.timeSlotLabel', 'ช่วงเวลาที่สะดวก')}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {timeSlots.map((slot) => {
            const isSelected = formData.timeSlot === slot.id;
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => setFormData({ ...formData, timeSlot: slot.id })}
                className={`p-3 rounded-2xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'bg-sky-500 text-white border-sky-500 shadow-xs ring-2 ring-sky-500/20'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {slot.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Budget Range Slider */}
      <div className="space-y-3 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            {t('find.step3.budgetLabel', 'อัตราค่าตอบแทนสูงสุดต่อชั่วโมง (บาท/ชม.)')}
          </label>
          <span className="text-base sm:text-lg font-black text-emerald-600">
            ฿{formData.budgetMax || 500} / {t('common.hrShort', 'ชม.')}
          </span>
        </div>

        <input
          type="range"
          min={300}
          max={1000}
          step={25}
          value={formData.budgetMax || 500}
          onChange={(e) => setFormData({ ...formData, budgetMax: Number(e.target.value) })}
          className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
        />

        <div className="flex justify-between items-center text-[11px] text-slate-400 font-medium">
          <span>฿300 / ชม.</span>
          <span>{t('find.step3.budgetHint', 'อัตราเฉลี่ย ฿300 - ฿500 ต่อชั่วโมง')}</span>
          <span>฿1,000 / ชม.</span>
        </div>
      </div>

      {/* 4. Pickup Address & Destination */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-sky-500" />
            {t('find.step3.pickupAddressLabel', 'สถานที่รับ-ส่ง (จุดเริ่มต้น)')}
          </label>
          <input
            type="text"
            value={formData.pickupAddress || ''}
            onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
            placeholder={t('find.step3.pickupAddressPlaceholder', 'เช่น 128/4 ซอยสุขุมวิท 39 เขตวัฒนา กรุงเทพฯ')}
            className="w-full p-3 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500 shadow-xs"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-rose-500" />
            {t('find.step3.destinationLabel', 'สถานที่ปลายทาง / โรงพยาบาล')}
          </label>
          <input
            type="text"
            value={formData.destination || ''}
            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
            placeholder={t('find.step3.destinationPlaceholder', 'เช่น โรงพยาบาลศิริราช อาคารนวมินทรบพิตร')}
            className="w-full p-3 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500 shadow-xs"
          />
        </div>
      </div>

      {/* 5. Special Notes */}
      <div className="space-y-2 pt-2">
        <label className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-slate-500" />
          {t('find.step3.notesLabel', 'หมายเหตุเพิ่มเติมสำหรับผู้ดูแล')}
        </label>
        <textarea
          rows={3}
          value={formData.notes || ''}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder={t('find.step3.notesPlaceholder', 'ระบุความต้องการเพิ่มเติม เช่น คุณยายเดินช้า, มีรถเข็นส่วนตัว, ต้องการคนช่วยยกของ...')}
          className="w-full p-3 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500 shadow-xs resize-none"
        />
      </div>
    </div>
  );
}
