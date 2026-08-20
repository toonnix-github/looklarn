import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { MapPin, Navigation, Home, FileText, Info } from 'lucide-react';

export function LocationPicker({
  pickup = '',
  destination = '',
  notes = '',
  onPickupChange,
  onDestinationChange,
  onNotesChange,
  onUseElderAddress,
  className = '',
}) {
  const { t } = useLanguage();

  return (
    <Card className={`border-slate-200/80 shadow-xs ${className}`}>
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
              {t('book.locationSectionTitle', 'เส้นทางการเดินทาง (Trip Route)')}
            </CardTitle>
            <p className="text-xs text-slate-500">
              {t('book.locationSectionDesc', 'ระบุสถานที่รับผู้สูงอายุและเป้าหมายที่ต้องการให้ผู้ดูแลพาไป')}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 space-y-5">
        {/* Pickup Location Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <label
              htmlFor="pickup-input"
              className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5"
            >
              <MapPin className="w-4 h-4 text-sky-500 shrink-0" />
              <span>{t('book.pickupLabel', 'จุดรับ / สถานที่นัดพบ (Pickup Location)')}</span>
            </label>
            {onUseElderAddress && (
              <button
                type="button"
                onClick={onUseElderAddress}
                className="text-xs font-semibold text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>{t('book.useElderAddressBtn', 'ใช้ที่อยู่ตามโปรไฟล์ผู้สูงอายุ')}</span>
              </button>
            )}
          </div>
          <div className="relative">
            <input
              id="pickup-input"
              type="text"
              value={pickup}
              onChange={(e) => onPickupChange?.(e.target.value)}
              placeholder={t('book.pickupPlaceholder', 'ระบุจุดรับ / ที่อยู่นัดพบ (Enter pickup location)')}
              className="w-full pl-3.5 pr-4 py-2.5 sm:py-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Destination Location Input */}
        <div className="space-y-2">
          <label
            htmlFor="destination-input"
            className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5"
          >
            <Navigation className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{t('book.destinationLabel', 'โรงพยาบาลหรือสถานที่เป้าหมาย')}</span>
          </label>
          <div className="relative">
            <input
              id="destination-input"
              type="text"
              value={destination}
              onChange={(e) => onDestinationChange?.(e.target.value)}
              placeholder={t('book.destinationPlaceholder', 'ระบุสถานที่ปลายทาง เช่น รพ.ศิริราช อาคารนวมินทรบพิตร')}
              className="w-full pl-3.5 pr-4 py-2.5 sm:py-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Special Notes & Meeting Notes */}
        <div className="space-y-2">
          <label
            htmlFor="notes-input"
            className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{t('book.notesLabel', 'หมายเหตุพิเศษสำหรับผู้ดูแล (Special Notes)')}</span>
          </label>
          <textarea
            id="notes-input"
            rows={3}
            value={notes}
            onChange={(e) => onNotesChange?.(e.target.value)}
            placeholder={t('book.notesPlaceholder', 'ระบุข้อมูลเพิ่มเติม เช่น จุดรอ, อาการเฉพาะหน้า, ยาที่ต้องเตรียม...')}
            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all shadow-2xs resize-y"
          />
          <p className="text-[11px] text-slate-500 flex items-center gap-1">
            <Info className="w-3 h-3 text-slate-400 shrink-0" />
            <span>{t('book.notesHint', 'ข้อมูลนี้จะถูกส่งต่อให้ผู้ดูแลเพื่อเตรียมความพร้อมก่อนเดินทาง')}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default LocationPicker;
