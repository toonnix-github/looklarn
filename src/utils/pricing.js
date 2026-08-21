import {
  APPOINTMENT_EVENTS,
  CARETAKER_REQUIREMENTS,
  ELDER_MOBILITY,
} from '../constants/careEnums';

export const SERVICE_DURATIONS = Object.freeze({
  HALF_DAY: 'half_day',
  FULL_DAY: 'full_day',
});

export const BASE_SERVICE_PRICE = Object.freeze({
  [SERVICE_DURATIONS.HALF_DAY]: 650,
  [SERVICE_DURATIONS.FULL_DAY]: 1000,
});

const ACTIVITY_SURCHARGE = Object.freeze({
  [APPOINTMENT_EVENTS.INPATIENT_WATCH]: 300,
  [APPOINTMENT_EVENTS.HOSPITAL]: 250,
  [APPOINTMENT_EVENTS.PHYSICAL_THERAPY]: 150,
  [APPOINTMENT_EVENTS.GOVERNMENT_OFFICE]: 100,
  [APPOINTMENT_EVENTS.BANK]: 75,
  [APPOINTMENT_EVENTS.PHARMACY]: 50,
  [APPOINTMENT_EVENTS.TOUR]: 50,
  [APPOINTMENT_EVENTS.SHOPPING]: 50,
  [APPOINTMENT_EVENTS.FAMILY_EVENT]: 50,
  [APPOINTMENT_EVENTS.TEMPLE]: 0,
  [APPOINTMENT_EVENTS.PARK]: 0,
  [APPOINTMENT_EVENTS.DINING]: 0,
  [APPOINTMENT_EVENTS.HOME_VISIT]: 0,
});

const MOBILITY_SURCHARGE = Object.freeze({
  [ELDER_MOBILITY.WHEELCHAIR_ASSISTED]: 100,
  [ELDER_MOBILITY.FULL_ASSISTANCE]: 200,
  [ELDER_MOBILITY.BED_BOUND]: 200,
  [ELDER_MOBILITY.ASSISTED_WALKING]: 75,
  [ELDER_MOBILITY.WALKER]: 50,
  [ELDER_MOBILITY.CANE]: 25,
  [ELDER_MOBILITY.INDEPENDENT]: 0,
});

const REQUIREMENT_SURCHARGE = Object.freeze({
  [CARETAKER_REQUIREMENTS.WHEELCHAIR_EXPERIENCE]: 100,
  [CARETAKER_REQUIREMENTS.HOSPITAL_ESCORT]: 75,
  [CARETAKER_REQUIREMENTS.VITAL_SIGNS]: 75,
  [CARETAKER_REQUIREMENTS.FIRST_AID]: 50,
  [CARETAKER_REQUIREMENTS.GENTLE_TRANSFER]: 75,
  [CARETAKER_REQUIREMENTS.CAN_LIFT_SUPPORT]: 100,
  [CARETAKER_REQUIREMENTS.STAIR_ASSISTANCE]: 75,
  [CARETAKER_REQUIREMENTS.CAR_AVAILABLE]: 150,
  [CARETAKER_REQUIREMENTS.LARGE_CAR]: 200,
  [CARETAKER_REQUIREMENTS.CAN_WAIT_LONG_QUEUE]: 50,
  [CARETAKER_REQUIREMENTS.DOCUMENT_HELP]: 50,
  [CARETAKER_REQUIREMENTS.PAYMENT_HELP]: 50,
  [CARETAKER_REQUIREMENTS.DIABETES_AWARE]: 50,
  [CARETAKER_REQUIREMENTS.BLOOD_PRESSURE_AWARE]: 50,
  [CARETAKER_REQUIREMENTS.DEMENTIA_AWARE]: 100,
  [CARETAKER_REQUIREMENTS.FALL_RISK_AWARE]: 75,
  [CARETAKER_REQUIREMENTS.PHOTO_UPDATE]: 25,
});

const THAI_PUBLIC_HOLIDAYS_2026 = Object.freeze([
  '2026-01-01',
  '2026-02-22',
  '2026-04-06',
  '2026-04-13',
  '2026-04-14',
  '2026-04-15',
  '2026-05-01',
  '2026-05-04',
  '2026-05-31',
  '2026-06-03',
  '2026-07-28',
  '2026-08-12',
  '2026-10-13',
  '2026-10-23',
  '2026-12-05',
  '2026-12-10',
  '2026-12-31',
]);

export const getServiceDurationType = ({ timeSlot, durationHours } = {}) => {
  if (timeSlot === 'full_day' || Number(durationHours) >= 8) {
    return SERVICE_DURATIONS.FULL_DAY;
  }
  return SERVICE_DURATIONS.HALF_DAY;
};

export const isWeekendOrHoliday = (date, holidayDates = THAI_PUBLIC_HOLIDAYS_2026) => {
  if (!date) return false;
  const normalizedDate = String(date).slice(0, 10);
  const parsed = new Date(`${normalizedDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return false;
  const day = parsed.getDay();
  return day === 0 || day === 6 || holidayDates.includes(normalizedDate);
};

export const calculateCarePrice = (criteria = {}) => {
  const durationType = getServiceDurationType(criteria);
  const basePrice = BASE_SERVICE_PRICE[durationType];
  const weekendHolidayDiscount = isWeekendOrHoliday(criteria.date)
    ? durationType === SERVICE_DURATIONS.FULL_DAY
      ? 100
      : 50
    : 0;
  const activitySurcharge = ACTIVITY_SURCHARGE[criteria.activityType] || 0;
  const mobilitySurcharge = MOBILITY_SURCHARGE[criteria.mobility] || 0;
  const requirementSurcharge = (criteria.caretakerRequirements || []).reduce(
    (sum, requirement) => sum + (REQUIREMENT_SURCHARGE[requirement] || 0),
    0
  );
  const subtotal = Math.max(
    0,
    basePrice + activitySurcharge + mobilitySurcharge + requirementSurcharge - weekendHolidayDiscount
  );

  return {
    durationType,
    basePrice,
    activitySurcharge,
    mobilitySurcharge,
    requirementSurcharge,
    weekendHolidayDiscount,
    serviceFee: 0,
    subtotal,
    totalPrice: subtotal,
  };
};

export const formatServicePrice = (amount) => `฿${Number(amount || 0).toLocaleString('th-TH')}`;
