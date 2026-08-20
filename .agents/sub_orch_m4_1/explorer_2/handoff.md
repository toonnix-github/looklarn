# Handoff Report — Explorer 2: Booking Flow Architecture & UX Specifications

## 1. Observation
- **Authoritative Documents Examined**:
  - `d:/SDISMAN/Projects/Looklarn/.agents/ORIGINAL_REQUEST.md` (lines 19, 55, 56)
  - `d:/SDISMAN/Projects/Looklarn/PROJECT.md` (lines 74–77, 116–117, 145–164)
  - `d:/SDISMAN/Projects/Looklarn/.agents/sub_orch_m4_1/SCOPE.md` (lines 4–9, 29–33, 41–44)
- **Existing Code & Data Inspected**:
  - `src/pages/BookingPage.jsx` (monolithic prototype without dedicated subcomponents)
  - `src/context/AppContext.jsx` (lines 55–129 `bookings` state and `addBooking` function)
  - `src/context/LanguageContext.jsx` (lines 1–55 `useLanguage` hook and `t` interpolation)
  - `src/i18n/th.js` (lines 282–333 `booking` and `book` translation trees)
  - `src/i18n/en.js` (lines 282–333 `booking` and `book` translation trees)
  - `src/data/caretakers.json`, `src/data/elder.json`, `src/data/bookings.json`, `src/data/activities.json`
- **E2E & Boundary Test Assertions Observed**:
  - `src/tests/e2e_tier1_features.test.jsx` lines 315–357:
    - 6.1 Booking summary card with elder and caretaker details (`/สรุปข้อมูลการจอง|Booking Summary/i`)
    - 6.2 Location picker for pickup and destination (`/จุดรับ|สถานที่นัดพบ|Pickup Location|ปลายทาง|Destination/i`)
    - 6.3 Price breakdown with hourly rate x hours + platform fee (`/รายละเอียดราคา|Price Breakdown|ยอดรวม|Total Price|ค่าบริการ|Service Fee/i`)
    - 6.4 Success modal with reference ID on confirm (`/จองสำเร็จ|Booking Successful|รหัสการจอง|#LK-/i`)
    - 6.5 Navigation to `/bookings` from modal button (`/ดูรายการจองของฉัน|ไปที่การจอง|View My Bookings|Go to Bookings/i`)
  - `src/tests/e2e_tier2_boundaries.test.jsx` lines 40, 84, 134–151, 188–200:
    - Direct access via `/book/ct-2` and invalid ID `/book/invalid-caretaker-id-404`
    - Language switch while Success Modal is open maintains modal state and re-renders translated text
    - Empty notes and custom pickup locations handled gracefully
  - `src/tests/e2e_tier3_combinations.test.jsx` lines 74–87:
    - Full funnel from `/find` -> `/matches` -> `/caretaker/:id` -> `/book/:id` -> `/bookings`
  - `src/tests/e2e_tier4_scenarios.test.jsx` lines 70–85, 143–168:
    - Direct booking of wheelchair companion and park stroll companion

---

## 2. Logic Chain

1. **Modular Architecture Requirement**:
   - The current `BookingPage.jsx` is a single monolithic file. The blueprint and milestone scope dictate modular components located under `src/components/booking/`:
     - `BookingSummaryCard.jsx`: Elder details + Caretaker profile + Schedule / Activity
     - `LocationPicker.jsx`: Pickup input (defaulting to elder home address + quick reset button), Destination input, Notes/Landmark input
     - `PriceBreakdown.jsx`: Hourly rate x hours, platform/insurance fee (฿100), promo code box (`LOOKLARNCARE` for ฿150 off), total calculation, Confirm CTA button
     - `PaymentMethodSelector.jsx`: PromptPay QR (default with simulated QR), Credit Card, Mobile Banking
     - `BookingSuccessModal.jsx`: Reference ID (`#LK-20260825-001`), appointment summary, CTAs to `/bookings` and `/`
2. **Text Matcher Alignment**:
   - Test suites search for `/สรุปข้อมูลการจอง|Booking Summary/i`, `/จุดรับ|Pickup Location/i`, `/รายละเอียดราคา|Price Breakdown/i`, `/ยืนยันการจอง|Confirm Booking|ชำระเงิน/i`, and `/#LK-/i`.
   - In `th.js` and `en.js`, `book.title` or `book.summaryCardTitle` must contain `สรุปข้อมูลการจอง` / `Booking Summary` so both language modes satisfy regex tests consistently.
3. **Data Flow & AppContext Integration**:
   - `BookingPage` pulls `elder` and `searchCriteria` from `AppContext`.
   - `pickup` state initializes to `searchCriteria?.pickupAddress || elder?.address?.[language] || elder?.address?.th`.
   - Clicking "Use Elder's Address" resets `pickup` to `elder?.address?.[language] || elder?.address?.th`.
   - When user clicks "Confirm Booking", `addBooking({ ... })` is called, appending the new item to `bookings` in `AppContext` and persisting to `localStorage('looklarn_bookings')`.
   - Reference ID in modal must format as `#LK-YYYYMMDD-XXX` or `#LK-${newBooking.id.toUpperCase()}` to satisfy test matcher `/#LK-/i`.
4. **State Resilience & Language Toggle**:
   - `BookingSuccessModal` consumes `useLanguage()` internally and translates on the fly. When the user clicks `TH | EN` toggle in the navbar while the modal is open, the modal does not dismiss and dynamically translates all labels.

---

## 3. Caveats
- **Mock Data Persistence**: `localStorage` is used in `AppContext`. Test suites may run on clean or dirty local storage. All state initializers must have robust fallback default objects.
- **Promo Code Case Sensitivity**: Must apply `.trim().toUpperCase()` to handle user entering `looklarncare` or `LOOKLARNCARE`.
- **Caretaker ID resolution**: Must support both string (`ct-001`, `ct-1`) and numeric fallback IDs (`1`) using `getCaretakerById(id)`.

---

## 4. Conclusion & Component Specifications

### 4.1 Component Hierarchy
```
BookingPage (/book/:id)
├── BookingSummaryCard
│   ├── Elder Summary Block (Photo, Name, Relationship, Age, Mobility Badge)
│   ├── Caretaker Summary Block (Photo, Name, Tier Badge, Hourly Rate, MatchScoreRing, Verified Badge)
│   └── Schedule Block (Activity Icon & Name, Service Date, Time Slot, Duration)
├── LocationPicker
│   ├── Pickup Address Input (Default = Elder address) + "Use Elder's Address" Button
│   ├── Destination Address Input
│   └── Landmark / Meeting Notes Textarea
├── PaymentMethodSelector
│   ├── PromptPay QR Option (Default, simulated QR display)
│   ├── Credit/Debit Card Option
│   └── Mobile Banking Option
├── PriceBreakdown
│   ├── Base Service Fee (Hours x Hourly Rate)
│   ├── Insurance & Platform Protection Fee (฿100)
│   ├── Promo Code Discount Line (-฿150 if valid)
│   ├── Total Calculation (Large Emerald Display)
│   ├── Promo Code Input & Apply Button
│   └── Confirm Booking CTA Button (Emerald #10B981)
└── BookingSuccessModal
    ├── Success Animation Icon (CheckCircle2)
    ├── Booking Reference ID (#LK-20260825-001)
    ├── Appointment Details Summary
    └── Navigation Actions: [View My Bookings -> /bookings] & [Back to Home -> /]
```

### 4.2 Detailed Component Props & Interfaces

#### 1. `BookingSummaryCard.jsx`
```javascript
// Props:
{
  caretaker: object,      // Caretaker profile object
  elder: object,          // Elder profile object
  serviceDate: string,    // e.g. '2026-08-28'
  timeSlot: string,       // e.g. '08:30 - 12:30' or 'morning'
  durationHours: number,  // e.g. 4
  activityType: string,   // e.g. 'hospital', 'park', 'shopping', 'social'
  className?: string
}
```

#### 2. `LocationPicker.jsx`
```javascript
// Props:
{
  pickup: string,
  destination: string,
  notes: string,
  onPickupChange: (val: string) => void,
  onDestinationChange: (val: string) => void,
  onNotesChange: (val: string) => void,
  onUseElderAddress: () => void,
  className?: string
}
```

#### 3. `PriceBreakdown.jsx`
```javascript
// Props:
{
  hourlyRate: number,
  durationHours: number,
  serviceFee: number,     // default 100
  discount: number,       // default 0
  promoCode: string,
  promoStatus: 'idle' | 'applied' | 'invalid',
  onPromoCodeChange: (code: string) => void,
  onApplyPromo: (code: string) => void,
  onConfirm: () => void,
  isSubmitting?: boolean,
  className?: string
}
```

#### 4. `PaymentMethodSelector.jsx`
```javascript
// Props:
{
  selectedMethod: 'promptpay' | 'credit_card' | 'mobile_banking',
  onSelectMethod: (method: string) => void,
  totalAmount: number,
  className?: string
}
```

#### 5. `BookingSuccessModal.jsx`
```javascript
// Props:
{
  isOpen: boolean,
  onClose: () => void,
  booking: object | null,
  caretaker: object | null,
  elder: object | null,
  onViewBookings: () => void,
  onBackHome: () => void
}
```

### 4.3 Required i18n Translation Keys
Both `src/i18n/th.js` and `src/i18n/en.js` must provide full bilingual keys:
- `book.title`: `"สรุปข้อมูลการจอง"` (TH) / `"Booking Summary"` (EN)
- `book.subtitle`: `"ตรวจสอบรายละเอียดการนัดหมายและยืนยันการจองอย่างปลอดภัย"` / `"Review appointment details and confirm your companion escort securely."`
- `book.summaryCardTitle`: `"สรุปข้อมูลการจอง"` / `"Booking Summary"`
- `book.elderSummaryTitle`: `"ข้อมูลผู้รับการดูแล"` / `"Elderly Care Recipient"`
- `book.caretakerSummaryTitle`: `"ผู้ดูแลที่คุณเลือก"` / `"Selected Caretaker"`
- `book.scheduleSectionTitle`: `"วัน เวลา และกิจกรรม"` / `"Date, Time & Activity"`
- `book.locationSectionTitle`: `"จุดรับและปลายทาง"` / `"Pickup & Destination Locations"`
- `book.pickupLabel`: `"จุดรับ / สถานที่นัดพบ (จุดเริ่มต้น)"` / `"Pickup Address (Starting Point)"`
- `book.pickupPlaceholder`: `"ระบุจุดรับ / ที่อยู่นัดพบ"` / `"Enter pickup address"`
- `book.useElderAddressBtn`: `"ใช้ที่อยู่ตามโปรไฟล์ผู้สูงอายุ"` / `"Use Elder's Home Address"`
- `book.destinationLabel`: `"สถานที่ปลายทาง / โรงพยาบาล"` / `"Destination Location / Hospital"`
- `book.destinationPlaceholder`: `"ระบุสถานที่ปลายทาง เช่น รพ.ศิริราช อาคารนวมินทรบพิตร"` / `"e.g., Siriraj Hospital, Navamindrapobitr Bldg"`
- `book.notesLabel`: `"หมายเหตุพิเศษสำหรับผู้ดูแล"` / `"Special Notes for Caretaker"`
- `book.notesPlaceholder`: `"ระบุข้อมูลเพิ่มเติม เช่น จุดรอ, อาการเฉพาะหน้า, ยาที่ต้องเตรียม..."` / `"e.g., Waiting spot, specific medical notes, required medicine..."`
- `book.priceBreakdownTitle`: `"รายละเอียดราคา"` / `"Price Breakdown"`
- `book.basePriceLabel`: `"ค่าบริการผู้ดูแล ({hours} ชม. x ฿{rate})"` / `"Companion Rate ({hours} hrs x ฿{rate})"`
- `book.serviceInsuranceLabel`: `"ค่าบริการและประกันอุบัติเหตุ"` / `"Accident Insurance & Safety Protection Fee"`
- `book.promoDiscountLabel`: `"ส่วนลดโปรโมชั่น"` / `"Promotional Discount"`
- `book.totalAmountLabel`: `"ยอดรวมสุทธิ"` / `"Total Amount Due"`
- `book.promoInputPlaceholder`: `"กรอกโค้ดส่วนลด (เช่น LOOKLARNCARE)"` / `"Enter Promo Code (e.g., LOOKLARNCARE)"`
- `book.applyPromoBtn`: `"ใช้โค้ด"` / `"Apply Code"`
- `book.promoSuccessText`: `"ใช้โค้ดสำเร็จ! ได้รับส่วนลด ฿{discount}"` / `"Promo applied! ฿{discount} discount granted."`
- `book.promoInvalidText`: `"โค้ดส่วนลดไม่ถูกต้องหรือไม่สามารถใช้ได้"` / `"Invalid promo code or expired."`
- `book.paymentTitle`: `"เลือกวิธีการชำระเงิน"` / `"Select Payment Method"`
- `book.payPromptPay`: `"พร้อมเพย์ QR Code (ไม่มีค่าธรรมเนียม - แนะนำ)"` / `"PromptPay QR Code (Zero transaction fee - Recommended)"`
- `book.payCreditCard`: `"บัตรเครดิต / เดบิต (Visa, Mastercard, JCB)"` / `"Credit / Debit Card (Visa, Mastercard, JCB)"`
- `book.payMobileBanking`: `"โมบายแบงก์กิ้ง (K PLUS, SCB EASY, Krungthai NEXT)"` / `"Mobile Banking (Direct Bank App Transfer)"`
- `book.confirmBookingBtn`: `"ยืนยันการจองและชำระเงิน"` / `"Confirm Booking & Proceed"`
- `book.agreeTermsText`: `"การกดยืนยันแสดงว่าท่านยอมรับข้อกำหนดการให้บริการและนโยบายความเป็นส่วนตัวของ Looklarn"` / `"By clicking confirm, you agree to Looklarn's Terms of Service and Privacy Policy."`
- `book.notFoundTitle`: `"ไม่พบผู้ดูแล"` / `"Caretaker Not Found"`
- `book.notFoundDesc`: `"กรุณาเลือกผู้ดูแลจากหน้าผลการจับคู่"` / `"Please select a caretaker from the matching results page."`
- `book.successModal.title`: `"การจองผู้ดูแลสำเร็จเรียบร้อย!"` / `"Booking Confirmed Successfully!"`
- `book.successModal.subtitle`: `"ระบบได้ส่งข้อมูลการนัดหมายไปยังผู้ดูแลแล้ว ผู้ดูแลจะโทรติดต่อยืนยันรายละเอียดภายใน 15 นาที"` / `"Your booking details have been dispatched to the companion. They will call you within 15 minutes to confirm logistics."`
- `book.successModal.bookingRefLabel`: `"รหัสการจอง:"` / `"Booking Reference:"`
- `book.successModal.dateLabel`: `"วันและเวลา:"` / `"Date & Time:"`
- `book.successModal.caretakerLabel`: `"ผู้ดูแล:"` / `"Companion:"`
- `book.successModal.destinationLabel`: `"สถานที่:"` / `"Destination:"`
- `book.successModal.totalPaidLabel`: `"ยอดชำระเงิน:"` / `"Total Paid:"`
- `book.successModal.contactNotice`: `"ท่านสามารถดูรายละเอียดการจองหรือติดต่อผู้ดูแลได้ตลอดเวลาในเมนู \"การจองของฉัน\""` / `"You can track real-time trip status or contact your companion anytime in \"My Bookings\"."`
- `book.successModal.viewBookingsBtn`: `"ดูรายการจองของฉัน"` / `"Go to My Bookings"`
- `book.successModal.backHomeBtn`: `"กลับสู่หน้าแรก"` / `"Back to Home"`

---

## 5. Verification Method

To independently verify the Booking Flow implementation:
1. **Targeted Vitest Execution**:
   ```bash
   npx vitest run src/tests/e2e_tier1_features.test.jsx -t "Feature 6: Booking Flow"
   npx vitest run src/tests/e2e_tier2_boundaries.test.jsx -t "Boundary 3: Language Switching State Preservation"
   npx vitest run src/tests/e2e_tier2_boundaries.test.jsx -t "Boundary 4: Extreme Inputs"
   npx vitest run src/tests/e2e_tier3_combinations.test.jsx -t "3.1 should complete the entire end-to-end booking journey"
   npx vitest run src/tests/e2e_tier4_scenarios.test.jsx -t "Scenario 3"
   ```
2. **Key Invalidation Conditions**:
   - `BookingSummaryCard` does not show elder name, caretaker tier, match score ring, or activity.
   - `LocationPicker` does not auto-populate elder home address or "Use Elder's Address" button fails.
   - `PriceBreakdown` calculation doesn't factor in base price (`rate * hours`) + `serviceFee` (100) - `discount` (150 for `LOOKLARNCARE`).
   - `PaymentMethodSelector` does not default to PromptPay QR.
   - `BookingSuccessModal` does not render `#LK-` reference ID or fails to navigate to `/bookings` and `/`.
