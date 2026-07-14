# Levels Socials — Hero Section Design

**Date:** 2026-07-14
**Status:** Approved (design), pending implementation plan
**Figma:** [Hero default](https://www.figma.com/design/UQCKaa4bTakuFG2UdfW8C9/Levels-Socials-Web-Working?node-id=548-9533) · [Hero + expanded menu](https://www.figma.com/design/UQCKaa4bTakuFG2UdfW8C9/Levels-Socials-Web-Working?node-id=801-15552) · [Background frame](https://www.figma.com/design/UQCKaa4bTakuFG2UdfW8C9/Levels-Socials-Web-Working?node-id=789-13308)

## Overview

Levels Socials is a new multi-page marketing site for a social copy-trading platform.
It will eventually include Log in and Create Account flows. This spec covers the
**first deliverable: the homepage Hero section** — full-screen video background, glass
header with a two-state Company menu, headline, CTA copy/button, an "Explore more"
affordance, and a custom cursor-trail effect.

Reusable pieces (header, buttons, glass surface, motion patterns) are built as shared
components so later pages (Login, Create Account, etc.) can consume them.

## Tech Stack

- **React 19 + Vite** (matches the sibling "whattashirt" project).
- **react-router-dom** — routing, ready for `/login` and `/create-account` later.
- **framer-motion** — entrance animations.
- Plain CSS with CSS custom properties for design tokens (no CSS framework).

## Design Tokens (from Figma variables)

- **Fonts:** `Onest` — Medium 500 (headings), Regular 400 (body). `DM Sans` available
  in assets for nav/buttons. Both shipped locally from `main page/font/`.
  - H1: 50 / lineHeight 54 / letterSpacing −3, weight 500
  - H6: 20 / 24 / −2, weight 500
  - Body p2: 14 / 18 / −2, weight 400
  - Body p3: 12 / 16 / −2, weight 400
- **Colors:** accent `#FF8C3A`, logo `#EF5E32` / `#FF964F`, text `#FFFFFF`, black `#000000`.
- **Glass:** Figma GLASS effect (radius 29) → approximated in CSS with
  `backdrop-filter: blur() saturate()` + light border + inner highlight.

## Assets (`main page/` → `src/assets/`)

- `hero section.mp4` — Hero background video.
- `Logo.svg` — brand logo (mark + "Levels Socials" wordmark).
- `icon/arrow.svg`, `icon/arrow-down.svg`, `icon/Btn.svg`.
- `icon/nav menu/` — 7 dropdown icons: `about`, `how-it-works`, `strategy-providers`,
  `affiliates`, `platform`, `selection-standard`, `investors-stories`.
- `font/DM_Sans,Onest.zip` — extract to local `@font-face` files.
- Background still (Figma `789-13308`) exported as `hero-poster.jpg` — video `poster`.

## Project Structure

```
Levels Socials/
├─ index.html
├─ vite.config.js
├─ package.json
└─ src/
   ├─ main.jsx                 // Router setup
   ├─ App.jsx                  // Routes
   ├─ pages/HomePage.jsx       // renders <Hero/>
   ├─ sections/Hero/
   │  ├─ Hero.jsx              // layout + video bg + motion orchestration
   │  ├─ Header.jsx            // logo + glass nav pill + Login + Create Account
   │  ├─ CompanyMenu.jsx       // dropdown, closed/expanded states
   │  ├─ CursorTrail.jsx       // canvas cursor-trail effect
   │  └─ Hero.css
   ├─ components/
   │  ├─ GlassSurface.jsx      // reusable backdrop-filter glass wrapper
   │  ├─ Button.jsx            // shared button (glass / solid variants)
   │  └─ *.css
   ├─ styles/
   │  ├─ tokens.css            // CSS vars: colors, fonts, glass
   │  ├─ fonts.css             // @font-face Onest + DM Sans
   │  └─ global.css            // reset + base
   └─ assets/                  // video, logo, icons, fonts, poster
```

## Component Design

### Hero.jsx
- Full-viewport section (`100vw` × `100vh`, min-height fallback).
- `<video>` background: `autoPlay muted playsInline`, **no `loop`** — plays once and
  holds on the last frame. `poster` = `hero-poster.jpg`. `object-fit: cover`.
- Dark gradient overlay above the video for text contrast.
- Foreground grid: Header (top), headline (upper-left), paragraph + CTA (lower-right),
  "Explore more ↓" (lower-left).
- Orchestrates entrance animation via framer-motion stagger (see Motion).
- Mounts `<CursorTrail/>` as an absolutely-positioned overlay canvas.

### Header.jsx
- Left: `Logo.svg`.
- Center: glass **nav pill** — `Company ▾` · `Blog` · `Help Center` · `Contact`.
  "Company" is a button toggling `CompanyMenu`; chevron rotates up when expanded.
- Right: `Login` text link + glass **Create Account** button.

### CompanyMenu.jsx
- Two states:
  - **Closed:** nothing rendered below the pill; chevron down.
  - **Expanded:** chevron up; a glass panel below the pill lists 7 items, each =
    icon square + title + subtitle + `›`.
    1. About — "Company story and mission" (**active**: accent icon + row highlight)
    2. How It Works — "Simple platform walkthrough"
    3. Strategy Providers — "Review selected providers"
    4. Affiliates — "Partner with us"
    5. Platform — "Explore product features"
    6. Selection Standard — "See provider criteria"
    7. Investors Stories — "Read client experiences" (**New** badge)
- Open/close animated with framer-motion (fade + small `y`/scale). Closes on outside
  click and on repeat toggle. Keyboard-accessible (Esc closes, focus trap optional).

### GlassSurface.jsx
- Reusable wrapper applying the liquid-glass look via `backdrop-filter: blur() saturate()`,
  a subtle 1px light border, and an inner top highlight. Used by nav pill, dropdown
  panel, and Create Account button. Radius/blur configurable via props.

### CursorTrail.jsx
- Transparent full-Hero `<canvas>` overlay; default system cursor stays visible.
- Tracks a short history of pointer positions (Hero-local coordinates).
- Renders **two lines**, slightly offset from each other, trailing the cursor:
  **sharp and opaque near the cursor → blurred and fading toward the tail.**
- Blur/fade achieved by drawing older segments with lower alpha and greater width/blur
  (per-segment), animated on `requestAnimationFrame`. The Figma static arrow cursor is
  **not** reproduced.
- Disabled/hidden on touch devices and when `prefers-reduced-motion` is set.

## Motion (framer-motion)

- Shared pattern: appear **bottom-up** — `opacity 0→1`, `y: 24→0`, soft ease-out.
- On Hero mount, a staggered sequence: Header → headline → paragraph+CTA → "Explore more".
- **Headline (3 lines)** animates **per line** with a stagger between lines — the
  requested line-by-line bottom-up reveal.
- Respects `prefers-reduced-motion` (renders final state without motion).

## Responsive

- Designed at 1440×900. Fluid down to tablet/mobile: nav pill collapses to a menu
  button on small screens (detailed mobile layout is out of scope for this first pass
  but layout must not break — content stacks, video still covers).

## Out of Scope (this deliverable)

- Login / Create Account pages and auth logic (structure prepared, not built).
- Sections below the Hero (Preloader, graphs, etc.).
- Full mobile-optimized menu interactions beyond non-breaking fallback.

## Testing / Verification

- App runs via `npm run dev`; Hero renders matching both Figma states.
- Video autoplays once (muted) and holds last frame; poster shows before load.
- Company menu toggles open/closed with correct active item + New badge.
- Entrance animations play bottom-up incl. per-line headline stagger.
- Cursor-trail draws two fading/blurring lines following the mouse over the Hero.
- Glass effect visible on pill, dropdown, and Create Account button.
- `prefers-reduced-motion` disables motion + cursor trail.
