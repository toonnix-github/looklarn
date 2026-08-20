# Looklarn (ลูกหลาน) - Test Infrastructure Specification (TEST_INFRA.md)

## 1. Executive Summary & Test Philosophy
**Looklarn (ลูกหลาน)** is an AI-powered elder care companion matching web application built with React 18, Vite 5, Tailwind CSS, and React Router v6.
The End-to-End (E2E) and Integration test suite is architected around **opaque-box, requirement-driven verification**. Tests treat the application from the user perspective:
- User-visible interactions (clicks, keyboard input, route transitions, language switching)
- Accessible DOM roles, text content, and semantic landmarks
- Real context providers (`LanguageProvider`, `AppProvider`) and in-memory routing (`MemoryRouter`)
- Verification against authoritative specifications in `ORIGINAL_REQUEST.md` and interface contracts in `PROJECT.md`

Faceless or shallow unit tests that stub internal logic without exercising behavior are strictly forbidden. The test suite validates real component hierarchies, data flows, state mutations, and error handling.

---

## 2. Test Architecture & Directory Layout

```
d:/SDISMAN/Projects/Looklarn/
├── TEST_INFRA.md                     # Test Architecture & Strategy (This File)
├── TEST_READY.md                     # Test Execution Manifest & Verification Matrix
└── src/
    └── tests/
        ├── setup.js                  # Vitest + jsdom + RTL matchers & browser mocks
        ├── e2e_tier1_features.test.jsx     # Tier 1: Core Feature Coverage across 7 routes
        ├── e2e_tier2_boundaries.test.jsx   # Tier 2: Boundary, Edge Cases, Error & Responsive Widths
        ├── e2e_tier3_combinations.test.jsx # Tier 3: End-to-End Navigation & State Combination Flows
        └── e2e_tier4_scenarios.test.jsx    # Tier 4: Real-World Outing Scenarios (Hospital, Temple, Park)
```

---

## 3. Test Tier Breakdown & Objectives

### Tier 1: Feature Coverage (`e2e_tier1_features.test.jsx`)
Ensures every individual screen, route, and core feature operates cleanly in isolation:
1. **Route 1: Home (`/`)**: Hero banner gradient, "Find a Caretaker" CTA, 4 activity cards (Hospital, Temple, City Tour, Park/Leisure), Promotions strip, "How It Works" 3-step guide, Guardian testimonials.
2. **Route 2: Find a Caretaker (`/find`)**: 3-step wizard (Physical Needs -> Preferences -> Schedule & Budget), step indicator navigation, back/next buttons, elder auto-fill, and AI Matching loading animation.
3. **Route 3: Match Results (`/matches`)**: Top 3 caretaker cards with circular score rings (96%, 88%, 81%), "Best Match" highlight badge, specialty tags, hourly rates, "View Profile" and "Book Now" buttons.
4. **Route 4: Caretaker Profile (`/caretaker/:id`)**: Wave hero header, AI Match Score ring, verified credential badges, experience, bilingual bio, availability calendar, review list, and sticky bottom booking bar.
5. **Route 5: Booking & Confirmation (`/book/:id`)**: Booking summary, date/time pickers, activity category, location selection, pricing calculations (hourly x duration + service fee), and confirmation modal with reference ID.
6. **Route 6: My Bookings (`/bookings`)**: Upcoming (2 items) vs. Past (1 item) tabs, booking status badges, caretaker info, and interactive "Leave Review" modal.
7. **Route 7: Elder Profile (`/elder-profile`)**: Photo avatar, name, age, medical conditions, mobility levels, emergency contacts, dietary preferences, and save confirmation toast.
8. **Language Toggle & i18n**: TH | EN toggle in Navbar, Thai default, single-language display (no mixed labels), instant re-render across all pages.
9. **UI Kit Components**: `MatchScoreRing` SVG calculation, `Badge` variants, `Button` variants, `Modal` accessibility and backdrop, `Toast` notification trigger.

### Tier 2: Boundary & Corner Cases (`e2e_tier2_boundaries.test.jsx`)
Tests resilience against unexpected inputs, network-free edge cases, and layout constraints:
1. **Empty & Incomplete Form Submissions**: Validating required fields in Find Caretaker wizard and Elder Profile form.
2. **Direct Route Deep Linking**: Navigating directly to `/caretaker/ct-1`, `/book/ct-2`, `/matches`, `/bookings`, `/elder-profile` without going through home.
3. **Invalid & Non-Existent IDs**: Visiting `/caretaker/invalid-id-999` or `/book/unknown-id` triggers graceful 404 / error state.
4. **Rapid Language Switching**: Repeatedly toggling TH <-> EN during multi-step forms or modal states without state corruption.
5. **Extreme Data Lengths & Special Characters**: Long Thai/English names, special characters in notes/allergies, boundary ages (e.g. 105 yrs).
6. **Viewport & Responsive State Emulation**: Verification across mobile (375px), tablet (768px), and desktop (1280px).

### Tier 3: Cross-Feature Combinations (`e2e_tier3_combinations.test.jsx`)
Tests continuous end-to-end multi-page user journeys:
1. **Full Golden Journey**: Home -> Find Caretaker (3 steps) -> AI Match Loading -> Match Results -> View Caretaker Profile -> Book Caretaker -> Success Modal -> Redirect to My Bookings -> Verify new upcoming booking.
2. **Elder Profile Sync Flow**: Edit Elder Profile -> Navigate to `/find` -> Verify Step 1 physical needs and mobility auto-filled with updated values.
3. **Past Booking Review Flow**: Navigate to `/bookings` -> Switch to 'Past' tab -> Click 'Leave Review' -> Submit star rating & comment -> Verify review modal closes and status updates.
4. **Activity Quick-Start Flow**: Click "Hospital Escort" card on Home -> Land on `/find` pre-selected with Hospital activity.

### Tier 4: Real-World Workload Scenarios (`e2e_tier4_scenarios.test.jsx`)
Realistic persona-based personas and domain workflows:
1. **Scenario A: Urgent Hospital Appointment Escort**: Guardian books wheelchair-certified specialist for Somchai (age 78) for Chulalongkorn Hospital appointment.
2. **Scenario B: Buddhist Merit & Temple Excursion**: Booking companion for Grandma Malee (age 72) for Wat Phra Kaew trip with special dietary and walking cane assistance.
3. **Scenario C: Park Leisure & Mobility Escort**: Booking afternoon companion at Lumphini Park with focus on gentle pacing and hydration.

---

## 4. Test Stack & Dependencies

| Tool | Version / Purpose |
|---|---|
| **Vitest** | Fast, native ESM test runner with jsdom |
| **@testing-library/react** | React component testing through user-centric queries |
| **@testing-library/user-event** | Realistic event simulation (clicks, typing, focus) |
| **@testing-library/jest-dom** | Custom DOM matchers (`toBeInTheDocument`, `toHaveTextContent`) |
| **jsdom** | In-memory DOM implementation |

---

## 5. Test Runner Commands

```bash
# Run all E2E tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run a specific tier
npx vitest run src/tests/e2e_tier1_features.test.jsx
npx vitest run src/tests/e2e_tier2_boundaries.test.jsx
npx vitest run src/tests/e2e_tier3_combinations.test.jsx
npx vitest run src/tests/e2e_tier4_scenarios.test.jsx

# Run with test coverage report
npm run test:coverage
```

---

## 6. Coverage & Quality Gates
- **Tier 1**: >= 5 test cases per feature / route
- **Tier 2**: Full edge case coverage (empty states, invalid IDs, viewport checks)
- **Tier 3**: Continuous multi-step routing with state persistence
- **Tier 4**: 3 domain-specific realistic scenarios
- **Zero mixed language strings** verified across all views.
