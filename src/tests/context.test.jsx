import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '../context/LanguageContext';
import { AppProvider, useApp } from '../context/AppContext';

describe('React Context State Management', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('LanguageContext', () => {
    const wrapper = ({ children }) => <LanguageProvider>{children}</LanguageProvider>;

    it('defaults to Thai language (th)', () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });
      expect(result.current.language).toBe('th');
    });

    it('toggles language between th and en', () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });
      expect(result.current.language).toBe('th');

      act(() => {
        result.current.toggleLanguage();
      });
      expect(result.current.language).toBe('en');

      act(() => {
        result.current.toggleLanguage();
      });
      expect(result.current.language).toBe('th');
    });

    it('translates nested dot notation and interpolates parameters', () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });

      expect(result.current.t('nav.brandName')).toBe('Looklarn');
      expect(result.current.t('common.reviewsCount', { count: 42 })).toBe('(42 รีวิว)');

      act(() => {
        result.current.setLanguage('en');
      });

      expect(result.current.t('common.reviewsCount', { count: 42 })).toBe('(42 reviews)');
    });

    it('extracts localized values using getLocalized helper', () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });

      const item = {
        name: { th: 'สมชาย', en: 'Somchai' },
        description_th: 'รายละเอียดภาษาไทย',
        description_en: 'English description',
      };

      expect(result.current.getLocalized(item, 'name')).toBe('สมชาย');
      expect(result.current.getLocalized(item, 'description')).toBe('รายละเอียดภาษาไทย');

      act(() => {
        result.current.setLanguage('en');
      });

      expect(result.current.getLocalized(item, 'name')).toBe('Somchai');
      expect(result.current.getLocalized(item, 'description')).toBe('English description');
    });
  });

  describe('AppContext', () => {
    const wrapper = ({ children }) => <AppProvider>{children}</AppProvider>;

    it('loads initial elder, bookings, caretakers, and activities', () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      expect(result.current.elder).toBeDefined();
      expect(result.current.elder.name.th).toBe('นางสมพร ใจดี');
      expect(result.current.bookings.length).toBeGreaterThanOrEqual(3);
      expect(result.current.caretakers.length).toBe(5);
      expect(result.current.activities.length).toBe(4);
    });

    it('adds a new booking successfully', () => {
      const { result } = renderHook(() => useApp(), { wrapper });
      const initialCount = result.current.bookings.length;

      act(() => {
        result.current.addBooking({
          caretakerId: 'ct-001',
          caretakerName: { th: 'สมชาย ประเสริฐ', en: 'Somchai Prasert' },
          durationHours: 4,
          hourlyRate: 350,
        });
      });

      expect(result.current.bookings.length).toBe(initialCount + 1);
      expect(result.current.bookings[0].status).toBe('upcoming');
      expect(result.current.bookings[0].durationHours).toBe(4);
    });

    it('cancels an existing booking', () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      const targetId = result.current.bookings[0].id;

      act(() => {
        result.current.cancelBooking(targetId);
      });

      const updated = result.current.bookings.find((b) => b.id === targetId);
      expect(updated.status).toBe('cancelled');
    });

    it('adds a review to a booking', () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      const targetId = 'bk-001';

      act(() => {
        result.current.addReview(targetId, {
          rating: 5,
          comment_th: 'บริการดีมาก อุ่นใจมาก',
          comment_en: 'Excellent and caring service',
        });
      });

      const updated = result.current.bookings.find((b) => b.id === targetId);
      expect(updated.hasReview).toBe(true);
      expect(updated.reviewRating).toBe(5);
      expect(updated.reviewText.th).toBe('บริการดีมาก อุ่นใจมาก');
    });

    it('updates elder profile reactively', () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      act(() => {
        result.current.updateElderProfile({
          age: 75,
        });
      });

      expect(result.current.elder.age).toBe(75);
    });

    it('updates and resets search criteria', () => {
      const { result } = renderHook(() => useApp(), { wrapper });

      act(() => {
        result.current.updateSearchCriteria({
          activityType: 'park',
          budgetMax: 400,
        });
      });

      expect(result.current.searchCriteria.activityType).toBe('park');
      expect(result.current.searchCriteria.budgetMax).toBe(400);

      act(() => {
        result.current.resetSearchCriteria();
      });

      expect(result.current.searchCriteria.activityType).toBe('hospital');
    });
  });
});
