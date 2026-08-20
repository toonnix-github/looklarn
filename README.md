# Looklarn (ลูกหลาน) 🌸

> **AI-powered elder care companion matching app**

Looklarn (ลูกหลาน means "descendants/grandchildren" in Thai) is a platform that connects **family guardians** — sons, daughters, and grandchildren — with **trusted, verified caretakers** who accompany elders to hospitals, temples, tourist locations, events, and more.

---

## 🎯 Problem

Working families struggle to find trusted, qualified companions to escort their elderly parents and grandparents to important outings. Existing solutions lack:
- AI-powered compatibility matching
- Verified & trained caretaker profiles
- Seamless booking experience
- Thai-language support

## 💡 Solution

Looklarn provides an AI-matching flow that considers:
- **Physical conditions** (mobility, medical needs)
- **Personality & lifestyle** (religion, language, diet)
- **Schedule & budget** (timing, duration, cost)

The AI returns the **top 3 matched caretakers** with a compatibility score, allowing guardians to book instantly.

---

## 🚀 Tech Stack *(Planned)*

| Layer | Technology |
|---|---|
| Framework | React + Vite |
| Styling | Tailwind CSS + shadcn/ui |
| Routing | React Router v6 |
| State | React Context |
| Language | Bilingual (Thai 🇹🇭 + English 🇬🇧) |
| Data | Mock JSON (pitch prototype) |
| Icons | Lucide React |

---

## 📱 Screens (7 Pages)

| # | Screen | Route |
|---|---|---|
| 1 | 🏠 Home — Landing with activities, events, promotions | `/` |
| 2 | 🔍 Find a Caretaker — AI matching form (3 steps) | `/find` |
| 3 | 🤖 Match Results — Top 3 with AI compatibility score | `/matches` |
| 4 | 👤 Caretaker Profile Detail | `/caretaker/:id` |
| 5 | 📅 Booking / Confirmation | `/book/:id` |
| 6 | 📋 My Bookings / History | `/bookings` |
| 7 | 👴 Elder Profile (guardian manages elder's info) | `/elder-profile` |

---

## 🎨 Design System

- **Primary**: Warm amber `#F59E0B` — warmth & trust
- **Accent**: Soft teal `#14B8A6` — calm & health
- **Background**: Cream white `#FFFBF5` — soft, non-clinical
- **Font**: Sarabun (Google Fonts) — supports Thai + Latin
- **Tone**: Warm, trustworthy, family-oriented

---

## 📖 Documentation

- [Implementation Plan](./docs/implementation_plan.md) — Full technical design & screen breakdown
- [Matching Flow](./docs/matching_flow.md) — AI matching criteria & UX flow

---

## 📌 Status

> **Stage**: Implemented Pitch Prototype  
> The React/Vite prototype is implemented with 7 routes, bilingual Thai/English UI, mock elder-care data, booking flows, and Vitest coverage for the core product journeys.

---

## 👥 Target Users

| User | Role |
|---|---|
| Guardian | Son, daughter, or grandchild managing elder care |
| Elder | Parent or grandparent needing a companion for outings |
| Caretaker | Verified, trained companion (not a nurse, but a trusted escort) |

---

*Built with ❤️ for Thai families*
