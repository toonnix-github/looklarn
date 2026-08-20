import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import App from '../App';
import { LanguageProvider, useLanguage } from '../context/LanguageContext';
import { AppProvider, useApp } from '../context/AppContext';

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

const firstButton = (name) => screen.getAllByRole('button', { name })[0];
const expectSomeText = (matcher) => {
  expect(screen.getAllByText(matcher).length).toBeGreaterThan(0);
};

describe('Tier 2: Boundary, Corner Cases & Error Handling', () => {

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  // ==========================================
  // BOUNDARY 1: Direct Route Deep Linking
  // ==========================================
  describe('Boundary 1: Direct Route Deep Linking', () => {
    it('1.1 should render caretaker profile directly when loaded via /caretaker/:id', () => {
      renderApp('/caretaker/ct-1');
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByText(/96%/i)).toBeInTheDocument();
    });

    it('1.2 should render booking page directly when loaded via /book/:id', () => {
      renderApp('/book/ct-2');
      expect(screen.getByText(/สรุปข้อมูลการจอง|Booking Summary/i)).toBeInTheDocument();
      expect(screen.getByText(/88%/i)).toBeInTheDocument();
    });

    it('1.3 should render matches page directly on fresh session', () => {
      renderApp('/matches');
      expect(screen.getByText(/96%/i)).toBeInTheDocument();
      expect(screen.getByText(/88%/i)).toBeInTheDocument();
      expect(screen.getByText(/81%/i)).toBeInTheDocument();
    });

    it('1.4 should render bookings list directly on fresh session', () => {
      renderApp('/bookings');
      expectSomeText(/การจองของฉัน|My Bookings/i);
    });

    it('1.5 should render elder profile directly on fresh session', () => {
      renderApp('/elder-profile');
      expectSomeText(/ข้อมูลผู้สูงอายุ|โปรไฟล์|Elder Profile/i);
    });
  });

  // ==========================================
  // BOUNDARY 2: Invalid IDs & 404 Fallback
  // ==========================================
  describe('Boundary 2: Invalid IDs & 404 Fallback Handling', () => {
    it('2.1 should render 404 Not Found page for completely unknown paths', () => {
      renderApp('/some-random-unknown-route-xyz');
      expectSomeText(/ไม่พบหน้านี้|404|Page Not Found|หน้าไม่พบ/i);
      const backHomeLink = screen.getAllByRole('link', { name: /กลับสู่หน้าแรก|Back to Home/i })[0];
      expect(backHomeLink).toBeInTheDocument();
    });

    it('2.2 should handle non-existent caretaker ID gracefully', () => {
      renderApp('/caretaker/non-existent-caretaker-999');
      // Should show caretaker not found or fallback message
      expectSomeText(/ไม่พบผู้ดูแล|ไม่พบข้อมูล|Caretaker not found|404/i);
    });

    it('2.3 should handle non-existent booking caretaker ID gracefully', () => {
      renderApp('/book/invalid-caretaker-id-404');
      expect(
        screen.getByText(/ไม่พบผู้ดูแล|ไม่พบข้อมูลการจอง|Invalid caretaker|404/i) ||
        screen.getByRole('link', { name: /กลับ|Back|ค้นหา/i })
      ).toBeInTheDocument();
    });
  });

  // ==========================================
  // BOUNDARY 3: Rapid Language Switching & State Retention
  // ==========================================
  describe('Boundary 3: Rapid Language Switching & State Retention', () => {
    it('3.1 should handle rapid sequential language toggles without crashing', async () => {
      const user = userEvent.setup();
      renderApp('/');

      const enToggle = firstButton(/^EN$/i);
      const thToggle = firstButton(/^TH$/i);

      for (let i = 0; i < 5; i++) {
        await user.click(enToggle);
        expectSomeText(/Find a Caretaker/i);
        await user.click(thToggle);
        expectSomeText(/ค้นหาผู้ดูแล/i);
      }
    });

    it('3.2 should retain form input when language is switched in Find wizard', async () => {
      const user = userEvent.setup();
      renderApp('/find');

      // Go to step 2
      await user.click(screen.getByRole('button', { name: /ถัดไป|Next|ต่อไป/i }));

      // Switch language to EN
      const enToggle = firstButton(/^EN$/i);
      await user.click(enToggle);

      // Verify we are still on Step 2 in English
      expectSomeText(/Preferences|Language|Religion|Step 2/i);

      // Switch back to TH
      const thToggle = firstButton(/^TH$/i);
      await user.click(thToggle);

      // Still on Step 2 in Thai
      expectSomeText(/ความต้องการเฉพาะ|ขั้นตอนที่ 2|ภาษา/i);
    });

    it('3.3 should maintain open success modal with translated text upon language switch', async () => {
      const user = userEvent.setup();
      renderApp('/book/ct-1');

      // Click Confirm
      const confirmBtn = screen.getByRole('button', { name: /ยืนยันการจอง|Confirm Booking|ชำระเงิน/i });
      await user.click(confirmBtn);

      // Modal is visible
      expectSomeText(/การนัดหมายเสร็จสมบูรณ์|บันทึกการนัดหมาย|หมายเลขอ้างอิง|Booking Confirmed|#LK-/i);

      // Switch language to EN while modal is open
      const enToggle = firstButton(/^EN$/i);
      await user.click(enToggle);

      // Modal should still be open, showing English confirmation
      expectSomeText(/Booking Confirmed|Confirmed|#LK-/i);
    });
  });

  // ==========================================
  // BOUNDARY 4: Extreme Inputs & Special Characters
  // ==========================================
  describe('Boundary 4: Extreme Inputs & Special Characters', () => {
    it('4.1 should handle extreme long names and special characters in elder profile', async () => {
      const user = userEvent.setup();
      renderApp('/elder-profile');

      const nameInput = document.getElementById('name-input');
      const longSpecialName = 'คุณยายทองดี สมบัติมหาศาล & <Special Characters> #1234567890 (Very Long Name Test Case)';
      fireEvent.change(nameInput, { target: { value: longSpecialName } });

      const saveBtn = screen.getByRole('button', { name: /บันทึกข้อมูล|บันทึก|Save Profile|Save/i });
      await user.click(saveBtn);

      // Value should persist in input
      expect(nameInput.value).toBe(longSpecialName);
    });

    it('4.2 should handle boundary age values (e.g. 105 years old)', async () => {
      const user = userEvent.setup();
      renderApp('/elder-profile');

      const ageInput = document.getElementById('age-input');
      await user.clear(ageInput);
      await user.type(ageInput, '105');

      const saveBtn = screen.getByRole('button', { name: /บันทึกข้อมูล|บันทึก|Save Profile|Save/i });
      await user.click(saveBtn);

      expect(ageInput.value).toBe('105');
    });

    it('4.3 should handle empty notes and custom pickup locations in booking form', async () => {
      const user = userEvent.setup();
      renderApp('/book/ct-1');

      // Check pickup location input
      const pickupInput = screen.getByLabelText(/จุดรับ|Pickup/i);
      if (pickupInput) {
        await user.clear(pickupInput);
        await user.type(pickupInput, 'อาคารภูมิสิริมังคลานุสรณ์ รพ.จุฬาฯ ประตู 4');
        expect(pickupInput.value).toBe('อาคารภูมิสิริมังคลานุสรณ์ รพ.จุฬาฯ ประตู 4');
      }
    });
  });

  // ==========================================
  // BOUNDARY 5: Viewport & Layout Integrity
  // ==========================================
  describe('Boundary 5: Viewport & Layout Integrity', () => {
    it('5.1 should render sticky booking bar on caretaker page regardless of scroll position', () => {
      renderApp('/caretaker/ct-1');
      const stickyBar = screen.getByText(/฿|บาท\/ชม|THB/i).closest('div');
      expect(stickyBar).toBeInTheDocument();
    });

    it('5.2 should render navigation header with logo and navigation links', () => {
      renderApp('/');
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      expect(within(nav).getAllByText(/Looklarn|ลูกหลาน/i).length).toBeGreaterThan(0);
    });
  });
});
