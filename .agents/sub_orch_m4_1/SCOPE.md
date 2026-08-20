# Scope: Milestone M4 — Booking Flow, My Bookings & Elder Profile

## Architecture & Responsibilities
- **Booking Flow (`BookingPage.jsx`)**:
  - `BookingSummaryCard`: Displays selected elder, caretaker details, activity summary, date/time slot.
  - `LocationPicker`: Pickup address (defaulting to elder home address), destination address, landmark/meeting notes.
  - `PriceBreakdown`: Hourly rate x hours, platform/insurance fee, promo discount, total.
  - `PaymentMethod`: PromptPay QR (default with simulated QR), Credit Card, Mobile Banking.
  - `BookingSuccessModal`: Reference ID (#LK-20260825-001), appointment summary, CTAs to `/bookings` and `/`. Appends new booking to AppContext.
- **My Bookings (`MyBookingsPage.jsx`)**:
  - Tabs: "Upcoming Bookings" (2 sample bookings) vs "Past Outings" (1 sample booking).
  - Booking cards with status badges (Confirmed in emerald, Completed in slate).
  - Past booking card has "Leave Review" CTA opening `ReviewModal` with 5-star rating and comment submission (updating caretaker reviews in state).
- **Elder Profile (`ElderProfilePage.jsx`)**:
  - `ElderProfileForm`: Photo, name, nickname, age, gender, blood type.
  - Mobility Level selector (Independent, Cane, Wheelchair, Assisted).
  - Medical conditions & medications (Hypertension, Diabetes, Knee osteoarthritis, etc.).
  - Preferences: Language/dialect, religion, dietary preferences, special notes.
  - Emergency guardian contacts (name, relationship, phone).
  - Save Profile button updating AppContext and triggering visual success toast.
  - "Find Caretaker for this Elder" CTA button navigating to `/find` with pre-filled attributes.
- **i18n & Context Integration**:
  - Full bilingual support (th & en) across all M4 pages and components.
  - Integration with AppContext (`currentElder`, `bookings`, `caretakers`, `addBooking`, `updateElderProfile`, `addReview`).

## Feature Inventory Mapping
| # | Feature | Target File / Component | Status |
|---|---------|-------------------------|--------|
| 1 | Booking Page & Summary | `src/pages/BookingPage.jsx`, `src/components/booking/BookingSummaryCard.jsx` | PLANNED |
| 2 | Location & Landmark Picker | `src/components/booking/LocationPicker.jsx` | PLANNED |
| 3 | Price Breakdown | `src/components/booking/PriceBreakdown.jsx` | PLANNED |
| 4 | Payment Method Selector & PromptPay QR | `src/components/booking/PaymentMethodSelector.jsx` | PLANNED |
| 5 | Booking Confirmation & Success Modal | `src/components/booking/BookingSuccessModal.jsx` | PLANNED |
| 6 | My Bookings Tabs & Cards | `src/pages/MyBookingsPage.jsx`, `src/components/bookings/BookingCard.jsx` | PLANNED |
| 7 | Leave Review Modal & State Update | `src/components/bookings/ReviewModal.jsx` | PLANNED |
| 8 | Elder Profile Form & Mobility | `src/pages/ElderProfilePage.jsx`, `src/components/elder/ElderProfileForm.jsx` | PLANNED |
| 9 | Medical Conditions & Preferences | `src/components/elder/MedicalPreferencesSection.jsx` | PLANNED |
| 10| Emergency Contacts & Quick Find Caretaker | `src/components/elder/EmergencyContactsSection.jsx` | PLANNED |

## Exclusive File Ownership
- `src/pages/BookingPage.jsx`
- `src/pages/MyBookingsPage.jsx`
- `src/pages/ElderProfilePage.jsx`
- `src/components/booking/*`
- `src/components/bookings/*`
- `src/components/elder/*`
- Associated tests in `src/__tests__/m4_booking_profile.test.jsx` (or test directory)
