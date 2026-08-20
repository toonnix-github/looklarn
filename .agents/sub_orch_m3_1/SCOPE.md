# Scope: Milestone M3 - Match Results & Caretaker Profile Detail

## Architecture & Responsibilities
- **Pages**:
  - `src/pages/MatchResultsPage.jsx`: Displays top caretaker matches with AI match score, search summary pill, filtering/sorting, action buttons.
  - `src/pages/CaretakerProfilePage.jsx`: Comprehensive profile detail view with ocean wave hero, badges, bilingual bio, interactive availability calendar, reviews, and sticky booking bar.
- **Components**:
  - `src/components/matches/MatchSummaryHeader.jsx`: Search summary pill, criteria overview, refine search trigger.
  - `src/components/matches/CaretakerMatchCard.jsx`: Caretaker card showcasing Somchai (96%), Nurse Aree (88%), Ploy (81%), with tags, rate, ratings.
  - `src/components/matches/MatchScoreRing.jsx`: Circular SVG AI Match Score Ring (96%, 88%, 81%) with color-coded gradients.
  - `src/components/caretaker/CaretakerWaveHero.jsx`: Ocean blue gradient banner with curved SVG wave aesthetic, verified badge, tier badge.
  - `src/components/caretaker/TrustBadges.jsx`: Criminal background check, CPR/First Aid, Looklarn Academy certified, ID verified.
  - `src/components/caretaker/CaretakerBio.jsx`: Bilingual biography, years experience, trip counts, language tags, specialty chips.
  - `src/components/caretaker/AvailabilityCalendar.jsx`: Interactive calendar showing available (green) vs booked dates.
  - `src/components/caretaker/CaretakerReviews.jsx`: Star rating summary, review cards with guardian quotes.
  - `src/components/caretaker/StickyBookingBar.jsx`: Fixed bottom bar with avatar, hourly rate, and large "Book This Caretaker" button navigating to `/book/:id`.
- **Exclusively Owned Files**:
  - `src/pages/MatchResultsPage.jsx`
  - `src/pages/CaretakerProfilePage.jsx`
  - `src/components/matches/*`
  - `src/components/caretaker/*`

## Milestones / Sub-tasks
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M3.1 | Codebase & Contract Survey | Explore existing mock data, router config, shared UI components, i18n setup | None | IN_PROGRESS |
| M3.2 | Match Results Page & Components | Implement MatchResultsPage, MatchSummaryHeader, CaretakerMatchCard, MatchScoreRing | M3.1 | PLANNED |
| M3.3 | Caretaker Profile Page & Components | Implement CaretakerProfilePage, CaretakerWaveHero, TrustBadges, CaretakerBio, AvailabilityCalendar, CaretakerReviews, StickyBookingBar | M3.1 | PLANNED |
| M3.4 | Unit & Integration Verification | Vitest tests for components and pages, build verification (`npm run build`) | M3.2, M3.3 | PLANNED |
| M3.5 | Review, Challenge & Forensic Audit | Reviewer approvals, Challenger test pass, Auditor integrity pass | M3.4 | PLANNED |

## Interface Contracts
- **Routes**:
  - `/matches` or `/match-results` -> `MatchResultsPage`
  - `/caretaker/:id` -> `CaretakerProfilePage`
  - Navigation target: `/book/:id`
- **Data Model**:
  - Caretakers: `{ id, name: { th, en }, matchScore: 96, avatar, role: { th, en }, verified: true, tier: 'Diamond'|'Gold', backgroundChecked: true, cprCertified: true, academyCertified: true, idVerified: true, rating: 4.9, reviewCount: 48, completedTrips: 124, hourlyRate: 350, experienceYears: 8, languages: ['th', 'en'], specialties: [...], bio: { th, en }, availability: [...], reviews: [...] }`
- **i18n**: Support `th` and `en` seamlessly without mixed labels.
