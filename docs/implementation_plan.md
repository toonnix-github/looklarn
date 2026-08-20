# Implementation Plan — Looklarn (ลูกหลาน)

## Overview

**Looklarn** is an AI-powered elder care companion matching app targeting **family guardians** (sons, daughters, grandchildren) who need to find trusted, verified caretakers to accompany their elders to outings — hospitals, temples, events, tourist locations, etc.

The deliverable is an **interactive web prototype** built with **React (Vite) + Tailwind CSS + shadcn/ui**, using **mock data** to simulate all functionality for pitching to investors.

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | React + Vite | Fast dev, modern |
| Styling | Tailwind CSS + shadcn/ui | Warm, polished UI quickly |
| Routing | React Router v6 | Multi-page prototype navigation |
| State | React Context / useState | Lightweight, no backend needed |
| Language | Bilingual (Thai + English) | Toggle in header |
| Data | Mock JSON (hardcoded) | Pitch prototype, no backend |
| Icons | Lucide React | Consistent icon set |

---

## Design System

- **Primary Color**: Warm amber/orange (#F59E0B) — warmth & trust
- **Accent**: Soft teal (#14B8A6) — calm & health
- **Background**: Cream white (#FFFBF5) — soft, non-clinical
- **Typography**: Sarabun (Google Fonts) — supports Thai + Latin beautifully
- **Radius**: Rounded corners (xl / 2xl) — approachable feel
- **Tone**: Warm, trustworthy, family-oriented

---

## App Structure (7 Screens)

```
/                       → Home (Landing)
/find                   → Find a Caretaker (AI Matching Form)
/matches                → Match Results (Top 3 with AI Score)
/caretaker/:id          → Caretaker Profile Detail
/book/:id               → Booking / Confirmation
/bookings               → My Bookings / History
/elder-profile          → Elder Profile (guardian manages elder's info)
```

---

## Screen-by-Screen Breakdown

### 1. 🏠 Home — Landing Page (`/`)
- **Hero banner**: "ดูแลผู้สูงอายุที่คุณรัก / Care for your loved elders" — CTA button → `/find`
- **Activity cards**: Featured outings (Hospital visit, Temple tour, Family event, Tourist spot)
- **Promotions/Events strip**: Seasonal deals, partner hospitals
- **How it works**: 3-step explainer (Fill form → Get AI matches → Book instantly)
- **Testimonials**: 2-3 mock guardian quotes

---

### 2. 🔍 Find a Caretaker — AI Matching Form (`/find`)
Multi-step form (3 steps):

**Step 1: Elder's Physical Needs**
- Mobility level (Independent / Needs assistance / Wheelchair)
- Medical conditions (multi-select: diabetes, heart, dementia, etc.)
- Medication management needed (yes/no)

**Step 2: Personality & Preferences**
- Language preference (Thai, English, Isaan, etc.)
- Religion (Buddhism, Christianity, Islam, etc.)
- Diet (regular, vegetarian, halal, etc.)
- Activity type (Hospital, Temple, Tourism, Event)

**Step 3: Schedule & Budget**
- Date & time picker
- Duration (2h, 4h, full day)
- Budget range (slider)
- Number of outings per month

→ Submit triggers "AI Matching" loading animation → redirects to `/matches`

---

### 3. 🤖 Match Results — AI Score Cards (`/matches`)
- Header: "เราพบผู้ดูแลที่เหมาะสมที่สุด 3 คน / We found your top 3 matches"
- 3 caretaker cards, each showing:
  - Profile photo, name, age
  - **AI Match Score** (e.g. 96%, 88%, 81%) — displayed as animated progress ring
  - Specialty badges (Medical escort, Dementia care, etc.)
  - Star rating + # of reviews
  - Availability status (Available today ✅)
  - "View Profile" and "Book Now" CTAs

---

### 4. 👤 Caretaker Profile Detail (`/caretaker/:id`)
- Large header photo + name, age, location
- AI Match Score banner
- Verified badges (Background check ✅, Certified ✅, First Aid ✅)
- Experience level (e.g., Expert — 5+ years)
- Specialty tags
- About me (bio in Thai + English)
- Reviews section (3 mock reviews from families)
- Availability calendar (mock)
- **"Book This Caretaker"** CTA → `/book/:id`

---

### 5. 📅 Booking / Confirmation (`/book/:id`)
- Summary of: Elder info, Caretaker, Date/Time, Duration, Activity
- Location picker (mock — where to take the elder)
- Price breakdown (hourly rate × hours + platform fee)
- **"Confirm Booking"** button → shows success modal + redirects to `/bookings`

---

### 6. 📋 My Bookings / History (`/bookings`)
- Tab: Upcoming | Past
- Booking cards showing: caretaker photo, date, activity, status badge
- Past bookings have a "Leave Review" CTA

---

### 7. 👴 Elder Profile (`/elder-profile`)
- Guardian can manage their elder's saved info:
  - Photo, Name, Age, Gender
  - Medical conditions
  - Preferences & personality
  - Mobility level
- "Edit" button for each section
- Note: This info auto-fills the matching form next time

---

## Mock Data

All data will be hardcoded in `/src/data/`:
- `caretakers.json` — 5 caretaker profiles
- `bookings.json` — 3 sample bookings (2 upcoming, 1 past)
- `activities.json` — featured activities/events for homepage
- `elder.json` — sample elder profile

---

## Bilingual Implementation

- Language toggle (🇹🇭 / 🇬🇧) in the nav header
- All UI strings stored in `/src/i18n/th.js` and `/src/i18n/en.js`
- `useLanguage()` context hook used app-wide

---

## Project Structure

```
src/
├── main.jsx
├── App.jsx
├── i18n/
│   ├── en.js
│   └── th.js
├── context/
│   ├── LanguageContext.jsx
│   └── BookingContext.jsx
├── data/
│   ├── caretakers.json
│   ├── bookings.json
│   ├── activities.json
│   └── elder.json
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   └── ui/
│       ├── MatchScoreRing.jsx
│       ├── CaretakerCard.jsx
│       ├── ActivityCard.jsx
│       └── StepForm.jsx
└── pages/
    ├── Home.jsx
    ├── FindCaretaker.jsx
    ├── MatchResults.jsx
    ├── CaretakerProfile.jsx
    ├── Booking.jsx
    ├── MyBookings.jsx
    └── ElderProfile.jsx
```

---

## Verification Plan

### Manual Verification
- Navigate all 7 pages via in-app links
- Complete full flow: Home → Find → Matches → Profile → Book → Bookings
- Test language toggle (Thai ↔ English)
- Check responsive layout on desktop and tablet width
