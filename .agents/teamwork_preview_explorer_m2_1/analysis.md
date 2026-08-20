# Technical Architecture & Implementation Analysis Report for Milestone M2
**Milestone**: M2 — Home Page (`/`) & Find Caretaker 3-Step Wizard (`/find`)  
**Investigator**: Explorer 1  
**Timestamp**: 2026-08-20T06:42:00Z  
**Target Codebase**: `d:/SDISMAN/Projects/Looklarn`  

---

## 1. Executive Summary

Milestone M2 focuses on building and polishing the primary user entry points into Looklarn:
1. **Home Page (`/` / `src/pages/HomePage.jsx`)**: The front-facing marketing and discovery showcase featuring the ocean-blue-to-emerald gradient Hero Banner, 4 interactive Activity Cards with instant pre-selection navigation to `/find`, a Partner Hospital Promotion strip with coupon copy action, a 3-step "How It Works" explainer, and Guardian Testimonials.
2. **Find Caretaker Wizard (`/find` / `src/pages/FindCaretakerPage.jsx`)**: A structured 3-step interactive questionnaire (Step 1: Physical Needs & Health -> Step 2: Preferences & Lifestyle -> Step 3: Schedule & Budget) that seamlessly pre-fills from the active Elder Profile (`elder.json` / `AppContext.elder`), supports bidirectional step navigation, retains state across live language toggles (`TH | EN`), and triggers a 2.0–2.5 second AI Matching radar/pulse animation (`AiMatchingLoader.jsx`) before routing to `/matches`.

All foundational layers from Milestone M1 (Vite + Tailwind + React Router + `LanguageContext` + `AppContext` + UI Kit components `Button`, `Card`, `Badge`, `MatchScoreRing`, `Modal`, `Toast`) are in place. This report provides the architectural blueprint, component contracts, mock data mappings, i18n key mappings, and test verification paths for the M2 implementer.

---

## 2. Codebase Structure & Architectural Contracts

### 2.1 Route Definitions & Layout Shell (`src/App.jsx`)
`src/App.jsx` registers all 7 primary prototype routes wrapped in `ToastProvider`, `ScrollToTop`, `Navbar`, `<main>`, and `Footer`:
- `/` -> `<HomePage />`
- `/find` -> `<FindCaretakerPage />`
- `/matches` & `/results` -> `<MatchResultsPage />`
- `/caretaker/:id` -> `<CaretakerProfilePage />`
- `/book/:id` -> `<BookingPage />`
- `/bookings` -> `<MyBookingsPage />`
- `/elder` & `/elder-profile` -> `<ElderProfilePage />`
- `*` -> `<NotFoundPage />`

### 2.2 State Management & Context API

#### A. `LanguageContext` (`src/context/LanguageContext.jsx`)
- **Hook**: `const { language, lang, setLanguage, setLang, toggleLanguage, t, getLocalized } = useLanguage();`
- **Current Lang**: `'th'` (default) or `'en'`. Persisted to `localStorage.getItem('looklarn_lang')`.
- **`t(keyPath, paramsOrFallback)`**: Dot-notated translation function supporting parameter interpolation (e.g. `{name}`, `{activity}`, `{date}`, `{budget}`, `{hours}`, `{rate}`).
- **`getLocalized(item, field)`**: Resolves localized strings from mock objects supporting both nested `{ th, en }` objects and `_th` / `_en` suffix fields.
- **Rule**: Zero simultaneous mixed-language labels (e.g. never render `"Hospital / โรงพยาบาล"`).

#### B. `AppContext` (`src/context/AppContext.jsx`)
- **Hook**: `const { elder, elderProfile, updateElderProfile, searchCriteria, updateSearchCriteria, resetSearchCriteria, caretakers, activities, getCaretakerById, getBookingById, bookings, addBooking, cancelBooking, addReview } = useApp();`
- **Default Search Criteria State Structure**:
  ```javascript
  {
    mobility: 'wheelchair_assisted', // 'independent' | 'cane' | 'wheelchair_assisted' | 'full_assistance'
    conditions: ['hypertension', 'diabetes_type_2', 'knee_osteoarthritis'],
    needsMedicationReminder: true,
    specialCareType: 'none', // 'none' | 'nurse' | 'physical'
    activityType: 'hospital', // 'hospital' | 'temple' | 'park' | 'shopping' | 'social'
    language: 'Thai', // 'Thai' | 'Isan' | 'Northern' | 'English' | 'Chinese'
    religion: 'Buddhism', // 'Buddhism' | 'Christianity' | 'Islam' | 'Any'
    dietary: 'low_sodium', // 'normal' | 'low_sodium' | 'halal' | 'vegetarian' | 'no_beef'
    genderPref: 'any', // 'female' | 'male' | 'any'
    date: '2026-08-28',
    timeSlot: 'morning', // 'morning' | 'afternoon' | 'full_day'
    durationHours: 4,
    budgetMax: 500,
    pickupAddress: '128/4 ซอยสุขุมวิท 39 แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ 10110',
    destination: 'โรงพยาบาลศิริราช อาคารนวมินทรบพิตร ๘๔ พรรษา',
    specialNotes: 'คุณยายเดินช้าและใช้วีลแชร์ ต้องการคนช่วยถือของและคอยดูแลเรื่องคิวพบแพทย์'
  }
  ```
- **Elder Profile Structure (`src/data/elder.json`)**:
  - `id`: `"elder-001"`
  - `name`: `{ th: "นางสมพร ใจดี", en: "Grandma Somporn Jaidee" }`
  - `nickname`: `{ th: "ยายพร", en: "Grandma Porn" }`
  - `age`: `74`
  - `gender`: `"female"`
  - `mobilityLevel`: `"wheelchair_assisted"`
  - `medicalConditions`: `["hypertension", "diabetes_type_2", "knee_osteoarthritis"]`
  - `allergies`: `{ th: "...", en: "..." }`
  - `medications`: `{ th: "Amlodipine 5mg...", en: "..." }`
  - `preferredHospital`: `{ th: "โรงพยาบาลศิริราช / โรงพยาบาลจุฬาลงกรณ์", en: "..." }`
  - `dietaryPreferences`: `{ th: "...", en: "..." }`
  - `religion`: `{ th: "พุทธ...", en: "..." }`
  - `preferredLanguages`: `["Thai", "Isan"]`
  - `specialNotes`: `{ th: "...", en: "..." }`
  - `address`: `{ th: "128/4 ซอยสุขุมวิท 39...", en: "..." }`

---

## 3. Component Breakdown & Implementation Specifications for M2

### 3.1 Home Page Module (`src/pages/HomePage.jsx` & `src/components/home/*`)

```
src/components/home/
├── HeroBanner.jsx        # Gradient hero + headline + trust badges + CTA -> /find
├── ActivityGrid.jsx      # 4 featured activity cards + click navigation with category
├── PromoBanner.jsx       # Partner hospital discount banner + copy promo code LOOKLARNCARE
├── HowItWorks.jsx        # 3-step illustrated booking process
└── Testimonials.jsx      # Guardian reviews, quotes, 5-star ratings, avatars
```

#### Detailed Component Specifications:

1. **`HeroBanner.jsx`**:
   - **Visuals**: Eye-catching ocean blue to emerald gradient (`from-sky-500 to-emerald-500` or `gradient-hero`), subtle background decorative circles/glow, headline in Sarabun font with bold typography.
   - **Badge**: AI-powered badge: `t('home.hero.badge')` ("AI-Powered Elder Companion Matching").
   - **Headline**: `t('home.hero.title')` ("ให้ \"ลูกหลาน\" ดูแลคนที่คุณรัก ในทุกช่วงเวลาสำคัญ").
   - **Subtitle**: `t('home.hero.subtitle')` ("บริการจับคู่ผู้ดูแลมืออาชีพที่ผ่านการตรวจสอบประวัติ...").
   - **CTAs**:
     - Primary Button: `variant="accent"`, size `"lg"`, `leftIcon={<Search />}`, text `t('home.hero.ctaPrimary')` -> Links to `/find`.
     - Secondary Button: `variant="secondary"`, size `"lg"`, `leftIcon={<Calendar />}`, text `t('nav.myBookings')` -> Links to `/bookings`.
   - **Trust Badges**:
     - `100% Background Checked` (`ShieldCheck` icon, `t('home.hero.trustBadge1')`).
     - `CPR & First Aid Certified` (`Heart` icon, `t('home.hero.trustBadge2')`).
     - `Accident Insurance on Every Trip` (`Sparkles` icon, `t('home.hero.trustBadge3')`).
     - Satisfaction score pill: `t('home.hero.trustScore')` ("คะแนนความพึงพอใจ 4.95/5 จากกว่า 1,200 ครอบครัว").

2. **`ActivityGrid.jsx`**:
   - **Header**: Tag `t('home.activities.tag')`, Title `t('home.activities.title')`, Subtitle `t('home.activities.subtitle')`.
   - **4 Activity Cards**:
     - **Card 1 (Hospital)**: Icon `Stethoscope`, Title: "พาพบแพทย์ & รับยา" / "Hospital & Medical Escort", Subtitle: "ยอดนิยมอันดับ 1", Description, Rate: "฿350 - ฿500 / ชม.", Duration: "3 - 5 ชม.", Category query: `hospital`.
     - **Card 2 (Temple & Merit)**: Icon `Sparkles` or `Landmark`, Title: "พาไหว้พระ & ทำบุญ" / "Temple Pilgrimage & Merit Making", Subtitle: "อิ่มบุญ สุขใจ", Description, Rate: "฿350 - ฿450 / ชม.", Duration: "3 - 5 ชม.", Category query: `temple`.
     - **Card 3 (Park & Leisure)**: Icon `Trees`, Title: "เดินเล่นสวน & กายภาพ" / "Park Stroll & Gentle Exercise", Subtitle: "สดชื่น แข็งแรง", Description, Rate: "฿300 - ฿400 / ชม.", Duration: "2 - 4 ชม.", Category query: `park`.
     - **Card 4 (City & Shopping / Social)**: Icon `ShoppingBag` or `Coffee`, Title: "ท่องเที่ยว ชมเมือง & ช็อปปิ้ง" / "City Tour & Mall Outing", Subtitle: "สะดวก สบายใจ", Description, Rate: "฿300 - ฿450 / ชม.", Duration: "3 - 6 ชม.", Category query: `shopping`.
   - **Interaction**: Clicking any activity card navigates to `/find?activity={type}` and updates `searchCriteria.activityType` accordingly.

3. **`PromoBanner.jsx`**:
   - **Visuals**: Premium gradient banner with badge `t('home.promo.badge')` ("สิทธิพิเศษสมาชิกใหม่").
   - **Headline**: `t('home.promo.title')` ("ส่วนลดพิเศษเมื่อนัดหมายไปโรงพยาบาลพันธมิตร").
   - **Description**: `t('home.promo.desc')` ("รับส่วนลด 150 บาท สำหรับการนัดหมายพาผู้สูงอายุไปโรงพยาบาลศิริราช, รพ.จุฬาลงกรณ์ หรือ รพ.รามาธิบดี ครั้งแรก").
   - **Coupon Action**: Displays `LOOKLARNCARE` with one-click copy button, showing copied state icon + text (`t('home.promo.codeCopied')`).
   - **Partner List**: `t('home.promo.partnerHospitals')` ("โรงพยาบาลพันธมิตร: รพ.ศิริราช • รพ.จุฬาลงกรณ์ • รพ.รามาธิบดี • รพ.พระมงกุฎเกล้า").

4. **`HowItWorks.jsx`**:
   - **Tag**: `t('home.howItWorks.tag')`, Title `t('home.howItWorks.title')`, Subtitle `t('home.howItWorks.subtitle')`.
   - **Step 1**: Number "01", Title `t('home.howItWorks.step1Title')`, Desc `t('home.howItWorks.step1Desc')`.
   - **Step 2**: Number "02", Title `t('home.howItWorks.step2Title')`, Desc `t('home.howItWorks.step2Desc')`.
   - **Step 3**: Number "03", Title `t('home.howItWorks.step3Title')`, Desc `t('home.howItWorks.step3Desc')`.

5. **`Testimonials.jsx`**:
   - **Tag**: `t('home.testimonials.tag')`, Title `t('home.testimonials.title')`, Subtitle `t('home.testimonials.subtitle')`.
   - **3 Testimonial Cards**:
     - Testimonial 1: Thanakorn Jaidee (Son - Corporate Executive) praising Somchai at Siriraj Hospital.
     - Testimonial 2: Dr. Wannapa Sitthipong (Daughter - Physician) praising Fa at Wat Arun.
     - Testimonial 3: Kittisak Woradech (Son - Civil Servant) praising Ploy at Lumpini Park.
     - Includes 5 gold stars (`Star` icon filled amber-400), quoted text, author name, and family relationship.

---

### 3.2 Find Caretaker Wizard Module (`src/pages/FindCaretakerPage.jsx` & `src/components/find/*`)

```
src/components/find/
├── StepIndicator.jsx     # 3-step visual progress bar (33% / 66% / 100%)
├── Step1Physical.jsx     # Mobility level, chronic conditions, meds reminder, auto-fill banner
├── Step2Preferences.jsx  # Activity type, language/dialect, religion, diet, gender
├── Step3Schedule.jsx     # Date picker, duration, budget slider, pickup, destination, notes
└── AiMatchingLoader.jsx  # 2.0s animated pulse loader with rotating status messages -> /matches
```

#### Detailed Component Specifications:

1. **`StepIndicator.jsx`**:
   - Displays 3 distinct step tabs / progress bar:
     - Step 1: `t('find.step1Tab')` ("1. สภาพร่างกาย & สุขภาพ" / "1. Physical Needs & Health")
     - Step 2: `t('find.step2Tab')` ("2. ความชอบ & ไลฟ์สไตล์" / "2. Preferences & Lifestyle")
     - Step 3: `t('find.step3Tab')` ("3. วันเวลา & งบประมาณ" / "3. Schedule & Budget")
   - Shows active state (sky-500 fill, white text, soft shadow), completed steps (emerald-50 bg, emerald-700 text, checkmark), and upcoming steps.
   - Allows direct clicking to previous completed steps.

2. **`Step1Physical.jsx`**:
   - **Auto-Fill Notification**: If `elder` is present, display a welcoming info badge:
     `t('find.elderAutoFillNotice', { name: getLocalized(elder, 'name') || getLocalized(elder, 'nickname') })`
   - **Mobility Options (Single Select Radio / Card)**:
     - `independent`: `t('find.step1.mobilityIndependent')` ("เดินได้คล่องแคล่วด้วยตนเอง" / "Fully independent")
     - `cane`: `t('find.step1.mobilityWalkingCane')` ("เดินได้ช้าๆ / ใช้ไม้เท้าหรือคนช่วยพยุง" / "Slow walker / Uses cane")
     - `wheelchair_assisted`: `t('find.step1.mobilityWheelchair')` ("ใช้วีลแชร์เมื่อเดินทางไกลหรือต้องเข็นตลอดเวลา" / "Wheelchair assisted")
     - `full_assistance`: `t('find.step1.mobilityFullAssistance')` ("ต้องการการดูแลเป็นพิเศษ / เคลื่อนไหวลำบาก" / "Full assistance required")
   - **Chronic Conditions (Multi-select Chips)**:
     - `hypertension`: `t('find.step1.condHypertension')` ("ความดันโลหิตสูง")
     - `diabetes`: `t('find.step1.condDiabetes')` ("เบาหวาน")
     - `heart`: `t('find.step1.condHeart')` ("โรคหัวใจ / หลอดเลือด")
     - `knee`: `t('find.step1.condKnee')` ("ข้อเข่าเสื่อม / ปวดข้อ")
     - `dementia`: `t('find.step1.condDementia')` ("ภาวะความจำเสื่อม / อัลไซเมอร์")
     - `none`: `t('find.step1.condNone')` ("ไม่มีโรคประจำตัวร้ายแรง")
   - **Medication Assistance Toggle**:
     - Yes: `t('find.step1.medsYes')` ("ต้องการ ช่วยเตือนและเตรียมยาตามเวลา")
     - No: `t('find.step1.medsNo')` ("ไม่ต้องการ")
   - **Special Care Qualifications (Optional)**:
     - `specialCareNurse`: `t('find.step1.specialCareNurse')`
     - `specialCarePhysical`: `t('find.step1.specialCarePhysical')`
     - `specialCareNone`: `t('find.step1.specialCareNone')`

3. **`Step2Preferences.jsx`**:
   - **Activity Selection (Radio / Grid)**:
     - `hospital`: `t('find.step2.actHospital')` ("พาไปโรงพยาบาล / พบแพทย์ & รับยา")
     - `temple`: `t('find.step2.actTemple')` ("ไหว้พระทำบุญ & วันพระ")
     - `park`: `t('find.step2.actPark')` ("เดินเล่นสวนสาธารณะ & ออกกำลังกายเบาๆ")
     - `shopping`: `t('find.step2.actShopping')` ("ซื้อของใช้ & ช็อปปิ้งในห้าง")
     - `social`: `t('find.step2.actSocial')` ("ร้านอาหาร คาเฟ่ & ร่วมงานสังคม")
   - **Language / Dialect Selector**:
     - Central Thai (`t('find.step2.langThaiCentral')`)
     - Isan (`t('find.step2.langIsan')`)
     - Northern (`t('find.step2.langNorthern')`)
     - English (`t('find.step2.langEnglish')`)
     - Chinese / Teochew (`t('find.step2.langChinese')`)
   - **Religion**: Buddhism (`t('find.step2.relBuddhism')`), Christianity, Islam, Any (`t('find.step2.relAny')`).
   - **Dietary Restrictions**: Normal, Low Sodium (`t('find.step2.dietLowSodium')`), Halal, Vegetarian, No Beef.
   - **Caretaker Gender Preference**: Female (`t('find.step2.genderFemale')`), Male (`t('find.step2.genderMale')`), Any (`t('find.step2.genderAny')`).

4. **`Step3Schedule.jsx`**:
   - **Date Picker**: Input type `date` with minimum set to today (default `2026-08-28`).
   - **Time Slot Selection**: Morning (08:00 - 12:00) / Afternoon (13:00 - 17:00) / Full Day (08:00 - 16:00).
   - **Duration**: Dropdown / pill options: 2h, 3h, 4h, 6h, 8h.
   - **Hourly Budget Slider**: Range `min={300}`, `max={1000}`, `step={20}`, displaying current value formatted in THB (`฿500 / ชม.`). Hint: `t('find.step3.budgetHint')`.
   - **Pickup Address**: Pre-filled from `elder.address`, with editable text input.
   - **Destination**: Pre-filled from `elder.preferredHospital` or activity type, editable text input.
   - **Special Notes**: Pre-filled from `elder.specialNotes`, multi-line textarea or text input.
   - **Submit CTA**: Accent button `size="lg"` with `Sparkles` icon: `t('find.step3.submitBtn')` ("เริ่มค้นหาและจับคู่ด้วย AI" / "Run AI Matching Engine").

5. **`AiMatchingLoader.jsx`**:
   - **Visuals**: Full radar pulse / spinning halo in ocean blue & emerald (`animate-ping`, `animate-spin`, `Loader2` / `Sparkles`).
   - **Title**: `t('find.matchingLoader.title')` ("กำลังประมวลผล AI Matching...").
   - **Subtitle**: `t('find.matchingLoader.subtitle')` ("ระบบกำลังวิเคราะห์ข้อมูลสุขภาพ ทักษะ และตารางเวลา...").
   - **Dynamic Rotating Status Quote**:
     - At 0.0s - 1.0s: `t('find.matchingLoader.step1')` ("วิเคราะห์ความต้องการด้านร่างกายและโรคประจำตัว...")
     - At 1.0s - 2.0s: `t('find.matchingLoader.step2')` ("ตรวจสอบประวัติอาชญากรรม ใบรับรอง และตารางเวลาว่าง...")
     - At 2.0s - 2.5s: `t('find.matchingLoader.step3')` ("คำนวณคะแนนความเข้ากันได้ และคัดเลือก 3 ผู้ดูแลอันดับสูงสุด...")
     - At 2.5s: Navigates automatically via `navigate('/matches')`.

---

## 4. Test Alignment & Verification Matrix

| Test ID | Test Description | Key Expectations for M2 |
|---------|------------------|-------------------------|
| `Tier 1: 2.1` | Hero banner with gradient and main CTA | Link/Button with text matching `/ค้นหาผู้ดูแล\|Find a Caretaker/i` |
| `Tier 1: 2.2` | 4 Featured Activity Cards | Text matching `/โรงพยาบาล\|Hospital/i`, `/ไหว้พระ\|ทำบุญ\|Temple/i`, `/ท่องเที่ยว\|ชมเมือง\|City Tour\|Tour/i`, `/เดินเล่น\|สวนสาธารณะ\|พักผ่อน\|Park\|Leisure/i` |
| `Tier 1: 2.3` | Partner Hospital Promotion Strip | Text matching `/โปรโมชั่น\|สิทธิพิเศษ\|โรงพยาบาลพันธมิตร\|Promotion\|Partner/i` |
| `Tier 1: 2.4` | "How It Works" 3-step guide | Text matching `/ขั้นตอนการใช้งาน\|วิธีใช้งาน\|How it works\|3 ขั้นตอน/i` |
| `Tier 1: 2.5` | Testimonials with guardian ratings | Text matching `/เสียงตอบรับ\|รีวิวจากผู้ใช้งาน\|ความประทับใจ\|Testimonials\|Guardian/i` |
| `Tier 1: 2.6` | Hero CTA clicks through to `/find` | Lands on `/find`, shows `/ความต้องการด้านร่างกาย\|Physical Needs\|ขั้นตอนที่ 1\|Step 1/i` |
| `Tier 1: 3.1` | 3-Step Indicator on `/find` | Shows Step 1, Step 2, Step 3 tabs |
| `Tier 1: 3.2` | Step 1 selection and Next navigation | Selects mobility radio, clicks Next -> lands on Step 2 |
| `Tier 1: 3.3` | Step 2 Back navigation | Clicks Back -> returns to Step 1 |
| `Tier 1: 3.4` | Step 3 Schedule & Budget | Displays date, time, duration, and budget slider |
| `Tier 1: 3.5` | AI Matching Loader on submit | Displays `/AI กำลังค้นหา\|กำลังวิเคราะห์\|Matching\|AI is analyzing/i`, waits 2.5s -> lands on `/matches` (shows 96%) |
| `Tier 2: 3.2` | State retention on language switch | Switching TH <-> EN while on Step 2 keeps wizard on Step 2 with inputs preserved |
| `Tier 3: 3.1` | Full Golden Journey (Home -> Find -> Matches -> Profile -> Book -> Bookings) | Smooth transitions across the entire user journey |
| `Tier 3: 3.2` | Elder Profile Sync to Find Wizard | Editing name in `/elder-profile` reflects in `/find` auto-fill banner |
| `Tier 3: 3.4` | Home Activity Card click | Clicking an activity card on Home navigates to `/find` |
| `Tier 4: 1` | Scenario 1 (Hospital escort) | Wizard completion -> `/matches` -> profile -> booking |
| `Tier 4: 2` | Scenario 2 (Temple excursion) | Start from Temple card on Home -> `/find` -> Cane selection -> submit -> `/matches` |

---

## 5. Critical Technical Recommendations for Implementers

1. **Activity Card Data Consistency**:
   - In `src/data/activities.json`, ensure the activities include Hospital, Temple, Park, and Shopping/City Tour with rich bilingual titles/subtitles/descriptions matching both `ORIGINAL_REQUEST.md` and test suite regexes (`โรงพยาบาล`, `ไหว้พระ/ทำบุญ`, `เดินเล่น/สวนสาธารณะ`, `ท่องเที่ยว/ชมเมือง`).
2. **Auto-Fill from Elder Profile**:
   - In `FindCaretakerPage`, initialize `formData` by checking `elder` and `searchCriteria` so fields are immediately filled with Grandma Somporn's data (Wheelchair, Hypertension, Diabetes, Siriraj Hospital).
3. **URL Query Param Support for Quick-Start**:
   - In `FindCaretakerPage`, read `useSearchParams()` (e.g. `?activity=temple` or `?category=hospital`). If present, pre-set `formData.activityType` to that value.
4. **Language Toggle Robustness**:
   - All text rendered on Home and Find must strictly use `t()` or `getLocalized()`. Zero hardcoded bilingual slashes like `"Hospital / โรงพยาบาล"`.
5. **Accessible Labeling for Radio & Form Controls**:
   - Ensure radio options in Step 1 (Physical) and Step 2 (Preferences) have matching labels and values for accessible screen-reader and testing library queries (`getByLabelText` / `getByRole`).
6. **AiMatchingLoader Fake-Timer Compatibility**:
   - Use standard `setTimeout` chains or intervals (totalling ~2.5s) so tests using `vi.useFakeTimers()` and `vi.advanceTimersByTime(2500)` can seamlessly advance time and assert navigation to `/matches`.
