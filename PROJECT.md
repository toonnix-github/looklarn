# Project: Looklarn (ลูกหลาน)
# AI-Powered Elder Care Companion Matching Platform (Web Prototype)

## Architecture
- **Framework & Tooling**: React 18 + Vite 5 + Tailwind CSS v3 + Lucide React + React Router v6
- **Typography & Aesthetics**: Google Fonts Sarabun, Ocean Blue (`#0EA5E9`), Emerald Green (`#10B981`), Ice Blue (`#F0F9FF`), Dark Navy (`#0F172A`), rounded xl/2xl, soft shadows
- **Language & i18n**: Single-language rendering with `TH | EN` pill toggle in navbar. Default Thai. Clean translation dictionaries in `src/i18n/th.js` and `src/i18n/en.js`. Zero mixed-language labels.
- **State Management**: React Context (`LanguageContext`, `AppContext` managing bookings, elder profile, and matching criteria).
- **Data Layer**: Pure client-side mock JSON (`caretakers.json`, `bookings.json`, `activities.json`, `elder.json`).

## Code Layout
```
d:/SDISMAN/Projects/Looklarn/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── i18n/
│   │   ├── index.js
│   │   ├── th.js
│   │   └── en.js
│   ├── context/
│   │   ├── LanguageContext.jsx
│   │   └── AppContext.jsx
│   ├── data/
│   │   ├── caretakers.json
│   │   ├── bookings.json
│   │   ├── activities.json
│   │   └── elder.json
│   ├── utils/
│   │   ├── cn.js
│   │   └── formatters.js
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── LanguageToggle.jsx
│   │   │   └── ScrollToTop.jsx
│   │   ├── ui/
│   │   │   ├── MatchScoreRing.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── Toast.jsx
│   │   ├── home/
│   │   │   ├── HeroBanner.jsx
│   │   │   ├── ActivityGrid.jsx
│   │   │   ├── HowItWorks.jsx
│   │   │   ├── PromoBanner.jsx
│   │   │   └── Testimonials.jsx
│   │   ├── find/
│   │   │   ├── StepIndicator.jsx
│   │   │   ├── Step1Physical.jsx
│   │   │   ├── Step2Preferences.jsx
│   │   │   ├── Step3Schedule.jsx
│   │   │   └── AiMatchingLoader.jsx
│   │   ├── matches/
│   │   │   ├── CaretakerMatchCard.jsx
│   │   │   └── MatchSummaryHeader.jsx
│   │   ├── caretaker/
│   │   │   ├── CaretakerWaveHero.jsx
│   │   │   ├── CaretakerStats.jsx
│   │   │   ├── CaretakerBio.jsx
│   │   │   ├── AvailabilityCalendar.jsx
│   │   │   ├── CaretakerReviews.jsx
│   │   │   └── StickyBookingBar.jsx
│   │   ├── booking/
│   │   │   ├── BookingSummaryCard.jsx
│   │   │   ├── LocationPicker.jsx
│   │   │   ├── PriceBreakdown.jsx
│   │   │   └── BookingSuccessModal.jsx
│   │   ├── bookings/
│   │   │   ├── BookingCard.jsx
│   │   │   └── ReviewModal.jsx
│   │   └── elder/
│   │       └── ElderProfileForm.jsx
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── FindCaretakerPage.jsx
│   │   ├── MatchResultsPage.jsx
│   │   ├── CaretakerProfilePage.jsx
│   │   ├── BookingPage.jsx
│   │   ├── MyBookingsPage.jsx
│   │   ├── ElderProfilePage.jsx
│   │   └── NotFoundPage.jsx
│   └── tests/
│       ├── setup.js
│       ├── e2e_tier1_features.test.jsx
│       ├── e2e_tier2_boundaries.test.jsx
│       ├── e2e_tier3_combinations.test.jsx
│       └── e2e_tier4_scenarios.test.jsx
```

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Scaffolding & Build Setup | Vite + React + Tailwind + PostCSS + Vitest | M1 | ORIGINAL_REQUEST §R1, §Build |
| 2 | Design Tokens & Global CSS | Ocean Blue `#0EA5E9`, Emerald Green `#10B981`, Ice Blue `#F0F9FF`, Dark Navy `#0F172A`, Sarabun font | M1 | ORIGINAL_REQUEST §R2 |
| 3 | Language Context & i18n Dictionaries | TH \| EN toggle pill, default Thai, separate `th.js`/`en.js`, zero mixed labels | M1 | ORIGINAL_REQUEST §R3 |
| 4 | Mock Data Layer | 5 caretakers, 3 bookings, 4 activities, 1 elder profile | M1 | ORIGINAL_REQUEST §R4 |
| 5 | Shared UI Kit & SVG Match Score Ring | MatchScoreRing (96%, 88%, 81%), Badge, Button, Card, Modal, Toast | M1 | ORIGINAL_REQUEST §R1, §Match Results |
| 6 | Navigation & App Layout Shell | Navbar, Footer, LanguageToggle, ScrollToTop, Route registration | M1 | ORIGINAL_REQUEST §R1, §Navigation |
| 7 | Home Page (`/`) | Hero gradient banner, 4 activity cards, promo strip, 3-step explainer, testimonials | M2 | ORIGINAL_REQUEST §R1 |
| 8 | Find Caretaker Wizard (`/find`) | 3-step form (Physical -> Preferences -> Schedule & Budget) + progress indicator | M2 | ORIGINAL_REQUEST §R1, §Acceptance |
| 9 | Elder Profile Auto-Fill in Wizard | Wizard pre-fills mobility, health, and name from active elder profile | M2 | ORIGINAL_REQUEST §R1, docs/impl |
| 10 | AI Matching Loading Animation | 2-second radar/pulse animation with rotating status quotes before routing to `/matches` | M2 | ORIGINAL_REQUEST §R1, docs/flow |
| 11 | Match Results Page (`/matches`) | Top 3 caretaker cards with circular score rings (96%, 88%, 81%), "Best Match" badge, View Profile / Book Now | M3 | ORIGINAL_REQUEST §R1, §Match Results |
| 12 | Caretaker Profile Page (`/caretaker/:id`) | Wave header in ocean blue gradient, AI Match Score badge, verification badges, experience, bio, reviews, calendar | M3 | ORIGINAL_REQUEST §R1 |
| 13 | Sticky Bottom Booking Bar | Pinned viewport bottom container with caretaker summary, rate, and "Book" button | M3 | ORIGINAL_REQUEST §R1 |
| 14 | Booking & Confirmation Flow (`/book/:id`) | Summary (elder+caretaker+date+activity), location picker, price breakdown, payment options | M4 | ORIGINAL_REQUEST §R1 |
| 15 | Booking Success Modal | Confirmation modal with reference ID (`#LK-20260825-001`), navigation to `/bookings` | M4 | ORIGINAL_REQUEST §R1, §Acceptance |
| 16 | My Bookings Page (`/bookings`) | Tabs for Upcoming (2 items) & Past (1 item), status badges, "Leave Review" interactive modal | M4 | ORIGINAL_REQUEST §R1 |
| 17 | Elder Profile Page (`/elder-profile`) | Editable elder photo, name, age, medical conditions, mobility, preferences, emergency contacts, save toast | M4 | ORIGINAL_REQUEST §R1 |
| 18 | E2E Testing Suite (Tiers 1-4) | Comprehensive opaque-box test suite published in `TEST_READY.md` | E2E Track | Project Pattern Spec |
| 19 | Final E2E Test Suite Pass (100%) | Full test execution, verification, and regression prevention | M5 | Project Pattern Spec |
| 20 | Adversarial Coverage Hardening (Tier 5) | White-box edge case testing, challenger verification, forensic integrity audit | M5 | Project Pattern Spec |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| E2E | E2E Testing Track | Test infra, Tiers 1-4 test suite, publish `TEST_READY.md` | none | DONE |
| M1 | Scaffolding, Design Tokens, i18n & Shared UI Kit | package.json, vite, tailwind, fonts, i18n, mock data, layout, UI kit, routes | none | DONE |
| M2 | Home Page & Find Caretaker 3-Step Wizard | `/` (Home), `/find` (3-step form, elder auto-fill, AI matching animation) | M1 | IN_PROGRESS |
| M3 | Match Results & Caretaker Profile Detail | `/matches` (Top 3 score rings), `/caretaker/:id` (Wave hero, calendar, sticky bar) | M1 | IN_PROGRESS |
| M4 | Booking Flow, My Bookings & Elder Profile | `/book/:id` (summary, pricing, modal), `/bookings` (tabs, review), `/elder-profile` | M1 | IN_PROGRESS |
| M5 | Final E2E Verification & Hardening | Phase 1 (100% E2E tests pass), Phase 2 (Adversarial Coverage Hardening & Forensic Audit) | M1, M2, M3, M4, E2E | PLANNED |

## Interface Contracts

### LanguageContext & i18n Contract
```javascript
// Hook signature
const { language, setLanguage, toggleLanguage, t } = useLanguage();
// language: 'th' | 'en' (default: 'th')
// t(keyPath: string, fallback?: string): string
// Example: t('nav.findCaretaker') -> "ค้นหาผู้ดูแล" or "Find a Caretaker"
```

### AppContext / BookingContext & ElderContext Contract
```javascript
// Hook signature
const {
  elderProfile,
  updateElderProfile,
  searchCriteria,
  updateSearchCriteria,
  caretakers,
  bookings,
  addBooking,
  addReview
} = useApp();

// Caretaker Data Structure
// caretaker: { id, name: { th, en }, photo, matchScore, isBestMatch, tier, hourlyRate, rating, reviewsCount, completedTrips, experienceYears, specialties: [{ th, en }], certifications: [{ th, en }], bio: { th, en }, availableSlots, reviews }

// Booking Data Structure
// booking: { id, caretakerId, caretakerName: { th, en }, caretakerPhoto, elderName: { th, en }, activity: { th, en }, category, destination: { th, en }, date, time, durationHours, totalPrice, status: 'upcoming' | 'completed', pickupLocation: { th, en }, notes: { th, en } }
```

### Component Contracts
- `MatchScoreRing`: Props `{ score: number, size?: number, strokeWidth?: number, showLabel?: boolean, className?: string }`
- `Badge`: Props `{ variant: 'verified' | 'match' | 'specialist' | 'expert' | 'trained' | 'status', children: ReactNode }`
- `Button`: Props `{ variant: 'primary' | 'accent' | 'secondary' | 'outline' | 'ghost', size?: 'sm' | 'md' | 'lg', ...buttonProps }`
- `Modal`: Props `{ isOpen: boolean, onClose: () => void, title?: string, children: ReactNode }`
