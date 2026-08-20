import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Check } from 'lucide-react';

export function AvailabilityCalendar({
  caretaker,
  selectedDate: initialSelectedDate,
  selectedTimeSlot: initialSelectedTimeSlot = 'morning',
  onSelectDate,
  onSelectTimeSlot,
  className = '',
}) {
  const { t, language } = useLanguage();
  const [selectedDay, setSelectedDay] = useState(
    typeof initialSelectedDate === 'number' ? initialSelectedDate : 28
  );
  const [selectedSlot, setSelectedSlot] = useState(initialSelectedTimeSlot);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0); // 0 = Aug 2026, 1 = Sep 2026

  const monthsData = [
    {
      monthNum: '08',
      yearTh: 2569,
      yearEn: 2026,
      nameTh: 'สิงหาคม 2569',
      nameEn: 'August 2026',
      shortMonthTh: 'ส.ค.',
      shortMonthEn: 'Aug',
      daysCount: 31,
      startDayOfWeek: 6, // Aug 1, 2026 is Saturday (6)
    },
    {
      monthNum: '09',
      yearTh: 2569,
      yearEn: 2026,
      nameTh: 'กันยายน 2569',
      nameEn: 'September 2026',
      shortMonthTh: 'ก.ย.',
      shortMonthEn: 'Sep',
      daysCount: 30,
      startDayOfWeek: 2, // Sep 1, 2026 is Tuesday (2)
    },
  ];

  const weekDays = {
    th: ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'],
    en: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  };

  const daySlotMap = {
    0: 'Sun',
    1: 'Mon',
    2: 'Tue',
    3: 'Wed',
    4: 'Thu',
    5: 'Fri',
    6: 'Sat',
  };

  const activeMonth = monthsData[currentMonthIndex];
  const availableSlotsList = caretaker?.availableSlots || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const monthDays = Array.from({ length: activeMonth.daysCount }, (_, i) => {
    const dayNumber = i + 1;
    const dayOfWeek = (activeMonth.startDayOfWeek + i) % 7;
    const slotCode = daySlotMap[dayOfWeek];
    const isAvailable = availableSlotsList.includes(slotCode);
    return {
      day: dayNumber,
      dayOfWeek,
      slotCode,
      isAvailable,
    };
  });

  const handleSelectDay = (dayObj) => {
    if (!dayObj.isAvailable) return;
    setSelectedDay(dayObj.day);
    if (onSelectDate) {
      const dayStr = String(dayObj.day).padStart(2, '0');
      onSelectDate(`2026-${activeMonth.monthNum}-${dayStr}`);
    }
  };

  const handleSelectSlot = (slotId) => {
    setSelectedSlot(slotId);
    if (onSelectTimeSlot) {
      onSelectTimeSlot(slotId);
    }
  };

  const formattedSelectedDate =
    language === 'th'
      ? `วันที่ ${selectedDay} ${activeMonth.shortMonthTh} ${activeMonth.yearTh}`
      : `${selectedDay} ${activeMonth.shortMonthEn} ${activeMonth.yearEn}`;

  return (
    <Card className={`space-y-4 ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-emerald-500" />
            <CardTitle className="text-base sm:text-lg">
              {t('caretaker.availabilityTitle', 'ตารางเวลาที่ว่างและปฏิทิน')}
            </CardTitle>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              type="button"
              aria-label="Previous Month"
              onClick={() => setCurrentMonthIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentMonthIndex === 0}
              className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-bold text-slate-800">
              {language === 'th' ? activeMonth.nameTh : activeMonth.nameEn}
            </span>
            <button
              type="button"
              aria-label="Next Month"
              onClick={() => setCurrentMonthIndex((prev) => Math.min(monthsData.length - 1, prev + 1))}
              disabled={currentMonthIndex === monthsData.length - 1}
              className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400">
          {weekDays[language].map((wd, i) => (
            <div key={i} className={i === 0 ? 'text-rose-400' : ''}>
              {wd}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {Array.from({ length: activeMonth.startDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="h-8 sm:h-9" />
          ))}

          {monthDays.map((d) => {
            const isSelected = selectedDay === d.day;
            return (
              <button
                key={d.day}
                type="button"
                onClick={() => handleSelectDay(d)}
                disabled={!d.isAvailable}
                className={`h-8 sm:h-9 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center relative cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white ring-2 ring-emerald-400 shadow-sm'
                    : d.isAvailable
                    ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/80'
                    : 'bg-slate-50 text-slate-300 cursor-not-allowed line-through'
                }`}
              >
                <span>{d.day}</span>
                {d.isAvailable && !isSelected && (
                  <span className="w-1 h-1 rounded-full bg-emerald-500 absolute bottom-1" />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>{t('caretaker.calendar.available', 'ว่าง')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span>{t('caretaker.calendar.booked', 'ไม่ว่าง / เต็ม')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 ring-2 ring-emerald-400" />
            <span>{t('caretaker.calendar.selected', 'วันที่เลือก')}</span>
          </div>
        </div>

        {/* Time Slot Selector for Selected Day */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>{t('caretaker.calendar.selectSlot', 'เลือกช่วงเวลาที่ต้องการ:')}</span>
            <span className="text-emerald-700 font-extrabold">
              {formattedSelectedDate}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'morning', label: t('caretaker.calendar.morning', 'ช่วงเช้า (08:00 - 12:00)') },
              { id: 'afternoon', label: t('caretaker.calendar.afternoon', 'ช่วงบ่าย (13:00 - 17:00)') },
              { id: 'fullDay', label: t('caretaker.calendar.fullDay', 'เต็มวัน (08:00 - 16:00)') },
            ].map((slot) => (
              <button
                key={slot.id}
                type="button"
                onClick={() => handleSelectSlot(slot.id)}
                className={`px-2 py-2 rounded-xl text-[11px] font-semibold text-center transition-all cursor-pointer ${
                  selectedSlot === slot.id
                    ? 'bg-white text-emerald-700 border-2 border-emerald-500 shadow-xs'
                    : 'bg-white/60 text-slate-600 border border-slate-200 hover:bg-white'
                }`}
              >
                {slot.label}
              </button>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 text-center pt-1">
            {t('caretaker.calendar.hoursHint', 'พร้อมให้บริการ 08:00 - 18:00 น.')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default AvailabilityCalendar;

