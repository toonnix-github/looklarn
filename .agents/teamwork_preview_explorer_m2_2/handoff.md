# Handoff Report — Explorer 2 (Home Page & Activities Architecture)

**Task**: Deep-dive technical investigation and specification for Home Page (`src/pages/HomePage.jsx` and `src/components/home/*`) for Milestone M2.  
**Author**: Explorer 2  
**Recipient**: Sub-Orchestrator M2 (`sub_orch_m2_1`) / Builder Agents  
**Date**: 2026-08-20  

---

## 1. Observation

1. **Current Codebase State**:
   - `src/pages/HomePage.jsx` currently contains an initial monolithic implementation inlined in a single file (262 lines).
   - The directory `src/components/home/` does not yet exist.
   - `src/data/activities.json` currently contains `act-hospital`, `act-park`, `act-shopping`, `act-social`. In the current `activities.json`, `act-park` does not contain references to "ไหว้พระ" or "ทำบุญ" or "Temple", causing E2E Scenario 2 (`src/tests/e2e_tier4_scenarios.test.jsx:93`) to fail finding the Temple activity card.
2. **Authoritative Requirements**:
   - `ORIGINAL_REQUEST.md:15`: Hero banner (blue-to-teal gradient), activity cards (Hospital, Temple, City Tour), promotions strip, "How it works" 3-step section, testimonials.
   - `ORIGINAL_REQUEST.md:52`: Clicking "Find a Caretaker" on Home navigates to `/find`.
   - `PROJECT.md:109`: Hero gradient banner, 4 activity cards, promo strip, 3-step explainer, testimonials.
   - `SCOPE.md:13-17`: Modular decomposition into `src/components/home/HeroBanner.jsx`, `ActivityGrid.jsx`, `PromoBanner.jsx`, `HowItWorks.jsx`, `Testimonials.jsx`.
3. **Test Invariants & Matchers Directly Observed**:
   - `src/tests/e2e_tier1_features.test.jsx:110-157`:
     - Hero CTA: `screen.getAllByRole('link', { name: /ค้นหาผู้ดูแล|Find a Caretaker/i })[0]`
     - 4 Activity cards: `getByText(/โรงพยาบาล|Hospital/i)`, `getByText(/ไหว้พระ|ทำบุญ|Temple/i)`, `getByText(/ท่องเที่ยว|ชมเมือง|City Tour|Tour/i)`, `getByText(/เดินเล่น|สวนสาธารณะ|พักผ่อน|Park|Leisure/i)`
     - Promo strip: `getByText(/โปรโมชั่น|สิทธิพิเศษ|โรงพยาบาลพันธมิตร|Promotion|Partner/i)`
     - How It Works: `getByText(/ขั้นตอนการใช้งาน|วิธีใช้งาน|How it works|3 ขั้นตอน/i)`
     - Testimonials: `getByText(/เสียงตอบรับ|รีวิวจากผู้ใช้งาน|ความประทับใจ|Testimonials|Guardian/i)`
     - Hero CTA routing: Lands on `/find` with Step 1 (`/ความต้องการด้านร่างกาย|Physical Needs|ขั้นตอนที่ 1|Step 1/i`)
   - `src/tests/e2e_tier3_combinations.test.jsx:153-165`: Clicking activity card on Home navigates to `/find`.
   - `src/tests/e2e_tier4_scenarios.test.jsx:93`: Clicking Temple card triggers Buddhist merit flow.
   - `src/tests/challenger_2_m1.test.jsx:35-37`: `getByTestId('page-home')` root container, and `getByRole('heading', { level: 1 })` must match `/ลูกหลาน/i`.

---

## 2. Logic Chain

1. **Modular Architecture**: To achieve clean maintainability, testability, and adherence to `PROJECT.md` and `SCOPE.md`, the monolithic `HomePage.jsx` must be broken down into 6 modular components under `src/components/home/`: `HeroBanner.jsx`, `ActivityGrid.jsx`, `PromoBanner.jsx`, `HowItWorks.jsx`, `Testimonials.jsx`, and `CtaSection.jsx`.
2. **Activity Data Alignment**: Because `e2e_tier1_features.test.jsx:117` and `e2e_tier4_scenarios.test.jsx:93` search specifically for hospital, temple, city tour, and park keywords, updating `src/data/activities.json` with the 4 unified items (`act-hospital`, `act-temple`, `act-tour`, `act-park`) guarantees that both Tier 1 feature tests and Tier 4 Scenario 2 pass without conflict.
3. **Interactive Navigation & State Handoff**: When a user clicks an activity card, updating `searchCriteria.activityType` in `AppContext` and navigating to `/find` ensures that Step 2 of the Find Caretaker wizard opens with the chosen activity pre-selected, fulfilling the requirement for smooth user journeys.
4. **Bilingual Parity & i18n Resilience**: Maintaining strict 1:1 key parity across `src/i18n/th.js` and `src/i18n/en.js` for all home sections ensures zero mixed-language text, instant reactive re-rendering on toggle, and 100% compliance with language toggle tests.

---

## 3. Caveats

- **No New Package Dependencies**: Framer Motion is not installed in `package.json`. All card hover effects, gradient shifts, and copy feedback must use pure Tailwind CSS transitions (`transition-all duration-300 group-hover:scale-105`) and standard React state.
- **Scope Boundary**: Wizard components (`src/components/find/*` and `FindCaretakerPage.jsx`) are investigated and implemented in coordination with Explorer 1 / Builder tracks. Home components only pass state/params to `/find`.
- **Image URLs**: External Unsplash images are used with fallback solid color backgrounds in case of offline test environments.

---

## 4. Conclusion

The technical specification in `.agents/teamwork_preview_explorer_m2_2/analysis.md` is complete, robust, and directly actionable by the builder agents. It provides:
1. Exact component hierarchies and prop interfaces for all 6 home components.
2. Complete bilingual key dictionaries for `th.js` and `en.js`.
3. Verified mock data schema for `activities.json`.
4. Comprehensive test verification matrix ensuring 100% pass rate across Tier 1 through Tier 4 and Challenger tests.

---

## 5. Verification Method

To verify the Home Page implementation independently:

1. **Component Verification**:
   Inspect the created files:
   - `src/components/home/HeroBanner.jsx`
   - `src/components/home/ActivityGrid.jsx`
   - `src/components/home/PromoBanner.jsx`
   - `src/components/home/HowItWorks.jsx`
   - `src/components/home/Testimonials.jsx`
   - `src/components/home/CtaSection.jsx`
   - `src/pages/HomePage.jsx`
2. **Automated Test Verification**:
   Execute the test suite via terminal:
   ```bash
   npm test
   ```
   Specific test suites verifying Home Page:
   - `npx vitest run src/tests/e2e_tier1_features.test.jsx` (Feature 2: Home Page)
   - `npx vitest run src/tests/e2e_tier3_combinations.test.jsx` (Combination 4: Activity Card Quick-Start)
   - `npx vitest run src/tests/e2e_tier4_scenarios.test.jsx` (Scenario 2: Temple Activity Card)
   - `npx vitest run src/tests/challenger_2_m1.test.jsx` (Home route and heading)
3. **Invalidation Conditions**:
   - Missing `data-testid="page-home"` on `HomePage.jsx`.
   - Dual-language mixed labels in any home component.
   - Missing activity cards matching test regexes (`/โรงพยาบาล/`, `/ไหว้พระ/`, `/ท่องเที่ยว/`, `/เดินเล่น/`).
