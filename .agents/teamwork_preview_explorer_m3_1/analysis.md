# Architectural Analysis: Milestone M3 — Match Results & Caretaker Profile Detail

**Author**: Explorer 1 (Milestone M3)  
**Date**: 2026-08-20  
**Target Milestone**: M3 (Match Results & Caretaker Profile Detail)  
**Scope**: `src/pages/MatchResultsPage.jsx`, `src/pages/CaretakerProfilePage.jsx`, `src/components/matches/*`, `src/components/caretaker/*`

---

## 1. Executive Summary

Milestone M3 is responsible for the core discovery and evaluation journey in Looklarn:
1. **Match Results (`/matches`)**: Presenting the top 3 AI-matched caretakers (Somchai 96%, Nurse Aree 88%, Ploy 81%) with circular match score rings, search summary header, specialty tags, verification badges, and direct CTAs to view profile or book.
2. **Caretaker Profile Detail (`/caretaker/:id`)**: An immersive, trust-building profile featuring an ocean gradient wave header, verified credential badges (police background check, nurse/caregiver certification, CPR/First Aid), bilingual biography, interactive availability calendar, real guardian reviews, and a sticky viewport-bottom booking bar.

This document details the existing architecture, data schemas, i18n integration, UI library contracts, and a complete implementation blueprint for Worker.

---

## 2. Codebase Baseline & Dependencies

### 2.1 Dependencies (`package.json`)
- **Framework**: `react@^18.3.1`, `react-dom@^18.3.1`
- **Routing**: `react-router-dom@^6.28.0`
- **Styling**: `tailwindcss@^3.4.15`, `postcss@^8.4.49`, `autoprefixer@^10.4.20`
- **Class Utilities**: `clsx@^2.1.1`, `tailwind-merge@^2.5.4` (`src/utils/cn.js`)
- **Icons**: `lucide-react@^0.460.0`
  - Available icons: `Star`, `ShieldCheck`, `CheckCircle2`, `Award`, `Calendar`, `Clock`, `MapPin`, `ArrowLeft`, `ArrowRight`, `Sparkles`, `Car`, `Languages`, `Phone`, `HeartHandshake`, `UserCheck`, `GraduationCap`, `Filter`, `SlidersHorizontal`, `Share2`, `Bookmark`
- **Testing**: `vitest@^2.1.5`, `@testing-library/react@^16.0.1`, `@testing-library/user-event@^14.5.2`, `jsdom@^25.0.1`

### 2.2 Design System & Tokens (`tailwind.config.js`)
- **Primary / Ocean Blue**: `#0EA5E9` (Shades `primary-50` `#F0F9FF` to `primary-900` `#0C4A6E`)
- **Accent / Emerald Green**: `#10B981` (Shades `emerald-50` `#ECFDF5` to `emerald-900` `#064E3B`)
- **Ice Blue Background**: `#F0F9FF` (`ice-100` `#F0F9FF`, `ice-50` `#F8FAFC`)
- **Dark Navy**: `#0F172A` (`navy-900` `#0F172A`)
- **Typography**: Google Fonts `Sarabun` (Thai & Latin support)
- **Border Radii**: `rounded-xl` (12px), `rounded-2xl` (16px), `rounded-3xl` (24px)
- **Shadows**: `shadow-soft-sm`, `shadow-soft`, `shadow-soft-lg`, `shadow-emerald-soft`, `shadow-sky-soft`

---

## 3. Architecture & State Management

### 3.1 Routing Structure (`src/App.jsx`)
Existing routes registered:
- `/` -> `HomePage`
- `/find` -> `FindCaretakerPage`
- `/matches` & `/results` -> `MatchResultsPage`
- `/caretaker/:id` -> `CaretakerProfilePage`
- `/book/:id` -> `BookingPage`
- `/bookings` -> `MyBookingsPage`
- `/elder` & `/elder-profile` -> `ElderProfilePage`

### 3.2 State Management (`AppContext.jsx`)
The application uses React Context:
```javascript
import { useApp } from '../context/AppContext';

const {
  elderProfile,          // Active elder profile object
  searchCriteria,        // Active search criteria from find wizard
  updateSearchCriteria,  // Method to update criteria
  caretakers,            // Array of all 5 caretaker objects from caretakers.json
  getCaretakerById,      // Function(id: string) => Caretaker object (supports 'ct-001' and 'ct-1' numeric fallback)
  bookings,              // Array of bookings
  addBooking,            // Method to create a booking
} = useApp();
```

### 3.3 Localization & i18n (`LanguageContext.jsx` & `src/i18n/`)
- Context Hook:
```javascript
import { useLanguage } from '../context/LanguageContext';

const { language, setLanguage, toggleLanguage, t, getLocalized } = useLanguage();
// language: 'th' | 'en' (default: 'th')
// t('matches.title') => string
// getLocalized(caretaker, 'name') => string (returns caretaker.name[language] || caretaker.name.th)
// getLocalized({ th: '...', en: '...' }) => string
```
- **Translation Keys Available in `th.js` & `en.js`**:
  - `matches.*`: `badge`, `title`, `subtitle`, `summaryPill`, `refineBtn`, `sortByLabel`, `sortMatchScore`, `sortPriceLow`, `sortRating`, `bestMatchBadge`, `bestMatch`, `matchScoreLabel`, `verifiedBadge`, `hourlyRateText`, `viewProfileBtn`, `viewProfile`, `bookNowBtn`, `bookNow`, `whyMatchTitle`, `specialtyTagsTitle`, `experienceText`, `completedTripsText`
  - `caretaker.*`: `profileTitle`, `verified`, `bookThisCaretaker`, `matchScoreBadge`, `verifiedTitle`, `badgeBackground`, `badgeNurse`, `badgeCaregiver`, `badgeCpr`, `badgeDriver`, `stats.*` (`experienceLabel`, `tripsLabel`, `ratingLabel`, `responseLabel`), `bioTitle`, `specialtiesTitle`, `educationTitle`, `vehicleTitle`, `serviceAreasTitle`, `availabilityTitle`, `reviewsTitle`, `stickyBar.*` (`rateLabel`, `unit`, `bookBtn`)

---

## 4. Data Layer: Caretaker Schema (`src/data/caretakers.json`)

The dataset contains 5 rich caretaker profiles:

| ID | Name (TH / EN) | Score | Best Match | Rate | Rating | Reviews | Trips | Exp | Specialization |
|---|---|---|---|---|---|---|---|---|---|
| `ct-001` | สมชาย ประเสริฐ / Somchai Prasert | 96% | true | ฿350/hr | 4.95 | 58 | 142 | 6 yrs | Hospital Escort & Wheelchair |
| `ct-002` | พว. อารียา รัตนกุล / Nurse Areeya | 88% | false | ฿450/hr | 4.98 | 74 | 198 | 8 yrs | Geriatric Nurse & Dementia |
| `ct-003` | พลอย ชิดชนก / Ploy Chidchanok | 81% | false | ฿320/hr | 4.86 | 42 | 89 | 3 yrs | PT Assistant & Park Walks |
| `ct-004` | นิภาพร สุขสันต์ / Nipaporn Suksan | 76% | false | ฿380/hr | 4.88 | 36 | 78 | 4 yrs | Temple Merit & Cultural Escort |
| `ct-005` | อารักษ์ บุญมี / Arak Boonmee | 72% | false | ฿300/hr | 4.82 | 51 | 165 | 7 yrs | VIP Van & Mobility Transport |

### Caretaker Object Structure:
```json
{
  "id": "ct-001",
  "name": { "th": "สมชาย ประเสริฐ", "en": "Somchai Prasert" },
  "nickname": { "th": "สมชาย", "en": "Somchai" },
  "gender": "male",
  "age": 34,
  "photo": "https://images.unsplash.com/...",
  "matchScore": 96,
  "isBestMatch": true,
  "tier": "specialist",
  "tierName": { "th": "ผู้เชี่ยวชาญพาพบแพทย์และประสานงาน รพ.", "en": "Hospital Medical Escort Specialist" },
  "hourlyRate": 350,
  "rating": 4.95,
  "reviewsCount": 58,
  "completedTrips": 142,
  "experienceYears": 6,
  "verifiedBadges": [
    "criminal_record_checked",
    "certified_caregiver",
    "cpr_first_aid",
    "hospital_escort_trained"
  ],
  "specialties": [
    { "th": "พาพบแพทย์ & ประสานงานโรงพยาบาล", "en": "Hospital Escort & OPD Coordination" },
    { "th": "ช่วยเหลือผู้ใช้วีลแชร์และพยุงเดิน", "en": "Wheelchair Handling & Mobility Support" }
  ],
  "languages": [
    { "th": "ภาษาไทย (กลาง)", "en": "Central Thai" },
    { "th": "ภาษาอังกฤษ (สื่อสารได้)", "en": "English (Conversational)" }
  ],
  "education": {
    "th": "ประกาศนียบัตรผู้ช่วยพยาบาล (PN) วิทยาลัยพยาบาลสภากาชาดไทย",
    "en": "Practical Nursing Certificate (PN), Red Cross Nursing College"
  },
  "vehicle": {
    "type": "sedan",
    "th": "รถเก๋งส่วนบุคคล สะอาด นุ่มนวล มีพื้นที่เก็บวีลแชร์ท้ายรถ",
    "en": "Clean private sedan with trunk capacity for foldable wheelchair"
  },
  "serviceAreas": [
    { "th": "ปทุมวัน, สุขุมวิท, บางรัก, สาทร, พญาไท", "en": "Pathum Wan, Sukhumvit, Bang Rak, Sathorn, Phaya Thai" }
  ],
  "bio": {
    "th": "อดีตผู้ช่วยพยาบาลวิชาชีพ ประสบการณ์ดูแลผู้สูงอายุ...",
    "en": "Former practical nurse with 6+ years of experience..."
  },
  "availableSlots": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  "reviews": [
    {
      "id": "rev-101",
      "reviewerName": "ธนกร ใจดี",
      "relationship": { "th": "บุตรชาย", "en": "Son" },
      "rating": 5.0,
      "date": "2026-08-14",
      "comment": {
        "th": "คุณสมชายดูแลคุณแม่ดีมากครับ...",
        "en": "Somchai was exceptional with mom..."
      }
    }
  ]
}
```

---

## 5. Shared UI Kit Components

1. **`MatchScoreRing` (`src/components/ui/MatchScoreRing.jsx`)**:
   - Props: `{ score: number, size?: 'sm'|'md'|'lg'|'xl'|number, strokeWidth?: number, showLabel?: boolean, showSublabel?: boolean, sublabel?: string, className?: string }`
   - Automatically computes gradient/hex color:
     - `>= 90%`: Emerald Green `#10B981`
     - `>= 80%`: Ocean Blue `#0EA5E9`
     - `>= 70%`: Amber `#F59E0B`
     - `< 70%`: Slate `#94A3B8`
   - Smooth animated SVG stroke dashoffset transition.

2. **`Badge` (`src/components/ui/Badge.jsx`)**:
   - Variants: `primary`, `accent`, `verified`, `match`, `specialist`, `expert`, `trained`, `neutral`, `outline`.
   - `variant="match"` produces a subtle gradient with sparkle icon.
   - `variant="verified"` produces an emerald badge with check icon.

3. **`Button` (`src/components/ui/Button.jsx`)**:
   - Variants: `primary` (Ocean Blue), `accent` (Emerald Green CTA), `secondary`, `outline`, `ghost`, `danger`.
   - Sizes: `sm`, `md`, `lg`. Supports `leftIcon`, `rightIcon`, `isLoading`.

4. **`Card` (`src/components/ui/Card.jsx`)**:
   - `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.
   - Supports `hoverEffect` for interactive cards.

---

## 6. Technical Blueprint & Component Specifications for Worker

### 6.1 Component Hierarchy for M3

```
src/
├── pages/
│   ├── MatchResultsPage.jsx             # Top level view for /matches
│   └── CaretakerProfilePage.jsx         # Top level view for /caretaker/:id
├── components/
│   ├── matches/
│   │   ├── MatchSummaryHeader.jsx       # Search criteria pill + sort/filter bar + refine button
│   │   └── CaretakerMatchCard.jsx       # Individual caretaker match card with score ring, badges & CTAs
│   └── caretaker/
│       ├── CaretakerWaveHero.jsx        # Ocean-to-Emerald wave header with avatar, score ring & stats
│       ├── TrustBadges.jsx              # Police check, nurse/caregiver cert, CPR/First Aid badges
│       ├── CaretakerBio.jsx             # Bio, specialties chips, education, vehicle & service areas
│       ├── AvailabilityCalendar.jsx     # Interactive week calendar with available time slots
│       ├── CaretakerReviews.jsx         # Star rating breakdown + family testimonial cards
│       └── StickyBookingBar.jsx         # Fixed bottom viewport bar with rate & direct Book CTA
```

---

### 6.2 Detailed Component Specifications

#### A. `MatchSummaryHeader.jsx` (`src/components/matches/MatchSummaryHeader.jsx`)
- **Props**:
  - `criteria`: Search criteria object (from `useApp().searchCriteria`)
  - `sortBy`: String (`'match'` | `'price_asc'` | `'rating'`)
  - `onSortChange`: Function `(sortKey: string) => void`
  - `totalCount`: Number (defaults to 3 or caretakers.length)
- **Features**:
  - Top badge: `AI Matching Completed` with sparkle icon.
  - Page heading: `t('matches.title')` and subtitle `t('matches.subtitle')`.
  - Criteria Pill: displays selected activity, date, and budget limit.
  - Refine Button: Link to `/find` with `Button variant="outline" size="sm"`.
  - Sort dropdown / buttons: Sort by Match Score (Highest), Price (Low to High), Rating (Highest).

#### B. `CaretakerMatchCard.jsx` (`src/components/matches/CaretakerMatchCard.jsx`)
- **Props**:
  - `caretaker`: Caretaker object
  - `isTopMatch`: Boolean (true for index 0 / 96%)
  - `rank`: Number (1, 2, 3)
- **Visual Design**:
  - Highlighted border & subtle glow for `isTopMatch` (Best Match 96%).
  - Top row: `MatchScoreRing` (`size="md"` or `size="lg"`), Top Match / Verified Badge.
  - Profile snippet: Avatar (16x16 rounded-2xl), Name (`getLocalized(caretaker, 'name')`), Nickname, Tier subtitle.
  - Key Metrics: Star rating (with reviews count), Hourly rate (`฿350 / ชม.`), Experience years, Completed trips.
  - Specialty Badges: 2-3 specialty tags with localized text.
  - Why Match reason callout: Highlights why Looklarn AI picked this caretaker (e.g. wheelchair assistance or hospital OPD specialist).
  - Action Row:
    - `Link to="/caretaker/:id"`: `<Button variant="outline" size="sm" className="w-full">` (`t('matches.viewProfile')`)
    - `Link to="/book/:id"`: `<Button variant="accent" size="sm" className="w-full">` (`t('matches.bookNow')`)

#### C. `CaretakerWaveHero.jsx` (`src/components/caretaker/CaretakerWaveHero.jsx`)
- **Props**:
  - `caretaker`: Caretaker object
- **Visual Design**:
  - Deep gradient background: `bg-gradient-to-br from-sky-600 via-sky-500 to-emerald-500` with subtle SVG wave pattern.
  - Back navigation button: `<Link to="/matches">` with `<ArrowLeft className="w-4 h-4" />`.
  - Left column:
    - Large avatar image with white border and soft shadow (`w-28 h-28 rounded-2xl`).
    - Name heading (`text-3xl font-extrabold text-white`).
    - Verified badge + Tier badge pill (`bg-white/20 text-white backdrop-blur-xs`).
    - Quick metrics row: Rating (★ 4.95), Experience (`6 ปี`), Completed Trips (`142+ ดูแลสำเร็จ`), Response Rate (`100%`).
  - Right column:
    - Glassmorphic card (`bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/25 text-white`) containing `MatchScoreRing` (`size="lg"`, text in white).

#### D. `TrustBadges.jsx` (`src/components/caretaker/TrustBadges.jsx`)
- **Props**:
  - `badges`: Array of badge identifiers or `caretaker` object
- **Cards (4-column grid on desktop, 2-column on mobile)**:
  1. Criminal Record Check (Royal Thai Police) — `ShieldCheck` in emerald.
  2. Certified Caregiver / Nurse Licensure (Ministry of Public Health) — `Award` in sky blue.
  3. CPR & Basic Life Support (Thai Red Cross) — `CheckCircle2` in emerald.
  4. 100% Response Rate & Looklarn Safety Protocol — `Clock` / `UserCheck` in sky blue.

#### E. `CaretakerBio.jsx` (`src/components/caretaker/CaretakerBio.jsx`)
- **Props**:
  - `caretaker`: Caretaker object
- **Sections**:
  1. Bio description (`getLocalized(caretaker, 'bio')`).
  2. Specialties grid with checkmark icons.
  3. Education & Credentials (`getLocalized(caretaker, 'education')`).
  4. Vehicle & Mobility Equipment (`getLocalized(caretaker, 'vehicle')`).
  5. Service Coverage Areas (`getLocalized(caretaker, 'serviceAreas')`).
  6. Languages spoken with pill badges.

#### F. `AvailabilityCalendar.jsx` (`src/components/caretaker/AvailabilityCalendar.jsx`)
- **Props**:
  - `availableSlots`: Array of days / slots (e.g. `["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]`)
  - `onSelectDate`: Optional handler
- **Features**:
  - Weekly interactive schedule view (Monday to Sunday).
  - Available days highlighted in emerald green with "ว่าง (Available)" indicator.
  - Available service hours (e.g. 08:00 - 18:00 น.).
  - Time slots pill selector (Morning, Afternoon, Full Day).

#### G. `CaretakerReviews.jsx` (`src/components/caretaker/CaretakerReviews.jsx`)
- **Props**:
  - `reviews`: Array of review objects
  - `rating`: Average rating (e.g. 4.95)
  - `reviewsCount`: Total count (e.g. 58)
- **Features**:
  - Rating summary banner (Big 4.95 score, 5 golden stars, percentage of 5-star reviews).
  - Testimonial cards: Reviewer name, relationship tag (`บุตรชาย`, `บุตรสาว`), date formatted with Thai/Eng formatter, 5 filled stars, and quoted testimonial.

#### H. `StickyBookingBar.jsx` (`src/components/caretaker/StickyBookingBar.jsx`)
- **Props**:
  - `caretaker`: Caretaker object
- **Visual Design**:
  - Fixed to bottom viewport (`fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-sky-100 shadow-lg px-4 py-3 sm:py-4`).
  - Left: Thumbnail avatar + Caretaker name + Hourly rate (`฿350 / ชม.` in large emerald bold text).
  - Right: CTA Button: `<Link to={"/book/" + caretaker.id}>` with `<Button variant="accent" size="lg">` `t('caretaker.bookThisCaretaker')`.

---

## 7. Implementation File Checklist for Worker

1. `src/components/matches/MatchSummaryHeader.jsx` (New)
2. `src/components/matches/CaretakerMatchCard.jsx` (New)
3. `src/components/caretaker/CaretakerWaveHero.jsx` (New)
4. `src/components/caretaker/TrustBadges.jsx` (New)
5. `src/components/caretaker/CaretakerBio.jsx` (New)
6. `src/components/caretaker/AvailabilityCalendar.jsx` (New)
7. `src/components/caretaker/CaretakerReviews.jsx` (New)
8. `src/components/caretaker/StickyBookingBar.jsx` (New)
9. `src/pages/MatchResultsPage.jsx` (Refactor to compose new components cleanly)
10. `src/pages/CaretakerProfilePage.jsx` (Refactor to compose new components cleanly)

---

## 8. Verification Strategy

1. **Unit & Component Verification**:
   - Verify `MatchResultsPage` renders top 3 matches (Somchai 96%, Nurse Aree 88%, Ploy 81%).
   - Verify circular score rings render with SVG progressbar role.
   - Verify Best Match badge appears on top card.
   - Verify links navigate to `/caretaker/:id` and `/book/:id`.
   - Verify `CaretakerProfilePage` renders wave header, badges, bio, availability calendar, reviews, and sticky booking bar.
   - Verify language toggle (`TH | EN`) switches all text cleanly without mixed labels.
2. **Build Verification**:
   - Execute `npm run build` to ensure zero compilation or JSX syntax errors.
   - Run vitest on Tier 1 and Challenger test suites.
