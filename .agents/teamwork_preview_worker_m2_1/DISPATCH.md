## 2026-08-20T06:43:58Z
You are Worker 1 for Milestone M2 (Home Page & Find Caretaker 3-Step Wizard).
Your working directory is d:/SDISMAN/Projects/Looklarn/.agents/teamwork_preview_worker_m2_1.
Create your working directory and write your implementation report to d:/SDISMAN/Projects/Looklarn/.agents/teamwork_preview_worker_m2_1/changes.md and handoff.md.

Read the authoritative requirements and master project files:
- d:/SDISMAN/Projects/Looklarn/.agents/ORIGINAL_REQUEST.md
- d:/SDISMAN/Projects/Looklarn/PROJECT.md
- d:/SDISMAN/Projects/Looklarn/.agents/sub_orch_m2_1/SCOPE.md
- d:/SDISMAN/Projects/Looklarn/.agents/teamwork_preview_explorer_m2_1/analysis.md
- d:/SDISMAN/Projects/Looklarn/.agents/teamwork_preview_explorer_m2_2/analysis.md
- d:/SDISMAN/Projects/Looklarn/.agents/teamwork_preview_explorer_m2_3/analysis.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your Implementation Scope:
1. Home Page Components (`src/components/home/`):
   - `HeroBanner.jsx`: Blue-to-teal gradient (`bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600` or theme tokens), headline, trust indicators (100% verified, 4.9 rating, 1200+ families), CTA button navigating to `/find`.
   - `ActivityGrid.jsx`: 4 interactive category cards (Hospital Escort `act-hospital`, Temple & Merit `act-temple`, City Tour & Shopping `act-tour`, Park & Leisure `act-park`) with Lucide icons, descriptions, and click-through navigating to `/find` with activity pre-selection.
   - `PromoBanner.jsx`: Partner hospital discount strip (15% off hospital escort + insurance partner trust badge, copyable promo code `LOOKLARNCARE`).
   - `HowItWorks.jsx`: 3-step illustrated visual section explaining booking flow.
   - `Testimonials.jsx`: Guardian testimonials with star ratings, quotes, user avatars.
   - `CtaSection.jsx`: Bottom call to action banner.
   - `src/pages/HomePage.jsx`: Composed cleanly using the modular components, with `data-testid="page-home"`.
2. Find Caretaker 3-Step Wizard Components (`src/components/find/`):
   - `StepIndicator.jsx`: 3-step visual progress bar (Step 1 Physical 33%, Step 2 Preferences 66%, Step 3 Schedule & Budget 100%).
   - `Step1Physical.jsx`: Mobility selector (Independent, Cane, Wheelchair, Support), chronic condition chips (Hypertension, Diabetes, Heart, Dementia, None), medication assistance toggle, assistance tasks. Auto-fill from active elder profile (`elder.json` via AppContext) with notice banner.
   - `Step2Preferences.jsx`: Outing activity selector (synced from Home/URL if provided), language/dialect selector (Central Thai, Isan, Northern, Southern, Teochew, English), religion, diet, companion traits.
   - `Step3Schedule.jsx`: Date picker, time slot chips (Morning, Afternoon, Evening, Full Day), duration selector (2h, 4h, 8h), budget slider (฿300 - ฿1000/hr), special notes, submit CTA ("ค้นหาผู้ดูแลที่เหมาะสม / Find Matches").
   - `AiMatchingLoader.jsx`: 2.5-second simulated AI matching animation with radar/pulse effects and 3 rotating status quotes, then auto-routing to `/matches`.
   - `src/pages/FindCaretakerPage.jsx`: Composed cleanly coordinating form state, backward/forward step transitions, validation, and passing search criteria to `AppContext`.
3. Data & i18n Alignment:
   - Ensure `src/data/activities.json` has the 4 standard categories matching all E2E test regexes.
   - Ensure `src/i18n/th.js` and `src/i18n/en.js` have 100% leaf key parity with zero missing or mixed language strings.
4. Verification:
   - Run `npm test` and `npm run build`.
   - Verify that all unit and E2E tests pass 100%.
   - Document commands, test output, and file changes in `changes.md` and `handoff.md`.
