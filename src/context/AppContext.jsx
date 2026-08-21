import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import initialCaretakers from '../data/caretakers.json';
import initialBookings from '../data/bookings.json';
import initialActivities from '../data/activities.json';
import initialElder from '../data/elder.json';
import { APPOINTMENT_EVENTS, ELDER_MOBILITY, MEDICAL_CONDITIONS } from '../constants/careEnums';
import { calculateCarePrice } from '../utils/pricing';

export const AppContext = createContext();

const defaultSearchCriteria = {
  mobility: ELDER_MOBILITY.WHEELCHAIR_ASSISTED,
  conditions: [
    MEDICAL_CONDITIONS.HYPERTENSION,
    MEDICAL_CONDITIONS.DIABETES_TYPE_2,
    MEDICAL_CONDITIONS.KNEE_OSTEOARTHRITIS,
  ],
  needsMedicationReminder: true,
  specialCareType: 'none',
  activityType: APPOINTMENT_EVENTS.HOSPITAL,
  language: 'Thai',
  religion: 'Buddhism',
  dietary: 'low_sodium',
  genderPref: 'any',
  date: '2026-08-28',
  timeSlot: 'morning',
  durationHours: 4,
  pickupAddress: '128/4 ซอยสุขุมวิท 39 แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ 10110',
  destination: 'โรงพยาบาลศิริราช อาคารนวมินทรบพิตร ๘๔ พรรษา',
  specialNotes: 'คุณยายเดินช้าและใช้วีลแชร์ ต้องการคนช่วยถือของและคอยดูแลเรื่องคิวพบแพทย์'
};

export const AppProvider = ({ children }) => {
  // 1. Elder Profile State
  const [elder, setElder] = useState(() => {
    try {
      const saved = localStorage.getItem('looklarn_elder');
      return saved ? JSON.parse(saved) : initialElder;
    } catch {
      return initialElder;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('looklarn_elder', JSON.stringify(elder));
    } catch (e) {
      console.warn('Unable to persist elder profile to localStorage', e);
    }
  }, [elder]);

  const updateElderProfile = (updatedFields) => {
    setElder((prev) => ({
      ...prev,
      ...updatedFields,
    }));
  };

  // 2. Bookings State
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('looklarn_bookings');
      return saved ? JSON.parse(saved) : initialBookings;
    } catch {
      return initialBookings;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('looklarn_bookings', JSON.stringify(bookings));
    } catch (e) {
      console.warn('Unable to persist bookings to localStorage', e);
    }
  }, [bookings]);

  const addBooking = (newBookingData) => {
    const newId = `bk-${String(Date.now()).slice(-4)}`;
    const priceQuote = newBookingData.priceQuote || calculateCarePrice({
      activityType: newBookingData.activityType,
      date: newBookingData.serviceDate,
      timeSlot: newBookingData.timeSlot,
      durationHours: newBookingData.durationHours,
      mobility: newBookingData.mobility || elder.mobilityLevel,
      caretakerRequirements: newBookingData.caretakerRequirements || [],
    });
    const serviceFee = newBookingData.serviceFee ?? priceQuote.serviceFee ?? 0;
    const basePrice = newBookingData.basePrice ?? priceQuote.subtotal;
    const totalPrice = newBookingData.totalPrice ?? Math.max(0, basePrice + serviceFee - (newBookingData.discount || 0));
    const formattedBooking = {
      id: newId,
      status: 'upcoming',
      serviceDate: newBookingData.serviceDate || new Date().toISOString().split('T')[0],
      timeSlot: newBookingData.timeSlot || '09:00 - 13:00',
      durationHours: newBookingData.durationHours || 4,
      activityType: newBookingData.activityType || APPOINTMENT_EVENTS.HOSPITAL,
      activityTitle: newBookingData.activityTitle || {
        th: 'บริการพาพบแพทย์และดูแลผู้สูงอายุ',
        en: 'Senior Escort & Medical Outing Service',
      },
      caretakerId: newBookingData.caretakerId,
      caretakerName: newBookingData.caretakerName,
      caretakerNickname: newBookingData.caretakerNickname,
      caretakerPhoto: newBookingData.caretakerPhoto,
      caretakerPhone: newBookingData.caretakerPhone || '089-000-1122',
      elderId: elder.id,
      elderName: elder.name,
      destinationName: newBookingData.destinationName || {
        th: newBookingData.destination || 'จุดหมายปลายทางตามที่นัดหมาย',
        en: newBookingData.destination || 'Selected Destination',
      },
      destinationAddress: newBookingData.destinationAddress || {
        th: newBookingData.destination || 'กรุงเทพมหานคร',
        en: newBookingData.destination || 'Bangkok',
      },
      pickupAddress: newBookingData.pickupAddress || elder.address,
      basePrice,
      serviceFee,
      discount: newBookingData.discount || 0,
      totalPrice,
      priceQuote,
      paymentMethod: newBookingData.paymentMethod || 'promptpay',
      paymentMethodName: newBookingData.paymentMethodName || {
        th: 'พร้อมเพย์ QR Code',
        en: 'PromptPay QR Code',
      },
      paymentStatus: 'paid',
      meetingPoint: newBookingData.meetingPoint || {
        th: 'จุดนัดพบตามที่ระบุ',
        en: 'Designated Meeting Point',
      },
      notes: newBookingData.notes || {
        th: newBookingData.specialNotes || 'ดูแลด้วยความระมัดระวัง',
        en: newBookingData.specialNotes || 'Please handle with care',
      },
      hasReview: false,
    };

    setBookings((prev) => [formattedBooking, ...prev]);
    return formattedBooking;
  };

  const cancelBooking = (bookingId) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    );
  };

  const addReview = (bookingId, { rating, comment_th, comment_en }) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          return {
            ...b,
            hasReview: true,
            reviewRating: rating,
            reviewText: {
              th: comment_th || 'บริการดีมาก สุภาพและตรงเวลา',
              en: comment_en || 'Excellent companion, polite and punctual.',
            },
          };
        }
        return b;
      })
    );
  };

  // 3. Search Criteria & Filter State
  const [searchCriteria, setSearchCriteria] = useState(defaultSearchCriteria);

  const updateSearchCriteria = (fields) => {
    setSearchCriteria((prev) => ({
      ...prev,
      ...fields,
    }));
  };

  const resetSearchCriteria = () => {
    setSearchCriteria(defaultSearchCriteria);
  };

  // 4. Caretakers & Activities Static Accessors
  const [caretakers] = useState(initialCaretakers);
  const [activities] = useState(initialActivities);

  const getCaretakerById = (id) => {
    if (!id) return caretakers[0] || null;
    const cleanId = String(id).toLowerCase();
    return (
      caretakers.find((c) => {
        const cId = String(c.id).toLowerCase();
        if (cId === cleanId) return true;
        // Flexible ID match for ct-1 vs ct-001
        const numC = cId.replace(/\D/g, '');
        const numTarget = cleanId.replace(/\D/g, '');
        if (numC && numTarget && parseInt(numC, 10) === parseInt(numTarget, 10)) return true;
        return false;
      }) || null
    );
  };

  const getBookingById = (id) => {
    if (!id) return null;
    const cleanId = String(id).toLowerCase();
    return (
      bookings.find((b) => {
        const bId = String(b.id).toLowerCase();
        if (bId === cleanId) return true;
        const numB = bId.replace(/\D/g, '');
        const numTarget = cleanId.replace(/\D/g, '');
        if (numB && numTarget && parseInt(numB, 10) === parseInt(numTarget, 10)) return true;
        return false;
      }) || null
    );
  };

  const contextValue = useMemo(
    () => ({
      elder,
      elderProfile: elder,
      updateElderProfile,
      bookings,
      addBooking,
      cancelBooking,
      addReview,
      searchCriteria,
      updateSearchCriteria,
      resetSearchCriteria,
      caretakers,
      activities,
      getCaretakerById,
      getBookingById,
    }),
    [elder, bookings, searchCriteria, caretakers, activities]
  );

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const useAppContext = useApp;

export default AppContext;
