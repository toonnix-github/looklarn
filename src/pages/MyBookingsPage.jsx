import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/ui/Toast';
import { BookingCard } from '../components/bookings/BookingCard';
import { ReviewModal } from '../components/bookings/ReviewModal';
import { CancelConfirmModal } from '../components/bookings/CancelConfirmModal';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Calendar, Sparkles, Search, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function MyBookingsPage() {
  const { t } = useLanguage();
  const { bookings, cancelBooking, addReview } = useApp();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState(null);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);

  const upcomingBookings = (bookings || []).filter((b) => b.status === 'upcoming');
  const pastBookings = (bookings || []).filter(
    (b) => b.status === 'completed' || b.status === 'cancelled'
  );

  const currentBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  const handleConfirmCancel = () => {
    if (selectedBookingForCancel) {
      cancelBooking(selectedBookingForCancel.id);
      setSelectedBookingForCancel(null);
      toast.success(t('bookings.cancelSuccessToast', 'ยกเลิกการจองเรียบร้อยแล้ว'));
    }
  };

  const handleReviewSubmit = ({ rating, comment_th, comment_en }) => {
    if (selectedBookingForReview) {
      addReview(selectedBookingForReview.id, {
        rating,
        comment_th,
        comment_en,
      });
      setSelectedBookingForReview(null);
      toast.success(
        t('bookings.reviewModal.successToast', 'ส่งรีวิวเรียบร้อยแล้ว ขอบคุณสำหรับความคิดเห็นของคุณ!')
      );
    }
  };

  return (
    <div data-testid="page-bookings" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-sky-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4" />
            <span>{t('bookings.headerBadge', 'รายการนัดหมาย & ประวัติการดูแล')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('bookings.pageHeading', 'รายการนัดหมายและการดูแล')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t('bookings.subtitle', 'ติดตามสถานะการดูแล ติดต่อผู้ดูแล และดูประวัติการใช้บริการที่ผ่านมา')}
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          role="tablist"
          aria-label="Booking categories"
          className="inline-flex bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80 shrink-0 self-start md:self-auto shadow-inner"
        >
          <button
            role="tab"
            aria-label={`กำลังมาถึง (${upcomingBookings.length})`}
            aria-selected={activeTab === 'upcoming'}
            type="button"
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'upcoming'
                ? 'bg-white text-sky-600 shadow-xs scale-100'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>{t('bookings.tabUpcomingLabel', `รอบเร็วๆ นี้ (${upcomingBookings.length})`)}</span>
          </button>

          <button
            role="tab"
            aria-label={`ประวัติ / ที่ผ่านมา (${pastBookings.length})`}
            aria-selected={activeTab === 'past'}
            type="button"
            onClick={() => setActiveTab('past')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'past'
                ? 'bg-white text-sky-600 shadow-xs scale-100'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>{t('bookings.tabPastLabel', `ประวัติการดูแล (${pastBookings.length})`)}</span>
          </button>
        </div>
      </div>

      {/* Bookings List */}
      {currentBookings.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-200">
          <CardContent className="text-center py-16 px-4 space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-500 mx-auto">
              <Calendar className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">
                {activeTab === 'upcoming'
                  ? t('bookings.emptyUpcomingTitle', 'ยังไม่มีรายการจองที่กำลังจะมาถึง')
                  : t('bookings.emptyPastTitle', 'ยังไม่มีประวัติการใช้บริการที่ผ่านมา')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {activeTab === 'upcoming'
                  ? t('bookings.emptyUpcomingDesc', 'ค้นหาผู้ดูแลมืออาชีพเพื่อพาคนที่คุณรักไปโรงพยาบาลหรือท่องเที่ยวได้เลย')
                  : t('bookings.emptyPastDesc', 'เมื่อคุณใช้บริการเสร็จสิ้น ประวัติการจองและบันทึกการดูแลจะแสดงที่นี่')}
              </p>
            </div>
            <div className="pt-2">
              <Link to="/find">
                <Button variant="primary" size="md" leftIcon={<Search className="w-4 h-4" />}>
                  {t('bookings.findCaretakerBtn', 'ค้นหาผู้ดูแลเลย')}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {currentBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={(b) => setSelectedBookingForCancel(b)}
              onReview={(b) => setSelectedBookingForReview(b)}
            />
          ))}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <CancelConfirmModal
        isOpen={Boolean(selectedBookingForCancel)}
        onClose={() => setSelectedBookingForCancel(null)}
        booking={selectedBookingForCancel}
        onConfirm={handleConfirmCancel}
      />

      {/* Review Modal */}
      <ReviewModal
        isOpen={Boolean(selectedBookingForReview)}
        onClose={() => setSelectedBookingForReview(null)}
        booking={selectedBookingForReview}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
}
