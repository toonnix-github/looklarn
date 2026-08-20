# Technical Analysis: Milestone M3 — Match Results Page (MatchResultsPage.jsx)

## Executive Summary
This document provides the exhaustive architectural blueprint and implementation specification for the Match Results page (`/matches`) of Looklarn (ลูกหลาน) — AI-powered elder care companion matching web application.

The Match Results page is the core matching recommendation interface where guardians review the top 3 AI-matched caretakers (Somchai 96%, Nurse Aree 88%, Ploy 81%), inspect matching scores, credentials, hourly rates, and take immediate action to either view in-depth profiles (`/caretaker/:id`) or proceed directly to booking (`/book/:id`).

---

## 1. Architectural & Component Hierarchy

```
MatchResultsPage (src/pages/MatchResultsPage.jsx)
│
├── MatchSummaryHeader (src/components/matches/MatchSummaryHeader.jsx)
│   ├── AI Match Status Badge ("AI Matching Completed")
│   ├── Heading & Subtitle ("ผลการจับคู่ผู้ดูแลที่เหมาะสมที่สุด" / "Your Top Matched Caretakers")
│   ├── Search Summary Pill Container:
│   │   ├── Activity Tag (e.g., Hospital Escort / พาพบแพทย์)
│   │   ├── Date & Time Tag (e.g., 28 ส.ค. 2569 • ช่วงเช้า)
│   │   ├── Duration Tag (e.g., 4 ชั่วโมง / 4 hours)
│   │   ├── Mobility Requirement Tag (e.g., ใช้วีลแชร์ / Wheelchair)
│   │   └── Budget Cap Tag (e.g., ไม่เกิน ฿500/ชม. / Up to ฿500/hr)
│   ├── Refine Search CTA Button (Navigates back to /find)
│   └── Filter & Sort Control Bar:
│       ├── Results Count Indicator ("พบ 3 ผู้ดูแลที่ตรงใจคุณมากที่สุด")
│       └── Sort Selector (Match Score, Customer Rating, Hourly Rate Low-to-High)
│
├── Top 3 Matches Grid (grid grid-cols-1 md:grid-cols-3 gap-6)
│   ├── CaretakerMatchCard [Somchai Prasert - 96% Match] (src/components/matches/CaretakerMatchCard.jsx)
│   │   ├── Card Wrapper (Emerald ring glow, Best Match accentuation)
│   │   ├── Card Header:
│   │   │   ├── MatchScoreRing (score: 96, size: 'md', hex: #10B981, animated SVG)
│   │   │   ├── Best Match Badge ("★ แนะนำสูงสุด 96%" / "★ #1 Best Match (96%)")
│   │   │   └── Availability Status Pill ("พร้อมให้บริการ" with green pulsing dot)
│   │   ├── Caretaker Profile Row (64x64 rounded photo, Name, Tier Title)
│   │   ├── Key Metrics Row:
│   │   │   ├── Star Rating (4.95 ★) & Review Count (58 รีวิว)
│   │   │   ├── Experience (6 ปี) & Completed Escorts (142+ ทริป)
│   │   │   └── Hourly Rate (฿350 / ชม.)
│   │   ├── Specialty Chips (Hospital Escort, Wheelchair Handling, Vital Signs, Medical Notes)
│   │   └── Card Actions Footer:
│   │       ├── "View Profile" Button (Outline -> /caretaker/ct-001)
│   │       └── "Book Now" Button (Accent Emerald -> /book/ct-001)
│   │
│   ├── CaretakerMatchCard [Nurse Areeya Rattanakul - 88% Match]
│   │   ├── MatchScoreRing (score: 88, size: 'md', hex: #0EA5E9, animated SVG)
│   │   ├── Verified / Specialist Badge ("พยาบาลวิชาชีพ" / "Registered Nurse")
│   │   ├── Caretaker Profile Row (Photo, Name, Geriatric Nurse title)
│   │   ├── Key Metrics (4.98 ★, 74 reviews, 8 yrs exp, 198+ trips, ฿450/hr)
│   │   ├── Specialty Chips (Dementia Care, Tube Care, ACLS, Post-Op Care)
│   │   └── Actions ("View Profile" -> /caretaker/ct-002, "Book Now" -> /book/ct-002)
│   │
│   └── CaretakerMatchCard [Ploy Chidchanok - 81% Match]
│       ├── MatchScoreRing (score: 81, size: 'md', hex: #0EA5E9, animated SVG)
│       ├── Verified / Trained Badge ("นักกายภาพบำบัดฝึกหัด" / "PT Assistant")
│       ├── Caretaker Profile Row (Photo, Name, Companion title)
│       ├── Key Metrics (4.86 ★, 42 reviews, 3 yrs exp, 89+ trips, ฿320/hr)
│       ├── Specialty Chips (Gentle Mobility Walk, Gait Training, Mall Escort, Cheerful Chat)
│       └── Actions ("View Profile" -> /caretaker/ct-003, "Book Now" -> /book/ct-003)
│
└── Trust & Safety Guarantee Banner
    ├── 100% Criminal Background Checked (Royal Thai Police)
    ├── CPR & First Aid Certified (Red Cross / MOPH)
    └── Comprehensive Trip Accident Coverage
```

---

## 2. Component Specifications & Prop Contracts

### Component 1: `MatchSummaryHeader.jsx`
- **Location**: `src/components/matches/MatchSummaryHeader.jsx`
- **Props**:
  - `searchCriteria` (Object): Active search state from `useApp()` (`activityType`, `date`, `durationHours`, `mobility`, `budgetMax`, `pickupAddress`, `destination`).
  - `totalMatches` (Number): Count of matching candidates (default 3).
  - `sortBy` (String): Current sort criterion (`'matchScore'` | `'rating'` | `'price_asc'`).
  - `onSortChange` (Function): Callback when sort dropdown changes.
  - `onRefineClick` (Function, optional): Custom callback or default link to `/find`.
- **Key Behaviors**:
  - Dynamically formats localized date, activity names, and mobility levels.
  - Renders compact badges for quick visual confirmation of criteria.
  - Houses the sort selector with accessible labels.

### Component 2: `CaretakerMatchCard.jsx`
- **Location**: `src/components/matches/CaretakerMatchCard.jsx`
- **Props**:
  - `caretaker` (Object): Complete caretaker model object from `caretakers.json`.
  - `isTopMatch` (Boolean): Flag indicating whether this is the #1 ranked candidate (`matchScore: 96`).
  - `rank` (Number): 1-based index for ranking representation.
- **Key Behaviors**:
  - Integrates `<MatchScoreRing score={caretaker.matchScore} size="md" showSublabel sublabel={t('matches.matchScoreLabel')} />`.
  - Conditional rendering of Emerald "Best Match" Badge for top caretaker vs "Background Verified" / "Specialist" badge for others.
  - Displays localized text using `getLocalized(caretaker, field)` and `formatCurrency(caretaker.hourlyRate, language, { showUnit: true })`.
  - Action buttons linked via `<Link to={`/caretaker/${caretaker.id}`}>` and `<Link to={`/book/${caretaker.id}`}>`.

### Component 3: `MatchScoreRing.jsx` (Reused UI Kit Component)
- **Location**: `src/components/ui/MatchScoreRing.jsx`
- **Props**:
  - `score` (Number, 0-100): Caretaker compatibility percentage.
  - `size` (String | Number): `'sm'` (52px), `'md'` (76px), `'lg'` (96px), `'xl'` (124px). Default `'md'`.
  - `strokeWidth` (Number, optional): Defaults to 6px for `'md'`.
  - `showLabel` (Boolean): Defaults to `true` (renders e.g. "96%").
  - `showSublabel` (Boolean): Defaults to `false` (or `true` with sublabel "Match").
  - `sublabel` (String): Subtitle under the percentage.
- **SVG Mechanics**:
  - Computes `radius = (px - stroke) / 2` and `circumference = 2 * Math.PI * radius`.
  - `strokeDashoffset = circumference - (score / 100) * circumference`.
  - Color gradient: `#10B981` (>=90%), `#0EA5E9` (>=80%), `#F59E0B` (>=70%), `#94A3B8` (<70%).
  - Animation: `transition-all duration-1000 ease-out`.

---

## 3. Mock Data Contract & Top 3 Caretaker Details

From `src/data/caretakers.json`:

| ID | Name (TH / EN) | Score | Best Match | Tier | Hourly Rate | Rating (Reviews) | Trips | Key Specialties |
|---|---|---|---|---|---|---|---|---|
| `ct-001` | สมชาย ประเสริฐ / Somchai Prasert | 96% | `true` | Specialist | ฿350 / hr | 4.95 (58) | 142+ | Hospital Escort & OPD, Wheelchair support, Vital signs, Medical notes |
| `ct-002` | พว. อารียา รัตนกุล (อารี) / Nurse Areeya Rattanakul | 88% | `false` | Specialist (RN) | ฿450 / hr | 4.98 (74) | 198+ | Geriatric Nurse, Dementia & Alzheimer's, Tube Care, ACLS First Aid |
| `ct-003` | พลอย ชิดชนก วงศ์สวัสดิ์ / Ploy Chidchanok | 81% | `false` | Trained | ฿320 / hr | 4.86 (42) | 89+ | Park Walks & PT, Gait Training, Mall Leisure, Cheerful Companionship |

---

## 4. Bilingual Translation Dictionaries (TH / EN)

To satisfy **Requirement R3** and pass all automated tests:

### Thai (`src/i18n/th.js`)
```javascript
matches: {
  badge: "AI Matching Completed",
  title: "ผลการจับคู่ผู้ดูแลที่เหมาะสมที่สุด",
  subtitle: "ระบบ Looklarn AI คัดเลือก 3 ผู้ดูแลที่มีคะแนนความเข้ากันได้สูงสุดตามความต้องการของคุณ",
  summaryPill: "ผลลัพธ์สำหรับ: {activity} • วันที่ {date} • งบประมาณไม่เกิน ฿{budget}/ชม.",
  criteriaTitle: "เงื่อนไขการค้นหาของคุณ",
  activity: "กิจกรรม: {activity}",
  date: "วันที่: {date}",
  duration: "ระยะเวลา: {duration}",
  mobility: "การเคลื่อนไหว: {mobility}",
  budget: "งบประมาณ: ฿{budget}/ชม.",
  refineBtn: "ปรับแต่งเงื่อนไขการค้นหา",
  resultsFound: "พบผู้ดูแลที่ตรงเงื่อนไข {count} ท่าน",
  sortByLabel: "เรียงตาม:",
  sortMatchScore: "คะแนนความเข้ากันได้ (สูงสุด)",
  sortPriceLow: "ราคา (ต่ำไปสูง)",
  sortPriceHigh: "ราคา (สูงไปต่ำ)",
  sortRating: "คะแนนรีวิว (สูงสุด)",
  sortTrips: "จำนวนครั้งที่ดูแล (มากที่สุด)",
  bestMatchBadge: "★ แนะนำสูงสุด 96%",
  bestMatch: "แนะนำสูงสุด",
  matchScoreLabel: "ความเข้ากันได้",
  verifiedBadge: "ผ่านการตรวจสอบประวัติ",
  availableStatus: "พร้อมให้บริการ",
  hourlyRateText: "฿{rate} / ชม.",
  viewProfileBtn: "ดูโปรไฟล์",
  viewProfile: "ดูโปรไฟล์",
  bookNowBtn: "จองทันที",
  bookNow: "จองทันที",
  specialtyTagsTitle: "ความเชี่ยวชาญ:",
  experienceText: "ประสบการณ์ {years} ปี",
  completedTripsText: "ดูแลสำเร็จ {count}+ ครั้ง",
  reviewsCountText: "({count} รีวิว)",
  trustBanner: {
    title: "มั่นใจทุกการดูแลด้วยมาตรฐาน Looklarn",
    item1: "ตรวจสอบประวัติอาชญากรรม 100%",
    item2: "ผ่านการฝึกอบรม CPR & ปฐมพยาบาล",
    item3: "ประกันอุบัติเหตุคุ้มครองตลอดทริป"
  }
}
```

### English (`src/i18n/en.js`)
```javascript
matches: {
  badge: "AI Matching Completed",
  title: "Your Top Matched Caretakers",
  subtitle: "Looklarn AI has evaluated and ranked the 3 most compatible companions based on your preferences.",
  summaryPill: "Results for: {activity} • {date} • Budget up to ฿{budget}/hr",
  criteriaTitle: "Your Search Criteria",
  activity: "Activity: {activity}",
  date: "Date: {date}",
  duration: "Duration: {duration}",
  mobility: "Mobility: {mobility}",
  budget: "Budget: ฿{budget}/hr",
  refineBtn: "Refine Criteria",
  resultsFound: "{count} Matched Caretakers Found",
  sortByLabel: "Sort by:",
  sortMatchScore: "Match Score (Highest)",
  sortPriceLow: "Price (Low to High)",
  sortPriceHigh: "Price (High to Low)",
  sortRating: "Customer Rating (Highest)",
  sortTrips: "Completed Trips (Most)",
  bestMatchBadge: "★ #1 Best Match (96%)",
  bestMatch: "#1 Best Match",
  matchScoreLabel: "AI Match Score",
  verifiedBadge: "Background Verified",
  availableStatus: "Available Now",
  hourlyRateText: "฿{rate} / hr",
  viewProfileBtn: "View Profile",
  viewProfile: "View Profile",
  bookNowBtn: "Book Now",
  bookNow: "Book Now",
  specialtyTagsTitle: "Key Specialties:",
  experienceText: "{years} yrs experience",
  completedTripsText: "{count}+ trips completed",
  reviewsCountText: "({count} reviews)",
  trustBanner: {
    title: "Cared for with Looklarn Peace of Mind",
    item1: "100% Criminal Background Checked",
    item2: "CPR & First Aid Certified",
    item3: "Trip Accident Insurance Covered"
  }
}
```

---

## 5. Potential Pitfalls & Safeguards

1. **Test Selector Regex Alignment**:
   - Automated tests in `src/tests/e2e_tier1_features.test.jsx` test case 4.2 specifically match `/แนะนำสูงสุด|แมตช์อันดับ 1|Best Match|Top Match/i`.
   - Test case 4.4 matches `/ดูโปรไฟล์|View Profile/i`.
   - Test case 4.5 matches `/จองทันที|จองเลย|Book Now|Book/i`.
   - Ensure `th.js` and `en.js` match button labels ("ดูโปรไฟล์", "View Profile", "จองทันที", "Book Now", "★ แนะนำสูงสุด 96%").

2. **Single-Language Rendering**:
   - Never combine languages into labels like `ดูโปรไฟล์ (View Profile)`.
   - Use `useLanguage().getLocalized(item, field)` for bilingual data objects.

3. **Responsive Grid Layout**:
   - Mobile: 1 single column stack (`grid-cols-1`).
   - Desktop: 3 card column grid (`md:grid-cols-3`).
   - Minimum tap targets: At least 44px height on buttons and links for touch devices.
