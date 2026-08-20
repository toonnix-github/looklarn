import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { CaretakerWaveHero } from '../components/caretaker/CaretakerWaveHero';
import { TrustBadges } from '../components/caretaker/TrustBadges';
import { CaretakerBio } from '../components/caretaker/CaretakerBio';
import { CaretakerStats } from '../components/caretaker/CaretakerStats';
import { AvailabilityCalendar } from '../components/caretaker/AvailabilityCalendar';
import { CaretakerReviews } from '../components/caretaker/CaretakerReviews';
import { StickyBookingBar } from '../components/caretaker/StickyBookingBar';
import { ArrowLeft, UserX } from 'lucide-react';

export default function CaretakerProfilePage() {
  const { id } = useParams();
  const { t } = useLanguage();
  const { getCaretakerById } = useApp();

  const caretaker = getCaretakerById(id);

  // 404 Fallback when caretaker id does not match any profile
  if (!caretaker) {
    return (
      <div data-testid="page-caretaker" className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto shadow-xs">
          <UserX className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900">
            {t('caretaker.notFoundTitle', 'ไม่พบผู้ดูแลที่ต้องการ')}
          </h2>
          <p className="text-sm text-slate-500">
            {t('caretaker.notFoundDesc', 'ไม่พบข้อมูลผู้ดูแลรหัสนี้ในระบบ')}
          </p>
        </div>
        <Link to="/matches">
          <Button variant="primary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            {t('caretaker.backToMatches', 'กลับสู่ผลการจับคู่')}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div
      data-testid="page-caretaker"
      className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8 space-y-5 pb-36 sm:pb-40"
    >
      {/* 1. Wave Gradient Hero Banner */}
      <CaretakerWaveHero caretaker={caretaker} />

      {/* 2. Trust Badges (4 Verification Credentials) */}
      <TrustBadges />

      {/* 3. Main Grid Layout (2 Columns on Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left / Primary Column (2/3 width on desktop) */}
        <div className="lg:col-span-2 space-y-5">
          {/* Caretaker Biography & Specialties */}
          <CaretakerBio caretaker={caretaker} />

          {/* Real Guardian Reviews & Testimonials */}
          <CaretakerReviews
            reviews={caretaker.reviews}
            rating={caretaker.rating}
            reviewsCount={caretaker.reviewsCount}
          />
        </div>

        {/* Right / Sidebar Column (1/3 width on desktop) */}
        <div className="space-y-5 lg:sticky lg:top-8 lg:self-start">
          {/* Quick Performance Stats Cards */}
          <CaretakerStats caretaker={caretaker} />

          {/* Interactive Availability Calendar Widget */}
          <AvailabilityCalendar caretaker={caretaker} />
        </div>
      </div>

      {/* 4. Persistent Sticky Bottom Booking Bar */}
      <StickyBookingBar caretaker={caretaker} />
    </div>
  );
}
