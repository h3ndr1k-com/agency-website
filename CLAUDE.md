# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cinematic landing page for **Corefix AI** — an AI consulting brand. Built as a single-page React app with premium scroll-driven animations. The design system follows the "Brutalist Signal / Technical Premium" aesthetic defined in `Gemini.md`.

## Commands

```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # Production build to /dist
npm run preview   # Preview production build locally
```

No test runner or linter is configured.

## Tech Stack

- **React 19** + **Vite 7** (ES modules, JSX)
- **Tailwind CSS 3** with custom theme in `tailwind.config.js`
- **GSAP 3** with ScrollTrigger for scroll-driven animations
- **Lucide React** for icons

## Architecture

The entire app lives in **`src/App.jsx`** (~300 lines) as a monolithic file with all components defined inline. This is intentional per the design document's guidance for projects under ~600 lines.

### Component order in App.jsx

`Navbar` → `Hero` → `Features` → `Philosophy` → `Protocol` → `CTA` → `Footer`

Each section component follows the same pattern:
1. `useRef` for the section container
2. `useEffect` with `gsap.context()` scoped to the ref
3. Cleanup via `ctx.revert()` in the effect teardown

### Key animation patterns

- **Entrance animations:** `gsap.from()` with `y: 40, opacity: 0, stagger: 0.15, ease: 'power2.out'`
- **Scroll triggers:** `start: 'top 75%'` for reveal, `pin: true` for the Protocol sticky-stack cards
- **Protocol section:** Cards pin and stack using ScrollTrigger with `scrub: true`, scaling to 0.9 with blur on exit
- **Hero orb:** Continuous 360° rotation over 60s

## Design System

Defined in `Gemini.md` (the comprehensive design document — read this before making visual changes).

### Tailwind custom tokens (`tailwind.config.js`)

| Token        | Value       | Usage               |
|--------------|-------------|----------------------|
| `background` | `#0A0A0A`   | Page background      |
| `surface`    | `#121212`   | Card backgrounds     |
| `accent`     | `#F59E0B`   | Amber/orange accent  |
| `font-sans`  | Inter        | Headings, body       |
| `font-ui`    | Plus Jakarta Sans | Labels, uppercase tracking |

### Color conventions in JSX

- Muted text: `text-[#A1A1AA]`
- Borders: `border-[#262626]` or `border-white/10`
- Dark backgrounds use raw hex (`bg-[#0A0A0A]`) rather than theme tokens in several places

### Global noise overlay

`index.html` contains an SVG fractalNoise filter applied as a fixed overlay at `opacity-[0.03]` to add subtle texture. Do not remove this.

## Fonts

Loaded via Google Fonts in `index.html`: **Inter** (variable, 100–900 + italics) and **Plus Jakarta Sans** (variable, 200–800 + italics).

## Legacy files (unused)

`src/counter.js`, `src/main.js`, `src/javascript.svg`, `src/layout.css`, `src/style.css` — these are remnants from the Vite scaffold and are not imported by the active app.
