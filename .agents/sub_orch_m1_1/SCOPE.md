# Scope: M1 — Scaffolding, Design Tokens, i18n & Shared UI Kit

## Architecture
Vite + React 18 SPA + Tailwind CSS + Lucide Icons + React Router v6.
- i18n subsystem (Thai default, clean dual-language dictionaries with 10 namespaces)
- AppContext / Global state (Elder profile, bookings, search criteria, localStorage persistence)
- Mock datasets (Caretakers with match criteria, Bookings, Activities, Elder)
- Shared UI Component Kit (MatchScoreRing, Badge, Button, Card, Modal, Toast)
- Layout Components (Navbar, Footer, LanguageToggle, ScrollToTop)
- App router shell with 8 placeholder views and route aliases

## Feature Inventory (Assigned to M1)
| # | Feature | Description | Milestone | Status |
|---|---|---|---|---|
| 1 | Project Scaffolding | package.json, vite.config.js, tailwind.config.js, postcss.config.js, index.html with Sarabun font, src/index.css | M1 | DONE |
| 2 | Design Tokens & Styling | Ocean Blue (#0EA5E9), Emerald Green (#10B981), Ice Blue (#F0F9FF), Dark Navy (#0F172A), rounded xl/2xl | M1 | DONE |
| 3 | i18n System | th.js, en.js, index.js, LanguageContext.jsx (default TH, 100% clean dual-language) | M1 | DONE |
| 4 | Mock Data Architecture | caretakers.json (5 profiles), bookings.json (3 bookings), activities.json (4 activities), elder.json (Grandma Somporn) | M1 | DONE |
| 5 | AppContext & Global State | AppContext.jsx with elder state, booking management, search filters | M1 | DONE |
| 6 | Shared UI Kit & Layout | Navbar, Footer, LanguageToggle, ScrollToTop, MatchScoreRing, Badge, Button, Card, Modal, Toast, utils/cn.js, utils/formatters.js | M1 | DONE |
| 7 | Router Shell & Placeholders | App.jsx router with HomePage, FindCaretakerPage, MatchResultsPage, CaretakerProfilePage, BookingPage, MyBookingsPage, ElderProfilePage, NotFoundPage | M1 | DONE |
| 8 | Build & Verification | Clean Vite build and Vitest verification (100% pass) | M1 | DONE |

## Interface Contracts & Layout
- Global State: `useAppContext()` provides `{ elder, bookings, addBooking, cancelBooking, searchFilters, setSearchFilters }`
- Language State: `useLanguage()` provides `{ lang, setLang, t, getLocalized }`
- Formatters: `formatCurrency(amount, lang)`, `formatDate(date, lang)`, `formatScore(score)`
- UI Component props standard: match tailwind tokens and support standard React children/className.

## Code Layout
- `src/`
  - `components/`
    - `layout/` (Navbar.jsx, Footer.jsx, LanguageToggle.jsx, ScrollToTop.jsx)
    - `ui/` (MatchScoreRing.jsx, Badge.jsx, Button.jsx, Card.jsx, Modal.jsx, Toast.jsx)
  - `context/` (LanguageContext.jsx, AppContext.jsx)
  - `data/` (caretakers.json, bookings.json, activities.json, elder.json)
  - `i18n/` (th.js, en.js, index.js)
  - `pages/` (HomePage.jsx, FindCaretakerPage.jsx, MatchResultsPage.jsx, CaretakerProfilePage.jsx, BookingPage.jsx, MyBookingsPage.jsx, ElderProfilePage.jsx, NotFoundPage.jsx)
  - `utils/` (cn.js, formatters.js)
  - `App.jsx`, `main.jsx`, `index.css`
