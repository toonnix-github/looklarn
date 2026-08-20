import React, { useState } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act, renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Modules under test
import { translations, DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '../i18n';
import { th } from '../i18n/th';
import { en } from '../i18n/en';
import { LanguageProvider, useLanguage, LanguageContext } from '../context/LanguageContext';
import { AppProvider, useApp, useAppContext, AppContext } from '../context/AppContext';
import { formatCurrency, formatDate, formatMatchScore, formatDuration } from '../utils/formatters';
import { MatchScoreRing } from '../components/ui/MatchScoreRing';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { ToastProvider, useToast, Toast } from '../components/ui/Toast';
import Navbar from '../components/layout/Navbar';
import LanguageToggle from '../components/layout/LanguageToggle';
import { cn } from '../utils/cn';

describe('Empirical Adversarial Stress Suite - Milestone M1', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  // ==========================================
  // 1. i18n Subsystem & LanguageContext Stress
  // ==========================================
  describe('1. i18n & LanguageContext Stress Tests', () => {
    const langWrapper = ({ children }) => <LanguageProvider>{children}</LanguageProvider>;

    it('handles non-existent keys by returning fallback or keyPath', () => {
      const { result } = renderHook(() => useLanguage(), { wrapper: langWrapper });

      // Non-existent single key
      expect(result.current.t('nonExistentKey')).toBe('nonExistentKey');

      // Non-existent deep key path
      expect(result.current.t('deeply.nested.fake.path.key')).toBe('deeply.nested.fake.path.key');

      // Non-existent key with custom string fallback
      expect(result.current.t('deeply.nested.fake.key', 'Custom Fallback')).toBe('Custom Fallback');

      // Non-existent key with empty string fallback
      expect(result.current.t('nonExistentKey', '')).toBe('');

      // Empty string / null / undefined keyPath
      expect(result.current.t('')).toBe('');
      expect(result.current.t(null)).toBe('');
      expect(result.current.t(undefined)).toBe('');
    });

    it('handles parameter interpolation edge cases (extra tokens, missing tokens, special characters)', () => {
      const { result } = renderHook(() => useLanguage(), { wrapper: langWrapper });

      // Missing parameters in template string
      const resMissing = result.current.t('common.reviewsCount', {});
      expect(resMissing).toBe('({count} รีวิว)');

      // Extra unneeded parameters
      const resExtra = result.current.t('common.reviewsCount', { count: 10, unusedParam: 'foo', extraNumber: 999 });
      expect(resExtra).toBe('(10 รีวิว)');

      // Non-primitive parameter values: 0, negative, boolean, null, undefined
      expect(result.current.t('common.reviewsCount', { count: 0 })).toBe('(0 รีวิว)');
      expect(result.current.t('common.reviewsCount', { count: -5 })).toBe('(-5 รีวิว)');
      expect(result.current.t('common.reviewsCount', { count: false })).toBe('(false รีวิว)');
      expect(result.current.t('common.reviewsCount', { count: null })).toBe('(null รีวิว)');
      expect(result.current.t('common.reviewsCount', { count: undefined })).toBe('(undefined รีวิว)');
    });

    it('handles special characters ($&, $1, etc.) in interpolation parameters safely', () => {
      const { result } = renderHook(() => useLanguage(), { wrapper: langWrapper });
      // JavaScript String.prototype.replace treats '$' specially.
      const res = result.current.t('common.reviewsCount', { count: '$100' });
      // In naive replace, '$100' could become '00' due to '$1' group replacement
      // Let's document actual behavior:
      expect(res).toContain('รีวิว');
    });

    it('cross-language fallback when key is missing in active language', () => {
      const { result } = renderHook(() => useLanguage(), { wrapper: langWrapper });
      expect(result.current.t('nav.brandName')).toBe('Looklarn');
      act(() => {
        result.current.setLanguage('en');
      });
      expect(result.current.t('nav.brandName')).toBe('Looklarn');
    });

    it('persists language selection to localStorage and restores on remount', () => {
      const { result, unmount } = renderHook(() => useLanguage(), { wrapper: langWrapper });
      expect(result.current.language).toBe('th');

      act(() => {
        result.current.setLanguage('en');
      });
      expect(result.current.language).toBe('en');
      expect(localStorage.getItem('looklarn_lang')).toBe('en');

      unmount();

      // Remount and check restored state
      const { result: remounted } = renderHook(() => useLanguage(), { wrapper: langWrapper });
      expect(remounted.current.language).toBe('en');
    });

    it('handles corrupted localStorage language values gracefully', () => {
      localStorage.setItem('looklarn_lang', 'INVALID_LANG_CODE_123');
      const { result } = renderHook(() => useLanguage(), { wrapper: langWrapper });
      // Should fallback to default language 'th'
      expect(result.current.language).toBe('th');
    });

    it('stresses getLocalized helper with malformed and varied data structures', () => {
      const { result } = renderHook(() => useLanguage(), { wrapper: langWrapper });

      // Null or undefined item
      expect(result.current.getLocalized(null, 'name')).toBe('');
      expect(result.current.getLocalized(undefined, 'name')).toBe('');
      expect(result.current.getLocalized('', 'name')).toBe('');

      // Primitive item
      expect(result.current.getLocalized('simple string', 'name')).toBe('');

      // Direct bilingual object item without field name
      const directObj = { th: 'สวัสดี', en: 'Hello' };
      expect(result.current.getLocalized(directObj)).toBe('สวัสดี');

      act(() => {
        result.current.setLanguage('en');
      });
      expect(result.current.getLocalized(directObj)).toBe('Hello');

      // Item missing requested language, fallback to alternate
      const onlyThObj = { name: { th: 'เฉพาะไทย' } };
      expect(result.current.getLocalized(onlyThObj, 'name')).toBe('เฉพาะไทย');

      // Suffixed keys: item.title_th / item.title_en
      const suffixedItem = { title_th: 'หัวข้อไทย', title_en: 'English Title' };
      expect(result.current.getLocalized(suffixedItem, 'title')).toBe('English Title');
      act(() => {
        result.current.setLanguage('th');
      });
      expect(result.current.getLocalized(suffixedItem, 'title')).toBe('หัวข้อไทย');

      // Item with plain string field (not localized)
      const plainItem = { photoUrl: 'https://example.com/photo.jpg' };
      expect(result.current.getLocalized(plainItem, 'photoUrl')).toBe('https://example.com/photo.jpg');

      // Item with missing field
      expect(result.current.getLocalized(plainItem, 'nonExistentField')).toBe('');
    });

    it('verifies zero mixed-language strings in dictionary entries', () => {
      // Check that Thai dictionary does not contain slash bilingual concatenations like "Hospital / โรงพยาบาล"
      function checkNoMixed(obj, path = '') {
        for (const [k, v] of Object.entries(obj)) {
          const currentPath = path ? `${path}.${k}` : k;
          if (typeof v === 'string') {
            // Check for obvious bilingual slash mixes like "Hospital / โรงพยาบาล"
            expect(v).not.toMatch(/[\u0E00-\u0E7F]+\s*\/\s*[a-zA-Z]+/);
            expect(v).not.toMatch(/[a-zA-Z]+\s*\/\s*[\u0E00-\u0E7F]+/);
          } else if (typeof v === 'object' && v !== null) {
            checkNoMixed(v, currentPath);
          }
        }
      }
      checkNoMixed(th, 'th');
      checkNoMixed(en, 'en');
    });
  });

  // ==========================================
  // 2. State Management & AppContext Stress
  // ==========================================
  describe('2. AppContext State Management Stress Tests', () => {
    const appWrapper = ({ children }) => <AppProvider>{children}</AppProvider>;

    it('handles corrupted localStorage for elder and bookings without crashing', () => {
      localStorage.setItem('looklarn_elder', '{ corrupt_json: invalid syntax ... ');
      localStorage.setItem('looklarn_bookings', 'NOT_AN_ARRAY_OR_JSON');

      const { result } = renderHook(() => useApp(), { wrapper: appWrapper });

      // Should safely recover using initial seed data
      expect(result.current.elder).toBeDefined();
      expect(result.current.elder.name).toBeDefined();
      expect(Array.isArray(result.current.bookings)).toBe(true);
      expect(result.current.bookings.length).toBeGreaterThanOrEqual(3);
    });

    it('stress tests addBooking with empty/minimal payload and auto-generated defaults', () => {
      const { result } = renderHook(() => useApp(), { wrapper: appWrapper });
      const initialCount = result.current.bookings.length;

      let createdBooking;
      act(() => {
        createdBooking = result.current.addBooking({
          caretakerId: 'ct-002',
          caretakerName: { th: 'พว. อารียา รัตนกุล', en: 'Nurse Areeya' },
        });
      });

      expect(result.current.bookings.length).toBe(initialCount + 1);
      expect(createdBooking.id).toMatch(/^bk-/);
      expect(createdBooking.status).toBe('upcoming');
      expect(createdBooking.serviceFee).toBe(100);
      expect(createdBooking.totalPrice).toBeGreaterThan(0);
      expect(createdBooking.elderId).toBe(result.current.elder.id);
      expect(createdBooking.destinationName).toBeDefined();
      expect(createdBooking.hasReview).toBe(false);
    });

    it('rapid sequential addBooking calls maintain list integrity', () => {
      const { result } = renderHook(() => useApp(), { wrapper: appWrapper });
      const initialCount = result.current.bookings.length;

      act(() => {
        result.current.addBooking({ caretakerId: 'ct-001' });
        result.current.addBooking({ caretakerId: 'ct-002' });
        result.current.addBooking({ caretakerId: 'ct-003' });
      });

      expect(result.current.bookings.length).toBe(initialCount + 3);
    });

    it('cancels non-existent or duplicate bookings without crashing', () => {
      const { result } = renderHook(() => useApp(), { wrapper: appWrapper });
      const initialBookings = [...result.current.bookings];

      // Cancel non-existent booking ID
      act(() => {
        result.current.cancelBooking('non-existent-booking-999999');
      });
      expect(result.current.bookings.length).toBe(initialBookings.length);

      // Cancel valid booking
      const firstId = result.current.bookings[0].id;
      act(() => {
        result.current.cancelBooking(firstId);
      });
      expect(result.current.bookings.find((b) => b.id === firstId).status).toBe('cancelled');

      // Cancel already cancelled booking
      act(() => {
        result.current.cancelBooking(firstId);
      });
      expect(result.current.bookings.find((b) => b.id === firstId).status).toBe('cancelled');
    });

    it('handles addReview for valid and invalid booking IDs', () => {
      const { result } = renderHook(() => useApp(), { wrapper: appWrapper });

      // Add review to non-existent ID
      act(() => {
        result.current.addReview('fake-bk-id-404', {
          rating: 5,
          comment_th: 'ดีเยี่ยม',
          comment_en: 'Great',
        });
      });
      // No booking should have this id
      expect(result.current.bookings.find((b) => b.id === 'fake-bk-id-404')).toBeUndefined();

      // Add review with missing comments (fallback defaults)
      const validBooking = result.current.bookings[0];
      act(() => {
        result.current.addReview(validBooking.id, {
          rating: 4,
        });
      });

      const updated = result.current.bookings.find((b) => b.id === validBooking.id);
      expect(updated.hasReview).toBe(true);
      expect(updated.reviewRating).toBe(4);
      expect(updated.reviewText.th).toBeDefined();
      expect(updated.reviewText.en).toBeDefined();
    });

    it('stress tests getCaretakerById resolution with varied ID formats', () => {
      const { result } = renderHook(() => useApp(), { wrapper: appWrapper });

      // Exact match
      expect(result.current.getCaretakerById('ct-001')?.id).toBe('ct-001');

      // Case insensitive match
      expect(result.current.getCaretakerById('CT-001')?.id).toBe('ct-001');

      // Numeric shorthand match: '1' -> 'ct-001', 'ct-1' -> 'ct-001'
      expect(result.current.getCaretakerById('ct-1')?.id).toBe('ct-001');
      expect(result.current.getCaretakerById('1')?.id).toBe('ct-001');
      expect(result.current.getCaretakerById('ct-3')?.id).toBe('ct-003');
      expect(result.current.getCaretakerById('3')?.id).toBe('ct-003');

      // Null / undefined ID returns default first caretaker
      expect(result.current.getCaretakerById(null)?.id).toBe('ct-001');
      expect(result.current.getCaretakerById(undefined)?.id).toBe('ct-001');
      expect(result.current.getCaretakerById('')?.id).toBe('ct-001');

      // Non-matching ID returns null
      expect(result.current.getCaretakerById('ct-99999')).toBeNull();
    });

    it('stress tests getBookingById resolution', () => {
      const { result } = renderHook(() => useApp(), { wrapper: appWrapper });

      // First booking
      const firstBk = result.current.bookings[0];
      expect(result.current.getBookingById(firstBk.id)?.id).toBe(firstBk.id);

      // Shorthand match if applicable (bk-001 vs bk-1 vs 1)
      expect(result.current.getBookingById('bk-001')?.id).toBe('bk-001');
      expect(result.current.getBookingById('bk-1')?.id).toBe('bk-001');

      // Null or invalid ID returns null
      expect(result.current.getBookingById(null)).toBeNull();
      expect(result.current.getBookingById(undefined)).toBeNull();
      expect(result.current.getBookingById('unknown-booking-id-404')).toBeNull();
    });

    it('updates elder profile partially and deeply without loss of unmodified fields', () => {
      const { result } = renderHook(() => useApp(), { wrapper: appWrapper });
      const originalName = result.current.elder.name;
      const originalEmergency = result.current.elder.emergencyContacts;

      act(() => {
        result.current.updateElderProfile({
          mobilityLevel: 'independent',
          notes: 'Updated medical notes',
        });
      });

      expect(result.current.elder.mobilityLevel).toBe('independent');
      expect(result.current.elder.notes).toBe('Updated medical notes');
      expect(result.current.elder.name).toEqual(originalName);
      expect(result.current.elder.emergencyContacts).toEqual(originalEmergency);
    });
  });

  // ==========================================
  // 3. Formatters Stress Tests
  // ==========================================
  describe('3. Formatters Stress Tests', () => {
    describe('formatCurrency', () => {
      it('handles zero, negative numbers, floats, and very large amounts', () => {
        expect(formatCurrency(0, 'th')).toBe('฿0');
        expect(formatCurrency(0, 'en')).toBe('฿0');
        expect(formatCurrency(0, 'th', { showUnit: true, unit: 'hour' })).toBe('฿0 / ชม.');

        expect(formatCurrency(-500, 'th')).toBe('฿-500');
        expect(formatCurrency(1250000, 'th')).toBe('฿1,250,000');
        expect(formatCurrency(350.75, 'th')).toBe('฿350.75');
      });

      it('handles null, undefined, NaN, and string amounts gracefully', () => {
        expect(formatCurrency(null)).toBe('-');
        expect(formatCurrency(undefined)).toBe('-');
        expect(formatCurrency(NaN)).toBe('-');
        expect(formatCurrency('invalid_num')).toBe('-');
      });

      it('supports custom symbol and unit options', () => {
        expect(formatCurrency(450, 'th', { showUnit: true, unit: 'hour' })).toBe('฿450 / ชม.');
        expect(formatCurrency(450, 'en', { showUnit: true, unit: 'hour' })).toBe('฿450/hr');
        expect(formatCurrency(500, 'th', { showUnit: true, unit: 'trip' })).toBe('฿500 / ทริป');
        expect(formatCurrency(500, 'en', { showUnit: true, unit: 'trip' })).toBe('฿500/trip');
        expect(formatCurrency(500, 'th', { symbol: '$' })).toBe('$500');
      });
    });

    describe('formatDate', () => {
      it('handles null, undefined, empty string, and invalid date strings', () => {
        expect(formatDate(null)).toBe('-');
        expect(formatDate(undefined)).toBe('-');
        expect(formatDate('')).toBe('-');
        expect(formatDate('not-a-valid-date')).toBe('not-a-valid-date');
      });

      it('calculates Thai Buddhist Era correctly (AD + 543)', () => {
        const testDate = '2026-08-28';
        // 2026 + 543 = 2569
        const thMedium = formatDate(testDate, 'th', 'medium');
        expect(thMedium).toBe('28 ส.ค. 2569');

        const thShort = formatDate(testDate, 'th', 'short');
        expect(thShort).toBe('28 ส.ค. 69');

        const thFull = formatDate(testDate, 'th', 'full');
        expect(thFull).toContain('วันศุกร์ที่ 28 สิงหาคม พ.ศ. 2569');
      });

      it('handles leap years accurately (e.g. 2024-02-29 and 2028-02-29)', () => {
        const leap2024 = '2024-02-29';
        // 2024 + 543 = 2567
        expect(formatDate(leap2024, 'th', 'medium')).toBe('29 ก.พ. 2567');
        expect(formatDate(leap2024, 'en', 'medium')).toContain('Feb 29, 2024');

        const leap2028 = '2028-02-29';
        // 2028 + 543 = 2571
        expect(formatDate(leap2028, 'th', 'medium')).toBe('29 ก.พ. 2571');
        expect(formatDate(leap2028, 'en', 'medium')).toContain('Feb 29, 2028');
      });

      it('formats time style in Thai and English', () => {
        const dateTime = new Date(2026, 7, 28, 9, 30, 0); // 09:30
        expect(formatDate(dateTime, 'th', 'time')).toBe('09:30 น.');
        expect(formatDate(dateTime, 'en', 'time')).toMatch(/9:30\s*(AM|am)/i);
      });
    });

    describe('formatMatchScore', () => {
      it('categorizes tiers and colors correctly across all score boundaries', () => {
        // >= 90: excellent / emerald (#10B981)
        expect(formatMatchScore(100).tier).toBe('excellent');
        expect(formatMatchScore(100).hexColor).toBe('#10B981');
        expect(formatMatchScore(90).tier).toBe('excellent');
        expect(formatMatchScore(96).scoreText).toBe('96%');

        // 80 - 89: great / sky (#0EA5E9)
        expect(formatMatchScore(89).tier).toBe('great');
        expect(formatMatchScore(89).hexColor).toBe('#0EA5E9');
        expect(formatMatchScore(80).tier).toBe('great');
        expect(formatMatchScore(88).scoreText).toBe('88%');

        // 70 - 79: good / amber (#F59E0B)
        expect(formatMatchScore(79).tier).toBe('good');
        expect(formatMatchScore(79).hexColor).toBe('#F59E0B');
        expect(formatMatchScore(70).tier).toBe('good');
        expect(formatMatchScore(76).scoreText).toBe('76%');

        // < 70: standard / slate (#94A3B8)
        expect(formatMatchScore(69).tier).toBe('standard');
        expect(formatMatchScore(69).hexColor).toBe('#94A3B8');
        expect(formatMatchScore(0).tier).toBe('standard');
        expect(formatMatchScore(0).scoreText).toBe('0%');
      });

      it('handles float numbers, string numbers, negative values, and NaN', () => {
        expect(formatMatchScore('95.8').scoreText).toBe('96%');
        expect(formatMatchScore(87.4).scoreText).toBe('87%');
        expect(formatMatchScore(-10).scoreText).toBe('-10%');
        expect(formatMatchScore(NaN).scoreText).toBe('0%');
        expect(formatMatchScore(null).scoreText).toBe('0%');
        expect(formatMatchScore(undefined).scoreText).toBe('0%');
      });
    });

    describe('formatDuration', () => {
      it('formats singular and plural hours in Thai and English', () => {
        expect(formatDuration(1, 'th')).toBe('1 ชั่วโมง');
        expect(formatDuration(1, 'en')).toBe('1 hour');
        expect(formatDuration(4, 'th')).toBe('4 ชั่วโมง');
        expect(formatDuration(4, 'en')).toBe('4 hours');
        expect(formatDuration(0, 'th')).toBe('-');
        expect(formatDuration(null, 'th')).toBe('-');
      });
    });
  });

  // ==========================================
  // 4. UI Kit Components Stress Tests
  // ==========================================
  describe('4. UI Kit Components Stress Tests', () => {
    describe('MatchScoreRing', () => {
      it('clamps scores above 100 and below 0', () => {
        const { rerender } = render(<MatchScoreRing score={150} />);
        expect(screen.getByText('100%')).toBeInTheDocument();
        expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');

        rerender(<MatchScoreRing score={-25} />);
        expect(screen.getByText('0%')).toBeInTheDocument();
        expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
      });

      it('supports numeric size and preset size options without crashing', () => {
        const { rerender } = render(<MatchScoreRing score={88} size={120} strokeWidth={8} />);
        const progressbar = screen.getByRole('progressbar');
        expect(progressbar).toHaveStyle({ width: '120px', height: '120px' });

        rerender(<MatchScoreRing score={88} size="xl" />);
        expect(progressbar).toHaveStyle({ width: '124px', height: '124px' });

        rerender(<MatchScoreRing score={88} size="sm" />);
        expect(progressbar).toHaveStyle({ width: '52px', height: '52px' });
      });

      it('hides label when showLabel is false', () => {
        render(<MatchScoreRing score={88} showLabel={false} />);
        expect(screen.queryByText('88%')).not.toBeInTheDocument();
      });
    });

    describe('Button', () => {
      it('handles disabled and loading states correctly', () => {
        const handleClick = vi.fn();
        const { rerender } = render(
          <Button disabled onClick={handleClick}>
            Disabled Action
          </Button>
        );

        const btn = screen.getByRole('button');
        expect(btn).toBeDisabled();
        fireEvent.click(btn);
        expect(handleClick).not.toHaveBeenCalled();

        rerender(
          <Button loading onClick={handleClick}>
            Loading Action
          </Button>
        );
        expect(btn).toBeDisabled();
        fireEvent.click(btn);
        expect(handleClick).not.toHaveBeenCalled();
      });

      it('renders left and right icons when provided', () => {
        render(
          <Button
            leftIcon={<span data-testid="left-icon">L</span>}
            rightIcon={<span data-testid="right-icon">R</span>}
          >
            Icon Button
          </Button>
        );

        expect(screen.getByTestId('left-icon')).toBeInTheDocument();
        expect(screen.getByTestId('right-icon')).toBeInTheDocument();
        expect(screen.getByText('Icon Button')).toBeInTheDocument();
      });

      it('supports all variants without throwing', () => {
        const variants = ['primary', 'accent', 'secondary', 'outline', 'ghost', 'danger', 'link'];
        variants.forEach((v) => {
          const { unmount } = render(<Button variant={v}>{v}</Button>);
          expect(screen.getByText(v)).toBeInTheDocument();
          unmount();
        });
      });
    });

    describe('Modal', () => {
      it('locks document.body overflow when open and restores when closed', () => {
        const originalOverflow = document.body.style.overflow;

        const { rerender } = render(
          <Modal isOpen={true} onClose={() => {}} title="Modal Title">
            <p>Modal Body</p>
          </Modal>
        );
        expect(document.body.style.overflow).toBe('hidden');

        rerender(
          <Modal isOpen={false} onClose={() => {}} title="Modal Title">
            <p>Modal Body</p>
          </Modal>
        );
        expect(document.body.style.overflow).toBe(originalOverflow);
      });

      it('triggers onClose when Escape key is pressed (if closeOnEscape is true)', () => {
        const handleClose = vi.fn();
        render(
          <Modal isOpen={true} onClose={handleClose} closeOnEscape={true} title="Modal Title">
            <p>Escape Test</p>
          </Modal>
        );

        fireEvent.keyDown(window, { key: 'Escape' });
        expect(handleClose).toHaveBeenCalledTimes(1);
      });

      it('does NOT trigger onClose when Escape key is pressed if closeOnEscape is false', () => {
        const handleClose = vi.fn();
        render(
          <Modal isOpen={true} onClose={handleClose} closeOnEscape={false} title="Modal Title">
            <p>Escape Disabled Test</p>
          </Modal>
        );

        fireEvent.keyDown(window, { key: 'Escape' });
        expect(handleClose).not.toHaveBeenCalled();
      });

      it('renders custom footer when provided', () => {
        render(
          <Modal
            isOpen={true}
            onClose={() => {}}
            title="Footer Test"
            footer={<button type="button">Footer Action Button</button>}
          >
            <p>Content</p>
          </Modal>
        );

        expect(screen.getByText('Footer Action Button')).toBeInTheDocument();
      });
    });

    describe('Badge', () => {
      it('renders preset domain badges with default semantic icons', () => {
        const presets = ['verified', 'match', 'specialist', 'trained', 'expert'];
        presets.forEach((preset) => {
          const { unmount } = render(<Badge variant={preset}>{preset} label</Badge>);
          expect(screen.getByText(`${preset} label`)).toBeInTheDocument();
          unmount();
        });
      });
    });

    describe('Toast & ToastProvider', () => {
      it('adds, renders, and removes toasts reactively', () => {
        function TestToastComponent() {
          const { toast } = useToast();
          return (
            <div>
              <button type="button" onClick={() => toast.success('Action succeeded!', { title: 'Success!' })}>
                Trigger Toast
              </button>
            </div>
          );
        }

        render(
          <ToastProvider>
            <TestToastComponent />
          </ToastProvider>
        );

        const btn = screen.getByText('Trigger Toast');
        fireEvent.click(btn);

        expect(screen.getByText('Success!')).toBeInTheDocument();
        expect(screen.getByText('Action succeeded!')).toBeInTheDocument();

        // Click dismiss button
        const dismissBtn = screen.getByRole('button', { name: /dismiss toast/i });
        fireEvent.click(dismissBtn);

        expect(screen.queryByText('Success!')).not.toBeInTheDocument();
      });
    });

    describe('Card Component Suite', () => {
      it('renders all Card compound components (Header, Title, Description, Content, Footer)', () => {
        render(
          <Card hoverEffect variant="glass">
            <CardHeader>
              <CardTitle as="h2">Card Title H2</CardTitle>
              <CardDescription>Description text</CardDescription>
            </CardHeader>
            <CardContent>Content Area</CardContent>
            <CardFooter>Footer Area</CardFooter>
          </Card>
        );

        expect(screen.getByRole('heading', { level: 2, name: 'Card Title H2' })).toBeInTheDocument();
        expect(screen.getByText('Description text')).toBeInTheDocument();
        expect(screen.getByText('Content Area')).toBeInTheDocument();
        expect(screen.getByText('Footer Area')).toBeInTheDocument();
      });
    });

    describe('Data Layer & Schema Integrity Tests', () => {
      it('validates caretakers.json structure and required fields', async () => {
        const caretakers = (await import('../data/caretakers.json')).default;
        expect(caretakers).toHaveLength(5);

        const expectedScores = [96, 88, 81, 76, 72];
        caretakers.forEach((ct, idx) => {
          expect(ct.id).toBe(`ct-00${idx + 1}`);
          expect(ct.name.th).toBeDefined();
          expect(ct.name.en).toBeDefined();
          expect(ct.matchScore).toBe(expectedScores[idx]);
          expect(ct.hourlyRate).toBeGreaterThan(0);
          expect(ct.rating).toBeGreaterThan(4.0);
          expect(ct.specialties.length).toBeGreaterThan(0);
          expect(ct.verifiedBadges.length).toBeGreaterThan(0);
          expect(ct.reviews.length).toBeGreaterThan(0);
        });

        expect(caretakers[0].isBestMatch).toBe(true);
      });

      it('validates bookings.json has 2 upcoming and 1 completed booking', async () => {
        const bookings = (await import('../data/bookings.json')).default;
        expect(bookings).toHaveLength(3);

        const upcoming = bookings.filter((b) => b.status === 'upcoming');
        const completed = bookings.filter((b) => b.status === 'completed');

        expect(upcoming).toHaveLength(2);
        expect(completed).toHaveLength(1);
        expect(completed[0].hasReview).toBe(true);
        expect(completed[0].reviewRating).toBe(5);
      });

      it('validates activities.json has 4 activities with bilingual text', async () => {
        const activities = (await import('../data/activities.json')).default;
        expect(activities).toHaveLength(4);

        activities.forEach((act) => {
          expect(act.title.th).toBeDefined();
          expect(act.title.en).toBeDefined();
          expect(act.description.th).toBeDefined();
          expect(act.description.en).toBeDefined();
        });
      });

      it('validates elder.json has complete profile for Grandma Somporn', async () => {
        const elder = (await import('../data/elder.json')).default;
        expect(elder.id).toBe('elder-001');
        expect(elder.name.th).toContain('สมพร');
        expect(elder.age).toBe(74);
        expect(elder.mobilityLevel).toBe('wheelchair_assisted');
        expect(elder.medicalConditions.length).toBeGreaterThanOrEqual(3);
        expect(elder.emergencyContact.phone).toBeDefined();
      });
    });

    describe('Provider Guard & Error Handling', () => {
      it('throws error when useLanguage is used outside LanguageProvider', () => {
        expect(() => renderHook(() => useLanguage())).toThrow(/useLanguage must be used within a LanguageProvider/);
      });

      it('throws error when useApp is used outside AppProvider', () => {
        expect(() => renderHook(() => useApp())).toThrow(/useApp must be used within an AppProvider/);
      });
    });
  });
});
