# Handoff Report: Milestone M2 Technical Exploration & Architecture Recommendation

**Milestone**: M2 — Home Page & Find Caretaker 3-Step Wizard  
**Agent**: Explorer 1 (`teamwork_preview_explorer_m2_1`)  
**Recipient**: Sub-Orchestrator / Implementer for M2  
**Timestamp**: 2026-08-20T06:42:30Z  

---

## 1. Observation

1. **Routing and Page Shell**:
   - `src/App.jsx:27-40` defines routes `/` -> `<HomePage />` and `/find` -> `<FindCaretakerPage />`.
   - Layout shell uses `ToastProvider`, `ScrollToTop`, `Navbar`, `<main>`, `Footer` (`src/App.jsx:20-45`).
2. **State Management**:
   - `src/context/LanguageContext.jsx:6-136` provides `{ language, lang, setLanguage, setLang, toggleLanguage, t, getLocalized }`. `t(keyPath, paramsOrFallback)` supports string interpolation tokens `{name}`, `{activity}`, `{date}`, `{budget}` (`LanguageContext.jsx:75-79`).
   - `src/context/AppContext.jsx:28-226` exposes `{ elder, elderProfile, updateElderProfile, searchCriteria, updateSearchCriteria, resetSearchCriteria, caretakers, activities, getCaretakerById, getBookingById, bookings, addBooking, cancelBooking, addReview }`.
3. **Mock Data Layer**:
   - `src/data/elder.json:1-101` defines active elder Grandma Somporn Jaidee (age 74, `wheelchair_assisted`, hypertension, diabetes type 2, knee osteoarthritis, Penicillin allergy, Siriraj Hospital HN-5948201, address at Sukhumvit 39).
   - `src/data/activities.json:1-86` defines activities.
4. **Design Tokens & Shared UI Kit**:
   - `tailwind.config.js:9-55` specifies Ocean Blue `#0EA5E9` (`primary`), Emerald Green `#10B981` (`emerald`), Ice Blue `#F0F9FF` (`ice`), Dark Navy `#0F172A` (`navy`), and Sarabun font (`font-sans`).
   - Reusable components exist in `src/components/ui/`: `Button.jsx`, `Badge.jsx`, `Card.jsx`, `MatchScoreRing.jsx`, `Modal.jsx`, `Toast.jsx`.
5. **i18n Dictionaries**:
   - `src/i18n/th.js` and `src/i18n/en.js` contain complete dictionaries for `home.*` (hero, stats, activities, promo, howItWorks, testimonials, ctaBanner) and `find.*` (step1, step2, step3, matchingLoader).
6. **Test Suite Requirements**:
   - `src/tests/e2e_tier1_features.test.jsx:107-230` tests Home Page (Feature 2) and Find Caretaker Wizard (Feature 3).
   - `src/tests/e2e_tier1_features.test.jsx:117-129` verifies 4 activity cards matching `/โรงพยาบาล|Hospital/i`, `/ไหว้พระ|ทำบุญ|Temple/i`, `/ท่องเที่ยว|ชมเมือง|City Tour|Tour/i`, `/เดินเล่น|สวนสาธารณะ|พักผ่อน|Park|Leisure/i`.
   - `src/tests/e2e_tier2_boundaries.test.jsx:112-132` tests form input retention across live language switches.
   - `src/tests/e2e_tier3_combinations.test.jsx:33-90` tests end-to-end golden journey from Home -> Find -> Matches -> Caretaker -> Book -> Bookings.
   - `src/tests/e2e_tier3_combinations.test.jsx:95-113` tests elder profile update syncing into `/find` auto-fill banner.

---

## 2. Logic Chain

1. **From Observation 1 & 2**: `src/App.jsx` and `AppContext.jsx` provide all necessary routing and state management hooks. The implementer can directly compose modular components under `src/components/home/` and `src/components/find/` and integrate them into `src/pages/HomePage.jsx` and `src/pages/FindCaretakerPage.jsx`.
2. **From Observation 3 & 4**: Active elder data (`elder.json`) contains rich healthcare and preference metadata. When `FindCaretakerPage` loads, initializing `formData` with fallback to `elder` ensures auto-fill functionality is seamless. Showing the info banner with `t('find.elderAutoFillNotice', { name })` satisfies the auto-fill acceptance criteria.
3. **From Observation 5 & 6**: The test suite validates bilingual rendering and specific keyword patterns (e.g. Activity titles must cover Hospital, Temple, City Tour, Park). Structuring `activities.json` or `ActivityGrid.jsx` to render these 4 distinct categories guarantees 100% test compatibility.
4. **From Observation 6**: `AiMatchingLoader` must simulate AI processing for 2.0–2.5 seconds using `setTimeout` and transition through 3 distinct status updates before executing `navigate('/matches')`, matching test fake-timer triggers (`vi.advanceTimersByTime(2500)`).

---

## 3. Caveats

1. **Subsequent Milestones**: Pages downstream of `/find` (`/matches`, `/caretaker/:id`, `/book/:id`, `/bookings`, `/elder-profile`) are part of Milestones M3 and M4. In end-to-end tests, navigation to `/matches` is verified, but full match card rendering is handled in M3.
2. **Test Double-Render in jsdom**: In `Navbar.jsx`, both desktop and mobile views render `LanguageToggle`. In test assertions using `getByRole('button', { name: /EN/i })`, tests may match two buttons if not disambiguated with `getAllByRole`. Implementer should ensure components on Home and Find use unique and descriptive test-ids or semantic roles.
3. **No Backend**: All state mutations (e.g., updating criteria) must remain in React Context and `localStorage`.

---

## 4. Conclusion

The codebase is fully primed for implementing Milestone M2. To achieve 100% feature and test compliance:
1. Implement 5 modular home components in `src/components/home/`: `HeroBanner.jsx`, `ActivityGrid.jsx`, `PromoBanner.jsx`, `HowItWorks.jsx`, `Testimonials.jsx`.
2. Implement 5 modular find components in `src/components/find/`: `StepIndicator.jsx`, `Step1Physical.jsx`, `Step2Preferences.jsx`, `Step3Schedule.jsx`, `AiMatchingLoader.jsx`.
3. Assemble the components in `src/pages/HomePage.jsx` and `src/pages/FindCaretakerPage.jsx`.
4. Ensure `activities.json` / `ActivityGrid.jsx` features Hospital, Temple, Park, and Shopping/City Tour.
5. Ensure `AiMatchingLoader` executes a 2.5s step-rotating timeout sequence before navigating to `/matches`.

---

## 5. Verification Method

1. **Verify Home Page & Find Wizard Features**:
   ```bash
   npx vitest run src/tests/e2e_tier1_features.test.jsx
   ```
2. **Verify Boundary & Language Retention**:
   ```bash
   npx vitest run src/tests/e2e_tier2_boundaries.test.jsx
   ```
3. **Verify Cross-Feature Combinations**:
   ```bash
   npx vitest run src/tests/e2e_tier3_combinations.test.jsx
   ```
4. **Verify Workload Scenarios**:
   ```bash
   npx vitest run src/tests/e2e_tier4_scenarios.test.jsx
   ```
5. **Verify Vite Build**:
   ```bash
   npm run build
   ```
6. **Files to Inspect**:
   - `src/pages/HomePage.jsx`
   - `src/pages/FindCaretakerPage.jsx`
   - `src/components/home/*`
   - `src/components/find/*`
   - `src/data/activities.json`
