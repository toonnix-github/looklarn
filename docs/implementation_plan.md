# Implementation Plan - Looklarn

## Overview

AI-powered elder care companion matching app for family guardians.
Interactive web prototype: React (Vite) + Tailwind CSS + shadcn/ui + mock data.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React + Vite |
| Styling | Tailwind CSS + shadcn/ui |
| Routing | React Router v6 |
| State | React Context / useState |
| Language | Thai default with EN toggle |
| Data | Mock JSON |
| Icons | Lucide React |

---

## Design System

| Role | Color | Hex |
|---|---|---|
| Primary | Ocean Blue | #0EA5E9 |
| Accent / CTA | Emerald Green | #10B981 |
| Background | Ice Blue | #F0F9FF |
| Text | Dark Navy | #0F172A |
| Subtext | Gray | #6B7280 |

Font: Sarabun (Google Fonts) - supports Thai + Latin
Radius: Rounded xl/2xl - approachable, modern feel

---

## Language Implementation

- Single language displayed at a time (no mixed Thai/English on same label)
- Language toggle pill TH | EN pinned in the top navbar
- Active language highlighted
- Default language: Thai
- All UI strings in /src/i18n/th.js and /src/i18n/en.js
- useLanguage() context hook - switching re-renders all text instantly
- Mock data also has Thai and English versions

---

## App Structure (7 Screens)

- /                  Home (Landing)
- /find              Find a Caretaker (AI Matching Form - 3 steps)
- /matches           Match Results (Top 3 with AI Score)
- /caretaker/:id     Caretaker Profile Detail
- /book/:id          Booking / Confirmation
- /bookings          My Bookings / History
- /elder-profile     Elder Profile

---

## Screen Details

### 1. Home (/)
- Hero banner: blue-to-teal gradient, CTA to /find
- Activity cards: Hospital visit, Temple tour, City tour
- Promotions strip: Partner hospitals deals
- How it works: 3-step explainer
- Testimonials: mock guardian quotes

### 2. Find a Caretaker (/find)
Step 1 - Physical Needs: mobility, medical conditions, medication
Step 2 - Preferences: language, religion, diet, activity type
Step 3 - Schedule and Budget: date, duration, budget slider
Submit -> AI Matching animation -> /matches

### 3. Match Results (/matches)
- Top 3 caretaker cards with circular AI Match Score ring
- Score: 96% / 88% / 81%
- Specialty badges, star rating, availability status
- View Profile and Book Now buttons

### 4. Caretaker Profile (/caretaker/:id)
- Wave header banner in ocean blue gradient
- AI Match Score badge in emerald green
- Verified badges: Background check, Certified, First Aid
- Experience level, specialty tags, bio
- Reviews section, availability calendar
- Sticky bottom Book button

### 5. Booking (/book/:id)
- Summary: elder info, caretaker, date/time, activity
- Location picker, price breakdown
- Confirm -> success modal -> /bookings

### 6. My Bookings (/bookings)
- Tabs: Upcoming | Past
- Booking cards with status badge
- Past: Leave Review CTA

### 7. Elder Profile (/elder-profile)
- Edit elder info: photo, name, age, medical, preferences, mobility
- Auto-fills matching form on next use

---

## Mock Data

- caretakers.json - 5 caretaker profiles
- bookings.json - 3 sample bookings
- activities.json - featured activities for homepage
- elder.json - sample elder profile

---

## Project Structure

src/
  main.jsx
  App.jsx
  i18n/ (en.js, th.js)
  context/ (LanguageContext.jsx, BookingContext.jsx)
  data/ (caretakers.json, bookings.json, activities.json, elder.json)
  components/layout/ (Navbar.jsx, Footer.jsx)
  components/ui/ (MatchScoreRing.jsx, CaretakerCard.jsx, ActivityCard.jsx, StepForm.jsx)
  pages/ (Home, FindCaretaker, MatchResults, CaretakerProfile, Booking, MyBookings, ElderProfile)

---

## Verification Plan

- Complete flow: Home -> Find -> Matches -> Profile -> Book -> Bookings
- Test language toggle Thai <-> English
- Check responsive layout: desktop, tablet, mobile