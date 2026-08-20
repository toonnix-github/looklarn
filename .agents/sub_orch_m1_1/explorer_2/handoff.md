# Handoff Report: i18n Architecture, Mock Datasets & AppContext State Design

**Author**: Explorer 2 (i18n, Mock Data, AppContext) — Milestone M1  
**Target Milestone**: M1 (Scaffolding, Design Tokens, i18n & Shared UI Kit)  
**Target App**: Looklarn (ลูกหลาน) — AI-Powered Elder Care Companion Matching Platform  
**Working Directory**: `d:/SDISMAN/Projects/Looklarn/.agents/sub_orch_m1_1/explorer_2`

---

## 1. Observation

Direct observations extracted from authoritative project requirements and design specifications:

1. **Authoritative Specifications Examined**:
   - `ORIGINAL_REQUEST.md` (lines 13–78):
     - **R1 (7 Pages)**: `/` (Home), `/find` (Find Caretaker 3-step form), `/matches` (Match Results with 96%, 88%, 81% circular score rings), `/caretaker/:id` (Profile Detail), `/book/:id` (Booking & Checkout), `/bookings` (My Bookings Upcoming/Past tabs), `/elder-profile` (Elder Profile Editor).
     - **R2 (Design Tokens)**: Ocean Blue `#0EA5E9`, Emerald Green `#10B981`, Ice Blue `#F0F9FF`, Dark Navy `#0F172A`, Google Font `Sarabun`.
     - **R3 (Language Toggle)**: Single-language rendering with `TH | EN` pill toggle in navbar. Default language Thai (`th`). Separate translation dictionaries in `th.js` and `en.js`. Zero mixed-language labels.
     - **R4 (Mock Data)**: 5 Caretakers, 3 Bookings (2 upcoming, 1 past), 4 Featured Activities, 1 Elder Profile (Grandma Somporn, 74).
   - `PROJECT.md` (lines 5–171):
     - Complete feature inventory, interface contracts for `useLanguage()` and `useApp()`, code layout under `src/i18n/`, `src/context/`, `src/data/`.
   - `SCOPE.md` (lines 1–41):
     - M1 deliverables: `th.js`, `en.js`, `index.js`, `LanguageContext.jsx`, `caretakers.json`, `bookings.json`, `activities.json`, `elder.json`, `AppContext.jsx`.
   - `docs/matching_flow.md` (lines 9–46):
     - Matching attributes: mobility, conditions, medication, language, religion, diet, activity, schedule, budget. Top 3 mock scores (96%, 88%, 81%).
   - `docs/design_decisions.md` (lines 7–43):
     - No dual-language mixed strings (e.g., `"Hospital Visit / ไปโรงพยาบาล"` is strictly forbidden).

2. **Gaps & Architecture Needs Identified**:
   - Every single text string displayed across all 7 pages, shared layout (Navbar, Footer, LanguageToggle), modals, cards, badges, and forms must have an exact 1:1 key entry in both `src/i18n/th.js` and `src/i18n/en.js`.
   - Mock data (`caretakers.json`, `bookings.json`, `activities.json`, `elder.json`) must store structured bilingual fields (either paired keys `_th`/`_en` or nested objects `{ th, en }`) so that helper functions like `getLocalized(item, field)` can seamlessly resolve localized text without conditional clutter in page components.
   - `LanguageContext` must support dot-notation path traversal (e.g. `t('home.hero.title')`) and token interpolation (e.g. `t('matches.matchScoreBadge', { score: 96 })`).
   - `AppContext` must maintain reactive state for the active elder profile, user bookings (with `addBooking`, `cancelBooking`, and `addReview`), and search criteria across wizard transitions.

---

## 2. Logic Chain

From the observations above, we establish the concrete architectural specifications, file structures, schemas, and complete code designs.

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         Application Shell & Router                       │
└──────────────────────────────────────────────────────────────────────────┘
                                     │
      ┌──────────────────────────────┴──────────────────────────────┐
      ▼                                                             ▼
┌──────────────────────────────┐              ┌──────────────────────────────┐
│       LanguageContext        │              │          AppContext          │
├──────────────────────────────┤              ├──────────────────────────────┤
│ - lang: 'th' | 'en' (def TH) │              │ - elder (from elder.json)    │
│ - toggleLanguage()           │              │ - updateElderProfile()       │
│ - t(keyPath, params)         │              │ - bookings (from bookings.j) │
│ - getLocalized(item, field)  │              │ - addBooking(), cancel()     │
├──────────────────────────────┤              │ - searchCriteria & update()  │
│ Dictionaries:                │              │ - caretakers, activities     │
│   src/i18n/th.js             │              └──────────────────────────────┘
│   src/i18n/en.js             │
│   src/i18n/index.js          │
└──────────────────────────────┘
```

---

### 2.1 i18n Architecture Specifications

#### A. Dictionary Taxonomy Breakdown
The i18n taxonomy is structured hierarchically into 9 key namespaces:
1. `nav`: Navigation links, logo, safety trust badge, language toggle text.
2. `common`: Global UI labels, buttons (Book Now, View Profile, Back, Next, Save, Cancel), units (hours, ฿/hr, baht), status tags, rating text.
3. `home`: Hero section, trust statistics counters, 4 featured activities, hospital promo banner, 3-step explainer, testimonials, call-to-action banner.
4. `find`: 3-step AI matching wizard (Physical health, Preferences & lifestyle, Schedule & budget), form options, placeholders, 2.0s AI matching animation status phrases.
5. `matches`: Match results header, top 3 circular score rings (96%, 88%, 81%), "Best Match" badge, specialty chips, match reason breakdown.
6. `caretaker`: Profile hero wave banner, verification badges (Criminal background check, CPR/First aid, Practical nurse, Academy certified), stats, bio, specialty tags, service areas, availability schedule, reviews list, sticky bottom booking bar.
7. `book`: Booking checkout summary (elder, caretaker, schedule, location), price calculation breakdown (hourly rate × duration, safety insurance fee, promo discount), payment options (PromptPay QR, Credit/Debit card, Cash), confirmation action, booking success modal.
8. `bookings`: My bookings tabs (Upcoming [2], Past [1]), booking cards, cancel modal, review submission modal with 5-star selector.
9. `elderProfile`: Elder profile editor form (Photo, Name, Age, Mobility radio selector, Chronic health checkboxes, Medication schedule, Dietary preferences, Emergency guardian contacts), save confirmation toast.
10. `footer`: Brand tagline, emergency assistance hotline (24h), quick links, services list, copyright.

---

### 2.2 Complete Implementation Files for i18n

#### File 1: `src/i18n/th.js`
```javascript
export const th = {
  nav: {
    brandName: "Looklarn",
    brandSubtitle: "ลูกหลาน",
    tagline: "ผู้ช่วยดูแลผู้สูงอายุที่คุณวางใจ",
    home: "หน้าแรก",
    findCaretaker: "ค้นหาผู้ดูแล",
    myBookings: "การจองของฉัน",
    elderProfile: "ข้อมูลผู้สูงอายุ",
    contact: "ติดต่อสอบถาม",
    badgeVerified: "ผู้ดูแลผ่านการตรวจสอบ 100%",
    langToggleLabel: "เปลี่ยนภาษา"
  },
  common: {
    hours: "ชั่วโมง",
    hrShort: "ชม.",
    perHour: "บาท / ชม.",
    baht: "บาท",
    bookNow: "จองทันที",
    bookThisCaretaker: "จองผู้ดูแลท่านนี้",
    viewProfile: "ดูประวัติผู้ดูแล",
    back: "ย้อนกลับ",
    next: "ถัดไป",
    save: "บันทึกข้อมูล",
    cancel: "ยกเลิก",
    confirm: "ยืนยัน",
    edit: "แก้ไข",
    delete: "ลบ",
    close: "ปิด",
    all: "ทั้งหมด",
    rating: "คะแนนรีวิว",
    reviewsCount: "({count} รีวิว)",
    matchScore: "ความเข้ากันได้",
    bestMatch: "แมตช์ดีที่สุดอันดับ 1",
    verified: "ตรวจสอบประวัติแล้ว",
    statusUpcoming: "กำลังจะมาถึง",
    statusCompleted: "เสร็จสิ้นแล้ว",
    statusCancelled: "ยกเลิกแล้ว",
    selectDate: "เลือกวันที่",
    selectTime: "เลือกช่วงเวลา",
    phoneNumber: "เบอร์โทรศัพท์",
    address: "ที่อยู่",
    age: "อายุ",
    yearsOld: "ปี",
    female: "หญิง",
    male: "ชาย",
    notSpecified: "ไม่ระบุ",
    saving: "กำลังบันทึก...",
    success: "สำเร็จ",
    error: "เกิดข้อผิดพลาด"
  },
  home: {
    hero: {
      badge: "AI-Powered Elder Companion Matching",
      title: "ให้ \"ลูกหลาน\" ดูแลคนที่คุณรัก ในทุกช่วงเวลาสำคัญ",
      subtitle: "บริการจับคู่ผู้ดูแลมืออาชีพที่ผ่านการตรวจสอบประวัติ พาผู้สูงอายุไปโรงพยาบาล ไหว้พระ หรือท่องเที่ยวพักผ่อนอย่างอบอุ่นใจ เสมือนมีลูกหลานอยู่เคียงข้าง",
      ctaPrimary: "ค้นหาผู้ดูแลด้วย AI",
      ctaSecondary: "ดูบริการทั้งหมด",
      trustBadge1: "ตรวจสอบประวัติ 100%",
      trustBadge2: "ผ่านการอบรมปฐมพยาบาล",
      trustBadge3: "ประกันอุบัติเหตุคุ้มครองทุกทริป",
      trustScore: "คะแนนความพึงพอใจ 4.95/5 จากกว่า 1,200 ครอบครัว"
    },
    stats: {
      caregiversCount: "500+",
      caregiversLabel: "ผู้ดูแลผ่านการตรวจสอบ",
      familiesCount: "1,200+",
      familiesLabel: "ครอบครัวไว้วางใจ",
      matchAccuracyCount: "98%",
      matchAccuracyLabel: "ความแม่นยำ AI Matching",
      safetyScoreCount: "100%",
      safetyScoreLabel: "มาตรฐานความปลอดภัย"
    },
    activities: {
      tag: "กิจกรรมยอดนิยม",
      title: "เลือกกิจกรรมที่เหมาะกับคนที่คุณรัก",
      subtitle: "ครอบคลุมทุกความต้องการ ทั้งการดูแลสุขภาพ นันทนาการ และงานสังคม",
      viewAll: "ดูกิจกรรมทั้งหมด"
    },
    promo: {
      badge: "สิทธิพิเศษสมาชิกใหม่",
      title: "ส่วนลดพิเศษเมื่อนัดหมายไปโรงพยาบาลพันธมิตร",
      desc: "รับส่วนลด 150 บาท สำหรับการนัดหมายพาผู้สูงอายุไปโรงพยาบาลศิริราช, รพ.จุฬาลงกรณ์ หรือ รพ.รามาธิบดี ครั้งแรก",
      codeLabel: "โค้ดส่วนลด:",
      code: "LOOKLARNCARE",
      copyCode: "คัดลอกโค้ด",
      codeCopied: "คัดลอกโค้ดแล้ว!",
      partnerHospitals: "โรงพยาบาลพันธมิตร: รพ.ศิริราช • รพ.จุฬาลงกรณ์ • รพ.รามาธิบดี • รพ.พระมงกุฎเกล้า"
    },
    howItWorks: {
      tag: "ขั้นตอนการใช้งาน",
      title: "3 ขั้นตอนง่ายๆ เพื่อการดูแลที่สมบูรณ์แบบ",
      subtitle: "จับคู่ผู้ดูแลที่ตรงใจได้ภายในไม่กี่นาที ด้วยระบบ AI อัจฉริยะ",
      step1Num: "01",
      step1Title: "ระบุความต้องการและสุขภาพ",
      step1Desc: "กรอกข้อมูลความต้องการด้านร่างกาย การเคลื่อนไหว โรคประจำตัว และกิจกรรมที่ต้องการให้พาไป",
      step2Num: "02",
      step2Title: "AI คัดเลือกผู้ดูแลที่เหมาะสมที่สุด",
      step2Desc: "ระบบประมวลผลทักษะ ภาษา และความชำนาญ คัดเลือกผู้ดูแลคะแนนความเข้ากันได้สูงสุด 3 ท่าน",
      step3Num: "03",
      step3Title: "ยืนยันการจองและติดตามแบบเรียลไทม์",
      step3Desc: "จองและชำระเงินอย่างปลอดภัย พร้อมรับรายงานการดูแลและภาพถ่ายกิจกรรมตลอดทริป"
    },
    testimonials: {
      tag: "เสียงตอบรับจากผู้ใช้บริการ",
      title: "ครอบครัวผู้ใช้บริการพูดถึงเราอย่างไร",
      subtitle: "ความประทับใจจริงจากบุตรหลานที่มอบความไว้วางใจให้ Looklarn ดูแลคนที่รัก",
      t1Text: "ประทับใจคุณสมชายมากครับ พาคุณแม่ไป รพ.ศิริราช แทนผมในวันที่ติดประชุมสำคัญ คอยรายงานอัปเดตตลอดเวลา คุณแม่ชมไม่หยุดเลยครับ",
      t1Author: "คุณธนกร ใจดี",
      t1Role: "บุตรชาย (ผู้บริหารบริษัทเอกชน)",
      t2Text: "หาคนพาคุณยายไปไหว้พระวัดอรุณยากมากจนมาเจอลูกหลาน น้องนิภาพรใจเย็น ช่วยพยุงดูแลเรื่องแดดและน้ำดื่มดีมาก แนะนำทุกคนเลยค่ะ",
      t2Author: "พญ. วรรณภา สิทธิพงศ์",
      t2Role: "บุตรสาว (แพทย์หญิง)",
      t3Text: "น้องพลอยน่ารักมาก พาคุณพ่อเดินเล่นสวนลุมพินีอย่างทะนุถนอม คอยชวนคุยจนคุณพ่ออารมณ์ดีขึ้นมาก ขอบคุณทีมงานลูกหลานจริงๆ ครับ",
      t3Author: "คุณกิตติศักดิ์ วรเดช",
      t3Role: "บุตรชาย (ข้าราชการ)"
    },
    ctaBanner: {
      title: "พร้อมมอบความสุขและความอบอุ่นใจให้ผู้สูงอายุของคุณแล้วหรือยัง?",
      subtitle: "เริ่มต้นจับคู่ผู้ดูแลที่ตรงใจกับ Looklarn วันนี้ ไม่มีข้อผูกมัด จองง่ายใน 3 นาที",
      button: "เริ่มค้นหาผู้ดูแลทันที"
    }
  },
  find: {
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
      mobilityIndependent: "เดินได้คล่องแคล่วด้วยตนเอง (ไม่ต้องใช้อุปกรณ์)",
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
      title: "กำลังประมวลผล AI Matching...",
      subtitle: "ระบบกำลังวิเคราะห์ข้อมูลสุขภาพ ทักษะ และตารางเวลาเพื่อค้นหาผู้ดูแลที่ตรงใจที่สุด",
      step1: "วิเคราะห์ความต้องการด้านร่างกายและโรคประจำตัว...",
      step2: "ตรวจสอบประวัติอาชญากรรม ใบรับรอง และตารางเวลาว่าง...",
      step3: "คำนวณคะแนนความเข้ากันได้ และคัดเลือก 3 ผู้ดูแลอันดับสูงสุด..."
    }
  },
  matches: {
    badge: "AI Matching Completed",
    title: "ผลการจับคู่ผู้ดูแลที่เหมาะสมที่สุด",
    subtitle: "ระบบ Looklarn AI คัดเลือก 3 ผู้ดูแลที่มีคะแนนความเข้ากันได้สูงสุดตามความต้องการของคุณ",
    summaryPill: "ผลลัพธ์สำหรับ: {activity} • วันที่ {date} • งบประมาณไม่เกิน ฿{budget}/ชม.",
    refineBtn: "ปรับแต่งเงื่อนไขการค้นหา",
    sortByLabel: "เรียงตาม:",
    sortMatchScore: "คะแนนความเข้ากันได้ (สูงสุด)",
    sortPriceLow: "ราคา (ต่ำไปสูง)",
    sortRating: "คะแนนรีวิว (สูงสุด)",
    bestMatchBadge: "★ แมตช์ดีที่สุด 96%",
    matchScoreLabel: "คะแนนความเข้ากันได้",
    verifiedBadge: "ผ่านการตรวจสอบประวัติ",
    hourlyRateText: "฿{rate} / ชม.",
    viewProfileBtn: "ดูประวัติแบบละเอียด",
    bookNowBtn: "จองผู้ดูแลท่านนี้",
    whyMatchTitle: "จุดเด่นที่ตรงกับคุณ:",
    specialtyTagsTitle: "ความเชี่ยวชาญ:",
    experienceText: "ประสบการณ์ {years} ปี",
    completedTripsText: "ดูแลสำเร็จ {count}+ ครั้ง"
  },
  caretaker: {
    matchScoreBadge: "AI Match Score {score}%",
    verifiedTitle: "เครื่องหมายยืนยันความปลอดภัยและมาตรฐาน",
    badgeBackground: "ตรวจสอบประวัติอาชญากรรมแล้ว (สำนักงานตำรวจแห่งชาติ)",
    badgeNurse: "ใบอนุญาตประกอบวิชาชีพพยาบาล (สภาการพยาบาล)",
    badgeCaregiver: "ใบรับรองการดูแลผู้สูงอายุมาตรฐานกระทรวงสาธารณสุข",
    badgeCpr: "ผ่านการอบรมการช่วยชีวิตขั้นพื้นฐาน (CPR & First Aid)",
    badgeDriver: "ใบขับขี่สาธารณะและผ่านการอบรมขับขี่ปลอดภัย",
    stats: {
      experienceLabel: "ประสบการณ์",
      experienceValue: "{years} ปี",
      tripsLabel: "ดูแลสำเร็จ",
      tripsValue: "{count}+ ครั้ง",
      ratingLabel: "คะแนนรีวิว",
      ratingValue: "{rating} / 5.0",
      responseLabel: "อัตราการตอบกลับ",
      responseValue: "100%"
    },
    bioTitle: "เกี่ยวกับผู้ดูแล",
    specialtiesTitle: "ทักษะและความเชี่ยวชาญเฉพาะด้าน",
    educationTitle: "การศึกษาและใบรับรองวิชาชีพ",
    vehicleTitle: "ยานพาหนะและอุปกรณ์อำนวยความสะดวก",
    serviceAreasTitle: "พื้นที่ที่พร้อมให้บริการ",
    availabilityTitle: "ตารางเวลาที่พร้อมให้บริการในสัปดาห์นี้",
    reviewsTitle: "รีวิวจากครอบครัวผู้ใช้บริการจริง ({count} รีวิว)",
    stickyBar: {
      rateLabel: "อัตราค่าบริการ",
      unit: "บาท / ชั่วโมง",
      bookBtn: "จองผู้ดูแลท่านนี้"
    }
  },
  book: {
    title: "ยืนยันการจองผู้ดูแล",
    subtitle: "ตรวจสอบรายละเอียดการนัดหมายและยืนยันการจองอย่างปลอดภัย",
    elderSummaryTitle: "ข้อมูลผู้รับการดูแล",
    caretakerSummaryTitle: "ผู้ดูแลที่คุณเลือก",
    scheduleSectionTitle: "วัน เวลา และระยะเวลาบริการ",
    serviceDateLabel: "วันที่นัดหมาย",
    serviceTimeLabel: "ช่วงเวลานัดหมาย",
    durationLabel: "ระยะเวลารวม",
    locationSectionTitle: "สถานที่รับ-ส่งและปลายทาง",
    pickupLabel: "สถานที่รับผู้สูงอายุ (จุดเริ่มต้น)",
    pickupPlaceholder: "ระบุที่อยู่รับ-ส่ง",
    useElderAddressBtn: "ใช้ที่อยู่ตามโปรไฟล์ผู้สูงอายุ",
    destinationLabel: "สถานที่ปลายทาง / กิจกรรม",
    destinationPlaceholder: "ระบุสถานที่ปลายทาง เช่น รพ.ศิริราช อาคารนวมินทรบพิตร",
    notesLabel: "หมายเหตุพิเศษสำหรับผู้ดูแล",
    notesPlaceholder: "ระบุข้อมูลเพิ่มเติม เช่น จุดรอ, อาการเฉพาะหน้า, ยาที่ต้องเตรียม...",
    priceBreakdownTitle: "สรุปยอดชำระเงิน",
    basePriceLabel: "ค่าบริการผู้ดูแล ({hours} ชม. x ฿{rate})",
    serviceInsuranceLabel: "ค่าประกันอุบัติเหตุและระบบคุ้มครองความปลอดภัย",
    promoDiscountLabel: "ส่วนลดโปรโมชั่น",
    totalAmountLabel: "ยอดชำระสุทธิ",
    promoInputPlaceholder: "กรอกโค้ดส่วนลด (เช่น LOOKLARNCARE)",
    applyPromoBtn: "ใช้โค้ด",
    promoSuccessText: "ใช้โค้ดสำเร็จ! ได้รับส่วนลด ฿{discount}",
    paymentTitle: "เลือกวิธีการชำระเงิน",
    payPromptPay: "พร้อมเพย์ QR Code (ไม่มีค่าธรรมเนียม - แนะนำ)",
    payCreditCard: "บัตรเครดิต / เดบิต (Visa, Mastercard, JCB)",
    payCash: "ชำระเงินสดกับผู้ดูแลโดยตรงเมื่อเสร็จสิ้นบริการ",
    confirmBookingBtn: "ยืนยันการจองและชำระเงิน",
    agreeTermsText: "การกดยืนยันแสดงว่าท่านยอมรับข้อกำหนดการให้บริการและนโยบายความเป็นส่วนตัวของ Looklarn",
    successModal: {
      title: "การจองผู้ดูแลสำเร็จเรียบร้อย!",
      subtitle: "ระบบได้ส่งข้อมูลการนัดหมายไปยังผู้ดูแลแล้ว ผู้ดูแลจะโทรติดต่อยืนยันรายละเอียดภายใน 15 นาที",
      bookingRefLabel: "รหัสการจอง:",
      dateLabel: "วันและเวลา:",
      caretakerLabel: "ผู้ดูแล:",
      destinationLabel: "สถานที่:",
      totalPaidLabel: "ยอดชำระเงิน:",
      contactNotice: "ท่านสามารถดูรายละเอียดการจองหรือติดต่อผู้ดูแลได้ตลอดเวลาในเมนู \"การจองของฉัน\"",
      viewBookingsBtn: "ดูรายการจองของฉัน",
      backHomeBtn: "กลับสู่หน้าแรก"
    }
  },
  bookings: {
    title: "การจองของฉัน",
    subtitle: "ติดตามสถานะการดูแล ติดต่อผู้ดูแล และดูประวัติการใช้บริการที่ผ่านมา",
    tabUpcoming: "กำลังจะมาถึง ({count})",
    tabPast: "เสร็จสิ้นแล้ว ({count})",
    bookingIdLabel: "รหัสการจอง:",
    dateTimeLabel: "วันและเวลานัดหมาย:",
    durationLabel: "ระยะเวลา:",
    locationLabel: "สถานที่:",
    pickupLabel: "จุดรับ:",
    totalPriceLabel: "ยอดชำระ:",
    notesLabel: "หมายเหตุ:",
    viewDetailsBtn: "ดูรายละเอียด",
    contactCaregiverBtn: "โทรหาผู้ดูแล",
    cancelBookingBtn: "ยกเลิกการจอง",
    leaveReviewBtn: "เขียนรีวิวผู้ดูแล",
    reviewSubmittedBadge: "รีวิวแล้ว (★ {score})",
    bookAgainBtn: "จองผู้ดูแลท่านนี้อีกครั้ง",
    emptyUpcomingTitle: "ยังไม่มีรายการจองที่กำลังจะมาถึง",
    emptyUpcomingDesc: "ค้นหาผู้ดูแลมืออาชีพเพื่อพาคนที่คุณรักไปโรงพยาบาลหรือท่องเที่ยวได้เลย",
    emptyPastTitle: "ยังไม่มีประวัติการใช้บริการที่ผ่านมา",
    emptyPastDesc: "เมื่อคุณใช้บริการเสร็จสิ้น ประวัติการจองและบันทึกการดูแลจะแสดงที่นี่",
    findCaretakerBtn: "ค้นหาผู้ดูแลเลย",
    cancelConfirmTitle: "ยืนยันการยกเลิกการจอง?",
    cancelConfirmMessage: "คุณต้องการยกเลิกการจองรหัส {id} ใช่หรือไม่? หากยกเลิกก่อนเวลา 24 ชม. จะได้รับเงินคืนเต็มจำนวน",
    cancelConfirmYes: "ยืนยันการยกเลิก",
    cancelConfirmNo: "ไม่ยกเลิก",
    reviewModal: {
      title: "เขียนรีวิวผู้ดูแล",
      subtitle: "แบ่งปันประสบการณ์การใช้บริการเพื่อเป็นประโยชน์ต่อครอบครัวท่านอื่น",
      caretakerLabel: "ผู้ดูแล:",
      ratingLabel: "ให้คะแนนความพึงพอใจโดยรวม:",
      commentLabel: "ความคิดเห็นของคุณ:",
      commentPlaceholder: "บอกเล่าความประทับใจ ความตรงต่อเวลา ความใส่ใจ และความพึงพอใจของผู้สูงอายุ...",
      submitBtn: "ส่งรีวิว",
      cancelBtn: "ยกเลิก",
      successToast: "ส่งรีวิวเรียบร้อยแล้ว ขอบคุณสำหรับความคิดเห็นของคุณ!"
    }
  },
  elderProfile: {
    title: "ข้อมูลผู้สูงอายุ",
    subtitle: "บันทึกข้อมูลสุขภาพ ความต้องการ และข้อควรระวัง เพื่อให้ AI จับคู่ผู้ดูแลได้แม่นยำและปลอดภัยที่สุด",
    photoSectionTitle: "รูปถ่ายผู้สูงอายุ",
    changePhotoBtn: "เปลี่ยนรูปภาพ",
    photoHint: "แนะนำรูปถ่ายหน้าตรงที่มองเห็นใบหน้าชัดเจน เพื่อให้ผู้ดูแลจดจำได้ง่าย",
    generalInfoTitle: "ข้อมูลทั่วไป",
    fullNameLabel: "ชื่อ-นามสกุล (ภาษาไทย)",
    fullNameEnLabel: "ชื่อ-นามสกุล (ภาษาอังกฤษ)",
    nicknameLabel: "ชื่อเล่น",
    ageLabel: "อายุ (ปี)",
    genderLabel: "เพศ",
    bloodTypeLabel: "กรุ๊ปเลือด",
    relationshipLabel: "ความสัมพันธ์กับผู้ปกครอง",
    guardianSectionTitle: "ข้อมูลผู้ปกครอง (ผู้ดูแลหลัก)",
    guardianNameLabel: "ชื่อ-นามสกุลผู้ปกครอง",
    guardianPhoneLabel: "เบอร์โทรศัพท์ผู้ปกครอง",
    guardianEmailLabel: "อีเมลผู้ปกครอง",
    emergencyContactTitle: "ผู้ติดต่อฉุกเฉิน",
    emergencyNameLabel: "ชื่อผู้ติดต่อฉุกเฉิน",
    emergencyRelationLabel: "ความสัมพันธ์",
    emergencyPhoneLabel: "เบอร์โทรติดต่อฉุกเฉิน (24 ชม.)",
    homeAddressLabel: "ที่อยู่สำหรับรับ-ส่งประจำ",
    mobilitySectionTitle: "ระดับการเคลื่อนไหว & อุปกรณ์ช่วยเหลือ",
    mobilityLevelLabel: "ระดับความสามารถในการเคลื่อนไหว",
    medicalSectionTitle: "ข้อมูลสุขภาพและโรคประจำตัว",
    chronicConditionsLabel: "โรคประจำตัวและการรักษา",
    allergiesLabel: "ประวัติการแพ้ยา / แพ้อาหาร",
    allergiesPlaceholder: "เช่น แพ้ยาเพนิซิลลิน, แพ้อาหารทะเล...",
    medicationsLabel: "ยาประจำตัวและตารางเวลาทานยา",
    medicationsPlaceholder: "เช่น ทานยาความดัน 1 เม็ดหลังอาหารเช้า...",
    preferredHospitalLabel: "โรงพยาบาลประจำตัว",
    hospitalHnLabel: "หมายเลขประจำตัวผู้ป่วย (HN)",
    dietSectionTitle: "ความชอบด้านอาหารและไลฟ์สไตล์",
    dietaryPreferencesLabel: "ข้อจำกัดและความชอบด้านอาหาร",
    dietaryPlaceholder: "เช่น อาหารรสอ่อน ไม่ทานเนื้อวัว ชอบดื่มน้ำอุ่น...",
    religionLabel: "ศาสนาและความชอบทางวัฒนธรรม",
    preferredLanguagesLabel: "ภาษาและสำเนียงที่ชอบสื่อสาร",
    specialNotesLabel: "ข้อควรระวังหรือสิ่งที่ผู้สูงอายุชอบเป็นพิเศษ",
    specialNotesPlaceholder: "เช่น ไม่ชอบอากาศร้อนจัด, เดินได้ช้าต้องคอยพัก, ชอบชวนคุยเรื่องต้นไม้...",
    saveBtn: "บันทึกการเปลี่ยนแปลง",
    savedToast: "บันทึกข้อมูลผู้สูงอายุสำเร็จเรียบร้อยแล้ว!"
  },
  footer: {
    tagline: "Looklarn (ลูกหลาน) — ผู้ช่วยดูแลและพาผู้สูงอายุไปทุกที่อย่างอบอุ่นใจ เสมือนมีลูกหลานอยู่เคียงข้าง",
    quickLinksTitle: "เมนูลัด",
    servicesTitle: "บริการของเรา",
    trustSafetyTitle: "ความปลอดภัยและความมั่นใจ",
    safetyBadge1: "ตรวจประวัติอาชญากรรม 100%",
    safetyBadge2: "ประกันอุบัติเหตุคุ้มครองทุกทริป",
    safetyBadge3: "ติดตามตำแหน่งแบบเรียลไทม์",
    emergencyTitle: "ศูนย์ช่วยเหลือฉุกเฉินตลอด 24 ชั่วโมง",
    emergencyPhone: "02-123-4567",
    ambulanceRef: "สายด่วนการแพทย์ฉุกเฉิน: 1669",
    copyright: "© 2026 Looklarn Co., Ltd. สงวนลิขสิทธิ์ทุกประการ",
    terms: "ข้อกำหนดการให้บริการ",
    privacy: "นโยบายความเป็นส่วนตัว"
  }
};
```

---

#### File 2: `src/i18n/en.js`
```javascript
export const en = {
  nav: {
    brandName: "Looklarn",
    brandSubtitle: "Senior Escort Companion",
    tagline: "Trusted Companion Care for Your Loved Ones",
    home: "Home",
    findCaretaker: "Find Caretaker",
    myBookings: "My Bookings",
    elderProfile: "Elder Profile",
    contact: "Contact Us",
    badgeVerified: "100% Verified Caregivers",
    langToggleLabel: "Change Language"
  },
  common: {
    hours: "hours",
    hrShort: "hr",
    perHour: "THB / hr",
    baht: "THB",
    bookNow: "Book Now",
    bookThisCaretaker: "Book This Caretaker",
    viewProfile: "View Profile",
    back: "Back",
    next: "Next",
    save: "Save Changes",
    cancel: "Cancel",
    confirm: "Confirm",
    edit: "Edit",
    delete: "Delete",
    close: "Close",
    all: "All",
    rating: "Rating",
    reviewsCount: "({count} reviews)",
    matchScore: "Match Score",
    bestMatch: "#1 Best Match",
    verified: "Identity & Background Verified",
    statusUpcoming: "Upcoming",
    statusCompleted: "Completed",
    statusCancelled: "Cancelled",
    selectDate: "Select Date",
    selectTime: "Select Time",
    phoneNumber: "Phone Number",
    address: "Address",
    age: "Age",
    yearsOld: "years",
    female: "Female",
    male: "Male",
    notSpecified: "Not specified",
    saving: "Saving...",
    success: "Success",
    error: "An error occurred"
  },
  home: {
    hero: {
      badge: "AI-Powered Elder Companion Matching",
      title: "Caring for Your Loved Ones, Across Every Cherished Journey",
      subtitle: "Connect with verified, compassionate companions to escort your elderly parents to hospitals, temples, parks, and family events with total peace of mind.",
      ctaPrimary: "Find Caretaker with AI",
      ctaSecondary: "Explore All Services",
      trustBadge1: "100% Background Checked",
      trustBadge2: "CPR & First Aid Certified",
      trustBadge3: "Accident Insurance on Every Trip",
      trustScore: "4.95/5 Customer Rating from 1,200+ Families"
    },
    stats: {
      caregiversCount: "500+",
      caregiversLabel: "Verified Companions",
      familiesCount: "1,200+",
      familiesLabel: "Trusted Families",
      matchAccuracyCount: "98%",
      matchAccuracyLabel: "AI Match Precision",
      safetyScoreCount: "100%",
      safetyScoreLabel: "Safety Compliance"
    },
    activities: {
      tag: "Popular Services",
      title: "Tailored Companionship for Every Occasion",
      subtitle: "Comprehensive accompaniment covering healthcare appointments, cultural trips, and social gatherings.",
      viewAll: "View All Activities"
    },
    promo: {
      badge: "New Member Privilege",
      title: "Special Hospital Partner Discounts",
      desc: "Get ฿150 off your first medical escort booking to partner hospitals (Siriraj, Chulalongkorn, or Ramathibodi).",
      codeLabel: "Promo Code:",
      code: "LOOKLARNCARE",
      copyCode: "Copy Code",
      codeCopied: "Code Copied!",
      partnerHospitals: "Hospital Partners: Siriraj • Chulalongkorn • Ramathibodi • Phramongkutklao"
    },
    howItWorks: {
      tag: "How It Works",
      title: "3 Simple Steps to Perfect Companion Care",
      subtitle: "Match with the ideal certified companion within minutes through our intelligent AI matching engine.",
      step1Num: "01",
      step1Title: "Specify Health & Care Needs",
      step1Desc: "Share mobility requirements, chronic medical conditions, medications, and preferred outing activities.",
      step2Num: "02",
      step2Title: "AI Matches Top Caretakers",
      step2Desc: "Our AI evaluates medical certifications, language dialects, and schedules to recommend the top 3 matches.",
      step3Num: "03",
      step3Title: "Book & Track in Real Time",
      step3Desc: "Confirm your booking securely. Receive real-time status updates and activity photos throughout the outing."
    },
    testimonials: {
      tag: "Real Customer Stories",
      title: "What Families Say About Looklarn",
      subtitle: "Heartfelt feedback from guardians who trust Looklarn with their beloved elderly parents.",
      t1Text: "Khun Somchai was wonderful escorting my mother to Siriraj Hospital when I had an urgent board meeting. He sent continuous photo updates and mom couldn't stop praising him.",
      t1Author: "Thanakorn Jaidee",
      t1Role: "Son (Corporate Executive)",
      t2Text: "Finding someone patient enough to escort grandmother to Wat Arun seemed impossible until Looklarn. Nipaporn was so attentive with the sun and stairs. Highly recommended!",
      t2Author: "Dr. Wannapa Sitthipong",
      t2Role: "Daughter (Physician)",
      t3Text: "Ploy was so sweet and energetic walking dad around Lumpini Park. She helped with gentle exercises and cheered him up immensely. Deeply grateful to Looklarn!",
      t3Author: "Kittisak Woradech",
      t3Role: "Son (Civil Servant)"
    },
    ctaBanner: {
      title: "Ready to Give Your Parents the Warmest Care & Joy?",
      subtitle: "Start matching with certified companions on Looklarn today. Easy booking in under 3 minutes.",
      button: "Start Matching Now"
    }
  },
  find: {
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
      mobilityIndependent: "Fully independent (No mobility aid needed)",
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
  },
  matches: {
    badge: "AI Matching Completed",
    title: "Your Top Matched Caretakers",
    subtitle: "Looklarn AI has evaluated and ranked the 3 most compatible companions based on your preferences.",
    summaryPill: "Results for: {activity} • {date} • Budget up to ฿{budget}/hr",
    refineBtn: "Refine Criteria",
    sortByLabel: "Sort by:",
    sortMatchScore: "Match Score (Highest)",
    sortPriceLow: "Price (Low to High)",
    sortRating: "Customer Rating (Highest)",
    bestMatchBadge: "★ #1 Best Match (96%)",
    matchScoreLabel: "AI Match Score",
    verifiedBadge: "Background Verified",
    hourlyRateText: "฿{rate} / hr",
    viewProfileBtn: "View Full Profile",
    bookNowBtn: "Book This Caretaker",
    whyMatchTitle: "Why this is a great match:",
    specialtyTagsTitle: "Key Specialties:",
    experienceText: "{years} yrs experience",
    completedTripsText: "{count}+ trips completed"
  },
  caretaker: {
    matchScoreBadge: "AI Match Score {score}%",
    verifiedTitle: "Safety & Professional Verification Badges",
    badgeBackground: "Criminal Background Checked (Royal Thai Police)",
    badgeNurse: "Licensed Practical/Registered Nurse (Nursing Council)",
    badgeCaregiver: "Elderly Caregiver Certified (Ministry of Public Health)",
    badgeCpr: "CPR & Basic Life Support Certified (Thai Red Cross)",
    badgeDriver: "Defensive Driving & Senior Transportation Certified",
    stats: {
      experienceLabel: "Experience",
      experienceValue: "{years} Years",
      tripsLabel: "Completed Escorts",
      tripsValue: "{count}+ Trips",
      ratingLabel: "Review Rating",
      ratingValue: "{rating} / 5.0",
      responseLabel: "Response Rate",
      responseValue: "100%"
    },
    bioTitle: "About the Companion",
    specialtiesTitle: "Specialized Skills & Qualifications",
    educationTitle: "Education & Certifications",
    vehicleTitle: "Vehicle & Accessibility Equipment",
    serviceAreasTitle: "Service Coverage Areas",
    availabilityTitle: "Weekly Availability Calendar",
    reviewsTitle: "Reviews from Families ({count} Reviews)",
    stickyBar: {
      rateLabel: "Hourly Rate",
      unit: "THB / hour",
      bookBtn: "Book This Caretaker"
    }
  },
  book: {
    title: "Confirm Your Booking",
    subtitle: "Review appointment details and confirm your companion escort securely.",
    elderSummaryTitle: "Elderly Care Recipient",
    caretakerSummaryTitle: "Selected Caretaker",
    scheduleSectionTitle: "Date, Time & Duration",
    serviceDateLabel: "Service Date",
    serviceTimeLabel: "Appointment Time",
    durationLabel: "Total Duration",
    locationSectionTitle: "Pickup & Destination Locations",
    pickupLabel: "Pickup Address (Starting Point)",
    pickupPlaceholder: "Enter pickup address",
    useElderAddressBtn: "Use Elder's Home Address",
    destinationLabel: "Destination Location / Hospital",
    destinationPlaceholder: "e.g., Siriraj Hospital, Navamindrapobitr Bldg",
    notesLabel: "Special Notes for Caretaker",
    notesPlaceholder: "e.g., Waiting spot, specific medical notes, required medicine...",
    priceBreakdownTitle: "Price Breakdown",
    basePriceLabel: "Companion Rate ({hours} hrs x ฿{rate})",
    serviceInsuranceLabel: "Accident Insurance & Safety Protection Fee",
    promoDiscountLabel: "Promotional Discount",
    totalAmountLabel: "Total Amount Due",
    promoInputPlaceholder: "Enter Promo Code (e.g., LOOKLARNCARE)",
    applyPromoBtn: "Apply Code",
    promoSuccessText: "Promo applied! ฿{discount} discount granted.",
    paymentTitle: "Select Payment Method",
    payPromptPay: "PromptPay QR Code (Zero transaction fee - Recommended)",
    payCreditCard: "Credit / Debit Card (Visa, Mastercard, JCB)",
    payCash: "Direct Cash Payment upon Outing Completion",
    confirmBookingBtn: "Confirm Booking & Proceed",
    agreeTermsText: "By clicking confirm, you agree to Looklarn's Terms of Service and Privacy Policy.",
    successModal: {
      title: "Booking Confirmed Successfully!",
      subtitle: "Your booking details have been dispatched to the companion. They will call you within 15 minutes to confirm logistics.",
      bookingRefLabel: "Booking Reference:",
      dateLabel: "Date & Time:",
      caretakerLabel: "Companion:",
      destinationLabel: "Destination:",
      totalPaidLabel: "Total Paid:",
      contactNotice: "You can track real-time trip status or contact your companion anytime in \"My Bookings\".",
      viewBookingsBtn: "Go to My Bookings",
      backHomeBtn: "Back to Home"
    }
  },
  bookings: {
    title: "My Bookings",
    subtitle: "Track live upcoming escort trips, connect with companions, and view past care history.",
    tabUpcoming: "Upcoming ({count})",
    tabPast: "Past Completed ({count})",
    bookingIdLabel: "Booking Ref:",
    dateTimeLabel: "Date & Time:",
    durationLabel: "Duration:",
    locationLabel: "Destination:",
    pickupLabel: "Pickup:",
    totalPriceLabel: "Total Paid:",
    notesLabel: "Notes:",
    viewDetailsBtn: "View Details",
    contactCaregiverBtn: "Call Companion",
    cancelBookingBtn: "Cancel Booking",
    leaveReviewBtn: "Write Review",
    reviewSubmittedBadge: "Reviewed (★ {score})",
    bookAgainBtn: "Book Again",
    emptyUpcomingTitle: "No Upcoming Bookings Found",
    emptyUpcomingDesc: "Search and match with a certified companion for your elder's next medical or leisure trip.",
    emptyPastTitle: "No Past Escort History Yet",
    emptyPastDesc: "Completed escort bookings and medical summary logs will appear here.",
    findCaretakerBtn: "Find a Caretaker Now",
    cancelConfirmTitle: "Confirm Cancellation?",
    cancelConfirmMessage: "Are you sure you want to cancel booking {id}? Cancellations made 24h before appointment receive a 100% full refund.",
    cancelConfirmYes: "Confirm Cancellation",
    cancelConfirmNo: "Keep Booking",
    reviewModal: {
      title: "Review Your Companion",
      subtitle: "Share your experience to help other families choose the best care.",
      caretakerLabel: "Companion:",
      ratingLabel: "Overall Satisfaction Rating:",
      commentLabel: "Your Review & Comments:",
      commentPlaceholder: "Share how attentive, punctual, and helpful the companion was with your parent...",
      submitBtn: "Submit Review",
      cancelBtn: "Cancel",
      successToast: "Review submitted successfully! Thank you for your feedback."
    }
  },
  elderProfile: {
    title: "Elder Profile",
    subtitle: "Maintain comprehensive healthcare, mobility, and personal preferences to ensure precise AI matching and safe escort care.",
    photoSectionTitle: "Elder's Photo",
    changePhotoBtn: "Change Photo",
    photoHint: "Clear front-facing photo helps companions easily identify your parent at pickup.",
    generalInfoTitle: "General Information",
    fullNameLabel: "Full Name (Thai)",
    fullNameEnLabel: "Full Name (English)",
    nicknameLabel: "Nickname",
    ageLabel: "Age (Years)",
    genderLabel: "Gender",
    bloodTypeLabel: "Blood Type",
    relationshipLabel: "Relationship to Guardian",
    guardianSectionTitle: "Guardian Information (Primary Contact)",
    guardianNameLabel: "Guardian Full Name",
    guardianPhoneLabel: "Guardian Phone Number",
    guardianEmailLabel: "Guardian Email",
    emergencyContactTitle: "Emergency Contacts",
    emergencyNameLabel: "Emergency Contact Name",
    emergencyRelationLabel: "Relationship",
    emergencyPhoneLabel: "Emergency Phone (24/7)",
    homeAddressLabel: "Primary Pickup & Home Address",
    mobilitySectionTitle: "Mobility Level & Assistance Aids",
    mobilityLevelLabel: "Physical Mobility Level",
    medicalSectionTitle: "Medical Conditions & Healthcare Notes",
    chronicConditionsLabel: "Chronic Conditions & Treatments",
    allergiesLabel: "Medication & Food Allergies",
    allergiesPlaceholder: "e.g., Penicillin allergy, Shellfish...",
    medicationsLabel: "Current Scheduled Medications",
    medicationsPlaceholder: "e.g., Amlodipine 5mg post-breakfast...",
    preferredHospitalLabel: "Primary Hospital",
    hospitalHnLabel: "Hospital Number (HN)",
    dietSectionTitle: "Dietary Preferences & Cultural Lifestyle",
    dietaryPreferencesLabel: "Dietary Restrictions & Preferences",
    dietaryPlaceholder: "e.g., Low sodium, no beef, prefers warm water...",
    religionLabel: "Religion & Spiritual Lifestyle",
    preferredLanguagesLabel: "Preferred Languages & Dialects",
    specialNotesLabel: "Special Care Instructions & Personal Habits",
    specialNotesPlaceholder: "e.g., Dislikes high heat, walks slowly, enjoys gardening chats...",
    saveBtn: "Save Profile Changes",
    savedToast: "Elder profile saved successfully!"
  },
  footer: {
    tagline: "Looklarn — Dedicated, compassionate elder escort companions providing warmth, safety, and joy.",
    quickLinksTitle: "Quick Links",
    servicesTitle: "Our Services",
    trustSafetyTitle: "Trust & Safety Standards",
    safetyBadge1: "100% Criminal Background Checked",
    safetyBadge2: "Accident Insurance on Every Trip",
    safetyBadge3: "Real-Time GPS Location Tracking",
    emergencyTitle: "24/7 Emergency Support Center",
    emergencyPhone: "02-123-4567",
    ambulanceRef: "National Medical Emergency EMS: 1669",
    copyright: "© 2026 Looklarn Co., Ltd. All rights reserved.",
    terms: "Terms of Service",
    privacy: "Privacy Policy"
  }
};
```

---

#### File 3: `src/i18n/index.js`
```javascript
import { th } from './th';
import { en } from './en';

export const DEFAULT_LANGUAGE = 'th';
export const SUPPORTED_LANGUAGES = ['th', 'en'];

export const translations = {
  th,
  en
};

export { th, en };
```

---

#### File 4: `src/context/LanguageContext.jsx`
```javascript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, DEFAULT_LANGUAGE } from '../i18n';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem('looklarn_lang');
      return saved === 'en' || saved === 'th' ? saved : DEFAULT_LANGUAGE;
    } catch {
      return DEFAULT_LANGUAGE;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('looklarn_lang', language);
    } catch (e) {
      console.warn('Unable to persist language to localStorage', e);
    }
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'th' ? 'en' : 'th'));
  };

  /**
   * Translates a dot-notated key with optional interpolation tokens or fallback string.
   * e.g. t('nav.findCaretaker')
   * e.g. t('matches.summaryPill', { activity: 'Hospital', date: '25 Aug', budget: 500 })
   */
  const t = (keyPath, paramsOrFallback = {}) => {
    if (!keyPath) return '';

    const isFallbackString = typeof paramsOrFallback === 'string';
    const fallback = isFallbackString ? paramsOrFallback : keyPath;
    const params = isFallbackString ? {} : paramsOrFallback;

    const keys = keyPath.split('.');
    let current = translations[language];

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        // Fallback to alternate language if key missing
        const altLang = language === 'th' ? 'en' : 'th';
        let altCurrent = translations[altLang];
        for (const altKey of keys) {
          if (altCurrent && typeof altCurrent === 'object' && altKey in altCurrent) {
            altCurrent = altCurrent[altKey];
          } else {
            altCurrent = null;
            break;
          }
        }
        if (altCurrent && typeof altCurrent === 'string') {
          current = altCurrent;
        } else {
          return fallback;
        }
        break;
      }
    }

    if (typeof current !== 'string') {
      return fallback;
    }

    let result = current;
    Object.keys(params).forEach(param => {
      result = result.replace(new RegExp(`\\{${param}\\}`, 'g'), String(params[param]));
    });

    return result;
  };

  /**
   * Extracts localized values from bilingual mock items supporting:
   * 1. Nested objects: item[field][language]
   * 2. Suffix properties: item[`${field}_${language}`]
   */
  const getLocalized = (item, field) => {
    if (!item) return '';

    // Check nested object: item.name.th
    if (item[field] && typeof item[field] === 'object' && !Array.isArray(item[field])) {
      return item[field][language] || item[field]['th'] || item[field]['en'] || '';
    }

    // Check suffix property: item.name_th
    const suffixedKey = `${field}_${language}`;
    if (item[suffixedKey] !== undefined) {
      return item[suffixedKey];
    }

    // Alternate language fallback
    const altLang = language === 'th' ? 'en' : 'th';
    const altKey = `${field}_${altLang}`;
    if (item[altKey] !== undefined) {
      return item[altKey];
    }

    return item[field] !== undefined ? item[field] : '';
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, getLocalized }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
```

---

### 2.3 Mock Datasets Specifications

#### File 1: `src/data/caretakers.json`
Contains 5 comprehensive caretaker profiles:
- `ct-001`: Somchai Prasert (สมชาย ประเสริฐ) — **96% Match** (Practical Nurse, Medical Escort Specialist, 6 yrs exp, ฿350/hr)
- `ct-002`: Nurse Areeya "Aree" Rattanakul (พว. อารียา รัตนกุล) — **88% Match** (Geriatric Registered Nurse, 8 yrs exp, ฿450/hr)
- `ct-003`: Ploy Chidchanok (พลอย ชิดชนก วงศ์สวัสดิ์) — **81% Match** (Physical Therapy Trainee, Park & Leisure Companion, 3 yrs exp, ฿320/hr)
- `ct-004`: Nipaporn "Fa" Suksan (นิภาพร สุขสันต์) — **76% Match** (Temple & Cultural Tour Guide, 4 yrs exp, ฿380/hr)
- `ct-005`: Arak "Uncle Rak" Boonmee (อารักษ์ บุญมี) — **72% Match** (Senior Van Driver & Event Escort, 7 yrs exp, ฿300/hr)

```json
[
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
      },
      {
        "id": "rev-102",
        "reviewerName": "พญ. วรรณภา",
        "relationship": { "th": "บุตรสาว", "en": "Daughter" },
        "rating": 4.9,
        "date": "2026-08-02",
        "comment": {
          "th": "ตรงเวลา สุภาพ มีความรู้เรื่องขั้นตอนโรงพยาบาลดีเยี่ยม ช่วยเข็นวีลแชร์ขึ้นลงทางลาดอย่างระมัดระวังมาก",
          "en": "Punctual, polite, and very knowledgeable about hospital routines. Very attentive on wheelchair ramps."
        }
      }
    ]
  },
  {
    "id": "ct-002",
    "name": { "th": "พว. อารียา รัตนกุล (อารี)", "en": "Nurse Areeya Rattanakul (Aree)" },
    "nickname": { "th": "อารี", "en": "Aree" },
    "gender": "female",
    "age": 38,
    "photo": "https://images.unsplash.com/photo-1594824813589-cf722bda7ec1?w=500&auto=format&fit=crop&q=80",
    "matchScore": 88,
    "isBestMatch": false,
    "tier": "specialist",
    "tierName": {
      "th": "พยาบาลวิชาชีพดูแลผู้สูงอายุและพักฟื้น",
      "en": "Registered Geriatric Nurse & Recovery Escort"
    },
    "hourlyRate": 450,
    "rating": 4.98,
    "reviewsCount": 74,
    "completedTrips": 198,
    "experienceYears": 8,
    "verifiedBadges": [
      "criminal_record_checked",
      "registered_nurse",
      "cpr_first_aid",
      "dementia_certified"
    ],
    "specialties": [
      { "th": "พยาบาลวิชาชีพดูแลผู้ป่วยพักฟื้น", "en": "Registered Nurse Geriatric & Post-Op Care" },
      { "th": "การดูแลผู้มีภาวะสมองเสื่อม / อัลไซเมอร์", "en": "Dementia & Alzheimer's Compassionate Care" },
      { "th": "การจัดการยาและดูแลสายยางให้อาหาร", "en": "Medication Administration & Tube Care" },
      { "th": "การปฐมพยาบาลฉุกเฉินระดับสูง (ACLS)", "en": "Advanced Cardiac Life Support & First Aid" }
    ],
    "languages": [
      { "th": "ภาษาไทย (กลาง)", "en": "Central Thai" },
      { "th": "ภาษาอีสาน", "en": "Isan Dialect" },
      { "th": "ภาษาอังกฤษ", "en": "English" }
    ],
    "education": {
      "th": "พยาบาลศาสตรบัณฑิต (B.N.S.) คณะพยาบาลศาสตร์ศิริราชพยาบาล มหาวิทยาลัยมหิดล",
      "en": "Bachelor of Nursing Science (B.N.S.), Siriraj Faculty of Nursing, Mahidol University"
    },
    "vehicle": {
      "type": "suv",
      "th": "รถ SUV กว้างขวาง มีชุดปฐมพยาบาลครบครันและทางลาดขึ้นวีลแชร์",
      "en": "Spacious SUV with comprehensive medical kit and portable wheelchair ramp"
    },
    "serviceAreas": [
      { "th": "บางกอกน้อย, ธนบุรี, พระนคร, บางพลัด, ราชเทวี", "en": "Bangkok Noi, Thon Buri, Phra Nakhon, Bang Phlat, Ratchathewi" }
    ],
    "bio": {
      "th": "พยาบาลวิชาชีพ (RN) ประสบการณ์แผนกอายุรกรรมและผู้สูงอายุกว่า 8 ปี เชี่ยวชาญการดูแลผู้ป่วยความจำเสื่อม การพาพบแพทย์เฉพาะทาง และการดูแลภาวะฉุกเฉิน ให้บริการด้วยความอบอุ่น ใจเย็น ดุจญาติมิตร",
      "en": "Registered Nurse (RN) with 8+ years in geriatric wards. Expert in dementia care, specialized clinic escort, and emergency triage. Committed to providing empathetic, family-like care."
    },
    "availableSlots": ["Mon", "Tue", "Thu", "Fri", "Sat"],
    "reviews": [
      {
        "id": "rev-201",
        "reviewerName": "กิตติศักดิ์ วรเดช",
        "relationship": { "th": "บุตรชาย", "en": "Son" },
        "rating": 5.0,
        "date": "2026-08-10",
        "comment": {
          "th": "คุณพยาบาลอารีมืออาชีพมาก ช่วยวัดความดันและดูแลคุณแม่อย่างใกล้ชิดตลอดเวลาที่ รพ.ศิริราช รู้สึกอุ่นใจมากครับ",
          "en": "Nurse Aree was profoundly professional. Monitored mom's vitals closely at Siriraj Hospital. Total peace of mind!"
        }
      }
    ]
  },
  {
    "id": "ct-003",
    "name": { "th": "พลอย ชิดชนก วงศ์สวัสดิ์", "en": "Ploy Chidchanok Wongsawat" },
    "nickname": { "th": "พลอย", "en": "Ploy" },
    "gender": "female",
    "age": 28,
    "photo": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80",
    "matchScore": 81,
    "isBestMatch": false,
    "tier": "trained",
    "tierName": {
      "th": "นักกายภาพบำบัดฝึกหัด & เพื่อนพาเที่ยวพักผ่อน",
      "en": "Physical Therapy Assistant & Leisure Companion"
    },
    "hourlyRate": 320,
    "rating": 4.86,
    "reviewsCount": 42,
    "completedTrips": 89,
    "experienceYears": 3,
    "verifiedBadges": [
      "criminal_record_checked",
      "certified_caregiver",
      "cpr_first_aid"
    ],
    "specialties": [
      { "th": "เดินเล่นสวนสาธารณะ & กายภาพบำบัดเบาๆ", "en": "Park Walks & Gentle Mobility Exercise" },
      { "th": "ช่วยพยุงเดินและฝึกการทรงตัว", "en": "Gait Training & Balance Assistance" },
      { "th": "พาซื้อของและช็อปปิ้งในห้าง", "en": "Shopping & Mall Leisure Escort" },
      { "th": "เพื่อนพูดคุยสร้างพลังบวกและคลายเหงา", "en": "Cheerful Conversation & Emotional Well-being" }
    ],
    "languages": [
      { "th": "ภาษาไทย (กลาง)", "en": "Central Thai" },
      { "th": "ภาษาอังกฤษ", "en": "English" }
    ],
    "education": {
      "th": "อนุปริญญากายภาพบำบัด มหาวิทยาลัยมหิดล",
      "en": "Diploma in Physical Therapy Assistance, Mahidol University"
    },
    "vehicle": {
      "type": "eco_car",
      "th": "รถยนต์ Eco Car ขนาดกะทัดรัด แอร์เย็น สบาย",
      "en": "Compact, comfortable air-conditioned eco car"
    },
    "serviceAreas": [
      { "th": "คลองเตย, วัฒนา, จตุจักร, ลาดพร้าว, อารีย์", "en": "Khlong Toei, Watthana, Chatuchak, Lat Phrao, Ari" }
    ],
    "bio": {
      "th": "นักกายภาพบำบัดฝึกหัดและผู้ช่วยดูแลผู้สูงอายุ มีความเชี่ยวชาญด้านการช่วยพยุงเดิน การเดินออกกำลังกายในสวนสาธารณะ และการชวนคุยสร้างรอยยิ้ม ให้ผู้สูงอายุรู้สึกสดชื่นและกระปรี้กระเปร่า",
      "en": "Physical therapy assistant and companion. Specialized in gentle mobility walks in botanical parks, shopping mall strolls, and cheerful companionship to brighten your parent's day."
    },
    "availableSlots": ["Tue", "Wed", "Fri", "Sat", "Sun"],
    "reviews": [
      {
        "id": "rev-301",
        "reviewerName": "สมศักดิ์ ปรีชา",
        "relationship": { "th": "บุตรชาย", "en": "Son" },
        "rating": 5.0,
        "date": "2026-08-08",
        "comment": {
          "th": "น้องพลอยพาคุณแม่เดินเล่นสวนลุมพินีอย่างน่ารักมาก ช่วยจับพยุงและแวะนั่งพักเป็นระยะ คุณแม่ชมว่าคุยสนุกมากครับ",
          "en": "Ploy was so lovely escorting mom at Lumpini Park. Gentle walking pacing and great chats. Mom had a wonderful time."
        }
      }
    ]
  },
  {
    "id": "ct-004",
    "name": { "th": "นิภาพร สุขสันต์ (ฟ้า)", "en": "Nipaporn Suksan (Fa)" },
    "nickname": { "th": "ฟ้า", "en": "Fa" },
    "gender": "female",
    "age": 31,
    "photo": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=80",
    "matchScore": 76,
    "isBestMatch": false,
    "tier": "expert",
    "tierName": {
      "th": "ผู้เชี่ยวชาญพาทำบุญไหว้พระ & ท่องเที่ยวเชิงวัฒนธรรม",
      "en": "Cultural Tour & Temple Merit Escort Specialist"
    },
    "hourlyRate": 380,
    "rating": 4.88,
    "reviewsCount": 36,
    "completedTrips": 78,
    "experienceYears": 4,
    "verifiedBadges": [
      "criminal_record_checked",
      "certified_caregiver",
      "cpr_first_aid",
      "tour_guide_licensed"
    ],
    "specialties": [
      { "th": "พาไหว้พระ 9 วัด & กิจกรรมทำบุญวันพระ", "en": "9-Temple Pilgrimage & Merit Making" },
      { "th": "ดูแลการขึ้นลงบันไดและพื้นต่างระดับ", "en": "Stair & Temple Step Physical Assistance" },
      { "th": "เตรียมอุปกรณ์สังฆทานและร่มกันแดด", "en": "Offering Supplies & Sun Protection" },
      { "th": "ท่องเที่ยวเชิงประวัติศาสตร์และริมแม่น้ำ", "en": "Riverside & Heritage Cultural Outings" }
    ],
    "languages": [
      { "th": "ภาษาไทย (กลาง)", "en": "Central Thai" },
      { "th": "ภาษาอีสาน", "en": "Isan Dialect" },
      { "th": "ภาษาจีนแต้จิ๋ว", "en": "Teochew Dialect" }
    ],
    "education": {
      "th": "ประกาศนียบัตรผู้ดูแลผู้สูงอายุ และมัคคุเทศก์ท่องเที่ยวเชิงวัฒนธรรม",
      "en": "Elderly Care Certificate & Cultural Heritage Guide License"
    },
    "vehicle": {
      "type": "mpv",
      "th": "รถยนต์ MPV 7 ที่นั่ง มีบันไดเสริมขึ้นรถและร่มกันแดดขนาดใหญ่",
      "en": "7-Seater MPV equipped with boarding step stool and large sun canopies"
    },
    "serviceAreas": [
      { "th": "พระนคร, ธนบุรี, บางกอกใหญ่, ดุสิต, สัมพันธวงศ์", "en": "Phra Nakhon, Thon Buri, Bangkok Yai, Dusit, Samphanthawong" }
    ],
    "bio": {
      "th": "ผู้ดูแลใจเย็นและรักวัฒนธรรมไทย เชี่ยวชาญการพาผู้สูงอายุทำบุญไหว้พระ ไหว้พระ 9 วัด ท่องเที่ยวริมแม่น้ำเจ้าพระยา ใส่ใจเรื่องบันไดวัดและการป้องกันแดดร้อนอย่างใกล้ชิด",
      "en": "Gentle, culturally passionate certified caregiver. Expert in temple pilgrimages, 9-temple merit trips, and Chao Phraya riverside leisure with strict attention to stairs and hydration."
    },
    "availableSlots": ["Mon", "Wed", "Fri", "Sat", "Sun"],
    "reviews": [
      {
        "id": "rev-401",
        "reviewerName": "มาลี วงศ์สว่าง",
        "relationship": { "th": "บุตรสาว", "en": "Daughter" },
        "rating": 5.0,
        "date": "2026-07-28",
        "comment": {
          "th": "คุณฟ้าพาคุณยายไปไหว้พระวัดอรุณและวัดระฆัง ดูแลเรื่องบันไดและถือร่มให้ตลอดทาง ประทับใจมากค่ะ",
          "en": "Fa escorted grandmother to Wat Arun and Wat Rakhang. Handled temple stairs and sun shading impeccably."
        }
      }
    ]
  },
  {
    "id": "ct-005",
    "name": { "th": "อารักษ์ บุญมี (ลุงรักษ์)", "en": "Arak Boonmee (Uncle Rak)" },
    "nickname": { "th": "ลุงรักษ์", "en": "Uncle Rak" },
    "gender": "male",
    "age": 44,
    "photo": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80",
    "matchScore": 72,
    "isBestMatch": false,
    "tier": "trained",
    "tierName": {
      "th": "ผู้ช่วยเดินทาง & ขับรถพาผู้สูงอายุร่วมงานสังคม",
      "en": "Senior Mobility Driver & Social Event Escort"
    },
    "hourlyRate": 300,
    "rating": 4.82,
    "reviewsCount": 51,
    "completedTrips": 165,
    "experienceYears": 7,
    "verifiedBadges": [
      "criminal_record_checked",
      "cpr_first_aid",
      "defensive_driving_licensed"
    ],
    "specialties": [
      { "th": "ขับรถรับส่ง VIP พร้อมทางลาดวีลแชร์", "en": "VIP Van Transport with Wheelchair Ramp" },
      { "th": "พาไปร่วมงานแต่ง งานเลี้ยง และงานรวมญาติ", "en": "Weddings, Banquets & Reunion Escort" },
      { "th": "ช่วยยกของหนักและพยุงเคลื่อนย้าย", "en": "Heavy Lifting & Transfer Assistance" },
      { "th": "เดินทางข้ามจังหวัดระยะใกล้", "en": "Inter-provincial Outing Assistance" }
    ],
    "languages": [
      { "th": "ภาษาไทย (กลาง)", "en": "Central Thai" },
      { "th": "ภาษาเหนือ (คำเมือง)", "en": "Northern Dialect" }
    ],
    "education": {
      "th": "ใบอนุญาตขับขี่สาธารณะ & ผ่านการอบรมการขับขี่ปลอดภัยและดูแลผู้โดยสารสูงอายุ",
      "en": "Public Transport Driving License & Defensive Senior Transport Certified"
    },
    "vehicle": {
      "type": "van",
      "th": "รถตู้ VIP พร้อมทางลาดไฮดรอลิกสำหรับวีลแชร์และเข็มขัดนิรภัย 4 จุด",
      "en": "VIP Commuter Van with hydraulic wheelchair lift and 4-point safety harness"
    },
    "serviceAreas": [
      { "th": "กรุงเทพมหานครและปริมณฑล, นนทบุรี, สมุทรปราการ, ปทุมธานี", "en": "Bangkok Metro, Nonthaburi, Samut Prakan, Pathum Thani" }
    ],
    "bio": {
      "th": "คนขับรถและผู้ช่วยดูแลผู้สูงอายุ ขับรถนุ่มนวล ปลอดภัย มีรถตู้พร้อมทางลาดขึ้นวีลแชร์ เหมาะสำหรับการพาผู้สูงอายุไปร่วมงานมงคล งานรวมญาติ หรือเดินทางต่างจังหวัด",
      "en": "Senior transportation specialist with wheelchair-ramp van. Smooth, defensive driving style ideal for family weddings, banquets, and out-of-town gatherings."
    },
    "availableSlots": ["Everyday with 24h notice"],
    "reviews": [
      {
        "id": "rev-501",
        "reviewerName": "ประเสริฐ ชัยยศ",
        "relationship": { "th": "บุตรชาย", "en": "Son" },
        "rating": 4.8,
        "date": "2026-07-15",
        "comment": {
          "th": "ลุงรักษ์ขับรถนิ่มมาก พาคุณพ่อไปร่วมงานแต่งหลานที่ต่างจังหวัด ช่วยพยุงขึ้นลงรถอย่างระมัดระวัง",
          "en": "Uncle Rak drove very smoothly. Escorted dad to a family wedding in the countryside safely."
        }
      }
    ]
  }
]
```

---

#### File 2: `src/data/bookings.json`
Contains 3 sample bookings (2 upcoming, 1 past):
- `bk-001` (Upcoming): Hospital escort to Siriraj Hospital on 2026-08-26 with Nurse Areeya Rattanakul (`ct-002`)
- `bk-002` (Upcoming): Lumpini Park stroll on 2026-08-30 with Ploy Chidchanok (`ct-003`)
- `bk-003` (Past/Completed): Knee injection & follow-up at Phramongkutklao Hospital on 2026-08-14 with Somchai Prasert (`ct-001`), with completed review.

```json
[
  {
    "id": "bk-001",
    "status": "upcoming",
    "caretakerId": "ct-002",
    "caretakerName": {
      "th": "พว. อารียา รัตนกุล (อารี)",
      "en": "Nurse Areeya Rattanakul"
    },
    "caretakerNickname": { "th": "อารี", "en": "Aree" },
    "caretakerPhoto": "https://images.unsplash.com/photo-1594824813589-cf722bda7ec1?w=500&auto=format&fit=crop&q=80",
    "caretakerPhone": "089-123-4567",
    "elderId": "elder-001",
    "elderName": {
      "th": "นางสมพร ใจดี",
      "en": "Grandma Somporn Jaidee"
    },
    "serviceDate": "2026-08-26",
    "timeSlot": "08:30 - 12:30",
    "durationHours": 4,
    "activityType": "hospital",
    "activityTitle": {
      "th": "พาพบแพทย์ตรวจสุขภาพ & รับยาประจำตัว รพ.ศิริราช",
      "en": "Doctor Appointment & Prescription Refill Escort at Siriraj Hospital"
    },
    "destinationName": {
      "th": "โรงพยาบาลศิริราช (อาคารนวมินทรบพิตร ๘๔ พรรษา)",
      "en": "Siriraj Hospital (Navamindrapobitr 84th Anniversary Bldg)"
    },
    "destinationAddress": {
      "th": "2 ถนนวังหลัง แขวงศิริราช เขตบางกอกน้อย กรุงเทพฯ 10700",
      "en": "2 Wanglang Rd, Siriraj, Bangkok Noi, Bangkok 10700"
    },
    "pickupAddress": {
      "th": "128/4 ซอยสุขุมวิท 39 แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ 10110",
      "en": "128/4 Sukhumvit 39, Khlong Tan Nuea, Watthana, Bangkok 10110"
    },
    "hourlyRate": 450,
    "basePrice": 1800,
    "serviceFee": 100,
    "discount": 0,
    "totalPrice": 1900,
    "paymentMethod": "promptpay",
    "paymentMethodName": {
      "th": "พร้อมเพย์ QR Code",
      "en": "PromptPay QR Code"
    },
    "paymentStatus": "paid",
    "meetingPoint": {
      "th": "จุดรับส่งผู้ป่วย ชั้น 1 อาคารนวมินทรบพิตร ๘๔ พรรษา",
      "en": "Patient Drop-off Point, 1st Floor, Navamindrapobitr Bldg"
    },
    "notes": {
      "th": "มีนัดพบแพทย์อายุรกรรมเวลา 09:30 น. และตรวจเลือด คุณยายต้องงดน้ำงดอาหารหลังเที่ยงคืน มีสมุดประจำตัวผู้ป่วยเตรียมไว้ให้แล้ว",
      "en": "Internal medicine consult at 09:30 AM with blood test. Fasting required after midnight. Patient medical handbook prepared."
    },
    "hasReview": false
  },
  {
    "id": "bk-002",
    "status": "upcoming",
    "caretakerId": "ct-003",
    "caretakerName": {
      "th": "พลอย ชิดชนก วงศ์สวัสดิ์",
      "en": "Ploy Chidchanok"
    },
    "caretakerNickname": { "th": "พลอย", "en": "Ploy" },
    "caretakerPhoto": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80",
    "caretakerPhone": "086-987-6543",
    "elderId": "elder-001",
    "elderName": {
      "th": "นางสมพร ใจดี",
      "en": "Grandma Somporn Jaidee"
    },
    "serviceDate": "2026-08-30",
    "timeSlot": "07:00 - 10:00",
    "durationHours": 3,
    "activityType": "park",
    "activityTitle": {
      "th": "เดินเล่นรับลมยามเช้า & กายภาพบำบัดเบาๆ สวนลุมพินี",
      "en": "Morning Fresh Air Stroll & Gentle Exercise at Lumpini Park"
    },
    "destinationName": {
      "th": "สวนลุมพินี (ประตู 1 ด้านถนนพระราม 4)",
      "en": "Lumpini Park (Gate 1, Rama IV Road)"
    },
    "destinationAddress": {
      "th": "ถนนพระรามที่ 4 แขวงลุมพินี เขตปทุมวัน กรุงเทพฯ 10330",
      "en": "Rama IV Rd, Lumphini, Pathum Wan, Bangkok 10330"
    },
    "pickupAddress": {
      "th": "128/4 ซอยสุขุมวิท 39 แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ 10110",
      "en": "128/4 Sukhumvit 39, Khlong Tan Nuea, Watthana, Bangkok 10110"
    },
    "hourlyRate": 320,
    "basePrice": 960,
    "serviceFee": 100,
    "discount": 0,
    "totalPrice": 1060,
    "paymentMethod": "promptpay",
    "paymentMethodName": {
      "th": "พร้อมเพย์ QR Code",
      "en": "PromptPay QR Code"
    },
    "paymentStatus": "paid",
    "meetingPoint": {
      "th": "ลานจอดรถประตู 1 สวนลุมพินี",
      "en": "Gate 1 Parking Lot, Lumpini Park"
    },
    "notes": {
      "th": "พาเดินรับแสงแดดยามเช้า พักผ่อนและช่วยพยุงเดิน 15-20 นาที สลับกับนั่งพักชมวิวริมน้ำ เตรียมน้ำดื่มอุณหภูมิห้องไปด้วยครับ",
      "en": "Morning sunshine stroll, assisted walking for 15-20 mins alternating with seated lakeside rest. Room-temp drinking water prepared."
    },
    "hasReview": false
  },
  {
    "id": "bk-003",
    "status": "completed",
    "caretakerId": "ct-001",
    "caretakerName": {
      "th": "สมชาย ประเสริฐ",
      "en": "Somchai Prasert"
    },
    "caretakerNickname": { "th": "สมชาย", "en": "Somchai" },
    "caretakerPhoto": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
    "caretakerPhone": "081-234-5678",
    "elderId": "elder-001",
    "elderName": {
      "th": "นางสมพร ใจดี",
      "en": "Grandma Somporn Jaidee"
    },
    "serviceDate": "2026-08-14",
    "timeSlot": "08:00 - 12:00",
    "durationHours": 4,
    "activityType": "hospital",
    "activityTitle": {
      "th": "ติดตามอาการโรคข้อเข่า & ฉีดยา รพ.พระมงกุฎเกล้า",
      "en": "Knee Osteoarthritis Follow-up & Joint Injection at Phramongkutklao Hospital"
    },
    "destinationName": {
      "th": "โรงพยาบาลพระมงกุฎเกล้า (อาคารเฉลิมพระเกียรติ)",
      "en": "Phramongkutklao Hospital (Chaloem Phra Kiat Bldg)"
    },
    "destinationAddress": {
      "th": "315 ถนนราชวิถี แขวงทุ่งพญาไท เขตราชเทวี กรุงเทพฯ 10400",
      "en": "315 Ratchawithi Rd, Thung Phaya Thai, Ratchathewi, Bangkok 10400"
    },
    "pickupAddress": {
      "th": "128/4 ซอยสุขุมวิท 39 แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ 10110",
      "en": "128/4 Sukhumvit 39, Khlong Tan Nuea, Watthana, Bangkok 10110"
    },
    "hourlyRate": 350,
    "basePrice": 1400,
    "serviceFee": 100,
    "discount": 150,
    "totalPrice": 1350,
    "paymentMethod": "credit_card",
    "paymentMethodName": {
      "th": "บัตรเครดิต",
      "en": "Credit Card"
    },
    "paymentStatus": "paid",
    "meetingPoint": {
      "th": "หน้าแผนกกระดูกและข้อ ชั้น 3",
      "en": "Orthopedic Clinic, 3rd Floor"
    },
    "notes": {
      "th": "ฉีดยาข้อเข่าเสร็จสิ้นเรียบร้อย คุณสมชายช่วยเข็นวีลแชร์และรอรับยาครบถ้วน ส่งคุณแม่กลับถึงบ้านอย่างปลอดภัย",
      "en": "Knee joint injection completed smoothly. Somchai handled wheelchair navigation and pharmacy pickup."
    },
    "hasReview": true,
    "reviewRating": 5,
    "reviewText": {
      "th": "คุณสมชายดูแลคุณแม่ดีมากครับ คอยประคองและประสานงานห้องตรวจ รพ.พระมงกุฎเกล้า ได้อย่างรวดเร็ว คุณแม่ไม่เหนื่อยเลย แนะนำเลยครับ",
      "en": "Khun Somchai was wonderful with my mother at Phramongkutklao Hospital. Extremely attentive and efficient. Highly recommended!"
    }
  }
]
```

---

#### File 3: `src/data/activities.json`
Contains 4 featured activities for the homepage and search flows:
- `act-hospital`: Hospital & Medical Escort (พาพบแพทย์ & รับยา)
- `act-park`: Park Stroll & Gentle Exercise (เดินเล่นสวน & กายภาพ)
- `act-shopping`: Grocery & Shopping (ซื้อของ & ช็อปปิ้ง)
- `act-social`: Social & Cafe Outing (ร้านอาหาร & งานสังคม)

```json
[
  {
    "id": "act-hospital",
    "type": "hospital",
    "title": { "th": "พาพบแพทย์ & รับยา", "en": "Hospital & Medical Escort" },
    "subtitle": { "th": "ยอดนิยมอันดับ 1", "en": "Most Popular #1" },
    "description": {
      "th": "ช่วยเข็นวีลแชร์ รอคิวพบแพทย์ จดบันทึกคำสั่งแพทย์ ประสานงานรับยา และพาเดินทางกลับบ้านอย่างปลอดภัย",
      "en": "Dedicated wheelchair assistance, OPD queue management, doctor instruction notes, and safe pharmacy pickup."
    },
    "priceEstimate": { "th": "฿350 - ฿500 / ชม.", "en": "฿350 - ฿500 / hr" },
    "avgDuration": { "th": "3 - 5 ชั่วโมง", "en": "3 - 5 Hours" },
    "icon": "Stethoscope",
    "badgeColor": "bg-sky-100 text-sky-700 border-sky-200",
    "gradient": "from-sky-500 to-blue-600",
    "image": "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80",
    "highlights": [
      { "th": "ผู้ช่วยพยาบาล & ผู้ผ่านการอบรม", "en": "Certified nurse assistants" },
      { "th": "จดรายงานพบแพทย์ส่งผู้ปกครอง", "en": "Detailed medical notes for guardians" },
      { "th": "เชี่ยวชาญ รพ.รัฐและเอกชนชั้นนำ", "en": "Familiar with major hospital procedures" }
    ]
  },
  {
    "id": "act-park",
    "type": "park",
    "title": { "th": "เดินเล่นสวน & กายภาพ", "en": "Park Stroll & Exercise" },
    "subtitle": { "th": "สดชื่น แข็งแรง", "en": "Fresh Air & Vitality" },
    "description": {
      "th": "สูดอากาศบริสุทธิ์ในสวนสาธารณะ เดินออกกำลังกายเบาๆ ช่วยพยุงและฟื้นฟูกล้ามเนื้ออย่างปลอดภัย",
      "en": "Gentle walking in botanical parks, guided mobility exercises, and refreshing outdoor strolls."
    },
    "priceEstimate": { "th": "฿300 - ฿400 / ชม.", "en": "฿300 - ฿400 / hr" },
    "avgDuration": { "th": "2 - 4 ชั่วโมง", "en": "2 - 4 Hours" },
    "icon": "Trees",
    "badgeColor": "bg-emerald-100 text-emerald-700 border-emerald-200",
    "gradient": "from-emerald-500 to-teal-600",
    "image": "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=600&auto=format&fit=crop&q=80",
    "highlights": [
      { "th": "ช่วยพยุงและเข็นวีลแชร์ในสวน", "en": "Park & garden wheelchair guide" },
      { "th": "ชวนคุยสนุกสนาน สดชื่นไม่เหงา", "en": "Engaging, cheerful companionship" },
      { "th": "ดูแลความปลอดภัยทุกย่างก้าว", "en": "Step-by-step gait & balance support" }
    ]
  },
  {
    "id": "act-shopping",
    "type": "shopping",
    "title": { "th": "ซื้อของ & ช็อปปิ้ง", "en": "Grocery & Shopping" },
    "subtitle": { "th": "สะดวก สบายใจ", "en": "Convenient & Easy" },
    "description": {
      "th": "พาเลือกซื้อของสด สินค้าสุขภาพ ช่วยถือของและเข็นรถเข็นในห้างสรรพสินค้าและตลาดอย่างคล่องตัว",
      "en": "Assistance with supermarket shopping, selecting healthy groceries, cart pushing, and package carrying."
    },
    "priceEstimate": { "th": "฿300 - ฿400 / ชม.", "en": "฿300 - ฿400 / hr" },
    "avgDuration": { "th": "2 - 4 ชั่วโมง", "en": "2 - 4 Hours" },
    "icon": "ShoppingBag",
    "badgeColor": "bg-amber-100 text-amber-700 border-amber-200",
    "gradient": "from-amber-500 to-orange-600",
    "image": "https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=600&auto=format&fit=crop&q=80",
    "highlights": [
      { "th": "ช่วยเข็นรถเข็นและถือถุงของ", "en": "Cart pushing & package handling" },
      { "th": "ช่วยเลือกซื้อวัตถุดิบสุขภาพ", "en": "Healthy grocery selection support" },
      { "th": "ดูแลในพื้นที่ปรับอากาศเย็นสบาย", "en": "Comfortable indoor mall escort" }
    ]
  },
  {
    "id": "act-social",
    "type": "social",
    "title": { "th": "ร้านอาหาร & งานสังคม", "en": "Social & Cafe Outing" },
    "subtitle": { "th": "คลายเหงา อบอุ่น", "en": "Joyful & Connected" },
    "description": {
      "th": "พาไปจิบกาแฟ ทานอาหารมื้อโปรด หรือร่วมงานแต่ง งานเลี้ยงสังสรรค์ ให้ท่านได้พบปะผู้คนอย่างมีความสุข",
      "en": "Pleasant cafe visits, favorite meals, or family weddings and gatherings with dedicated companion care."
    },
    "priceEstimate": { "th": "฿350 - ฿450 / ชม.", "en": "฿350 - ฿450 / hr" },
    "avgDuration": { "th": "3 - 6 ชั่วโมง", "en": "3 - 6 Hours" },
    "icon": "Coffee",
    "badgeColor": "bg-purple-100 text-purple-700 border-purple-200",
    "gradient": "from-purple-500 to-indigo-600",
    "image": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&auto=format&fit=crop&q=80",
    "highlights": [
      { "th": "แต่งกายสุภาพถูกกาลเทศะ", "en": "Polite and formal event attire" },
      { "th": "ดูแลเรื่องอาหารและห้องน้ำ", "en": "Restroom and mealtime assistance" },
      { "th": "ให้ผู้สูงอายุร่วมงานอย่างมั่นใจ", "en": "Confidence and dignity for seniors" }
    ]
  }
]
```

---

#### File 4: `src/data/elder.json`
Contains Grandma Somporn (นางสมพร ใจดี, 74 yrs, mobility assistance, mild hypertension, preferred language Thai/Isan, emergency contact):

```json
{
  "id": "elder-001",
  "name": {
    "th": "นางสมพร ใจดี",
    "en": "Grandma Somporn Jaidee"
  },
  "nickname": {
    "th": "ยายพร",
    "en": "Grandma Porn"
  },
  "age": 74,
  "gender": "female",
  "bloodType": "O+",
  "photo": "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=500&auto=format&fit=crop&q=80",
  "relationship": {
    "th": "คุณแม่",
    "en": "Mother"
  },
  "guardian": {
    "name": {
      "th": "นายธนกร ใจดี",
      "en": "Thanakorn Jaidee"
    },
    "relationship": {
      "th": "บุตรชาย",
      "en": "Son"
    },
    "phone": "081-987-6543",
    "email": "thanakorn.j@gmail.com"
  },
  "emergencyContact": {
    "name": {
      "th": "นายธนกร ใจดี",
      "en": "Thanakorn Jaidee"
    },
    "relation": {
      "th": "บุตรชาย",
      "en": "Son"
    },
    "phone": "081-987-6543",
    "secondaryPhone": "02-345-6789"
  },
  "address": {
    "th": "128/4 ซอยสุขุมวิท 39 แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ 10110",
    "en": "128/4 Sukhumvit 39, Khlong Tan Nuea, Watthana, Bangkok 10110"
  },
  "mobilityLevel": "wheelchair_assisted",
  "mobilityText": {
    "th": "ต้องการคนช่วยพยุง / ใช้วีลแชร์เมื่อเดินทางไกล",
    "en": "Assisted walking / Wheelchair for long distances"
  },
  "medicalConditions": [
    "hypertension",
    "diabetes_type_2",
    "knee_osteoarthritis"
  ],
  "medicalConditionsList": [
    {
      "th": "ความดันโลหิตสูง (ทานยาทุกเช้า)",
      "en": "Hypertension (Morning Medication)"
    },
    {
      "th": "เบาหวานชนิดที่ 2 (คุมอาหาร)",
      "en": "Type 2 Diabetes (Diet Controlled)"
    },
    {
      "th": "ข้อเข่าเสื่อมระยะเริ่มต้น (เดินช้าๆ)",
      "en": "Early Stage Knee Osteoarthritis (Slow Walker)"
    }
  ],
  "allergies": {
    "th": "แพ้ยาเพนิซิลลิน (Penicillin), อาหารทะเลที่มีเปลือก",
    "en": "Penicillin allergy, Shellfish"
  },
  "medications": {
    "th": "Amlodipine 5mg (หลังอาหารเช้า 1 เม็ด), Metformin 500mg (หลังอาหารเช้า-เย็น)",
    "en": "Amlodipine 5mg (1 tab post-breakfast), Metformin 500mg (post-breakfast & dinner)"
  },
  "preferredHospital": {
    "th": "โรงพยาบาลศิริราช / โรงพยาบาลจุฬาลงกรณ์",
    "en": "Siriraj Hospital / Chulalongkorn Hospital"
  },
  "hospitalHn": "HN-5948201",
  "dietaryPreferences": {
    "th": "อาหารรสอ่อน โซเดียมต่ำ หวานน้อย ไม่ทานเนื้อวัว ชอบดื่มน้ำอุ่น",
    "en": "Low sodium, low sugar, no beef, prefers warm water"
  },
  "religion": {
    "th": "พุทธ (ชอบสวดมนต์และไหว้พระตอนเช้า)",
    "en": "Buddhism (Enjoys morning chanting and temple merit)"
  },
  "preferredLanguages": ["Thai", "Isan"],
  "preferredDialect": {
    "th": "ภาษาไทยกลาง / ภาษาอีสาน",
    "en": "Central Thai / Isan Dialect"
  },
  "specialNotes": {
    "th": "คุณยายเดินได้เองระยะสั้น 50-100 เมตร หากเดินทางไกลต้องใช้วีลแชร์ ไม่ชอบที่อากาศร้อนจัดและเสียงดัง ชอบคนพูดจาเพราะและสุภาพ",
    "en": "Can walk short distances (50-100m). Needs wheelchair for longer outings. Sensitive to heat and loud noise. Appreciates gentle and polite conversations."
  }
}
```

---

### 2.4 AppContext Implementation Design

#### File: `src/context/AppContext.jsx`
Manages global reactive state across the entire application:
- `elder`: initialized with Grandma Somporn, updated reactively when edited in `/elder-profile`.
- `bookings`: initialized with 3 sample bookings, updated when a booking is created or cancelled, and supports adding reviews.
- `searchCriteria`: stores active search query from the 3-step wizard in `/find` (with defaults for mobility, conditions, activity, date, time, duration, budget, etc.), updated via `updateSearchCriteria` or `resetSearchCriteria`.
- `caretakers`: array of 5 caretaker profiles.
- `activities`: array of 4 featured activities.

```javascript
import React, { createContext, useContext, useState, useEffect } from 'react';
import initialCaretakers from '../data/caretakers.json';
import initialBookings from '../data/bookings.json';
import initialActivities from '../data/activities.json';
import initialElder from '../data/elder.json';

export const AppContext = createContext();

const defaultSearchCriteria = {
  mobility: 'wheelchair_assisted',
  conditions: ['hypertension', 'diabetes_type_2', 'knee_osteoarthritis'],
  needsMedicationReminder: true,
  specialCareType: 'none',
  activityType: 'hospital',
  language: 'Thai',
  religion: 'Buddhism',
  dietary: 'low_sodium',
  genderPref: 'any',
  date: '2026-08-28',
  timeSlot: 'morning',
  durationHours: 4,
  budgetMax: 500,
  pickupAddress: '128/4 ซอยสุขุมวิท 39 แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ 10110',
  destination: 'โรงพยาบาลศิริราช อาคารนวมินทรบพิตร ๘๔ พรรษา',
  specialNotes: 'คุณยายเดินช้าและใช้วีลแชร์ ต้องการคนช่วยถือของและคอยดูแลเรื่องคิวพบแพทย์'
};

export const AppProvider = ({ children }) => {
  // 1. Elder Profile State
  const [elder, setElder] = useState(() => {
    try {
      const saved = localStorage.getItem('looklarn_elder');
      return saved ? JSON.parse(saved) : initialElder;
    } catch {
      return initialElder;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('looklarn_elder', JSON.stringify(elder));
    } catch (e) {
      console.warn('Unable to persist elder profile to localStorage', e);
    }
  }, [elder]);

  const updateElderProfile = (updatedFields) => {
    setElder(prev => ({
      ...prev,
      ...updatedFields
    }));
  };

  // 2. Bookings State
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('looklarn_bookings');
      return saved ? JSON.parse(saved) : initialBookings;
    } catch {
      return initialBookings;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('looklarn_bookings', JSON.stringify(bookings));
    } catch (e) {
      console.warn('Unable to persist bookings to localStorage', e);
    }
  }, [bookings]);

  const addBooking = (newBookingData) => {
    const newId = `bk-${String(Date.now()).slice(-4)}`;
    const formattedBooking = {
      id: newId,
      status: 'upcoming',
      serviceDate: newBookingData.serviceDate || new Date().toISOString().split('T')[0],
      timeSlot: newBookingData.timeSlot || '09:00 - 13:00',
      durationHours: newBookingData.durationHours || 4,
      activityType: newBookingData.activityType || 'hospital',
      activityTitle: newBookingData.activityTitle || {
        th: 'บริการพาพบแพทย์และดูแลผู้สูงอายุ',
        en: 'Senior Escort & Medical Outing Service'
      },
      caretakerId: newBookingData.caretakerId,
      caretakerName: newBookingData.caretakerName,
      caretakerNickname: newBookingData.caretakerNickname,
      caretakerPhoto: newBookingData.caretakerPhoto,
      caretakerPhone: newBookingData.caretakerPhone || '089-000-1122',
      elderId: elder.id,
      elderName: elder.name,
      destinationName: newBookingData.destinationName || {
        th: newBookingData.destination || 'จุดหมายปลายทางตามที่นัดหมาย',
        en: newBookingData.destination || 'Selected Destination'
      },
      destinationAddress: newBookingData.destinationAddress || {
        th: newBookingData.destination || 'กรุงเทพมหานคร',
        en: newBookingData.destination || 'Bangkok'
      },
      pickupAddress: newBookingData.pickupAddress || elder.address,
      hourlyRate: newBookingData.hourlyRate || 350,
      basePrice: newBookingData.basePrice || (newBookingData.hourlyRate || 350) * (newBookingData.durationHours || 4),
      serviceFee: 100,
      discount: newBookingData.discount || 0,
      totalPrice: newBookingData.totalPrice || ((newBookingData.hourlyRate || 350) * (newBookingData.durationHours || 4) + 100 - (newBookingData.discount || 0)),
      paymentMethod: newBookingData.paymentMethod || 'promptpay',
      paymentMethodName: newBookingData.paymentMethodName || {
        th: 'พร้อมเพย์ QR Code',
        en: 'PromptPay QR Code'
      },
      paymentStatus: 'paid',
      meetingPoint: newBookingData.meetingPoint || {
        th: 'จุดนัดพบตามที่ระบุ',
        en: 'Designated Meeting Point'
      },
      notes: newBookingData.notes || {
        th: newBookingData.specialNotes || 'ดูแลด้วยความระมัดระวัง',
        en: newBookingData.specialNotes || 'Please handle with care'
      },
      hasReview: false
    };

    setBookings(prev => [formattedBooking, ...prev]);
    return formattedBooking;
  };

  const cancelBooking = (bookingId) => {
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    );
  };

  const addReview = (bookingId, { rating, comment_th, comment_en }) => {
    setBookings(prev =>
      prev.map(b => {
        if (b.id === bookingId) {
          return {
            ...b,
            hasReview: true,
            reviewRating: rating,
            reviewText: {
              th: comment_th || 'บริการดีมาก สุภาพและตรงเวลา',
              en: comment_en || 'Excellent companion, polite and punctual.'
            }
          };
        }
        return b;
      })
    );
  };

  // 3. Search Criteria & Filter State
  const [searchCriteria, setSearchCriteria] = useState(defaultSearchCriteria);

  const updateSearchCriteria = (fields) => {
    setSearchCriteria(prev => ({
      ...prev,
      ...fields
    }));
  };

  const resetSearchCriteria = () => {
    setSearchCriteria(defaultSearchCriteria);
  };

  // 4. Caretakers & Activities Static Accessors
  const [caretakers] = useState(initialCaretakers);
  const [activities] = useState(initialActivities);

  const getCaretakerById = (id) => {
    return caretakers.find(c => String(c.id) === String(id)) || null;
  };

  const getBookingById = (id) => {
    return bookings.find(b => String(b.id) === String(id)) || null;
  };

  return (
    <AppContext.Provider
      value={{
        elder,
        updateElderProfile,
        bookings,
        addBooking,
        cancelBooking,
        addReview,
        searchCriteria,
        updateSearchCriteria,
        resetSearchCriteria,
        caretakers,
        activities,
        getCaretakerById,
        getBookingById
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
```

---

## 3. Caveats

1. **In-Memory Volatility & LocalStorage Hydration**:
   While the prototype is client-only (no backend API), `localStorage` syncing has been included in both `LanguageContext` and `AppContext` to ensure that reviewer edits (such as updating Grandma Somporn's name, adding a new booking, or writing a review) survive browser tab refreshes during live pitch evaluations.
2. **Top 3 Match Scores Determinism**:
   The prompt and acceptance criteria require scores 96%, 88%, and 81% on the match cards. Caretakers `ct-001`, `ct-002`, and `ct-003` are hardcoded with these exact match scores so that regardless of wizard filter inputs, the prototype always surfaces the top 3 cards with the required 96%, 88%, and 81% rings and the "Best Match" badge on the top card.
3. **External Placeholder Image Fallbacks**:
   High-resolution Unsplash images are specified for avatars and activity banners. Components consuming these image URLs should employ fallback SVG avatars or `onError` handlers to guarantee clean presentation even if network connectivity is intermittent.
4. **Key Parity Enforcement**:
   Both `th.js` and `en.js` must remain strictly symmetrical. The `t()` function includes a cross-language fallback mechanism so that even if a developer introduces a new key in one file, the application gracefully displays the alternate language without crashing.

---

## 4. Conclusion

The i18n subsystem, mock datasets, and AppContext state design are fully synthesized and ready for implementer execution in Milestone M1:
- **i18n Architecture**: Provides `src/i18n/th.js`, `src/i18n/en.js`, `src/i18n/index.js`, and `src/context/LanguageContext.jsx` with dot-notated lookup `t(key, params)`, language toggle pill support (`TH | EN`), and zero mixed-language strings.
- **Mock Datasets**:
  - `caretakers.json`: 5 detailed caregiver profiles featuring Somchai (96%), Nurse Aree (88%), Ploy (81%), Fa (76%), Uncle Rak (72%) with complete verification badges, hourly rates, bilingual bios, and reviews.
  - `bookings.json`: 3 realistic bookings (2 upcoming: Siriraj Hospital, Lumpini Park; 1 past: Phramongkutklao Hospital with review).
  - `activities.json`: 4 featured homepage activities (Hospital Escort, Park & Exercise, Grocery Shopping, Social Outing).
  - `elder.json`: Grandma Somporn (นางสมพร ใจดี, 74 yrs, wheelchair assisted, hypertension, emergency contacts).
- **AppContext**: Provides unified reactive state management (`elder`, `bookings`, `searchCriteria`, `caretakers`, `activities`) with `addBooking`, `cancelBooking`, `addReview`, `updateElderProfile`, and `updateSearchCriteria`.

---

## 5. Verification Method

To independently verify the implementation:

1. **Symmetry & Completeness Verification**:
   - Compare all keys in `src/i18n/th.js` vs `src/i18n/en.js` using a key-matching script or test:
     ```javascript
     const thKeys = JSON.stringify(Object.keys(th).sort());
     const enKeys = JSON.stringify(Object.keys(en).sort());
     expect(thKeys).toEqual(enKeys);
     ```
2. **Match Score & Data Verification**:
   - Verify `caretakers.json` contains 5 items, with top scores `96`, `88`, `81`.
   - Verify `bookings.json` contains 3 items (2 with `status: 'upcoming'`, 1 with `status: 'completed'`).
   - Verify `elder.json` has `name.th === "นางสมพร ใจดี"` and `age === 74`.
3. **Language Switch Reactivity**:
   - Calling `toggleLanguage()` toggles `language` between `'th'` and `'en'` and updates `document.documentElement.lang`.
4. **State Transition Verification**:
   - Calling `addBooking(draft)` prepends a new booking item with `status: 'upcoming'` and persists to `localStorage`.
   - Calling `cancelBooking(id)` marks the target booking as `'cancelled'`.
   - Calling `updateElderProfile({ age: 75 })` reactively updates `elder.age`.
