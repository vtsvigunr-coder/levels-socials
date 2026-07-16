# Native scroll for the homepage

**Date:** 2026-07-16
**Status:** approved

## Problem

The homepage runs on a virtual scroll: `body` gets `overflow: hidden`, `.home` is
`position: fixed`, and `wheel`/`touch` deltas are accumulated by hand into a
position. Three "stages" switch between three scroll regimes — 0 (hero, waits for
a trigger), 1 (virtual scroll), 2 (native scroll for CTA + Footer).

Most of the file's complexity exists only to prop up that model:

- `LOCK_MS` / `ENTER_THRESHOLD` — hand-damping trackpad momentum.
- Three snap guards (`nextV = SELECTION_STAGE` and two siblings) — a delta can
  step clean over a stage that has a horizontal sub-phase, so its exact-equality
  gate would never fire.
- Six `useRef` + six mirroring `useEffect` — `applyDelta` is an event handler and
  has to read current values out of its closure.
- `.released` wrapper + opaque `.home` background — because `.home` is `fixed`,
  its CTA/Footer siblings sat at document `y: 0`, directly behind the hero, and
  showed through whenever the video's compositor layer was absent (on load before
  decode; in macOS window-minimize snapshots, which omit video layers).

The last item shipped as a fix, but it treats a symptom. Native scroll removes the
cause.

## Approach

One scroll regime: native, start to finish. A tall track sets the real document
height; a `position: sticky` viewport inside it pins the screen while the track
scrolls past. Position is *derived* from `window.scrollY` by a pure function
rather than accumulated from deltas.

Rejected alternatives:

- **Pure CSS (`animation-timeline: scroll()`)** — sections don't just move, they
  swap content by progress (`GetStartedSection` at `progress={0.5}` renders
  different copy and cards, per its tests). CSS can't do that; React state is
  required.
- **Each section computes its own progress from `getBoundingClientRect`** —
  `HomePage` shrinks, but the 12 section components stop being pure functions of
  `progress` and start knowing about scroll geometry. Their tests would all need
  rewriting. Not worth it.

## Decisions

| Question | Decision |
|---|---|
| Hero → Providers | A discrete step at the boundary; choreography scroll-linked within the hero's segment. Planned as CSS `scroll-snap` — see "Hero boundary" below for why that had to change |
| Scrollbar (~17 000px document) | Hidden (`scrollbar-width: none`); scroll stays fully native |
| Feel fidelity | Keep all distances exactly; accept real browser inertia |
| CTA | Becomes stage 12 inside the track — measured 600px, fits a viewport, gets the same reveal as every other section |
| Footer | Flows after the track — measured 1301px (1.6× viewport), cannot be a pinned one-screen layer without cutting ~500px of disclosure content |

Rule: **what pins goes in the track; what flows goes after it.**

## DOM

```
<main class="home">
  <div class="home__track">        ← height: TOTAL_SCROLL + 100vh
    <div class="home__viewport">   ← position: sticky; top: 0; height: 100vh
      bg, hero, providers … faq, cta
    </div>
  </div>
  <FooterSection />                ← same flow, same native scroll
</main>
```

The hero lives *inside* the pinned viewport. It must not be an ordinary block
before the track: today the hero does not travel upward on exit — it holds
position, blurs, and dissolves while Providers fades in beneath it. A normal
block would slide away linearly, which is a different animation.

## Scroll map

Order mirrors the old model exactly: arrive at a section, sweep its horizontal
sub-phase, then advance vertically.

| scrollY | Drives | px |
|---|---|---|
| 0 – 900 | `heroExit` 0→1 | 900 |
| 900 – 1 800 | Providers horizontal | 900 |
| 1 800 – 3 600 | `vScroll` 0 → 2 | 1 800 |
| 3 600 – 5 000 | Selection Standard horizontal | 1 400 |
| 5 000 – 10 400 | `vScroll` 2 → 8 | 5 400 |
| 10 400 – 11 600 | Get Started horizontal | 1 200 |
| 11 600 – 12 500 | `vScroll` 8 → 9 | 900 |
| 12 500 – 14 300 | Why Levels horizontal | 1 800 |
| 14 300 – 17 000 | `vScroll` 9 → 12 | 2 700 |

**TOTAL_SCROLL = 17 000px.** Track height is `TOTAL_SCROLL + 100vh` (the sticky
child stays pinned for `height − 100vh` of scroll).

Stage indices are unchanged, with one addition: 0 Providers, 1 Key Numbers,
2 Selection Standard, 3–6 Explore Platform, 7 How it Works, 8 Get Started,
9 Why Levels, 10 Testimonials, 11 FAQ, **12 CTA**.

The snap guards disappear: ranges are explicit, so nothing can step over a stage.

## Hero boundary: CSS scroll-snap doesn't work here

Planned as CSS `scroll-snap`. Measured in Chrome against the real track, it fails
at both strictnesses:

- **`proximity`** never engages over the hero's 900px segment. A scroll stopping
  at 300 stays at 300, leaving the hero parked half-dissolved — a state the
  design does not offer. (The snap markers themselves are valid: switching to
  `mandatory` snaps them correctly, which is how they were ruled out as the
  cause.)
- **`mandatory`** treats the whole 17 000px track as snappable, since the only
  snap points are at 0 and 900. A scroll to 7 000 is dragged back to 900. The
  page becomes unusable.

There is no third strictness, and the proximity threshold is browser-controlled.
So this one boundary is settled in JS instead: after the scroll stops
(`SETTLE_MS` of quiet), a position inside `(0, HERO_EXIT_PX)` is sent to
whichever end is nearer.

This is deliberately not the old wheel lock. It never fights momentum — it waits
for it — it holds no mode, no lock flag and no refs, and it touches nothing
outside the hero's segment. Everything else stays the browser's.

## Hero choreography

Driven by a CSS custom property, not a stage attribute:

```css
.home { --hero-exit: 0; }   /* JS writes 0..1 */
.hero-title { filter: blur(calc(var(--hero-exit) * 18px)); }
.hero-headerwrap { transform: translateY(calc(var(--hero-exit) * -180px)); }
```

This preserves the existing hard constraint: `filter` stays on the hero's
*content* and never lands on an ancestor of the glass header, whose
`backdrop-filter` any non-`none` ancestor filter would break.

The cross-fade is likewise `--hero-exit`: hero `opacity: calc(1 - var(--hero-exit))`,
every other stage `opacity: var(--hero-exit)`.

## Data flow

```
scroll (native)
  └→ rAF (coalesce to one update per frame)
       └→ mapScroll(window.scrollY)          ← pure, no DOM
            └→ setState({ heroExit, vScroll, hProviders, … })
                 └→ inline transforms + CSS custom properties
```

Six `useState` + six `useRef` + six mirroring `useEffect` collapse to one state
object. The refs existed only so an event handler could read accumulated state;
with position derived from `scrollY`, there is nothing to accumulate or read back.

## Files

| File | Change |
|---|---|
| `src/lib/scrollMap.js` | new — segment table + pure `mapScroll(scrollY)`, `TOTAL_SCROLL` |
| `src/lib/scrollMap.test.js` | new — unit tests, no DOM |
| `src/pages/HomePage.jsx` | rewritten: ~180 lines of scroll logic → ~30 |
| `src/pages/HomePage.css` | track/viewport/snap; delete `fixed` + all `data-stage` |
| `src/pages/HomePageScroll.test.jsx` | rewritten to drive `scrollY` |
| `src/sections/CTA/CTA.css` | fill the stage height instead of `min-height: 800px` |
| 12 section components | untouched |

## Deleted

`stage`/`setStage`, `stageRef`, `lockedRef`, `LOCK_MS`, `ENTER_THRESHOLD`,
`enterZone`, `leaveZone`, `releaseScroll`, `reEnterZone`, `applyDelta`, the
`wheel`/`touchstart`/`touchmove` handlers, the delta accumulator, the
`body.overflow` effect, three snap guards, the `.released` wrapper, the `#0b0b0b`
background patch, and `.home { position: fixed }`.

Touch handling goes entirely to the browser, which should be a clear improvement
on mobile.

## Testing

- `scrollMap.test.js` — segment boundaries, clamping at both ends, monotonicity.
  Pure; no DOM, no events. This is where the logic now lives.
- `HomePageScroll.test.jsx` — set `window.scrollY`, dispatch `scroll`, assert
  rendered output. jsdom implements neither sticky nor layout, but the mapping is
  pure, so that doesn't matter.
- Section tests — untouched.
- Browser verification — drive real scroll through every section, confirm the
  reveals, screenshot.

## Risks

- **iOS Safari throttles `scroll` during momentum**, so animations *inside* the
  pinned viewport may lag the finger. The pinning itself stays smooth — the
  browser does it, not us.
- ~~**`scroll-snap: proximity` on a long track** may fight the scroll~~ —
  confirmed, and worse than expected. See "Hero boundary" above: CSS snap is out
  entirely, the boundary is settled in JS.
- **Scroll restoration changes behaviour**: the browser will now restore position
  on reload, where F5 previously always returned to the hero. This is ordinary web
  behaviour and is accepted.
