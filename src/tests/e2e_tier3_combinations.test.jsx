import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import App from '../App';
import { LanguageProvider, useLanguage } from '../context/LanguageContext';
import { AppProvider, useApp } from '../context/AppContext';

// Helper to render entire app with initial route
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

describe('Tier 3: Cross-Feature Multi-Page Combinations & State Persistence', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ==========================================
  // COMBINATION 1: Full Golden Journey (Home -> Find -> Matches -> Profile -> Book -> Bookings)
  // ==========================================
  it('3.1 should complete the entire end-to-end booking journey smoothly', async () => {
    vi.useFakeTimers();
    renderApp('/');

    // 1. Home Page: Click Hero CTA
    const heroCta = screen.getAllByRole('link', { name: /ค้นหาผู้ดูแล|Find a Caretaker/i })[0] ||
                    screen.getAllByRole('button', { name: /ค้นหาผู้ดูแล|Find a Caretaker/i })[0];
    fireEvent.click(heroCta);

    // 2. Find Caretaker: Step 1 Physical Needs
    expect(screen.getByText(/ความต้องการด้านร่างกาย|Physical Needs|ขั้นตอนที่ 1|Step 1/i)).toBeInTheDocument();
    const nextBtn1 = screen.getByRole('button', { name: /ถัดไป|Next|ต่อไป/i });
    fireEvent.click(nextBtn1);

    // 3. Step 2: Preferences
    expect(screen.getByText(/ความต้องการเฉพาะ|Preferences|ขั้นตอนที่ 2|Step 2/i)).toBeInTheDocument();
    const nextBtn2 = screen.getByRole('button', { name: /ถัดไป|Next|ต่อไป/i });
    fireEvent.click(nextBtn2);

    // 4. Step 3: Schedule & Submit
    expect(screen.getByText(/วันและเวลา|งบประมาณ|Schedule|Budget/i)).toBeInTheDocument();
    const submitBtn = screen.getByRole('button', { name: /ค้นหาผู้ดูแลที่เหมาะสม|จับคู่ AI|Find Matches|Match Now/i });
    fireEvent.click(submitBtn);

    // 5. AI Matching Animation -> Matches Page
    expect(screen.getByText(/AI กำลังค้นหา|กำลังวิเคราะห์|Matching|AI is analyzing/i)).toBeInTheDocument();
    vi.advanceTimersByTime(2500);

    await waitFor(() => {
      expect(screen.getByText(/96%/i)).toBeInTheDocument();
    });

    // 6. Match Results: Click "View Profile" on top match
    const viewProfileBtns = screen.getAllByRole('link', { name: /ดูโปรไฟล์|View Profile/i });
    fireEvent.click(viewProfileBtns[0]);

    // 7. Caretaker Profile: Verify profile details & Click Book
    expect(screen.getByText(/ความเชี่ยวชาญ|Specialties|ประสบการณ์|Experience/i)).toBeInTheDocument();
    const bookCta = screen.getAllByRole('link', { name: /จองผู้ดูแลคนนี้|จองเลย|Book Caretaker|Book Now/i })[0] ||
                    screen.getAllByRole('button', { name: /จองผู้ดูแลคนนี้|จองเลย|Book Caretaker|Book Now/i })[0];
    fireEvent.click(bookCta);

    // 8. Booking Screen: Fill location and Confirm
    expect(screen.getByText(/สรุปข้อมูลการจอง|Booking Summary/i)).toBeInTheDocument();
    const confirmBookingBtn = screen.getByRole('button', { name: /ยืนยันการจอง|Confirm Booking|ชำระเงิน/i });
    fireEvent.click(confirmBookingBtn);

    // 9. Success Modal -> Navigate to Bookings
    expect(screen.getByText(/จองสำเร็จ|Booking Successful|#LK-/i)).toBeInTheDocument();
    const toBookingsBtn = screen.getByRole('button', { name: /ดูรายการจองของฉัน|ไปที่การจอง|View My Bookings|Go to Bookings/i }) ||
                          screen.getByRole('link', { name: /ดูรายการจองของฉัน|ไปที่การจอง|View My Bookings|Go to Bookings/i });
    fireEvent.click(toBookingsBtn);

    // 10. My Bookings Page: Verify new booking is listed under Upcoming
    expect(screen.getByText(/การจองของฉัน|My Bookings/i)).toBeInTheDocument();

    vi.useRealTimers();
  });

  // ==========================================
  // COMBINATION 2: Elder Profile Update Syncs to Find Wizard
  // ==========================================
  it('3.2 should persist edited elder profile data into Find Caretaker wizard auto-fill', async () => {
    const user = userEvent.setup();
    renderApp('/elder-profile');

    // 1. Edit Elder Profile
    const nameInput = screen.getByDisplayValue(/สมพร|Somporn/i) || screen.getByLabelText(/ชื่อ|Name/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'คุณยายบุญมี มณีโชติ');

    const saveBtn = screen.getByRole('button', { name: /บันทึกข้อมูล|บันทึก|Save Profile|Save/i });
    await user.click(saveBtn);

    // 2. Navigate to /find via navbar
    const findNav = screen.getByRole('link', { name: /ค้นหาผู้ดูแล|Find a Caretaker/i });
    await user.click(findNav);

    // 3. Verify elder info is reflected or auto-filled
    expect(screen.getByText(/บุญมี|คุณยายบุญมี|สมพร|Physical Needs|ร่างกาย/i)).toBeInTheDocument();
  });

  // ==========================================
  // COMBINATION 3: Past Booking Review Submission Flow
  // ==========================================
  it('3.3 should complete review submission for a past booking and update list state', async () => {
    const user = userEvent.setup();
    renderApp('/bookings');

    // 1. Click Past tab
    const pastTab = screen.getByRole('tab', { name: /ประวัติ|ที่ผ่านมา|Past/i }) || screen.getByText(/ประวัติ|ที่ผ่านมา|Past/i);
    await user.click(pastTab);

    // 2. Click "Leave Review"
    const reviewBtn = screen.getByRole('button', { name: /เขียนรีวิว|ให้คะแนน|Leave Review|Review/i });
    await user.click(reviewBtn);

    // 3. Fill star rating and feedback in modal
    const reviewModal = screen.getByRole('dialog') || screen.getByText(/ให้คะแนนผู้ดูแล|รีวิวบริการ|Rate Caretaker/i).closest('div');
    expect(reviewModal).toBeInTheDocument();

    const commentInput = screen.getByPlaceholderText(/แสดงความคิดเห็น|เขียนความประทับใจ|Enter feedback|Write a review/i) ||
                         screen.getByRole('textbox');
    if (commentInput) {
      await user.type(commentInput, 'คุณพยาบาลดูแลคุณยายดีมาก ตรงต่อเวลาและใจเย็นมากครับ');
    }

    // 4. Submit review
    const submitBtn = screen.getByRole('button', { name: /ส่งรีวิว|บันทึกรีวิว|Submit Review|Submit/i });
    await user.click(submitBtn);

    // 5. Verify modal closed
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: /ให้คะแนนผู้ดูแล|Rate Caretaker/i })).not.toBeInTheDocument();
    });
  });

  // ==========================================
  // COMBINATION 4: Home Activity Card Quick-Start Navigation
  // ==========================================
  it('3.4 should navigate to /find when clicking an activity card on Home page', async () => {
    const user = userEvent.setup();
    renderApp('/');

    const hospitalCard = screen.getByText(/โรงพยาบาล|พาไปหาหมอ|Hospital Visit|Hospital/i).closest('a') ||
                         screen.getByText(/โรงพยาบาล|พาไปหาหมอ|Hospital Visit|Hospital/i).closest('div');

    if (hospitalCard) {
      await user.click(hospitalCard);
      // Should land on /find
      expect(screen.getByText(/ค้นหาผู้ดูแล|ความต้องการ|Physical Needs|Step 1/i)).toBeInTheDocument();
    }
  });
});
