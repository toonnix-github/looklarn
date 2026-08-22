# Design QA — Find caretaker action button

- Source visual truth: `/workspace/scratch/18ab0f902b25/upload/01-Screenshot_2026-08-22-13-38-15-854_com.android.chrome.jpg`
- Source pixels: 690 × 1536, device screenshot at 2×-class density
- Intended CSS viewport: approximately 393 × 852 mobile
- Implementation target: `src/pages/FindCaretakerPage.jsx`, step 2 mobile state in Thai
- Implementation screenshot: unavailable
- Browser-rendered evidence: unavailable because the cloud browser blocked the local preview URL with `net::ERR_BLOCKED_BY_CLIENT`
- Build verification: `npm run build` passed with Vite 5.4.21
- Primary interactions tested: blocked with browser rendering
- Console errors checked: blocked before page load

## Full-view comparison evidence

The source shows the final search CTA taking roughly half of the action row and becoming unusually tall because its Thai label wraps to three lines. The implementation changes the CTA from the large button size to the medium size, caps it at 48px, reduces its icon and padding, and keeps the label on one line.

## Focused region comparison evidence

Source region inspected: the bottom wizard action row. Code-level checks confirm:

- search CTA uses the medium button size instead of large;
- mobile height is capped at 48px;
- Thai label is constrained to one line;
- icon, horizontal padding, radius, and shadow are reduced proportionally;
- the back action is kept on one line so it cannot force the CTA narrower.

## Findings

- [P2] Browser visual verification is blocked.
  - Location: Find caretaker / step 2 wizard action row.
  - Evidence: production build succeeds, but no browser screenshot could be captured from the local preview.
  - Impact: exact wrapping and spacing cannot be visually confirmed at the target viewport in this environment.
  - Fix: open the deployed `main` build on a mobile viewport and confirm the CTA is one line, approximately 48px tall, and does not clip.

## Required fidelity surfaces

- Fonts and typography: existing font family, weights, responsive sizes, and line clamps preserved; browser confirmation blocked.
- Spacing and layout rhythm: CTA size reduced from large to medium, height capped at 48px, and the action row now has a stable gap; browser confirmation blocked.
- Colors and visual tokens: existing sky, emerald, slate, white, ring, radius, and shadow tokens reused.
- Image quality and asset fidelity: no image assets changed or added.
- Copy and content: existing localized CTA and back labels are unchanged.

## Comparison history

- Initial finding: the final search CTA wrapped to three lines and dominated the lower form area.
- Fix made: reduced the CTA size, height, icon, padding, radius, and shadow while preventing both action labels from wrapping.
- Post-fix visual evidence: blocked because the cloud browser could not open the local preview.

## Implementation checklist

- [x] Preserve existing form behavior and routes.
- [x] Reduce the final CTA height and visual weight.
- [x] Keep the Thai CTA label on one line.
- [x] Prevent the back label from narrowing the CTA.
- [x] Pass the production build.
- [ ] Confirm the rendered mobile view and console in a browser.

final result: blocked
