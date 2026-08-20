# AI Matching Flow - Looklarn

## Overview

The matching system collects key attributes about the elder and matches them against caretaker profiles to produce a compatibility score (0-100%) for the top 3 results.

---

## Matching Criteria

### From Guardian (Input)

| Category | Fields |
|---|---|
| Physical | Mobility level, medical conditions, medication management needed |
| Personality | Language preference, religion, dietary needs |
| Activity | Type of outing (hospital, temple, tourism, event) |
| Schedule | Date, time, duration (2h / 4h / full day) |
| Budget | Min-Max range per session |

### From Caretaker (Profile)

| Category | Fields |
|---|---|
| Specialties | Medical escort, physical assistance, dementia care, emotional support |
| Languages | Thai, English, Isaan, Mandarin, etc. |
| Certifications | Background check, first aid, CPR, dementia training |
| Experience | Beginner / Intermediate / Expert (years) |
| Schedule | Availability calendar |
| Rate | Hourly rate (THB) |
| Rating | Average star rating + number of reviews |

---

## Scoring Weights (Prototype - Mock Logic)

| Factor | Weight |
|---|---|
| Specialty match | 30% |
| Language match | 20% |
| Budget fit | 20% |
| Availability | 15% |
| Rating | 10% |
| Religious/dietary match | 5% |

> Note: In the prototype, scores are pre-assigned mock values (e.g. 96%, 88%, 81%) to simulate AI output.

---

## UX Flow

Guardian fills 3-step form
  -> AI Matching loading animation (2s)
  -> Top 3 caretakers shown as cards with AI Match Score
  -> Guardian views caretaker profile
  -> Guardian books caretaker
  -> Booking confirmation + success modal
  -> Redirected to My Bookings

---

## Caretaker Tiers (Planned)

| Tier | Requirements | Badge |
|---|---|---|
| Starter | Basic background check | Verified |
| Trained | Looklarn training program completed | Trained |
| Expert | 2+ years experience + advanced cert | Expert |
| Specialist | Medical/dementia specialty training | Specialist |

---

## Privacy and Safety (Planned for Production)

- Background checks mandatory for all caretakers
- ID verification before first booking
- GPS tracking during outing session (opt-in)
- Emergency SOS button in app
- Real-time caretaker location sharing with guardian
- Post-session review required from guardian