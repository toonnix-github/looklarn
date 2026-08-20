import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Star,
  CheckCircle2,
  XCircle,
  RotateCw,
  MessageSquareQuote,
  ShieldCheck,
  Building2,
  Trees,
  ShoppingBag,
  Users,
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export function BookingCard({
  booking,
  onCancel,
  onReview,
  className = '',
}) {
  const { t, language, getLocalized } = useLanguage();

  if (!booking) return null;

  const getActivityIcon = (type) => {
    switch (type) {
      case 'hospital':
        return <Building2 className="w-4 h-4 text-rose-500" />;
      case 'park':
        return <Trees className="w-4 h-4 text-emerald-500" />;
      case 'shopping':
        return <ShoppingBag className="w-4 h-4 text-amber-500" />;
      case 'social':
      case 'temple':
        return <Users className="w-4 h-4 text-sky-500" />;
      default:
        return <Building2 className="w-4 h-4 text-sky-500" />;
    }
  };

  const renderStatusBadge = () => {
    switch (booking.status) {
      case 'upcoming':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('common.statusUpcoming', 'ยืนยันแล้ว (Confirmed)')}</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-700 border border-slate-300/80 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
            <span>{t('common.statusCompleted', 'เสร็จสิ้นแล้ว (Completed)')}</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs">
            <XCircle className="w-3.5 h-3.5 text-rose-500" />
            <span>{t('common.statusCancelled', 'ยกเลิกแล้ว (Cancelled)')}</span>
          </span>
        );
      default:
        return <Badge variant="neutral">{booking.status}</Badge>;
    }
  };

  const bookingRef = `#LK-${String(booking.id).toUpperCase().replace(/^BK-/, '')}`;

  return (
    <Card className={`border-slate-200/90 hover:border-slate-300 transition-all shadow-xs overflow-hidden ${className}`}>
      <CardContent className="p-5 sm:p-6 space-y-4">
        {/* Card Top Row: Booking ID, Activity Title, Status Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-mono text-xs font-black text-sky-800 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
              {bookingRef}
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              {getActivityIcon(booking.activityType)}
              <span className="truncate max-w-xs sm:max-w-md">
                {getLocalized(booking, 'activityTitle') || 'บริการพาพบแพทย์และดูแลผู้สูงอายุ'}
              </span>
            </div>
          </div>
          <div className="self-start sm:self-auto">
            {renderStatusBadge()}
          </div>
        </div>

        {/* Caretaker Info & Appointment Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Caretaker Avatar & Contact */}
          <div className="md:col-span-4 flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 shadow-2xs">
              <img
                src={booking.caretakerPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'}
                alt={getLocalized(booking, 'caretakerName')}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                  {getLocalized(booking, 'caretakerName')}
                </h4>
                {booking.caretakerNickname && (
                  <span className="text-xs text-slate-500 font-medium">
                    ({getLocalized(booking, 'caretakerNickname')})
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
                <span>{t('common.verifiedCaregiver', 'ผู้ดูแลรับรอง')}</span>
              </p>
              {booking.caretakerPhone && (
                <a
                  href={`tel:${booking.caretakerPhone}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700 pt-0.5"
                >
                  <Phone className="w-3 h-3" />
                  <span>{booking.caretakerPhone}</span>
                </a>
              )}
            </div>
          </div>

          {/* Schedule & Location */}
          <div className="md:col-span-5 space-y-2 text-xs sm:text-sm text-slate-600 bg-slate-50/60 p-3 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-500 shrink-0" />
              <span className="font-medium text-slate-800">
                {booking.serviceDate ? formatDate(booking.serviceDate, language) : '-'} ({booking.timeSlot || '08:30 - 12:30'})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="truncate text-slate-700">
                {getLocalized(booking, 'destinationName')}
              </span>
            </div>
          </div>

          {/* Total Price Display */}
          <div className="md:col-span-3 text-left md:text-right space-y-0.5">
            <span className="text-xs text-slate-400 block font-medium">
              {t('bookings.totalPriceLabel', 'ยอดชำระ:')}
            </span>
            <span className="text-xl sm:text-2xl font-black text-emerald-600 tracking-tight">
              ฿{booking.totalPrice}
            </span>
            <span className="text-[10px] text-slate-400 block">
              {booking.durationHours} {t('common.hours', 'ชม.')} • {getLocalized(booking, 'paymentMethodName') || 'PromptPay'}
            </span>
          </div>
        </div>

        {/* Optional Notes Snippet */}
        {booking.notes && (getLocalized(booking, 'notes') || typeof booking.notes === 'string') && (
          <div className="text-xs text-slate-500 bg-slate-50/80 p-2.5 rounded-lg border border-slate-100">
            <span className="font-bold text-slate-700 mr-1.5">{t('bookings.notesLabel', 'หมายเหตุ:')}</span>
            <span>{typeof booking.notes === 'string' ? booking.notes : getLocalized(booking, 'notes')}</span>
          </div>
        )}

        {/* Existing Review Quote snippet if reviewed */}
        {booking.hasReview && (
          <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 flex items-start gap-2.5 text-xs">
            <div className="p-1 rounded-md bg-amber-100 text-amber-700 shrink-0 mt-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <span>{t('bookings.reviewSubmittedBadge', { score: booking.reviewRating || 5 })}</span>
              </div>
              <p className="text-slate-600 italic">
                "{booking.reviewText ? getLocalized(booking, 'reviewText') : 'การดูแลดีเยี่ยม สุภาพและตรงต่อเวลา'}"
              </p>
            </div>
          </div>
        )}

        {/* Action Button Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="text-xs text-slate-400">
            {booking.elderName && (
              <span>
                {t('common.elderRecipient', 'ผู้รับการดูแล:')}{' '}
                <strong className="text-slate-700 font-semibold">{getLocalized(booking, 'elderName')}</strong>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Upcoming Actions */}
            {booking.status === 'upcoming' && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCancel?.(booking)}
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 text-xs cursor-pointer"
                >
                  {t('bookings.cancelBookingBtn', 'ยกเลิกการจอง')}
                </Button>
                {booking.caretakerPhone && (
                  <a href={`tel:${booking.caretakerPhone}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Phone className="w-3.5 h-3.5" />}
                      className="text-xs cursor-pointer"
                    >
                      {t('bookings.contactCaregiverBtn', 'โทรหาผู้ดูแล')}
                    </Button>
                  </a>
                )}
              </>
            )}

            {/* Completed & Not Reviewed Action */}
            {booking.status === 'completed' && !booking.hasReview && (
              <Button
                variant="accent"
                size="sm"
                onClick={() => onReview?.(booking)}
                leftIcon={<Star className="w-3.5 h-3.5 fill-current" />}
                className="text-xs font-bold shadow-xs cursor-pointer"
              >
                {t('bookings.leaveReviewBtn', 'เขียนรีวิวผู้ดูแล (Leave Review)')}
              </Button>
            )}

            {/* Book Again Action */}
            {booking.caretakerId && (
              <Link to={`/book/${booking.caretakerId}`}>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<RotateCw className="w-3.5 h-3.5" />}
                  className="text-xs cursor-pointer"
                >
                  {t('bookings.bookAgainBtn', 'จองผู้ดูแลท่านนี้อีกครั้ง')}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default BookingCard;
