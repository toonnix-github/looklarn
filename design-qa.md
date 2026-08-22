# Design QA — Profile save action

- Source visual truth: `/workspace/scratch/18ab0f902b25/upload/01-Screenshot_2026-08-22-14-12-03-408_com.android.chrome.jpg`
- Source pixels: 690 × 1536, mobile device screenshot
- Intended CSS viewport: approximately 393 × 852 mobile
- Implementation target: `src/pages/ElderProfilePage.jsx`, Thai profile screen
- Implementation screenshot: unavailable
- Browser-rendered evidence: unavailable because the cloud browser previously blocked the local preview URL with `net::ERR_BLOCKED_BY_CLIENT`
- Build verification: `npm run build` passed with Vite 5.4.21
- Primary interaction: existing `handleSave` behavior retained
- Console errors checked: blocked before page load

## Full-view comparison evidence

The source shows the save action as a tall white outlined control that visually resembles an input field and adds a large empty band above the bottom navigation. The implementation changes it to a compact 48px emerald primary action inside a shallower sticky action bar.

## Focused region comparison evidence

Source region inspected: fixed save bar above the bottom navigation. Code-level checks confirm:

- control changes from outline to the existing emerald accent variant;
- height is fixed at 48px with a 0.95rem label;
- icon is reduced to 1.1rem;
- bar padding and upward shadow are reduced;
- button keeps its full-width mobile touch target and existing save handler.

## Findings

- [P2] Browser visual verification is blocked.
  - Location: Elder profile / sticky save action.
  - Evidence: production build succeeds, but no browser screenshot could be captured from the local preview.
  - Impact: exact relationship between the sticky bar and bottom navigation cannot be visually confirmed in this environment.
  - Fix: open the deployed `main` build on a mobile viewport and confirm the bar does not overlap the navigation and the button remains 48px tall.

## Required fidelity surfaces

- Fonts and typography: existing app typeface retained; label reduced to a compact primary-action size.
- Spacing and layout rhythm: action bar padding reduced from 16px to 12px and shadow softened.
- Colors and visual tokens: existing emerald accent, white text, and emerald active states reused.
- Image quality and asset fidelity: no images changed.
- Copy and content: `บันทึกข้อมูล` and its save behavior are unchanged.

## Comparison history

- Initial finding: oversized white outline button resembled a form field and lacked primary-action emphasis.
- Fix made: converted it to a compact filled emerald CTA and reduced the surrounding sticky bar.
- Post-fix visual evidence: blocked because the cloud browser could not open the local preview.

## Implementation checklist

- [x] Preserve the existing save handler and toast.
- [x] Give the action clear primary emphasis.
- [x] Reduce button and sticky-bar height.
- [x] Preserve an accessible full-width touch target.
- [x] Pass the production build.
- [ ] Confirm the deployed mobile view and console in a browser.

final result: blocked
