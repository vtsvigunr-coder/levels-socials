# Levels Socials — "Explore Platform" Section Design

**Date:** 2026-07-15
**Status:** Approved (design), pending implementation plan
**Figma:**
[6+ Month](https://www.figma.com/design/UQCKaa4bTakuFG2UdfW8C9/Levels-Socials-Web-Working?node-id=789-15651&m=dev) ·
[Earned Access](https://www.figma.com/design/UQCKaa4bTakuFG2UdfW8C9/Levels-Socials-Web-Working?node-id=789-15675&m=dev) ·
[14 Days](https://www.figma.com/design/UQCKaa4bTakuFG2UdfW8C9/Levels-Socials-Web-Working?node-id=789-15692&m=dev) ·
[Dashboard](https://www.figma.com/design/UQCKaa4bTakuFG2UdfW8C9/Levels-Socials-Web-Working?node-id=789-15719&m=dev)

## Overview

The homepage's scroll-jack zone (Hero → Providers → Key Numbers → Selection Standard)
gets a 4th vertical stretch: "Explore Platform" — four full-screen slides, each pairing
a two/three-line headline + lead + CTA with a 590×590 illustrated card, alternating
text-left/card-right and card-left/text-right. Reference for internal card motion:
ramp.com's homepage bento cards (one accent micro-animation per card, not a looping
ambient effect).

## Scroll architecture

The whole site is currently one `position: fixed` container (`HomePage.jsx` /
`HomePage.css`); native document scroll never happens. `vScroll` (0..2) drives
Providers/Key Numbers/Selection Standard via `rel(vScroll, stageIndex)` +
inline `translateY`; once `vScroll >= V_MAX (2)`, wheel input instead drives
`hScroll` (0..1) across Selection Standard's horizontal slides.

This section **extends the same mechanism** rather than releasing to native scroll:

- `V_MAX` becomes `6`. Selection Standard stays at stage index `2`; the four new
  cards are stages `3`, `4`, `5`, `6`, each moved with the same
  `rel(vScroll, stageIndex)` + `translateY` pattern already used for Providers/Key
  Numbers.
- The horizontal-phase trigger changes from `vRef.current >= V_MAX` to
  `vRef.current === SELECTION_STAGE (2)`, so it still only fires on Selection
  Standard, and scrolling past it (once `hScroll === 1`) resumes normal vertical
  advancement into stage 3 and beyond. Scrolling back up drains `hScroll` to 0
  before vertical scroll re-engages, same as today.
- Section background is a solid `#F5F5F5` (matches Figma), covering the shared
  blurred-video background layer the same way Key Numbers' opaque white
  background already does.

## Component structure

```
src/sections/ExplorePlatform/
├─ ExplorePlatformSection.jsx   // renders 4 slides from shared data + per-slide card
├─ ExplorePlatform.css
├─ cards/
│  ├─ SixPlusCard.jsx           // "6+ Month" gauge/timer card
│  ├─ EarnedAccessCard.jsx      // wave + checkmark badge pill card
│  ├─ FourteenDaysCard.jsx      // tilted photo card + wave1 + "14 Days" text
│  └─ DashboardCard.jsx         // flattened dashboard mockup card
└─ data.js                      // headline lines, lead copy, layout direction per slide
```

Each slide reuses existing shared patterns instead of inventing new ones:

- `Tag` row (logo icon + "Explore Platform" label) — same markup as
  `.providers__tag` / `.selstd__tag`.
- Headline: two-tone span (default + `.text-accent`-style orange run), broken
  into manually-authored lines like `HERO_LINES` in `Hero.jsx`, each line
  wrapped in `.xp-line { overflow:hidden }` containing a `motion.span` with the
  `rise` variant (`opacity 0 / y:24 → opacity 1 / y:0`, `ease [0.22,1,0.36,1]`,
  `staggerChildren`) — the exact per-line technique already used for the Hero
  title, not the single-block reveal Providers/Key Numbers use for their `h2`.
- Lead paragraph + CTA button reuse `Button` (`variant="accent"`, black pill +
  `gradient-dot`), matching every other section's "Explore the Platform" /
  "Start with Levels Socials" CTA.
- `active` prop per slide (derived from `vScroll` crossing its stage index, same
  approach as `selectionActive`/`knActive` in `HomePage.jsx`) drives both the
  text stagger and the one-shot internal card animation — animations do not
  loop or re-trigger on re-entry beyond a simple reset when scrolled away and
  back.

## Assets

Source files live in `main page/` (git-ignored working folder) and get copied
into `src/assets/explore-platform/` at commit time. Confirmed mapping from
inspecting the images directly:

| File | Role |
|---|---|
| `6+.png` | Card 1 background — unique ribbed/curtain texture, `mix-blend-luminosity` |
| `14-days-background.png` | Shared background (darkened ~64%) for cards 2, 3, 4 |
| `earned-card.png` | Card 2 foreground — grayscale wave texture |
| `14-days-card1.png` | Card 3 foreground — tilted sunset-hill photo card |
| `icon/wave1.svg` | Card 3 — squiggly line-graphic overlay ("Layer_2" in Figma) |
| `Dashboard.png` | Card 4 foreground — pre-flattened dashboard mockup (do not rebuild the nested Figma UI) |

Small decorative vectors not provided by the user (calendar icon, checkmark
badge icon, gauge arc paths) are downloaded directly from the Figma
`get_design_context` asset URLs while they're still valid (7-day expiry) and
committed under `src/assets/explore-platform/icons/`.

## Per-card content & animation

1. **6+ Month** (text-left / card-right) — Headline "The bridge between
   investors and *top strategy providers*", lead "Connect capital to selected
   strategy providers". Card: calendar-icon chip + gauge card showing "6+
   Month / Verified Performance" and a "06:00" timer over an arc. On activate:
   the arc strokes in and "06:00" counts up from "00:00".
2. **Earned Access** (card-left / text-right) — Headline "Built on a selection
   standard most providers *never pass*", lead "Every provider must pass
   documented criteria". Card: wave texture with a centered pill (checkmark
   badge + "Selection Review / Earned Access"). On activate: badge scales in
   with a soft spring/overshoot.
3. **14 Days** (text-left / card-right) — Headline "Where serious capital
   meets the highest selection standard in *social trading*", lead "Selected
   providers for serious investor capital". Card: dark bg, two overlapping
   rotated card shapes (one is the sunset photo, one an empty decorative
   rotate), `wave1` squiggle, gradient "14 Days" text, white "Trend" pill. On
   activate: the two cards ease in with a slight parallax/rotation settle;
   wave gets a subtle continuous sway (this is the one exception noted in
   Figma itself, kept minimal).
4. **Dashboard** (card-left / text-right) — Headline "Everything You Need to
   See *Before Deciding*", lead "Full provider data, performance history, and
   portfolio tools — all in your dashboard." Card: dashboard mockup image. On
   activate: the portfolio-performance line redraws (clip-path reveal) and the
   balance figure ("8,545") counts up from 0.

## Out of scope

- No native-scroll fallback below this zone — it stays part of the fixed
  scroll-jack.
- No looping ambient animation beyond the single noted wave sway on card 3.
- No rebuild of the full nested dashboard Figma component tree — card 4 uses
  the flattened `Dashboard.png`.
