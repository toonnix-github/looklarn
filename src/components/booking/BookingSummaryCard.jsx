import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { MatchScoreRing } from '../ui/MatchScoreRing';
import { Badge } from '../ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import {
  Activity,
  Building2,
  Calendar,
  Clock,
  ClipboardList,
  Coffee,
  Heart,
  HeartPulse,
  Home as HomeIcon,
  Landmark,
  MapPin,
  Pill,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  Trees,
  User,
  Users,
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { formatServicePrice } from '../../utils/pricing';
import {
  APPOINTMENT_EVENTS,
  getAppointmentEventMeta,
  getElderMobilityMeta,
  getEnumLabel,
} from '../../constants/careEnums';

const eventIconMap = {
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

export function BookingSummaryCard({
  caretaker,
  elder,
  serviceDate,
  timeSlot,
  durationHours = 4,
  activityType = APPOINTMENT_EVENTS.HOSPITAL,
  priceQuote = null,
  className = '',
}) {
  const { t, language, getLocalized } = useLanguage();

  if (!caretaker) return null;
  const formattedPrice = priceQuote ? formatServicePrice(priceQuote.totalPrice) : null;

  const getActivityIcon = (type) => {
    const meta = getAppointmentEventMeta(type);
    const ActivityIcon = eventIconMap[meta.icon] || Building2;
    return <ActivityIcon className="w-5 h-5 text-sky-500" />;
  };

  const getMobilityBadge = (level) => {
    const label = getEnumLabel(getElderMobilityMeta(level), language, 'shortLabel');
    switch (level) {
      case 'independent':
        return <Badge variant="success">{label}</Badge>;
      case 'cane':
      case 'walker':
      case 'assisted_walking':
        return <Badge variant="warning">{label}</Badge>;
      case 'wheelchair_assisted':
      case 'wheelchair':
        return <Badge variant="info">{label}</Badge>;
      case 'full_assistance':
      case 'bed_bound':
        return <Badge variant="danger">{label}</Badge>;
      default:
        return <Badge variant="neutral">{label || level}</Badge>;
    }
  };

  return (
    <Card className={`overflow-hidden border-sky-100 shadow-sm ${className}`}>
      <CardHeader className="bg-gradient-to-r from-sky-50 via-white to-sky-50/30 border-b border-sky-100/60 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-slate-900">
                {t('book.summaryCardTitle', 'รายละเอียดการนัดหมาย')}
              </CardTitle>
              <p className="text-xs text-slate-500">
                {t('book.subtitle', 'ตรวจสอบรายละเอียดการนัดหมายและยืนยันการจองอย่างปลอดภัย')}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Caretaker Summary Block */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            {t('book.caretakerSummaryTitle', 'ผู้ดูแลที่คุณเลือก')}
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-200 shrink-0 border border-white shadow-xs">
                  <img
                    src={caretaker.photo}
                    alt={getLocalized(caretaker, 'name')}
                    className="w-full h-full object-cover"
                  />
                </div>
                {caretaker.isBestMatch && (
                  <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-md shadow-xs">
                    BEST
                  </span>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold text-slate-900 text-base">
                    {getLocalized(caretaker, 'name')}
                  </h4>
                  {caretaker.nickname && (
                    <span className="text-xs text-slate-500 font-medium">
                      ({getLocalized(caretaker, 'nickname')})
                    </span>
                  )}
                </div>
                <p className="text-xs text-sky-700 font-medium">
                  {getLocalized(caretaker, 'tierName')}
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-600 pt-0.5">
                  <span className="font-bold text-emerald-600 text-sm">
                    {formattedPrice || t('book.standardPriceLabel', 'ราคามาตรฐาน')}
                  </span>
                  <span>•</span>
                  <span>★ {caretaker.rating} ({caretaker.reviewsCount || caretaker.reviews?.length || 0})</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-sky-600 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {t('common.verifiedCaregiver', 'ผู้ดูแลยืนยันตัวตนแล้ว')}
                  </span>
                </div>
              </div>
            </div>
            {caretaker.matchScore && (
              <div className="shrink-0 flex sm:flex-col items-center justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-slate-200/80 pt-3 sm:pt-0 sm:pl-4">
                <MatchScoreRing score={caretaker.matchScore} size="md" showSublabel sublabel="AI Matching Score" />
              </div>
            )}
          </div>
        </div>

        {/* Elder Recipient Summary Block */}
        {elder && (
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              {t('book.elderSummaryTitle', 'ข้อมูลผู้รับการดูแล')}
            </h3>
            <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-sky-50/50 border border-sky-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-white shrink-0 border border-sky-200">
                  <img
                    src={elder.photo}
                    alt={getLocalized(elder, 'name')}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm sm:text-base">
                      {getLocalized(elder, 'name')}
                    </span>
                    {elder.nickname && (
                      <span className="text-xs text-slate-500">
                        ({getLocalized(elder, 'nickname')})
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600">
                    {elder.age} {t('common.yearsOld', 'ปี')} • {t('common.bloodGroup', 'กรุ๊ป')} {elder.bloodType || 'O+'}
                  </p>
                </div>
              </div>
              <div>
                {getMobilityBadge(elder.mobilityLevel)}
              </div>
            </div>
          </div>
        )}

        {/* Schedule & Timing Block */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            {t('book.scheduleSectionTitle', 'วัน เวลา และระยะเวลาบริการ')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600 shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-slate-400 font-medium">{t('book.serviceDateLabel', 'วันที่นัดหมาย')}</p>
                <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                  {serviceDate ? formatDate(serviceDate, language) : '28 ส.ค. 2026'}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-slate-400 font-medium">{t('book.serviceTimeLabel', 'ช่วงเวลานัดหมาย')}</p>
                <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                  {timeSlot || '08:30 - 12:30'}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                {getActivityIcon(activityType)}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-slate-400 font-medium">{t('book.durationLabel', 'ระยะเวลารวม')}</p>
                <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                  {durationHours} {t('common.hours', 'ชั่วโมง')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default BookingSummaryCard;
