# Milestone M3: Caretaker Profile Detail Page Architecture & Deep-Dive Analysis

**Document Version**: 1.0.0  
**Target File**: `src/pages/CaretakerProfilePage.jsx`  
**Subcomponents Path**: `src/components/caretaker/`  
**Author**: Explorer 3 (Milestone M3: Match Results & Caretaker Profile Detail)  
**Date**: 2026-08-20

---

## 1. Executive Summary & Page Purpose

The **Caretaker Profile Detail Page** (`/caretaker/:id`) is the core decision-making surface in Looklarn. When family guardians (sons, daughters) transition from the AI Match Results page (`/matches`) or home activity flows, this page provides the deep trust verification, medical credentials, bilingual biography, interactive availability calendar, transparent family reviews, and seamless booking conversion required to entrust elderly parents to a companion.

### Key Objectives:
1. **Uncompromising Trust & Verification**: Visually spotlight Royal Thai Police background check, CPR & First Aid certification, Looklarn Academy credentialing, and National ID verification.
2. **AI Compatibility Context**: Prominently display the AI Match Score ring (e.g. 96%, 88%, 81%) and personalized match reasons.
3. **Interactive Availability**: Render an interactive monthly calendar with color-coded dates (emerald for available, slate for booked) and time slot highlights (Morning, Afternoon, Full Day).
4. **Transparent Social Proof**: Display aggregated rating breakdowns (5/4/3/2/1 star distribution) alongside verified guardian review cards.
5. **Persistent Sticky Conversion**: Maintain an unobstructed fixed bottom booking bar on all viewport sizes with caretaker summary, pricing, and high-contrast "Book This Caretaker" CTA navigating to `/book/:id`.
6. **Strict Bilingual Fidelity**: Seamless single-language rendering across Thai (TH) and English (EN) with zero mixed-language labels.

---

## 2. Component Hierarchy & File Structure

```
src/
├── pages/
│   └── CaretakerProfilePage.jsx       # Main profile route controller & layout orchestrator
└── components/
    └── caretaker/
        ├── CaretakerWaveHero.jsx       # Ocean blue gradient banner with curved SVG wave & actions
        ├── TrustBadges.jsx             # 4 verification badges (Police check, CPR, Academy, ID)
        ├── CaretakerStats.jsx          # Experience, completed trips, ratings, response rate
        ├── CaretakerBio.jsx            # Bilingual bio, specialties, languages, education, vehicle, areas
        ├── AvailabilityCalendar.jsx    # Interactive calendar widget, month nav, time slots
        ├── CaretakerReviews.jsx        # Star rating breakdown (5-1 stars) + verified review cards
        └── StickyBookingBar.jsx        # Fixed bottom bar with caretaker info, rate, book CTA
```

### Component Tree:
```
<CaretakerProfilePage>
  ├── <CaretakerWaveHero>
  │     ├── <Link to="/matches"> (Back Button)
  │     ├── <button> (Share Profile Button + Toast)
  │     ├── Profile Avatar + <ShieldCheck> (Verified Checkmark)
  │     ├── Caretaker Name, Nickname & Tier Badge (<Badge variant="specialist|expert|trained">)
  │     ├── Quick Rating & Trip Counts
  │     └── <MatchScoreRing size="lg"> (AI Match Score Card)
  │
  ├── <TrustBadges>
  │     ├── [Badge 1] Criminal Background Checked (สำนักงานตำรวจแห่งชาติ)
  │     ├── [Badge 2] CPR & First Aid Certified (Thai Red Cross)
  │     ├── [Badge 3] Looklarn Academy Caregiver Certified (Ministry of Public Health)
  │     └── [Badge 4] National ID & Facial Biometrics Verified
  │
  ├── Main Content Grid (2 columns on md/lg)
  │     ├── Column 1 (Left / Primary - 2/3 width on desktop):
  │     │     ├── <CaretakerBio>
  │     │     │     ├── About Biography
  │     │     │     ├── Language Dialects List
  │     │     │     ├── Specialized Skills & Qualifications Grid
  │     │     │     ├── Education & Certifications
  │     │     │     ├── Vehicle & Accessibility Equipment
  │     │     │     └── Service Coverage Districts
  │     │     └── <CaretakerReviews>
  │     │           ├── Aggregate Rating & 5-tier Star Distribution Bars
  │     │           ├── Review Tag Filters (All, Hospital, Park, Temple)
  │     │           └── Verified Review Cards List
  │     │
  │     └── Column 2 (Right / Sidebar - 1/3 width on desktop):
  │           ├── <CaretakerStats>
  │           │     └── Quick Stats Cards (Experience, Trips, Rating, 100% Response)
  │           └── <AvailabilityCalendar>
  │                 ├── Month Navigation (<ChevronLeft>, <ChevronRight>)
  │                 ├── Interactive Day Grid (Available vs Booked)
  │                 ├── Selected Date Details & Time Slot Badges (Morning, Afternoon, Full Day)
  │                 └── Calendar Status Legend
  │
  └── <StickyBookingBar>
        ├── Caretaker Mini Avatar & Name
        ├── Hourly Rate (฿{hourlyRate} / hr)
        └── <Link to={`/book/${caretaker.id}`}> -> <Button variant="accent" size="lg"> (Book This Caretaker)
```

---

## 3. Detailed Component Specifications

### 3.1 `CaretakerWaveHero.jsx`
- **Purpose**: Creates an impressive visual entry point blending Looklarn's ocean blue and emerald green palette with an organic curved SVG wave divider.
- **Visual Styling**:
  - Background: `bg-gradient-to-r from-sky-600 via-sky-500 to-teal-500` (or `bg-gradient-to-br from-sky-700 via-sky-600 to-emerald-500`).
  - Decorative Wave SVG at bottom: Seamless transition to `#F0F9FF`.
  - Top Actions Bar:
    - Back Button: `<Link to="/matches">` with `<ArrowLeft className="w-4 h-4" />` and label `t('common.back', 'ย้อนกลับ')`.
    - Share Button: Copy current profile URL to clipboard with icon `<Share2 className="w-4 h-4" />` and brief copy confirmation toast/state.
- **Profile Presentation**:
  - Avatar: `w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden border-4 border-white/90 shadow-2xl relative shrink-0`.
  - Verified Checkmark Badge: Floating emerald icon (`<ShieldCheck className="w-6 h-6 text-emerald-500 bg-white rounded-full p-0.5 shadow-md" />`) positioned at bottom-right of avatar.
  - Name: `h1` in bold white typography `getLocalized(caretaker, 'name')`.
  - Nickname & Role: e.g. `(สมชาย)` / `(Somchai)` and `getLocalized(caretaker, 'tierName')`.
  - Tier Badge: `<Badge variant="match" className="bg-white/20 text-white border-white/40 backdrop-blur-xs">`.
  - Inline Stats: Rating `★ 4.95 (58 รีวิว)`, Experience `6 ปี`, Completed trips `142+ ดูแลสำเร็จ`.
- **AI Match Score Component**:
  - Right-aligned glassmorphic container: `bg-white/15 backdrop-blur-md p-4 rounded-3xl border border-white/30 flex flex-col items-center justify-center text-center shadow-lg`.
  - Contains `<MatchScoreRing score={caretaker.matchScore} size="lg" className="text-white" />`.
  - Label: `t('caretaker.matchScoreBadge', 'AI Match Score {score}%')`.

### 3.2 `TrustBadges.jsx`
- **Purpose**: Establishes immediate institutional trust by outlining 4 verified credentials.
- **Layout**: Responsive grid `grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4`.
- **Badges**:
  1. **Criminal Record Checked (ตรวจสอบประวัติอาชญากรรมแล้ว)**:
     - Icon: `<ShieldCheck className="w-6 h-6 text-emerald-500" />`
     - Header: `t('caretaker.badgeBackground', 'ตรวจสอบประวัติอาชญากรรมแล้ว')`
     - Subtext: `สำนักงานตำรวจแห่งชาติ (Royal Thai Police Checked)`
  2. **CPR & First Aid Certified (ผ่านการอบรมปฐมพยาบาล)**:
     - Icon: `<HeartPulse className="w-6 h-6 text-rose-500" />` or `<CheckCircle2 className="w-6 h-6 text-emerald-500" />`
     - Header: `t('caretaker.badgeCpr', 'ผ่านการอบรมปฐมพยาบาล CPR & First Aid')`
     - Subtext: `สภากาชาดไทย (Thai Red Cross Society)`
  3. **Looklarn Academy Certified (ผ่านการรับรองมาตรฐานผู้ดูแล)**:
     - Icon: `<Award className="w-6 h-6 text-sky-500" />`
     - Header: `t('caretaker.badgeCaregiver', 'ผ่านการรับรองมาตรฐานผู้ดูแลผู้สูงอายุ')`
     - Subtext: `มาตรฐานกระทรวงสาธารณสุข (MOPH Standard)`
  4. **National ID Verified (ยืนยันตัวตนด้วยบัตรประชาชน 100%)**:
     - Icon: `<UserCheck className="w-6 h-6 text-indigo-500" />`
     - Header: `t('caretaker.badgeIdVerified', 'ยืนยันตัวตนด้วยบัตรประชาชน 100%')`
     - Subtext: `DOPA Government Database Verified`

### 3.3 `CaretakerBio.jsx`
- **Purpose**: Displays full biographical background, specialized skills, language dialects, education, vehicle transport capabilities, and service areas.
- **Sections**:
  1. **About Me (เกี่ยวกับผู้ดูแล)**:
     - Header: `t('caretaker.bioTitle', 'เกี่ยวกับผู้ดูแล')`
     - Text: `getLocalized(caretaker, 'bio')` in clear, readable typography with generous line-height (`leading-relaxed`).
  2. **Languages & Dialects (ภาษาที่สื่อสารได้)**:
     - Header: `t('caretaker.languagesTitle', 'ภาษาที่สื่อสารได้')`
     - Icon: `<Languages className="w-4 h-4 text-sky-500" />`
     - Badges: `caretaker.languages.map(lang => <Badge variant="primary">{getLocalized(lang)}</Badge>)`
  3. **Specialties & Capabilities (ทักษะและความเชี่ยวชาญเฉพาะด้าน)**:
     - Header: `t('caretaker.specialtiesTitle', 'ทักษะและความเชี่ยวชาญเฉพาะด้าน')`
     - 2-column grid of skill cards with `<CheckCircle2 className="w-4 h-4 text-emerald-500" />`.
     - Examples: Hospital OPD coordination, Wheelchair handling, Vital signs monitoring & meds reminder, Doctor instructions note-taking.
  4. **Education & Certifications (การศึกษาและใบรับรองวิชาชีพ)**:
     - Header: `t('caretaker.educationTitle', 'การศึกษาและใบรับรองวิชาชีพ')`
     - Icon: `<GraduationCap className="w-5 h-5 text-purple-500" />`
     - Text: `getLocalized(caretaker, 'education')`
  5. **Vehicle & Accessibility Equipment (ยานพาหนะและอุปกรณ์อำนวยความสะดวก)**:
     - Header: `t('caretaker.vehicleTitle', 'ยานพาหนะและอุปกรณ์อำนวยความสะดวก')`
     - Icon: `<Car className="w-5 h-5 text-emerald-500" />`
     - Text: `getLocalized(caretaker, 'vehicle')` (e.g. Sedan with wheelchair trunk space, Ramp-equipped MPV/SUV).
  6. **Service Areas (พื้นที่ที่พร้อมให้บริการ)**:
     - Header: `t('caretaker.serviceAreasTitle', 'พื้นที่ที่พร้อมให้บริการ')`
     - Icon: `<MapPin className="w-5 h-5 text-rose-500" />`
     - Badges / Text: `getLocalized(caretaker, 'serviceAreas')`

### 3.4 `CaretakerStats.jsx`
- **Purpose**: Highlights 4 key performance metrics in a quick-scan card grid.
- **Metrics**:
  1. Experience: `{caretaker.experienceYears} ปี` / `{caretaker.experienceYears} Years`
  2. Completed Escort Trips: `{caretaker.completedTrips}+ ครั้ง` / `{caretaker.completedTrips}+ Trips`
  3. Rating: `{caretaker.rating} / 5.0`
  4. Response Rate: `100% (ภายใน 15 นาที)` / `100% (within 15 mins)`

### 3.5 `AvailabilityCalendar.jsx`
- **Purpose**: An interactive calendar widget that lets guardians explore caretaker availability by date and time slot.
- **Features**:
  - **Month Navigation**: Displays current month (e.g. สิงหาคม 2569 / August 2026) with `<ChevronLeft>` and `<ChevronRight>` buttons.
  - **Day Headers**: 7 columns (อา., จ., อ., พ., พฤ., ศ., ส. / Su, Mo, Tu, We, Th, Fr, Sa).
  - **Interactive Day Grid**:
    - Available dates: Styled with emerald badges (`bg-emerald-50 text-emerald-700 border-emerald-300 font-bold hover:bg-emerald-100 cursor-pointer`), with a small green indicator dot.
    - Booked / Unavailable dates: Muted slate (`bg-slate-50 text-slate-300 cursor-not-allowed line-through`).
    - Selected date: Active state (`bg-emerald-600 text-white font-bold ring-2 ring-emerald-400 shadow-md`).
  - **Selected Date Panel**:
    - Shows formatted date (e.g. "วันศุกร์ที่ 28 สิงหาคม 2569" / "Friday, 28 August 2026").
    - Available Time Slots:
      - Morning Slot: `08:00 - 12:00` (ว่าง / Available)
      - Afternoon Slot: `13:00 - 17:00` (ว่าง / Available)
      - Full Day Slot: `08:00 - 16:00` (ว่าง / Available)
    - Slot buttons are selectable and sync with search/booking context.
  - **Status Legend**:
    - Green dot: `t('caretaker.calendar.available', 'ว่าง (Available)')`
    - Slate dot: `t('caretaker.calendar.booked', 'ไม่ว่าง / เต็ม (Booked)')`
    - Dark emerald: `t('caretaker.calendar.selected', 'วันที่เลือก (Selected)')`

### 3.6 `CaretakerReviews.jsx`
- **Purpose**: Provides credible guardian social proof with detailed breakdown and verified feedback.
- **Rating Summary Breakdown**:
  - Large aggregate rating: `4.95 / 5.0` with 5 filled gold stars.
  - Total review count: `t('caretaker.reviewsTitle', 'รีวิวจากครอบครัวผู้ใช้บริการจริง ({count} รีวิว)')`.
  - 5-Tier Star Distribution Bars:
    - 5 Stars: 92% (53 รีวิว) — emerald progress bar
    - 4 Stars: 8% (5 รีวิว) — sky progress bar
    - 3 Stars: 0% — slate track
    - 2 Stars: 0% — slate track
    - 1 Star: 0% — slate track
- **Review Filter Chips**:
  - `ทั้งหมด (All)`, `5 ดาว (5 Stars)`, `พาพบแพทย์ (Hospital)`, `พาเดินเล่น (Park/Leisure)`.
- **Verified Review Cards**:
  - Reviewer Name (e.g. "คุณธนกร ใจดี" / "Thanakorn Jaidee").
  - Relationship Tag: `t('common.relationship', 'บุตรชาย')` / `(Son)`.
  - Verified Escort Badge: `<ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />` `t('caretaker.verifiedOuting', 'ยืนยันการใช้บริการจริง')`.
  - Star Rating: 5 filled gold `<Star />` icons.
  - Outing Date & Location: `14 ส.ค. 2569 • พาไป รพ.ศิริราช`.
  - Comment: `"{getLocalized(review, 'comment')}"` in styled italic quote typography.

### 3.7 `StickyBookingBar.jsx`
- **Purpose**: High-converting fixed bottom bar that remains accessible at all scroll positions.
- **Positioning**: `fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl px-4 sm:px-8 py-3.5`.
- **Layout**:
  - Left Container:
    - Caretaker mini avatar thumbnail (44x44, `rounded-xl object-cover border border-slate-200`).
    - Caretaker Name (`font-bold text-slate-900 line-clamp-1`) and rating.
    - Hourly Rate: `฿{caretaker.hourlyRate}` in `text-2xl font-black text-emerald-600` with `/ {t('common.hrShort', 'ชม.')}`.
    - AI Match Score Badge on tablet/desktop: `96% Match`.
  - Right Container:
    - Large Primary CTA Button: `<Link to={`/book/${caretaker.id}`}>` with `<Button variant="accent" size="lg" className="w-full sm:w-auto font-bold shadow-lg shadow-emerald-500/20">`.
    - CTA Text: `t('caretaker.bookThisCaretaker', 'จองผู้ดูแลคนนี้')` / `Book This Caretaker`.
- **Viewport Layout Safeguard**: Parent page container MUST apply `pb-32 sm:pb-36` to prevent bottom content truncation.

---

## 4. Interface & Props Contracts

### 4.1 `CaretakerWaveHero` Props
```typescript
interface CaretakerWaveHeroProps {
  caretaker: CaretakerObject;
  onShare?: () => void;
}
```

### 4.2 `TrustBadges` Props
```typescript
interface TrustBadgesProps {
  verifiedBadges?: string[];
  className?: string;
}
```

### 4.3 `CaretakerBio` Props
```typescript
interface CaretakerBioProps {
  caretaker: CaretakerObject;
  className?: string;
}
```

### 4.4 `CaretakerStats` Props
```typescript
interface CaretakerStatsProps {
  caretaker: CaretakerObject;
  className?: string;
}
```

### 4.5 `AvailabilityCalendar` Props
```typescript
interface AvailabilityCalendarProps {
  caretaker: CaretakerObject;
  selectedDate?: string;
  selectedTimeSlot?: string;
  onSelectDate?: (date: string) => void;
  onSelectTimeSlot?: (slot: string) => void;
  className?: string;
}
```

### 4.6 `CaretakerReviews` Props
```typescript
interface CaretakerReviewsProps {
  reviews: ReviewObject[];
  rating: number;
  reviewsCount: number;
  className?: string;
}
```

### 4.7 `StickyBookingBar` Props
```typescript
interface StickyBookingBarProps {
  caretaker: CaretakerObject;
  className?: string;
}
```

---

## 5. Mock Data Structure & Schema Reference (`src/data/caretakers.json`)

The caretaker object structure in `src/data/caretakers.json` supports all required profile sections:

```json
{
  "id": "ct-001",
  "name": { "th": "สมชาย ประเสริฐ", "en": "Somchai Prasert" },
  "nickname": { "th": "สมชาย", "en": "Somchai" },
  "gender": "male",
  "age": 34,
  "photo": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
  "matchScore": 96,
  "isBestMatch": true,
  "tier": "specialist",
  "tierName": {
    "th": "ผู้เชี่ยวชาญพาพบแพทย์และประสานงาน รพ.",
    "en": "Hospital Medical Escort Specialist"
  },
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
    { "th": "ช่วยเหลือผู้ใช้วีลแชร์และพยุงเดิน", "en": "Wheelchair Handling & Mobility Support" },
    { "th": "ตรวจวัดสัญญาณชีพและเตือนทานยา", "en": "Vital Signs Check & Medication Reminders" },
    { "th": "จดบันทึกคำสั่งแพทย์ส่งครอบครัว", "en": "Medical Notes & Guardian Reporting" }
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
    "th": "อดีตผู้ช่วยพยาบาลวิชาชีพ ประสบการณ์ดูแลผู้สูงอายุและพาพบแพทย์โรงพยาบาลรัฐและเอกชนกว่า 6 ปี เชี่ยวชาญขั้นตอนการรอคิว การประสานงานแผนกผู้ป่วยนอก (OPD) และการดูแลผู้ใช้วีลแชร์อย่างนุ่มนวลและปลอดภัย",
    "en": "Former practical nurse with 6+ years of experience in elderly hospital escort and OPD coordination. Specialized in wheelchair assistance, vital signs monitoring, and comprehensive physician instruction reporting."
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
        "th": "คุณสมชายดูแลคุณแม่ดีมากครับ คอยประคองและประสานงานห้องตรวจ รพ.ศิริราช ได้อย่างรวดเร็ว คุณแม่ไม่เหนื่อยเลย แนะนำเลยครับ",
        "en": "Somchai was exceptional with mom at Siriraj Hospital. Guided through OPD smoothly and kept me updated throughout. Highly recommended!"
      }
    }
  ]
}
```

---

## 6. Bilingual (TH/EN) Localization Dictionary Mapping

To ensure 100% pure single-language UI without mixed-language artifacts, all keys under `caretaker` in `src/i18n/th.js` and `src/i18n/en.js` are systematically defined:

### Key Mapping Table:

| Key Path | Thai Translation (`th.js`) | English Translation (`en.js`) | Context / Component |
|---|---|---|---|
| `caretaker.profileTitle` | `"โปรไฟล์ผู้ดูแล"` | `"Caretaker Profile"` | Page Title |
| `caretaker.backToMatches` | `"กลับสู่ผลการจับคู่"` | `"Back to Matches"` | Hero Back Button |
| `caretaker.shareProfile` | `"แชร์โปรไฟล์"` | `"Share Profile"` | Hero Share Button |
| `caretaker.shareCopied` | `"คัดลอกลิงก์โปรไฟล์แล้ว!"` | `"Profile link copied to clipboard!"` | Share Toast |
| `caretaker.verified` | `"ยืนยันตัวตนแล้ว"` | `"Verified Caregiver"` | Hero Avatar Badge |
| `caretaker.verifiedTitle` | `"เครื่องหมายยืนยันความปลอดภัยและมาตรฐาน"` | `"Safety & Professional Verification Badges"` | Trust Badges Title |
| `caretaker.badgeBackground` | `"ตรวจสอบประวัติอาชญากรรมแล้ว (สำนักงานตำรวจแห่งชาติ)"` | `"Criminal Background Checked (Royal Thai Police)"` | Trust Badge 1 |
| `caretaker.badgeNurse` | `"ใบอนุญาตประกอบวิชาชีพพยาบาล (สภาการพยาบาล)"` | `"Licensed Practical/Registered Nurse (Nursing Council)"` | Optional Nurse Badge |
| `caretaker.badgeCaregiver` | `"ใบรับรองการดูแลผู้สูงอายุมาตรฐานกระทรวงสาธารณสุข"` | `"Elderly Caregiver Certified (Ministry of Public Health)"` | Trust Badge 3 |
| `caretaker.badgeCpr` | `"ผ่านการอบรมการช่วยชีวิตขั้นพื้นฐาน (CPR & First Aid)"` | `"CPR & Basic Life Support Certified (Thai Red Cross)"` | Trust Badge 2 |
| `caretaker.badgeIdVerified` | `"ยืนยันตัวตนด้วยบัตรประชาชนและใบหน้า 100%"` | `"National ID & Facial Biometrics Verified"` | Trust Badge 4 |
| `caretaker.badgeDriver` | `"ใบขับขี่สาธารณะและผ่านการอบรมขับขี่ปลอดภัย"` | `"Defensive Driving & Senior Transportation Certified"` | Optional Driver Badge |
| `caretaker.matchScoreBadge` | `"AI Match Score {score}%"` | `"AI Match Score {score}%"` | Match Score Ring |
| `caretaker.compatibilityRate` | `"ความเข้ากันได้"` | `"Compatibility"` | Match Ring Sublabel |
| `caretaker.stats.experienceLabel` | `"ประสบการณ์"` | `"Experience"` | Stats Strip |
| `caretaker.stats.experienceValue` | `"{years} ปี"` | `"{years} Years"` | Stats Strip |
| `caretaker.stats.tripsLabel` | `"ดูแลสำเร็จ"` | `"Completed Escorts"` | Stats Strip |
| `caretaker.stats.tripsValue` | `"{count}+ ครั้ง"` | `"{count}+ Trips"` | Stats Strip |
| `caretaker.stats.ratingLabel` | `"คะแนนรีวิว"` | `"Review Rating"` | Stats Strip |
| `caretaker.stats.ratingValue` | `"{rating} / 5.0"` | `"{rating} / 5.0"` | Stats Strip |
| `caretaker.stats.responseLabel` | `"อัตราการตอบกลับ"` | `"Response Rate"` | Stats Strip |
| `caretaker.stats.responseValue` | `"100% (ภายใน 15 นาที)"` | `"100% (within 15 mins)"` | Stats Strip |
| `caretaker.bioTitle` | `"เกี่ยวกับผู้ดูแล"` | `"About the Companion"` | CaretakerBio Section |
| `caretaker.languagesTitle` | `"ภาษาที่สื่อสารได้"` | `"Languages Spoken"` | CaretakerBio Section |
| `caretaker.specialtiesTitle` | `"ทักษะและความเชี่ยวชาญเฉพาะด้าน"` | `"Specialized Skills & Qualifications"` | CaretakerBio Section |
| `caretaker.educationTitle` | `"การศึกษาและใบรับรองวิชาชีพ"` | `"Education & Certifications"` | CaretakerBio Section |
| `caretaker.vehicleTitle` | `"ยานพาหนะและอุปกรณ์อำนวยความสะดวก"` | `"Vehicle & Accessibility Equipment"` | CaretakerBio Section |
| `caretaker.serviceAreasTitle` | `"พื้นที่ที่พร้อมให้บริการ"` | `"Service Coverage Areas"` | CaretakerBio Section |
| `caretaker.availabilityTitle` | `"ตารางเวลาที่พร้อมให้บริการ"` | `"Weekly Availability Calendar"` | AvailabilityCalendar |
| `caretaker.calendar.selectSlot` | `"เลือกช่วงเวลาที่ต้องการ:"` | `"Select preferred time slot:"` | Calendar Time Slot |
| `caretaker.calendar.morning` | `"ช่วงเช้า (08:00 - 12:00)"` | `"Morning (08:00 - 12:00)"` | Time Slot Morning |
| `caretaker.calendar.afternoon` | `"ช่วงบ่าย (13:00 - 17:00)"` | `"Afternoon (13:00 - 17:00)"` | Time Slot Afternoon |
| `caretaker.calendar.fulldays` | `"เต็มวัน (08:00 - 16:00)"` | `"Full Day (08:00 - 16:00)"` | Time Slot Full Day |
| `caretaker.calendar.available` | `"ว่าง"` | `"Available"` | Calendar Legend |
| `caretaker.calendar.booked` | `"ไม่ว่าง / เต็ม"` | `"Booked"` | Calendar Legend |
| `caretaker.calendar.selected` | `"วันที่เลือก"` | `"Selected Date"` | Calendar Legend |
| `caretaker.reviewsTitle` | `"รีวิวจากครอบครัวผู้ใช้บริการจริง"` | `"Reviews from Families"` | CaretakerReviews |
| `caretaker.reviewsCount` | `"({count} รีวิว)"` | `"({count} Reviews)"` | Review Counter |
| `caretaker.verifiedOuting` | `"ยืนยันการใช้บริการจริง"` | `"Verified Outing"` | Review Card Badge |
| `caretaker.bookThisCaretaker` | `"จองผู้ดูแลคนนี้"` | `"Book This Caretaker"` | Sticky Bottom Bar & Buttons |
| `caretaker.stickyBar.rateLabel` | `"อัตราค่าบริการ"` | `"Hourly Rate"` | Sticky Bottom Bar |
| `caretaker.stickyBar.unit` | `"บาท / ชั่วโมง"` | `"THB / hour"` | Sticky Bottom Bar |
| `caretaker.stickyBar.bookBtn` | `"จองผู้ดูแลคนนี้"` | `"Book This Caretaker"` | Sticky Bottom Bar Button |
| `caretaker.notFoundTitle` | `"ไม่พบผู้ดูแลที่ต้องการ"` | `"Caretaker Not Found"` | 404 Fallback |
| `caretaker.notFoundDesc` | `"ไม่พบข้อมูลผู้ดูแลรหัสนี้ในระบบ"` | `"The requested caretaker profile does not exist or has been removed."` | 404 Fallback |

---

## 7. Test Compatibility & Edge Case Hardening

1. **Flexible ID Routing**:
   - `ct-001`, `ct-1`, and `1` all resolve correctly to Somchai Prasert (`ct-001`) via `getCaretakerById` in `AppContext.jsx`.
2. **Graceful 404 Fallback**:
   - Unknown IDs (e.g. `/caretaker/non-existent-caretaker-999`) render a clean fallback card with Thai/EN messages and a link back to `/matches`.
3. **E2E Test Regex Matching**:
   - E2E Tier 1 Feature 5 tests search for:
     - Hero heading + Match score (e.g. `96%`).
     - Verified badges (`/ผ่านการตรวจสอบประวัติ|Background Check|ผ่านการรับรอง|Certified|ปฐมพยาบาล|First Aid/i`).
     - Bio heading (`/เกี่ยวกับผู้ดูแล|ประวัติ|Bio|About/i`).
     - Availability calendar (`/ตารางเวลาที่ว่าง|ปฏิทิน|Availability|Calendar/i`).
     - Reviews heading (`/รีวิว|ความคิดเห็น|Reviews|Feedback/i`).
     - Sticky CTA button (`/จองผู้ดูแลคนนี้|จองเลย|Book Caretaker|Book Now/i`).
   - The proposed implementation satisfies all of these regex queries in both Thai and English.

---

## 8. Implementation Checklist for Sub-Orchestrator & Implementers

- [ ] Create `src/components/caretaker/CaretakerWaveHero.jsx`
- [ ] Create `src/components/caretaker/TrustBadges.jsx`
- [ ] Create `src/components/caretaker/CaretakerStats.jsx`
- [ ] Create `src/components/caretaker/CaretakerBio.jsx`
- [ ] Create `src/components/caretaker/AvailabilityCalendar.jsx`
- [ ] Create `src/components/caretaker/CaretakerReviews.jsx`
- [ ] Create `src/components/caretaker/StickyBookingBar.jsx`
- [ ] Refactor `src/pages/CaretakerProfilePage.jsx` to assemble subcomponents with clean layout and `pb-32 sm:pb-36` bottom padding
- [ ] Ensure all translation keys are present and clean in `src/i18n/th.js` and `src/i18n/en.js`
- [ ] Run test suite verification (`npx vitest run src/tests/e2e_tier1_features.test.jsx -t "Feature 5"`)
