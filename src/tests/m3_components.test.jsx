import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import { LanguageProvider } from '../context/LanguageContext';
import { AppProvider } from '../context/AppContext';

// Pages
import MatchResultsPage from '../pages/MatchResultsPage';
import CaretakerProfilePage from '../pages/CaretakerProfilePage';

// Components
import { MatchSummaryHeader } from '../components/matches/MatchSummaryHeader';
import { CaretakerMatchCard } from '../components/matches/CaretakerMatchCard';
import { CaretakerWaveHero } from '../components/caretaker/CaretakerWaveHero';
import { TrustBadges } from '../components/caretaker/TrustBadges';
import { CaretakerBio } from '../components/caretaker/CaretakerBio';
import { CaretakerStats } from '../components/caretaker/CaretakerStats';
import { AvailabilityCalendar } from '../components/caretaker/AvailabilityCalendar';
import { CaretakerReviews } from '../components/caretaker/CaretakerReviews';
import { StickyBookingBar } from '../components/caretaker/StickyBookingBar';

// Mock caretaker fixture
const mockCaretaker = {
  id: 'ct-001',
  name: { th: 'สมชาย ประเสริฐ', en: 'Somchai Prasert' },
  nickname: { th: 'สมชาย', en: 'Somchai' },
  gender: 'male',
  age: 34,
  photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
  matchScore: 96,
  isBestMatch: true,
  tier: 'specialist',
  tierName: {
    th: 'ผู้เชี่ยวชาญพาพบแพทย์และประสานงาน รพ.',
    en: 'Hospital Medical Escort Specialist',
  },
  hourlyRate: 350,
  rating: 4.95,
  reviewsCount: 58,
  completedTrips: 142,
  experienceYears: 6,
  verifiedBadges: [
    'criminal_record_checked',
    'certified_caregiver',
    'cpr_first_aid',
    'hospital_escort_trained',
  ],
  specialties: [
    { th: 'พาพบแพทย์ & ประสานงานโรงพยาบาล', en: 'Hospital Escort & OPD Coordination' },
    { th: 'ช่วยเหลือผู้ใช้วีลแชร์และพยุงเดิน', en: 'Wheelchair Handling & Mobility Support' },
  ],
  languages: [
    { th: 'ภาษาไทย (กลาง)', en: 'Central Thai' },
    { th: 'ภาษาอังกฤษ (สื่อสารได้)', en: 'English (Conversational)' },
  ],
  education: {
    th: 'ประกาศนียบัตรผู้ช่วยพยาบาล (PN) วิทยาลัยพยาบาลสภากาชาดไทย',
    en: 'Practical Nursing Certificate (PN), Red Cross Nursing College',
  },
  vehicle: {
    type: 'sedan',
    th: 'รถเก๋งส่วนบุคคล สะอาด นุ่มนวล มีพื้นที่เก็บวีลแชร์ท้ายรถ',
    en: 'Clean private sedan with trunk capacity for foldable wheelchair',
  },
  serviceAreas: [
    { th: 'ปทุมวัน, สุขุมวิท, บางรัก, สาทร', en: 'Pathum Wan, Sukhumvit, Bang Rak, Sathorn' },
  ],
  bio: {
    th: 'อดีตผู้ช่วยพยาบาลวิชาชีพ ประสบการณ์ดูแลผู้สูงอายุและพาพบแพทย์กว่า 6 ปี',
    en: 'Former practical nurse with 6+ years of experience in elderly hospital escort.',
  },
  availableSlots: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  reviews: [
    {
      id: 'rev-101',
      reviewerName: 'ธนกร ใจดี',
      relationship: { th: 'บุตรชาย', en: 'Son' },
      rating: 5.0,
      date: '2026-08-14',
      comment: {
        th: 'คุณสมชายดูแลคุณแม่ดีมากครับ ประสานงานห้องตรวจ รพ.ศิริราช รวดเร็วมาก',
        en: 'Somchai was exceptional with mom at Siriraj Hospital OPD.',
      },
    },
    {
      id: 'rev-102',
      reviewerName: 'พญ. วรรณภา',
      relationship: { th: 'บุตรสาว', en: 'Daughter' },
      rating: 4.9,
      date: '2026-08-10',
      comment: {
        th: 'บริการดีมาก สุภาพ ตรงต่อเวลา',
        en: 'Great service, polite and very punctual.',
      },
    },
  ],
};

const renderWithProviders = (ui, { initialRoute = '/', language = 'th' } = {}) => {
  if (language) {
    localStorage.setItem('looklarn_lang', language);
  }
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <LanguageProvider>
        <AppProvider>
          {ui}
        </AppProvider>
      </LanguageProvider>
    </MemoryRouter>
  );
};

describe('Milestone M3: Match Results & Caretaker Profile Comprehensive Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  // ==========================================
  // 1. MatchResultsPage Integration
  // ==========================================
  describe('MatchResultsPage', () => {
    it('renders with testid page-matches and shows top 3 matched candidates', () => {
      renderWithProviders(<MatchResultsPage />, { initialRoute: '/matches' });
      expect(screen.getByTestId('page-matches')).toBeInTheDocument();
      expect(screen.getByText(/96%/i)).toBeInTheDocument();
      expect(screen.getByText(/88%/i)).toBeInTheDocument();
      expect(screen.getByText(/81%/i)).toBeInTheDocument();
    });

    it('highlights #1 Best Match badge on top candidate', () => {
      renderWithProviders(<MatchResultsPage />, { initialRoute: '/matches' });
      expect(screen.getByText(/แนะนำสูงสุด|แมตช์อันดับ 1|Best Match/i)).toBeInTheDocument();
    });

    it('allows dynamic sorting by rating and price', async () => {
      const user = userEvent.setup();
      renderWithProviders(<MatchResultsPage />, { initialRoute: '/matches' });

      const sortRatingBtn = screen.getByRole('button', { name: /คะแนนรีวิว|Rating/i });
      await user.click(sortRatingBtn);

      const sortPriceBtn = screen.getByRole('button', { name: /ราคา \(ต่ำไปสูง\)|Price \(Low to High\)/i });
      await user.click(sortPriceBtn);
      expect(screen.getByTestId('page-matches')).toBeInTheDocument();
    });

    it('renders trust and safety guarantee banner at bottom', () => {
      renderWithProviders(<MatchResultsPage />, { initialRoute: '/matches' });
      expect(screen.getByText(/ตรวจสอบประวัติอาชญากรรม 100%|100% Criminal Background/i)).toBeInTheDocument();
      expect(screen.getByText(/ผ่านการฝึกอบรม CPR|CPR & First Aid/i)).toBeInTheDocument();
    });
  });

  // ==========================================
  // 2. MatchSummaryHeader Component
  // ==========================================
  describe('MatchSummaryHeader', () => {
    it('displays search summary pill with activity, date, mobility, and budget', () => {
      renderWithProviders(
        <MatchSummaryHeader
          searchCriteria={{
            activityType: 'hospital',
            date: '2026-08-28',
            durationHours: 4,
            mobility: 'wheelchair_assisted',
            budgetMax: 500,
          }}
          sortBy="matchScore"
          onSortChange={vi.fn()}
          totalMatches={3}
        />
      );

      expect(screen.getByText(/พาไปโรงพยาบาล|Hospital/i)).toBeInTheDocument();
      expect(screen.getByText(/ใช้วีลแชร์|Wheelchair/i)).toBeInTheDocument();
      expect(screen.getByText(/฿500/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /ปรับแต่งเงื่อนไขการค้นหา|Refine/i })).toHaveAttribute('href', '/find');
    });

    it('triggers onSortChange when clicking sort tabs', async () => {
      const user = userEvent.setup();
      const handleSort = vi.fn();
      renderWithProviders(
        <MatchSummaryHeader
          searchCriteria={{}}
          sortBy="matchScore"
          onSortChange={handleSort}
          totalMatches={3}
        />
      );

      const ratingBtn = screen.getByRole('button', { name: /คะแนนรีวิว|Rating/i });
      await user.click(ratingBtn);
      expect(handleSort).toHaveBeenCalledWith('rating');
    });
  });

  // ==========================================
  // 3. CaretakerMatchCard Component
  // ==========================================
  describe('CaretakerMatchCard', () => {
    it('renders caretaker details, score ring, hourly rate, and navigation buttons', () => {
      renderWithProviders(
        <CaretakerMatchCard
          caretaker={mockCaretaker}
          isTopMatch={true}
          rank={1}
        />
      );

      expect(screen.getByText('96%')).toBeInTheDocument();
      expect(screen.getByText(/สมชาย ประเสริฐ/i)).toBeInTheDocument();
      expect(screen.getByText(/฿350/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /ดูโปรไฟล์|View Profile/i })).toHaveAttribute('href', '/caretaker/ct-001');
      expect(screen.getByRole('link', { name: /จองทันที|Book Now/i })).toHaveAttribute('href', '/book/ct-001');
    });

    it('renders specialty badges with checkmarks', () => {
      renderWithProviders(
        <CaretakerMatchCard
          caretaker={mockCaretaker}
          isTopMatch={false}
          rank={2}
        />
      );

      expect(screen.getByText(/พาพบแพทย์ & ประสานงานโรงพยาบาล/i)).toBeInTheDocument();
      expect(screen.getByText(/ช่วยเหลือผู้ใช้วีลแชร์และพยุงเดิน/i)).toBeInTheDocument();
    });
  });

  // ==========================================
  // 4. CaretakerProfilePage Integration
  // ==========================================
  describe('CaretakerProfilePage', () => {
    it('renders full profile detail for valid caretaker id', () => {
      render(
        <MemoryRouter initialEntries={['/caretaker/ct-001']}>
          <LanguageProvider>
            <AppProvider>
              <Routes>
                <Route path="/caretaker/:id" element={<CaretakerProfilePage />} />
              </Routes>
            </AppProvider>
          </LanguageProvider>
        </MemoryRouter>
      );

      expect(screen.getByTestId('page-caretaker')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByText(/96%/i)).toBeInTheDocument();
      expect(screen.getByText(/เกี่ยวกับผู้ดูแล|About/i)).toBeInTheDocument();
      expect(screen.getByText(/ตารางเวลาที่ว่างและปฏิทิน|Availability/i)).toBeInTheDocument();
    });

    it('renders graceful 404 fallback for invalid caretaker id', () => {
      render(
        <MemoryRouter initialEntries={['/caretaker/non-existent-id']}>
          <LanguageProvider>
            <AppProvider>
              <Routes>
                <Route path="/caretaker/:id" element={<CaretakerProfilePage />} />
              </Routes>
            </AppProvider>
          </LanguageProvider>
        </MemoryRouter>
      );

      expect(screen.getByText(/ไม่พบผู้ดูแลที่ต้องการ|Caretaker Not Found/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /กลับสู่ผลการจับคู่|Back/i })).toHaveAttribute('href', '/matches');
    });
  });

  // ==========================================
  // 5. CaretakerWaveHero Component
  // ==========================================
  describe('CaretakerWaveHero', () => {
    it('renders wave hero with avatar, name, rating, and AI match score', () => {
      renderWithProviders(<CaretakerWaveHero caretaker={mockCaretaker} />);
      expect(screen.getByRole('heading', { level: 1, name: /สมชาย ประเสริฐ/i })).toBeInTheDocument();
      expect(screen.getByText('96%')).toBeInTheDocument();
      expect(screen.getByText(/AI Matching Score/i)).toBeInTheDocument();
    });

    it('handles share button click and copies URL', async () => {
      const user = userEvent.setup();
      const writeTextMock = vi.fn().mockResolvedValue();
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        writable: true,
        configurable: true,
      });

      renderWithProviders(<CaretakerWaveHero caretaker={mockCaretaker} />);
      const shareBtn = screen.getByRole('button', { name: /แชร์โปรไฟล์|Share Profile/i });
      await user.click(shareBtn);

      expect(writeTextMock).toHaveBeenCalled();
      expect(await screen.findByText(/คัดลอกลิงก์โปรไฟล์แล้ว!|copied/i)).toBeInTheDocument();
    });
  });

  // ==========================================
  // 6. TrustBadges Component
  // ==========================================
  describe('TrustBadges', () => {
    it('renders all 4 safety & credential badges', () => {
      renderWithProviders(<TrustBadges />);
      expect(screen.getByText(/ผ่านการตรวจสอบประวัติอาชญากรรม|Criminal Background/i)).toBeInTheDocument();
      expect(screen.getByText(/ผ่านการอบรมปฐมพยาบาล CPR|CPR & First Aid/i)).toBeInTheDocument();
      expect(screen.getByText(/ผ่านการรับรองมาตรฐานผู้ดูแลผู้สูงอายุ|Elderly Caregiver/i)).toBeInTheDocument();
      expect(screen.getByText(/ยืนยันตัวตนด้วยบัตรประชาชน|National ID/i)).toBeInTheDocument();
    });
  });

  // ==========================================
  // 7. CaretakerBio Component
  // ==========================================
  describe('CaretakerBio', () => {
    it('renders bio summary, languages, education, vehicle, and service areas', () => {
      renderWithProviders(<CaretakerBio caretaker={mockCaretaker} />);
      expect(screen.getByText(/อดีตผู้ช่วยพยาบาลวิชาชีพ ประสบการณ์ดูแลผู้สูงอายุ/i)).toBeInTheDocument();
      expect(screen.getByText(/ภาษาไทย \(กลาง\)/i)).toBeInTheDocument();
      expect(screen.getByText(/วิทยาลัยพยาบาลสภากาชาดไทย/i)).toBeInTheDocument();
      expect(screen.getByText(/รถเก๋งส่วนบุคคล สะอาด นุ่มนวล/i)).toBeInTheDocument();
      expect(screen.getByText(/ปทุมวัน, สุขุมวิท, บางรัก, สาทร/i)).toBeInTheDocument();
    });
  });

  // ==========================================
  // 8. CaretakerStats Component
  // ==========================================
  describe('CaretakerStats', () => {
    it('renders 4 performance metrics cards', () => {
      renderWithProviders(<CaretakerStats caretaker={mockCaretaker} />);
      expect(screen.getByText(/6 ปี|6 Years/i)).toBeInTheDocument();
      expect(screen.getByText(/142\+ ครั้ง|142\+ Trips/i)).toBeInTheDocument();
      expect(screen.getByText(/4.95 \/ 5.0/i)).toBeInTheDocument();
      expect(screen.getByText(/100% \(ภายใน 15 นาที\)|100% \(within 15 mins\)/i)).toBeInTheDocument();
    });
  });

  // ==========================================
  // 9. AvailabilityCalendar Component
  // ==========================================
  describe('AvailabilityCalendar', () => {
    it('renders month navigation and allows switching between Aug and Sep 2026', async () => {
      const user = userEvent.setup();
      renderWithProviders(<AvailabilityCalendar caretaker={mockCaretaker} />);

      expect(screen.getByText(/สิงหาคม 2569|August 2026/i)).toBeInTheDocument();

      const nextMonthBtn = screen.getByRole('button', { name: /Next Month/i });
      await user.click(nextMonthBtn);
      expect(screen.getByText(/กันยายน 2569|September 2026/i)).toBeInTheDocument();

      const prevMonthBtn = screen.getByRole('button', { name: /Previous Month/i });
      await user.click(prevMonthBtn);
      expect(screen.getByText(/สิงหาคม 2569|August 2026/i)).toBeInTheDocument();
    });

    it('allows selecting available dates and time slots', async () => {
      const user = userEvent.setup();
      const handleSelectDate = vi.fn();
      const handleSelectSlot = vi.fn();

      renderWithProviders(
        <AvailabilityCalendar
          caretaker={mockCaretaker}
          onSelectDate={handleSelectDate}
          onSelectTimeSlot={handleSelectSlot}
        />
      );

      // Click an available day (e.g. day 15)
      const day15Btn = screen.getByRole('button', { name: /^15$/ });
      await user.click(day15Btn);
      expect(handleSelectDate).toHaveBeenCalledWith('2026-08-15');

      // Click Afternoon slot
      const afternoonBtn = screen.getByRole('button', { name: /ช่วงบ่าย|Afternoon/i });
      await user.click(afternoonBtn);
      expect(handleSelectSlot).toHaveBeenCalledWith('afternoon');
    });
  });

  // ==========================================
  // 10. CaretakerReviews Component
  // ==========================================
  describe('CaretakerReviews', () => {
    it('renders star rating summary, percentage bars, and guardian review cards', () => {
      renderWithProviders(
        <CaretakerReviews
          reviews={mockCaretaker.reviews}
          rating={mockCaretaker.rating}
          reviewsCount={mockCaretaker.reviewsCount}
        />
      );

      expect(screen.getByText('4.95')).toBeInTheDocument();
      expect(screen.getByText(/ธนกร ใจดี/i)).toBeInTheDocument();
      expect(screen.getByText(/คุณสมชายดูแลคุณแม่ดีมากครับ/i)).toBeInTheDocument();
      expect(screen.getAllByText(/ยืนยันการใช้บริการจริง|Verified Outing/i).length).toBeGreaterThan(0);
    });

    it('supports filter chips for reviews', async () => {
      const user = userEvent.setup();
      renderWithProviders(
        <CaretakerReviews
          reviews={mockCaretaker.reviews}
          rating={mockCaretaker.rating}
          reviewsCount={mockCaretaker.reviewsCount}
        />
      );

      const filter5Star = screen.getByRole('button', { name: /5 ดาว|5 Stars/i });
      await user.click(filter5Star);
      expect(screen.getByText(/ธนกร ใจดี/i)).toBeInTheDocument();
    });
  });

  // ==========================================
  // 11. StickyBookingBar Component
  // ==========================================
  describe('StickyBookingBar', () => {
    it('renders fixed bottom bar with caretaker info, rate, and Book link', () => {
      renderWithProviders(<StickyBookingBar caretaker={mockCaretaker} />);

      expect(screen.getByText(/สมชาย ประเสริฐ/i)).toBeInTheDocument();
      expect(screen.getByText('฿350')).toBeInTheDocument();
      const bookLink = screen.getByRole('link', { name: /จองผู้ดูแลคนนี้|Book This Caretaker/i });
      expect(bookLink).toHaveAttribute('href', '/book/ct-001');
    });
  });

  // ==========================================
  // 12. Bilingual Toggle & Pure Translations
  // ==========================================
  describe('Bilingual i18n Fidelity in M3', () => {
    it('renders all M3 components in English when language is EN', () => {
      renderWithProviders(<MatchResultsPage />, { initialRoute: '/matches', language: 'en' });

      expect(screen.getByText(/Your Top Matched Caretakers/i)).toBeInTheDocument();
      expect(screen.getByText(/AI Matching Completed/i)).toBeInTheDocument();
      expect(screen.getAllByRole('link', { name: /View Profile/i }).length).toBe(3);
      expect(screen.getAllByRole('link', { name: /Book Now/i }).length).toBe(3);
    });
  });
});
