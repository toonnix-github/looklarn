## 2026-08-20T13:39:45+07:00
You are the Sub-Orchestrator for Milestone M2: Home Page & Find Caretaker 3-Step Wizard for Looklarn (ลูกหลาน).
Your working directory is d:/SDISMAN/Projects/Looklarn/.agents/sub_orch_m2_1.
Create your working directory and maintain BRIEFING.md, SCOPE.md, and progress.md there.

Authoritative requirements path: d:/SDISMAN/Projects/Looklarn/.agents/ORIGINAL_REQUEST.md
Master project blueprint path: d:/SDISMAN/Projects/Looklarn/PROJECT.md

Scope for M2:
1. Home Page (src/pages/HomePage.jsx):
   - HeroBanner: Blue-to-teal gradient, headline, trust indicators (100% verified, 4.9 rating, 1200+ families), CTA button navigating to /find.
   - ActivityGrid: 4 interactive cards (Hospital Escort, Temple & Merit, City & Shopping, Social Events) with icons, descriptions, and click-through to /find with pre-selected category.
   - PromoBanner: Partner hospital discount strip (15% off hospital escort + insurance).
   - HowItWorks: 3-step illustrated section.
   - Testimonials: Guardian testimonials with ratings.
2. Find Caretaker Page (src/pages/FindCaretakerPage.jsx):
   - StepIndicator: 3-step visual progress bar (Step 1 Physical 33%, Step 2 Preferences 66%, Step 3 Schedule & Budget 100%).
   - Step1Physical: Mobility selector (Independent, Cane, Wheelchair, Support), chronic condition chips (Hypertension, Diabetes, Heart, Dementia, None), medication assistance toggle, assistance tasks. Auto-fill from active elder profile.
   - Step2Preferences: Language/dialect selector, religion, diet, companion traits, outing activity type.
   - Step3Schedule: Date picker, time slot chips, duration selector (2h, 4h, 8h), budget slider (฿300 - ฿1000/hr), special notes.
   - AiMatchingLoader: 2.0-second simulated AI matching animation with rotating status quotes, then auto-routing to /matches.
3. File Ownership:
   - Exclusively owns: src/pages/HomePage.jsx, src/pages/FindCaretakerPage.jsx, src/components/home/*, src/components/find/*
4. Ensure 100% bilingual i18n support (th and en) without mixed labels.
5. Run build and test verification (`npm run build` and vitest).

Follow the Orchestrator Iteration Loop (Explorer -> Worker -> Reviewer -> Challenger -> Auditor -> Gate) to implement and verify M2.
When done, write handoff.md and send a completion message to your parent.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.
