## 2026-08-20T06:39:45Z

You are the Sub-Orchestrator for Milestone M4: Booking Flow, My Bookings & Elder Profile for Looklarn (ลูกหลาน).
Your working directory is d:/SDISMAN/Projects/Looklarn/.agents/sub_orch_m4_1.
Create your working directory and maintain BRIEFING.md, SCOPE.md, and progress.md there.

Authoritative requirements path: d:/SDISMAN/Projects/Looklarn/.agents/ORIGINAL_REQUEST.md
Master project blueprint path: d:/SDISMAN/Projects/Looklarn/PROJECT.md

Scope for M4:
1. Booking Page (src/pages/BookingPage.jsx):
   - BookingSummaryCard: Elder summary, Caretaker summary, selected activity, date & time slot.
   - LocationPicker: Pickup address input (defaulting to elder home address), destination address input, landmark/meeting notes.
   - PriceBreakdown: Itemized breakdown (caretaker hourly rate x hours, platform/insurance fee, promotional discount, total).
   - PaymentMethod selector: PromptPay QR (default), Credit Card, Mobile Banking.
   - Confirm Booking button -> Triggers BookingSuccessModal.
   - BookingSuccessModal: Reference ID (#LK-20260825-001), appointment summary, navigation buttons to "Go to My Bookings" (/bookings) and "Back to Home" (/). Appends new booking to AppContext.
2. My Bookings Page (src/pages/MyBookingsPage.jsx):
   - Tabs: "Upcoming Bookings" (2 sample bookings) | "Past Outings" (1 sample booking).
   - Booking cards with status badges (Confirmed in emerald, Completed in slate).
   - Past booking card has "Leave Review" CTA opening ReviewModal with 5-star rating and comment submission (updates caretaker reviews in state).
3. Elder Profile Page (src/pages/ElderProfilePage.jsx):
   - ElderProfileForm: Editable sections for elder's photo, name, nickname, age, gender, blood type.
   - Mobility Level selector (Independent, Cane, Wheelchair, Assisted).
   - Medical conditions & medications (Hypertension, Diabetes, Knee osteoarthritis, etc.).
   - Preferences: Language/dialect, religion, dietary preferences, special notes.
   - Emergency guardian contacts (name, relationship, phone).
   - Save Profile button updating AppContext and triggering visual success toast.
   - "Find Caretaker for this Elder" CTA button navigating to /find with pre-filled attributes.
4. File Ownership:
   - Exclusively owns: src/pages/BookingPage.jsx, src/pages/MyBookingsPage.jsx, src/pages/ElderProfilePage.jsx, src/components/booking/*, src/components/bookings/*, src/components/elder/*
5. Ensure 100% bilingual i18n support (th and en) without mixed labels.
6. Run build and test verification (`npm run build` and vitest).

Follow the Orchestrator Iteration Loop (Explorer -> Worker -> Reviewer -> Challenger -> Auditor -> Gate) to implement and verify M4.
When done, write handoff.md and send a completion message to your parent.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.
