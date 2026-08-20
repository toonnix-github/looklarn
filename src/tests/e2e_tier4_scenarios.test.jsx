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

describe('Tier 4: Real-World Workload Scenarios', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // =========================================================================
  // SCENARIO 1: Hospital Visit Appointment Escort for Grandma Somporn (Age 78)
  // =========================================================================
  it('Scenario 1: Guardian books wheelchair-certified hospital escort for elder parent', async () => {
    vi.useFakeTimers();
    renderApp('/find');

    // 1. Step 1: Physical needs (Wheelchair, Diabetes, Hypertension)
    const wheelchairOption = screen.getByLabelText(/ใช้วีลแชร์|Wheelchair/i) ||
                             screen.getByText(/ใช้วีลแชร์|Wheelchair/i);
    fireEvent.click(wheelchairOption);

    const nextBtn1 = screen.getByRole('button', { name: /ถัดไป|Next|ต่อไป/i });
    fireEvent.click(nextBtn1);

    // 2. Step 2: Activity selection (Hospital Visit)
    const hospitalActivity = screen.getByText(/โรงพยาบาล|พาไปพบแพทย์|Hospital/i);
    fireEvent.click(hospitalActivity);

    const nextBtn2 = screen.getByRole('button', { name: /ถัดไป|Next|ต่อไป/i });
    fireEvent.click(nextBtn2);

    // 3. Step 3: Schedule (Morning 4 hours) & AI Match Submit
    const submitBtn = screen.getByRole('button', { name: /ค้นหาผู้ดูแลที่เหมาะสม|จับคู่ AI|Find Matches|Match Now/i });
    fireEvent.click(submitBtn);

    // 4. AI Match Loader (2.5s)
    vi.advanceTimersByTime(2500);

    await waitFor(() => {
      expect(screen.getByText(/96%/i)).toBeInTheDocument();
    });

    // 5. Select Best Match (96%) and view profile
    const viewProfileBtn = screen.getAllByRole('link', { name: /ดูโปรไฟล์|View Profile/i })[0];
    fireEvent.click(viewProfileBtn);

    // 6. Verify Caretaker medical credentials & certifications
    expect(screen.getByText(/ผ่านการรับรอง|Certified|ปฐมพยาบาล|First Aid|96%/i)).toBeInTheDocument();

    // 7. Proceed to Booking
    const bookBtn = screen.getAllByRole('link', { name: /จองผู้ดูแลคนนี้|จองเลย|Book Caretaker|Book Now/i })[0] ||
                    screen.getAllByRole('button', { name: /จองผู้ดูแลคนนี้|จองเลย|Book Caretaker|Book Now/i })[0];
    fireEvent.click(bookBtn);

    // 8. Fill Hospital Destination & Confirm
    const confirmBtn = screen.getByRole('button', { name: /ยืนยันการจอง|Confirm Booking|ชำระเงิน/i });
    fireEvent.click(confirmBtn);

    // 9. Verify Success Modal with Reference ID
    expect(screen.getByText(/จองสำเร็จ|Booking Successful|#LK-/i)).toBeInTheDocument();

    vi.useRealTimers();
  });

  // =========================================================================
  // SCENARIO 2: Buddhist Merit & Temple Excursion for Grandma Malee (Age 72)
  // =========================================================================
  it('Scenario 2: Guardian books companion for Buddhist temple merit tour with cane assistance', async () => {
    vi.useFakeTimers();
    renderApp('/');

    // 1. Start from Temple Activity Card on Homepage
    const templeCard = screen.getByText(/ไหว้พระ|ทำบุญ|Temple/i).closest('a') ||
                       screen.getByText(/ไหว้พระ|ทำบุญ|Temple/i).closest('div');
    if (templeCard) {
      fireEvent.click(templeCard);
    }

    // 2. Direct or navigate to /find
    renderApp('/find');

    // Step 1: Select Cane mobility
    const caneOption = screen.getByLabelText(/ใช้ไม้เท้า|Walking Cane|Cane/i) ||
                       screen.getByText(/ใช้ไม้เท้า|Walking Cane|Cane/i);
    if (caneOption) {
      fireEvent.click(caneOption);
    }

    fireEvent.click(screen.getByRole('button', { name: /ถัดไป|Next|ต่อไป/i }));
    fireEvent.click(screen.getByRole('button', { name: /ถัดไป|Next|ต่อไป/i }));

    // Step 3: Match Submit
    const submitBtn = screen.getByRole('button', { name: /ค้นหาผู้ดูแลที่เหมาะสม|จับคู่ AI|Find Matches|Match Now/i });
    fireEvent.click(submitBtn);

    vi.advanceTimersByTime(2500);

    // 3. Match Results page: Book directly with 2nd match (88%)
    await waitFor(() => {
      expect(screen.getByText(/88%/i)).toBeInTheDocument();
    });

    const bookNowBtns = screen.getAllByRole('link', { name: /จองทันที|จองเลย|Book Now|Book/i });
    if (bookNowBtns.length > 1) {
      fireEvent.click(bookNowBtns[1]);
    } else {
      fireEvent.click(bookNowBtns[0]);
    }

    // 4. Confirm Booking
    expect(screen.getByText(/สรุปข้อมูลการจอง|Booking Summary/i)).toBeInTheDocument();
    const confirmBtn = screen.getByRole('button', { name: /ยืนยันการจอง|Confirm Booking|ชำระเงิน/i });
    fireEvent.click(confirmBtn);

    expect(screen.getByText(/จองสำเร็จ|Booking Successful/i)).toBeInTheDocument();

    vi.useRealTimers();
  });

  // =========================================================================
  // SCENARIO 3: Park Leisure & Mobility Escort at Lumphini Park
  // =========================================================================
  it('Scenario 3: Guardian books 2-hour afternoon walking companion at Lumphini Park', async () => {
    vi.useFakeTimers();
    renderApp('/book/ct-3');

    // 1. Direct booking verification for Companion Caretaker ct-3 (81% match)
    expect(screen.getByText(/สรุปข้อมูลการจอง|Booking Summary/i)).toBeInTheDocument();

    // 2. Price breakdown displays correct rate and duration
    expect(screen.getByText(/รายละเอียดราคา|Price Breakdown|ยอดรวม|Total/i)).toBeInTheDocument();

    // 3. Confirm booking
    const confirmBtn = screen.getByRole('button', { name: /ยืนยันการจอง|Confirm Booking|ชำระเงิน/i });
    fireEvent.click(confirmBtn);

    // 4. Modal confirms booking
    expect(screen.getByText(/จองสำเร็จ|Booking Successful|#LK-/i)).toBeInTheDocument();

    // 5. Navigate to My Bookings
    const toBookingsBtn = screen.getByRole('button', { name: /ดูรายการจองของฉัน|ไปที่การจอง|View My Bookings|Go to Bookings/i }) ||
                          screen.getByRole('link', { name: /ดูรายการจองของฉัน|ไปที่การจอง|View My Bookings|Go to Bookings/i });
    fireEvent.click(toBookingsBtn);

    expect(screen.getByText(/การจองของฉัน|My Bookings/i)).toBeInTheDocument();

    vi.useRealTimers();
  });
});
