# Design QA — Upcoming appointment card

- Source visual truth: `/workspace/scratch/18ab0f902b25/upload/01-1000007484.jpg`
- Source pixels: 690 × 1536, device screenshot at 2×-class density
- Intended CSS viewport: approximately 393 × 852 mobile
- Implementation target: `src/pages/HomePage.jsx`, mobile dashboard state in Thai
- Implementation screenshot: unavailable
- Browser-rendered evidence: unavailable because the cloud browser blocked the local preview URL with `net::ERR_BLOCKED_BY_CLIENT`
- Build verification: `npm run build` passed with Vite 5.4.21
- Primary interactions tested: blocked with browser rendering
- Console errors checked: blocked before page load

## Full-view comparison evidence

The source shows the original primary appointment card with the date, a two-line appointment title, and two compact metadata pills compressed into a short vertical card. The implementation restructures this region into a two-column card: a dedicated date rail on the left and a larger content region on the right. The main appointment now receives 56% of the available appointment stack instead of 48%.

## Focused region comparison evidence

Source region inspected: the circled primary appointment card. Code-level checks confirm:

- date is isolated with a calendar icon in a tinted side rail;
- title retains a two-line limit with more usable width;
- time and caregiver metadata are no longer forced into equal-width pills;
- the caregiver value is labeled explicitly and uses a people icon instead of a location icon;
- existing colors, radius, typography scale, shadows, and navigation behavior are preserved.

## Findings

- [P2] Browser visual verification is blocked.
  - Location: mobile Home dashboard / upcoming appointment card.
  - Evidence: production build succeeds, but no browser screenshot could be captured from the local preview.
  - Impact: exact wrapping and spacing cannot be visually confirmed at the target viewport in this environment.
  - Fix: open the deployed `main` build on a mobile viewport and confirm the date rail, two-line title, and metadata do not clip.

## Required fidelity surfaces

- Fonts and typography: existing font family, weights, responsive sizes, and line clamps preserved; browser confirmation blocked.
- Spacing and layout rhythm: primary card allocation increased from 48% to 56%; date and content are separated; browser confirmation blocked.
- Colors and visual tokens: existing sky, emerald, slate, white, ring, radius, and shadow tokens reused.
- Image quality and asset fidelity: no image assets changed or added.
- Copy and content: appointment title/date/time remain data-driven; caregiver now has the explicit Thai label `ผู้ดูแล`.

## Comparison history

- Initial finding: the original card compressed date, title, time, and caregiver into a short stacked layout.
- Fix made: converted the card to a date-rail/content layout, increased its share of the section, removed metadata pill constraints, and corrected the caregiver icon semantics.
- Post-fix visual evidence: blocked because the cloud browser could not open the local preview.

## Implementation checklist

- [x] Preserve existing dashboard styling and routes.
- [x] Separate date from the appointment description.
- [x] Give the primary appointment more vertical space.
- [x] Make time and caregiver labels readable without equal-width pills.
- [x] Pass the production build.
- [ ] Confirm the rendered mobile view and console in a browser.

final result: blocked
