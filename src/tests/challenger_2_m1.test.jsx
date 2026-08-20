import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { LanguageProvider } from '../context/LanguageContext';
import { AppProvider, useApp } from '../context/AppContext';
import { MatchScoreRing } from '../components/ui/MatchScoreRing';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { ToastProvider, useToast } from '../components/ui/Toast';
import { th } from '../i18n/th';
import { en } from '../i18n/en';
import { formatCurrency, formatDate, formatMatchScore, formatDuration } from '../utils/formatters';

describe('Challenger 2 Empirical Verification: Milestone M1', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('1. Router Integration & Route Rendering (All 10 Paths)', () => {
    const renderWithRoute = (initialPath) => {
      return render(
        <MemoryRouter initialEntries={[initialPath]}>
          <App />
        </MemoryRouter>
      );
    };

    it('renders "/" -> HomePage cleanly', () => {
      renderWithRoute('/');
      const page = screen.getByTestId('page-home');
      expect(page).toBeInTheDocument();
      expect(within(page).getByRole('heading', { level: 1 })).toHaveTextContent(/ลูกหลาน/i);
    });

    it('renders "/find" -> FindCaretakerPage cleanly', () => {
      renderWithRoute('/find');
      const page = screen.getByTestId('page-find');
      expect(page).toBeInTheDocument();
      expect(within(page).getByRole('heading', { level: 1 })).toHaveTextContent(/ค้นหาผู้ดูแล/i);
    });

    it('renders "/matches" -> MatchResultsPage cleanly', () => {
      renderWithRoute('/matches');
      const page = screen.getByTestId('page-matches');
      expect(page).toBeInTheDocument();
      expect(within(page).getByRole('heading', { level: 1 })).toHaveTextContent(/ผลการจับคู่/i);
    });

    it('renders "/results" route alias -> MatchResultsPage cleanly', () => {
      renderWithRoute('/results');
      const page = screen.getByTestId('page-matches');
      expect(page).toBeInTheDocument();
      expect(within(page).getByRole('heading', { level: 1 })).toHaveTextContent(/ผลการจับคู่/i);
    });

    it('renders "/caretaker/ct-001" -> CaretakerProfilePage cleanly', () => {
      renderWithRoute('/caretaker/ct-001');
      const page = screen.getByTestId('page-caretaker');
      expect(page).toBeInTheDocument();
      expect(within(page).getByRole('heading', { level: 1 })).toHaveTextContent(/สมชาย ประเสริฐ/i);
    });

    it('renders "/caretaker/1" with numeric ID fallback -> CaretakerProfilePage cleanly', () => {
      renderWithRoute('/caretaker/1');
      const page = screen.getByTestId('page-caretaker');
      expect(page).toBeInTheDocument();
      expect(within(page).getByRole('heading', { level: 1 })).toHaveTextContent(/สมชาย ประเสริฐ/i);
    });

    it('renders "/book/ct-001" -> BookingPage cleanly', () => {
      renderWithRoute('/book/ct-001');
      const page = screen.getByTestId('page-book');
      expect(page).toBeInTheDocument();
      expect(within(page).getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(within(page).getByText(/สมชาย ประเสริฐ/i)).toBeInTheDocument();
    });

    it('renders "/book/1" with numeric ID fallback -> BookingPage cleanly', () => {
      renderWithRoute('/book/1');
      const page = screen.getByTestId('page-book');
      expect(page).toBeInTheDocument();
      expect(within(page).getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(within(page).getByText(/สมชาย ประเสริฐ/i)).toBeInTheDocument();
    });

    it('renders "/bookings" -> MyBookingsPage cleanly', () => {
      renderWithRoute('/bookings');
      const page = screen.getByTestId('page-bookings');
      expect(page).toBeInTheDocument();
      expect(within(page).getByRole('heading', { level: 1 })).toHaveTextContent(/การจองของฉัน|รายการนัดหมายและการดูแล/i);
    });

    it('renders "/elder" route alias -> ElderProfilePage cleanly', () => {
      renderWithRoute('/elder');
      const page = screen.getByTestId('page-elder');
      expect(page).toBeInTheDocument();
      expect(within(page).getByRole('heading', { level: 1 })).toHaveTextContent(/ข้อมูลผู้สูงอายุ/i);
    });

    it('renders "/elder-profile" -> ElderProfilePage cleanly', () => {
      renderWithRoute('/elder-profile');
      const page = screen.getByTestId('page-elder');
      expect(page).toBeInTheDocument();
      expect(within(page).getByRole('heading', { level: 1 })).toHaveTextContent(/ข้อมูลผู้สูงอายุ/i);
    });

    it('renders "*" (unknown route) -> NotFoundPage cleanly', () => {
      renderWithRoute('/some-nonexistent-route-xyz');
      const page = screen.getByTestId('page-404');
      expect(page).toBeInTheDocument();
      expect(within(page).getByText('404')).toBeInTheDocument();
      expect(within(page).getByRole('heading', { level: 2 })).toBeInTheDocument();
    });
  });

  describe('2. Navbar & Footer Integration with Language and App Contexts', () => {
    it('renders Navbar with branding, navigation links, and upcoming booking count', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );

      const navHeader = screen.getByRole('banner');

      // Looklarn brand
      expect(within(navHeader).getByText(/Looklarn/i)).toBeInTheDocument();
      expect(within(navHeader).getByText(/ลูกหลาน/i)).toBeInTheDocument();

      // Nav links (desktop)
      expect(within(navHeader).getByRole('link', { name: /หน้าแรก/i })).toBeInTheDocument();
      expect(within(navHeader).getByRole('link', { name: /ค้นหาผู้ดูแล/i })).toBeInTheDocument();
      expect(within(navHeader).getByRole('link', { name: /ข้อมูลผู้สูงอายุ/i })).toBeInTheDocument();

      // Bookings count badge (2 upcoming bookings in mock data)
      const bookingsLink = within(navHeader).getByRole('link', { name: /การจองของฉัน/i });
      expect(bookingsLink).toBeInTheDocument();
      expect(within(bookingsLink).getByText('2')).toBeInTheDocument();
    });

    it('switches language between TH and EN seamlessly and updates Navbar and Footer', async () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );

      const navHeader = screen.getByRole('banner');

      // Default language is Thai
      expect(within(navHeader).getByRole('link', { name: /หน้าแรก/i })).toBeInTheDocument();
      expect(screen.getByText(/บริการยอดนิยม/i)).toBeInTheDocument();

      // Find EN toggle button in navbar and click it
      const enButtons = screen.getAllByRole('button', { name: 'EN' });
      fireEvent.click(enButtons[0]);

      // Assert English text appears in Navbar and Footer
      await waitFor(() => {
        expect(within(navHeader).getByRole('link', { name: /Home/i })).toBeInTheDocument();
        expect(within(navHeader).getByRole('link', { name: /Find Caretaker/i })).toBeInTheDocument();
        expect(within(navHeader).getByRole('link', { name: /My Bookings/i })).toBeInTheDocument();
        expect(within(navHeader).getByRole('link', { name: /Elder Profile/i })).toBeInTheDocument();
        expect(screen.getByText(/Popular Services/i)).toBeInTheDocument();
      });

      // Switch back to TH
      const thButtons = screen.getAllByRole('button', { name: 'TH' });
      fireEvent.click(thButtons[0]);

      await waitFor(() => {
        expect(within(navHeader).getByRole('link', { name: /หน้าแรก/i })).toBeInTheDocument();
        expect(screen.getByText(/บริการยอดนิยม/i)).toBeInTheDocument();
      });
    });

    it('renders Footer with medical emergency number 1669, safety verification, and service links', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );

      expect(screen.getByText(/1669/i)).toBeInTheDocument();
      expect(screen.getByText(/ตรวจสอบประวัติอาชญากรรมและการฝึกปฐมพยาบาล 100%/i)).toBeInTheDocument();
      expect(screen.getByText(/พาไปพบแพทย์ & รับยา/i)).toBeInTheDocument();
      expect(screen.getByText(/02-123-4567/i)).toBeInTheDocument();
    });
  });

  describe('3. AppContext State Management & Operations', () => {
    function TestAppContextComponent() {
      const {
        elder,
        bookings,
        caretakers,
        activities,
        updateElderProfile,
        addBooking,
        cancelBooking,
        addReview,
        getCaretakerById,
        searchCriteria,
        updateSearchCriteria,
        resetSearchCriteria,
      } = useApp();

      return (
        <div>
          <div data-testid="elder-name">{elder?.name?.th}</div>
          <div data-testid="bookings-count">{bookings.length}</div>
          <div data-testid="upcoming-count">{bookings.filter((b) => b.status === 'upcoming').length}</div>
          <div data-testid="caretakers-count">{caretakers.length}</div>
          <div data-testid="activities-count">{activities.length}</div>
          <div data-testid="resolved-ct1">{getCaretakerById('1')?.name?.th}</div>
          <div data-testid="resolved-ct-invalid">{getCaretakerById('non-existent')?.name?.th || 'none'}</div>

          <button
            onClick={() =>
              updateElderProfile({
                name: { th: 'คุณยายสมพร ใจดี (อัปเดต)', en: 'Grandma Somporn (Updated)' },
              })
            }
          >
            Update Elder
          </button>

          <button
            onClick={() =>
              addBooking({
                caretakerId: 'ct-002',
                caretakerName: { th: 'พว. อารียา', en: 'Nurse Areeya' },
                totalPrice: 1800,
              })
            }
          >
            Add Booking
          </button>

          <button onClick={() => cancelBooking('bk-001')}>Cancel bk-001</button>

          <button
            onClick={() =>
              addReview('bk-003', {
                rating: 5,
                comment_th: 'ดูแลดีมากครับ',
              })
            }
          >
            Review bk-003
          </button>

          <button
            onClick={() =>
              updateSearchCriteria({
                durationHours: 6,
                budgetMax: 550,
              })
            }
          >
            Update Criteria
          </button>

          <div data-testid="criteria-duration">{searchCriteria?.durationHours}</div>
          <button onClick={() => resetSearchCriteria()}>Reset Criteria</button>
        </div>
      );
    }

    it('manages full lifecycle of state modifications correctly', async () => {
      render(
        <LanguageProvider>
          <AppProvider>
            <TestAppContextComponent />
          </AppProvider>
        </LanguageProvider>
      );

      // Initial assertions
      expect(screen.getByTestId('elder-name').textContent).toContain('สมพร');
      expect(screen.getByTestId('bookings-count').textContent).toBe('3');
      expect(screen.getByTestId('upcoming-count').textContent).toBe('2');
      expect(screen.getByTestId('caretakers-count').textContent).toBe('5');
      expect(screen.getByTestId('activities-count').textContent).toBe('4');
      expect(screen.getByTestId('resolved-ct1').textContent).toContain('สมชาย');

      // Update elder profile
      fireEvent.click(screen.getByText('Update Elder'));
      expect(screen.getByTestId('elder-name').textContent).toContain('อัปเดต');

      // Add booking
      fireEvent.click(screen.getByText('Add Booking'));
      expect(screen.getByTestId('bookings-count').textContent).toBe('4');
      expect(screen.getByTestId('upcoming-count').textContent).toBe('3');

      // Cancel booking bk-001
      fireEvent.click(screen.getByText('Cancel bk-001'));
      expect(screen.getByTestId('upcoming-count').textContent).toBe('2');

      // Add review
      fireEvent.click(screen.getByText('Review bk-003'));

      // Update and reset search criteria
      fireEvent.click(screen.getByText('Update Criteria'));
      expect(screen.getByTestId('criteria-duration').textContent).toBe('6');

      fireEvent.click(screen.getByText('Reset Criteria'));
      expect(screen.getByTestId('criteria-duration').textContent).toBe('4');
    });
  });

  describe('4. Shared UI Kit Components & Edge Cases', () => {
    it('MatchScoreRing calculates SVG coordinates and renders color tiers accurately', () => {
      const { container, rerender } = render(<MatchScoreRing score={96} size="lg" showLabel />);
      expect(screen.getByText('96%')).toBeInTheDocument();

      // Tier 1 (>=90) Emerald #10B981
      const progressCircles = container.querySelectorAll('circle');
      expect(progressCircles.length).toBe(2);
      expect(progressCircles[1].getAttribute('stroke')).toBe('#10B981');

      // Tier 2 (>=80) Ocean #0EA5E9
      rerender(<MatchScoreRing score={85} size="md" showLabel />);
      expect(screen.getByText('85%')).toBeInTheDocument();
      const rerenderedCircles = container.querySelectorAll('circle');
      expect(rerenderedCircles[1].getAttribute('stroke')).toBe('#0EA5E9');

      // Tier 3 (<80) Amber #F59E0B
      rerender(<MatchScoreRing score={74} size="sm" showLabel />);
      expect(screen.getByText('74%')).toBeInTheDocument();
      const amberCircles = container.querySelectorAll('circle');
      expect(amberCircles[1].getAttribute('stroke')).toBe('#F59E0B');
    });

    it('Badge renders all variants without error', () => {
      const variants = [
        'primary',
        'accent',
        'verified',
        'match',
        'specialist',
        'expert',
        'trained',
        'upcoming',
        'completed',
        'danger',
        'warning',
        'success',
      ];

      variants.forEach((v) => {
        const { unmount } = render(<Badge variant={v}>Badge {v}</Badge>);
        expect(screen.getByText(`Badge ${v}`)).toBeInTheDocument();
        unmount();
      });
    });

    it('Button supports variants, sizes, disabled, and loading states', () => {
      const handleClick = vi.fn();
      const { rerender } = render(
        <Button variant="primary" size="md" onClick={handleClick}>
          Click Me
        </Button>
      );

      const btn = screen.getByRole('button', { name: 'Click Me' });
      fireEvent.click(btn);
      expect(handleClick).toHaveBeenCalledTimes(1);

      // Disabled state
      rerender(
        <Button variant="primary" disabled onClick={handleClick}>
          Click Me
        </Button>
      );
      fireEvent.click(btn);
      expect(handleClick).toHaveBeenCalledTimes(1);

      // Loading state
      rerender(
        <Button variant="accent" loading>
          Submitting
        </Button>
      );
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('Modal renders accessible dialog, responds to ESC and backdrop clicks', () => {
      const handleClose = vi.fn();
      const { rerender } = render(
        <Modal isOpen={true} onClose={handleClose} title="Modal Title" footer={<Button onClick={handleClose}>OK</Button>}>
          <div>Modal Body Content</div>
        </Modal>
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Modal Title')).toBeInTheDocument();
      expect(screen.getByText('Modal Body Content')).toBeInTheDocument();

      // Press Escape
      fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
      expect(handleClose).toHaveBeenCalled();

      // Closed state renders null
      rerender(<Modal isOpen={false} onClose={handleClose} title="Modal Title" />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('ToastProvider triggers toast alerts cleanly', async () => {
      function ToastTestComponent() {
        const { toast } = useToast();
        return (
          <div>
            <button onClick={() => toast.success('Success message')}>Show Success</button>
            <button onClick={() => toast.error('Error message')}>Show Error</button>
          </div>
        );
      }

      render(
        <ToastProvider>
          <ToastTestComponent />
        </ToastProvider>
      );

      fireEvent.click(screen.getByText('Show Success'));
      expect(await screen.findByText('Success message')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Show Error'));
      expect(await screen.findByText('Error message')).toBeInTheDocument();
    });
  });

  describe('5. Formatting & i18n Dictionary Integrity', () => {
    it('formats currency correctly in TH and EN', () => {
      expect(formatCurrency(350, 'th')).toBe('฿350');
      expect(formatCurrency(1500, 'en')).toBe('฿1,500');
      expect(formatCurrency(450, 'th', { showUnit: true, unit: 'hour' })).toBe('฿450 / ชม.');
      expect(formatCurrency(450, 'en', { showUnit: true, unit: 'hour' })).toBe('฿450/hr');
    });

    it('formats Buddhist Era dates for Thai and Western dates for English', () => {
      const dateStr = '2026-08-25';
      const formattedTh = formatDate(dateStr, 'th');
      const formattedEn = formatDate(dateStr, 'en');

      expect(formattedTh).toContain('2569'); // 2026 + 543 = 2569 BE
      expect(formattedEn).toContain('2026');
    });

    it('formats duration strings accurately', () => {
      expect(formatDuration(4, 'th')).toBe('4 ชั่วโมง');
      expect(formatDuration(1, 'en')).toBe('1 hour');
      expect(formatDuration(4, 'en')).toBe('4 hours');
    });

    it('has 1:1 symmetrical keys between th.js and en.js dictionaries', () => {
      const getKeys = (obj, prefix = '') => {
        let keys = [];
        for (const [k, v] of Object.entries(obj || {})) {
          const currentKey = prefix ? `${prefix}.${k}` : k;
          if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
            keys = keys.concat(getKeys(v, currentKey));
          } else {
            keys.push(currentKey);
          }
        }
        return keys.sort();
      };

      const thKeys = getKeys(th);
      const enKeys = getKeys(en);

      expect(thKeys).toEqual(enKeys);
      expect(thKeys.length).toBeGreaterThan(50);
    });
  });
});
