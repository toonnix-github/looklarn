import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/ui/Toast';
import { Button } from '../components/ui/Button';
import { BookingSummaryCard } from '../components/booking/BookingSummaryCard';
import { LocationPicker } from '../components/booking/LocationPicker';
import { PaymentMethodSelector } from '../components/booking/PaymentMethodSelector';
import { PriceBreakdown } from '../components/booking/PriceBreakdown';
import { BookingSuccessModal } from '../components/booking/BookingSuccessModal';
import { ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react';

export default function BookingPage() {
  const { id } = useParams();
  const { t, language, getLocalized } = useLanguage();
  const { getCaretakerById, elder, addBooking, searchCriteria } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();

  const caretaker = getCaretakerById(id);

  // Booking Form States
  const elderAddress = elder?.address?.[language] || elder?.address?.th || '128/4 ซอยสุขุมวิท 39 แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ 10110';
  const [pickup, setPickup] = useState(searchCriteria?.pickupAddress || elderAddress);
  const [destination, setDestination] = useState(
    searchCriteria?.destination || 'โรงพยาบาลศิริราช อาคารนวมินทรบพิตร ๘๔ พรรษา'
  );
  const [notes, setNotes] = useState(searchCriteria?.specialNotes || '');
  const [hours, setHours] = useState(searchCriteria?.durationHours || 4);
  const [serviceDate] = useState(searchCriteria?.date || '2026-08-28');
  const [timeSlot] = useState(
    searchCriteria?.timeSlot === 'morning'
      ? '08:30 - 12:30'
      : searchCriteria?.timeSlot === 'afternoon'
      ? '13:00 - 17:00'
      : '08:30 - 12:30'
  );
  const [activityType] = useState(searchCriteria?.activityType || 'hospital');
  const [paymentMethod, setPaymentMethod] = useState('promptpay');

  // Promo Code State
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoStatus, setPromoStatus] = useState('idle'); // 'idle' | 'applied' | 'invalid'

  // Success Modal State
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!caretaker) {
    return (
      <div data-testid="page-book" className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">
          {t('book.notFoundTitle', 'ไม่พบผู้ดูแล')}
        </h2>
        <p className="text-sm text-slate-500">
          {t('book.notFoundDesc', 'กรุณาเลือกผู้ดูแลจากหน้าผลการจับคู่')}
        </p>
        <Link to="/matches">
          <Button variant="primary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            {t('common.back', 'กลับสู่หน้าผลการจับคู่')}
          </Button>
        </Link>
      </div>
    );
  }

  const handleApplyPromo = (code) => {
    const cleanCode = (code || '').trim().toUpperCase();
    if (cleanCode === 'LOOKLARNCARE' || cleanCode === 'LOOKLARN150') {
      setPromoDiscount(150);
      setPromoStatus('applied');
      toast.success(t('book.promoSuccessText', { discount: 150 }));
    } else if (cleanCode === '') {
      setPromoDiscount(0);
      setPromoStatus('idle');
    } else {
      setPromoDiscount(0);
      setPromoStatus('invalid');
      toast.error(t('book.promoInvalidText', 'โค้ดส่วนลดไม่ถูกต้องหรือไม่สามารถใช้ได้'));
    }
  };

  const handleUseElderAddress = () => {
    setPickup(elderAddress);
    toast.success(t('book.useElderAddressBtn', 'ใช้ที่อยู่ตามโปรไฟล์ผู้สูงอายุ'));
  };

  const handleConfirmBooking = () => {
    setIsSubmitting(true);
    const hourlyRate = caretaker.hourlyRate || 350;
    const basePrice = hourlyRate * hours;
    const serviceFee = 100;
    const totalPrice = Math.max(0, basePrice + serviceFee - promoDiscount);

    const newBk = addBooking({
      caretakerId: caretaker.id,
      caretakerName: caretaker.name,
      caretakerNickname: caretaker.nickname,
      caretakerPhoto: caretaker.photo,
      caretakerPhone: caretaker.phone || '089-123-4567',
      hourlyRate,
      durationHours: hours,
      serviceDate,
      timeSlot,
      activityType,
      pickupAddress: { th: pickup, en: pickup },
      destinationName: { th: destination, en: destination },
      destinationAddress: { th: destination, en: destination },
      basePrice,
      serviceFee,
      discount: promoDiscount,
      totalPrice,
      paymentMethod,
      specialNotes: notes,
    });

    setCreatedBooking(newBk);
    setIsSuccessOpen(true);
    setIsSubmitting(false);
    toast.success(t('book.bookingSavedToast', 'บันทึกคำสั่งจองเรียบร้อยแล้ว'));
  };

  return (
    <div data-testid="page-book" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-sky-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>{t('book.stepBadge', 'ขั้นตอนสุดท้าย: ยืนยันการนัดหมาย')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('book.title', 'สรุปข้อมูลการจอง')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t('book.subtitle', 'ตรวจสอบรายละเอียดการนัดหมายและยืนยันการจองอย่างปลอดภัย')}
          </p>
        </div>

        <Link to="/matches">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            {t('common.back', 'ย้อนกลับ')}
          </Button>
        </Link>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Summary, Locations & Payment */}
        <div className="lg:col-span-7 space-y-6">
          <BookingSummaryCard
            caretaker={caretaker}
            elder={elder}
            serviceDate={serviceDate}
            timeSlot={timeSlot}
            durationHours={hours}
            activityType={activityType}
          />

          <LocationPicker
            pickup={pickup}
            destination={destination}
            notes={notes}
            onPickupChange={setPickup}
            onDestinationChange={setDestination}
            onNotesChange={setNotes}
            onUseElderAddress={handleUseElderAddress}
          />

          <PaymentMethodSelector
            selectedMethod={paymentMethod}
            onSelectMethod={setPaymentMethod}
            totalAmount={Math.max(0, (caretaker.hourlyRate || 350) * hours + 100 - promoDiscount)}
          />
        </div>

        {/* Right Column: Price Breakdown Sticky Card */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
          <PriceBreakdown
            hourlyRate={caretaker.hourlyRate || 350}
            durationHours={hours}
            serviceFee={100}
            discount={promoDiscount}
            promoCode={promoCode}
            promoStatus={promoStatus}
            onPromoCodeChange={setPromoCode}
            onApplyPromo={handleApplyPromo}
            onConfirm={handleConfirmBooking}
            isSubmitting={isSubmitting}
          />

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2 text-xs text-slate-500">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-sky-500" />
              <span>{t('book.guaranteeTitle', 'การรับประกันความพึงพอใจและความปลอดภัย')}</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              {t('book.guaranteeDesc', 'หากจำเป็นต้องยกเลิก สามารถยกเลิกได้ฟรีก่อนเวลานัดหมาย 24 ชั่วโมง โดยได้รับเงินคืนเต็มจำนวน 100%')}
            </p>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <BookingSuccessModal
        isOpen={isSuccessOpen}
        onClose={() => {
          setIsSuccessOpen(false);
          navigate('/bookings');
        }}
        booking={createdBooking}
        caretaker={caretaker}
        elder={elder}
        onViewBookings={() => {
          setIsSuccessOpen(false);
          navigate('/bookings');
        }}
        onBackHome={() => {
          setIsSuccessOpen(false);
          navigate('/');
        }}
      />
    </div>
  );
}
