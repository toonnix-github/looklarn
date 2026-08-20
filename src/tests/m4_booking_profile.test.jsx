import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import { LanguageProvider } from '../context/LanguageContext';
import { AppProvider } from '../context/AppContext';
import { ToastProvider } from '../components/ui/Toast';

// Pages
import BookingPage from '../pages/BookingPage';
import MyBookingsPage from '../pages/MyBookingsPage';
import ElderProfilePage from '../pages/ElderProfilePage';

// Components
import { BookingSummaryCard } from '../components/booking/BookingSummaryCard';
import { LocationPicker } from '../components/booking/LocationPicker';
import { PriceBreakdown } from '../components/booking/PriceBreakdown';
import { PaymentMethodSelector } from '../components/booking/PaymentMethodSelector';
import { BookingSuccessModal } from '../components/booking/BookingSuccessModal';

import { BookingCard } from '../components/bookings/BookingCard';
import { ReviewModal } from '../components/bookings/ReviewModal';
import { CancelConfirmModal } from '../components/bookings/CancelConfirmModal';

import { ElderProfileForm } from '../components/elder/ElderProfileForm';
import { GeneralInfoSection } from '../components/elder/GeneralInfoSection';
import { MobilitySection } from '../components/elder/MobilitySection';
import { MedicalConditionsSection } from '../components/elder/MedicalConditionsSection';
import { PreferencesSection } from '../components/elder/PreferencesSection';
import { EmergencyContactsSection } from '../components/elder/EmergencyContactsSection';

// Helper to render component with providers
const renderWithProviders = (ui, { initialRoute = '/', language = 'th' } = {}) => {
  if (language) {
    localStorage.setItem('looklarn_language', language);
  }
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <LanguageProvider>
        <AppProvider>
          <ToastProvider>
            {ui}
          </ToastProvider>
        </AppProvider>
      </LanguageProvider>
    </MemoryRouter>
  );
};

const mockCaretaker = {
  id: 'ct-001',
  name: { th: 'สมชาย ประเสริฐ', en: 'Somchai Prasert' },
  nickname: { th: 'สมชาย', en: 'Somchai' },
  photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
  hourlyRate: 350,
  matchScore: 96,
  isBestMatch: true,
  rating: 4.95,
  reviewsCount: 58,
  tierName: { th: 'ผู้เชี่ยวชาญพาพบแพทย์', en: 'Medical Escort Specialist' },
  phone: '081-234-5678',
};

const mockElder = {
  id: 'elder-001',
  name: { th: 'นางสมพร ใจดี', en: 'Grandma Somporn Jaidee' },
  nickname: { th: 'พร', en: 'Porn' },
  age: 74,
  gender: 'female',
  bloodType: 'O+',
  mobilityLevel: 'wheelchair_assisted',
  photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
  address: {
    th: '128/4 ซอยสุขุมวิท 39 แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ 10110',
    en: '128/4 Sukhumvit 39, Khlong Tan Nuea, Watthana, Bangkok 10110',
  },
};

describe('Milestone M4: Comprehensive Booking Flow, My Bookings & Elder Profile Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  // ==========================================
  // 1. Booking Flow Components
  // ==========================================
  describe('1. BookingSummaryCard Component', () => {
    it('renders caretaker details with MatchScoreRing and verified badge', () => {
      renderWithProviders(
        <BookingSummaryCard
          caretaker={mockCaretaker}
          elder={mockElder}
          serviceDate="2026-08-28"
          timeSlot="08:30 - 12:30"
          durationHours={4}
          activityType="hospital"
        />
      );

      expect(screen.getByText(/สมชาย ประเสริฐ/i)).toBeInTheDocument();
      expect(screen.getByText(/96%/i)).toBeInTheDocument();
      expect(screen.getByText(/฿350/i)).toBeInTheDocument();
      expect(screen.getByText(/ยืนยันแล้ว|ยืนยันตัวตนแล้ว|Verified/i)).toBeInTheDocument();
    });

    it('renders elder summary details and mobility badge', () => {
      renderWithProviders(
        <BookingSummaryCard
          caretaker={mockCaretaker}
          elder={mockElder}
          serviceDate="2026-08-28"
          timeSlot="08:30 - 12:30"
          durationHours={4}
          activityType="hospital"
        />
      );

      expect(screen.getByText(/นางสมพร ใจดี/i)).toBeInTheDocument();
      expect(screen.getByText(/74.*ปี/i)).toBeInTheDocument();
      expect(screen.getByText(/วีลแชร์|Wheelchair/i)).toBeInTheDocument();
    });

    it('renders appointment timing and duration', () => {
      renderWithProviders(
        <BookingSummaryCard
          caretaker={mockCaretaker}
          elder={mockElder}
          serviceDate="2026-08-28"
          timeSlot="08:30 - 12:30"
          durationHours={4}
          activityType="hospital"
        />
      );

      expect(screen.getByText(/08:30 - 12:30/i)).toBeInTheDocument();
      expect(screen.getByText(/4.*ชั่วโมง/i)).toBeInTheDocument();
    });
  });

  describe('2. LocationPicker Component', () => {
    it('renders pickup, destination, and notes fields and handles changes', async () => {
      const user = userEvent.setup();
      const onPickupChange = vi.fn();
      const onDestinationChange = vi.fn();
      const onNotesChange = vi.fn();
      const onUseElderAddress = vi.fn();

      renderWithProviders(
        <LocationPicker
          pickup="จุดรับเดิม"
          destination="โรงพยาบาลศิริราช"
          notes="หมายเหตุ"
          onPickupChange={onPickupChange}
          onDestinationChange={onDestinationChange}
          onNotesChange={onNotesChange}
          onUseElderAddress={onUseElderAddress}
        />
      );

      const pickupInput = screen.getByDisplayValue('จุดรับเดิม');
      await user.type(pickupInput, 'ใหม่');
      expect(onPickupChange).toHaveBeenCalled();

      const destInput = screen.getByDisplayValue('โรงพยาบาลศิริราช');
      await user.type(destInput, 'ใหม่');
      expect(onDestinationChange).toHaveBeenCalled();

      const useElderBtn = screen.getByRole('button', { name: /ใช้ที่อยู่ตามโปรไฟล์ผู้สูงอายุ|Use Elder's Home Address/i });
      await user.click(useElderBtn);
      expect(onUseElderAddress).toHaveBeenCalled();
    });
  });

  describe('3. PriceBreakdown Component', () => {
    it('calculates total price correctly with base rate and platform fee', () => {
      renderWithProviders(
        <PriceBreakdown
          hourlyRate={350}
          durationHours={4}
          serviceFee={100}
          discount={0}
          promoCode=""
          promoStatus="idle"
        />
      );

      // 350 * 4 = 1400 base, 100 service fee -> 1500 total
      expect(screen.getByText(/฿1400/i)).toBeInTheDocument();
      expect(screen.getByText(/฿100/i)).toBeInTheDocument();
      expect(screen.getByText('฿1500')).toBeInTheDocument();
    });

    it('applies promo discount and updates total price display', () => {
      renderWithProviders(
        <PriceBreakdown
          hourlyRate={350}
          durationHours={4}
          serviceFee={100}
          discount={150}
          promoCode="LOOKLARNCARE"
          promoStatus="applied"
        />
      );

      // 1400 + 100 - 150 = 1350
      expect(screen.getByText('-฿150')).toBeInTheDocument();
      expect(screen.getByText('฿1350')).toBeInTheDocument();
      expect(screen.getByText(/ใช้โค้ดสำเร็จ|Promo applied/i)).toBeInTheDocument();
    });

    it('triggers apply promo and confirm callbacks', async () => {
      const user = userEvent.setup();
      const onApplyPromo = vi.fn();
      const onConfirm = vi.fn();

      renderWithProviders(
        <PriceBreakdown
          hourlyRate={350}
          durationHours={4}
          serviceFee={100}
          discount={0}
          promoCode="LOOKLARNCARE"
          promoStatus="idle"
          onApplyPromo={onApplyPromo}
          onConfirm={onConfirm}
        />
      );

      const applyBtn = screen.getByRole('button', { name: /ใช้โค้ด|Apply/i });
      await user.click(applyBtn);
      expect(onApplyPromo).toHaveBeenCalledWith('LOOKLARNCARE');

      const confirmBtn = screen.getByRole('button', { name: /ยืนยันการจอง|Confirm Booking|ชำระเงิน/i });
      await user.click(confirmBtn);
      expect(onConfirm).toHaveBeenCalled();
    });
  });

  describe('4. PaymentMethodSelector Component', () => {
    it('defaults to PromptPay QR and renders simulated QR box', () => {
      renderWithProviders(
        <PaymentMethodSelector
          selectedMethod="promptpay"
          totalAmount={1500}
        />
      );

      expect(screen.getByText(/พร้อมเพย์ QR Code|PromptPay QR/i)).toBeInTheDocument();
      expect(screen.getByText(/PromptPay Cross-Bank QR Code/i)).toBeInTheDocument();
      expect(screen.getByText(/฿1500/i)).toBeInTheDocument();
    });

    it('allows selecting Credit Card and Mobile Banking', async () => {
      const user = userEvent.setup();
      const onSelectMethod = vi.fn();

      renderWithProviders(
        <PaymentMethodSelector
          selectedMethod="promptpay"
          onSelectMethod={onSelectMethod}
          totalAmount={1500}
        />
      );

      const creditCardOption = screen.getByText(/บัตรเครดิต|Credit \/ Debit Card/i);
      await user.click(creditCardOption);
      expect(onSelectMethod).toHaveBeenCalledWith('credit_card');
    });
  });

  describe('5. BookingSuccessModal Component', () => {
    it('renders reference ID, details summary and action buttons', async () => {
      const user = userEvent.setup();
      const onViewBookings = vi.fn();
      const onBackHome = vi.fn();

      const sampleBooking = {
        id: 'bk-999',
        serviceDate: '2026-08-28',
        timeSlot: '08:30 - 12:30',
        destinationName: { th: 'โรงพยาบาลศิริราช', en: 'Siriraj Hospital' },
        totalPrice: 1500,
      };

      renderWithProviders(
        <BookingSuccessModal
          isOpen={true}
          onClose={vi.fn()}
          booking={sampleBooking}
          caretaker={mockCaretaker}
          elder={mockElder}
          onViewBookings={onViewBookings}
          onBackHome={onBackHome}
        />
      );

      expect(screen.getByText(/#LK-999/i)).toBeInTheDocument();
      expect(screen.getByText(/สมชาย ประเสริฐ/i)).toBeInTheDocument();
      expect(screen.getByText(/฿1500/i)).toBeInTheDocument();

      const viewBookingsBtn = screen.getByRole('button', { name: /ดูรายการจองของฉัน|Go to My Bookings/i });
      await user.click(viewBookingsBtn);
      expect(onViewBookings).toHaveBeenCalled();

      const backHomeBtn = screen.getByRole('button', { name: /กลับสู่หน้าแรก|Back to Home/i });
      await user.click(backHomeBtn);
      expect(onBackHome).toHaveBeenCalled();
    });
  });

  // ==========================================
  // 2. My Bookings Components & Flow
  // ==========================================
  describe('6. BookingCard Component', () => {
    it('renders upcoming booking with Confirmed badge and cancel action', async () => {
      const user = userEvent.setup();
      const onCancel = vi.fn();

      const upcomingBooking = {
        id: 'bk-001',
        status: 'upcoming',
        caretakerName: { th: 'พว. อารียา รัตนกุล', en: 'Nurse Areeya' },
        caretakerPhone: '089-123-4567',
        serviceDate: '2026-08-28',
        timeSlot: '08:30 - 12:30',
        durationHours: 4,
        totalPrice: 1900,
        destinationName: { th: 'โรงพยาบาลศิริราช', en: 'Siriraj Hospital' },
      };

      renderWithProviders(
        <BookingCard
          booking={upcomingBooking}
          onCancel={onCancel}
        />
      );

      expect(screen.getByText(/ยืนยันแล้ว|Confirmed/i)).toBeInTheDocument();
      expect(screen.getByText(/พว. อารียา รัตนกุล/i)).toBeInTheDocument();
      expect(screen.getByText(/฿1900/i)).toBeInTheDocument();

      const cancelBtn = screen.getByRole('button', { name: /ยกเลิกการจอง|Cancel Booking/i });
      await user.click(cancelBtn);
      expect(onCancel).toHaveBeenCalledWith(upcomingBooking);
    });

    it('renders completed booking with slate badge and leave review button', async () => {
      const user = userEvent.setup();
      const onReview = vi.fn();

      const completedBooking = {
        id: 'bk-003',
        status: 'completed',
        caretakerName: { th: 'สมชาย ประเสริฐ', en: 'Somchai Prasert' },
        serviceDate: '2026-08-14',
        timeSlot: '08:00 - 12:00',
        durationHours: 4,
        totalPrice: 1350,
        destinationName: { th: 'โรงพยาบาลพระมงกุฎเกล้า', en: 'Phramongkutklao Hospital' },
        hasReview: false,
      };

      renderWithProviders(
        <BookingCard
          booking={completedBooking}
          onReview={onReview}
        />
      );

      expect(screen.getByText(/เสร็จสิ้น|Completed/i)).toBeInTheDocument();
      const reviewBtn = screen.getByRole('button', { name: /เขียนรีวิว|Leave Review/i });
      await user.click(reviewBtn);
      expect(onReview).toHaveBeenCalledWith(completedBooking);
    });
  });

  describe('7. ReviewModal Component', () => {
    it('allows 5-star rating selection, quick tags, and submission', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();

      const completedBooking = {
        id: 'bk-003',
        caretakerName: { th: 'สมชาย ประเสริฐ', en: 'Somchai Prasert' },
        destinationName: { th: 'โรงพยาบาลพระมงกุฎเกล้า', en: 'Phramongkutklao Hospital' },
        serviceDate: '2026-08-14',
        timeSlot: '08:00 - 12:00',
      };

      renderWithProviders(
        <ReviewModal
          isOpen={true}
          onClose={vi.fn()}
          booking={completedBooking}
          onSubmit={onSubmit}
        />
      );

      expect(screen.getByText(/ให้คะแนนผู้ดูแล|Rate Caretaker/i)).toBeInTheDocument();

      // Click on 5th star
      const stars = screen.getAllByRole('button', { name: /\d Star/i });
      if (stars.length >= 5) {
        await user.click(stars[4]);
      }

      // Click quick tag
      const quickTag = screen.getByText(/ตรงต่อเวลามาก|Very punctual/i);
      await user.click(quickTag);

      const submitBtn = screen.getByRole('button', { name: /ส่งรีวิว|Submit Review/i });
      await user.click(submitBtn);

      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          rating: 5,
        })
      );
    });
  });

  describe('8. CancelConfirmModal Component', () => {
    it('renders cancellation warning with refund policy notice', async () => {
      const user = userEvent.setup();
      const onConfirm = vi.fn();
      const onClose = vi.fn();

      const bookingToCancel = {
        id: 'bk-001',
      };

      renderWithProviders(
        <CancelConfirmModal
          isOpen={true}
          onClose={onClose}
          booking={bookingToCancel}
          onConfirm={onConfirm}
        />
      );

      expect(screen.getByText(/ยืนยันการยกเลิกการจอง|Confirm Cancellation/i)).toBeInTheDocument();
      expect(screen.getByText(/100%/i)).toBeInTheDocument();

      const confirmCancelBtn = screen.getByRole('button', { name: /ยืนยันการยกเลิก|Confirm Cancellation/i });
      await user.click(confirmCancelBtn);
      expect(onConfirm).toHaveBeenCalled();
    });
  });

  // ==========================================
  // 3. Elder Profile Form & Sections
  // ==========================================
  describe('9. ElderProfile Form & Modular Sections', () => {
    const mockFormData = {
      nameTh: 'นางสมพร ใจดี',
      nameEn: 'Grandma Somporn Jaidee',
      nickname: 'พร',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
      age: 74,
      gender: 'female',
      bloodType: 'O+',
      mobilityLevel: 'wheelchair_assisted',
      mobilityAids: ['wheelchair'],
      conditions: ['hypertension', 'diabetes_type_2'],
      allergies: 'ไม่มีประวัติแพ้ยา',
      medications: 'Amlodipine 5mg',
      preferredHospital: 'โรงพยาบาลศิริราช',
      hospitalHn: 'HN-89234/62',
      preferredLanguages: ['Thai'],
      religion: 'Buddhism',
      dietaryPreferences: 'low_sodium',
      specialNotes: 'คุณยายเดินช้าและใช้วีลแชร์',
      guardianName: 'นายธนกร ใจดี',
      guardianPhone: '081-987-6543',
      guardianEmail: 'thanakorn.j@gmail.com',
      emergencyName: 'นายธนกร ใจดี',
      emergencyPhone: '081-987-6543',
      address: '128/4 ซอยสุขุมวิท 39',
    };

    it('renders GeneralInfoSection with name, age, gender, blood type', () => {
      renderWithProviders(
        <GeneralInfoSection
          formData={mockFormData}
          onChange={vi.fn()}
        />
      );

      expect(screen.getByDisplayValue('นางสมพร ใจดี')).toBeInTheDocument();
      expect(screen.getByDisplayValue('74')).toBeInTheDocument();
      expect(screen.getByDisplayValue('พร')).toBeInTheDocument();
    });

    it('renders MobilitySection with mobility selector and aids', () => {
      renderWithProviders(
        <MobilitySection
          mobilityLevel={mockFormData.mobilityLevel}
          mobilityAids={mockFormData.mobilityAids}
          onChange={vi.fn()}
        />
      );

      expect(screen.getByLabelText(/ระดับการเคลื่อนไหว|Mobility Level/i)).toBeInTheDocument();
      expect(screen.getByText(/รถเข็นวีลแชร์พับได้|Foldable Wheelchair/i)).toBeInTheDocument();
    });

    it('renders MedicalConditionsSection with conditions pills and medication schedule', () => {
      renderWithProviders(
        <MedicalConditionsSection
          conditions={mockFormData.conditions}
          allergies={mockFormData.allergies}
          medications={mockFormData.medications}
          preferredHospital={mockFormData.preferredHospital}
          hospitalHn={mockFormData.hospitalHn}
          onChange={vi.fn()}
        />
      );

      expect(screen.getByText(/ความดันโลหิตสูง|Hypertension/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue('Amlodipine 5mg')).toBeInTheDocument();
      expect(screen.getByDisplayValue('HN-89234/62')).toBeInTheDocument();
    });

    it('renders PreferencesSection with languages, religion, dietary restrictions', () => {
      renderWithProviders(
        <PreferencesSection
          languages={mockFormData.preferredLanguages}
          religion={mockFormData.religion}
          dietary={mockFormData.dietaryPreferences}
          specialNotes={mockFormData.specialNotes}
          onChange={vi.fn()}
        />
      );

      expect(screen.getByText(/ภาษาไทย \(กลาง\)|Central Thai/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue('คุณยายเดินช้าและใช้วีลแชร์')).toBeInTheDocument();
    });

    it('renders EmergencyContactsSection with guardian and 24/7 contacts', () => {
      renderWithProviders(
        <EmergencyContactsSection
          guardianName="นายธนกร ใจดี"
          guardianPhone="081-987-6543"
          emergencyName="นางสาวดวงใจ ใจดี"
          emergencyPhone="089-999-8888"
          address="128/4 ซอยสุขุมวิท 39"
          onChange={vi.fn()}
        />
      );

      expect(screen.getByDisplayValue('นายธนกร ใจดี')).toBeInTheDocument();
      expect(screen.getByDisplayValue('081-987-6543')).toBeInTheDocument();
      expect(screen.getByDisplayValue('นางสาวดวงใจ ใจดี')).toBeInTheDocument();
      expect(screen.getByDisplayValue('089-999-8888')).toBeInTheDocument();
      expect(screen.getByDisplayValue('128/4 ซอยสุขุมวิท 39')).toBeInTheDocument();
    });
  });

  // ==========================================
  // 4. Full Pages Integration Tests
  // ==========================================
  describe('10. Full Pages Integration & Routing', () => {
    it('renders BookingPage with pre-filled details for caretaker', () => {
      renderWithProviders(
        <Routes>
          <Route path="/book/:id" element={<BookingPage />} />
        </Routes>,
        { initialRoute: '/book/ct-001' }
      );

      expect(screen.getByTestId('page-book')).toBeInTheDocument();
      expect(screen.getByText(/สรุปข้อมูลการจอง|Booking Summary/i)).toBeInTheDocument();
    });

    it('renders MyBookingsPage with tabs and booking cards', () => {
      renderWithProviders(
        <Routes>
          <Route path="/bookings" element={<MyBookingsPage />} />
        </Routes>,
        { initialRoute: '/bookings' }
      );

      expect(screen.getByTestId('page-bookings')).toBeInTheDocument();
      expect(screen.getAllByRole('tab').length).toBe(2);
    });

    it('renders ElderProfilePage with form and save CTA', async () => {
      const user = userEvent.setup();
      renderWithProviders(
        <Routes>
          <Route path="/elder-profile" element={<ElderProfilePage />} />
        </Routes>,
        { initialRoute: '/elder-profile' }
      );

      expect(screen.getByTestId('page-elder')).toBeInTheDocument();
      const saveBtn = screen.getByRole('button', { name: /บันทึกข้อมูล|Save Profile/i });
      await user.click(saveBtn);
      expect(await screen.findByText(/บันทึกข้อมูลสำเร็จ|Profile updated|Success/i)).toBeInTheDocument();
    });
  });
});
