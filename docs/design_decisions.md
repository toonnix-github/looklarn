# Design Decisions - Looklarn

This document records key design decisions made during planning.

---

## Color Palette

Changed from warm amber/orange to **blue and green**.

| Role | Color | Hex |
|---|---|---|
| Primary | Ocean Blue | #0EA5E9 |
| Accent / CTA | Emerald Green | #10B981 |
| Background | Ice Blue | #F0F9FF |
| Text | Dark Navy | #0F172A |
| Subtext | Gray | #6B7280 |

---

## Language Strategy

Changed from **bilingual (show both at once)** to **single language with toggle**.

### Before (rejected)
Labels showed both languages simultaneously:
  Hospital Visit / (Thai text)
  Find a Caretaker / (Thai text)

### After (chosen)
- Only ONE language displayed at a time
- **TH | EN** pill toggle in the top navbar
- Default: Thai
- Switching instantly re-renders all UI text
- Cleaner, easier to read for both audiences

---

## Responsiveness

- Mobile-first design
- Responsive across mobile, tablet, and desktop
- No phone frame in prototype - renders as a real web page