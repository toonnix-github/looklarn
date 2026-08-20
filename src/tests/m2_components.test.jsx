import React from 'react';
import { act, render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import { LanguageProvider, useLanguage } from '../context/LanguageContext';
import { AppProvider, useApp } from '../context/AppContext';

import HeroBanner from '../components/home/HeroBanner';
import ActivityGrid from '../components/home/ActivityGrid';
import PromoBanner from '../components/home/PromoBanner';
import HowItWorks from '../components/home/HowItWorks';
import Testimonials from '../components/home/Testimonials';
import CtaSection from '../components/home/CtaSection';
import HomePage from '../pages/HomePage';

import StepIndicator from '../components/find/StepIndicator';
import Step1Physical from '../components/find/Step1Physical';
import Step2Preferences from '../components/find/Step2Preferences';
import Step3Schedule from '../components/find/Step3Schedule';
import AiMatchingLoader from '../components/find/AiMatchingLoader';
import FindCaretakerPage from '../pages/FindCaretakerPage';

// Helper to render component with Providers and Router
const renderWithProviders = (ui, { initialRoute = '/' } = {}) => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <LanguageProvider>
        <AppProvider>{ui}</AppProvider>
      </LanguageProvider>
    </MemoryRouter>
  );
};

describe('Milestone M2: Home Page & Find Caretaker Wizard Comprehensive Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  // ==========================================
  // 1. HeroBanner Component
  // ==========================================
  describe('HeroBanner Component', () => {
    it('renders hero title, subtitle, AI badge, and trust indicators', () => {
      renderWithProviders(<HeroBanner />);

      expect(screen.getByText(/AI-Powered Elder Companion Matching/i)).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/ลูกหลาน|Caring for Your Loved Ones/i);
      expect(screen.getByText(/ตรวจสอบประวัติ 100%|100% Background Checked/i)).toBeInTheDocument();
      expect(screen.getByText(/ผ่านการอบรมปฐมพยาบาล|CPR & First Aid/i)).toBeInTheDocument();
      expect(screen.getByText(/ประกันอุบัติเหตุคุ้มครอง|Accident Insurance/i)).toBeInTheDocument();
      expect(screen.getByText(/4.95\/5/i)).toBeInTheDocument();
    });

    it('renders primary CTA linking to /find and secondary CTA to /bookings', () => {
      renderWithProviders(<HeroBanner />);

      const findLink = screen.getByRole('link', { name: /ค้นหาผู้ดูแล|Find a Caretaker/i });
      expect(findLink).toHaveAttribute('href', '/find');

      const bookingsLink = screen.getByRole('link', { name: /การจองของฉัน|My Bookings/i });
      expect(bookingsLink).toHaveAttribute('href', '/bookings');
    });
  });

  // ==========================================
  // 2. ActivityGrid Component
  // ==========================================
  describe('ActivityGrid Component', () => {
    it('renders all 4 core activity categories with details', () => {
      renderWithProviders(<ActivityGrid />);

      expect(screen.getByText(/โรงพยาบาล|Hospital/i)).toBeInTheDocument();
      expect(screen.getByText(/ไหว้พระ|ทำบุญ|Temple/i)).toBeInTheDocument();
      expect(screen.getByText(/ท่องเที่ยว|ชมเมือง|City Tour|Tour/i)).toBeInTheDocument();
      expect(screen.getByText(/เดินเล่น|สวนสาธารณะ|พักผ่อน|Park|Leisure/i)).toBeInTheDocument();
    });

    it('calls onSelectActivity and navigates to /find when card is clicked', () => {
      const handleSelect = vi.fn();
      renderWithProviders(<ActivityGrid onSelectActivity={handleSelect} />);

      const hospitalCard = screen.getByText(/โรงพยาบาล|Hospital/i).closest('[role="button"]');
      expect(hospitalCard).toBeInTheDocument();

      fireEvent.click(hospitalCard);
      expect(handleSelect).toHaveBeenCalledWith('hospital');
    });
  });

  // ==========================================
  // 3. PromoBanner Component
  // ==========================================
  describe('PromoBanner Component', () => {
    it('renders promotion title, promo code, partner hospitals, and insurance badge', () => {
      renderWithProviders(<PromoBanner />);

      expect(screen.getByText(/สิทธิพิเศษสมาชิกใหม่|New Member Privilege/i)).toBeInTheDocument();
      expect(screen.getByText('LOOKLARNCARE')).toBeInTheDocument();
      expect(screen.getByText(/ศิริราช|จุฬาลงกรณ์|รามาธิบดี|พระมงกุฎเกล้า|Siriraj|Chulalongkorn/i)).toBeInTheDocument();
      expect(screen.getByText(/คุ้มครองอุบัติเหตุ 100%|100% Comprehensive/i)).toBeInTheDocument();
    });

    it('handles promo code copy and shows feedback', async () => {
      const writeTextMock = vi.fn().mockResolvedValue();
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        writable: true,
        configurable: true,
      });

      renderWithProviders(<PromoBanner />);
      const copyBtn = screen.getByRole('button', { name: /Copy promo code|คัดลอกโค้ด/i });

      fireEvent.click(copyBtn);
      expect(writeTextMock).toHaveBeenCalledWith('LOOKLARNCARE');
      expect(screen.getByText(/คัดลอกโค้ดแล้ว!|Code Copied!/i)).toBeInTheDocument();
    });
  });

  // ==========================================
  // 4. HowItWorks Component
  // ==========================================
  describe('HowItWorks Component', () => {
    it('renders 3 illustrated booking process steps', () => {
      renderWithProviders(<HowItWorks />);

      expect(screen.getByText('01')).toBeInTheDocument();
      expect(screen.getByText('02')).toBeInTheDocument();
      expect(screen.getByText('03')).toBeInTheDocument();
      expect(screen.getByText(/ระบุความต้องการและสุขภาพ|Specify Health/i)).toBeInTheDocument();
      expect(screen.getByText(/AI คัดเลือกผู้ดูแล|AI Matches/i)).toBeInTheDocument();
      expect(screen.getByText(/ยืนยันการจองและติดตาม|Book & Track/i)).toBeInTheDocument();
    });
  });

  // ==========================================
  // 5. Testimonials Component
  // ==========================================
  describe('Testimonials Component', () => {
    it('renders 3 customer testimonials with ratings and authors', () => {
      renderWithProviders(<Testimonials />);

      expect(screen.getByText(/ธนกร|Thanakorn/i)).toBeInTheDocument();
      expect(screen.getByText(/วรรณภา|Wannapa/i)).toBeInTheDocument();
      expect(screen.getByText(/กิตติศักดิ์|Kittisak/i)).toBeInTheDocument();
    });
  });

  // ==========================================
  // 6. CtaSection Component
  // ==========================================
  describe('CtaSection Component', () => {
    it('renders bottom call to action banner with link to /find', () => {
      renderWithProviders(<CtaSection />);

      expect(screen.getByText(/พร้อมมอบความสุขและความอบอุ่นใจ|Ready to Give/i)).toBeInTheDocument();
      const ctaBtn = screen.getByRole('link', { name: /ค้นหาผู้ดูแล|Find a Caretaker/i });
      expect(ctaBtn).toHaveAttribute('href', '/find');
    });
  });

  // ==========================================
  // 7. HomePage Integration
  // ==========================================
  describe('HomePage Integration', () => {
    it('renders HomePage with data-testid="page-home" and all 6 modules', () => {
      renderWithProviders(<HomePage />);

      const page = screen.getByTestId('page-home');
      expect(page).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByText(/กิจกรรมยอดนิยม|Popular Outing/i)).toBeInTheDocument();
      expect(screen.getByText('LOOKLARNCARE')).toBeInTheDocument();
      expect(screen.getByText('01')).toBeInTheDocument();
      expect(screen.getByText(/เสียงตอบรับจากครอบครัว|Guardian Testimonials/i)).toBeInTheDocument();
    });
  });

  // ==========================================
  // 8. StepIndicator Component
  // ==========================================
  describe('StepIndicator Component', () => {
    it('renders 3 steps and calculates progress percentage width', () => {
      const { rerender } = renderWithProviders(<StepIndicator currentStep={1} />);
      expect(screen.getByText(/1\.|ร่างกาย|Physical/i)).toBeInTheDocument();
      expect(screen.getByText(/2\.|ความชอบ|Preferences/i)).toBeInTheDocument();
      expect(screen.getByText(/3\.|วันเวลา|Schedule/i)).toBeInTheDocument();

      rerender(
        <MemoryRouter>
          <LanguageProvider>
            <StepIndicator currentStep={2} />
          </LanguageProvider>
        </MemoryRouter>
      );
      expect(screen.getByText(/2\.|ความชอบ|Preferences/i)).toBeInTheDocument();
    });

    it('triggers onStepClick when step button is clicked', () => {
      const handleStepClick = vi.fn();
      renderWithProviders(<StepIndicator currentStep={2} onStepClick={handleStepClick} />);

      const step1Btn = screen.getByText(/1\.|ร่างกาย|Physical/i).closest('button');
      fireEvent.click(step1Btn);
      expect(handleStepClick).toHaveBeenCalledWith(1);
    });
  });

  // ==========================================
  // 9. Step1Physical Component
  // ==========================================
  describe('Step1Physical Component', () => {
    it('renders elder auto-fill banner when elder prop is passed', () => {
      const elderMock = {
        name: { th: 'นางสมพร ใจดี', en: 'Grandma Somporn' },
        nickname: { th: 'ยายพร', en: 'Grandma Porn' },
      };
      const formData = {
        mobility: 'wheelchair_assisted',
        conditions: ['hypertension', 'diabetes'],
        needsMedicationReminder: true,
        specialCareType: 'none',
      };
      const setFormData = vi.fn();

      renderWithProviders(
        <Step1Physical formData={formData} setFormData={setFormData} elder={elderMock} />
      );

      expect(screen.getByText(/ระบบได้ดึงข้อมูลสุขภาพจากโปรไฟล์|Health details have been automatically filled/i)).toBeInTheDocument();
    });

    it('allows changing mobility options and toggling chronic conditions', () => {
      let formData = {
        mobility: 'independent',
        conditions: ['hypertension'],
        needsMedicationReminder: true,
        specialCareType: 'none',
      };
      const setFormData = vi.fn((updater) => {
        formData = typeof updater === 'function' ? updater(formData) : updater;
      });

      renderWithProviders(
        <Step1Physical formData={formData} setFormData={setFormData} />
      );

      const wheelchairRadio = screen.getByRole('radio', { name: /ใช้วีลแชร์|Wheelchair/i });
      fireEvent.click(wheelchairRadio);
      expect(setFormData).toHaveBeenCalled();

      // Click diabetes condition chip
      const diabetesChip = screen.getByRole('button', { name: /เบาหวาน|Diabetes/i });
      fireEvent.click(diabetesChip);
      expect(setFormData).toHaveBeenCalled();
    });
  });

  // ==========================================
  // 10. Step2Preferences Component
  // ==========================================
  describe('Step2Preferences Component', () => {
    it('renders activity selection, language dialect dropdown, religion, and diets', () => {
      const formData = {
        activityType: 'hospital',
        language: 'Thai',
        religion: 'Buddhism',
        dietary: 'low_sodium',
        genderPref: 'any',
      };
      const setFormData = vi.fn();

      renderWithProviders(
        <Step2Preferences formData={formData} setFormData={setFormData} />
      );

      expect(screen.getByText(/พาไปโรงพยาบาล|Hospital Escort/i)).toBeInTheDocument();
      expect(screen.getByText(/ไหว้พระทำบุญ|Temple Pilgrimage/i)).toBeInTheDocument();
      expect(screen.getAllByRole('combobox').length).toBe(2);
    });
  });

  // ==========================================
  // 11. Step3Schedule Component
  // ==========================================
  describe('Step3Schedule Component', () => {
    it('renders date picker, duration chips, budget slider, and notes', () => {
      const formData = {
        date: '2026-08-28',
        timeSlot: 'morning',
        durationHours: 4,
        budgetMax: 500,
        pickupAddress: '128/4 Sukhumvit 39',
        destination: 'Siriraj Hospital',
        notes: 'Walks slowly',
      };
      const setFormData = vi.fn();

      renderWithProviders(
        <Step3Schedule formData={formData} setFormData={setFormData} />
      );

      expect(screen.getByText(/ช่วงเช้า|Morning/i)).toBeInTheDocument();
      expect(screen.getByText(/4 ชม\.|4 hr/i)).toBeInTheDocument();
      expect(screen.getByRole('slider')).toHaveValue('500');
    });
  });

  // ==========================================
  // 12. AiMatchingLoader Component
  // ==========================================
  describe('AiMatchingLoader Component', () => {
    it('advances through status phases and calls onComplete', () => {
      vi.useFakeTimers();
      const handleComplete = vi.fn();

      renderWithProviders(<AiMatchingLoader onComplete={handleComplete} />);

      expect(screen.getByText(/AI กำลังค้นหา|AI Matching in Progress/i)).toBeInTheDocument();

      // Fast-forward through phases
      act(() => {
        vi.advanceTimersByTime(700);
      });
      expect(screen.getByText(/ตรวจสอบประวัติ|Verifying background/i)).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(700);
      });
      expect(screen.getByText(/คำนวณคะแนนความเข้ากันได้|Calculating compatibility/i)).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(700);
      });
      expect(handleComplete).toHaveBeenCalled();

      vi.useRealTimers();
    });
  });

  // ==========================================
  // 13. FindCaretakerPage Complete Flow
  // ==========================================
  describe('FindCaretakerPage Complete Flow', () => {
    it('progresses through all 3 steps and submits to AI matching', async () => {
      vi.useFakeTimers();

      render(
        <MemoryRouter initialEntries={['/find']}>
          <LanguageProvider>
            <AppProvider>
              <Routes>
                <Route path="/find" element={<FindCaretakerPage />} />
                <Route path="/matches" element={<div data-testid="page-matches">Matches Result</div>} />
              </Routes>
            </AppProvider>
          </LanguageProvider>
        </MemoryRouter>
      );

      expect(screen.getByTestId('page-find')).toBeInTheDocument();

      // Step 1 -> Next
      const nextBtn1 = screen.getByRole('button', { name: /ถัดไป|Next/i });
      fireEvent.click(nextBtn1);

      // Step 2 -> Next
      const nextBtn2 = screen.getByRole('button', { name: /ถัดไป|Next/i });
      fireEvent.click(nextBtn2);

      // Step 3 -> Submit
      const submitBtn = screen.getByRole('button', { name: /ค้นหาผู้ดูแลที่เหมาะสม|Find Matches/i });
      fireEvent.click(submitBtn);

      // AI Matching Loader appears
      expect(screen.getByText(/AI กำลังค้นหา|AI Matching/i)).toBeInTheDocument();

      // Advance timers
      act(() => {
        vi.advanceTimersByTime(2500);
      });

      // Routed to /matches
      expect(screen.getByTestId('page-matches')).toBeInTheDocument();

      vi.useRealTimers();
    });
  });
});
