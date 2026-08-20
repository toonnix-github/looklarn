import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { CheckCircle2, Calendar, Clock, MapPin, User, ArrowRight, Home, PhoneCall, ShieldCheck } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export function BookingSuccessModal({
  isOpen = false,
  onClose,
  booking,
  caretaker,
  elder,
  onViewBookings,
  onBackHome,
}) {
  const { t, language, getLocalized } = useLanguage();

  if (!isOpen) return null;

  const bookingIdFormatted = booking?.id
    ? `#LK-${String(booking.id).toUpperCase().replace(/^BK-/, '')}`
    : '#LK-20260828-001';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('book.successModal.modalTitle', 'บันทึกการนัดหมายเรียบร้อย')}
      size="lg"
    >
      <div className="text-center py-2 space-y-6">
        {/* Animated Check Icon */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100/80 flex items-center justify-center text-emerald-500 shadow-inner">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-sky-500 text-white rounded-full flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1.5 max-w-md mx-auto">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {t('book.successModal.heading', 'การนัดหมายเสร็จสมบูรณ์')}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {t('book.successModal.subtitle', 'ระบบได้ส่งข้อมูลการนัดหมายไปยังผู้ดูแลแล้ว ผู้ดูแลจะโทรติดต่อยืนยันรายละเอียดภายใน 15 นาที')}
          </p>
        </div>

        {/* Booking Reference Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 border border-sky-200 rounded-xl text-sky-900">
          <span className="text-xs font-medium text-slate-500">
            {t('book.successModal.bookingRefLabel', 'หมายเลขอ้างอิง:')}
          </span>
          <span className="font-mono font-bold text-sm sm:text-base text-sky-700 tracking-wide">
            {bookingIdFormatted}
          </span>
        </div>

        {/* Appointment Summary Box */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-3 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-slate-200/60">
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4 text-sky-500 shrink-0" />
              <div>
                <span className="text-[11px] text-slate-400 block">{t('book.successModal.caretakerLabel', 'ผู้ดูแล:')}</span>
                <span className="font-bold text-slate-900">
                  {caretaker ? getLocalized(caretaker, 'name') : (booking?.caretakerName ? getLocalized(booking, 'caretakerName') : '-')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-emerald-500 shrink-0" />
              <div>
                <span className="text-[11px] text-slate-400 block">{t('book.successModal.dateLabel', 'วันและเวลา:')}</span>
                <span className="font-semibold text-slate-800">
                  {booking?.serviceDate ? formatDate(booking.serviceDate, language) : '28 ส.ค. 2026'} ({booking?.timeSlot || '08:30 - 12:30'})
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <div className="min-w-0">
                <span className="text-[11px] text-slate-400 block">{t('book.successModal.destinationLabel', 'สถานที่:')}</span>
                <span className="font-medium text-slate-800 truncate block">
                  {booking?.destinationName ? getLocalized(booking, 'destinationName') : 'โรงพยาบาลศิริราช'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-[11px] text-slate-400 block">{t('book.successModal.totalPaidLabel', 'ยอดชำระเงิน:')}</span>
              <span className="font-bold text-emerald-600 text-base">
                ฿{booking?.totalPrice || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Notice */}
        <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed bg-sky-50/50 p-3 rounded-xl border border-sky-100">
          {t('book.successModal.contactNotice', 'ท่านสามารถดูรายละเอียดการจองหรือติดต่อผู้ดูแลได้ตลอดเวลาในเมนู "การจองของฉัน"')}
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            variant="primary"
            size="lg"
            className="flex-1 text-sm font-bold shadow-md shadow-sky-500/15 cursor-pointer"
            onClick={onViewBookings}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {t('book.successModal.viewBookingsBtn', 'ดูรายการจองของฉัน')}
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="sm:w-auto text-sm font-semibold cursor-pointer"
            onClick={onBackHome}
            leftIcon={<Home className="w-4 h-4" />}
          >
            {t('book.successModal.backHomeBtn', 'กลับสู่หน้าแรก')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default BookingSuccessModal;
