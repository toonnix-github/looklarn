# Handoff Report: Milestone M4 — My Bookings & Elder Profile Investigation

**Author**: Explorer 3 (Milestone M4)  
**Date**: 2026-08-20  
**Target Milestone**: M4 — Booking Flow, My Bookings & Elder Profile  
**File Location**: `d:/SDISMAN/Projects/Looklarn/.agents/sub_orch_m4_1/explorer_3/handoff.md`  

---

## 1. Observation

### Codebase and File Paths Directly Observed
1. **Authoritative Requirements & Blueprint**:
   - `ORIGINAL_REQUEST.md` (lines 20-21):
     - `/bookings` — My Bookings: tabs (Upcoming / Past), booking cards with status badges
     - `/elder-profile` — Elder Profile: editable sections for elder's photo, name, age, medical conditions, preferences, mobility level
   - `PROJECT.md` (lines 78-82, 118-119):
     - `src/components/bookings/BookingCard.jsx`
     - `src/components/bookings/ReviewModal.jsx`
     - `src/components/elder/ElderProfileForm.jsx`
     - Feature 16: My Bookings Page (`/bookings`) with tabs for Upcoming (2 items) & Past (1 item), status badges, "Leave Review" interactive modal.
     - Feature 17: Elder Profile Page (`/elder-profile`) with editable photo, name, age, medical conditions, mobility, preferences, emergency contacts, save toast.
   - `SCOPE.md` (lines 10-21):
     - Details for My Bookings (tabs, status badges: Confirmed in emerald, Completed in slate, "Leave Review" CTA, ReviewModal with 5-star rating, AppContext state update).
     - Details for Elder Profile (photo, name, nickname, age, gender, blood type, mobility level selector: Independent, Cane, Wheelchair, Assisted, medical conditions & medications, preferences, emergency contacts, Save Profile button with visual success toast, "Find Caretaker for this Elder" CTA navigating to `/find` with pre-filled attributes).

2. **Existing Implementation Observations**:
   - `src/context/AppContext.jsx`:
     - Line 55: `bookings` state initialized with `initialBookings` (`data/bookings.json`) and persisted in `localStorage['looklarn_bookings']`.
     - Lines 72-129: `addBooking(newBookingData)` formats and prepends new booking with `status: 'upcoming'`.
     - Lines 131-135: `cancelBooking(bookingId)` marks booking status as `'cancelled'`.
     - Lines 137-154: `addReview(bookingId, { rating, comment_th, comment_en })` updates booking with `hasReview: true`, `reviewRating`, `reviewText`.
     - Lines 30-53: `elder` state initialized with `initialElder` (`data/elder.json`) and persisted in `localStorage['looklarn_elder']`.
     - Lines 47-52: `updateElderProfile(updatedFields)` shallow-merges updated fields into `elder`.
     - Lines 157-169: `searchCriteria` state and `updateSearchCriteria(fields)`.
   - `src/data/bookings.json`:
     - Lines 1-58: `bk-001` (status: `upcoming`, caretaker: ct-002, Siriraj Hospital, 4h, totalPrice: 1900, hasReview: false).
     - Lines 59-115: `bk-002` (status: `upcoming`, caretaker: ct-003, Lumpini Park, 3h, totalPrice: 1060, hasReview: false).
     - Lines 116-178: `bk-003` (status: `completed`, caretaker: ct-001, Phramongkutklao Hospital, 4h, totalPrice: 1350, hasReview: true, reviewRating: 5).
   - `src/data/elder.json`:
     - Contains sample elder "นางสมพร ใจดี" / "Grandma Somporn Jaidee", age 74, female, bloodType "O+", mobilityLevel "wheelchair_assisted", medical conditions (hypertension, diabetes_type_2, knee_osteoarthritis), allergies, medications, emergencyContact, preferred languages, specialNotes.
   - `src/components/ui/Badge.jsx`:
     - Lines 14-29: Variant styles include `upcoming: 'bg-sky-100 text-sky-800 border-sky-200'`, `completed: 'bg-emerald-100 text-emerald-800 border-emerald-200'`.
     - Requirement specification explicitly requests: **Confirmed in emerald**, **Completed in slate**.
   - `src/tests/e2e_tier1_features.test.jsx`:
     - Line 365: `expect(screen.getByRole('tab', { name: /กำลังมาถึง|Upcoming/i }) || screen.getByText(/กำลังมาถึง|Upcoming/i)).toBeInTheDocument()`
     - Line 366: `expect(screen.getByRole('tab', { name: /ประวัติ|ที่ผ่านมา|Past/i }) || screen.getByText(/ประวัติ|ที่ผ่านมา|Past/i)).toBeInTheDocument()`
     - Line 391: `screen.getByRole('button', { name: /เขียนรีวิว|ให้คะแนน|Leave Review|Review/i })`
     - Line 394: `screen.getByText(/ให้คะแนนผู้ดูแล|รีวิวบริการ|Rate Caretaker|Leave a Review/i)`
     - Line 407: `screen.getByRole('button', { name: /ส่งรีวิว|บันทึกรีวิว|Submit Review|Submit/i })`
     - Line 423: `screen.getByDisplayValue(/สมพร|Somporn|คุณยาย/i)`
     - Line 434: `screen.getByLabelText(/การเคลื่อนไหว|Mobility|ระดับการเคลื่อนไหว/i)`
     - Line 448: `screen.getByRole('button', { name: /บันทึกข้อมูล|บันทึก|Save Profile|Save/i })`
     - Line 451: `expect(await screen.findByText(/บันทึกข้อมูลสำเร็จ|Profile updated|บันทึกเรียบร้อย|Success/i)).toBeInTheDocument()`
   - `src/tests/e2e_tier2_boundaries.test.jsx`:
     - Line 162: `screen.getByDisplayValue(/สมพร|Somporn/i) || screen.getByLabelText(/ชื่อ|Name/i)` with extreme long name & special characters test.
     - Line 178: `screen.getByDisplayValue(/78|80/i) || screen.getByLabelText(/อายุ|Age/i)` with age `105` test.
   - `src/tests/e2e_tier3_combinations.test.jsx`:
     - Line 95-113: Sync test from elder profile save to `/find` wizard auto-fill.
     - Line 118-160: Review submission flow on past bookings updating state to show reviewed status.

---

## 2. Logic Chain

1. **My Bookings Page Component Architecture**:
   - `MyBookingsPage.jsx` serves as the orchestrator for the `/bookings` route.
   - It maintains `activeTab` (`'upcoming'` | `'past'`), `selectedBookingForReview`, and `selectedBookingForCancel`.
   - The tabs must render tab buttons with `role="tab"`, `aria-selected`, and labels containing `/กำลังมาถึง|Upcoming/i` and `/ประวัติ|ที่ผ่านมา|Past/i` along with count badges (e.g. `(2)` and `(1)`).
   - Component decomposition requires isolating `BookingCard.jsx` and `ReviewModal.jsx` into `src/components/bookings/` for modularity and testability.

2. **Booking Card Requirements & Status Badging**:
   - Each card represents one booking from `AppContext.bookings`.
   - Badges must follow color specs:
     - Upcoming / Confirmed -> Emerald badge (`bg-emerald-50 text-emerald-700 border-emerald-200`) with check icon.
     - Completed -> Slate badge (`bg-slate-100 text-slate-700 border-slate-200`) with check-circle.
     - Cancelled -> Rose badge (`bg-rose-50 text-rose-700 border-rose-200`) with x-circle.
   - Card body includes Caretaker thumbnail, caretaker name/nickname, phone call action, activity title, formatted date & time slot, destination & pickup with icons, notes, total price, and payment method badge.
   - Action buttons:
     - For upcoming: "Cancel Booking" (`t('bookings.cancelBookingBtn')`) and "Call Companion" (`t('bookings.contactCaregiverBtn')`).
     - For completed without review (`!b.hasReview`): "Leave Review" (`t('bookings.leaveReviewBtn')`) opening `ReviewModal`.
     - For completed with review (`b.hasReview`): "Reviewed (★ {rating})" badge and inline feedback quote snippet.
     - "Book Again" (`t('bookings.bookAgainBtn')`) navigating to `/book/:caretakerId`.

3. **ReviewModal Specifications**:
   - Opened when a user clicks "Leave Review" on an unreviewed completed booking.
   - Displays Caretaker summary (photo, name, date).
   - Contains an interactive 5-star rating control: 5 Star icons with hover and click state.
   - Comment textarea with placeholder `t('bookings.reviewModal.commentPlaceholder')` and quick tags (e.g. "ตรงต่อเวลา", "สุภาพ", "ชำนาญเส้นทาง").
   - Submitting invokes `addReview(bookingId, { rating, comment_th, comment_en })`, closes modal, and triggers `toast.success(t('bookings.reviewModal.successToast'))`.

4. **Elder Profile Page Component Architecture**:
   - `ElderProfilePage.jsx` serves as the container for `/elder-profile` and `/elder`.
   - Subcomponents in `src/components/elder/`:
     - `ElderProfileForm.jsx`: Encapsulates form state and validation.
     - `GeneralInfoSection.jsx`: Avatar upload mockup, Full Name (TH/EN), Nickname, Age, Gender, Blood Type, Relationship.
     - `MobilitySection.jsx`: Mobility level radio cards (`independent`, `cane`, `wheelchair_assisted`, `full_assistance`) plus mobility equipment checkboxes.
     - `MedicalConditionsSection.jsx`: Chronic conditions toggle pills, Allergies, Medications schedule textarea, Preferred Hospital, Hospital HN.
     - `PreferencesSection.jsx`: Language/dialect pills, Religion dropdown, Dietary preferences, Special notes textarea.
     - `EmergencyContactsSection.jsx`: Primary Guardian details, 24/7 Emergency contact, Primary Home/Pickup Address.
   - Top & Bottom Action CTAs:
     - "Save Profile Changes" button (`variant="accent"`): Saves to AppContext (`updateElderProfile`) and displays toast `toast.success(t('elderProfile.savedToast', 'บันทึกข้อมูลสำเร็จเรียบร้อยแล้ว!'))`.
     - "Find Caretaker for this Elder" CTA button (`variant="primary"` / `variant="outline"`): Pre-populates `searchCriteria` with elder's mobility, conditions, pickup address, language, and notes, then navigates to `/find`.

5. **i18n & Translation Matching**:
   - To satisfy opaque E2E tests, translation strings must adhere to exact regex matching patterns:
     - Tab 1: `"กำลังมาถึง ({count})"` (matches `/กำลังมาถึง|Upcoming/i`)
     - Tab 2: `"ประวัติ / ที่ผ่านมา ({count})"` (matches `/ประวัติ|ที่ผ่านมา|Past/i`)
     - Toast: `"บันทึกข้อมูลสำเร็จเรียบร้อยแล้ว!"` (matches `/บันทึกข้อมูลสำเร็จ|Profile updated|บันทึกเรียบร้อย|Success/i`)
     - Review Title: `"ให้คะแนนผู้ดูแล (Rate Caretaker)"` (matches `/ให้คะแนนผู้ดูแล|รีวิวบริการ|Rate Caretaker|Leave a Review/i`)
     - All input fields must have explicit `<label htmlFor="...">` matching tests (`getByLabelText`).

---

## 3. Caveats

1. **Initial Mock Data Review Flag**:
   - In `src/data/bookings.json`, `bk-003` was initially set to `"hasReview": true`. For interactive review testing and demo runs, `bk-003.hasReview` should be initialized as `false` so the "Leave Review" CTA is clickable upon first render, or `bookings.json` should have an unreviewed completed booking.
2. **Auto-Fill Reflection in Find Caretaker Wizard**:
   - When elder profile is saved, `updateSearchCriteria` must be called alongside `updateElderProfile` to ensure immediate synchronization when navigating from `/elder-profile` to `/find`.
3. **No External Backend**:
   - State persistence relies strictly on React Context + `localStorage`. All updates are instant and client-side.

---

## 4. Conclusion

The specification, UX structure, and interaction models for **My Bookings Page** and **Elder Profile Page** are thoroughly mapped and ready for implementation by the builder agent.

### Target Implementation Structure
```
src/
├── components/
│   ├── bookings/
│   │   ├── BookingCard.jsx
│   │   └── ReviewModal.jsx
│   └── elder/
│       ├── ElderProfileForm.jsx
│       ├── GeneralInfoSection.jsx
│       ├── MobilitySection.jsx
│       ├── MedicalConditionsSection.jsx
│       ├── PreferencesSection.jsx
│       └── EmergencyContactsSection.jsx
└── pages/
    ├── MyBookingsPage.jsx
    └── ElderProfilePage.jsx
```

### Key Functional Specifications Summary
1. **My Bookings Page**:
   - Tabs: `Upcoming ({count})` (2 sample items) and `Past ({count})` (1 sample item).
   - Badges: Confirmed in emerald (`bg-emerald-50 text-emerald-700 border-emerald-200`), Completed in slate (`bg-slate-100 text-slate-700 border-slate-200`), Cancelled in rose.
   - Action CTAs: "Cancel Booking" with confirmation modal; "Leave Review" opening `ReviewModal`.
   - `ReviewModal`: 5-star interactive rating, feedback comment, quick tags, AppContext mutation (`addReview`), success toast.
2. **Elder Profile Page**:
   - Form with 5 modular sections: General Info, Mobility Level, Medical & Medications, Preferences & Lifestyle, Emergency Contacts.
   - "Save Profile" CTA with visual success toast matching test regex `/บันทึกข้อมูลสำเร็จ|Profile updated|บันทึกเรียบร้อย|Success/i`.
   - "Find Caretaker for this Elder" CTA pre-filling `searchCriteria` and navigating to `/find`.
3. **i18n**: Full bilingual support in `th.js` and `en.js` with zero mixed labels.

---

## 5. Verification Method

To independently verify the implementation:

1. **Execute Vitest E2E Test Suite**:
   ```bash
   npx vitest run src/tests/e2e_tier1_features.test.jsx -t "Feature 7|Feature 8"
   npx vitest run src/tests/e2e_tier2_boundaries.test.jsx -t "Boundary 4"
   npx vitest run src/tests/e2e_tier3_combinations.test.jsx -t "3.2|3.3"
   ```

2. **Verify Component Files Exist in Expected Paths**:
   - `src/components/bookings/BookingCard.jsx`
   - `src/components/bookings/ReviewModal.jsx`
   - `src/components/elder/ElderProfileForm.jsx`
   - `src/pages/MyBookingsPage.jsx`
   - `src/pages/ElderProfilePage.jsx`

3. **Interactive Manual Inspection**:
   - Navigate to `/bookings`: verify Upcoming tab shows 2 bookings with emerald Confirmed badges. Switch to Past tab: verify 1 completed booking with slate badge and "Leave Review" button.
   - Click "Leave Review": verify modal opens, click 5 stars, submit, verify toast appears and card updates to "Reviewed (★ 5)".
   - Navigate to `/elder-profile`: edit name, age, mobility to "Wheelchair", click "Save Profile" -> verify success toast.
   - Click "Find Caretaker for this Elder" -> verify navigation to `/find` with pre-filled attributes.
