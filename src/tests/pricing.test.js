import { describe, expect, it } from 'vitest';
import {
  APPOINTMENT_EVENTS,
  CARETAKER_REQUIREMENTS,
  ELDER_MOBILITY,
} from '../constants/careEnums';
import { calculateCarePrice, SERVICE_DURATIONS } from '../utils/pricing';

describe('calculateCarePrice', () => {
  it('uses the standard half-day base price instead of a caretaker-specific rate', () => {
    const quote = calculateCarePrice({
      date: '2026-08-28',
      timeSlot: 'morning',
      durationHours: 4,
      activityType: APPOINTMENT_EVENTS.TEMPLE,
      mobility: ELDER_MOBILITY.INDEPENDENT,
    });

    expect(quote.durationType).toBe(SERVICE_DURATIONS.HALF_DAY);
    expect(quote.basePrice).toBe(650);
    expect(quote.totalPrice).toBe(650);
  });

  it('uses the standard full-day base price and discounts weekends', () => {
    const quote = calculateCarePrice({
      date: '2026-08-29',
      timeSlot: 'full_day',
      durationHours: 8,
      activityType: APPOINTMENT_EVENTS.TEMPLE,
      mobility: ELDER_MOBILITY.INDEPENDENT,
    });

    expect(quote.durationType).toBe(SERVICE_DURATIONS.FULL_DAY);
    expect(quote.basePrice).toBe(1000);
    expect(quote.weekendHolidayDiscount).toBe(100);
    expect(quote.totalPrice).toBe(900);
  });

  it('adds activity difficulty, mobility, and caretaker requirement surcharges', () => {
    const quote = calculateCarePrice({
      date: '2026-08-28',
      timeSlot: 'morning',
      durationHours: 4,
      activityType: APPOINTMENT_EVENTS.HOSPITAL,
      mobility: ELDER_MOBILITY.WHEELCHAIR_ASSISTED,
      caretakerRequirements: [
        CARETAKER_REQUIREMENTS.CAR_AVAILABLE,
        CARETAKER_REQUIREMENTS.VITAL_SIGNS,
      ],
    });

    expect(quote.basePrice).toBe(650);
    expect(quote.activitySurcharge).toBe(250);
    expect(quote.mobilitySurcharge).toBe(100);
    expect(quote.requirementSurcharge).toBe(225);
    expect(quote.totalPrice).toBe(1225);
  });
});
