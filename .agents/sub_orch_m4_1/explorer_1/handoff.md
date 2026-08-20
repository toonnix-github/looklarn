# Handoff Report: Milestone M4 Exploration (Booking Flow, My Bookings & Elder Profile)

## 1. Observation

### 1.1 Codebase & Architecture Overview
- **Framework & Libraries**: React 18, Vite 5, Tailwind CSS v3, Lucide React, React Router v6, Vitest (`package.json`).
- **Entry Points & Routing** (`src/App.jsx:20-45`):
  - Primary Routes:
    - `/` -> `HomePage.jsx`
    - `/find` -> `FindCaretakerPage.jsx`
    - `/matches` & `/results` -> `MatchResultsPage.jsx`
    - `/caretaker/:id` -> `CaretakerProfilePage.jsx`
    - `/book/:id` -> `BookingPage.jsx`
    - `/bookings` -> `MyBookingsPage.jsx`
    - `/elder-profile` & `/elder` -> `ElderProfilePage.jsx`
    - `*` -> `NotFoundPage.jsx`
- **Context Providers Hierarchy** (`src/App.jsx:47-61`):
  - `LanguageProvider` (`src/context/LanguageContext.jsx`) wrapping `AppProvider` (`src/context/AppContext.jsx`) wrapping `ToastProvider` (`src/components/ui/Toast.jsx`).

### 1.2 State Management & Interfaces (`src/context/AppContext.jsx`)
- **Elder State**:
  - Initial loaded from `src/data/elder.json` (ID: `elder-001`, name: `{ th: "นางสมพร ใจดี", en: "Grandma Somporn Jaidee" }`, age: 74, mobilityLevel: `'wheelchair_assisted'`, address, guardian, emergencyContact, medicalConditions, medications, dietaryPreferences, preferredHospital, etc.).
  - Persisted to `localStorage.getItem('looklarn_elder')`.
  - Mutation helper: `updateElderProfile(updatedFields)`.
  - Exposed as both `elder` and `elderProfile` in `useApp()`.
- **Bookings State**:
  - Initial loaded from `src/data/bookings.json` (3 bookings: 2 `upcoming` (`bk-001`, `bk-002`) and 1 `completed` (`bk-003`)).
  - Persisted to `localStorage.getItem('looklarn_bookings')`.
  - Mutation helpers:
    - `addBooking(newBookingData)`: generates ID `bk-XXXX`, sets `status: 'upcoming'`, calculates `basePrice`, `serviceFee` (100), `discount`, `totalPrice`, prepends to `bookings` list, returns formatted booking object.
    - `cancelBooking(bookingId)`: maps target booking `status` to `'cancelled'`.
    - `addReview(bookingId, { rating, comment_th, comment_en })`: updates target booking with `hasReview: true`, `reviewRating: rating`, and bilingual `reviewText: { th, en }`.
    - `getBookingById(id)`: finds booking by exact ID or numeric suffix.
- **Search Criteria State**:
  - `searchCriteria`: default mobility, conditions, date (`2026-08-28`), durationHours (`4`), budgetMax (`500`), pickupAddress, destination (`โรงพยาบาลศิริราช...`), notes.
  - Helpers: `updateSearchCriteria(fields)` and `resetSearchCriteria()`.
- **Caretakers & Activities Data**:
  - `caretakers`: 5 items from `src/data/caretakers.json` (`ct-001` to `ct-005`).
  - Helper: `getCaretakerById(id)` handles both string formats (`ct-001`, `ct-1`, `1`).
  - `activities`: 4 items from `src/data/activities.json` (`act-hospital`, `act-park`, `act-shopping`, `act-social`).

### 1.3 i18n System & Translation Keys (`src/i18n/th.js` and `src/i18n/en.js`)
- `LanguageContext.jsx:36-82`: `t(keyPath, paramsOrFallback)` supports nested keys and token replacement (`{param}`).
- `LanguageContext.jsx:89-116`: `getLocalized(item, field)` extracts `{ th, en }` or suffixed properties (`field_th`/`field_en`).
- Existing translation sections relevant to M4:
  - `book.*`: `title`, `subtitle`, `elderSummaryTitle`, `caretakerSummaryTitle`, `scheduleSectionTitle`, `serviceDateLabel`, `serviceTimeLabel`, `durationLabel`, `locationSectionTitle`, `pickupLabel`, `pickupPlaceholder`, `useElderAddressBtn`, `destinationLabel`, `destinationPlaceholder`, `notesLabel`, `notesPlaceholder`, `priceBreakdownTitle`, `basePriceLabel`, `serviceInsuranceLabel`, `promoDiscountLabel`, `totalAmountLabel`, `promoInputPlaceholder`, `applyPromoBtn`, `promoSuccessText`, `paymentTitle`, `payPromptPay`, `payCreditCard`, `payCash`, `confirmBookingBtn`, `agreeTermsText`, `successModal.*`.
  - `booking.*`: `summaryTitle` ("สรุปการจองผู้ดูแล" / "Booking Summary"), `detailDesc`, `confirmCta`, `successTitle`, `successMsg`, `viewMyBookings`.
  - `bookings.*`: `title`, `subtitle`, `tabUpcoming` ("กำลังจะมาถึง ({count})" / "Upcoming ({count})"), `tabPast` ("เสร็จสิ้นแล้ว ({count})" / "Past Completed ({count})"), `bookingIdLabel`, `dateTimeLabel`, `durationLabel`, `locationLabel`, `pickupLabel`, `totalPriceLabel`, `notesLabel`, `viewDetailsBtn`, `contactCaregiverBtn`, `cancelBookingBtn`, `leaveReviewBtn`, `reviewSubmittedBadge`, `bookAgainBtn`, `emptyUpcomingTitle`, `emptyPastTitle`, `cancelConfirmTitle`, `cancelConfirmMessage`, `cancelConfirmYes`, `cancelConfirmNo`, `reviewModal.*`.
  - `elderProfile.*`: `title`, `subtitle`, `photoSectionTitle`, `changePhotoBtn`, `photoHint`, `generalInfoTitle`, `fullNameLabel`, `fullNameEnLabel`, `nicknameLabel`, `ageLabel`, `genderLabel`, `bloodTypeLabel`, `relationshipLabel`, `guardianSectionTitle`, `guardianNameLabel`, `guardianPhoneLabel`, `guardianEmailLabel`, `emergencyContactTitle`, `emergencyNameLabel`, `emergencyRelationLabel`, `emergencyPhoneLabel`, `homeAddressLabel`, `mobilitySectionTitle`, `mobilityLevelLabel`, `medicalSectionTitle`, `chronicConditionsLabel`, `allergiesLabel`, `allergiesPlaceholder`, `medicationsLabel`, `medicationsPlaceholder`, `preferredHospitalLabel`, `hospitalHnLabel`, `dietSectionTitle`, `dietaryPreferencesLabel`, `dietaryPlaceholder`, `religionLabel`, `preferredLanguagesLabel`, `specialNotesLabel`, `specialNotesPlaceholder`, `saveBtn`, `savedToast`.

### 1.4 Test Suite Expectations & Matchers (from `src/tests/*`)
- **Booking Flow (`/book/:id`)**:
  - Tests check for `/สรุปข้อมูลการจอง|Booking Summary/i` on the booking page.
  - Tests check for location inputs (`pickup` placeholder `/ระบุจุดรับ|Enter pickup location/i`, destination placeholder `/ระบุสถานที่ปลายทาง/i`).
  - Tests check for price breakdown (`/รายละเอียดราคา|Price Breakdown/i`, `/ค่าบริการ|Service Fee/i`, `/ยอดรวม|Total Price/i`).
  - Confirm button text: `/ยืนยันการจอง|Confirm Booking|ชำระเงิน|Proceed/i`.
  - Success modal: text matching `/จองสำเร็จ|Booking Successful/i` and reference `#LK-` (`#LK-bk-xxxx`).
  - Success modal button navigating to bookings: `/ดูรายการจองของฉัน|ไปที่การจอง|View My Bookings|Go to Bookings/i`.
- **My Bookings (`/bookings`)**:
  - Upcoming Tab: role `'tab'`, name `/กำลังมาถึง|กำลังจะมาถึง|Upcoming/i`.
  - Past Tab: role `'tab'`, name `/ประวัติ|ที่ผ่านมา|เสร็จสิ้น|Past/i`.
  - Status badges: `/รอการดูแล|ยืนยันแล้ว|Upcoming|Confirmed/i` for upcoming, `/เสร็จสิ้น|สำเร็จ|Completed/i` for past.
  - "Leave Review" CTA on completed booking: `/เขียนรีวิว|ให้คะแนน|Leave Review|Review/i`.
  - Review Modal: heading/text `/ให้คะแนนผู้ดูแล|รีวิวบริการ|Rate Caretaker|Leave a Review|เขียนรีวิว/i`.
  - Review submission button: `/ส่งรีวิว|บันทึกรีวิว|Submit Review|Submit/i`.
- **Elder Profile (`/elder-profile` & `/elder`)**:
  - Name input: display value `/สมพร|Somporn|คุณยาย/i` or label `/ชื่อ|Name/i`.
  - Age input: display value `/74|78|80/i` or label `/อายุ|Age/i`.
  - Mobility level selector: label `/การเคลื่อนไหว|Mobility|ระดับการเคลื่อนไหว/i`.
  - Medical section: text `/โรคประจำตัว|ข้อมูลสุขภาพ|Medical Conditions|Health/i`.
  - Emergency contact section: text `/ติดต่อฉุกเฉิน|ผู้ติดต่อกรณีฉุกเฉิน|ผู้ติดต่อฉุกเฉิน|Emergency Contact/i`.
  - Save button: `/บันทึกข้อมูล|บันทึก|Save Profile|Save/i`.
  - Success toast: text `/บันทึกข้อมูลสำเร็จ|Profile updated|บันทึกเรียบร้อย|Success/i`.

---

## 2. Logic Chain

1. **State Centralization**:
   - `AppContext` already contains all core state slices (`elder`, `bookings`, `searchCriteria`) and mutators (`updateElderProfile`, `addBooking`, `cancelBooking`, `addReview`).
   - M4 pages should consume these directly via `useApp()`, preserving data reactively in `localStorage` across page navigations.

2. **Route Parameter & State Passing**:
   - `/book/:id`: Caretaker ID is passed via URL parameter `useParams().id` (e.g. `ct-001`, `ct-1`). `getCaretakerById(id)` normalizes and resolves the correct caretaker.
   - Initial values for booking (date, time slot, duration, pickup, destination) can gracefully default from `searchCriteria` and `elder` profile state.
   - Quick Action from Elder Profile ("Find Caretaker for this Elder") can navigate to `/find` with `elder` health/mobility data pre-filled.
   - "Book Again" from My Bookings can navigate to `/book/:caretakerId`.

3. **Component Decomposition for Milestone M4**:
   - Decomposing the monolithic prototype pages into clean, modular sub-components under `src/components/booking/`, `src/components/bookings/`, and `src/components/elder/` improves maintainability, reusability, and testability.
   - **Booking Page Components**:
     - `src/components/booking/BookingSummaryCard.jsx`: Displays elder, caretaker info, AI Match Score ring, appointment details.
     - `src/components/booking/LocationPicker.jsx`: Pickup address with "Use Elder's Home Address" button, destination input, landmark notes.
     - `src/components/booking/PriceBreakdown.jsx`: Calculation breakdown (hours x rate), insurance fee (฿100), interactive promo code (`LOOKLARNCARE` -> -฿150), total amount due.
     - `src/components/booking/PaymentMethodSelector.jsx`: PromptPay QR (with simulated QR visual box), Credit/Debit Card, Cash.
     - `src/components/booking/BookingSuccessModal.jsx`: Modal popup with `#LK-XXXX` reference ID, appointment summary, CTAs to `/bookings` and `/`.
   - **My Bookings Components**:
     - `src/components/bookings/BookingCard.jsx`: Card with status badge, caretaker details, date/time, pickup/destination, total price, call companion, cancel modal trigger, review modal trigger.
     - `src/components/bookings/ReviewModal.jsx`: 5-star interactive rating, feedback comments, submit button updating AppContext and toast.
     - `src/components/bookings/CancelConfirmModal.jsx`: Confirmation dialog with 24h refund policy notice and cancel action.
   - **Elder Profile Components**:
     - `src/components/elder/ElderProfileForm.jsx`: Main form wrapper, photo upload preview, name (TH & EN), nickname, age, gender, blood type.
     - `src/components/elder/MobilitySelector.jsx` (or in form): 4 mobility options with icons.
     - `src/components/elder/MedicalPreferencesSection.jsx`: Chronic condition chips toggle, allergies, medications, hospital HN, dietary preferences, religion, languages, special notes.
     - `src/components/elder/EmergencyContactsSection.jsx`: Guardian info, emergency contact 24/7 phone, primary home address, and "Find Caretaker for this Elder" quick CTA.

4. **i18n String Alignment**:
   - Ensure component UI text satisfies both human bilingual requirements (TH/EN) and E2E test matcher regexes by providing dual-language keys and rich descriptors.

---

## 3. Caveats

- **No Backend**: All updates are client-side only and persisted to browser `localStorage`. Resetting `localStorage` restores initial data from `*.json`.
- **E2E Test Text Matchers**: The E2E tests in `src/tests/` use specific regular expressions (e.g. `/สรุปข้อมูลการจอง|Booking Summary/i`, `/กำลังมาถึง|Upcoming/i`, `/ยืนยันการจอง|Confirm Booking/i`). All rendered labels, buttons, and headings must accommodate these regexes while maintaining natural Thai and English phrasing.
- **Strict Single-Language Display**: As mandated by ORIGINAL_REQUEST §R3 and E2E test 1.4, never show mixed strings (e.g. `"Hospital / โรงพยาบาล"`) in a single view. The text must fully render in the active language (`th` or `en`).

---

## 4. Conclusion & Implementation Recommendations

### 4.1 Target File Breakdown for M4 Implementer
```
src/
├── components/
│   ├── booking/
│   │   ├── BookingSummaryCard.jsx
│   │   ├── LocationPicker.jsx
│   │   ├── PriceBreakdown.jsx
│   │   ├── PaymentMethodSelector.jsx
│   │   └── BookingSuccessModal.jsx
│   ├── bookings/
│   │   ├── BookingCard.jsx
│   │   ├── ReviewModal.jsx
│   │   └── CancelConfirmModal.jsx
│   └── elder/
│       ├── ElderProfileForm.jsx
│       ├── MedicalPreferencesSection.jsx
│       └── EmergencyContactsSection.jsx
└── pages/
    ├── BookingPage.jsx       (refactored with booking subcomponents)
    ├── MyBookingsPage.jsx    (refactored with bookings subcomponents)
    └── ElderProfilePage.jsx  (refactored with elder subcomponents)
```

### 4.2 State & Helpers Reference
- `useApp()`:
  - `elder` / `elderProfile`: active elder object
  - `updateElderProfile(fields)`: updates elder in state and `localStorage`
  - `bookings`: list of all bookings
  - `addBooking(data)`: creates new booking with `status: 'upcoming'`
  - `cancelBooking(id)`: cancels booking by id
  - `addReview(id, { rating, comment_th, comment_en })`: adds review to booking
  - `getCaretakerById(id)`: lookup caretaker by id string or number
  - `searchCriteria`: default values for booking
- `useLanguage()`:
  - `language`: `'th'` | `'en'`
  - `t(keyPath, params)`: dot-notation translation with interpolation
  - `getLocalized(item, field)`: bilingual helper for `{ th, en }`
- `useToast()`:
  - `toast.success(msg)`: triggers success notification
  - `toast.error(msg)`: triggers error notification
- `src/utils/formatters.js`:
  - `formatCurrency(amount, lang, { showUnit })`
  - `formatDate(dateInput, lang, formatStyle)`
  - `formatMatchScore(score)`
  - `formatDuration(hours, lang)`

---

## 5. Verification Method

### 5.1 Verification Commands
- Run Vitest suite:
  ```powershell
  npm test
  ```
- Run Vitest specifically on M4 / E2E test files:
  ```powershell
  npx vitest run src/tests/e2e_tier1_features.test.jsx
  npx vitest run src/tests/e2e_tier2_boundaries.test.jsx
  npx vitest run src/tests/e2e_tier3_combinations.test.jsx
  npx vitest run src/tests/e2e_tier4_scenarios.test.jsx
  npx vitest run src/tests/context.test.jsx
  ```
- Build check:
  ```powershell
  npm run build
  ```

### 5.2 Interactive Spot-Checks
1. Navigate to `/book/ct-001` or `/book/1`: verify caretaker summary with MatchScoreRing, pickup/destination inputs, promo code `LOOKLARNCARE` deducting ฿150, and confirm button creating a booking with `#LK-` modal.
2. Navigate to `/bookings`: verify Upcoming tab displays new and existing bookings with emerald status badge; switch to Past tab and verify completed booking has "Leave Review" button opening 5-star modal. Submitting review sets reviewed badge and displays success toast.
3. Navigate to `/elder-profile`: verify all sections (General info, Mobility, Medical conditions toggles, Guardian/Emergency contacts, Home address) load and save reactively with success toast.
4. Language Toggle: switch `TH | EN` on all three pages and confirm instant translation with zero mixed labels.
