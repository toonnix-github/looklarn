# BRIEFING — 2026-08-20T06:45:00Z

## Mission
Implement Milestone M2: Home Page (`/`) and Find Caretaker 3-Step Wizard (`/find`) with modular components, genuine logic, 100% bilingual parity, elder profile auto-fill, and 2.5s AI matching simulation.

## 🔒 My Identity
- Archetype: worker
- Roles: implementer, qa, specialist
- Working directory: d:/SDISMAN/Projects/Looklarn/.agents/teamwork_preview_worker_m2_1
- Original parent: 7c7da902-9945-4483-b49e-df854dddd5d3
- Milestone: M2 (Home Page & Find Caretaker 3-Step Wizard)

## 🔒 Key Constraints
- Genuine implementation — no cheating, no hardcoding of test assertions or facade logic.
- 100% Thai & English bilingual key parity with zero mixed-language strings.
- 4 interactive activity cards matching E2E regexes and navigation to /find with preselection.
- Auto-fill from active elder profile with notice badge.
- Smooth 2.5s AI matching animation before routing to /matches.
- Full unit and E2E test verification.

## Current Parent
- Conversation ID: 7c7da902-9945-4483-b49e-df854dddd5d3
- Updated: not yet

## Task Summary
- **What to build**:
  - `src/components/home/`: `HeroBanner.jsx`, `ActivityGrid.jsx`, `PromoBanner.jsx`, `HowItWorks.jsx`, `Testimonials.jsx`, `CtaSection.jsx`
  - `src/pages/HomePage.jsx`: Composed cleanly using modular components with `data-testid="page-home"`
  - `src/components/find/`: `StepIndicator.jsx`, `Step1Physical.jsx`, `Step2Preferences.jsx`, `Step3Schedule.jsx`, `AiMatchingLoader.jsx`
  - `src/pages/FindCaretakerPage.jsx`: Composed cleanly coordinating form state and step transitions with `data-testid="page-find"`
  - `src/data/activities.json`: Hospital, Temple & Merit, City Tour & Shopping, Park & Leisure
  - `src/i18n/th.js` & `src/i18n/en.js`: Complete leaf key parity and natural phrasing
- **Success criteria**:
  - `npm test` passing for all M2 and integrated journeys
  - `npm run build` passing without errors

## Change Tracker
- **Files modified**: None yet
- **Build status**: In progress
- **Pending issues**: None

## Quality Status
- **Build/test result**: In progress
- **Lint status**: 0 violations
- **Tests added/modified**: None yet

## Loaded Skills
- None specified
