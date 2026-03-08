# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cinematic landing page for **Corefix AI** — an AI consulting brand. Built as a single-page React app with premium scroll-driven animations and a light/dark theme toggle. The design system follows the "Brutalist Signal / Technical Premium" aesthetic defined in `Gemini.md`.

## Commands

```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # Production build to /dist
npm run preview   # Preview production build locally
```

No test runner or linter is configured.

## Tech Stack

- **React 19** + **Vite 7** (ES modules, JSX)
- **Tailwind CSS 3** with CSS custom properties and class-based dark mode (`tailwind.config.js`)
- **GSAP 3** with ScrollTrigger for scroll-driven animations
- **Lucide React** for icons (`Zap`, `Target`, `Cpu`, `CheckCircle2`, `ChevronRight`, `Sun`, `Moon`, `Hexagon`, `Box`)

## Architecture

The entire app lives in **`src/App.jsx`** (~370 lines) as a monolithic file with all components defined inline. This is intentional per the design document's guidance for projects under ~600 lines.

### Component order in App.jsx

`BackgroundGeometry` → `Navbar` → `Hero` → `Features` → `Philosophy` → `Protocol` → `CTA` → `Footer` → `App`

Each section component follows the same pattern:
1. `useRef` for the section container
2. `useEffect` with `gsap.context()` scoped to the ref
3. Cleanup via `ctx.revert()` in the effect teardown

### Key animation patterns

- **Entrance animations:** `gsap.from()` with `y: 40, opacity: 0, stagger: 0.15, ease: 'power2.out'`
- **Scroll triggers:** `start: 'top 75%'` for reveal, `pin: true` for the Protocol sticky-stack cards
- **Protocol section:** Cards pin and stack using ScrollTrigger with `scrub: true`, scaling to 0.9 with blur on exit
- **Hero orb:** Continuous 360° rotation over 80s
- **Background geometry:** Floating wireframe shapes (`Box`, `Hexagon`) with randomized GSAP movement, yoyo repeat

### Dark mode

- Controlled via React state in `App` (`useState(true)` — dark by default)
- Toggles `dark` class on `<html>` via `useEffect`
- Tailwind configured with `darkMode: 'class'`
- `Navbar` receives `darkMode` / `setDarkMode` props; toggle button uses `Sun`/`Moon` icons

## File Structure

```
├── index.html              # HTML shell, Google Fonts, SVG noise overlay
├── src/
│   ├── main.jsx            # React entry point (StrictMode + createRoot)
│   ├── App.jsx             # All components (monolithic)
│   └── index.css           # Tailwind directives, CSS custom properties, utilities
├── tailwind.config.js      # Theme extension (colors via CSS vars, fonts)
├── postcss.config.js       # PostCSS: tailwindcss + autoprefixer
├── vite.config.js          # Vite config (React plugin only)
├── Gemini.md               # Comprehensive design document — read before visual changes
├── Corefix_Logo.svg        # Brand logo asset
└── public/vite.svg         # Default Vite favicon
```

## Design System

Defined in `Gemini.md` (the comprehensive design document — read this before making visual changes).

### Theming via CSS custom properties (`src/index.css`)

Colors are defined as CSS custom properties in `:root` (light) and `.dark` (dark), then mapped in Tailwind config. This enables seamless theme switching.

| Tailwind token | CSS variable        | Light value  | Dark value   | Usage                 |
|----------------|---------------------|--------------|--------------|-----------------------|
| `background`   | `--color-bg`        | `#F8FAFC`    | `#0A0A0A`    | Page background       |
| `surface`      | `--color-surface`   | `#FFFFFF`    | `#121212`    | Card backgrounds      |
| `primary`      | `--color-primary`   | `#020617`    | `#FFFFFF`    | Primary text          |
| `secondary`    | `--color-secondary` | `#64748B`    | `#A1A1AA`    | Muted text            |
| `border`       | `--color-border`    | `#E2E8F0`    | `#262626`    | Borders               |
| `accent`       | `--color-accent`    | `#2563EB`    | `#F59E0B`    | Accent (blue/amber)   |
| `footer`       | `--color-footer`    | `#F1F5F9`    | `#050505`    | Footer background     |

Additional CSS variables: `--color-grid` controls the background grid pattern opacity.

### Font families (`tailwind.config.js`)

| Token       | Font              | Usage                          |
|-------------|-------------------|--------------------------------|
| `font-sans` | Inter             | Headings, body text            |
| `font-ui`   | Plus Jakarta Sans | Labels, uppercase tracking     |

### Custom CSS utilities (`src/index.css`)

- `.text-balance` — applies `text-wrap: balance`
- `.geometric-grid` — 50px repeating grid lines using `--color-grid`
- Custom scrollbar styles (webkit) using theme variables

### Global noise overlay

`index.html` contains an SVG fractalNoise filter applied as a fixed overlay at `opacity-[0.03]` with `z-50` to add subtle texture. Do not remove this.

## Fonts

Loaded via Google Fonts in `index.html`: **Inter** (variable, 100–900 + italics) and **Plus Jakarta Sans** (variable, 200–800 + italics).

## Legacy files (unused)

`src/counter.js`, `src/main.js`, `src/javascript.svg`, `src/layout.css`, `src/style.css` — these are remnants from the Vite scaffold and are not imported by the active app.

## Conventions

- Use semantic Tailwind tokens (`text-primary`, `bg-surface`, `border-border`) rather than raw hex values for theme-aware styling.
- All animation cleanup must use `ctx.revert()` in `useEffect` teardown to prevent ScrollTrigger leaks.
- Keep all components in `src/App.jsx` until the file exceeds ~600 lines; only then consider extraction.
- The `Gemini.md` design document is the source of truth for visual decisions — consult it before changing layout, typography, or color choices.
