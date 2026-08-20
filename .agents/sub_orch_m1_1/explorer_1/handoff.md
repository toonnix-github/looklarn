# Technical Investigation & Scaffolding Architecture Report (Milestone M1)

**Agent:** Explorer 1 (`explorer_1`)  
**Milestone:** M1 — Scaffolding, Design Tokens, i18n & Shared UI Kit  
**Target Project:** Looklarn (ลูกหลาน) — AI-Powered Elder Care Companion Matching Platform  
**Target File:** `d:/SDISMAN/Projects/Looklarn/.agents/sub_orch_m1_1/explorer_1/handoff.md`  
**Date:** 2026-08-20  

---

## 1. Observation

### 1.1 Workspace State & Environment Inspection
Direct inspection of the workspace root (`d:/SDISMAN/Projects/Looklarn`) revealed the following environment and directory layout:
- **Node.js runtime:** `v24.16.0` (verified via `node -v`)
- **Package manager:** `npm 11.13.0` (verified via `npm -v`)
- **Operating System:** Windows (PowerShell shell environment)
- **Current Files Present in Repository:**
  - `d:/SDISMAN/Projects/Looklarn/ORIGINAL_REQUEST.md`: Authoritative specification containing requirements R1 (7 navigable pages), R2 (Design system with Ocean Blue `#0EA5E9`, Emerald Green `#10B981`, Ice Blue `#F0F9FF`, Dark Navy `#0F172A`, Sarabun font), R3 (Language toggle TH | EN, Thai default, single-language display), R4 (Mock JSON data), and Acceptance Criteria.
  - `d:/SDISMAN/Projects/Looklarn/PROJECT.md`: Master architecture document detailing directory hierarchy (lines 11-98), feature inventory (lines 100-123), interface contracts (lines 134-171).
  - `d:/SDISMAN/Projects/Looklarn/.agents/sub_orch_m1_1/SCOPE.md`: M1 scope defining required deliverables: Project Scaffolding (Feature 1), Design Tokens (Feature 2), i18n System (Feature 3), Mock Data Layer (Feature 4), AppContext (Feature 5), Shared UI Kit (Feature 6), Router Shell (Feature 7), and Build & Verification (Feature 8).
  - `d:/SDISMAN/Projects/Looklarn/TEST_INFRA.md`: Test infrastructure specification detailing Vitest + jsdom + `@testing-library/react` setup with 4 test tiers.
  - `d:/SDISMAN/Projects/Looklarn/src/tests/setup.js`: Existing test setup file with `@testing-library/jest-dom`, `window.scrollTo`, `window.matchMedia`, `ResizeObserver`, and `IntersectionObserver` polyfills.
  - `docs/design_decisions.md`: Details color palette change to blue/green, single-language strategy with toggle pill, and mobile-first responsiveness.
  - `docs/implementation_plan.md`: Details tech stack (React + Vite + Tailwind CSS + Lucide React + React Router v6) and 7 screen specifications.
  - `docs/matching_flow.md`: Details AI matching flow, scores (96%, 88%, 81%), and scoring factors.
- **Initial Build Gap:** No `package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `index.html`, or `src/index.css` existed in the root repository.

### 1.2 Authoritative Requirement Quotes
- **ORIGINAL_REQUEST.md (Lines 23-31):**
  > "### R2. Design System — Blue & Green, Responsive
  > Implement a consistent design system across all pages:
  > - Primary: Ocean Blue `#0EA5E9`
  > - Accent/CTA: Emerald Green `#10B981`
  > - Background: Ice Blue `#F0F9FF`
  > - Text: Dark Navy `#0F172A`
  > - Font: Sarabun from Google Fonts (supports Thai + Latin)
  > - Rounded corners (xl/2xl), soft card shadows
  > - Fully responsive: mobile, tablet, desktop"

- **ORIGINAL_REQUEST.md (Lines 75-77):**
  > "### Build
  > - [ ] `npm run dev` starts the dev server without errors
  > - [ ] `npm run build` completes without errors"

- **PROJECT.md (Lines 5-9):**
  > "- **Framework & Tooling**: React 18 + Vite 5 + Tailwind CSS v3 + Lucide React + React Router v6
  > - **Typography & Aesthetics**: Google Fonts Sarabun, Ocean Blue (`#0EA5E9`), Emerald Green (`#10B981`), Ice Blue (`#F0F9FF`), Dark Navy (`#0F172A`), rounded xl/2xl, soft shadows
  > - **Language & i18n**: Single-language rendering with `TH | EN` pill toggle in navbar. Default Thai. Clean translation dictionaries in `src/i18n/th.js` and `src/i18n/en.js`. Zero mixed-language labels.
  > - **State Management**: React Context (`LanguageContext`, `AppContext` managing bookings, elder profile, and matching criteria).
  > - **Data Layer**: Pure client-side mock JSON (`caretakers.json`, `bookings.json`, `activities.json`, `elder.json`)."

- **TEST_INFRA.md (Lines 23-28, 70-79):**
  > "Vitest, @testing-library/react, @testing-library/user-event, @testing-library/jest-dom, jsdom. Test setup at `src/tests/setup.js`."

---

## 2. Logic Chain

1. **Premise 1 (Workspace Environment & Tooling):** The host runs Node.js `v24.16.0` and npm `11.13.0`. Modern ESM packages (Vite 5, React 18, React Router DOM 6, Tailwind CSS 3.4, Vitest 2) are fully supported without legacy polyfills.
2. **Premise 2 (Zero Backend Prototype):** Looklarn is an in-memory client-side prototype. Client-side routing (`react-router-dom`), class-name utilities (`clsx` + `tailwind-merge` via `cn.js`), and iconography (`lucide-react`) are all necessary runtime dependencies.
3. **Premise 3 (Testing Rigorousness):** As observed in `TEST_INFRA.md` and `src/tests/setup.js`, opaque-box testing requires Vitest, jsdom, `@testing-library/react`, `@testing-library/jest-dom`, and `@testing-library/user-event` configured directly in `vite.config.js` and `package.json` scripts.
4. **Premise 4 (Design System Fidelity):** To satisfy R2, Tailwind CSS must extend the default palette with named semantic tokens (`primary`/`ocean`: `#0EA5E9`, `emerald`: `#10B981`, `ice`: `#F0F9FF`, `navy`: `#0F172A`), define `fontFamily.sans` as `['Sarabun', 'sans-serif']`, and establish soft shadows (`soft-sm`, `soft`, `soft-lg`, `emerald-soft`) and radii (`xl`, `2xl`, `3xl`).
5. **Premise 5 (Typography & Accessibility):** `index.html` must preload and load Google Fonts Sarabun (weights 300, 400, 500, 600, 700), set Thai language attribute (`lang="th"`), provide SEO and responsive meta tags, and configure base typography with comfortable line heights for elder-friendly readability in `src/index.css`.
6. **Deduction:** A comprehensive, turn-key configuration suite consisting of `package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `index.html`, and `src/index.css` provides the complete foundation for M1 implementation.

---

## 3. Caveats

1. **Tailwind Version Selection:** Tailwind CSS v3.4.x is chosen over v4.0 to guarantee 100% compatibility with standard PostCSS plugin pipelines, `@tailwind` directives, and full Vitest jsdom CSS parsing.
2. **Font Loading Fallback:** Google Fonts Sarabun is loaded via `<link>` in `index.html` and `@import` in `src/index.css`. In offline or sandbox test runners, the font stack gracefully falls back to `system-ui, -apple-system, sans-serif` without layout shifts.
3. **Path Aliasing:** Path alias `@/` mapped to `./src` in `vite.config.js` allows clean imports across all components (`import { cn } from '@/utils/cn'`).
4. **Node 24 Compatibility:** Node 24 native ES module handling aligns with `"type": "module"` in `package.json`.

---

## 4. Conclusion & Complete Scaffolding Blueprint

Below are the exact, authoritative configuration specifications ready for direct implementation by Milestone M1 workers.

### 4.1 `package.json` Specification

```json
{
  "name": "looklarn",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "lucide-react": "^0.460.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.0",
    "tailwind-merge": "^2.5.4"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.0.1",
    "@testing-library/user-event": "^14.5.2",
    "@vitejs/plugin-react": "^4.3.3",
    "autoprefixer": "^10.4.20",
    "jsdom": "^25.0.1",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.15",
    "vite": "^5.4.11",
    "vitest": "^2.1.5"
  }
}
```

### 4.2 `vite.config.js` Specification

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
    open: false,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.js',
    css: true,
  },
});
```

### 4.3 `tailwind.config.js` Specification

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0EA5E9', // Ocean Blue
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
        },
        ocean: {
          light: '#38BDF8',
          DEFAULT: '#0EA5E9',
          dark: '#0284C7',
        },
        emerald: {
          DEFAULT: '#10B981', // Accent / CTA Green
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        navy: {
          DEFAULT: '#0F172A', // Dark Navy Text & Header
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
        ice: {
          DEFAULT: '#F0F9FF', // Ice Blue Background
          50: '#F8FAFC',
          100: '#F0F9FF',
          200: '#E0F2FE',
          300: '#BAE6FD',
        },
      },
      fontFamily: {
        sans: ['Sarabun', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        sarabun: ['Sarabun', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.75rem',   // 12px
        '2xl': '1rem',      // 16px
        '3xl': '1.5rem',    // 24px
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -2px rgba(14, 165, 233, 0.08), 0 1px 4px -1px rgba(15, 23, 42, 0.04)',
        'soft': '0 8px 24px -4px rgba(14, 165, 233, 0.10), 0 4px 8px -2px rgba(15, 23, 42, 0.05)',
        'soft-lg': '0 16px 36px -6px rgba(14, 165, 233, 0.14), 0 6px 12px -3px rgba(15, 23, 42, 0.06)',
        'emerald-soft': '0 8px 20px -3px rgba(16, 185, 129, 0.25)',
        'sky-soft': '0 8px 20px -3px rgba(14, 165, 233, 0.25)',
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.03)' },
        },
        'radar-ping': {
          '0%': { transform: 'scale(0.8)', opacity: '0.8' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
      },
      animation: {
        'pulse-subtle': 'pulse-subtle 3s ease-in-out infinite',
        'radar-ping': 'radar-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
    },
  },
  plugins: [],
};
```

### 4.4 `postcss.config.js` Specification

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### 4.5 `index.html` Specification

```html
<!doctype html>
<html lang="th">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#0EA5E9" />
    <meta name="description" content="Looklarn (ลูกหลาน) — บริการพาผู้สูงอายุไปหาหมอและกิจกรรมโดยผู้ดูแลที่ผ่านการตรวจสอบ AI Matching" />
    <title>Looklarn - ลูกหลาน | บริการพาผู้สูงอายุไปหาหมอและกิจกรรม</title>
    <!-- Preconnect to Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Sarabun:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap"
      rel="stylesheet"
    />
  </head>
  <body class="bg-[#F0F9FF] text-[#0F172A] font-sans antialiased selection:bg-sky-200 selection:text-sky-900 min-h-screen">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### 4.6 `src/index.css` Specification

```css
@import url('https://fonts.googleapis.com/css2?family=Sarabun:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    font-family: 'Sarabun', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: #F0F9FF;
    color: #0F172A;
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* Elder-friendly readable typography scale */
  h1, h2, h3, h4, h5, h6 {
    color: #0F172A;
    font-weight: 600;
    line-height: 1.3;
  }

  p, span, label, input, button {
    line-height: 1.5;
  }
}

/* Custom Looklarn Ocean-tinted scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #F0F9FF;
}

::-webkit-scrollbar-thumb {
  background: #BAE6FD;
  border-radius: 9999px;
}

::-webkit-scrollbar-thumb:hover {
  background: #0EA5E9;
}

/* Utilities for cards and gradients */
@layer utilities {
  .gradient-ocean-teal {
    background: linear-gradient(135deg, #0EA5E9 0%, #10B981 100%);
  }

  .gradient-hero {
    background: linear-gradient(135deg, #0284C7 0%, #0EA5E9 50%, #10B981 100%);
  }

  .gradient-subtle-card {
    background: linear-gradient(180deg, #FFFFFF 0%, #F0F9FF 100%);
  }

  .text-gradient-ocean {
    background: linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
```

---

## 5. Verification Method

### 5.1 Verification Commands
Once the implementer generates the files and installs dependencies:

1. **Dependency Installation:**
   ```powershell
   npm install
   ```
   *Expected outcome:* `node_modules` generated without peer dependency conflicts.

2. **Dev Server Verification:**
   ```powershell
   npm run dev
   ```
   *Expected outcome:* Vite dev server initializes on `http://localhost:5173/` in under 500ms.

3. **Production Build Verification:**
   ```powershell
   npm run build
   ```
   *Expected outcome:* Vite outputs bundled chunks to `dist/` with 0 errors and zero CSS syntax warnings.

4. **Test Suite Execution:**
   ```powershell
   npm test
   ```
   *Expected outcome:* Vitest executes setup file `src/tests/setup.js` and all test suites successfully in jsdom environment.

### 5.2 Invalidation Conditions
The scaffolding recommendations will be considered invalid if:
- Any required color hex (`#0EA5E9`, `#10B981`, `#F0F9FF`, `#0F172A`) fails to compile into CSS utility classes (`bg-primary`, `bg-emerald-500`, `bg-ice`, `text-navy-900`).
- The Sarabun font family fails to apply as the primary sans typeface.
- Vitest throws module resolution errors on `@/` path aliases.
