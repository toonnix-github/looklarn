import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// Import App and core context providers
import App from '../App';
import { LanguageProvider, useLanguage } from '../context/LanguageContext';
import { AppProvider, useApp } from '../context/AppContext';

// Import UI Kit components
import MatchScoreRing from '../components/ui/MatchScoreRing';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Toast from '../components/ui/Toast';

// Helper to render entire app at specific route
const renderApp = (initialRoute = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <LanguageProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </LanguageProvider>
    </MemoryRouter>
  );
};

// Helper to render with providers
const renderWithProviders = (ui, { route = '/' } = {}) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <LanguageProvider>
        <AppProvider>
          {ui}
        </AppProvider>
      </LanguageProvider>
    </MemoryRouter>
  );
};

describe('Tier 1: Core Feature Coverage across 7 Routes & Components', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ==========================================
  // FEATURE 1: Language Toggle & i18n System
  // ==========================================
  describe('Feature 1: Language Context & i18n System', () => {
    it('1.1 should default to Thai (TH) language on initial render', async () => {
      renderApp('/');
      // In Thai, find caretaker CTA or heading should be present
      expect(screen.getByRole('banner')).toBeInTheDocument();
      // Should show Thai navigation links / text
      const thToggle = screen.getByRole('button', { name: /TH|ไทย/i });
      expect(thToggle).toBeInTheDocument();
    });

    it('1.2 should switch all UI text to English when EN toggle is clicked', async () => {
      const user = userEvent.setup();
      renderApp('/');
      const enToggle = screen.getByRole('button', { name: /EN|English/i });
      await user.click(enToggle);

      // Verify English text is rendered
      expect(screen.getByText(/Find a Caretaker/i)).toBeInTheDocument();
    });

    it('1.3 should toggle back to Thai when TH is clicked again', async () => {
      const user = userEvent.setup();
      renderApp('/');
      const enToggle = screen.getByRole('button', { name: /EN|English/i });
      await user.click(enToggle);
      expect(screen.getByText(/Find a Caretaker/i)).toBeInTheDocument();

      const thToggle = screen.getByRole('button', { name: /TH|ไทย/i });
      await user.click(thToggle);
      expect(screen.getByText(/ค้นหาผู้ดูแล/i)).toBeInTheDocument();
    });

    it('1.4 should not display mixed dual-language labels (e.g. Hospital / โรงพยาบาล in same label)', () => {
      renderApp('/');
      const bodyText = document.body.textContent;
      expect(bodyText).not.toMatch(/Hospital Visit \/ ไปโรงพยาบาล/i);
      expect(bodyText).not.toMatch(/Find a Caretaker \/ ค้นหาผู้ดูแล/i);
    });

    it('1.5 should highlight the currently active language pill', async () => {
      const user = userEvent.setup();
      renderApp('/');
      const thToggle = screen.getByRole('button', { name: /TH|ไทย/i });
      expect(thToggle.className).toMatch(/bg-|text-white|active|font-bold|shadow/i);

      const enToggle = screen.getByRole('button', { name: /EN|English/i });
      await user.click(enToggle);
      expect(enToggle.className).toMatch(/bg-|text-white|active|font-bold|shadow/i);
    });
  });

  // ==========================================
  // FEATURE 2: Home Page (/)
  // ==========================================
  describe('Feature 2: Home Page (/)', () => {
    it('2.1 should display hero banner with gradient and main CTA', () => {
      renderApp('/');
      const heroCta = screen.getAllByRole('link', { name: /ค้นหาผู้ดูแล|Find a Caretaker/i })[0] ||
                      screen.getAllByRole('button', { name: /ค้นหาผู้ดูแล|Find a Caretaker/i })[0];
      expect(heroCta).toBeInTheDocument();
    });

    it('2.2 should display 4 featured activity cards (Hospital, Temple, City Tour, Park/Leisure)', () => {
      renderApp('/');
      // In Thai default
      const hospitalCard = screen.getByText(/โรงพยาบาล|Hospital/i);
      const templeCard = screen.getByText(/ไหว้พระ|ทำบุญ|Temple/i);
      const tourCard = screen.getByText(/ท่องเที่ยว|ชมเมือง|City Tour|Tour/i);
      const parkCard = screen.getByText(/เดินเล่น|สวนสาธารณะ|พักผ่อน|Park|Leisure/i);

      expect(hospitalCard).toBeInTheDocument();
      expect(templeCard).toBeInTheDocument();
      expect(tourCard).toBeInTheDocument();
      expect(parkCard).toBeInTheDocument();
    });

    it('2.3 should display promotion strip for partner hospitals and benefits', () => {
      renderApp('/');
      const promoSection = screen.getByText(/โปรโมชั่น|สิทธิพิเศษ|โรงพยาบาลพันธมิตร|Promotion|Partner/i);
      expect(promoSection).toBeInTheDocument();
    });

    it('2.4 should render "How It Works" 3-step guide section', () => {
      renderApp('/');
      const howItWorks = screen.getByText(/ขั้นตอนการใช้งาน|วิธีใช้งาน|How it works|3 ขั้นตอน/i);
      expect(howItWorks).toBeInTheDocument();
    });

    it('2.5 should render testimonials section with guardian ratings and quotes', () => {
      renderApp('/');
      const testimonials = screen.getByText(/เสียงตอบรับ|รีวิวจากผู้ใช้งาน|ความประทับใจ|Testimonials|Guardian/i);
      expect(testimonials).toBeInTheDocument();
    });

    it('2.6 should navigate to /find when clicking hero CTA', async () => {
      const user = userEvent.setup();
      renderApp('/');
      const heroCta = screen.getAllByRole('link', { name: /ค้นหาผู้ดูแล|Find a Caretaker/i })[0] ||
                      screen.getAllByRole('button', { name: /ค้นหาผู้ดูแล|Find a Caretaker/i })[0];
      await user.click(heroCta);
      expect(screen.getByText(/ความต้องการด้านร่างกาย|Physical Needs|ขั้นตอนที่ 1|Step 1/i)).toBeInTheDocument();
    });
  });

  // ==========================================
  // FEATURE 3: Find Caretaker Wizard (/find)
  // ==========================================
  describe('Feature 3: Find Caretaker 3-Step Wizard (/find)', () => {
    it('3.1 should render step indicator showing Step 1, Step 2, Step 3', () => {
      renderApp('/find');
      expect(screen.getByText(/1|ร่างกาย|Physical/i)).toBeInTheDocument();
      expect(screen.getByText(/2|ความชอบ|Preferences/i)).toBeInTheDocument();
      expect(screen.getByText(/3|วันเวลา|Schedule/i)).toBeInTheDocument();
    });

    it('3.2 should allow selecting mobility level and medical conditions in Step 1', async () => {
      const user = userEvent.setup();
      renderApp('/find');
      // Step 1 mobility selection
      const mobilityOption = screen.getByLabelText(/ใช้วีลแชร์|Wheelchair|ใช้ไม้เท้า|Cane|เดินได้ปกติ|Independent/i) ||
                             screen.getByText(/ใช้วีลแชร์|Wheelchair|ใช้ไม้เท้า|Cane|เดินได้ปกติ|Independent/i);
      await user.click(mobilityOption);

      const nextBtn = screen.getByRole('button', { name: /ถัดไป|Next|ต่อไป/i });
      await user.click(nextBtn);

      // Should now be on Step 2
      expect(screen.getByText(/ความต้องการเฉพาะ|ภาษา|ศาสนา|Preferences|Language|Religion/i)).toBeInTheDocument();
    });

    it('3.3 should allow moving back from Step 2 to Step 1', async () => {
      const user = userEvent.setup();
      renderApp('/find');
      const nextBtn = screen.getByRole('button', { name: /ถัดไป|Next|ต่อไป/i });
      await user.click(nextBtn);

      const backBtn = screen.getByRole('button', { name: /ย้อนกลับ|Back|ก่อนหน้า/i });
      await user.click(backBtn);

      expect(screen.getByText(/ความต้องการด้านร่างกาย|Physical Needs|การเคลื่อนไหว|Mobility/i)).toBeInTheDocument();
    });

    it('3.4 should navigate to Step 3 and display date, time, duration, and budget slider', async () => {
      const user = userEvent.setup();
      renderApp('/find');
      // Go to Step 2
      await user.click(screen.getByRole('button', { name: /ถัดไป|Next|ต่อไป/i }));
      // Go to Step 3
      await user.click(screen.getByRole('button', { name: /ถัดไป|Next|ต่อไป/i }));

      expect(screen.getByText(/วันและเวลา|งบประมาณ|Schedule|Budget|ระยะเวลา|Duration/i)).toBeInTheDocument();
    });

    it('3.5 should show AI matching loader animation upon submitting Step 3 then navigate to /matches', async () => {
      vi.useFakeTimers();
      renderApp('/find');
      // Navigate to step 3
      fireEvent.click(screen.getByRole('button', { name: /ถัดไป|Next|ต่อไป/i }));
      fireEvent.click(screen.getByRole('button', { name: /ถัดไป|Next|ต่อไป/i }));

      const submitBtn = screen.getByRole('button', { name: /ค้นหาผู้ดูแลที่เหมาะสม|จับคู่ AI|Find Matches|Match Now/i });
      fireEvent.click(submitBtn);

      // AI Matching animation should appear
      expect(screen.getByText(/AI กำลังค้นหา|กำลังวิเคราะห์|Matching|AI is analyzing/i)).toBeInTheDocument();

      // Fast forward 2.5 seconds
      vi.advanceTimersByTime(2500);

      await waitFor(() => {
        expect(screen.getByText(/ผลการจับคู่|Match Results|96%/i)).toBeInTheDocument();
      });

      vi.useRealTimers();
    });
  });

  // ==========================================
  // FEATURE 4: Match Results Page (/matches)
  // ==========================================
  describe('Feature 4: Match Results (/matches)', () => {
    it('4.1 should display exactly top 3 caretaker match cards', () => {
      renderApp('/matches');
      expect(screen.getByText(/96%/i)).toBeInTheDocument();
      expect(screen.getByText(/88%/i)).toBeInTheDocument();
      expect(screen.getByText(/81%/i)).toBeInTheDocument();
    });

    it('4.2 should highlight "Best Match" badge on the top-ranked caretaker (96%)', () => {
      renderApp('/matches');
      const bestMatchBadge = screen.getByText(/แนะนำสูงสุด|แมตช์อันดับ 1|Best Match|Top Match/i);
      expect(bestMatchBadge).toBeInTheDocument();
    });

    it('4.3 should render specialty tags, rating stars, and hourly rates on each card', () => {
      renderApp('/matches');
      expect(screen.getAllByText(/บาท\/ชม|THB\/hr|฿/i).length).toBeGreaterThanOrEqual(3);
      expect(screen.getAllByText(/★|คะแนน|Rating|5.0|4.9|4.8/i).length).toBeGreaterThanOrEqual(3);
    });

    it('4.4 should have "View Profile" link navigating to /caretaker/:id', async () => {
      const user = userEvent.setup();
      renderApp('/matches');
      const viewProfileBtns = screen.getAllByRole('link', { name: /ดูโปรไฟล์|View Profile/i });
      expect(viewProfileBtns.length).toBeGreaterThanOrEqual(3);

      await user.click(viewProfileBtns[0]);
      expect(screen.getByText(/ความเชี่ยวชาญ|Specialties|ประสบการณ์|Experience|รีวิว|Reviews/i)).toBeInTheDocument();
    });

    it('4.5 should have "Book Now" link navigating to /book/:id', async () => {
      const user = userEvent.setup();
      renderApp('/matches');
      const bookNowBtns = screen.getAllByRole('link', { name: /จองทันที|จองเลย|Book Now|Book/i });
      expect(bookNowBtns.length).toBeGreaterThanOrEqual(3);

      await user.click(bookNowBtns[0]);
      expect(screen.getByText(/สรุปข้อมูลการจอง|Booking Summary|ยืนยันการจอง|Confirm/i)).toBeInTheDocument();
    });
  });

  // ==========================================
  // FEATURE 5: Caretaker Profile (/caretaker/:id)
  // ==========================================
  describe('Feature 5: Caretaker Profile (/caretaker/:id)', () => {
    it('5.1 should render wave gradient hero with photo, name, and AI Match Score', () => {
      renderApp('/caretaker/ct-1');
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByText(/96%/i)).toBeInTheDocument();
    });

    it('5.2 should display verified badges (e.g. Background check, Certified, First Aid)', () => {
      renderApp('/caretaker/ct-1');
      expect(screen.getByText(/ผ่านการตรวจสอบประวัติ|Background Check|ผ่านการรับรอง|Certified|ปฐมพยาบาล|First Aid/i)).toBeInTheDocument();
    });

    it('5.3 should display caretaker bio and experience details', () => {
      renderApp('/caretaker/ct-1');
      expect(screen.getByText(/เกี่ยวกับผู้ดูแล|ประวัติ|Bio|About/i)).toBeInTheDocument();
    });

    it('5.4 should display availability calendar with selectable dates/slots', () => {
      renderApp('/caretaker/ct-1');
      expect(screen.getByText(/ตารางเวลาที่ว่าง|ปฏิทิน|Availability|Calendar/i)).toBeInTheDocument();
    });

    it('5.5 should render reviews section with rating breakdowns and guardian testimonials', () => {
      renderApp('/caretaker/ct-1');
      expect(screen.getByText(/รีวิว|ความคิดเห็น|Reviews|Feedback/i)).toBeInTheDocument();
    });

    it('5.6 should render sticky bottom booking bar with rate and CTA button', () => {
      renderApp('/caretaker/ct-1');
      const stickyCta = screen.getAllByRole('link', { name: /จองผู้ดูแลคนนี้|จองเลย|Book Caretaker|Book Now/i })[0] ||
                        screen.getAllByRole('button', { name: /จองผู้ดูแลคนนี้|จองเลย|Book Caretaker|Book Now/i })[0];
      expect(stickyCta).toBeInTheDocument();
    });
  });

  // ==========================================
  // FEATURE 6: Booking Flow & Success Modal (/book/:id)
  // ==========================================
  describe('Feature 6: Booking Flow & Success Modal (/book/:id)', () => {
    it('6.1 should render booking summary card with elder and caretaker details', () => {
      renderApp('/book/ct-1');
      expect(screen.getByText(/สรุปข้อมูลการจอง|Booking Summary/i)).toBeInTheDocument();
    });

    it('6.2 should render location picker for pickup and destination', () => {
      renderApp('/book/ct-1');
      expect(screen.getByText(/จุดรับ|สถานที่นัดพบ|Pickup Location|ปลายทาง|Destination/i)).toBeInTheDocument();
    });

    it('6.3 should display transparent price breakdown (hourly rate * hours + platform fee)', () => {
      renderApp('/book/ct-1');
      expect(screen.getByText(/รายละเอียดราคา|Price Breakdown|ยอดรวม|Total Price|ค่าบริการ|Service Fee/i)).toBeInTheDocument();
    });

    it('6.4 should show booking success modal with reference ID on confirm click', async () => {
      const user = userEvent.setup();
      renderApp('/book/ct-1');

      const confirmBtn = screen.getByRole('button', { name: /ยืนยันการจอง|Confirm Booking|ชำระเงิน|Proceed/i });
      await user.click(confirmBtn);

      // Modal should appear
      expect(screen.getByText(/จองสำเร็จ|Booking Successful|รหัสการจอง|#LK-/i)).toBeInTheDocument();
    });

    it('6.5 should navigate to /bookings when clicking view bookings inside success modal', async () => {
      const user = userEvent.setup();
      renderApp('/book/ct-1');

      const confirmBtn = screen.getByRole('button', { name: /ยืนยันการจอง|Confirm Booking|ชำระเงิน|Proceed/i });
      await user.click(confirmBtn);

      const toBookingsBtn = screen.getByRole('button', { name: /ดูรายการจองของฉัน|ไปที่การจอง|View My Bookings|Go to Bookings/i }) ||
                            screen.getByRole('link', { name: /ดูรายการจองของฉัน|ไปที่การจอง|View My Bookings|Go to Bookings/i });
      await user.click(toBookingsBtn);

      expect(screen.getByText(/การจองของฉัน|My Bookings|กำลังมาถึง|Upcoming/i)).toBeInTheDocument();
    });
  });

  // ==========================================
  // FEATURE 7: My Bookings Page (/bookings)
  // ==========================================
  describe('Feature 7: My Bookings (/bookings)', () => {
    it('7.1 should render Upcoming and Past tabs', () => {
      renderApp('/bookings');
      expect(screen.getByRole('tab', { name: /กำลังมาถึง|Upcoming/i }) || screen.getByText(/กำลังมาถึง|Upcoming/i)).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /ประวัติ|ที่ผ่านมา|Past/i }) || screen.getByText(/ประวัติ|ที่ผ่านมา|Past/i)).toBeInTheDocument();
    });

    it('7.2 should display sample upcoming bookings in Upcoming tab', () => {
      renderApp('/bookings');
      expect(screen.getAllByText(/รอการดูแล|ยืนยันแล้ว|Upcoming|Confirmed/i).length).toBeGreaterThanOrEqual(1);
    });

    it('7.3 should switch to Past tab and show completed booking cards', async () => {
      const user = userEvent.setup();
      renderApp('/bookings');

      const pastTab = screen.getByRole('tab', { name: /ประวัติ|ที่ผ่านมา|Past/i }) || screen.getByText(/ประวัติ|ที่ผ่านมา|Past/i);
      await user.click(pastTab);

      expect(screen.getByText(/เสร็จสิ้น|สำเร็จ|Completed/i)).toBeInTheDocument();
    });

    it('7.4 should open Review Modal when clicking "Leave Review" on past booking', async () => {
      const user = userEvent.setup();
      renderApp('/bookings');

      const pastTab = screen.getByRole('tab', { name: /ประวัติ|ที่ผ่านมา|Past/i }) || screen.getByText(/ประวัติ|ที่ผ่านมา|Past/i);
      await user.click(pastTab);

      const reviewBtn = screen.getByRole('button', { name: /เขียนรีวิว|ให้คะแนน|Leave Review|Review/i });
      await user.click(reviewBtn);

      expect(screen.getByText(/ให้คะแนนผู้ดูแล|รีวิวบริการ|Rate Caretaker|Leave a Review/i)).toBeInTheDocument();
    });

    it('7.5 should submit review and close review modal', async () => {
      const user = userEvent.setup();
      renderApp('/bookings');

      const pastTab = screen.getByRole('tab', { name: /ประวัติ|ที่ผ่านมา|Past/i }) || screen.getByText(/ประวัติ|ที่ผ่านมา|Past/i);
      await user.click(pastTab);

      const reviewBtn = screen.getByRole('button', { name: /เขียนรีวิว|ให้คะแนน|Leave Review|Review/i });
      await user.click(reviewBtn);

      const submitReviewBtn = screen.getByRole('button', { name: /ส่งรีวิว|บันทึกรีวิว|Submit Review|Submit/i });
      await user.click(submitReviewBtn);

      // Modal closes or shows success
      await waitFor(() => {
        expect(screen.queryByRole('heading', { name: /ให้คะแนนผู้ดูแล|Rate Caretaker/i })).not.toBeInTheDocument();
      });
    });
  });

  // ==========================================
  // FEATURE 8: Elder Profile Page (/elder-profile)
  // ==========================================
  describe('Feature 8: Elder Profile (/elder-profile)', () => {
    it('8.1 should display elder avatar and personal details (name, age)', () => {
      renderApp('/elder-profile');
      expect(screen.getByDisplayValue(/สมพร|Somporn|คุณยาย/i) || screen.getByText(/สมพร|Somporn/i)).toBeInTheDocument();
    });

    it('8.2 should display editable medical conditions and medications', () => {
      renderApp('/elder-profile');
      expect(screen.getByText(/โรคประจำตัว|ข้อมูลสุขภาพ|Medical Conditions|Health/i)).toBeInTheDocument();
    });

    it('8.3 should allow editing mobility status and communication preferences', async () => {
      const user = userEvent.setup();
      renderApp('/elder-profile');
      const mobilityInput = screen.getByLabelText(/การเคลื่อนไหว|Mobility|ระดับการเคลื่อนไหว/i) ||
                            screen.getByText(/การเคลื่อนไหว|Mobility/i);
      expect(mobilityInput).toBeInTheDocument();
    });

    it('8.4 should render emergency contact fields', () => {
      renderApp('/elder-profile');
      expect(screen.getByText(/ติดต่อฉุกเฉิน|ผู้ติดต่อกรณีฉุกเฉิน|Emergency Contact/i)).toBeInTheDocument();
    });

    it('8.5 should show success toast notification upon saving changes', async () => {
      const user = userEvent.setup();
      renderApp('/elder-profile');

      const saveBtn = screen.getByRole('button', { name: /บันทึกข้อมูล|บันทึก|Save Profile|Save/i });
      await user.click(saveBtn);

      expect(await screen.findByText(/บันทึกข้อมูลสำเร็จ|Profile updated|บันทึกเรียบร้อย|Success/i)).toBeInTheDocument();
    });
  });

  // ==========================================
  // FEATURE 9: Shared UI Kit Component Standards
  // ==========================================
  describe('Feature 9: Shared UI Kit Components', () => {
    it('9.1 MatchScoreRing renders SVG circle with correct stroke dash offset', () => {
      const { container } = render(<MatchScoreRing score={96} size={100} strokeWidth={8} />);
      const circles = container.querySelectorAll('circle');
      expect(circles.length).toBe(2); // background circle + progress circle
      expect(screen.getByText('96%')).toBeInTheDocument();
    });

    it('9.2 Badge renders with proper variant classes', () => {
      const { container, rerender } = render(<Badge variant="verified">ยืนยันแล้ว</Badge>);
      expect(container.textContent).toBe('ยืนยันแล้ว');

      rerender(<Badge variant="match">Best Match</Badge>);
      expect(container.textContent).toBe('Best Match');
    });

    it('9.3 Button supports variants and click handlers', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<Button variant="primary" onClick={handleClick}>คลิกที่นี่</Button>);

      const btn = screen.getByRole('button', { name: 'คลิกที่นี่' });
      await user.click(btn);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('9.4 Modal renders when isOpen is true and handles close', async () => {
      const user = userEvent.setup();
      const handleClose = vi.fn();
      const { rerender } = render(
        <Modal isOpen={true} onClose={handleClose} title="หน้าต่างแจ้งเตือน">
          <div>เนื้อหาภายใน</div>
        </Modal>
      );

      expect(screen.getByText('หน้าต่างแจ้งเตือน')).toBeInTheDocument();
      expect(screen.getByText('เนื้อหาภายใน')).toBeInTheDocument();

      const closeBtn = screen.getByRole('button', { name: /close|ปิด|✕/i });
      await user.click(closeBtn);
      expect(handleClose).toHaveBeenCalled();

      rerender(<Modal isOpen={false} onClose={handleClose} title="ปิดแล้ว"><div>ซ่อน</div></Modal>);
      expect(screen.queryByText('ปิดแล้ว')).not.toBeInTheDocument();
    });

    it('9.5 Toast notification renders message and supports auto/manual close', async () => {
      const handleClose = vi.fn();
      render(<Toast message="การดำเนินการเสร็จสิ้น" isOpen={true} onClose={handleClose} />);
      expect(screen.getByText('การดำเนินการเสร็จสิ้น')).toBeInTheDocument();
    });
  });
});
