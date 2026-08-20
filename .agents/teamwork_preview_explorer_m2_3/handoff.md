# Handoff Report: Milestone M2 — Find Caretaker 3-Step Wizard & AI Matching Engine

**Author**: Explorer 3 (`teamwork_preview_explorer_m2_3`)  
**Recipient**: Sub-Orchestrator M2 (`sub_orch_m2_1`) / Parent Agent  
**Date**: 2026-08-20  

---

## 1. Observation

1. **Codebase Status**:
   - `src/pages/FindCaretakerPage.jsx` (Lines 1–419) currently holds a monolithic placeholder implementation without subcomponents.
   - The directory `src/components/find/` does not yet exist.
   - `src/context/AppContext.jsx` (Lines 9–26, 156–169) provides `searchCriteria`, `updateSearchCriteria`, `elder`, and `elderProfile` in state with persistence to `localStorage`.
   - `src/i18n/th.js` and `src/i18n/en.js` (Lines 132–222) have `find` and `matches` namespace sections, but need complete key alignment and additions for evening time slot and auto-fill labels.
2. **Test Suite Requirements**:
   - `src/tests/e2e_tier1_features.test.jsx` (Lines 160–230): Feature 3 verifies StepIndicator (Step 1, 2, 3), Step 1 mobility & condition selection, backward/forward navigation, Step 3 schedule & budget slider, and 2.5s AI matching animation advancing to `/matches`.
   - `src/tests/e2e_tier2_boundaries.test.jsx` (Lines 112–133): Boundary 3.2 verifies form input retention when switching between `TH` and `EN` during wizard steps.
   - `src/tests/e2e_tier3_combinations.test.jsx` (Lines 100–113, 153–165): Combination 3.1 & 3.4 test elder profile updates auto-filling into `/find` and Home activity card quick-start navigation to `/find`.
   - `src/tests/e2e_tier4_scenarios.test.jsx` (Lines 30–140): Scenarios 1 & 2 execute end-to-end user flows from `/find` -> AI matching (2.5s) -> `/matches` -> Caretaker Profile -> Booking.
   - `src/tests/i18n.test.js` (Lines 29–39): Validates 100% exact leaf key parity between `th.js` and `en.js`.

---

## 2. Logic Chain

1. **Component Decomposition**: Refactoring `FindCaretakerPage.jsx` into 5 dedicated components under `src/components/find/` (`StepIndicator.jsx`, `Step1Physical.jsx`, `Step2Preferences.jsx`, `Step3Schedule.jsx`, `AiMatchingLoader.jsx`) provides clean separation of concerns and maintainability while preserving unified state orchestration in the page wrapper.
2. **Elder Profile Auto-Fill**: Linking initial form state with `AppContext.elder` and displaying an informative notice banner (`t('find.elderAutoFillNotice')`) satisfies both user experience requirements and E2E Tier 3 combination tests without manual duplicate data entry.
3. **Activity Pre-Selection**: Inspecting `location.state?.activityType` or `?activity=` URL parameters ensures that quick-starts from Home page activity cards automatically select the matching activity card on Step 2.
4. **AI Matching Simulation**: Implementing a 2.5s simulated loader in `AiMatchingLoader.jsx` with 3 rotating status quotes and seamless timer progression triggers the exact regex matchers in Tier 1 and Tier 4 tests and routes cleanly to `/matches`.
5. **Strict i18n Parity**: Maintaining identical dictionary structures in `th.js` and `en.js` ensures that `i18n.test.js` passes without leaf key mismatches and prevents untranslated UI elements.

---

## 3. Caveats

- **Timeouts in E2E Tests**: Vitest fake timers (`vi.useFakeTimers()`) in `e2e_tier1` and `e2e_tier4` advance by 2500ms. The `AiMatchingLoader` completion timer must align with this interval (2.0s–2.5s).
- **DOM Accessibility Matchers**: Test assertions use specific regexes like `/ใช้วีลแชร์|Wheelchair|ใช้ไม้เท้า|Cane|เดินได้ปกติ|Independent/i` and `/ค้นหาผู้ดูแลที่เหมาะสม|จับคู่ AI|Find Matches|Match Now/i`. All radio inputs must use `<label>` wrappers or matching aria labels to satisfy both `getByLabelText` and `getByRole`.
- **No Direct Backend**: All mock state relies on `AppContext` and `localStorage`.

---

## 4. Conclusion

The technical plan is complete and actionable. The implementation requires:
1. Creating `src/components/find/StepIndicator.jsx` (3-step progress bar with 33%/66%/100% indicator).
2. Creating `src/components/find/Step1Physical.jsx` (Mobility cards, multi-select conditions, meds toggle, elder auto-fill banner).
3. Creating `src/components/find/Step2Preferences.jsx` (Outing activities, dialects, religion, diet, gender preference, URL pre-select).
4. Creating `src/components/find/Step3Schedule.jsx` (Date, time slots, duration, ฿300-฿1000 budget slider, locations, notes, submit CTA).
5. Creating `src/components/find/AiMatchingLoader.jsx` (2.5s pulsing radar animation with 3 rotating status quotes and auto-navigation).
6. Refactoring `src/pages/FindCaretakerPage.jsx` to coordinate state, validation, and component transitions.
7. Updating `src/i18n/th.js` and `src/i18n/en.js` with exact key parity.

Full component specifications, state schemas, and translation key dictionaries are documented in `analysis.md`.

---

## 5. Verification Method

To independently verify the implementation once coded:
1. **Unit & i18n Tests**:
   ```bash
   npx vitest run src/tests/i18n.test.js
   ```
   *Expected*: Passes 100% with exact key parity.
2. **Find Caretaker Feature & Boundary Tests**:
   ```bash
   npx vitest run src/tests/e2e_tier1_features.test.jsx -t "Feature 3"
   npx vitest run src/tests/e2e_tier2_boundaries.test.jsx -t "3.2"
   npx vitest run src/tests/e2e_tier3_combinations.test.jsx -t "3.1|3.4"
   npx vitest run src/tests/e2e_tier4_scenarios.test.jsx
   ```
   *Expected*: All step transitions, form inputs, language switches, auto-fill, and AI loader navigations pass cleanly.
3. **Build Check**:
   ```bash
   npm run build
   ```
   *Expected*: Zero syntax or compilation errors.
