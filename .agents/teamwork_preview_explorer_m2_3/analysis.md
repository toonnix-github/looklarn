# Technical Analysis & Implementation Blueprint: Find Caretaker 3-Step Wizard & AI Matching Engine

**Milestone**: M2 (Home Page & Find Caretaker Wizard)  
**Agent**: Explorer 3 (`teamwork_preview_explorer_m2_3`)  
**Scope**: `src/pages/FindCaretakerPage.jsx`, `src/components/find/*` (`StepIndicator.jsx`, `Step1Physical.jsx`, `Step2Preferences.jsx`, `Step3Schedule.jsx`, `AiMatchingLoader.jsx`), State Management, Elder Profile Pre-filling, i18n Localization.

---

## 1. Executive Summary & Component Architecture

The **Find Caretaker Wizard** (`/find`) is the primary conversion funnel of the Looklarn platform. It allows guardians to specify care requirements across three structured steps, integrates seamlessly with the active elder profile, and concludes with an engaging 2.0–2.5 second AI matching simulation before routing to `/matches`.

### Architecture Overview
```
src/pages/FindCaretakerPage.jsx (Orchestrator)
├── Header & Title Banner (Title + Subtitle from i18n)
├── StepIndicator.jsx (3-step visual progress bar: 33% -> 66% -> 100%)
├── Card Container
│   ├── Step1Physical.jsx (Mobility, Conditions, Meds, Auto-fill Notice)
│   ├── Step2Preferences.jsx (Outing Activity, Dialect, Religion, Diet, Gender)
│   ├── Step3Schedule.jsx (Date, Time Slots, Duration, Budget Slider, Address, Notes)
│   └── Wizard Navigation Footer (Back Button, Next Button, Submit CTA)
└── AiMatchingLoader.jsx (Rendered conditionally during isMatching: true)
```

---

## 2. Component Specifications & Requirements Deep-Dive

### 2.1 StepIndicator (`src/components/find/StepIndicator.jsx`)
- **Visual Progress Bar**:
  - Continuous animated gradient track at the top (`bg-slate-200` background with `bg-gradient-to-r from-sky-500 to-emerald-500`).
  - Width calculation:
    - Step 1: `33.33%`
    - Step 2: `66.66%`
    - Step 3: `100%`
- **Step Badges (3 Tabs)**:
  - **Step 1**: `1. สภาพร่างกาย & สุขภาพ` / `1. Physical Needs & Health` (Matches regex `1|ร่างกาย|Physical|ขั้นตอนที่ 1|Step 1`)
  - **Step 2**: `2. ความชอบ & ไลฟ์สไตล์` / `2. Preferences & Lifestyle` (Matches regex `2|ความชอบ|Preferences|Language|Religion`)
  - **Step 3**: `3. วันเวลา & งบประมาณ` / `3. Schedule & Budget` (Matches regex `3|วันเวลา|Schedule|Budget`)
- **Step States**:
  - **Active**: `bg-sky-500 text-white border-sky-500 shadow-sm shadow-sky-500/25 ring-2 ring-sky-500/20`
  - **Completed**: `bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold` with checkmark icon (`CheckCircle2` / `Check`)
  - **Upcoming**: `bg-white text-slate-500 border-slate-200 hover:bg-slate-50`
- **Interactive Navigation**: Clicking on completed steps allows immediate jumping back to that step.

---

### 2.2 Step 1: Physical Needs & Health (`src/components/find/Step1Physical.jsx`)
- **Auto-Fill from Active Elder Profile**:
  - Inspects `elder` / `elderProfile` from `AppContext`.
  - When active elder data is present (e.g. Grandma Somporn), auto-fills default mobility level (`wheelchair_assisted`) and chronic conditions (`hypertension`, `diabetes_type_2`).
  - Displays a clean notice banner:
    ```jsx
    <div className="flex items-center gap-2.5 p-3.5 bg-sky-50/80 border border-sky-200/80 rounded-2xl text-xs text-sky-800">
      <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
      <span>{t('find.elderAutoFillNotice', { name: getLocalized(elder, 'name') })}</span>
    </div>
    ```
- **Mobility Selector (4 Options)**:
  1. `independent`: "เดินได้ปกติ / คล่องแคล่ว" / "Fully independent (No mobility aid needed)"
  2. `cane`: "เดินได้ช้าๆ / ใช้ไม้เท้าหรือคนช่วยพยุง" / "Slow walker / Uses cane or needs steady arm support"
  3. `wheelchair_assisted`: "ใช้วีลแชร์เมื่อเดินทางไกลหรือต้องเข็นตลอดเวลา" / "Wheelchair assisted (Needs wheelchair for outings)"
  4. `full_assistance`: "ต้องการการดูแลเป็นพิเศษ / เคลื่อนไหวลำบาก" / "Full assistance required / Limited physical mobility"
  - Card & radio button UI with accessible labels matching test regex `ใช้วีลแชร์|Wheelchair|ใช้ไม้เท้า|Cane|เดินได้ปกติ|Independent`.
- **Chronic Condition Chips (Multi-Select)**:
  - Chips:
    - `hypertension`: "ความดันโลหิตสูง" / "Hypertension (High Blood Pressure)"
    - `diabetes`: "เบาหวาน" / "Type 2 Diabetes"
    - `heart`: "โรคหัวใจ / หลอดเลือด" / "Heart / Cardiovascular Disease"
    - `dementia`: "ภาวะความจำเสื่อม / อัลไซเมอร์" / "Mild Cognitive Impairment / Dementia"
    - `knee`: "ข้อเข่าเสื่อม / ปวดข้อ" / "Knee Osteoarthritis / Joint Pain"
    - `none`: "ไม่มีโรคประจำตัวร้ายแรง" / "No major chronic conditions"
  - Selection behavior:
    - If `none` is selected, all other condition IDs are cleared.
    - If any specific condition is selected, `none` is deselected.
- **Medication Assistance Toggle**:
  - Two radio options or interactive segmented control:
    - `true`: `find.step1.medsYes` ("ต้องการ (ช่วยเตือนและเตรียมยาตามเวลา)" / "Yes (Remind & prepare scheduled doses)")
    - `false`: `find.step1.medsNo` ("ไม่ต้องการ (ทานยาเองได้หรือไม่มีมื้อยา)" / "No (Independent / No scheduled medication)")
- **Specialized Care Qualification (Optional / Caregiver Tier)**:
  - `none`: Standard Certified Companion ("ผู้ดูแลทั่วไปที่ผ่านการอบรม")
  - `nurse`: Nurse / Practical Nurse ("ต้องการพยาบาลวิชาชีพ / ผู้ช่วยพยาบาล")
  - `physical`: Physical Therapy Assistant ("ต้องการนักกายภาพบำบัดฝึกหัด / ช่วยฟื้นฟู")

---

### 2.3 Step 2: Preferences & Lifestyle (`src/components/find/Step2Preferences.jsx`)
- **Outing Activity Type**:
  - 5 interactive cards with icon, title, description, and radio input:
    1. `hospital`: "พาไปโรงพยาบาล / พบแพทย์ & รับยา" / "Hospital Escort / Doctor Visit & Pharmacy" (Icon: `Stethoscope`)
    2. `park`: "เดินเล่นสวนสาธารณะ & ออกกำลังกายเบาๆ" / "Park Stroll & Gentle Outdoor Exercise" (Icon: `Trees`)
    3. `shopping`: "ซื้อของใช้ & ช็อปปิ้งในห้าง" / "Grocery Shopping & Mall Errands" (Icon: `ShoppingBag`)
    4. `social`: "ร้านอาหาร คาเฟ่ & ร่วมงานสังคม" / "Dining Out, Cafe & Social Events" (Icon: `Coffee`)
    5. `temple`: "ไหว้พระทำบุญ & วันพระ" / "Temple Pilgrimage & Merit Making" (Icon: `Sparkles` / `Heart`)
  - **Quick-Start Pre-Selection**: Reads `location.state?.activityType` or query parameter `?activity=...`. If passed from `ActivityGrid` on Home page, automatically pre-selects the activity.
- **Language / Dialect Selector**:
  - Dropdown or grid selector:
    - `Thai`: "ภาษาไทย (กลาง)" / "Central Thai"
    - `Isan`: "ภาษาอีสาน" / "Isan Dialect (Northeastern)"
    - `Northern`: "ภาษาเหนือ (คำเมือง)" / "Northern Dialect (Lanna)"
    - `Southern`: "ภาษาใต้" / "Southern Dialect"
    - `Chinese`: "ภาษาจีน / แต้จิ๋ว" / "Mandarin / Teochew"
    - `English`: "English (ภาษาอังกฤษ)" / "English"
- **Religious Preference**:
  - `Buddhism`: "ศาสนาพุทธ (ชอบไหว้พระ/ทำบุญ)" / "Buddhism (Temple merit visits)"
  - `Christianity`: "ศาสนาคริสต์" / "Christianity"
  - `Islam`: "ศาสนาอิสลาม (ฮาลาล)" / "Islam (Halal)"
  - `Any`: "ศาสนาใดก็ได้" / "Any / Non-religious"
- **Dietary Restrictions**:
  - `normal`: "ทานอาหารทั่วไปได้" / "Standard diet"
  - `low_sodium`: "อาหารรสอ่อน / โซเดียมต่ำ / หวานน้อย" / "Low sodium / Low sugar / Soft texture"
  - `halal`: "อาหารฮาลาล" / "Halal certified"
  - `vegetarian`: "มังสวิรัติ / เจ" / "Vegetarian / Vegan"
  - `no_beef`: "ไม่ทานเนื้อวัว" / "No beef"
- **Caretaker Gender Preference**:
  - `any`: "เพศใดก็ได้" / "Any gender"
  - `female`: "ผู้หญิงเท่านั้น" / "Female companion only"
  - `male`: "ผู้ชายเท่านั้น" / "Male companion only"

---

### 2.4 Step 3: Schedule, Location & Budget (`src/components/find/Step3Schedule.jsx`)
- **Service Date Picker**:
  - `<input type="date" />` with `min={new Date().toISOString().split('T')[0]}`.
  - Form value `formData.date` (default e.g. `'2026-08-28'`).
- **Time Slot Selector Chips**:
  - `morning`: "ช่วงเช้า (08:00 - 12:00)" / "Morning (08:00 - 12:00)"
  - `afternoon`: "ช่วงบ่าย (13:00 - 17:00)" / "Afternoon (13:00 - 17:00)"
  - `evening`: "ช่วงเย็น (17:00 - 21:00)" / "Evening (17:00 - 21:00)"
  - `full_day`: "เต็มวัน (08:00 - 16:00)" / "Full Day (08:00 - 16:00)"
- **Duration Selector**:
  - Interactive pill chips (2h, 3h, 4h, 6h, 8h) with active highlight.
- **Budget Slider (฿300 - ฿1,000/hr)**:
  - Range input `<input type="range" min={300} max={1000} step={25} value={formData.budgetMax} />`.
  - Dynamic formatted value: `฿{formData.budgetMax} / {t('common.hrShort', 'ชม.')}`.
  - Price hint label: `find.step3.budgetHint` ("อัตราค่าบริการเฉลี่ย ฿300 - ฿500 / ชม." / "Average service rates range from ฿300 - ฿500 / hr").
- **Pickup & Destination Locations**:
  - Pickup location: Text input pre-populated with `elder.address.th` / `elder.address.en`.
  - Destination location: Text input with default or placeholder (e.g. `โรงพยาบาลศิริราช อาคารนวมินทรบพิตร` / `Siriraj Hospital, Navamindrapobitr Bldg`).
- **Special Instructions / Notes**:
  - Textarea with label `find.step3.notesLabel` and placeholder `find.step3.notesPlaceholder`.
- **Submit Button**:
  - Button text matches test expectations: `t('find.submitToMatches', 'ค้นหาผู้ดูแลที่เหมาะสม')` / `Find Matches`.

---

### 2.5 AI Matching Loading Animation (`src/components/find/AiMatchingLoader.jsx`)
- **Duration & Timing**:
  - Total simulation duration: 2,500ms (2.5 seconds).
  - Phase 1 (0ms - 800ms): `find.matchingLoader.step1` ("วิเคราะห์ความต้องการด้านร่างกายและโรคประจำตัว..." / "Analyzing mobility constraints and health requirements...")
  - Phase 2 (800ms - 1700ms): `find.matchingLoader.step2` ("ตรวจสอบประวัติอาชญากรรม ใบรับรอง และตารางเวลาว่าง..." / "Checking criminal records, credentials, and schedule availability...")
  - Phase 3 (1700ms - 2500ms): `find.matchingLoader.step3` ("คำนวณคะแนนความเข้ากันได้ และคัดเลือก 3 ผู้ดูแลอันดับสูงสุด..." / "Computing compatibility index and ranking top 3 companions...")
  - At 2500ms: executes `onComplete()` callback -> `navigate('/matches')`.
- **Visual Presentation**:
  - Pulsing outer halo (`animate-ping opacity-20 bg-sky-400 rounded-full`).
  - Rotating gradient circular ring (`animate-spin border-4 border-sky-500 border-t-transparent rounded-full`).
  - Center badge with `Sparkles` icon and soft glow.
  - Headline matching test query: `AI กำลังค้นหาผู้ดูแลที่เหมาะสม...` / `AI Matching in Progress...` (Matches regex `AI กำลังค้นหา|กำลังวิเคราะห์|Matching|AI is analyzing`).
  - Animated progress bar transitioning smoothly from 0% to 100%.

---

## 3. State Management, Pre-Filling & Validation Flow

### 3.1 Form State Data Structure
```javascript
const initialFormData = {
  mobility: searchCriteria?.mobility || elder?.mobilityLevel || 'wheelchair_assisted',
  conditions: searchCriteria?.conditions || elder?.medicalConditions || ['hypertension', 'diabetes_type_2'],
  needsMedicationReminder: searchCriteria?.needsMedicationReminder ?? true,
  specialCareType: searchCriteria?.specialCareType || 'none',
  activityType: searchCriteria?.activityType || 'hospital',
  language: searchCriteria?.language || 'Thai',
  religion: searchCriteria?.religion || 'Buddhism',
  dietary: searchCriteria?.dietary || 'low_sodium',
  genderPref: searchCriteria?.genderPref || 'any',
  date: searchCriteria?.date || '2026-08-28',
  timeSlot: searchCriteria?.timeSlot || 'morning',
  durationHours: searchCriteria?.durationHours || 4,
  budgetMax: searchCriteria?.budgetMax || 500,
  pickupAddress: searchCriteria?.pickupAddress || (typeof elder?.address === 'object' ? elder.address.th : elder?.address) || '',
  destination: searchCriteria?.destination || 'โรงพยาบาลศิริราช อาคารนวมินทรบพิตร',
  notes: searchCriteria?.specialNotes || '',
};
```

### 3.2 Step Transitions & Context Syncing
1. **Language Retention**: When the user switches between `TH` and `EN` at any step, the form values and `currentStep` index are preserved without resetting.
2. **Context Persistence**: Moving between steps and final submission calls `updateSearchCriteria(formData)` in `AppContext`.
3. **Validation Rules**:
   - Step 1: `mobility` must be a valid non-empty string.
   - Step 2: `activityType` must be a valid selected activity.
   - Step 3: `date` must not be empty, `budgetMax` must be >= 300.

---

## 4. Complete Bilingual (TH / EN) i18n Translation Key Dictionary

Below is the verified, 100% key-parity translation dictionary for the entire `find` namespace in `src/i18n/th.js` and `src/i18n/en.js`.

### Thai Dictionary (`src/i18n/th.js`)
```javascript
find: {
  pageTitle: "ค้นหาผู้ดูแลที่เหมาะสม (AI Matching)",
  stepDescription: "กรอกความต้องการด้านสุขภาพ ความชอบ และตารางเวลาเพื่อให้อัลกอริทึมคัดสรรผู้ดูแลที่ดีที่สุด",
  submitToMatches: "ค้นหาผู้ดูแลที่เหมาะสม",
  title: "ค้นหาผู้ดูแลที่ตรงใจ (AI Matching)",
  subtitle: "ตอบคำถามเพียง 3 ขั้นตอน เพื่อให้ระบบ AI จับคู่ผู้ดูแลที่มีทักษะและบุคลิกตรงกับความต้องการของคุณมากที่สุด",
  step1Tab: "1. สภาพร่างกาย & สุขภาพ",
  step2Tab: "2. ความชอบ & ไลฟ์สไตล์",
  step3Tab: "3. วันเวลา & งบประมาณ",
  elderAutoFillNotice: "ระบบได้ดึงข้อมูลสุขภาพจากโปรไฟล์ของ \"{name}\" ให้โดยอัตโนมัติ",
  step1: {
    title: "ข้อมูลสภาพร่างกายและความต้องการด้านสุขภาพ",
    desc: "ระบุระดับความสามารถในการเคลื่อนไหวและโรคประจำตัวของผู้สูงอายุ",
    mobilityLabel: "ระดับการเคลื่อนไหวของผู้สูงอายุ",
    mobilityIndependent: "เดินได้ปกติ / คล่องแคล่ว (ไม่ต้องใช้อุปกรณ์)",
    mobilityWalkingCane: "เดินได้ช้าๆ / ใช้ไม้เท้าหรือคนช่วยพยุง",
    mobilityWheelchair: "ใช้วีลแชร์เมื่อเดินทางไกลหรือต้องเข็นตลอดเวลา",
    mobilityFullAssistance: "ต้องการการดูแลเป็นพิเศษ / เคลื่อนไหวลำบาก",
    conditionsLabel: "โรคประจำตัวหรือข้อจำกัดด้านสุขภาพ (เลือกได้หลายข้อ)",
    condHypertension: "ความดันโลหิตสูง",
    condDiabetes: "เบาหวาน",
    condHeart: "โรคหัวใจ / หลอดเลือด",
    condDementia: "ภาวะความจำเสื่อม / อัลไซเมอร์",
    condKnee: "ข้อเข่าเสื่อม / ปวดข้อ",
    condNone: "ไม่มีโรคประจำตัวร้ายแรง",
    medsLabel: "ต้องการให้ผู้ดูแลช่วยเตือนหรือจัดการทานยาหรือไม่?",
    medsYes: "ต้องการ (ช่วยเตือนและเตรียมยาตามเวลา)",
    medsNo: "ไม่ต้องการ (ทานยาเองได้หรือไม่มีมื้อยา)",
    specialCareLabel: "ทักษะการดูแลพิเศษที่ต้องการ",
    specialCareNurse: "ต้องการพยาบาลวิชาชีพ / ผู้ช่วยพยาบาล",
    specialCarePhysical: "ต้องการนักกายภาพบำบัดฝึกหัด / ช่วยฟื้นฟู",
    specialCareNone: "ผู้ดูแลทั่วไปที่ผ่านการอบรม"
  },
  step2: {
    title: "ความชอบและไลฟ์สไตล์ที่ต้องการ",
    desc: "เลือกประเภทกิจกรรม ภาษา และความชอบส่วนบุคคลเพื่อให้เข้ากันได้อย่างดีเยี่ยม",
    activityLabel: "ประเภทกิจกรรมหลักที่ต้องการรับบริการ",
    actHospital: "พาไปโรงพยาบาล / พบแพทย์ & รับยา",
    actPark: "เดินเล่นสวนสาธารณะ & ออกกำลังกายเบาๆ",
    actShopping: "ซื้อของใช้ & ช็อปปิ้งในห้าง",
    actSocial: "ร้านอาหาร คาเฟ่ & ร่วมงานสังคม",
    actTemple: "ไหว้พระทำบุญ & วันพระ",
    langPrefLabel: "ภาษาหรือสำเนียงที่ต้องการให้สื่อสาร",
    langThaiCentral: "ภาษาไทย (กลาง)",
    langIsan: "ภาษาอีสาน",
    langNorthern: "ภาษาเหนือ (คำเมือง)",
    langSouthern: "ภาษาใต้",
    langEnglish: "English (ภาษาอังกฤษ)",
    langChinese: "ภาษาจีน / แต้จิ๋ว",
    religionLabel: "ความต้องการด้านศาสนา / กิจกรรมทางศาสนา",
    relBuddhism: "ศาสนาพุทธ (ชอบไหว้พระ/ทำบุญ)",
    relChristianity: "ศาสนาคริสต์",
    relIslam: "ศาสนาอิสลาม (ฮาลาล)",
    relAny: "ศาสนาใดก็ได้",
    dietLabel: "ข้อจำกัดและความชอบด้านอาหาร",
    dietNormal: "ทานอาหารทั่วไปได้",
    dietLowSodium: "อาหารรสอ่อน / โซเดียมต่ำ / หวานน้อย",
    dietHalal: "อาหารฮาลาล",
    dietVegetarian: "มังสวิรัติ / เจ",
    dietNoBeef: "ไม่ทานเนื้อวัว",
    genderPrefLabel: "เพศของผู้ดูแลที่ต้องการ",
    genderFemale: "ผู้หญิงเท่านั้น",
    genderMale: "ผู้ชายเท่านั้น",
    genderAny: "เพศใดก็ได้"
  },
  step3: {
    title: "วัน เวลา และงบประมาณ",
    desc: "กำหนดวันที่ ระยะเวลานัดหมาย และช่วงงบประมาณที่เหมาะสม",
    dateLabel: "วันที่ต้องการรับบริการ",
    timeSlotLabel: "ช่วงเวลาที่ต้องการ",
    timeMorning: "ช่วงเช้า (08:00 - 12:00)",
    timeAfternoon: "ช่วงบ่าย (13:00 - 17:00)",
    timeEvening: "ช่วงเย็น (17:00 - 21:00)",
    timeFullDay: "เต็มวัน (08:00 - 16:00)",
    durationLabel: "ระยะเวลาที่ต้องการรับบริการ (ชั่วโมง)",
    budgetLabel: "งบประมาณสูงสุดต่อชั่วโมง (บาท/ชม.)",
    budgetHint: "อัตราค่าบริการเฉลี่ย ฿300 - ฿500 / ชม.",
    pickupAddressLabel: "สถานที่รับ-ส่ง (จุดเริ่มต้น)",
    pickupAddressPlaceholder: "เช่น 128/4 ซอยสุขุมวิท 39 เขตวัฒนา กรุงเทพฯ",
    destinationLabel: "สถานที่ปลายทาง / โรงพยาบาล",
    destinationPlaceholder: "เช่น โรงพยาบาลศิริราช อาคารนวมินทรบพิตร",
    notesLabel: "หมายเหตุเพิ่มเติมสำหรับผู้ดูแล",
    notesPlaceholder: "ระบุความต้องการเพิ่มเติม เช่น คุณยายเดินช้า, มีรถเข็นส่วนตัว, ต้องการคนช่วยยกของ...",
    submitBtn: "เริ่มค้นหาและจับคู่ด้วย AI"
  },
  matchingLoader: {
    title: "AI กำลังค้นหาผู้ดูแลที่เหมาะสม...",
    subtitle: "ระบบกำลังวิเคราะห์ข้อมูลสุขภาพ ทักษะ และตารางเวลาเพื่อค้นหาผู้ดูแลที่ตรงใจที่สุด",
    step1: "วิเคราะห์ความต้องการด้านร่างกายและโรคประจำตัว...",
    step2: "ตรวจสอบประวัติอาชญากรรม ใบรับรอง และตารางเวลาว่าง...",
    step3: "คำนวณคะแนนความเข้ากันได้ และคัดเลือก 3 ผู้ดูแลอันดับสูงสุด..."
  }
}
```

### English Dictionary (`src/i18n/en.js`)
```javascript
find: {
  pageTitle: "Find Your Ideal Caretaker (AI Matching)",
  stepDescription: "Complete our quick 3-step questionnaire to match with certified companions tailored to your exact physical and personal needs.",
  submitToMatches: "Find Matches",
  title: "Find Your Ideal Caretaker (AI Matching)",
  subtitle: "Complete our quick 3-step questionnaire to match with certified companions tailored to your exact physical and personal needs.",
  step1Tab: "1. Physical Needs & Health",
  step2Tab: "2. Preferences & Lifestyle",
  step3Tab: "3. Schedule & Budget",
  elderAutoFillNotice: "Health details have been automatically filled from \"{name}\"'s profile.",
  step1: {
    title: "Physical Capabilities & Health Conditions",
    desc: "Specify mobility assistance requirements and chronic medical conditions.",
    mobilityLabel: "Elder's Mobility Level",
    mobilityIndependent: "Independent walking (No mobility aid needed)",
    mobilityWalkingCane: "Slow walker / Uses cane or needs steady arm support",
    mobilityWheelchair: "Wheelchair assisted (Needs wheelchair for outings)",
    mobilityFullAssistance: "Full assistance required / Limited physical mobility",
    conditionsLabel: "Medical Conditions or Health Considerations (Multi-select)",
    condHypertension: "Hypertension (High Blood Pressure)",
    condDiabetes: "Type 2 Diabetes",
    condHeart: "Heart / Cardiovascular Disease",
    condDementia: "Mild Cognitive Impairment / Dementia",
    condKnee: "Knee Osteoarthritis / Joint Pain",
    condNone: "No major chronic conditions",
    medsLabel: "Do you require medication reminders / assistance?",
    medsYes: "Yes (Remind & prepare scheduled doses)",
    medsNo: "No (Independent / No scheduled medication)",
    specialCareLabel: "Specialized Care Qualification Needed",
    specialCareNurse: "Requires Practical or Registered Nurse (RN/PN)",
    specialCarePhysical: "Requires Physical Therapy Assistant / Mobility Rehab",
    specialCareNone: "Standard Certified Companion"
  },
  step2: {
    title: "Personal Preferences & Outing Style",
    desc: "Choose the primary activity type, language dialect, and dietary preferences.",
    activityLabel: "Primary Outing Activity",
    actHospital: "Hospital Escort / Doctor Visit & Pharmacy",
    actPark: "Park Stroll & Gentle Outdoor Exercise",
    actShopping: "Grocery Shopping & Mall Errands",
    actSocial: "Dining Out, Cafe & Social Events",
    actTemple: "Temple Pilgrimage & Merit Making",
    langPrefLabel: "Preferred Language / Thai Dialect",
    langThaiCentral: "Central Thai",
    langIsan: "Isan Dialect (Northeastern)",
    langNorthern: "Northern Dialect (Lanna)",
    langSouthern: "Southern Dialect",
    langEnglish: "English",
    langChinese: "Mandarin / Teochew",
    religionLabel: "Religious Preference / Spiritual Needs",
    relBuddhism: "Buddhism (Temple merit visits)",
    relChristianity: "Christianity",
    relIslam: "Islam (Halal)",
    relAny: "Any / Non-religious",
    dietLabel: "Dietary Restrictions & Preferences",
    dietNormal: "Standard diet",
    dietLowSodium: "Low sodium / Low sugar / Soft texture",
    dietHalal: "Halal certified",
    dietVegetarian: "Vegetarian / Vegan",
    dietNoBeef: "No beef",
    genderPrefLabel: "Preferred Caretaker Gender",
    genderFemale: "Female companion only",
    genderMale: "Male companion only",
    genderAny: "Any gender"
  },
  step3: {
    title: "Schedule, Location & Budget",
    desc: "Set the appointment date, duration, pickup location, and budget range.",
    dateLabel: "Service Date",
    timeSlotLabel: "Preferred Time Slot",
    timeMorning: "Morning (08:00 - 12:00)",
    timeAfternoon: "Afternoon (13:00 - 17:00)",
    timeEvening: "Evening (17:00 - 21:00)",
    timeFullDay: "Full Day (08:00 - 16:00)",
    durationLabel: "Expected Duration (Hours)",
    budgetLabel: "Maximum Hourly Budget (THB / hr)",
    budgetHint: "Average service rates range from ฿300 - ฿500 / hr",
    pickupAddressLabel: "Pickup Location (Starting Point)",
    pickupAddressPlaceholder: "e.g., 128/4 Sukhumvit 39, Watthana, Bangkok",
    destinationLabel: "Destination / Hospital",
    destinationPlaceholder: "e.g., Siriraj Hospital, Navamindrapobitr Bldg",
    notesLabel: "Special Instructions for Caretaker",
    notesPlaceholder: "e.g., Mom walks slowly, personal wheelchair provided, please bring warm water...",
    submitBtn: "Run AI Matching Engine"
  },
  matchingLoader: {
    title: "AI Matching in Progress...",
    subtitle: "Analyzing medical needs, verified certifications, language compatibility, and real-time schedules...",
    step1: "Analyzing mobility constraints and health requirements...",
    step2: "Checking criminal records, credentials, and schedule availability...",
    step3: "Computing compatibility index and ranking top 3 companions..."
  }
}
```

---

## 5. Test Verification Matrix & Regex Compatibility

To ensure 100% test passing across the test suite, the following DOM patterns must be honored:

| Test Reference | Test Query Pattern | Required Component Output |
|---|---|---|
| `e2e_tier1 3.1` | `screen.getByText(/1\|ร่างกาย\|Physical/i)` | Step 1 Badge in `StepIndicator` contains step number and label |
| `e2e_tier1 3.1` | `screen.getByText(/2\|ความชอบ\|Preferences/i)` | Step 2 Badge in `StepIndicator` contains step number and label |
| `e2e_tier1 3.1` | `screen.getByText(/3\|วันเวลา\|Schedule/i)` | Step 3 Badge in `StepIndicator` contains step number and label |
| `e2e_tier1 3.2` | `screen.getByLabelText(/ใช้วีลแชร์\|Wheelchair\|ใช้ไม้เท้า\|Cane\|เดินได้ปกติ\|Independent/i)` | Radio input in `Step1Physical` associated with labeled text |
| `e2e_tier1 3.2` | `screen.getByRole('button', { name: /ถัดไป\|Next\|ต่อไป/i })` | Navigation "Next" button in footer |
| `e2e_tier1 3.3` | `screen.getByRole('button', { name: /ย้อนกลับ\|Back\|ก่อนหน้า/i })` | Navigation "Back" button in footer |
| `e2e_tier1 3.4` | `screen.getByText(/วันและเวลา\|งบประมาณ\|Schedule\|Budget\|ระยะเวลา\|Duration/i)` | Step 3 card headers and input labels |
| `e2e_tier1 3.5` | `screen.getByRole('button', { name: /ค้นหาผู้ดูแลที่เหมาะสม\|จับคู่ AI\|Find Matches\|Match Now/i })` | Submission CTA button |
| `e2e_tier1 3.5` | `screen.getByText(/AI กำลังค้นหา\|กำลังวิเคราะห์\|Matching\|AI is analyzing/i)` | `AiMatchingLoader` title and quote badge |
| `e2e_tier2 3.2` | Retains form input and step when switching TH/EN | Form state preserved across language toggles |
| `e2e_tier3 3.1` | Elder profile update auto-fills in `/find` | `elderProfile` fields automatically populate default form data |
| `e2e_tier3 3.4` | Click activity card on `/` -> navigate to `/find` | Activity type pre-selected from state / search query |
| `e2e_tier4 S1` | Wheelchair -> Hospital -> Morning 4h -> Match (2.5s) -> `/matches` | Complete end-to-end flow execution |
| `e2e_tier4 S2` | Temple quick-start -> Cane -> Match -> `/matches` | Secondary scenario flow execution |

---

## 6. Implementation File Plan for Sub-Orchestrator M2

When the implementer proceeds, the files to create and edit are:
1. `src/components/find/StepIndicator.jsx` (New)
2. `src/components/find/Step1Physical.jsx` (New)
3. `src/components/find/Step2Preferences.jsx` (New)
4. `src/components/find/Step3Schedule.jsx` (New)
5. `src/components/find/AiMatchingLoader.jsx` (New)
6. `src/pages/FindCaretakerPage.jsx` (Refactored to modularly orchestrate components)
7. `src/i18n/th.js` and `src/i18n/en.js` (Updated with complete key parity)

This modular approach ensures maintainability, clean separation of concerns, and full compliance with all project test tiers.
