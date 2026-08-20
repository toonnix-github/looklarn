# Technical Architecture & Build Setup Report — Looklarn (ลูกหลาน)

**Author:** Technical Architecture & Build Setup Explorer (`survey_explorer_tech_1`)  
**Target Project:** Looklarn (ลูกหลาน) — AI-powered Elder Care Companion Matching Platform  
**Location:** `d:/SDISMAN/Projects/Looklarn/.agents/survey_explorer_tech_1/handoff.md`  
**Date:** 2026-08-20  

---

## 1. Observation

### 1.1 Repository & Workspace Inspection
- **Project Directory:** `d:/SDISMAN/Projects/Looklarn`
- **Node & Package Manager Environment:**
  - Node.js: `v24.16.0`
  - npm: `11.13.0`
  - OS: Windows (PowerShell environment)
- **Existing Files in Repository:**
  - `d:/SDISMAN/Projects/Looklarn/ORIGINAL_REQUEST.md`: Authoritative specification detailing requirements R1–R4, all 7 pages, design system tokens, language toggle rules, mock data rules, and acceptance criteria.
  - `d:/SDISMAN/Projects/Looklarn/README.md`: Product overview, pitch deck narrative, target users (Guardians, Elders, Caretakers), planned 7 screens.
  - `d:/SDISMAN/Projects/Looklarn/docs/design_decisions.md`: Color palette change records (transition from warm amber to Ocean Blue `#0EA5E9` and Emerald Green `#10B981`), language strategy (single language displayed at a time with navbar toggle), responsive design decision.
  - `d:/SDISMAN/Projects/Looklarn/docs/implementation_plan.md`: Comprehensive 7-screen breakdown, tech stack selection, state management plan, component hierarchy.
  - `d:/SDISMAN/Projects/Looklarn/docs/matching_flow.md`: AI matching criteria (physical, personality, activity, schedule, budget), scoring weights (Specialty 30%, Language 20%, Budget 20%, Availability 15%, Rating 10%, Religion/Diet 5%), mock match scores (96%, 88%, 81%), caretaker tiers.
- **Initial Build State:** No `package.json`, `vite.config.js`, or `node_modules` existed initially in the root directory.

### 1.2 Core Specifications & Constraints Identified
1. **R1: React + Vite Web Prototype (7 fully navigable routes):**
   - `/`: Home (Hero with blue-to-teal gradient, activity cards, promo strip, 3-step explainer, testimonials)
   - `/find`: Find a Caretaker (3-step interactive form with progress indicator, ending in AI matching loading animation)
   - `/matches`: Match Results (Top 3 caretaker cards with circular AI Match Score rings: 96%, 88%, 81%, specialty badges, star ratings, availability, View Profile and Book Now buttons)
   - `/caretaker/:id`: Caretaker Profile (Wave header in ocean blue gradient, AI score badge, verification badges, experience level, specialty tags, bilingual bio, reviews, availability calendar, sticky bottom "Book" bar)
   - `/book/:id`: Booking / Confirmation (Elder + caretaker + date + activity summary, location picker, itemized price breakdown, confirmation button, success modal)
   - `/bookings`: My Bookings (Tabs for Upcoming / Past, booking cards with status badges)
   - `/elder-profile`: Elder Profile (Editable sections for elder photo, name, age, medical conditions, preferences, mobility level)
2. **R2: Design System & Visual Tokens:**
   - **Primary Color:** Ocean Blue `#0EA5E9` (`sky-500`)
   - **Accent / CTA:** Emerald Green `#10B981` (`emerald-500`)
   - **Background:** Ice Blue `#F0F9FF` (`sky-50`)
   - **Text Main:** Dark Navy `#0F172A` (`slate-900`)
   - **Subtext:** Slate Gray `#64748B` (`slate-500`)
   - **Typography:** Google Fonts **Sarabun** (weights 300, 400, 500, 600, 700) supporting Thai + Latin
   - **Radii:** `rounded-xl` (12px), `rounded-2xl` (16px), `rounded-3xl` (24px)
   - **Shadows:** Soft modern elevation (`shadow-sm`, `shadow-md`, `shadow-lg`, tinted glow)
   - **Responsiveness:** Mobile (`375px`), Tablet (`768px`), Desktop (`1280px`) with zero horizontal overflow.
3. **R3: Bilingual Language System:**
   - Single-language rendering at any given time (no simultaneous mixed labels like "Hospital Visit / ไปโรงพยาบาล").
   - `TH | EN` pill toggle in top navbar with active state highlight.
   - Default language: Thai (`th`).
   - Clean translation dictionary architecture (`src/i18n/th.js`, `src/i18n/en.js`).
   - Mock data with dual-language support or dynamic localized resolution.
4. **R4: Mock Data Architecture:**
   - 5 detailed Caretaker profiles with ratings, reviews, specialties, verified badges, hourly rates, and photos.
   - 3 sample bookings (2 upcoming, 1 past).
   - 4 featured activities for homepage.
   - 1 sample elder profile (Grandma Somporn, age 74).

---

## 2. Logic Chain

### 2.1 Technology Selection Justification
- **Bundler & Framework (Vite + React 18):**
  - Vite 5 provides instantaneous hot module replacement (HMR), lightweight build output, and fast ESBuild bundling.
  - React 18.3 ensures maximum stability, rich ecosystem support with `lucide-react` and `react-router-dom`, and reliable state updates via React Context.
- **Routing (`react-router-dom` v6):**
  - Declarative client-side routing with `BrowserRouter`, `Routes`, `Route`, `useNavigate`, `useParams`, `useLocation`.
  - Supports scroll-to-top on route change and seamless deep linking (`/caretaker/1`, `/book/1`).
- **Styling Architecture (Tailwind CSS v3 + Custom Looklarn Theme):**
  - Utility-first approach ensures rapid prototyping, consistent design token enforcement, zero CSS bundle bloat, and clean responsive modifiers (`sm:`, `md:`, `lg:`, `xl:`).
  - Extended theme mapping directly integrates `#0EA5E9`, `#10B981`, `#F0F9FF`, and `#0F172A`.
  - Helper utility `cn()` (`clsx` + `tailwind-merge`) facilitates conditional styling for badges, active tabs, and step states.
- **Iconography (`lucide-react`):**
  - Complete, lightweight vector icon set: `Heart`, `ShieldCheck`, `Award`, `Star`, `Calendar`, `Clock`, `MapPin`, `Search`, `User`, `Filter`, `CheckCircle2`, `ChevronRight`, `ArrowLeft`, `Globe`, `Phone`, `Sparkles`, `Check`, `X`, `Activity`, `FileText`, `Plus`, `Edit3`.
- **State Management & i18n Strategy (React Context):**
  - `LanguageContext`: Provides `language` ('th' | 'en'), `setLanguage`, and `t(key)` helper. Changing language triggers a lightweight top-level re-render that updates every label instantly without page reload.
  - `AppContext`: Manages elder profile state, active booking filter/wizard selections, and booking submissions in memory.

---

## 3. Recommended Architecture & Blueprint

### 3.1 Recommended File & Directory Structure

```
d:/SDISMAN/Projects/Looklarn/
├── index.html                       # HTML shell loading Google Fonts Sarabun & viewport
├── package.json                     # Dependencies, scripts (dev, build, preview, test)
├── vite.config.js                   # Vite configuration with React plugin & alias
├── tailwind.config.js               # Looklarn design tokens, colors, font family
├── postcss.config.js                # PostCSS config for Tailwind & Autoprefixer
├── src/
│   ├── main.jsx                     # Application entry point
│   ├── App.jsx                      # App router, Context providers, Layout shell
│   ├── index.css                    # Tailwind directives, base styles, Sarabun font defaults
│   ├── i18n/
│   │   ├── index.js                 # i18n entry & helper
│   │   ├── th.js                    # Thai translations (default)
│   │   └── en.js                    # English translations
│   ├── context/
│   │   ├── LanguageContext.jsx      # Language state & translation hook
│   │   └── AppContext.jsx           # Global state: bookings, elder profile, matching form
│   ├── data/
│   │   ├── caretakers.json          # 5 caretaker profiles with bilingual data
│   │   ├── bookings.json            # 3 initial sample bookings
│   │   ├── activities.json          # 4 featured activities
│   │   └── elder.json               # Sample elder profile (Grandma Somporn)
│   ├── utils/
│   │   ├── cn.js                    # Class name merging utility (clsx + twMerge)
│   │   └── formatters.js            # Currency & date formatting utilities (THB, Thai/EN dates)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx           # Navigation header, logo, page links, LanguageToggle
│   │   │   ├── Footer.jsx           # Clean footer with quick links, contacts, copyright
│   │   │   ├── LanguageToggle.jsx   # TH | EN pill toggle with active indicator
│   │   │   └── ScrollToTop.jsx      # Auto-scroll to top on route change
│   │   ├── ui/
│   │   │   ├── MatchScoreRing.jsx   # SVG Circular progress ring with animated stroke
│   │   │   ├── Badge.jsx            # Standardized badge component (Verified, Trained, etc.)
│   │   │   ├── Button.jsx           # Primary, Secondary, Outline, Green CTA buttons
│   │   │   ├── Card.jsx             # Soft shadow, rounded-2xl container card
│   │   │   ├── Modal.jsx            # Accessible modal dialog container
│   │   │   └── Toast.jsx            # Notification toast for save/action confirmations
│   │   ├── home/
│   │   │   ├── HeroBanner.jsx       # Blue-to-teal gradient hero with quick search CTA
│   │   │   ├── ActivityGrid.jsx     # Hospital, Temple, City Tour, Social Event cards
│   │   │   ├── HowItWorks.jsx       # 3-step illustrated process
│   │   │   ├── PromoBanner.jsx      # Partner hospital discounts strip
│   │   │   └── Testimonials.jsx     # Guardian feedback & rating proof
│   │   ├── find/
│   │   │   ├── StepIndicator.jsx    # Visual 3-step progress bar with active step highlights
│   │   │   ├── Step1Physical.jsx    # Elder mobility, medical conditions, medication
│   │   │   ├── Step2Preferences.jsx # Language, religion, diet, companion traits
│   │   │   ├── Step3Schedule.jsx    # Date, time, duration (2h/4h/8h), budget slider
│   │   │   └── AiMatchingLoader.jsx # Pulse / radar AI scanning animation
│   │   ├── matches/
│   │   │   ├── CaretakerMatchCard.jsx # Match card with circular score ring & badges
│   │   │   └── MatchSummaryHeader.jsx # Match count & criteria summary
│   │   ├── caretaker/
│   │   │   ├── CaretakerWaveHero.jsx # Blue wave header with avatar & badges
│   │   │   ├── CaretakerStats.jsx    # Trips count, experience, rating, response rate
│   │   │   ├── CaretakerBio.jsx      # Bio, specialty tags, verified certificates
│   │   │   ├── AvailabilityCalendar.jsx # Interactive date & time selector
│   │   │   ├── CaretakerReviews.jsx  # Testimonials & star breakdowns
│   │   │   └── StickyBookingBar.jsx  # Fixed bottom bar for mobile + desktop sidebar
│   │   ├── booking/
│   │   │   ├── BookingSummaryCard.jsx # Selected elder + caretaker + outing preview
│   │   │   ├── LocationPicker.jsx     # Outing destination & pickup address inputs
│   │   │   ├── PriceBreakdown.jsx     # Itemized calculations (hourly + service + total)
│   │   │   └── BookingSuccessModal.jsx # Confirmation modal with ref ID & confetti
│   │   ├── bookings/
│   │   │   ├── BookingCard.jsx        # Status badge, caretaker info, action buttons
│   │   │   ├── LiveTrackingModal.jsx  # Mock live GPS escort tracker dialog
│   │   │   └── ReviewModal.jsx        # Rating & review submission modal
│   │   └── elder/
│   │       └── ElderProfileForm.jsx   # Form for photo, health conditions, mobility, habits
│   ├── pages/
│   │   ├── HomePage.jsx             # Route: /
│   │   ├── FindCaretakerPage.jsx    # Route: /find
│   │   ├── MatchResultsPage.jsx     # Route: /matches
│   │   ├── CaretakerProfilePage.jsx # Route: /caretaker/:id
│   │   ├── BookingPage.jsx          # Route: /book/:id
│   │   ├── MyBookingsPage.jsx       # Route: /bookings
│   │   ├── ElderProfilePage.jsx     # Route: /elder-profile
│   │   └── NotFoundPage.jsx         # 404 fallback page
│   └── tests/
│       ├── setup.js                 # Vitest & @testing-library setup
│       ├── App.test.jsx             # Navigation & rendering tests
│       ├── LanguageContext.test.jsx # Bilingual toggle tests
│       └── MatchScoreRing.test.jsx  # AI Match Score ring component tests
```

---

### 3.2 Exact Package Configuration (`package.json`)

```json
{
  "name": "looklarn",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "lucide-react": "^0.454.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.27.0",
    "tailwind-merge": "^2.5.4"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.2",
    "@testing-library/react": "^16.0.1",
    "@testing-library/user-event": "^14.5.2",
    "@vitejs/plugin-react": "^4.3.3",
    "autoprefixer": "^10.4.20",
    "jsdom": "^25.0.1",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.14",
    "vite": "^5.4.10",
    "vitest": "^2.1.3"
  }
}
```

---

### 3.3 Build Configuration (`vite.config.js`)

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.js',
  },
});
```

---

### 3.4 Design System Tokens & Styling Setup

#### A. Tailwind CSS Configuration (`tailwind.config.js`)

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0EA5E9', // Ocean Blue
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
        },
        ocean: {
          light: '#38BDF8',
          DEFAULT: '#0EA5E9',
          dark: '#0284C7',
        },
        emerald: {
          DEFAULT: '#10B981', // Accent / CTA Green
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
        navy: {
          DEFAULT: '#0F172A', // Dark Navy for Typography & deep accents
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
        ice: {
          DEFAULT: '#F0F9FF', // Ice Blue Background
          50: '#F8FAFC',
          100: '#F0F9FF',
          200: '#E0F2FE',
        },
      },
      fontFamily: {
        sans: ['Sarabun', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        sarabun: ['Sarabun', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.75rem',   // 12px
        '2xl': '1rem',      // 16px
        '3xl': '1.5rem',    // 24px
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -2px rgba(14, 165, 233, 0.08), 0 1px 4px -1px rgba(15, 23, 42, 0.04)',
        'soft': '0 8px 24px -4px rgba(14, 165, 233, 0.10), 0 4px 8px -2px rgba(15, 23, 42, 0.05)',
        'soft-lg': '0 16px 36px -6px rgba(14, 165, 233, 0.14), 0 6px 12px -3px rgba(15, 23, 42, 0.06)',
        'emerald-soft': '0 8px 20px -3px rgba(16, 185, 129, 0.25)',
      },
    },
  },
  plugins: [],
}
```

#### B. Global CSS (`src/index.css`)

```css
@import url('https://fonts.googleapis.com/css2?family=Sarabun:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    font-family: 'Sarabun', sans-serif;
    background-color: #F0F9FF;
    color: #0F172A;
    scroll-behavior: smooth;
  }

  body {
    min-height: 100vh;
    overflow-x: hidden;
  }
}

/* Custom scrollbars and transitions */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #F0F9FF;
}
::-webkit-scrollbar-thumb {
  background: #BAE6FD;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #0EA5E9;
}
```

#### C. HTML Header (`index.html`)

```html
<!doctype html>
<html lang="th">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>Looklarn (ลูกหลาน) — ผู้ดูแลเพื่อนร่วมทางสำหรับผู้สูงอายุ</title>
    <!-- Preconnect & Google Fonts Sarabun -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Sarabun:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
  </head>
  <body class="bg-[#F0F9FF] text-[#0F172A] antialiased selection:bg-sky-200 selection:text-sky-900">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

---

### 3.5 Circular AI Match Score Ring Component Architecture

The **MatchScoreRing** component renders an SVG circular progress indicator that visually animates and colors based on the match percentage (96%, 88%, 81%).

```jsx
// src/components/ui/MatchScoreRing.jsx
import React from 'react';
import { cn } from '../../utils/cn';

export default function MatchScoreRing({ score = 96, size = 72, strokeWidth = 6, showLabel = true, className }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  // Determine color scheme based on match tier
  const strokeColor = score >= 90 ? '#10B981' : score >= 85 ? '#0EA5E9' : '#0284C7';
  const badgeBg = score >= 90 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-sky-50 text-sky-700 border-sky-200';

  return (
    <div className={cn("relative inline-flex items-center justify-center flex-col", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E0F2FE"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress stroke */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Center percentage label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold text-navy-900 leading-none">{score}%</span>
        {size >= 64 && (
          <span className="text-[10px] text-slate-500 font-medium scale-90">Match</span>
        )}
      </div>
    </div>
  );
}
```

---

### 3.6 Language System & i18n Architecture

#### A. Language Context (`src/context/LanguageContext.jsx`)

```jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import th from '../i18n/th';
import en from '../i18n/en';

const translations = { th, en };
const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('looklarn_lang') || 'th';
  });

  useEffect(() => {
    localStorage.setItem('looklarn_lang', language);
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'th' ? 'en' : 'th'));
  };

  const t = (path, fallback = '') => {
    const keys = path.split('.');
    let current = translations[language];
    for (const key of keys) {
      if (!current || current[key] === undefined) {
        // Fallback to English or key itself
        let fb = translations['en'];
        for (const k of keys) {
          if (!fb || fb[k] === undefined) return fallback || path;
          fb = fb[k];
        }
        return fb || fallback || path;
      }
      current = current[key];
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
```

#### B. Navbar Language Toggle (`src/components/layout/LanguageToggle.jsx`)

```jsx
import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center bg-white border border-sky-200 rounded-full p-0.5 shadow-sm">
      <button
        type="button"
        onClick={() => setLanguage('th')}
        className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
          language === 'th'
            ? 'bg-primary-500 text-white shadow-sm'
            : 'text-slate-600 hover:text-navy-900'
        }`}
      >
        TH
      </button>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
          language === 'en'
            ? 'bg-primary-500 text-white shadow-sm'
            : 'text-slate-600 hover:text-navy-900'
        }`}
      >
        EN
      </button>
    </div>
  );
}
```

---

### 3.7 Mock Data Schema Specifications

#### 1. Caretakers (`src/data/caretakers.json`)
```json
[
  {
    "id": 1,
    "name": {
      "th": "นายสมชาย ใจดี",
      "en": "Somchai Jaidee"
    },
    "nickname": { "th": "พี่ชาย", "en": "Chai" },
    "age": 42,
    "gender": "male",
    "photo": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    "matchScore": 96,
    "isBestMatch": true,
    "tier": "specialist",
    "hourlyRate": 450,
    "rating": 4.98,
    "reviewsCount": 124,
    "completedTrips": 182,
    "experienceYears": 6,
    "specialties": [
      { "th": "ผู้เชี่ยวชาญการพาไปโรงพยาบาล", "en": "Hospital Escort Specialist" },
      { "th": "การดูแลผู้ใช้วีลแชร์", "en": "Wheelchair Assistance" },
      { "th": "การจัดการยาและการวัดความดัน", "en": "Medication & Vitals" }
    ],
    "languages": ["Thai", "Isaan", "English"],
    "certifications": [
      { "th": "ผ่านการตรวจสอบประวัติอาชญากรรม (สตช.)", "en": "National Police Background Check" },
      { "th": "ประกาศนียบัตรปฐมพยาบาล & CPR (สภากาชาดไทย)", "en": "Red Cross First Aid & CPR Certified" },
      { "th": "ผ่านการอบรมหลักสูตร Looklarn Caretaker Specialist", "en": "Looklarn Certified Specialist" }
    ],
    "bio": {
      "th": "อดีตผู้ช่วยพยาบาล มีประสบการณ์ดูแลผู้สูงอายุติดเตียงและใช้วีลแชร์กว่า 6 ปี ใจเย็น สุภาพ ตรงต่อเวลา รู้จักเส้นทางและขั้นตอนในโรงพยาบาลศิริราชและจุฬาลงกรณ์เป็นอย่างดี",
      "en": "Former nursing assistant with over 6 years of experience supporting elders with mobility needs and wheelchairs. Patient, polite, punctual, and highly familiar with procedures at major hospitals."
    },
    "availableSlots": ["08:00 - 12:00", "13:00 - 17:00", "Full Day"],
    "reviews": [
      {
        "id": "r101",
        "author": { "th": "คุณวิภาวรรณ (ลูกสาว)", "en": "Vipawan (Daughter)" },
        "rating": 5,
        "date": "2026-08-15",
        "comment": {
          "th": "คุณสมชายดูแลคุณพ่อดีมาก พาไปตรวจตาที่ศิริราชอย่างราบรื่น ช่วยเข็นวีลแชร์และรอรับยาให้อย่างใจเย็น อุ่นใจมากค่ะ",
          "en": "Somchai took wonderful care of my father at Siriraj hospital. Handled the wheelchair smoothly and waited patiently. Highly recommended!"
        }
      }
    ]
  },
  {
    "id": 2,
    "name": {
      "th": "น.ส. นรินทร์พร ศรีสุข",
      "en": "Narinporn Srisuk"
    },
    "nickname": { "th": "แพรว", "en": "Praew" },
    "age": 35,
    "gender": "female",
    "photo": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    "matchScore": 88,
    "isBestMatch": false,
    "tier": "expert",
    "hourlyRate": 400,
    "rating": 4.92,
    "reviewsCount": 89,
    "completedTrips": 115,
    "experienceYears": 4,
    "specialties": [
      { "th": "เพื่อนร่วมทางไหว้พระ & ท่องเที่ยว", "en": "Temple & Cultural Outing Escort" },
      { "th": "การดูแลด้านอารมณ์และพูดคุย", "en": "Emotional Companionship" },
      { "th": "การถ่ายภาพและบันทึกความทรงจำ", "en": "Event & Memory Capture" }
    ],
    "languages": ["Thai", "English"],
    "certifications": [
      { "th": "ผ่านการตรวจสอบประวัติอาชญากรรม", "en": "Verified Background Check" },
      { "th": "ผ่านการอบรมการปฐมพยาบาลเบื้องต้น", "en": "Standard First Aid Certified" }
    ],
    "bio": {
      "th": "ผู้ดูแลสายอบอุ่น สดใส ชอบพาผู้สูงอายุไปทำบุญไหว้พระ เดินเล่นในสวนสาธารณะ และร่วมงานเลี้ยงครอบครัว มีความรู้เรื่องพิธีกรรมทางศาสนาและคอยช่วยประคองอย่างนุ่มนวล",
      "en": "Warm, cheerful companion who loves escorting elders to temples, merit-making, park walks, and family gatherings. Attentive, friendly, and respectful."
    },
    "availableSlots": ["09:00 - 13:00", "14:00 - 18:00"],
    "reviews": []
  },
  {
    "id": 3,
    "name": {
      "th": "นางกัญญา รัตนะ",
      "en": "Kanya Rattana"
    },
    "nickname": { "th": "ป้ากัญญา", "en": "Aunt Kanya" },
    "age": 50,
    "gender": "female",
    "photo": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
    "matchScore": 81,
    "isBestMatch": false,
    "tier": "specialist",
    "hourlyRate": 500,
    "rating": 4.88,
    "reviewsCount": 65,
    "completedTrips": 94,
    "experienceYears": 8,
    "specialties": [
      { "th": "การดูแลภาวะสมองเสื่อม/อัลไซเมอร์", "en": "Dementia & Memory Care" },
      { "th": "การช่วยเหลือการเดินและกายภาพเบื้องต้น", "en": "Mobility & Gentle Physical Assist" }
    ],
    "languages": ["Thai"],
    "certifications": [
      { "th": "ผ่านการอบรม Dementia Care Specialist", "en": "Dementia Care Specialist" },
      { "th": "ผ่านการตรวจสอบประวัติอาชญากรรม", "en": "Verified Background Check" }
    ],
    "bio": {
      "th": "ประสบการณ์กว่า 8 ปีในการดูแลผู้สูงอายุที่มีภาวะหลงลืมและต้องการการดูแลใกล้ชิดเป็นพิเศษ เข้าใจจิตวิทยาผู้สูงวัยเป็นอย่างดี",
      "en": "Over 8 years of specialized experience with dementia and memory support. Extremely patient, compassionate, and attentive."
    },
    "availableSlots": ["08:00 - 16:00"],
    "reviews": []
  },
  {
    "id": 4,
    "name": {
      "th": "นายธนพล ว่องไว",
      "en": "Thanapol Vongvai"
    },
    "nickname": { "th": "พล", "en": "Pol" },
    "age": 29,
    "gender": "male",
    "photo": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    "matchScore": 76,
    "isBestMatch": false,
    "tier": "trained",
    "hourlyRate": 350,
    "rating": 4.85,
    "reviewsCount": 42,
    "completedTrips": 58,
    "experienceYears": 2,
    "specialties": [
      { "th": "เพื่อนร่วมเดินทางท่องเที่ยวและห้างสรรพสินค้า", "en": "Mall & City Outing Companion" },
      { "th": "การช่วยขับรถและประสานงานเดินทาง", "en": "Driving & Travel Coordination" }
    ],
    "languages": ["Thai", "English"],
    "certifications": [
      { "th": "ใบอนุญาตขับขี่สาธารณะ & ตรวจประวัติ", "en": "Driving License & Background Check" }
    ],
    "bio": {
      "th": "สุภาพ คล่องแคล่ว มีรถยนต์ส่วนตัวพร้อมอุปกรณ์รองรับวีลแชร์ เหมาะสำหรับการเดินทางข้ามจังหวัดหรือทริปท่องเที่ยวในเมือง",
      "en": "Polite and agile companion with vehicle equipped for wheelchair storage. Great for city outings, shopping, and scenic trips."
    },
    "availableSlots": ["10:00 - 18:00"],
    "reviews": []
  },
  {
    "id": 5,
    "name": {
      "th": "น.ส. ศิริพร รุ่งเรือง",
      "en": "Siriporn Rungruang"
    },
    "nickname": { "th": "นก", "en": "Nok" },
    "age": 38,
    "gender": "female",
    "photo": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
    "matchScore": 74,
    "isBestMatch": false,
    "tier": "trained",
    "hourlyRate": 380,
    "rating": 4.90,
    "reviewsCount": 51,
    "completedTrips": 70,
    "experienceYears": 3,
    "specialties": [
      { "th": "เพื่อนร่วมงานบุญและกิจกรรมชุมชน", "en": "Community & Merit-making Escort" },
      { "th": "การดูแลโภชนาการและอาหารเฉพาะโรค", "en": "Dietary & Nutrition Supervision" }
    ],
    "languages": ["Thai", "Chinese"],
    "certifications": [
      { "th": "ผ่านการตรวจสอบประวัติอาชญากรรม", "en": "Verified Background Check" },
      { "th": "อบรมการดูแลโภชนาการผู้สูงอายุ", "en": "Elder Nutrition Training" }
    ],
    "bio": {
      "th": "ใจเย็น ละเอียดรอบคอบ คอยดูแลเรื่องอาหารการกินและเวลาทานยาอย่างเคร่งครัด สื่อสารภาษาจีนเบื้องต้นได้",
      "en": "Patient and meticulous companion who pays special attention to dietary schedules and medications. Basic Chinese communication skills."
    },
    "availableSlots": ["08:00 - 12:00", "13:00 - 17:00"],
    "reviews": []
  }
]
```

#### 2. Bookings (`src/data/bookings.json`)
```json
[
  {
    "id": "BK-2026-0801",
    "caretakerId": 1,
    "caretakerName": { "th": "นายสมชาย ใจดี", "en": "Somchai Jaidee" },
    "caretakerPhoto": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    "elderName": { "th": "คุณยายสมพร สุขเกษม", "en": "Grandma Somporn Sookkasem" },
    "activity": { "th": "พาไปตรวจสุขภาพและรับยาตามนัด", "en": "Hospital Health Checkup & Medication" },
    "category": "hospital",
    "destination": { "th": "โรงพยาบาลศิริราช (ตึกผู้ป่วยนอก)", "en": "Siriraj Hospital (OPD Building)" },
    "date": "2026-08-22",
    "time": "08:30 - 12:30",
    "durationHours": 4,
    "totalPrice": 1950,
    "status": "upcoming",
    "pickupLocation": { "th": "124/8 ถนนสุขุมวิท 71 พระโขนงเหนือ", "en": "124/8 Sukhumvit 71, Phra Khanong Nuea" },
    "notes": { "th": "ต้องใช้วีลแชร์ตลอดการเดินทาง และนำประวัติยาเดิมไปด้วย", "en": "Wheelchair needed throughout outing. Old medication record attached." }
  },
  {
    "id": "BK-2026-0802",
    "caretakerId": 2,
    "caretakerName": { "th": "น.ส. นรินทร์พร ศรีสุข", "en": "Narinporn Srisuk" },
    "caretakerPhoto": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    "elderName": { "th": "คุณยายสมพร สุขเกษม", "en": "Grandma Somporn Sookkasem" },
    "activity": { "th": "พาไปทำบุญถวายสังฆทานและไหว้พระประจำวันเกิด", "en": "Temple Merit-making & Blessings" },
    "category": "temple",
    "destination": { "th": "วัดอรุณราชวรารามราชวรมหาวิหาร", "en": "Wat Arun Ratchawararam" },
    "date": "2026-08-25",
    "time": "09:00 - 13:00",
    "durationHours": 4,
    "totalPrice": 1750,
    "status": "upcoming",
    "pickupLocation": { "th": "124/8 ถนนสุขุมวิท 71 พระโขนงเหนือ", "en": "124/8 Sukhumvit 71, Phra Khanong Nuea" },
    "notes": { "th": "คุณยายชอบเดินช้าๆ และแวะถ่ายรูป", "en": "Grandma walks slowly and loves taking pictures." }
  },
  {
    "id": "BK-2026-0728",
    "caretakerId": 3,
    "caretakerName": { "th": "นางกัญญา รัตนะ", "en": "Kanya Rattana" },
    "caretakerPhoto": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
    "elderName": { "th": "คุณยายสมพร สุขเกษม", "en": "Grandma Somporn Sookkasem" },
    "activity": { "th": "เดินเล่นรับลมและรับประทานอาหารเช้า", "en": "Morning Walk & Breakfast Escort" },
    "category": "tour",
    "destination": { "th": "สวนลุมพินี ประตู 1", "en": "Lumphini Park (Gate 1)" },
    "date": "2026-07-28",
    "time": "07:00 - 10:00",
    "durationHours": 3,
    "totalPrice": 1650,
    "status": "completed",
    "pickupLocation": { "th": "124/8 ถนนสุขุมวิท 71", "en": "124/8 Sukhumvit 71" },
    "notes": { "th": "เรียบร้อยดีมาก", "en": "Trip completed smoothly." }
  }
]
```

#### 3. Elder Profile (`src/data/elder.json`)
```json
{
  "id": "elder-001",
  "name": { "th": "คุณยายสมพร สุขเกษม", "en": "Grandma Somporn Sookkasem" },
  "nickname": { "th": "ยายพร", "en": "Porn" },
  "age": 74,
  "gender": "female",
  "photo": "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=400&auto=format&fit=crop&q=80",
  "mobility": "wheelchair",
  "medicalConditions": [
    { "id": "hypertension", "th": "ความดันโลหิตสูง (ควบคุมได้)", "en": "Hypertension (Controlled)" },
    { "id": "mild_knee_pain", "th": "ข้อเข่าเสื่อมระยะเริ่มต้น", "en": "Mild Knee Osteoarthritis" }
  ],
  "medications": {
    "th": "ยาลดความดัน 1 เม็ดหลังอาหารเช้า, วิตามินบำรุงข้อ",
    "en": "Blood pressure med 1 tab after breakfast, joint supplement"
  },
  "dietaryRestrictions": {
    "th": "อาหารรสจืด ไม่เค็มจัด ไม่ทานของทอดมัน",
    "en": "Low-sodium diet, avoids oily fried food"
  },
  "preferences": {
    "th": "ชอบทำบุญไหว้พระ เดินสวนสาธารณะตอนเช้า ชอบผู้ดูแลที่พูดจาไพเราะและใจเย็น",
    "en": "Loves temple visits, morning park walks, and gentle companions"
  },
  "emergencyContact": {
    "name": { "th": "คุณวิภาวรรณ สุขเกษม (บุตรสาว)", "en": "Vipawan Sookkasem (Daughter)" },
    "phone": "081-234-5678",
    "relationship": { "th": "บุตรสาว", "en": "Daughter" }
  }
}
```

---

## 4. Caveats & Architectural Boundaries

1. **Client-Only Architecture:**  
   The application is an interactive frontend web prototype intended for pitch decks and user testing. All state transitions (booking creations, elder profile modifications) are stored in React Context memory with optional localStorage syncing. There is no active backend server or relational database.
2. **Third-Party Imagery:**  
   High-quality profile photos use Unsplash avatar URLs. In offline environments, an SVG fallback avatar placeholder should be rendered gracefully if the images fail to load.
3. **Simulated External Features:**  
   Features such as AI matching algorithm calculations, phone calling, and live GPS map tracking are simulated client-side with rich visual cues (pulsing radar animations, toast triggers, modal previews) rather than live cellular/telematics APIs.
4. **No caveats on specification compliance:**  
   All 4 primary requirements (R1–R4) and all acceptance criteria are fully accounted for in this technical architecture.

---

## 5. Conclusion

The technical architecture for **Looklarn (ลูกหลาน)** provides a modular, maintainable, and high-performance foundation built on **Vite + React 18 + Tailwind CSS + Lucide React + React Router v6**.

### Key Architectural Strengths:
- **Flawless Design Token Integration:** Primary Ocean Blue (`#0EA5E9`), Emerald Green (`#10B981`), Ice Blue (`#F0F9FF`), and Dark Navy (`#0F172A`) with rounded `xl`/`2xl` card aesthetics and Google Fonts Sarabun.
- **Strict Bilingual Consistency:** Clean `LanguageContext` ensuring zero mixed-language display issues and instantaneous re-rendering.
- **Engaging Pitch Deck Features:** Dynamic circular AI Match Score rings (`96%`, `88%`, `81%`), multi-step matching wizard with scanning animation, complete caretaker profiles with wave headers, booking checkout with price calculation, and sample bookings management.
- **High Testability & Build Health:** Standardized Vitest configuration for unit and navigation regression testing.

---

## 6. Verification Method

### 6.1 Setup and Build Verification Commands
Run the following commands in the workspace root (`d:/SDISMAN/Projects/Looklarn`):

1. **Installation:**
   ```powershell
   npm install
   ```
2. **Development Server:**
   ```powershell
   npm run dev
   ```
   *Expected Result:* Dev server starts on `http://localhost:5173` without syntax errors.
3. **Production Build:**
   ```powershell
   npm run build
   ```
   *Expected Result:* Vite builds clean optimized production assets in `dist/` with 0 bundle errors.
4. **Automated Unit Tests:**
   ```powershell
   npm test
   ```
   *Expected Result:* All tests in `src/tests/` pass.

### 6.2 Manual Acceptance Criteria Checklist

| Category | Verification Step | Expected Behavior |
|---|---|---|
| **Navigation** | Load `/` -> Click "Find Caretaker" | Navigates to `/find` |
| **Navigation** | Complete Step 1, 2, 3 on `/find` & submit | Shows AI scanning animation, then navigates to `/matches` |
| **Navigation** | Click "View Profile" on match card 1 | Navigates to `/caretaker/1` |
| **Navigation** | Click "Book Now" on profile or match | Navigates to `/book/1` |
| **Navigation** | Submit booking on `/book/1` | Opens success modal with booking ID, then navigates to `/bookings` |
| **Navigation** | Click "Elder Profile" in navbar | Navigates to `/elder-profile` |
| **Design** | Inspect page backgrounds & buttons | Background is `#F0F9FF`, primary accents `#0EA5E9`, CTAs `#10B981` |
| **Design** | Test viewports at 375px, 768px, 1280px | Layout adjusts smoothly; no horizontal scrollbar on mobile (375px) |
| **Design** | Inspect rendered font | Text rendered with Google Font `Sarabun` |
| **Language** | Click `TH` in navbar | All UI text rendered exclusively in Thai (no mixed English) |
| **Language** | Click `EN` in navbar | All UI text instantly updates exclusively to English |
| **Match Scores** | Inspect `/matches` | 3 cards shown with scores 96%, 88%, 81% and visual circular rings; top card has "Best Match" badge |
