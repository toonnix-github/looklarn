## 2026-08-20T06:24:49Z

You are Worker 1 for Milestone M1 (Scaffolding, Design Tokens, i18n & Shared UI Kit) for Looklarn (ลูกหลาน).
Your working directory is d:/SDISMAN/Projects/Looklarn/.agents/sub_orch_m1_1/worker_1.
Please create your working directory and maintain your progress.md and handoff.md there.

Authoritative requirements path: d:/SDISMAN/Projects/Looklarn/.agents/ORIGINAL_REQUEST.md
Master project blueprint path: d:/SDISMAN/Projects/Looklarn/PROJECT.md
Milestone Scope path: d:/SDISMAN/Projects/Looklarn/.agents/sub_orch_m1_1/SCOPE.md

Reference Explorer handoff reports:
- Explorer 1 (Scaffolding & Config): d:/SDISMAN/Projects/Looklarn/.agents/sub_orch_m1_1/explorer_1/handoff.md
- Explorer 2 (i18n, Mock Data, State): d:/SDISMAN/Projects/Looklarn/.agents/sub_orch_m1_1/explorer_2/handoff.md
- Explorer 3 (UI Kit, Layout & Router): d:/SDISMAN/Projects/Looklarn/.agents/sub_orch_m1_1/explorer_3/handoff.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your Tasks:
1. Implement Project Scaffolding & Configuration:
   - `package.json` with all required dependencies: `react`, `react-dom`, `react-router-dom`, `lucide-react`, `clsx`, `tailwind-merge`, `tailwindcss`, `postcss`, `autoprefixer`, `vite`, `@vitejs/plugin-react`, `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`.
   - `vite.config.js` (with react plugin, `@` alias, vitest setup config).
   - `tailwind.config.js` (Ocean Blue `#0EA5E9`, Emerald Green `#10B981`, Ice Blue `#F0F9FF`, Dark Navy `#0F172A`, Sarabun font family, rounded xl/2xl/3xl, custom animations).
   - `postcss.config.js`.
   - `index.html` (Google Fonts Sarabun 300..700, Looklarn title & meta description).
   - `src/index.css` (Tailwind base, components, utilities, smooth scroll, ocean scrollbar, gradient utility classes).

2. Implement i18n Subsystem:
   - `src/i18n/th.js` and `src/i18n/en.js` (complete dictionaries covering navigation, footer, home, find caretaker, match results, caretaker profile, booking, my bookings, elder profile, common tokens, badges, match criteria, price labels, toast messages).
   - `src/i18n/index.js` (exports).
   - `src/context/LanguageContext.jsx` (`useLanguage()`, default Thai, toggle 'th'|'en', dot-notation lookup `t()`, parameter interpolation, `getLocalized()`).

3. Implement Mock Data:
   - `src/data/caretakers.json` (5 detailed caretaker profiles: Somchai 96%, Nurse Aree 88%, Ploy 81%, Fa 76%, Uncle Rak 72% with full verifications, photos, badges, reviews, pricing, languages, experience, vehicle info).
   - `src/data/bookings.json` (3 bookings: 2 upcoming, 1 past).
   - `src/data/activities.json` (4 featured activities).
   - `src/data/elder.json` (Grandma Somporn profile).

4. Implement AppContext State:
   - `src/context/AppContext.jsx` (`useApp()`, managing elder, bookings with `addBooking`, `cancelBooking`, `addReview`, `updateElderProfile`, searchCriteria with `updateSearchCriteria`, localStorage sync).

5. Implement Utilities & Shared UI Kit:
   - `src/utils/cn.js` (clsx + tailwind-merge).
   - `src/utils/formatters.js` (currency THB, Thai BE / Gregorian dates, match score color tiers).
   - `src/components/ui/MatchScoreRing.jsx` (SVG circular progress ring with percentage, animated stroke, color coding >=90% emerald, >=80% ocean blue, <80% amber).
   - `src/components/ui/Badge.jsx` (variants: primary, success, warning, neutral, outline, specialist, verified, etc.).
   - `src/components/ui/Button.jsx` (variants: primary, secondary, outline, ghost, danger, sizes, loading state, icon support).
   - `src/components/ui/Card.jsx` (Card, CardHeader, CardTitle, CardContent, CardFooter).
   - `src/components/ui/Modal.jsx` (Accessible modal dialog with backdrop & close handlers).
   - `src/components/ui/Toast.jsx` (Toast notification provider & hook).

6. Implement Layout Components:
   - `src/components/layout/Navbar.jsx` (Looklarn logo, active links, language toggle, bookings count badge, mobile responsive drawer).
   - `src/components/layout/Footer.jsx` (Brand info, quick links, 1669 emergency hotline, trust badge, language switch).
   - `src/components/layout/LanguageToggle.jsx` (TH | EN switch pill).
   - `src/components/layout/ScrollToTop.jsx`.

7. Implement Router Shell & Placeholder Pages:
   - `src/main.jsx` and `src/App.jsx` (complete routing setup).
   - 8 placeholder pages in `src/pages/`:
     - `HomePage.jsx`
     - `FindCaretakerPage.jsx`
     - `MatchResultsPage.jsx`
     - `CaretakerProfilePage.jsx`
     - `BookingPage.jsx`
     - `MyBookingsPage.jsx`
     - `ElderProfilePage.jsx`
     - `NotFoundPage.jsx`

8. Implement Unit / Smoke Tests & Verification:
   - `src/tests/setup.js`
   - `src/tests/i18n.test.js` (tests dictionary key parity and translation helper)
   - `src/tests/ui-kit.test.jsx` (tests Button, Badge, MatchScoreRing, Card rendering)
   - `src/tests/context.test.jsx` (tests LanguageContext and AppContext)
   - Run `npm install` (or ensure node_modules are intact) and execute `npm run build` and `npm run test` (or `npx vitest run`).
   - Ensure `npm run build` generates a clean production build without errors.

9. Write complete handoff report to `d:/SDISMAN/Projects/Looklarn/.agents/sub_orch_m1_1/worker_1/handoff.md` and notify parent via `send_message`.
