## 2026-08-20T11:21:01Z

You are Worker 1 for Milestone M4: Booking Flow, My Bookings & Elder Profile.
Your working directory is d:/SDISMAN/Projects/Looklarn/.agents/sub_orch_m4_1/worker_1.

Authoritative requirements path: d:/SDISMAN/Projects/Looklarn/.agents/ORIGINAL_REQUEST.md
Master project blueprint path: d:/SDISMAN/Projects/Looklarn/PROJECT.md
Milestone scope path: d:/SDISMAN/Projects/Looklarn/.agents/sub_orch_m4_1/SCOPE.md
Explorer handoff reports to read:
- d:/SDISMAN/Projects/Looklarn/.agents/sub_orch_m4_1/explorer_1/handoff.md
- d:/SDISMAN/Projects/Looklarn/.agents/sub_orch_m4_1/explorer_2/handoff.md
- d:/SDISMAN/Projects/Looklarn/.agents/sub_orch_m4_1/explorer_3/handoff.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

File Ownership:
You have exclusive write ownership over:
- src/pages/BookingPage.jsx
- src/pages/MyBookingsPage.jsx
- src/pages/ElderProfilePage.jsx
- src/components/booking/* (BookingSummaryCard.jsx, LocationPicker.jsx, PriceBreakdown.jsx, PaymentMethodSelector.jsx, BookingSuccessModal.jsx)
- src/components/bookings/* (BookingCard.jsx, ReviewModal.jsx, CancelConfirmModal.jsx)
- src/components/elder/* (ElderProfileForm.jsx, GeneralInfoSection.jsx, MobilitySection.jsx, MedicalConditionsSection.jsx, PreferencesSection.jsx, EmergencyContactsSection.jsx)
- You may also update translation keys in src/i18n/th.js and src/i18n/en.js, and initial data in src/data/bookings.json if needed for test alignment.

Detailed Tasks:
1. Implement Booking Flow:
   - Refactor src/pages/BookingPage.jsx and create components in src/components/booking/:
     - BookingSummaryCard.jsx: Elder summary, Caretaker summary with MatchScoreRing/Tier, Activity, Date & Time slot.
     - LocationPicker.jsx: Pickup address input (defaulting to elder home address), "Use Elder's Address" button, destination address input, landmark/meeting notes textarea.
     - PriceBreakdown.jsx: Itemized calculation (hourly rate x hours, platform/insurance fee ฿100, promo code input e.g. LOOKLARNCARE for -฿150 discount, total price display, Confirm button).
     - PaymentMethodSelector.jsx: PromptPay QR (default with simulated QR code frame), Credit Card, Mobile Banking.
     - BookingSuccessModal.jsx: Reference ID (#LK-YYYYMMDD-XXX or #LK-BK-XXXX), appointment summary, navigation buttons to "Go to My Bookings" (/bookings) and "Back to Home" (/), appends new booking to AppContext.
2. Implement My Bookings Page:
   - Refactor src/pages/MyBookingsPage.jsx and create components in src/components/bookings/:
     - Tabs for "Upcoming Bookings" (2 sample bookings) | "Past Outings" (1 sample booking) with tab counts and proper tab roles.
     - Booking cards (BookingCard.jsx) with status badges: Confirmed in emerald, Completed in slate, Cancelled in rose.
     - Past booking card has "Leave Review" CTA opening ReviewModal.jsx (5-star interactive rating, feedback comments, quick tags, updates AppContext.addReview, triggers success toast).
     - Cancel booking with confirmation modal (CancelConfirmModal.jsx).
3. Implement Elder Profile Page:
   - Refactor src/pages/ElderProfilePage.jsx and create components in src/components/elder/:
     - ElderProfileForm.jsx containing sections:
       - GeneralInfoSection: Editable photo mockup, name (TH & EN), nickname, age, gender, blood type.
       - MobilitySection: Mobility Level selector (Independent, Cane, Wheelchair, Assisted).
       - MedicalConditionsSection: Medical conditions chips & medications (Hypertension, Diabetes, Knee osteoarthritis, allergies, hospital HN).
       - PreferencesSection: Language/dialect, religion, dietary preferences, special notes.
       - EmergencyContactsSection: Emergency guardian contacts (name, relationship, phone), home address.
     - "Save Profile" button updating AppContext (updateElderProfile and syncing searchCriteria) and triggering visual success toast.
     - "Find Caretaker for this Elder" CTA button pre-populating searchCriteria and navigating to /find.
4. Verify 100% bilingual i18n support in th.js and en.js without mixed strings.
5. Run build and tests:
   - `npm run build`
   - `npx vitest run`
   Verify all tests pass with zero regressions.
6. Write a comprehensive handoff report to d:/SDISMAN/Projects/Looklarn/.agents/sub_orch_m4_1/worker_1/handoff.md with all changes, build/test results, and verification evidence.
When done, message your parent with summary and file path.
