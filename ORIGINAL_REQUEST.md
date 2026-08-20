# Original User Request

## 2026-08-20T06:19:13Z

Build **Looklarn (ลูกหลาน)** — an interactive React web prototype for a pitch deck. Looklarn is an AI-powered elder care companion matching app where family guardians (sons, daughters) find verified caretakers to escort their elderly parents to hospitals, temples, tourist spots, and events.

Working directory: `d:/SDISMAN/Projects/Looklarn`

Integrity mode: benchmark (no restrictions — team uses any approach that works)

## Requirements

### R1. React + Vite Web Prototype (7 pages, fully navigable)
Build a fully navigable multi-page React web app using Vite. All 7 pages must be reachable via in-app navigation:
- `/` — Home: hero banner (blue-to-teal gradient), activity cards (Hospital, Temple, City Tour), promotions strip, "How it works" 3-step section, testimonials
- `/find` — Find a Caretaker: 3-step form (Physical Needs → Preferences → Schedule & Budget) with progress indicator, ends with AI matching loading animation
- `/matches` — Match Results: top 3 caretaker cards each with a circular AI Match Score ring (96% / 88% / 81%), specialty badges, star ratings, availability status, "View Profile" and "Book Now" buttons
- `/caretaker/:id` — Caretaker Profile: wave header in blue gradient, AI Match Score badge, verified badges, experience level, specialty tags, bilingual bio, reviews, availability calendar, sticky "Book" bottom bar
- `/book/:id` — Booking: summary of elder + caretaker + date + activity, location picker, price breakdown, confirm button → success modal
- `/bookings` — My Bookings: tabs (Upcoming / Past), booking cards with status badges
- `/elder-profile` — Elder Profile: editable sections for elder's photo, name, age, medical conditions, preferences, mobility level

### R2. Design System — Blue & Green, Responsive
Implement a consistent design system across all pages:
- Primary: Ocean Blue `#0EA5E9`
- Accent/CTA: Emerald Green `#10B981`
- Background: Ice Blue `#F0F9FF`
- Text: Dark Navy `#0F172A`
- Font: Sarabun from Google Fonts (supports Thai + Latin)
- Rounded corners (xl/2xl), soft card shadows
- Fully responsive: mobile, tablet, desktop

### R3. Language Toggle (Thai / English)
Implement a language context that switches ALL UI text between Thai and English:
- `TH | EN` toggle pill in the top navbar — one language displayed at a time
- Default language: Thai
- All strings stored in separate i18n files (`th.js`, `en.js`)
- Switching instantly re-renders all page text
- Mock data (caretaker names, bios, reviews, activity names) must also have both Thai and English versions

### R4. Mock Data (No Backend)
All data is hardcoded mock JSON — no backend, no API calls:
- 5 caretaker profiles (with photo URLs from a free placeholder service, name, age, specialties, rating, reviews, hourly rate, availability)
- 3 sample bookings (2 upcoming, 1 past)
- 4 featured activities for homepage
- 1 sample elder profile

## Acceptance Criteria

### Navigation
- [ ] All 7 pages load without errors
- [ ] Clicking "Find a Caretaker" on Home navigates to `/find`
- [ ] Completing the 3-step form and submitting navigates to `/matches`
- [ ] Clicking "View Profile" on a match card navigates to `/caretaker/:id`
- [ ] Clicking "Book Now" or "Book This Caretaker" navigates to `/book/:id`
- [ ] Confirming a booking shows a success modal then navigates to `/bookings`
- [ ] Navbar links reach all major pages

### Design
- [ ] Blue (`#0EA5E9`) and green (`#10B981`) are the dominant colors across all pages
- [ ] Pages are usable on mobile (375px), tablet (768px), and desktop (1280px) widths without horizontal scroll or broken layouts
- [ ] Sarabun font is loaded and applied

### Language Toggle
- [ ] Clicking `TH` displays all visible UI text in Thai
- [ ] Clicking `EN` displays all visible UI text in English
- [ ] No page shows mixed Thai/English labels simultaneously (e.g., "Hospital Visit / ไปโรงพยาบาล" is NOT acceptable)
- [ ] Toggle is visible and functional on every page

### Match Results
- [ ] Three caretaker cards are shown with scores 96%, 88%, 81%
- [ ] Each card shows a circular progress ring reflecting its score visually
- [ ] "Best Match" badge appears on the top card

### Build
- [ ] `npm run dev` starts the dev server without errors
- [ ] `npm run build` completes without errors
