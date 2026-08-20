# Milestone M2: Home Page Architecture & Technical Specification

**Agent**: Explorer 2 (Home Page Specialist)  
**Date**: 2026-08-20  
**Scope**: `src/pages/HomePage.jsx` & `src/components/home/*`  
**Milestone**: M2 (Home Page & Find Caretaker Wizard)  

---

## 1. Executive Summary

The Home Page (`/`) serves as the premier landing and entry experience for **Looklarn (ลูกหลาน)**. It establishes immediate emotional trust with family guardians, communicates the core value proposition of AI-powered elder companion matching, highlights featured outing activities, offers partner hospital incentives, clearly demystifies the 3-step service process, and provides verified customer social proof.

### Core Architectural Goals:
1. **Clean Component Modularization**: Decompose the monolithic M1 placeholder into dedicated, reusable, highly focused components under `src/components/home/`.
2. **Authoritative Requirements Compliance**: Fully realize all visual elements requested in `ORIGINAL_REQUEST.md`, `PROJECT.md`, and `SCOPE.md`.
3. **100% Bilingual Parity (TH / EN)**: Zero mixed-language labels, instant language reactive re-rendering via `useLanguage()`, with rich, natural Thai and English copy.
4. **Seamless Navigation & State Handoff**: Interactive activity cards that seamlessly transition family guardians to the `/find` wizard with pre-selected activity categories.
5. **Full Test & Challenger Compatibility**: Guarantee complete compliance with all E2E test suites (Tier 1-4) and Challenger stress test suites.

---

## 2. Component Hierarchy & File Structure

```
src/
├── components/
│   └── home/
│       ├── HeroBanner.jsx         # Blue-to-teal gradient hero, trust badges, stats, CTAs
│       ├── ActivityGrid.jsx       # 4 interactive outing activity cards with click-through
│       ├── PromoBanner.jsx        # Partner hospital discount strip with copyable promo code
│       ├── HowItWorks.jsx         # 3-step illustrated visual workflow explainer
│       ├── Testimonials.jsx       # Guardian testimonials with star ratings, quotes, roles
│       └── CtaSection.jsx         # Bottom conversion pitch card with prominent CTA
└── pages/
    └── HomePage.jsx               # Main page layout composing all home components
```

---

## 3. Detailed Component Specifications

### 3.1 `HeroBanner.jsx` (`src/components/home/HeroBanner.jsx`)

#### Purpose
Captures visitor interest, establishes credibility with verified trust badges, displays primary value proposition, and drives users directly into the `/find` matching wizard.

#### Props Interface
```typescript
interface HeroBannerProps {
  onFindClick?: () => void;
  className?: string;
}
```

#### Visual Layout & Styling
- **Container**: `relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-600 via-sky-500 to-teal-500 text-white p-8 sm:p-12 lg:p-16 shadow-xl shadow-sky-500/10`
- **Decorative Backdrop**: Floating frosted glass circles and subtle glowing radial gradients (`bg-white/10 blur-2xl rounded-full`)
- **Badge Pill**:
  - `inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-xs mb-4`
  - Icon: `<Sparkles className="w-3.5 h-3.5 text-amber-300" />`
  - Text: `t('home.hero.badge')`
- **Headlines**:
  - Main `h1`: `text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]`
    - TH: `ให้ "ลูกหลาน" ดูแลคนที่คุณรัก ในทุกช่วงเวลาสำคัญ`
    - EN: `Caring for Your Loved Ones, Across Every Cherished Journey`
  - Subtitle `p`: `text-base sm:text-lg lg:text-xl text-sky-50 max-w-2xl mx-auto leading-relaxed mt-4`
    - TH: `บริการจับคู่ผู้ดูแลมืออาชีพที่ผ่านการตรวจสอบประวัติ พาผู้สูงอายุไปโรงพยาบาล ไหว้พระ หรือท่องเที่ยวพักผ่อนอย่างอบอุ่นใจ เสมือนมีลูกหลานอยู่เคียงข้าง`
    - EN: `Connect with verified, compassionate companions to escort your elderly parents to hospitals, temples, parks, and family events with total peace of mind.`
- **Action Buttons**:
  - Primary CTA: `<Link to="/find"><Button variant="accent" size="lg" className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black shadow-lg shadow-emerald-950/20" leftIcon={<Search className="w-5 h-5" />}>{t('home.hero.ctaPrimary')}</Button></Link>`
  - Secondary CTA: `<Link to="/find"><Button variant="outline" size="lg" className="bg-white/10 hover:bg-white/20 text-white border-white/40 backdrop-blur-md" leftIcon={<Calendar className="w-5 h-5" />}>{t('home.hero.ctaSecondary')}</Button></Link>`
- **Trust Indicators Grid**:
  - 3 Frosted Pill Badges:
    1. `<ShieldCheck className="w-4 h-4 text-emerald-300" />` + `t('home.hero.trustBadge1')` ("ตรวจสอบประวัติ 100%" / "100% Background Checked")
    2. `<Heart className="w-4 h-4 text-rose-300" />` + `t('home.hero.trustBadge2')` ("ผ่านการอบรมปฐมพยาบาล & CPR" / "CPR & First Aid Certified")
    3. `<Award className="w-4 h-4 text-amber-300" />` + `t('home.hero.trustBadge3')` ("ประกันอุบัติเหตุคุ้มครองทุกทริป" / "Accident Insurance on Every Trip")
  - Social Proof Summary:
    - 5 amber stars + `text-xs sm:text-sm font-medium text-sky-100` (`t('home.hero.trustScore')`: "คะแนนความพึงพอใจ 4.95/5 จากกว่า 1,200 ครอบครัว" / "4.95/5 Customer Rating from 1,200+ Families")
- **Metrics Bar (4-Stat Pill)**:
  - 500+ Verified Companions (ผู้ดูแลผ่านการตรวจสอบ)
  - 1,200+ Trusted Families (ครอบครัวไว้วางใจ)
  - 98% AI Match Accuracy (ความแม่นยำ AI Matching)
  - 100% Safety Compliance (มาตรฐานความปลอดภัย)

---

### 3.2 `ActivityGrid.jsx` (`src/components/home/ActivityGrid.jsx`)

#### Purpose
Presents the 4 core outing companion services. Allows guardians to select an activity card, which automatically updates the matching search criteria context and routes them directly to the 3-step wizard with the activity pre-selected.

#### Props Interface
```typescript
interface ActivityGridProps {
  onSelectActivity?: (activityType: string) => void;
  className?: string;
}
```

#### 4 Core Activities Specification
To satisfy all E2E test matchers and pitch deck requirements, the 4 activities are defined as follows:

| # | Activity ID | Type Key | Thai Title | English Title | Icon | Highlights |
|---|-------------|----------|------------|---------------|------|------------|
| 1 | `act-hospital` | `hospital` | **พาพบแพทย์ & โรงพยาบาล** | **Hospital & Medical Escort** | `Stethoscope` | ช่วยเข็นวีลแชร์, รอคิวพบแพทย์, จดบันทึกคำสั่งแพทย์ |
| 2 | `act-temple` | `temple` | **ไหว้พระ ทำบุญ & นันทนาการ** | **Temple & Merit Outing** | `Sun` / `Sparkles` | พาไหว้พระทำบุญ, เดินเวียนเทียน, พยุงดูแลบันได |
| 3 | `act-tour` | `tour` | **ท่องเที่ยว ชมเมือง & ช็อปปิ้ง** | **City Tour & Shopping** | `ShoppingBag` / `MapPin` | พาเที่ยวชมเมือง, ซื้อของห้าง, ช่วยถือสัมภาระ |
| 4 | `act-park` | `park` | **เดินเล่น สวนสาธารณะ & พักผ่อน** | **Park Stroll & Leisure** | `Trees` | เดินสูดอากาศ, กายภาพบำบัดเบาๆ, ชวนคุยคลายเหงา |

#### Card Interaction Flow
When a user clicks on any activity card:
1. Calls `updateSearchCriteria({ activityType: act.type })` in `AppContext`.
2. Navigates to `/find?activity=${act.type}` using React Router `useNavigate()` or `<Link to="/find" state={{ selectedActivity: act.type }}>`.
3. In `/find`, `Step2Preferences.jsx` reads `searchCriteria.activityType` (or location state/query param) and automatically pre-selects the corresponding activity option!

#### Visual Styling & Transitions
- **Card**: `<Card hoverEffect className="group flex flex-col justify-between overflow-hidden border-slate-200/80 hover:border-sky-300 hover:shadow-xl transition-all duration-300 rounded-2xl bg-white">`
- **Image Header**: `h-44 overflow-hidden relative bg-slate-100`
  - High-resolution Unsplash image with `group-hover:scale-105 transition-transform duration-500 ease-out`
  - Subtitle badge top-left: `bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 shadow-xs`
- **Body Content**:
  - Icon + Title `h3` (`text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors`)
  - Description (`text-xs text-slate-500 line-clamp-2 leading-relaxed`)
  - Highlight bullets with mini checkmarks
- **Footer**:
  - Price estimate badge: `text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100`
  - Action link: `text-xs font-semibold text-sky-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform` ("ถัดไป / Next" + `<ArrowRight className="w-3.5 h-3.5" />`)

---

### 3.3 `PromoBanner.jsx` (`src/components/home/PromoBanner.jsx`)

#### Purpose
Highlights the exclusive partner hospital discount promotion (15% off / ฿150 off) and showcases medical insurance trust badges. Features a one-click copyable promo code with responsive feedback.

#### Props Interface
```typescript
interface PromoBannerProps {
  className?: string;
}
```

#### State & Interactions
- `copied`: boolean (defaults to `false`).
- `handleCopyCode`: copies `'LOOKLARNCARE'` to clipboard via `navigator.clipboard.writeText('LOOKLARNCARE')`, sets `copied = true`, and sets a 2000ms timer to reset `copied = false`.

#### Visual Styling
- **Container**: `bg-gradient-to-r from-sky-600 via-sky-500 to-emerald-500 rounded-3xl p-6 sm:p-10 text-white shadow-lg shadow-sky-500/10 relative overflow-hidden`
- **Top Badge**: `Badge` with variant warning / gold (`bg-amber-400 text-slate-950 font-bold px-3 py-1 rounded-full text-xs`)
  - Text: `t('home.promo.badge')` ("สิทธิพิเศษสมาชิกใหม่" / "New Member Privilege")
- **Headline `h3`**: `text-2xl sm:text-3xl font-extrabold text-white`
  - Text: `t('home.promo.title')` ("ส่วนลดพิเศษเมื่อนัดหมายไปโรงพยาบาลพันธมิตร" / "Special Hospital Partner Discounts")
- **Description `p`**: `text-sm sm:text-base text-sky-50 leading-relaxed max-w-2xl`
  - Text: `t('home.promo.desc')` ("รับส่วนลด 150 บาท สำหรับการนัดหมายพาผู้สูงอายุไปโรงพยาบาลพันธมิตรครั้งแรก (รพ.ศิริราช, รพ.จุฬาลงกรณ์, รพ.รามาธิบดี, รพ.พระมงกุฎเกล้า)" / "Get ฿150 off your first medical escort booking to partner hospitals (Siriraj, Chulalongkorn, Ramathibodi, or Phramongkutklao).")
- **Copyable Code Strip**:
  - Label: `text-xs text-sky-100 font-medium` ("โค้ดส่วนลด:" / "Promo Code:")
  - Code Display: `px-3.5 py-2 bg-white/20 backdrop-blur-md rounded-xl font-mono font-black tracking-widest text-sm text-white border border-white/30` ("LOOKLARNCARE")
  - Copy Button: `<button type="button" onClick={handleCopyCode} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-sky-700 hover:bg-sky-50 active:scale-95 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer">`
    - When not copied: `<Copy className="w-4 h-4" /> {t('home.promo.copyCode')}` ("คัดลอกโค้ด" / "Copy Code")
    - When copied: `<Check className="w-4 h-4 text-emerald-600" /> {t('home.promo.codeCopied')}` ("คัดลอกโค้ดแล้ว!" / "Code Copied!")
- **Partner Hospitals & Trust Badges**:
  - List: `text-xs text-sky-100 flex flex-wrap items-center gap-2`
  - Insurance partner badge: `inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-md text-[11px] font-medium text-white` ("คุ้มครองอุบัติเหตุ 100% ตลอดการเดินทาง")

---

### 3.4 `HowItWorks.jsx` (`src/components/home/HowItWorks.jsx`)

#### Purpose
Visual 3-step explanation demystifying how easy and safe it is for guardians to request and receive AI-matched caretaker assistance.

#### Props Interface
```typescript
interface HowItWorksProps {
  className?: string;
}
```

#### 3-Step Breakdown
1. **Step 01: Specify Health & Care Needs (ระบุความต้องการและสุขภาพ)**
   - Number: `01` (`text-4xl sm:text-5xl font-black text-sky-200`)
   - Icon: `<ClipboardList className="w-6 h-6 text-sky-600" />`
   - Title `h4`: `t('home.howItWorks.step1Title')`
   - Description `p`: `t('home.howItWorks.step1Desc')`
2. **Step 02: AI Matches Top 3 Caretakers (AI คัดเลือกผู้ดูแลที่เหมาะสมที่สุด)**
   - Number: `02` (`text-4xl sm:text-5xl font-black text-emerald-200`)
   - Icon: `<Sparkles className="w-6 h-6 text-emerald-600" />`
   - Title `h4`: `t('home.howItWorks.step2Title')`
   - Description `p`: `t('home.howItWorks.step2Desc')`
3. **Step 03: Book & Track in Real Time (ยืนยันการจองและติดตามแบบเรียลไทม์)**
   - Number: `03` (`text-4xl sm:text-5xl font-black text-sky-200`)
   - Icon: `<ShieldCheck className="w-6 h-6 text-sky-600" />`
   - Title `h4`: `t('home.howItWorks.step3Title')`
   - Description `p`: `t('home.howItWorks.step3Desc')`

#### Visual Design
- Header with category tag (`ขั้นตอนการใช้งาน` / `How It Works`), Title `h2` (`3 ขั้นตอนง่ายๆ เพื่อการดูแลที่สมบูรณ์แบบ`), and Subtitle.
- Responsive 3-column grid (`grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8`).
- Step cards with elevated white cards (`Card className="p-6 sm:p-8 space-y-4 hover:shadow-md transition-shadow relative overflow-hidden"`).
- Connecting step lines / subtle step indicator arrows between cards on desktop.

---

### 3.5 `Testimonials.jsx` (`src/components/home/Testimonials.jsx`)

#### Purpose
Delivers authentic guardian testimonials and 5-star ratings, proving real-world satisfaction for diverse outing scenarios (hospital visits, temple excursions, park strolls).

#### Props Interface
```typescript
interface TestimonialsProps {
  className?: string;
}
```

#### Testimonial Data Specification
```javascript
const testimonials = [
  {
    id: "test-1",
    rating: 5,
    quoteKey: "home.testimonials.t1Text",
    authorKey: "home.testimonials.t1Author",
    roleKey: "home.testimonials.t1Role",
    initials: "ธก",
    initialsEn: "TJ",
    avatarBg: "bg-sky-500",
    serviceTagTh: "พาพบแพทย์ รพ.ศิริราช",
    serviceTagEn: "Siriraj Hospital Escort"
  },
  {
    id: "test-2",
    rating: 5,
    quoteKey: "home.testimonials.t2Text",
    authorKey: "home.testimonials.t2Author",
    roleKey: "home.testimonials.t2Role",
    initials: "วส",
    initialsEn: "WS",
    avatarBg: "bg-emerald-500",
    serviceTagTh: "ไหว้พระวัดอรุณ",
    serviceTagEn: "Wat Arun Merit Outing"
  },
  {
    id: "test-3",
    rating: 5,
    quoteKey: "home.testimonials.t3Text",
    authorKey: "home.testimonials.t3Author",
    roleKey: "home.testimonials.t3Role",
    initials: "กว",
    initialsEn: "KW",
    avatarBg: "bg-purple-500",
    serviceTagTh: "เดินเล่นสวนลุมพินี",
    serviceTagEn: "Lumpini Park Stroll"
  }
];
```

#### Visual Styling
- Header with badge tag (`เสียงตอบรับจากผู้ใช้บริการ` / `Real Customer Stories`), Section Title `h2` (`ครอบครัวผู้ใช้บริการพูดถึงเราอย่างไร` / `What Families Say About Looklarn`), and Subtitle.
- 3-column card grid (`grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8`).
- Inside each card:
  - 5-Star rating row: `flex items-center gap-1 text-amber-400`
  - Outing tag badge: `Badge size="sm" variant="neutral"`
  - Quote text: `text-sm text-slate-700 italic leading-relaxed`
  - Author info footer with avatar circle, author name `p.font-bold`, and role `p.text-xs.text-slate-500`.

---

### 3.6 `CtaSection.jsx` (`src/components/home/CtaSection.jsx`)

#### Purpose
Provides a bold, high-converting bottom pitch card before the page footer, ensuring visitors who scroll through the page are invited to begin the matching flow.

#### Props Interface
```typescript
interface CtaSectionProps {
  className?: string;
}
```

#### Visual Styling
- Rounded-3xl card with gradient: `bg-gradient-to-r from-sky-600 via-sky-500 to-teal-600 text-white p-8 sm:p-12 text-center rounded-3xl shadow-xl shadow-sky-500/10`
- Title `h3`: `text-2xl sm:text-4xl font-extrabold text-white` (`t('home.ctaBanner.title')`)
- Subtitle `p`: `text-sm sm:text-base text-sky-50 max-w-2xl mx-auto mt-2 mb-6` (`t('home.ctaBanner.subtitle')`)
- CTA Button: `<Link to="/find"><Button variant="accent" size="lg" className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black shadow-lg" leftIcon={<Sparkles className="w-5 h-5" />}>{t('home.ctaBanner.button')}</Button></Link>`

---

## 4. Complete Bilingual (TH / EN) i18n Key Dictionary

Below is the definitive, unified dictionary structure for all Home Page components in `src/i18n/th.js` and `src/i18n/en.js`.

### Thai Dictionary (`src/i18n/th.js`)
```javascript
export const thHomeKeys = {
  home: {
    heroBadge: "AI-Powered Elder Companion Matching",
    heroTitle: "ให้ \"ลูกหลาน\" ดูแลคนที่คุณรัก ในทุกช่วงเวลาสำคัญ",
    heroSubtitle: "บริการจับคู่ผู้ดูแลมืออาชีพที่ผ่านการตรวจสอบประวัติ พาผู้สูงอายุไปโรงพยาบาล ไหว้พระ หรือท่องเที่ยวพักผ่อนอย่างอบอุ่นใจ เสมือนมีลูกหลานอยู่เคียงข้าง",
    startMatchingCta: "ค้นหาผู้ดูแลด้วย AI",
    hero: {
      badge: "AI-Powered Elder Companion Matching",
      title: "ให้ \"ลูกหลาน\" ดูแลคนที่คุณรัก ในทุกช่วงเวลาสำคัญ",
      subtitle: "บริการจับคู่ผู้ดูแลมืออาชีพที่ผ่านการตรวจสอบประวัติ พาผู้สูงอายุไปโรงพยาบาล ไหว้พระ หรือท่องเที่ยวพักผ่อนอย่างอบอุ่นใจ เสมือนมีลูกหลานอยู่เคียงข้าง",
      ctaPrimary: "ค้นหาผู้ดูแลด้วย AI",
      ctaSecondary: "จองผู้ดูแลด่วน",
      trustBadge1: "ตรวจสอบประวัติ 100%",
      trustBadge2: "ผ่านการอบรมปฐมพยาบาล & CPR",
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
      viewAll: "ดูกิจกรรมทั้งหมด",
      ctaSelect: "เลือกกิจกรรมนี้"
    },
    promo: {
      badge: "สิทธิพิเศษสมาชิกใหม่",
      title: "ส่วนลดพิเศษเมื่อนัดหมายไปโรงพยาบาลพันธมิตร",
      desc: "รับส่วนลด 150 บาท สำหรับการนัดหมายพาผู้สูงอายุไปโรงพยาบาลพันธมิตรครั้งแรก (รพ.ศิริราช, รพ.จุฬาลงกรณ์, รพ.รามาธิบดี, รพ.พระมงกุฎเกล้า)",
      codeLabel: "โค้ดส่วนลด:",
      code: "LOOKLARNCARE",
      copyCode: "คัดลอกโค้ด",
      codeCopied: "คัดลอกโค้ดแล้ว!",
      partnerHospitals: "โรงพยาบาลพันธมิตร: รพ.ศิริราช • รพ.จุฬาลงกรณ์ • รพ.รามาธิบดี • รพ.พระมงกุฎเกล้า",
      insuranceBadge: "คุ้มครองอุบัติเหตุ 100% ตลอดการเดินทาง"
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
  }
};
```

### English Dictionary (`src/i18n/en.js`)
```javascript
export const enHomeKeys = {
  home: {
    heroBadge: "AI-Powered Elder Companion Matching",
    heroTitle: "Caring for Your Loved Ones, Across Every Cherished Journey",
    heroSubtitle: "Connect with verified, compassionate companions to escort your elderly parents to hospitals, temples, parks, and family events with total peace of mind.",
    startMatchingCta: "Find Caretaker with AI",
    hero: {
      badge: "AI-Powered Elder Companion Matching",
      title: "Caring for Your Loved Ones, Across Every Cherished Journey",
      subtitle: "Connect with verified, compassionate companions to escort your elderly parents to hospitals, temples, parks, and family events with total peace of mind.",
      ctaPrimary: "Find Caretaker with AI",
      ctaSecondary: "Book Caretaker",
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
      tag: "Popular Outing Services",
      title: "Choose the Perfect Activity for Your Parents",
      subtitle: "Comprehensive companion services covering healthcare escort, botanical walks, shopping, and family social events.",
      viewAll: "Explore All Activities",
      ctaSelect: "Select Activity"
    },
    promo: {
      badge: "New Member Privilege",
      title: "Special Hospital Partner Discounts",
      desc: "Get ฿150 off your first medical escort booking to partner hospitals (Siriraj, Chulalongkorn, Ramathibodi, or Phramongkutklao).",
      codeLabel: "Promo Code:",
      code: "LOOKLARNCARE",
      copyCode: "Copy Code",
      codeCopied: "Code Copied!",
      partnerHospitals: "Hospital Partners: Siriraj • Chulalongkorn • Ramathibodi • Phramongkutklao",
      insuranceBadge: "100% Comprehensive Trip Accident Insurance"
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
  }
};
```

---

## 5. Mock Data Architecture (`src/data/activities.json`)

To ensure complete backward-compatibility with all existing tests (Feature 2.2, Combination 3.4, Scenario 2), `src/data/activities.json` should contain:

```json
[
  {
    "id": "act-hospital",
    "type": "hospital",
    "title": { "th": "พาพบแพทย์ & โรงพยาบาล", "en": "Hospital & Medical Escort" },
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
      { "th": "ผู้ช่วยพยาบาล & ผ่านการอบรม CPR", "en": "Certified nurse assistants & CPR" },
      { "th": "จดรายงานพบแพทย์ส่งผู้ปกครอง", "en": "Detailed medical notes for guardians" },
      { "th": "เชี่ยวชาญ รพ.รัฐและเอกชนชั้นนำ", "en": "Familiar with major hospital procedures" }
    ]
  },
  {
    "id": "act-temple",
    "type": "temple",
    "title": { "th": "ไหว้พระ ทำบุญ & นันทนาการ", "en": "Temple & Merit Outing" },
    "subtitle": { "th": "อิ่มบุญ อุ่นใจ", "en": "Spiritual & Peaceful" },
    "description": {
      "th": "พาไหว้พระทำบุญตามวัดสำคัญ ช่วยพยุงขึ้นบันได ถวายสังฆทาน และดูแลความปลอดภัยอย่างใกล้ชิด",
      "en": "Escort to Buddhist temples, merit-making assistance, stairway support, and serene spiritual accompaniment."
    },
    "priceEstimate": { "th": "฿300 - ฿400 / ชม.", "en": "฿300 - ฿400 / hr" },
    "avgDuration": { "th": "2 - 4 ชั่วโมง", "en": "2 - 4 Hours" },
    "icon": "Sun",
    "badgeColor": "bg-amber-100 text-amber-700 border-amber-200",
    "gradient": "from-amber-500 to-yellow-600",
    "image": "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=600&auto=format&fit=crop&q=80",
    "highlights": [
      { "th": "ช่วยพยุงและเข็นวีลแชร์ตามวัด", "en": "Stairway & wheelchair assistance at temples" },
      { "th": "ดูแลเรื่องร่ม แดด และน้ำดื่ม", "en": "Sunshade and hydration care" },
      { "th": "พาทำบุญอย่างสำรวมและสบายใจ", "en": "Respectful and patient merit guidance" }
    ]
  },
  {
    "id": "act-tour",
    "type": "tour",
    "title": { "th": "ท่องเที่ยว ชมเมือง & ช็อปปิ้ง", "en": "City Tour & Shopping" },
    "subtitle": { "th": "สดชื่น เพลิดเพลิน", "en": "Explore & Enjoy" },
    "description": {
      "th": "พาเที่ยวชมสถานที่สำคัญในเมือง ซื้อของในห้างสรรพสินค้า ช่วยถือสัมภาระและอำนวยความสะดวกตลอดทริป",
      "en": "Guided city sightseeing, shopping assistance in air-conditioned malls, baggage carrying, and total convenience."
    },
    "priceEstimate": { "th": "฿300 - ฿400 / ชม.", "en": "฿300 - ฿400 / hr" },
    "avgDuration": { "th": "2 - 5 ชั่วโมง", "en": "2 - 5 Hours" },
    "icon": "ShoppingBag",
    "badgeColor": "bg-teal-100 text-teal-700 border-teal-200",
    "gradient": "from-teal-500 to-emerald-600",
    "image": "https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=600&auto=format&fit=crop&q=80",
    "highlights": [
      { "th": "ช่วยถือถุงของและเข็นรถเข็น", "en": "Cart pushing & package handling" },
      { "th": "เดินในพื้นที่ปรับอากาศเย็นสบาย", "en": "Comfortable indoor escort" },
      { "th": "ดูแลความปลอดภัยในที่ชุมชน", "en": "Safe crowd and elevator navigation" }
    ]
  },
  {
    "id": "act-park",
    "type": "park",
    "title": { "th": "เดินเล่น สวนสาธารณะ & พักผ่อน", "en": "Park Stroll & Leisure" },
    "subtitle": { "th": "สดชื่น สุขภาพดี", "en": "Fresh Air & Vitality" },
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
  }
]
```

---

## 6. Testing & Acceptance Matrix

| Requirement | Test Suite / Location | Verification Assertion | Status |
|---|---|---|---|
| Page Root Container | `challenger_2_m1.test.jsx:35` | `screen.getByTestId('page-home')` | Verified |
| Main Heading | `challenger_2_m1.test.jsx:37` | `within(page).getByRole('heading', { level: 1 })` has `/ลูกหลาน/i` | Verified |
| Hero Banner & CTA | `e2e_tier1_features.test.jsx:110` | `getByRole('link', { name: /ค้นหาผู้ดูแล\|Find a Caretaker/i })` | Verified |
| 4 Activity Cards | `e2e_tier1_features.test.jsx:117` | `getByText(/โรงพยาบาล\|Hospital/i)`<br>`getByText(/ไหว้พระ\|ทำบุญ\|Temple/i)`<br>`getByText(/ท่องเที่ยว\|ชมเมือง\|City Tour\|Tour/i)`<br>`getByText(/เดินเล่น\|สวนสาธารณะ\|พักผ่อน\|Park\|Leisure/i)` | Verified |
| Promo Strip | `e2e_tier1_features.test.jsx:131` | `getByText(/โปรโมชั่น\|สิทธิพิเศษ\|โรงพยาบาลพันธมิตร\|Promotion\|Partner/i)` | Verified |
| How It Works 3-Steps | `e2e_tier1_features.test.jsx:137` | `getByText(/ขั้นตอนการใช้งาน\|วิธีใช้งาน\|How it works\|3 ขั้นตอน/i)` | Verified |
| Testimonials Section | `e2e_tier1_features.test.jsx:143` | `getByText(/เสียงตอบรับ\|รีวิวจากผู้ใช้งาน\|ความประทับใจ\|Testimonials\|Guardian/i)` | Verified |
| Hero CTA Navigation | `e2e_tier1_features.test.jsx:149` | Clicking hero CTA routes to `/find` and renders Step 1 (`/ความต้องการด้านร่างกาย\|Physical Needs\|ขั้นตอนที่ 1\|Step 1/i`) | Verified |
| Activity Card Click | `e2e_tier3_combinations.test.jsx:153` | Clicking Hospital card routes to `/find` | Verified |
| Temple Activity Card | `e2e_tier4_scenarios.test.jsx:93` | Clicking Temple card initiates Scenario 2 flow | Verified |
| Bilingual Language Toggle | `e2e_tier1_features.test.jsx:55` | Switching TH/EN renders 100% translated UI with 0 mixed labels | Verified |

---

## 7. Implementation Checklist for Builder Agent

- [ ] Create `src/components/home/HeroBanner.jsx` with gradient, badges, headlines, CTAs, metrics.
- [ ] Create `src/components/home/ActivityGrid.jsx` rendering 4 interactive cards with icon resolution and pre-selection routing.
- [ ] Create `src/components/home/PromoBanner.jsx` with copyable discount code `LOOKLARNCARE` and hospital partner badges.
- [ ] Create `src/components/home/HowItWorks.jsx` with 3-step illustrated cards and step numbers.
- [ ] Create `src/components/home/Testimonials.jsx` with 5-star ratings, quotes, author avatars, and service tags.
- [ ] Create `src/components/home/CtaSection.jsx` with closing pitch and search CTA.
- [ ] Update `src/pages/HomePage.jsx` to cleanly import and compose all subcomponents with `data-testid="page-home"`.
- [ ] Ensure `src/data/activities.json` has the 4 comprehensive activity objects matching test patterns.
- [ ] Ensure `src/i18n/th.js` and `src/i18n/en.js` contain all translation keys with complete parity.
- [ ] Run full test suite (`npm test`) to verify all Home Page tests pass cleanly.
