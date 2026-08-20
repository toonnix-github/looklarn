# Scope: M2 - Home Page & Find Caretaker 3-Step Wizard

## Architecture & Integration
- Target Application: Looklarn (ลูกหลาน) Senior Outing Companion Web App (React 18+, Vite, Tailwind CSS, Lucide React, i18next).
- Interacting Modules:
  - Routing (`/` for HomePage, `/find` for FindCaretakerPage, `/matches` for post-matching redirect).
  - State & Data: `src/context/` (LanguageContext / i18n, ElderContext / active elder profile if present, BookingContext / Matching state).
  - Mock Data / Services: `src/data/` or `src/services/` for activities, partner hospitals, testimonials, mock elders.

## Feature Inventory for M2
| # | Feature | Description | File(s) | Status |
|---|---------|-------------|---------|--------|
| 1 | HeroBanner | Gradient background, headline, trust indicators (100% verified, 4.9 rating, 1200+ families), CTA button -> /find | `src/components/home/HeroBanner.jsx`, `src/pages/HomePage.jsx` | PLANNED |
| 2 | ActivityGrid | 4 interactive category cards (Hospital Escort, Temple & Merit, City & Shopping, Social Events) with icons, descriptions, click-through to /find with category pre-selected | `src/components/home/ActivityGrid.jsx`, `src/pages/HomePage.jsx` | PLANNED |
| 3 | PromoBanner | Partner hospital discount strip (15% off hospital escort + insurance badge) | `src/components/home/PromoBanner.jsx`, `src/pages/HomePage.jsx` | PLANNED |
| 4 | HowItWorks | 3-step illustrated section showing booking flow | `src/components/home/HowItWorks.jsx`, `src/pages/HomePage.jsx` | PLANNED |
| 5 | Testimonials | Guardian testimonials with star ratings, quotes, user avatars | `src/components/home/Testimonials.jsx`, `src/pages/HomePage.jsx` | PLANNED |
| 6 | StepIndicator | 3-step visual progress bar (Step 1 Physical 33%, Step 2 Preferences 66%, Step 3 Schedule & Budget 100%) | `src/components/find/StepIndicator.jsx`, `src/pages/FindCaretakerPage.jsx` | PLANNED |
| 7 | Step1Physical | Mobility selector (Independent, Cane, Wheelchair, Support), chronic condition chips (Hypertension, Diabetes, Heart, Dementia, None), medication assistance toggle, assistance tasks. Auto-fill from active elder profile. | `src/components/find/Step1Physical.jsx`, `src/pages/FindCaretakerPage.jsx` | PLANNED |
| 8 | Step2Preferences | Language/dialect selector, religion, diet, companion traits, outing activity type (preset from ActivityGrid or selectable). | `src/components/find/Step2Preferences.jsx`, `src/pages/FindCaretakerPage.jsx` | PLANNED |
| 9 | Step3Schedule | Date picker, time slot chips, duration selector (2h, 4h, 8h), budget slider (฿300 - ฿1000/hr), special notes. | `src/components/find/Step3Schedule.jsx`, `src/pages/FindCaretakerPage.jsx` | PLANNED |
| 10 | AiMatchingLoader | 2.0s simulated AI matching animation with rotating status quotes, then auto-routing to `/matches`. | `src/components/find/AiMatchingLoader.jsx`, `src/pages/FindCaretakerPage.jsx` | PLANNED |
| 11 | i18n Bilingual | 100% Thai and English translation keys in translation dictionaries without mixed or unlocalized strings. | `src/locales/` or `src/i18n/` | PLANNED |

## Exclusive Write Ownership
- `src/pages/HomePage.jsx`
- `src/pages/FindCaretakerPage.jsx`
- `src/components/home/*`
- `src/components/find/*`
- Associated locale/i18n files if needed for M2 keys, unit tests under `src/__tests__/m2_*` or `src/components/home/__tests__/*`
