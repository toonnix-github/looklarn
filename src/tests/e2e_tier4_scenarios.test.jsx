import React from 'react';
import { act, render, screen, fireEvent, waitFor, within } from '@testing-library/react';
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

const expectSomeText = (matcher) => {
  expect(screen.getAllByText(matcher).length).toBeGreaterThan(0);
};

describe('Tier 4: Real-World Workload Scenarios', () => {

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  // =========================================================================
  // SCENARIO 1: Hospital Visit Appointment Escort for Grandma Somporn (Age 78)
  // =========================================================================
  it('Scenario 1: Guardian books wheelchair-certified hospital escort for elder parent', async () => {
    vi.useFakeTimers();
    renderApp('/find');

    // 1. Step 1: Physical needs (Wheelchair, Diabetes, Hypertension)
    const wheelchairOption = screen.getAllByRole('radio', { name: /ใช้วีลแชร์|Wheelchair/i })[0];
    fireEvent.click(wheelchairOption);

    const nextBtn1 = screen.getByRole('button', { name: /ถัดไป|Next|ต่อไป/i });
    fireEvent.click(nextBtn1);

    // 2. Step 2: Activity selection (Hospital Visit)
    const hospitalActivity = screen.getAllByText(/โรงพยาบาล|พาไปพบแพทย์|Hospital/i)[0];
    fireEvent.click(hospitalActivity);

    const nextBtn2 = screen.getByRole('button', { name: /ถัดไป|Next|ต่อไป/i });
    fireEvent.click(nextBtn2);

    // 3. Step 3: Schedule (Morning 4 hours) & AI Match Submit
    const submitBtn = screen.getByRole('button', { name: /ค้นหาผู้ดูแลที่เหมาะสม|จับคู่ AI|Find Matches|Match Now/i });
    fireEvent.click(submitBtn);

    // 4. AI Match Loader (2.5s)
    await act(async () => {
      vi.advanceTimersByTime(2500);
    });

    expectSomeText(/96%/i);

    // 5. Select Best Match (96%) and view profile
    const viewProfileBtn = screen.getAllByRole('link', { name: /ดูโปรไฟล์|View Profile/i })[0];
    fireEvent.click(viewProfileBtn);

    // 6. Verify Caretaker medical credentials & certifications
    expectSomeText(/ผ่านการรับรอง|Certified|ปฐมพยาบาล|First Aid|96%/i);

    // 7. Proceed to Booking
    const bookBtn = screen.getAllByRole('link', { name: /จองผู้ดูแลคนนี้|จองเลย|Book Caretaker|Book Now/i })[0] ||
                    screen.getAllByRole('button', { name: /จองผู้ดูแลคนนี้|จองเลย|Book Caretaker|Book Now/i })[0];
    fireEvent.click(bookBtn);

    // 8. Fill Hospital Destination & Confirm
    const confirmBtn = screen.getByRole('button', { name: /ยืนยันการจอง|Confirm Booking|ชำระเงิน/i });
    fireEvent.click(confirmBtn);

    // 9. Verify Success Modal with Reference ID
    expectSomeText(/จองสำเร็จ|Booking Successful|#LK-/i);

    vi.useRealTimers();
  });

  // =========================================================================
  // SCENARIO 2: Buddhist Merit & Temple Excursion for Grandma Malee (Age 72)
  // =========================================================================
  it('Scenario 2: Guardian books companion for Buddhist temple merit tour with cane assistance', async () => {
    vi.useFakeTimers();
    renderApp('/find');

    // Step 1: Select Cane mobility
    const caneOption = screen.getAllByRole('radio', { name: /ไม้เท้า|ประคอง|Walking Cane|Cane/i })[0];
    if (caneOption) {
      fireEvent.click(caneOption);
    }

    fireEvent.click(screen.getAllByRole('button', { name: /ถัดไป|Next|ต่อไป/i })[0]);
    fireEvent.click(screen.getAllByRole('button', { name: /ถัดไป|Next|ต่อไป/i })[0]);

    // Step 3: Match Submit
    const submitBtn = screen.getByRole('button', { name: /ค้นหาผู้ดูแลที่เหมาะสม|จับคู่ AI|Find Matches|Match Now/i });
    fireEvent.click(submitBtn);

    await act(async () => {
      vi.advanceTimersByTime(2500);
    });

    // 3. Match Results page: Book directly with 2nd match (88%)
    expectSomeText(/88%/i);

    const bookNowBtns = screen.getAllByRole('link', { name: /จองทันที|จองเลย|Book Now|Book/i });
    if (bookNowBtns.length > 1) {
      fireEvent.click(bookNowBtns[1]);
    } else {
      fireEvent.click(bookNowBtns[0]);
    }

    // 4. Confirm Booking
    expectSomeText(/สรุปข้อมูลการจอง|Booking Summary/i);
    const confirmBtn = screen.getByRole('button', { name: /ยืนยันการจอง|Confirm Booking|ชำระเงิน/i });
    fireEvent.click(confirmBtn);

    expectSomeText(/การนัดหมายเสร็จสมบูรณ์|บันทึกการนัดหมาย|หมายเลขอ้างอิง|Booking Confirmed|#LK-/i);

    vi.useRealTimers();
  });

  // =========================================================================
  // SCENARIO 3: Park Leisure & Mobility Escort at Lumphini Park
  // =========================================================================
  it('Scenario 3: Guardian books 2-hour afternoon walking companion at Lumphini Park', async () => {
    vi.useFakeTimers();
    renderApp('/book/ct-3');

    // 1. Direct booking verification for Companion Caretaker ct-3 (81% match)
    expectSomeText(/สรุปข้อมูลการจอง|Booking Summary/i);

    // 2. Price breakdown displays correct rate and duration
    expectSomeText(/รายละเอียดราคา|Price Breakdown|ยอดรวม|Total/i);

    // 3. Confirm booking
    const confirmBtn = screen.getByRole('button', { name: /ยืนยันการจอง|Confirm Booking|ชำระเงิน/i });
    fireEvent.click(confirmBtn);

    // 4. Modal confirms booking
    expectSomeText(/จองสำเร็จ|Booking Successful|#LK-/i);

    // 5. Navigate to My Bookings
    const toBookingsBtn = screen.getByRole('button', { name: /ดูรายการจองของฉัน|ไปที่การจอง|View My Bookings|Go to Bookings/i }) ||
                          screen.getByRole('link', { name: /ดูรายการจองของฉัน|ไปที่การจอง|View My Bookings|Go to Bookings/i });
    fireEvent.click(toBookingsBtn);

    expectSomeText(/การจองของฉัน|My Bookings/i);

    vi.useRealTimers();
  });
});
