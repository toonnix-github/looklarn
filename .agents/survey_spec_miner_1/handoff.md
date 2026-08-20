# UI/UX & Requirements Specification Mining Report — Looklarn (ลูกหลาน)

**Author:** Specification Miner (`survey_spec_miner_1`)  
**Date:** 2026-08-20  
**Project:** Looklarn (ลูกหลาน) — AI-powered Elder Care Companion Matching Platform  
**Working Directory:** `d:/SDISMAN/Projects/Looklarn/.agents/survey_spec_miner_1`

---

## 1. Observation

Authoritative specification documents examined:
1. `ORIGINAL_REQUEST.md` (lines 13–78):
   - **R1: React + Vite Web Prototype (7 pages, fully navigable)**
     - `/` (Home): Hero banner (blue-to-teal gradient), 4 activity cards (Hospital, Temple, City Tour, Social/Event), promotions strip, "How it works" 3-step section, testimonials.
     - `/find` (Find a Caretaker): 3-step form (Physical Needs → Preferences → Schedule & Budget) with progress indicator, ends with AI matching loading animation.
     - `/matches` (Match Results): Top 3 caretaker cards with circular AI Match Score ring (96% / 88% / 81%), specialty badges, star ratings, availability status, "View Profile" and "Book Now" buttons. Top card has "Best Match" badge.
     - `/caretaker/:id` (Caretaker Profile): Wave header in blue gradient, AI Match Score badge, verified badges (background check, certified, first aid), experience level, specialty tags, bilingual bio, reviews, availability calendar, sticky "Book" bottom bar.
     - `/book/:id` (Booking): Summary of elder + caretaker + date + activity, location picker, price breakdown, confirm button → success modal.
     - `/bookings` (My Bookings): Tabs (Upcoming / Past), booking cards with status badges, "Leave Review" CTA on past bookings.
     - `/elder-profile` (Elder Profile): Editable sections for elder's photo, name, age, medical conditions, preferences, mobility level; auto-fills matching form.
   - **R2: Design System — Blue & Green, Responsive**
     - Primary: Ocean Blue `#0EA5E9`
     - Accent / CTA: Emerald Green `#10B981`
     - Background: Ice Blue `#F0F9FF`
     - Text: Dark Navy `#0F172A`
     - Font: `Sarabun` (Google Fonts, Thai + Latin support)
     - Corner Radius: `xl` (12px) / `2xl` (16px), soft card shadows (`shadow-sm`, `shadow-md`, `shadow-lg`)
     - Responsive breakpoints: Mobile (375px), Tablet (768px), Desktop (1280px). No phone frame; renders as true web application.
   - **R3: Language Toggle (Thai / English)**
     - `TH | EN` toggle pill in top navbar (one language displayed at a time).
     - Default language: Thai (`th`).
     - Strings stored in `/src/i18n/th.js` and `/src/i18n/en.js`.
     - Switching instantly re-renders all UI text without page reload.
     - Zero mixed-language labels (e.g. "Hospital Visit / ไปโรงพยาบาล" is strictly forbidden).
     - Mock data (caretaker names, bios, reviews, activity titles) provided in both languages.
   - **R4: Mock Data Requirements**
     - 5 Caretaker profiles (with photos, names, age, specialties, ratings, reviews, hourly rates, availability).
     - 3 Sample bookings (2 upcoming, 1 past).
     - 4 Featured activities for homepage.
     - 1 Sample elder profile (pre-filled and editable).

2. `docs/design_decisions.md` (lines 7–43):
   - Confirms shift from amber palette to Ocean Blue `#0EA5E9` and Emerald Green `#10B981`.
   - Confirms single-language toggle (`TH | EN` pill) replacing bilingual dual-label display.
   - Confirms mobile-first responsive web prototype without phone simulator bezel.

3. `docs/matching_flow.md` (lines 9–80):
   - Matching input criteria: Mobility, medical conditions, medication management, language preference, religion, dietary needs, activity type, outing date/time/duration, budget range.
   - Matching algorithm weighting (prototype mock): Specialty match (30%), Language match (20%), Budget fit (20%), Availability (15%), Rating (10%), Religious/dietary match (5%).
   - Match results: Top 3 pre-assigned mock scores (96%, 88%, 81%).
   - 2-second AI matching animation simulation between Step 3 submission and `/matches`.
   - Caretaker verification tiers: Starter (Verified), Trained (Looklarn Academy), Expert (2+ years), Specialist (Medical/Dementia).
   - Safety features: Background check, ID verification, insurance note, emergency SOS contact.

4. `docs/implementation_plan.md` (lines 11–135):
   - Tech stack: React + Vite + Tailwind CSS + Lucide React + React Router v6 + React Context (`LanguageContext`, `BookingContext`, `ElderContext`).
   - Project directory structure: `src/i18n/`, `src/context/`, `src/data/`, `src/components/layout/`, `src/components/ui/`, `src/pages/`.

---

## 2. Logic Chain

1. **Information Architecture & Route Mapping:**
   - The user journey flows sequentially:
     `Home (/)` → `Find a Caretaker (/find)` → `AI Matching Animation` → `Match Results (/matches)` → `Caretaker Profile (/caretaker/:id)` → `Booking (/book/:id)` → `Success Modal` → `My Bookings (/bookings)`.
   - Guardians can also navigate directly to `Elder Profile (/elder-profile)` to maintain elder details, which immediately informs the pre-population in `/find` and `/book/:id`.
   - Top navigation bar must be persistent across all pages containing: Logo + Brand ("Looklarn ลูกหลาน"), Navigation links (Home, Find Caretaker, My Bookings, Elder Profile), and the `TH | EN` language toggle pill.

2. **State & Context Architecture:**
   - `LanguageContext`: Tracks `lang` (`'th'` | `'en'`). Provides `t(key)` helper and localized data selector.
   - `BookingContext`: Stores user's current search criteria (`searchCriteria`), active booking form state, list of all bookings (`bookings` array with 2 upcoming and 1 past pre-populated, plus new bookings appended upon confirmation).
   - `ElderContext`: Holds editable elder profile data (`elderProfile`) initialized with sample elder (Grandma Somporn / คุณยายสมพร, 74 years old). Updates when saved from `/elder-profile`.

3. **Design System & Component Decomposition:**
   - Primary: Ocean Blue `#0EA5E9` (buttons, primary links, active tab highlights, gradients).
   - Accent: Emerald Green `#10B981` (CTA buttons, Match Score badges, success indicators, "Best Match" pill).
   - Background: Ice Blue `#F0F9FF` (page canvas, light tint cards). Card background: White `#FFFFFF` with soft shadows (`shadow-sm` to `shadow-md`).
   - Text: Dark Navy `#0F172A` (headings, body), Subtext Gray `#6B7280` (metadata, labels).
   - Typography: Google Font `Sarabun`, loaded via Google Fonts CDN in `index.html` with font weights 300, 400, 500, 600, 700.

4. **Component Specification per Page:**
   - **Page 1 (Home `/`)**:
     - *Hero Section*: Blue-to-teal gradient (`from-sky-500 to-teal-500`), large headline, trust indicators (100% verified caretakers, 4.9/5 satisfaction, 1,200+ safe trips), primary CTA "Find a Caretaker" button.
     - *Featured Activities (4 Cards)*: Hospital Escort, Temple & Merit Outing, City & Shopping Escort, Social & Family Event. Each card with icon, image, brief description, and direct link to search with that activity pre-selected.
     - *Promotions Strip*: Partner Hospital Banner (15% discount for first-time hospital appointments, emergency insurance included).
     - *How It Works (3 Steps)*: 1. Specify Elder's Needs → 2. AI Matches Top Caretakers → 3. Book & Relax with Real-Time Updates.
     - *Testimonials Carousel/Grid*: 3 Guardian testimonials (bilingual Thai/English) praising peace of mind, punctuality, and elder happiness.
     - *Footer*: Brand summary, quick links, emergency hotline notice (`1669` reference / Looklarn Care Support), copyright.

   - **Page 2 (Find Caretaker `/find`)**:
     - *Progress Indicator*: 3 distinct steps with numbers/icons and progress bar (Step 1: Physical Needs 33%, Step 2: Preferences 66%, Step 3: Schedule & Budget 100%).
     - *Step 1 (Physical Needs)*: Mobility selector (Independent, Cane, Wheelchair, Assisted), Chronic Condition checkboxes (Diabetes, Hypertension, Heart, Dementia, None), Medication Assistance toggle, Assistance Tasks (Queuing, Wheelchair pushing, Restroom help).
     - *Step 2 (Preferences)*: Language dropdown/chips (Thai Central, Isaan, Northern, Southern, English, Mandarin), Religion (Buddhist, Christian, Muslim, Any), Dietary preference, Caretaker Gender preference (Female, Male, Any), Outing Type (Hospital, Temple, City, Event).
     - *Step 3 (Schedule & Budget)*: Outing Date picker, Time slot chips (Morning, Afternoon, Full Day), Duration selector (2h, 4h, 8h), Hourly Budget Range Slider (฿300 - ฿1,000/hr), Special instructions textarea.
     - *AI Matching Loading Overlay*: When Step 3 is submitted, display a 2.0s animated modal with spinner/progress ring, rotating status messages ("Analyzing mobility & health needs...", "Matching certified caretakers...", "Calculating compatibility scores..."), then automatically route to `/matches`.

   - **Page 3 (Match Results `/matches`)**:
     - *Header*: Search summary pill (e.g. "Showing top 3 matches for Hospital Visit on 25 Aug"), "Refine Search" button.
     - *Match Cards (3 Cards)*:
       - **Card 1 (Top Match - 96%)**: Prominent "Best Match / แมตช์ที่ดีที่สุด" Emerald badge. SVG circular progress ring displaying 96%. Verified badge, photo, name, age, experience, rating (4.9 ★), specialty tags ("Hospital Escort", "Wheelchair Support", "First Aid Certified"), hourly rate (฿450/hr). Buttons: "View Profile" (`/caretaker/1`) and "Book Now" (`/book/1`).
       - **Card 2 (88%)**: SVG circular progress ring displaying 88%. Details, badges, rate (฿400/hr). Buttons: "View Profile" (`/caretaker/2`) and "Book Now" (`/book/2`).
       - **Card 3 (81%)**: SVG circular progress ring displaying 81%. Details, badges, rate (฿380/hr). Buttons: "View Profile" (`/caretaker/3`) and "Book Now" (`/book/3`).

   - **Page 4 (Caretaker Profile `/caretaker/:id`)**:
     - *Header Banner*: Wave header with blue-to-teal gradient (`from-sky-600 via-sky-500 to-teal-500`) with smooth SVG wave curve.
     - *Hero Profile Card*: Large avatar, full name, age, verified badge, rating & review count, rate per hour, and large AI Match Score badge (e.g. "96% Compatibility").
     - *Verification & Credentials*: Background check verified, Thai Red Cross CPR/First Aid certified, Looklarn Academy certified companion, National ID verified.
     - *Experience & Specialty Tags*: Total trips completed, years of caregiving, tag list (e.g. Wheelchair handling, Hospital queuing, Dementia support, English speaking).
     - *Bilingual Bio*: Narrative bio emphasizing background, compassion, and care philosophy.
     - *Availability Calendar*: Visual weekly/monthly calendar highlighting available slots (green) vs booked (gray).
     - *Reviews & Ratings*: Overall score (4.9/5.0), category scores (Punctuality 5.0, Attentiveness 4.9, Communication 4.8), 3 guardian review cards with dates.
     - *Sticky Bottom Bar*: Fixed bottom container with caretaker mini avatar, name, price (฿450/hr), and large "Book This Caretaker" button navigating to `/book/:id`.

   - **Page 5 (Booking `/book/:id`)**:
     - *Summary Cards*:
       - Elder summary: Photo, name, age, mobility, medical notes.
       - Caretaker summary: Photo, name, rating, match score.
       - Activity & Schedule: Activity type, date, time slot, duration.
     - *Location & Meeting Details*: Pickup address (with quick-select "Elder's Home Address"), Destination address (e.g. Siriraj Hospital Building 1), Landmark/Meeting notes.
     - *Price Calculation Breakdown*:
       - Caretaker Rate (฿450 × 4 hrs = ฿1,800)
       - Companion Accident Insurance & Service (฿150)
       - First-time Promo Discount (-฿200)
       - Total Amount: ฿1,750
     - *Payment Method Selection*: PromptPay QR Code, Credit/Debit Card, Mobile Banking.
     - *Confirm Booking CTA*: Triggers Success Modal upon click.
     - *Success Modal*: Animated checkmark, Booking ID (`#LK-20260825-001`), date, caretaker name, instructions. Buttons: "Go to My Bookings" (`/bookings`) and "Back to Home" (`/`).

   - **Page 6 (My Bookings `/bookings`)**:
     - *Tabs*: "Upcoming Bookings" (count: 2) | "Past Outings" (count: 1).
     - *Upcoming Booking Cards*:
       - Status badge: "Confirmed" (`bg-emerald-100 text-emerald-800`).
       - Booking ID, date, time, duration.
       - Caretaker photo, name, phone/chat mock actions.
       - Activity name, pickup & destination addresses.
       - Price paid.
       - Actions: "View Details", "Contact Caretaker", "Cancel / Reschedule".
     - *Past Booking Cards*:
       - Status badge: "Completed" (`bg-slate-100 text-slate-700`).
       - Details of past trip.
       - Action: "Leave a Review" (opens interactive review dialog with 5-star rating and comment input), "Book Again" (routes to `/book/:id`).

   - **Page 7 (Elder Profile `/elder-profile`)**:
     - *Header*: Guardian management title, elder avatar with change photo trigger.
     - *Section 1: General Info*: Name (คุณยายสมพร สุขสวัสดิ์ / Somporn Suksawat), Nickname (ยายพร), Age (74), Gender, Blood Type.
     - *Section 2: Physical & Mobility*: Mobility level radio group (Independent, Walking Cane, Wheelchair, Full Support), Wheelchair type, Assistance requirements.
     - *Section 3: Health & Medical*: Chronic conditions (Hypertension, Mild Diabetes, Knee Osteoarthritis), Current medications & schedule, Allergies, Hospital Number (HN) & Preferred Hospital (Chulalongkorn Hospital).
     - *Section 4: Lifestyle & Preferences*: Dialect (Central Thai, Teochew), Religion (Buddhist - enjoys morning merit), Dietary (Low sugar, soft diet), Hobbies & conversation topics.
     - *Section 5: Emergency Guardian Contacts*: Guardian Name, Relationship (Daughter), Primary Phone, Secondary Phone.
     - *Actions*: "Save Profile" button (triggers success toast and persists changes to Context/localStorage), "Find Caretaker for this Elder" CTA (routes to `/find` with pre-filled parameters).

---

## 3. Features Discovered Table

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | Global / Nav | Responsive Navbar | Fixed top header with logo, navigation links, and active route highlight | Click navigation link | Route transition | Fallback to Home if route invalid | `ORIGINAL_REQUEST.md:14`, `docs/implementation_plan.md:125` |
| 2 | Global / i18n | Single-Language Toggle Pill | `TH \| EN` pill toggle in navbar switching entire UI text instantly | Language switch click (`th` / `en`) | Immediate re-render of all text & mock data in selected language | Defaults to `th` if unset | `ORIGINAL_REQUEST.md:33-40`, `docs/design_decisions.md:21-36` |
| 3 | Global / Theme | Ocean Blue & Emerald Green Theme | Cohesive design system using Ocean Blue (`#0EA5E9`), Emerald Green (`#10B981`), Ice Blue (`#F0F9FF`), Navy (`#0F172A`), and Sarabun font | CSS styling tokens | Clean accessible UI across mobile/tablet/desktop | Graceful fallback fonts | `ORIGINAL_REQUEST.md:23-32`, `docs/design_decisions.md:7-18` |
| 4 | Home (`/`) | Hero Gradient Banner | Blue-to-teal gradient hero with headline, value prop, trust metrics, and primary search CTA | Click "Find Caretaker" CTA | Navigation to `/find` | None | `ORIGINAL_REQUEST.md:15`, `docs/implementation_plan.md:66` |
| 5 | Home (`/`) | 4 Featured Activity Cards | Cards for Hospital Visit, Temple/Merit, City Tour, and Social Event | Click activity card | Navigation to `/find` with activity pre-selected | Default activity selected if null | `ORIGINAL_REQUEST.md:15,45`, `docs/implementation_plan.md:67` |
| 6 | Home (`/`) | Hospital Promotions Strip | Promotional banner offering discounts on hospital companion bookings | View / click promo | Highlight promo discount code | None | `ORIGINAL_REQUEST.md:15`, `docs/implementation_plan.md:68` |
| 7 | Home (`/`) | 3-Step "How It Works" | Visual 3-step guide explaining the matchmaking and booking process | User scroll / view | Clear mental model of service | None | `ORIGINAL_REQUEST.md:15`, `docs/implementation_plan.md:69` |
| 8 | Home (`/`) | Guardian Testimonials | Real-life quotes from sons/daughters with ratings, photos, and parent stories | User scroll / view | Social proof & trust building | None | `ORIGINAL_REQUEST.md:15`, `docs/implementation_plan.md:70` |
| 9 | Find (`/find`) | 3-Step Wizard Form | Multi-step form: Step 1 (Physical Needs), Step 2 (Preferences), Step 3 (Schedule/Budget) | Step inputs, Next/Back clicks | Step progress bar update, form state persistence | Validation warning if required field empty | `ORIGINAL_REQUEST.md:16`, `docs/matching_flow.md:11-20` |
| 10 | Find (`/find`) | Form Pre-Fill from Elder Profile | Auto-fills Step 1 and Step 2 fields from saved Elder Profile | Load `/find` | Pre-populated inputs | Blank defaults if no profile exists | `docs/implementation_plan.md:104` |
| 11 | Find (`/find`) | AI Matching Loading Animation | 2.0-second simulated AI matching screen with animated ring and sequential status messages | Submit Step 3 | Animated overlay -> Auto redirect to `/matches` | Timeout fallback redirects cleanly | `ORIGINAL_REQUEST.md:16`, `docs/matching_flow.md:52-54` |
| 12 | Matches (`/matches`) | Top 3 Caretaker Match Cards | 3 caretaker cards displaying 96%, 88%, 81% scores respectively | Match search state | 3 scored candidate cards | Fallback to default top 3 if query empty | `ORIGINAL_REQUEST.md:17,70-74`, `docs/matching_flow.md:46` |
| 13 | Matches (`/matches`) | Circular Match Score Progress Ring | SVG animated circular progress gauge displaying numeric percentage | Score integer (96, 88, 81) | Visual circular stroke & centered text | Clamped between 0% and 100% | `ORIGINAL_REQUEST.md:17,72`, `docs/implementation_plan.md:79` |
| 14 | Matches (`/matches`) | "Best Match" Badge | Distinct Emerald Green badge on top match (96%) | Top card index (0) | Visual "Best Match" pill badge | Only displayed on highest score | `ORIGINAL_REQUEST.md:73` |
| 15 | Matches (`/matches`) | Direct Navigation Actions | "View Profile" (`/caretaker/:id`) and "Book Now" (`/book/:id`) buttons per card | Click action button | Direct route navigation | None | `ORIGINAL_REQUEST.md:17,54-55` |
| 16 | Profile (`/caretaker/:id`) | Wave Header Banner | Ocean blue gradient banner with curved wave SVG aesthetic | Caretaker ID in URL | Visual branding wave header | Fallback if invalid ID | `ORIGINAL_REQUEST.md:18`, `docs/implementation_plan.md:85` |
| 17 | Profile (`/caretaker/:id`) | AI Match Score & Verified Badges | Prominent score pill + verification badges (Background Check, Certified, First Aid) | Caretaker data | Verified trust badges & score | Shows standard verified status | `ORIGINAL_REQUEST.md:18`, `docs/matching_flow.md:62-70` |
| 18 | Profile (`/caretaker/:id`) | Bilingual Caregiver Bio & Experience | Full bio text, years of experience, completed trips, language tags, specialty chips | Language toggle state | Localized bio and specialty display | Renders fallback language if missing | `ORIGINAL_REQUEST.md:18,39` |
| 19 | Profile (`/caretaker/:id`) | Availability Calendar | Visual interactive calendar indicating available vs booked dates | Date slot selection | Available slot selection | Disables past / booked dates | `ORIGINAL_REQUEST.md:18`, `docs/implementation_plan.md:89` |
| 20 | Profile (`/caretaker/:id`) | Caretaker Reviews Section | Guardian star ratings, subcategory scores, and review comments | Caretaker reviews data | Review cards with ratings and timestamps | Shows "No reviews yet" if empty | `ORIGINAL_REQUEST.md:18`, `docs/implementation_plan.md:89` |
| 21 | Profile (`/caretaker/:id`) | Sticky Bottom Booking Bar | Viewport-fixed bottom bar on mobile/desktop with caretaker summary, rate, and "Book" button | User scroll | Persistent booking CTA | Visible across entire scroll | `ORIGINAL_REQUEST.md:18`, `docs/implementation_plan.md:90` |
| 22 | Booking (`/book/:id`) | Booking Summary Details | Summary cards for Elder info, Caretaker info, Selected Activity, Date & Time | Caretaker ID + Elder context | Comprehensive outing summary | Auto-populates default if missing | `ORIGINAL_REQUEST.md:19`, `docs/implementation_plan.md:93` |
| 23 | Booking (`/book/:id`) | Location & Destination Picker | Pickup address selector and destination input with landmark notes | Address inputs | Validated route details | Requires pickup & destination | `ORIGINAL_REQUEST.md:19`, `docs/implementation_plan.md:94` |
| 24 | Booking (`/book/:id`) | Itemized Price Breakdown | Base caretaker fee + platform/insurance fee - promo discount = total | Hours, rate, promo code | Real-time computed price breakdown | Non-negative price clamp | `ORIGINAL_REQUEST.md:19`, `docs/implementation_plan.md:94` |
| 25 | Booking (`/book/:id`) | Payment Method Selector | Options for PromptPay QR, Credit Card, Mobile Banking | Radio selection | Selected payment state | Defaults to PromptPay | `ORIGINAL_REQUEST.md:19` |
| 26 | Booking (`/book/:id`) | Booking Confirmation & Success Modal | Confirmation action launches modal with Booking ID, details, and navigation actions | Click "Confirm Booking" | Modal overlay with reference ID and redirect options | Button disabled while submitting | `ORIGINAL_REQUEST.md:19,56`, `docs/implementation_plan.md:95` |
| 27 | Bookings (`/bookings`) | Upcoming vs. Past Bookings Tabs | Tab switcher between upcoming trips (2 sample) and completed trips (1 sample) | Click tab pill | Filtered list of booking cards | Empty state illustration if 0 items | `ORIGINAL_REQUEST.md:20,44`, `docs/implementation_plan.md:98` |
| 28 | Bookings (`/bookings`) | Status Badges & Quick Actions | Status badges (Confirmed, Completed) + Contact, Reschedule, or Details buttons | Booking item state | Visual status indicator and active buttons | Disabled actions for cancelled trips | `ORIGINAL_REQUEST.md:20`, `docs/implementation_plan.md:99` |
| 29 | Bookings (`/bookings`) | "Leave Review" Dialog | Modal review form on past bookings with 5-star selector and comment submission | Click "Leave Review" on past card | Review submission toast & updated state | Requires star rating | `docs/implementation_plan.md:100` |
| 30 | Elder Profile (`/elder-profile`) | Editable Elder Details | Form sections: Avatar, Name, Nickname, Age, Gender, Blood Type | User text inputs | Updated elder record | Validation for required name/age | `ORIGINAL_REQUEST.md:21,46`, `docs/implementation_plan.md:103` |
| 31 | Elder Profile (`/elder-profile`) | Mobility & Medical Condition Manager | Radio buttons for mobility, tag chips for chronic conditions, medication schedule | User selections | Updated physical profile | None | `ORIGINAL_REQUEST.md:21`, `docs/implementation_plan.md:103` |
| 32 | Elder Profile (`/elder-profile`) | Preferences & Emergency Contacts | Language, religion, dietary restrictions, primary & secondary guardian emergency phone numbers | User inputs | Updated preference & safety records | Phone format validation | `ORIGINAL_REQUEST.md:21`, `docs/matching_flow.md:11-20` |
| 33 | Elder Profile (`/elder-profile`) | Save Profile with Toast Feedback | Save button updating global state/localStorage with visual toast confirmation | Click "Save Profile" | Toast notification + state sync | Reverts if save error | `docs/implementation_plan.md:103` |
| 34 | Elder Profile (`/elder-profile`) | "Find Caretaker for this Elder" CTA | Quick action on Elder Profile navigating directly to `/find` with pre-filled criteria | Click CTA button | Navigates to `/find` | None | `docs/implementation_plan.md:104` |

---

## 4. Edge Cases & Boundary Conditions

| # | Feature | Input / Condition | Observed / Specified Behavior |
|---|---------|-------------------|--------------------------------|
| 1 | Language Toggle | User switches language while mid-step on `/find` | Current form values and progress step are preserved; all field labels, placeholders, and error messages switch instantly without resetting inputs. |
| 2 | Language Toggle | Caretaker profile viewed in Thai vs English | Caretaker name, bio, specialty tags, and review comments switch between Thai and English versions without raw key leakage. |
| 3 | AI Match Score Ring | Match scores 96%, 88%, 81% | SVG circle stroke `stroke-dasharray` and `stroke-dashoffset` calculate exact circumference percentages (`(100 - score) / 100 * circumference`). |
| 4 | Direct URL access to `/matches` | User navigates directly to `/matches` without completing `/find` | Default search parameters and top 3 mock candidates (96%, 88%, 81%) render immediately without error. |
| 5 | Caretaker ID in `/caretaker/:id` | Invalid caretaker ID (e.g. `/caretaker/999`) | App gracefully falls back to the first caretaker profile or displays a "Caretaker not found" friendly message with a button back to `/matches`. |
| 6 | Direct access to `/book/:id` | User navigates directly to `/book/1` | Pre-fills default booking parameters (elder Somporn, default date tomorrow 09:00, 4 hours duration, Hospital Visit) so booking form is fully functional. |
| 7 | Booking Confirmation | User clicks "Confirm Booking" button multiple times rapidly | Button transitions to loading state, disables further clicks, opens Success Modal with unique generated booking reference. |
| 8 | Success Modal Navigation | User clicks "Go to My Bookings" on modal | Modal dismisses, newly created booking is prepended to the Upcoming list in `BookingContext`, and app routes to `/bookings`. |
| 9 | Mobile Viewport (375px) | Sticky bottom bar on `/caretaker/:id` | Pinned to bottom of mobile screen with safe area padding (`pb-safe`), ensuring it does not overlap content or break layout. |
| 10 | Elder Profile Save | User edits elder name and mobility, saves, then navigates to `/find` | `/find` Step 1 immediately reflects the updated mobility and name from `ElderContext`. |
| 11 | Empty Review Form | User opens "Leave Review" modal and submits without star rating | Validation message prompts user to select at least 1 star before submitting. |
| 12 | Long Text Strings | Elder condition notes or caretaker bio contains long multi-line text | Text wraps gracefully with responsive typography, maintaining line heights without layout shifts. |

---

## 5. Screen-by-Screen Detailed UI/UX Specification

### 5.1 Global Layout & Design System
- **Colors:**
  - Primary (Ocean Blue): `#0EA5E9` (`sky-500`), Darker Blue: `#0284C7` (`sky-600`), Light Blue: `#E0F2FE` (`sky-100`)
  - Accent / CTA (Emerald Green): `#10B981` (`emerald-500`), Darker Green: `#059669` (`emerald-600`), Light Green: `#D1FAE5` (`emerald-100`)
  - Background (Ice Blue): `#F0F9FF` (`sky-50`)
  - Surface / Card: `#FFFFFF`
  - Text Primary: `#0F172A` (`slate-900`)
  - Text Secondary: `#64748B` (`slate-500`)
  - Border: `#E2E8F0` (`slate-200`)
- **Typography:**
  - Font Family: `'Sarabun', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
  - Scale: H1 (28-36px / bold), H2 (22-28px / semibold), H3 (18-22px / semibold), Body (14-16px / regular), Caption (12-13px / medium)
- **Top Navigation Bar (`Navbar`):**
  - Left: Logo icon (Heart & Hands / Flower icon 🌸) + Brand Text: `Looklarn` (ลูกหลาน)
  - Center/Right Links:
    - 🏠 Home (`/`)
    - 🔍 Find a Caretaker (`/find`)
    - 📋 My Bookings (`/bookings`)
    - 👴 Elder Profile (`/elder-profile`)
  - Far Right: `TH | EN` Language Toggle Pill (active language in white pill with primary blue background, inactive in subtle slate text).
  - Mobile: Responsive hamburger menu or clean icon bar.

---

### 5.2 Page 1: Home (`/`)
1. **Hero Section:**
   - Background: Smooth gradient from Ocean Blue (`#0EA5E9`) to Soft Teal (`#14B8A6`).
   - Content:
     - Tagline / Badge: "AI-Powered Elder Companion Platform" / "แพลตฟอร์มจับคู่ผู้ดูแลผู้สูงอายุด้วย AI"
     - Main Heading: "Trusted Companions for Your Beloved Parents" / "พาคุณพ่อคุณแม่ไปทุกที่... อุ่นใจเหมือนมีลูกหลานไปด้วย"
     - Subtitle: "Verified, certified, and compassionate caretakers for hospital visits, temple merit-making, city tours, and family events." / "ผู้ดูแลที่ผ่านการคัดกรองและอบรม พาไปโรงพยาบาล ไหว้พระ เที่ยวพักผ่อน ปลอดภัยทุกการเดินทาง"
     - Primary CTA: Large Emerald Green button: "Find a Caretaker Now" / "ค้นหาผู้ดูแลทันที" (navigates to `/find`)
     - Trust Badges: 3 inline trust pills (🛡️ 100% Background Checked, 🩺 First-Aid Certified, ⭐ 4.9/5 Rating from 1,200+ Families).
2. **Featured Activity Categories (4 Interactive Cards):**
   - **Activity 1: Hospital Visit (ไปโรงพยาบาล)**
     - Icon: Stethoscope / Hospital building
     - Description: Escort to doctor appointments, queuing assistance, wheelchair pushing, pharmacy collection, clear doctor note summaries for family.
   - **Activity 2: Temple & Merit Making (ไหว้พระ ทำบุญ)**
     - Icon: Lotus / Temple
     - Description: Peaceful companion for Buddhist merit-making, temple visits, meditation walks, safe physical support.
   - **Activity 3: City Tour & Shopping (เที่ยวในเมือง ช้อปปิ้ง)**
     - Icon: Shopping bag / Park tree
     - Description: Outings to malls, scenic parks, restaurants, museum visits with gentle companionship.
   - **Activity 4: Family Events & Social (งานเลี้ยงสังสรรค์ กิจกรรมครอบครัว)**
     - Icon: Users / Calendar
     - Description: Escort to weddings, school graduations, family reunions ensuring elders stay safe and celebrated.
   - *Interaction:* Clicking any card navigates to `/find` with that activity pre-selected in Step 2.
3. **Partner Hospital Promotions Strip:**
   - Visual banner with partner badges (e.g. Bangkok Hospital, Siriraj Piyamaharajkarun, Chulalongkorn).
   - Offer text: "Special Launch: 15% discount on hospital escort sessions + complimentary accidental insurance." / "โปรโมชั่นพิเศษ: ลด 15% สำหรับบริการพาไปโรงพยาบาล พร้อมฟรีประกันอุบัติเหตุ"
4. **"How It Works" 3-Step Section:**
   - Step 1: "Share Elder's Needs" (Tell us mobility, preferences, and schedule)
   - Step 2: "AI Compatibility Match" (Instant top 3 matched verified companions with match score)
   - Step 3: "Book & Track with Peace of Mind" (Secure booking, real-time updates, complete post-trip summary)
5. **Guardian Testimonials:**
   - 3 Testimonial cards with guardian photo, name, relation (e.g. "K. Nutthaporn, Daughter", "K. Thanawat, Son"), star rating (5.0 ★), quote, and parent photo/activity badge.
6. **Footer:**
   - Brand logo, about summary, quick navigation links, emergency notice, and copyright.

---

### 5.3 Page 2: Find a Caretaker (`/find`)
1. **Header & Progress Indicator:**
   - Heading: "Find the Perfect Caretaker" / "ค้นหาผู้ดูแลที่ตรงใจ"
   - Step Wizard:
     - Step 1: Physical & Medical (สุขภาพและการเคลื่อนไหว)
     - Step 2: Preferences & Lifestyle (ความชอบและภาษา)
     - Step 3: Schedule & Budget (วันเวลาและงบประมาณ)
   - Active step indicator with progress bar filling 33% → 66% → 100%.
2. **Step 1 Form (Physical & Medical):**
   - Elder Selection / Auto-fill banner ("Using profile for Grandma Somporn" with "Change" button).
   - Mobility Level (Radio Cards with icons):
     - Walking Independently (เดินได้คล่องตัว)
     - Uses Cane / Walker (ใช้ไม้เท้า/วอล์กเกอร์)
     - Uses Wheelchair (ใช้รถเข็น)
     - Requires Continuous Physical Support (ต้องการการพยุงตลอดเวลา)
   - Health Conditions (Multi-select Badges):
     - Diabetes (เบาหวาน), Hypertension (ความดันโลหิตสูง), Heart Condition (โรคหัวใจ), Dementia / Alzheimer's (ภาวะสมองเสื่อม/อัลไซเมอร์), None (ไม่มี)
   - Medication Assistance: Toggle Switch ("Requires medication reminders during outing")
   - Specific Assistance Needed:
     - Wheelchair Pushing (เข็นรถเข็น), Queue Management (ช่วยรอคิว), Restroom Assistance (ช่วยเข้าห้องน้ำ), Heavy Lifting (ช่วยพยุงลุกนั่ง)
3. **Step 2 Form (Preferences & Lifestyle):**
   - Outing Type: 4 activity selector chips (Hospital, Temple, City/Shopping, Event).
   - Caretaker Gender Preference: Female (หญิง), Male (ชาย), Any (ไม่จำกัด).
   - Preferred Language / Dialect: Thai Central (ไทยกลาง), Isaan (อีสาน), Northern (เหนือ), Southern (ใต้), English (อังกฤษ), Mandarin (จีน).
   - Dietary & Religious Notes: Radio / Chips for Buddhist, Christian, Muslim, Any, and dietary preferences (Low Sodium, Halal, Vegetarian).
4. **Step 3 Form (Schedule & Budget):**
   - Outing Date: Date picker (default: tomorrow).
   - Time Slot: Morning (08:00 - 12:00), Afternoon (13:00 - 17:00), Full Day (08:00 - 17:00), or Custom time.
   - Duration: 2 Hours, 4 Hours, 8 Hours.
   - Budget Range: Interactive slider (฿300/hr to ฿1,000/hr).
   - Special Instructions: Textarea for extra guardian notes.
5. **Navigation Buttons:**
   - "Back" button (disabled on Step 1).
   - "Next" / "Find Matches with AI" button.
6. **AI Matching Loading Screen (Modal):**
   - Triggers on Step 3 submit.
   - 2.0s duration with rotating messages:
     - 0.0s – 0.7s: "Analyzing physical requirements and mobility needs..."
     - 0.7s – 1.4s: "Searching verified caretakers with matching certifications..."
     - 1.4s – 2.0s: "Calculating AI compatibility scores..."
   - Animated circular pulse ring with Brain/AI Sparkles icon.
   - Automatic navigation to `/matches`.

---

### 5.4 Page 3: Match Results (`/matches`)
1. **Header:**
   - Title: "Top 3 AI Matches for Your Elder" / "ผลการจับคู่ 3 อันดับที่ดีที่สุด"
   - Subtitle: "Based on medical needs, language compatibility, and schedule" / "คัดกรองจากความต้องการด้านสุขภาพ ภาษา และเวลาที่เลือก"
2. **Top 3 Match Cards:**
   - **Card 1 (Top Match - 96%):**
     - "Best Match / แมตช์ที่ดีที่สุด" Emerald Badge with Star.
     - Circular AI Match Score Ring (SVG circle, 96% centered in bold emerald text).
     - Caretaker Photo: Friendly, professional portrait with verified checkmark.
     - Name & Age: e.g. "Preeya S. (ก้อย)" / 32 years old.
     - Tier: "Expert Caretaker (ผู้ดูแลระดับเชี่ยวชาญ)"
     - Star Rating: 4.9 ★ (64 reviews).
     - Specialty Badges: "Hospital Escort Specialist", "Wheelchair Certified", "CPR & First Aid", "Fluent English".
     - Hourly Rate: ฿450/hr (Estimated total: ฿1,800 for 4 hrs).
     - Availability: "Available for your selected date".
     - Action Buttons:
       - "View Profile" (`/caretaker/1`) — Outline button.
       - "Book Now" (`/book/1`) — Solid Emerald Green CTA button.
   - **Card 2 (Match 2 - 88%):**
     - Circular AI Match Score Ring: 88%.
     - Caretaker Photo, Name (e.g. "Somchai W. (ชัย)" / 28 yrs), Tier ("Trained Caretaker").
     - Rating: 4.8 ★ (42 reviews).
     - Specialty Badges: "Temple Tours", "Gentle Mobility Support", "Isaan Speaker".
     - Hourly Rate: ฿400/hr.
     - Action Buttons: "View Profile" (`/caretaker/2`) and "Book Now" (`/book/2`).
   - **Card 3 (Match 3 - 81%):**
     - Circular AI Match Score Ring: 81%.
     - Caretaker Photo, Name (e.g. "Anong P. (หน่อย)" / 35 yrs), Tier ("Certified Caretaker").
     - Rating: 4.7 ★ (31 reviews).
     - Specialty Badges: "Patient & Cheerful", "Dietary Management", "Wheelchair Support".
     - Hourly Rate: ฿380/hr.
     - Action Buttons: "View Profile" (`/caretaker/3`) and "Book Now" (`/book/3`).
3. **Secondary Actions:**
   - "Modify Search / Adjust Filters" button -> navigates back to `/find`.

---

### 5.5 Page 4: Caretaker Profile (`/caretaker/:id`)
1. **Wave Header Banner:**
   - Gradient banner in Ocean Blue (`from-sky-600 via-sky-500 to-teal-500`).
   - Smooth decorative bottom SVG wave curve.
2. **Profile Card Overlay:**
   - Avatar with verified checkmark badge.
   - Name, Age, Title/Tier ("Looklarn Certified Senior Escort").
   - Rating: 4.9 ★ (64 reviews) | 240+ completed trips.
   - Prominent AI Match Score badge: Emerald pill displaying "96% AI Match with Grandma Somporn".
3. **Verification & Trust Badges:**
   - 🛡️ Criminal Background Check: Verified & Cleared
   - 🆔 National Identity & Address: Verified
   - 🩺 CPR & First Aid (Thai Red Cross): Certified
   - 🎓 Looklarn Academy Elder Care Program: Graduated
4. **Experience & Specialties:**
   - Years of experience: 4+ years.
   - Specialty chips: "Hospital Queuing", "Wheelchair Assistance", "Medication Reminder", "Conversational Companionship", "Basic Physical Therapy".
   - Languages: Thai (Native), Isaan (Fluent), English (Conversational).
5. **Bilingual Bio / About Caretaker:**
   - Personal introduction detailing caregiving passion, warmth, and previous hospital experience.
6. **Availability Calendar:**
   - Interactive calendar widget showing current month.
   - Green dots for available days, gray for booked days.
7. **Guardian Reviews Section:**
   - Aggregate rating breakdown: Punctuality (5.0), Attentiveness (4.9), Communication (4.9).
   - 3 detailed review cards with guardian name, date, and review comment.
8. **Sticky Bottom Booking Bar:**
   - Fixed to bottom of screen.
   - Displays Caretaker avatar, name, rate (฿450/hr), and large "Book This Caretaker" ("จองผู้ดูแลท่านนี้") button linking to `/book/:id`.

---

### 5.6 Page 5: Booking & Confirmation (`/book/:id`)
1. **Elder & Caretaker Summary Cards:**
   - Elder Details: Grandma Somporn (74 yrs, Wheelchair, Hypertension).
   - Caretaker Details: Preeya S. (4.9 ★, 96% Match).
2. **Outing Details:**
   - Activity: Hospital Visit (ไปโรงพยาบาล).
   - Date & Time: 25 August 2026, 09:00 - 13:00 (4 hours).
3. **Pickup & Destination Locations:**
   - Pickup Address: Input field with pre-filled default "123 Sukhumvit 71, Phra Khanong, Bangkok".
   - Destination: Input field "Siriraj Hospital, Outpatient Building 1".
   - Meeting Notes: "Meet in front of Building 1 Entrance. Elder has own foldable wheelchair."
4. **Itemized Price Breakdown:**
   - Caretaker Service (4 hrs × ฿450/hr): ฿1,800
   - Companion Accident Insurance & Service Fee: ฿150
   - Special Promotional Discount: -฿200
   - **Total Amount: ฿1,750**
5. **Payment Method:**
   - PromptPay QR Code (Selected by default)
   - Credit / Debit Card
   - Mobile Banking
6. **Confirmation CTA:**
   - Button: "Confirm & Book Caretaker" / "ยืนยันการจอง"
7. **Success Modal:**
   - Triggered on confirm.
   - Animated green checkmark.
   - Reference Code: `#LK-20260825-001`.
   - Outing date & time confirmation.
   - Notice: "Your caretaker has been notified and will contact you 30 minutes before arrival."
   - Action Buttons:
     - "View My Bookings" (`/bookings`)
     - "Back to Home" (`/`)

---

### 5.7 Page 6: My Bookings (`/bookings`)
1. **Header & Tab Navigation:**
   - Title: "My Bookings" / "รายการจองของฉัน"
   - Tabs:
     - "Upcoming" (2 items)
     - "Past / History" (1 item)
2. **Upcoming Bookings Tab:**
   - **Card 1 (Upcoming - Tomorrow):**
     - Status Badge: `Confirmed` (Emerald Green).
     - Booking ID: `#LK-20260825-001`.
     - Date & Time: 25 Aug 2026 | 09:00 - 13:00 (4 hrs).
     - Caretaker: Preeya S. (Photo, 4.9 ★).
     - Activity: Hospital Visit — Siriraj Hospital.
     - Elder: Grandma Somporn.
     - Actions: "Call Caretaker", "Send Chat Message", "Reschedule / Cancel".
   - **Card 2 (Upcoming - Next Week):**
     - Status Badge: `Confirmed` (Emerald Green).
     - Booking ID: `#LK-20260830-003`.
     - Date & Time: 30 Aug 2026 | 08:00 - 12:00 (4 hrs).
     - Caretaker: Somchai W.
     - Activity: Temple Merit Making — Wat Phra Kaew.
     - Actions: "View Details", "Contact Caretaker".
3. **Past Bookings Tab:**
   - **Card 3 (Past - Completed):**
     - Status Badge: `Completed` (Slate Gray).
     - Booking ID: `#LK-20260810-002`.
     - Date & Time: 10 Aug 2026 | 13:00 - 17:00 (4 hrs).
     - Caretaker: Preeya S.
     - Activity: City Park & Coffee — Lumphini Park.
     - Actions:
       - "Leave a Review" / "ให้คะแนนและรีวิว" (opens review modal with 5 stars and text input).
       - "Book Again" (`/book/1`).

---

### 5.8 Page 7: Elder Profile (`/elder-profile`)
1. **Header:**
   - Title: "Elder Profile Management" / "ข้อมูลผู้สูงอายุที่คุณดูแล"
   - Subtitle: "This information helps AI match the most compatible caretakers automatically."
2. **Profile Card & Photo:**
   - Large photo of elder with "Change Photo" badge.
   - Name: คุณยายสมพร สุขสวัสดิ์ / Grandma Somporn Suksawat.
   - Nickname: ยายพร / Grandma Porn.
   - Age: 74 years old.
   - Gender: Female.
3. **Mobility & Physical Status (Editable):**
   - Mobility Level: Radio group (Selected: Wheelchair / ใช้รถเข็น).
   - Wheelchair Details: "Foldable manual wheelchair provided by family."
   - Assistance Needs: "Needs help standing up and navigating hospital ramps."
4. **Medical & Health Conditions (Editable):**
   - Chronic Conditions: Chips for `Hypertension`, `Mild Diabetes`, `Knee Osteoarthritis`.
   - Routine Medications: "Blood pressure medication after breakfast (08:30)".
   - Dietary Restrictions: "Low sodium, diabetic friendly, soft texture food".
   - Preferred Hospital: "Siriraj Hospital (HN: 58-129482)".
5. **Personality, Language & Lifestyle (Editable):**
   - Preferred Dialect: Thai Central, Teochew.
   - Religion: Buddhist (enjoys morning chanting and making merit).
   - Hobbies / Personality: Cheerful, loves storytelling about old Bangkok, enjoys herbal gardens.
6. **Guardian Emergency Contacts (Editable):**
   - Primary Guardian: Nutthaporn S. (Daughter) — `081-234-5678`.
   - Secondary Contact: Thanawat S. (Son) — `089-876-5432`.
7. **Action Buttons:**
   - "Save Changes" ("บันทึกข้อมูล") — Persists to global state and triggers visual success toast.
   - "Find a Caretaker for Grandma Somporn" — Direct CTA linking to `/find` with all profile attributes pre-filled.

---

## 6. Verification Method

To independently verify all specified requirements during and after implementation:

1. **Static Spec Compliance Inspection:**
   - Inspect route definitions in React Router (`App.jsx`): Verify routes `/`, `/find`, `/matches`, `/caretaker/:id`, `/book/:id`, `/bookings`, `/elder-profile`.
   - Inspect design tokens in Tailwind config / CSS: Verify `#0EA5E9`, `#10B981`, `#F0F9FF`, `#0F172A`, font `Sarabun`.
   - Inspect i18n dictionary files (`th.js`, `en.js`): Verify 100% string coverage, zero mixed bilingual labels on any single component.
   - Inspect mock datasets (`caretakers.json`, `bookings.json`, `activities.json`, `elder.json`): Verify 5 caretakers with match scores (96%, 88%, 81%), 3 sample bookings (2 upcoming, 1 past), 4 activities, 1 elder profile.

2. **Interactive Flow & Routing Verification:**
   - Test Flow 1: Click "Find Caretaker" on `/` -> Step 1 -> Step 2 -> Step 3 -> AI Loading (2s) -> `/matches`.
   - Test Flow 2: On `/matches`, verify 3 circular score rings (96%, 88%, 81%) and "Best Match" badge on card 1. Click "View Profile" -> `/caretaker/1`.
   - Test Flow 3: On `/caretaker/1`, verify wave header, badges, calendar, sticky bottom Book button. Click "Book This Caretaker" -> `/book/1`.
   - Test Flow 4: On `/book/1`, verify price breakdown, fill address, click "Confirm Booking" -> verify Success Modal appears -> click "View in My Bookings" -> `/bookings`.
   - Test Flow 5: On `/bookings`, switch between Upcoming (2 cards) and Past (1 card). Test "Leave Review" modal.
   - Test Flow 6: On `/elder-profile`, edit name/conditions, click "Save", navigate to `/find` -> verify pre-population.
   - Test Flow 7: Toggle `TH | EN` on every page -> verify all text switches cleanly.

3. **Build & Quality Commands:**
   - Dev Server: `npm run dev` (starts on Vite dev port without warnings/errors).
   - Production Build: `npm run build` (builds production bundle without TypeScript/ESLint/Vite build errors).

---

## 7. Caveats

1. **Pure Prototype / Pitch Deck Scope:** All data is hardcoded mock JSON in client-side state/Context; no persistent backend database or actual SMS/email dispatch is implemented.
2. **Simulated AI Matching:** The matching algorithm uses pre-assigned mock compatibility scores (96%, 88%, 81%) and a 2.0s loading animation to simulate real-time AI inference.
3. **Payment Processing:** Payment methods (PromptPay QR, Credit Card) are simulated UI representations for demonstration purposes.

---

## 8. Conclusion

All UI/UX requirements, screen specifications, interactive states, navigation routes, responsive constraints, i18n rules, and acceptance criteria for Looklarn (ลูกหลาน) have been completely mined and documented. The specification provides a clear blueprint for engineering and design implementation.
