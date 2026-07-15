# Explore Platform Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the "Explore Platform" section — 4 full-screen scroll-jack slides (6+ Month, Earned Access, 14 Days, Dashboard), each pairing a per-line-animated headline/CTA with a 590×590 illustrated card — as stages 3–6 of the existing homepage scroll-jack, right after Selection Standard.

**Architecture:** Extend `HomePage.jsx`'s existing wheel-driven stage machine (`vScroll` 0..2 → 0..6) instead of releasing to native scroll. Each new card is its own component under `src/sections/ExplorePlatform/cards/`, assembled by one shared `ExplorePlatformSlide.jsx` (mirrors the Hero per-line-reveal pattern), driven by plain data in `src/data/explorePlatform.js`.

**Tech Stack:** React 19, framer-motion (already a dependency), plain CSS with the project's existing custom properties (`src/styles/tokens.css`), Vitest + Testing Library for tests.

## Global Constraints

- Reuse existing shared pieces verbatim: `Button` component (`variant="dark"`, `className="btn--notch-bl"`), `.gradient-dot`, the logo-icon "Tag" row markup, and the Hero per-line motion pattern (`rise` variant: `{opacity:0,y:24} -> {opacity:1,y:0}`, `ease:[0.22,1,0.36,1]`, `staggerChildren` via a `lineContainer(delay)` variants factory). Do not invent new equivalents.
- All new colors/fonts must come from `src/styles/tokens.css` (`--accent`, `--white`, `--black`, `--font-heading`, `--font-ui`, `--grad-orange`) — no new hardcoded brand colors.
- Respect `prefers-reduced-motion`: every custom animation added in this plan (arc draw, badge pop, parallax, wave sway, dashboard reveal, counters) must collapse to its end state instantly when `useReducedMotion()` returns `true`, via the same pattern already used in `Hero.jsx` / `SelectionStandardSection.jsx`.
- Card visuals reuse the flattened raster assets already staged in `main page/` (do not attempt to rebuild the nested Figma dashboard component tree — `Dashboard.png` is used as-is).
- No native-scroll fallback — this section stays inside the existing `position: fixed` scroll-jack.

---

## File Structure

```
main page/                                  // already staged in this worktree
├─ 6+.png, 14-days-background.png, earned-card.png,
│  14-days-card1.png, Dashboard.png
└─ icon/
   ├─ wave1.svg
   └─ explore-platform/
      ├─ calendar-icon.svg, checkmark-badge-icon.svg
      └─ gauge-arc-line.svg, gauge-rays.png

src/assets/explore-platform/                // Task 1 output
├─ six-plus-bg.png, shared-bg.png, earned-wave.png,
│  fourteen-days-photo.png, dashboard-mockup.png
├─ calendar-icon.svg, checkmark-badge-icon.svg, gauge-rays.png
src/assets/icons/wave1.svg                  // Task 1 output

src/data/explorePlatform.js                 // Task 2 — slide copy (headline lines, lead)

src/sections/ExplorePlatform/
├─ ExplorePlatformSlide.jsx                 // Task 7 — shared layout + text reveal + CTA
├─ ExplorePlatform.css                      // Task 7
└─ cards/
   ├─ SixPlusCard.jsx / .css                // Task 3
   ├─ EarnedAccessCard.jsx / .css           // Task 4
   ├─ FourteenDaysCard.jsx / .css           // Task 5
   └─ DashboardCard.jsx / .css              // Task 6

src/pages/HomePage.jsx                      // Task 8 — modified
src/pages/HomePage.css                      // Task 8 — modified
```

---

### Task 1: Stage image/icon assets

**Files:**
- Create: `src/assets/explore-platform/six-plus-bg.png`
- Create: `src/assets/explore-platform/shared-bg.png`
- Create: `src/assets/explore-platform/earned-wave.png`
- Create: `src/assets/explore-platform/fourteen-days-photo.png`
- Create: `src/assets/explore-platform/dashboard-mockup.png`
- Create: `src/assets/explore-platform/calendar-icon.svg`
- Create: `src/assets/explore-platform/checkmark-badge-icon.svg`
- Create: `src/assets/explore-platform/gauge-rays.png`
- Create: `src/assets/icons/wave1.svg`

**Interfaces:**
- Produces: the exact import paths every later task's `import x from "../../../assets/explore-platform/<name>"` (cards) and `"../../assets/icons/wave1.svg"` (slide/card at 2-levels-up) rely on.

- [ ] **Step 1: Copy the raster/photo assets**

```bash
mkdir -p src/assets/explore-platform
cp "main page/6+.png" src/assets/explore-platform/six-plus-bg.png
cp "main page/14-days-background.png" src/assets/explore-platform/shared-bg.png
cp "main page/earned-card.png" src/assets/explore-platform/earned-wave.png
cp "main page/14-days-card1.png" src/assets/explore-platform/fourteen-days-photo.png
cp "main page/Dashboard.png" src/assets/explore-platform/dashboard-mockup.png
```

- [ ] **Step 2: Copy the icon assets**

```bash
cp "main page/icon/explore-platform/calendar-icon.svg" src/assets/explore-platform/calendar-icon.svg
cp "main page/icon/explore-platform/checkmark-badge-icon.svg" src/assets/explore-platform/checkmark-badge-icon.svg
cp "main page/icon/explore-platform/gauge-rays.png" src/assets/explore-platform/gauge-rays.png
cp "main page/icon/wave1.svg" src/assets/icons/wave1.svg
```

- [ ] **Step 3: Verify all 9 files exist**

Run: `ls -la src/assets/explore-platform src/assets/icons/wave1.svg`
Expected: all 9 paths listed above are present (8 in `explore-platform/`, 1 `wave1.svg` in `icons/`).

- [ ] **Step 4: Commit**

```bash
git add src/assets/explore-platform src/assets/icons/wave1.svg
git commit -m "chore: stage Explore Platform section image/icon assets"
```

---

### Task 2: Slide content data

**Files:**
- Create: `src/data/explorePlatform.js`
- Test: `src/data/explorePlatform.test.js`

**Interfaces:**
- Produces: `EXPLORE_PLATFORM_SLIDES` — array of 4 objects:
  `{ id: string, layout: "text-left" | "card-left", lines: Array<Array<{ text: string, accent?: boolean }>>, lead: string }`.
  `id` values (`"six-plus"`, `"earned-access"`, `"fourteen-days"`, `"dashboard"`) are the keys Task 7's `CARDS` lookup map uses.

- [ ] **Step 1: Write the failing test**

```js
// src/data/explorePlatform.test.js
import EXPLORE_PLATFORM_SLIDES from "./explorePlatform.js";

test("has exactly 4 slides with the expected ids and layout in Figma order", () => {
  expect(EXPLORE_PLATFORM_SLIDES.map((s) => s.id)).toEqual([
    "six-plus",
    "earned-access",
    "fourteen-days",
    "dashboard",
  ]);
  expect(EXPLORE_PLATFORM_SLIDES.map((s) => s.layout)).toEqual([
    "text-left",
    "card-left",
    "text-left",
    "card-left",
  ]);
});

test("every slide has at least one line and non-empty lead copy", () => {
  for (const slide of EXPLORE_PLATFORM_SLIDES) {
    expect(slide.lines.length).toBeGreaterThan(0);
    expect(slide.lead.length).toBeGreaterThan(0);
  }
});

test("accent segments land on the words highlighted orange in Figma", () => {
  const sixPlus = EXPLORE_PLATFORM_SLIDES.find((s) => s.id === "six-plus");
  const accentText = sixPlus.lines.flat().filter((seg) => seg.accent).map((seg) => seg.text).join("");
  expect(accentText).toBe("topstrategy providers");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/explorePlatform.test.js`
Expected: FAIL — `Cannot find module './explorePlatform.js'`

- [ ] **Step 3: Write the data file**

```js
// src/data/explorePlatform.js
// Headline line breaks match the Figma layout (422px @ Onest Medium 42/46).
// `accent` segments render in --accent orange; everything else is black.
const EXPLORE_PLATFORM_SLIDES = [
  {
    id: "six-plus",
    layout: "text-left",
    lines: [
      [{ text: "The bridge between" }],
      [{ text: "investors and " }, { text: "top", accent: true }],
      [{ text: "strategy providers", accent: true }],
    ],
    lead: "Connect capital to selected strategy providers",
  },
  {
    id: "earned-access",
    layout: "card-left",
    lines: [
      [{ text: "Built on a selection" }],
      [{ text: "standard most" }],
      [{ text: "providers " }, { text: "never pass", accent: true }],
    ],
    lead: "Every provider must pass documented criteria",
  },
  {
    id: "fourteen-days",
    layout: "text-left",
    lines: [
      [{ text: "Where serious capital" }],
      [{ text: "meets the highest" }],
      [{ text: "selection standard in" }],
      [{ text: "social trading", accent: true }],
    ],
    lead: "Selected providers for serious investor capital",
  },
  {
    id: "dashboard",
    layout: "card-left",
    lines: [
      [{ text: "Everything You Need to See" }],
      [{ text: "Before Deciding", accent: true }],
    ],
    lead: "Full provider data, performance history, and portfolio tools — all in your dashboard.",
  },
];

export default EXPLORE_PLATFORM_SLIDES;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/explorePlatform.test.js`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/data/explorePlatform.js src/data/explorePlatform.test.js
git commit -m "feat: add Explore Platform slide content data"
```

---

### Task 3: SixPlusCard (gauge/timer card)

**Files:**
- Create: `src/sections/ExplorePlatform/cards/SixPlusCard.jsx`
- Create: `src/sections/ExplorePlatform/cards/SixPlusCard.css`
- Test: `src/sections/ExplorePlatform/cards/SixPlusCard.test.jsx`

**Interfaces:**
- Consumes: `useReducedMotion` from `src/lib/useReducedMotion.js` (returns `boolean`); assets from Task 1.
- Produces: `export default function SixPlusCard({ active: boolean })` — a self-contained 590×590 card. `active` toggles the arc draw-in and the "00:00"→"06:00" timer count-up. Task 7 renders it as `<SixPlusCard active={...} />` inside `.xp-slide__card`.

- [ ] **Step 1: Write the failing test**

```jsx
// src/sections/ExplorePlatform/cards/SixPlusCard.test.jsx
import { render, screen } from "@testing-library/react";
import SixPlusCard from "./SixPlusCard.jsx";

test("renders the static gauge copy regardless of active state", () => {
  render(<SixPlusCard active={false} />);
  expect(screen.getByText("6+ Month")).toBeInTheDocument();
  expect(screen.getByText("Verified Performance")).toBeInTheDocument();
  expect(screen.getByText("Minimum trading history required")).toBeInTheDocument();
});

test("timer reads 00:00 while inactive", () => {
  render(<SixPlusCard active={false} />);
  expect(screen.getByText("00:00")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/sections/ExplorePlatform/cards/SixPlusCard.test.jsx`
Expected: FAIL — `Cannot find module './SixPlusCard.jsx'`

- [ ] **Step 3: Write the component**

```jsx
// src/sections/ExplorePlatform/cards/SixPlusCard.jsx
import { useEffect, useState } from "react";
import { useReducedMotion } from "../../../lib/useReducedMotion.js";
import sixPlusBg from "../../../assets/explore-platform/six-plus-bg.png";
import gaugeRays from "../../../assets/explore-platform/gauge-rays.png";
import calendarIcon from "../../../assets/explore-platform/calendar-icon.svg";
import "./SixPlusCard.css";

// Traced from the Figma gauge arc (Vector, 301.17x150.585 viewBox).
const ARC_PATH =
  "M296.185 0C296.185 46.828 274.078 88.4928 239.732 115.127C215.099 134.229 184.17 145.6 150.585 145.6C70.1725 145.6 4.98515 80.4127 4.98515 0";
const TIMER_TARGET_SECONDS = 360; // "06:00"
const TIMER_DURATION_MS = 1200;

function formatTimer(totalSeconds) {
  const mm = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const ss = String(totalSeconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

function useTimerCount(active, reduced) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!active) {
      setSeconds(0);
      return;
    }
    if (reduced) {
      setSeconds(TIMER_TARGET_SECONDS);
      return;
    }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / TIMER_DURATION_MS);
      setSeconds(Math.round(t * TIMER_TARGET_SECONDS));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, reduced]);

  return seconds;
}

export default function SixPlusCard({ active }) {
  const reduced = useReducedMotion();
  const seconds = useTimerCount(active, reduced);

  return (
    <div className="xp-card xp-card--sixplus">
      <img className="xp-card__bg" src={sixPlusBg} alt="" aria-hidden="true" />

      <div className="xp-sixplus__chip">
        <img src={calendarIcon} alt="" aria-hidden="true" />
      </div>

      <div className="xp-sixplus__gauge">
        <img className="xp-sixplus__rays" src={gaugeRays} alt="" aria-hidden="true" />
        <svg className="xp-sixplus__arc" viewBox="0 0 301.17 150.585" fill="none" aria-hidden="true">
          <path
            d={ARC_PATH}
            stroke="url(#xp-arc-grad)"
            strokeWidth="9.97"
            pathLength="1"
            style={{
              strokeDasharray: 1,
              strokeDashoffset: active ? 0 : 1,
              transition: reduced ? "none" : "stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)",
            }}
          />
          <defs>
            <linearGradient id="xp-arc-grad" x1="296.185" y1="24.98" x2="11.238" y2="21.76" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF7E38" />
              <stop offset="0.52" stopColor="#FFC943" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        <div className="xp-sixplus__label">
          <span className="xp-sixplus__linebar" aria-hidden="true" />
          <span className="xp-sixplus__text">
            <span className="xp-sixplus__title">6+ Month</span>
            <span className="xp-sixplus__subtitle">Verified Performance</span>
          </span>
        </div>

        <div className="xp-sixplus__timer">{formatTimer(seconds)}</div>
      </div>

      <p className="xp-card__caption">Minimum trading history required</p>
    </div>
  );
}
```

- [ ] **Step 4: Write the CSS**

```css
/* src/sections/ExplorePlatform/cards/SixPlusCard.css */
.xp-card { position: relative; width: 100%; height: 100%; overflow: hidden; }
.xp-card__bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.xp-card__caption {
  position: absolute; left: 32px; right: 32px; bottom: 32px;
  font-family: var(--font-heading); font-size: 19.6px; line-height: 25.2px;
  letter-spacing: -0.02em; color: var(--white);
}

.xp-sixplus__chip {
  position: absolute; left: 32px; top: 32px;
  width: 67.2px; height: 67.2px; border-radius: 16.8px;
  background: rgba(255, 255, 255, 0.2);
  display: flex; align-items: center; justify-content: center;
}
.xp-sixplus__chip img { width: 33.6px; height: 33.6px; }

.xp-sixplus__gauge {
  position: absolute; left: 32px; right: 32px; top: 111.6px; height: 257.6px;
  border-radius: 22.4px; overflow: hidden; background: rgba(255, 255, 255, 0.2);
}
.xp-sixplus__rays {
  position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
  width: 291px; opacity: 0.7; pointer-events: none;
}
.xp-sixplus__arc {
  position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%);
  width: 230px; overflow: visible;
}
.xp-sixplus__label {
  position: absolute; left: 0; right: 0; top: 27px; padding: 0 28px;
  display: flex; gap: 5.6px; align-items: stretch;
}
.xp-sixplus__linebar { width: 1.8px; border-radius: 500px; background: var(--grad-orange); align-self: stretch; }
.xp-sixplus__text { display: flex; flex-direction: column; gap: 5.6px; color: var(--white); }
.xp-sixplus__title { font-family: var(--font-heading); font-weight: 500; font-size: 28px; line-height: 33.6px; letter-spacing: -0.02em; }
.xp-sixplus__subtitle { font-family: var(--font-heading); font-size: 16.8px; line-height: 22.4px; letter-spacing: -0.02em; }
.xp-sixplus__timer {
  position: absolute; bottom: 22px; left: 50%; transform: translateX(-50%);
  font-family: var(--font-heading); font-weight: 300; font-size: 64.7px;
  letter-spacing: -0.02em; color: #F1F1F1; font-variant-numeric: tabular-nums;
}

@media (prefers-reduced-motion: reduce) {
  .xp-sixplus__arc path { transition: none !important; }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/sections/ExplorePlatform/cards/SixPlusCard.test.jsx`
Expected: PASS (2 tests)

- [ ] **Step 6: Commit**

```bash
git add src/sections/ExplorePlatform/cards/SixPlusCard.jsx src/sections/ExplorePlatform/cards/SixPlusCard.css src/sections/ExplorePlatform/cards/SixPlusCard.test.jsx
git commit -m "feat: add SixPlusCard with draw-in gauge and timer count-up"
```

---

### Task 4: EarnedAccessCard (wave + checkmark badge card)

**Files:**
- Create: `src/sections/ExplorePlatform/cards/EarnedAccessCard.jsx`
- Create: `src/sections/ExplorePlatform/cards/EarnedAccessCard.css`
- Test: `src/sections/ExplorePlatform/cards/EarnedAccessCard.test.jsx`

**Interfaces:**
- Consumes: `useReducedMotion`; assets from Task 1; `motion` from `framer-motion`.
- Produces: `export default function EarnedAccessCard({ active: boolean })`.

- [ ] **Step 1: Write the failing test**

```jsx
// src/sections/ExplorePlatform/cards/EarnedAccessCard.test.jsx
import { render, screen } from "@testing-library/react";
import EarnedAccessCard from "./EarnedAccessCard.jsx";

test("renders the pill copy", () => {
  render(<EarnedAccessCard active={false} />);
  expect(screen.getByText("Selection Review")).toBeInTheDocument();
  expect(screen.getByText("Earned Access")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/sections/ExplorePlatform/cards/EarnedAccessCard.test.jsx`
Expected: FAIL — `Cannot find module './EarnedAccessCard.jsx'`

- [ ] **Step 3: Write the component**

```jsx
// src/sections/ExplorePlatform/cards/EarnedAccessCard.jsx
import { motion } from "framer-motion";
import { useReducedMotion } from "../../../lib/useReducedMotion.js";
import sharedBg from "../../../assets/explore-platform/shared-bg.png";
import earnedWave from "../../../assets/explore-platform/earned-wave.png";
import checkmarkIcon from "../../../assets/explore-platform/checkmark-badge-icon.svg";
import "./EarnedAccessCard.css";

export default function EarnedAccessCard({ active }) {
  const reduced = useReducedMotion();

  return (
    <div className="xp-card xp-card--earned">
      <img className="xp-card__bg" src={sharedBg} alt="" aria-hidden="true" />
      <div className="xp-card__overlay" aria-hidden="true" />
      <img className="xp-earned__wave" src={earnedWave} alt="" aria-hidden="true" />

      <div className="xp-earned__pill">
        <motion.span
          className="xp-earned__badge"
          initial={false}
          animate={{ scale: active ? 1 : 0.6, opacity: active ? 1 : 0 }}
          transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 14 }}
        >
          <img src={checkmarkIcon} alt="" aria-hidden="true" />
        </motion.span>
        <span className="xp-earned__text">
          <span className="xp-earned__title">Selection Review</span>
          <span className="xp-earned__subtitle">Earned Access</span>
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Write the CSS**

```css
/* src/sections/ExplorePlatform/cards/EarnedAccessCard.css */
.xp-card--earned .xp-card__overlay { position: absolute; inset: 0; background: rgba(20, 20, 20, 0.64); }
.xp-earned__wave { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }

.xp-earned__pill {
  position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
  width: 306.6px; display: flex; align-items: center; gap: 14px;
  padding: 14px 19.6px 14px 14px; border-radius: 16.8px;
  background: rgba(255, 255, 255, 0.2); overflow: hidden;
}
.xp-earned__badge {
  width: 56px; height: 56px; border-radius: 9.14px; flex: none;
  background: var(--grad-orange);
  display: flex; align-items: center; justify-content: center;
}
.xp-earned__badge img { width: 22.4px; height: 22.4px; }
.xp-earned__text { display: flex; flex-direction: column; gap: 2.8px; color: var(--white); white-space: nowrap; }
.xp-earned__title { font-family: var(--font-heading); font-size: 16.8px; line-height: 22.4px; letter-spacing: -0.02em; }
.xp-earned__subtitle { font-family: var(--font-heading); font-size: 22.4px; line-height: 28px; letter-spacing: -0.02em; }
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/sections/ExplorePlatform/cards/EarnedAccessCard.test.jsx`
Expected: PASS (1 test)

- [ ] **Step 6: Commit**

```bash
git add src/sections/ExplorePlatform/cards/EarnedAccessCard.jsx src/sections/ExplorePlatform/cards/EarnedAccessCard.css src/sections/ExplorePlatform/cards/EarnedAccessCard.test.jsx
git commit -m "feat: add EarnedAccessCard with spring-in checkmark badge"
```

---

### Task 5: FourteenDaysCard (tilted photo + wave card)

**Files:**
- Create: `src/sections/ExplorePlatform/cards/FourteenDaysCard.jsx`
- Create: `src/sections/ExplorePlatform/cards/FourteenDaysCard.css`
- Test: `src/sections/ExplorePlatform/cards/FourteenDaysCard.test.jsx`

**Interfaces:**
- Consumes: `useReducedMotion`; assets from Task 1 (`shared-bg.png`, `fourteen-days-photo.png`, `src/assets/icons/wave1.svg`).
- Produces: `export default function FourteenDaysCard({ active: boolean })`.

- [ ] **Step 1: Write the failing test**

```jsx
// src/sections/ExplorePlatform/cards/FourteenDaysCard.test.jsx
import { render, screen } from "@testing-library/react";
import FourteenDaysCard from "./FourteenDaysCard.jsx";

test("renders the '14 Days' headline and Trend pill", () => {
  render(<FourteenDaysCard active={false} />);
  expect(screen.getByText("14 Days")).toBeInTheDocument();
  expect(screen.getByText("Trend")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/sections/ExplorePlatform/cards/FourteenDaysCard.test.jsx`
Expected: FAIL — `Cannot find module './FourteenDaysCard.jsx'`

- [ ] **Step 3: Write the component**

```jsx
// src/sections/ExplorePlatform/cards/FourteenDaysCard.jsx
import { motion } from "framer-motion";
import { useReducedMotion } from "../../../lib/useReducedMotion.js";
import sharedBg from "../../../assets/explore-platform/shared-bg.png";
import fourteenPhoto from "../../../assets/explore-platform/fourteen-days-photo.png";
import wave1 from "../../../assets/icons/wave1.svg";
import "./FourteenDaysCard.css";

export default function FourteenDaysCard({ active }) {
  const reduced = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1];

  return (
    <div className="xp-card xp-card--fourteen">
      <img className="xp-card__bg" src={sharedBg} alt="" aria-hidden="true" />
      <div className="xp-card__overlay" aria-hidden="true" />

      <motion.div
        className="xp-14__ghost"
        initial={false}
        animate={{ opacity: active ? 1 : 0, x: active ? 0 : 30, rotate: active ? 31.05 : 40 }}
        transition={{ duration: reduced ? 0 : 0.7, ease, delay: reduced ? 0 : 0.05 }}
        aria-hidden="true"
      />

      <motion.div
        className="xp-14__photo"
        initial={false}
        animate={{ opacity: active ? 1 : 0, x: active ? 0 : -30, rotate: active ? -31.77 : -42 }}
        transition={{ duration: reduced ? 0 : 0.7, ease }}
      >
        <img src={fourteenPhoto} alt="" aria-hidden="true" />
      </motion.div>

      <motion.div
        className="xp-14__panel"
        initial={false}
        animate={{ opacity: active ? 1 : 0, y: active ? 0 : 16 }}
        transition={{ duration: reduced ? 0 : 0.6, ease, delay: reduced ? 0 : 0.25 }}
      >
        <p className="xp-14__title">14 Days</p>
        <img
          className={reduced ? "xp-14__wave" : "xp-14__wave xp-14__wave--sway"}
          src={wave1}
          alt=""
          aria-hidden="true"
        />
        <span className="xp-14__pill">Trend</span>
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 4: Write the CSS**

```css
/* src/sections/ExplorePlatform/cards/FourteenDaysCard.css */
.xp-card--fourteen .xp-card__overlay { position: absolute; inset: 0; background: rgba(20, 20, 20, 0.64); }

.xp-14__ghost {
  position: absolute; left: calc(50% + 36px); top: calc(50% - 138px);
  width: 217.5px; height: 276.2px;
  border-radius: 27.45px; border: 1px solid rgba(255, 255, 255, 0.25);
}
.xp-14__photo {
  position: absolute; left: calc(50% - 160px); top: calc(50% - 138px);
  width: 217.5px; height: 276.2px;
  border-radius: 27.45px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
}
.xp-14__photo img { width: 100%; height: 100%; object-fit: cover; }

.xp-14__panel {
  position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
  width: 216.2px; height: 276.2px; border-radius: 27.45px; overflow: hidden;
  display: flex; flex-direction: column; align-items: center;
}
.xp-14__title {
  margin-top: 32px;
  font-family: var(--font-heading); font-weight: 500; font-size: 40px; line-height: 48px;
  letter-spacing: -0.02em;
  background: linear-gradient(180deg, #fff 0%, rgba(255, 255, 255, 0.3) 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.xp-14__wave { width: 100%; margin-top: 20px; }
.xp-14__wave--sway { animation: xp-wave-sway 4s ease-in-out infinite; }
@keyframes xp-wave-sway {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
.xp-14__pill {
  margin-top: 20px; height: 41.2px; padding: 3.4px 27.45px; border-radius: 1000px;
  background: var(--white); color: #949494;
  font-family: var(--font-heading); font-size: 24px; line-height: 32px; letter-spacing: -0.02em;
  display: flex; align-items: center; justify-content: center;
}

@media (prefers-reduced-motion: reduce) {
  .xp-14__wave--sway { animation: none; }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/sections/ExplorePlatform/cards/FourteenDaysCard.test.jsx`
Expected: PASS (1 test)

- [ ] **Step 6: Commit**

```bash
git add src/sections/ExplorePlatform/cards/FourteenDaysCard.jsx src/sections/ExplorePlatform/cards/FourteenDaysCard.css src/sections/ExplorePlatform/cards/FourteenDaysCard.test.jsx
git commit -m "feat: add FourteenDaysCard with parallax card reveal and swaying wave"
```

---

### Task 6: DashboardCard (mockup reveal card)

**Files:**
- Create: `src/sections/ExplorePlatform/cards/DashboardCard.jsx`
- Create: `src/sections/ExplorePlatform/cards/DashboardCard.css`
- Test: `src/sections/ExplorePlatform/cards/DashboardCard.test.jsx`

**Interfaces:**
- Consumes: `useReducedMotion`; assets from Task 1 (`shared-bg.png`, `dashboard-mockup.png`).
- Produces: `export default function DashboardCard({ active: boolean })`.
- Note (scope decision, see spec "Out of scope"): `dashboard-mockup.png` is a single flattened raster, so there is no real balance digit to animate — "the balance appears" is implemented as the top (balance) region fading/rising in, and "the line graph draws in" as the bottom (chart) region wiping in left-to-right via `clip-path`, using two stacked copies of the same image each clipped to its own half.

- [ ] **Step 1: Write the failing test**

```jsx
// src/sections/ExplorePlatform/cards/DashboardCard.test.jsx
import { render, screen } from "@testing-library/react";
import DashboardCard from "./DashboardCard.jsx";

test("renders two stacked copies of the dashboard mockup image", () => {
  render(<DashboardCard active={false} />);
  const images = screen.getAllByRole("img");
  // background photo + the two clipped mockup copies (one has real alt text)
  expect(images.length).toBeGreaterThanOrEqual(3);
  expect(screen.getByAltText("Dashboard preview")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/sections/ExplorePlatform/cards/DashboardCard.test.jsx`
Expected: FAIL — `Cannot find module './DashboardCard.jsx'`

- [ ] **Step 3: Write the component**

```jsx
// src/sections/ExplorePlatform/cards/DashboardCard.jsx
import { motion } from "framer-motion";
import { useReducedMotion } from "../../../lib/useReducedMotion.js";
import sharedBg from "../../../assets/explore-platform/shared-bg.png";
import dashboardImg from "../../../assets/explore-platform/dashboard-mockup.png";
import "./DashboardCard.css";

export default function DashboardCard({ active }) {
  const reduced = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1];

  return (
    <div className="xp-card xp-card--dashboard">
      <img className="xp-card__bg" src={sharedBg} alt="" aria-hidden="true" />
      <div className="xp-card__overlay" aria-hidden="true" />

      <div className="xp-dash">
        {/* Top ~55%: the balance figure. Fades + rises in. */}
        <motion.img
          className="xp-dash__layer"
          src={dashboardImg}
          alt=""
          aria-hidden="true"
          initial={false}
          animate={{ opacity: active ? 1 : 0, y: active ? 0 : 12 }}
          transition={{ duration: reduced ? 0 : 0.6, ease }}
          style={{ clipPath: "inset(0% 0% 55% 0%)" }}
        />
        {/* Bottom ~58%: the performance chart. Wipes in left-to-right. */}
        <motion.img
          className="xp-dash__layer"
          src={dashboardImg}
          alt="Dashboard preview"
          initial={false}
          animate={{ clipPath: active ? "inset(42% 0% 0% 0%)" : "inset(42% 100% 0% 0%)" }}
          transition={{ duration: reduced ? 0 : 0.9, ease, delay: reduced ? 0 : 0.25 }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Write the CSS**

```css
/* src/sections/ExplorePlatform/cards/DashboardCard.css */
.xp-card--dashboard .xp-card__overlay { position: absolute; inset: 0; background: rgba(20, 20, 20, 0.64); }

.xp-dash {
  position: absolute; left: 50%; top: 50%; width: 662.4px;
  transform: translate(-50%, -50%);
}
.xp-dash__layer {
  position: absolute; top: 0; left: 0; width: 100%; display: block;
  border-radius: 10.16px;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/sections/ExplorePlatform/cards/DashboardCard.test.jsx`
Expected: PASS (1 test)

- [ ] **Step 6: Commit**

```bash
git add src/sections/ExplorePlatform/cards/DashboardCard.jsx src/sections/ExplorePlatform/cards/DashboardCard.css src/sections/ExplorePlatform/cards/DashboardCard.test.jsx
git commit -m "feat: add DashboardCard with balance fade-in and chart wipe reveal"
```

---

### Task 7: ExplorePlatformSlide (shared layout + per-line text reveal)

**Files:**
- Create: `src/sections/ExplorePlatform/ExplorePlatformSlide.jsx`
- Create: `src/sections/ExplorePlatform/ExplorePlatform.css`
- Test: `src/sections/ExplorePlatform/ExplorePlatformSlide.test.jsx`

**Interfaces:**
- Consumes: `EXPLORE_PLATFORM_SLIDES` from Task 2 (caller passes one `slide` object); `SixPlusCard`/`EarnedAccessCard`/`FourteenDaysCard`/`DashboardCard` from Tasks 3–6 (all share the `{ active: boolean }` prop contract); `Button` from `src/components/Button.jsx`; `useReducedMotion`.
- Produces: `export default function ExplorePlatformSlide({ slide, active })`. Task 8 renders this 4 times (once per stage 3–6), passing the matching entry of `EXPLORE_PLATFORM_SLIDES` and that stage's `active` boolean.

- [ ] **Step 1: Write the failing test**

```jsx
// src/sections/ExplorePlatform/ExplorePlatformSlide.test.jsx
import { render, screen } from "@testing-library/react";
import ExplorePlatformSlide from "./ExplorePlatformSlide.jsx";
import EXPLORE_PLATFORM_SLIDES from "../../data/explorePlatform.js";

test("renders the tag, full headline text, lead, and CTA for a text-left slide", () => {
  const slide = EXPLORE_PLATFORM_SLIDES[0]; // six-plus, text-left
  render(<ExplorePlatformSlide slide={slide} active={false} />);
  expect(screen.getByText("Explore Platform")).toBeInTheDocument();
  expect(screen.getByText("The bridge between")).toBeInTheDocument();
  expect(screen.getByText("strategy providers")).toBeInTheDocument();
  expect(screen.getByText(slide.lead)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Explore the Platform" })).toBeInTheDocument();
  // renders the matching card (six-plus copy)
  expect(screen.getByText("6+ Month")).toBeInTheDocument();
});

test("renders the card-left layout class for a card-left slide", () => {
  const slide = EXPLORE_PLATFORM_SLIDES[1]; // earned-access, card-left
  const { container } = render(<ExplorePlatformSlide slide={slide} active={false} />);
  expect(container.querySelector(".xp-slide--card-left")).toBeTruthy();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/sections/ExplorePlatform/ExplorePlatformSlide.test.jsx`
Expected: FAIL — `Cannot find module './ExplorePlatformSlide.jsx'`

- [ ] **Step 3: Write the component**

```jsx
// src/sections/ExplorePlatform/ExplorePlatformSlide.jsx
import { motion } from "framer-motion";
import { useReducedMotion } from "../../lib/useReducedMotion.js";
import Button from "../../components/Button.jsx";
import logoIcon from "../../assets/logo-icon.svg";
import SixPlusCard from "./cards/SixPlusCard.jsx";
import EarnedAccessCard from "./cards/EarnedAccessCard.jsx";
import FourteenDaysCard from "./cards/FourteenDaysCard.jsx";
import DashboardCard from "./cards/DashboardCard.jsx";
import "./ExplorePlatform.css";

const CARDS = {
  "six-plus": SixPlusCard,
  "earned-access": EarnedAccessCard,
  "fourteen-days": FourteenDaysCard,
  dashboard: DashboardCard,
};

export default function ExplorePlatformSlide({ slide, active }) {
  const reduced = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1];

  const rise = reduced
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };
  const lineContainer = (delay) => ({
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : 0.12, delayChildren: reduced ? 0 : delay } },
  });
  const animate = active ? "show" : "hidden";

  const Card = CARDS[slide.id];

  return (
    <section className={`xp-slide xp-slide--${slide.layout}`}>
      <div className="xp-slide__text">
        <motion.div className="xp-slide__tag" variants={rise} initial="hidden" animate={animate} transition={{ duration: 0.6, ease }}>
          <img className="xp-slide__tagicon" src={logoIcon} alt="" aria-hidden="true" />
          Explore Platform
        </motion.div>

        <motion.h2 className="xp-slide__title" variants={lineContainer(0.1)} initial="hidden" animate={animate}>
          {slide.lines.map((line, i) => (
            <span className="xp-slide__line" key={i}>
              <motion.span style={{ display: "block" }} variants={rise} transition={{ duration: 0.6, ease }}>
                {line.map((seg, j) => (
                  <span key={j} className={seg.accent ? "xp-slide__accent" : undefined}>
                    {seg.text}
                  </span>
                ))}
              </motion.span>
            </span>
          ))}
        </motion.h2>

        <motion.div className="xp-slide__ctawrap" variants={lineContainer(0.45)} initial="hidden" animate={animate}>
          <motion.p className="xp-slide__lead" variants={rise} transition={{ duration: 0.6, ease }}>
            {slide.lead}
          </motion.p>
          <motion.div className="cta-btn-wrap" variants={rise} transition={{ duration: 0.6, ease }}>
            <Button variant="dark" className="btn--notch-bl">Explore the Platform</Button>
            <span className="gradient-dot" aria-hidden="true" />
          </motion.div>
        </motion.div>
      </div>

      <div className="xp-slide__card">
        <Card active={active} />
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Write the CSS**

```css
/* src/sections/ExplorePlatform/ExplorePlatform.css */
.xp-slide {
  position: relative; width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: space-between;
  padding: 120px; gap: 60px;
  background: #F5F5F5; color: var(--black);
}
.xp-slide--card-left { flex-direction: row-reverse; }

.xp-slide__text { display: flex; flex-direction: column; gap: 24px; max-width: 460px; }
.xp-slide__tag {
  display: flex; align-items: center; gap: 16px;
  font-family: var(--font-heading); font-size: 14px; line-height: 18px; letter-spacing: -0.02em;
}
.xp-slide__tagicon { width: 16px; height: 16px; }

.xp-slide__title {
  font-family: var(--font-heading); font-weight: 500; font-size: 42px; line-height: 46px;
  letter-spacing: -0.03em; display: flex; flex-direction: column;
}
.xp-slide__line { display: block; overflow: hidden; }
.xp-slide__accent { color: var(--accent); }

.xp-slide__ctawrap { display: flex; flex-direction: column; gap: 36px; align-items: flex-start; max-width: 387px; }
.xp-slide__lead { font-family: var(--font-heading); font-size: 16px; line-height: 20px; letter-spacing: -0.02em; color: #737373; }

.xp-slide__card {
  flex: none; width: 590px; height: 590px; border-radius: 16px; overflow: hidden; position: relative;
}

@media (prefers-reduced-motion: reduce) {
  .xp-slide__line { overflow: visible; }
}

@media (max-width: 1300px) {
  .xp-slide { padding: 80px 40px; gap: 40px; }
  .xp-slide__card { width: 440px; height: 440px; }
}

@media (max-width: 1000px) {
  .xp-slide, .xp-slide--card-left { flex-direction: column; justify-content: center; padding: 60px 24px; gap: 32px; }
  .xp-slide__text { max-width: none; }
  .xp-slide__card { width: min(90vw, 440px); height: min(90vw, 440px); }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/sections/ExplorePlatform/ExplorePlatformSlide.test.jsx`
Expected: PASS (2 tests)

- [ ] **Step 6: Commit**

```bash
git add src/sections/ExplorePlatform/ExplorePlatformSlide.jsx src/sections/ExplorePlatform/ExplorePlatform.css src/sections/ExplorePlatform/ExplorePlatformSlide.test.jsx
git commit -m "feat: add ExplorePlatformSlide shared layout with per-line reveal"
```

---

### Task 8: Wire into the homepage scroll-jack

**Files:**
- Modify: `src/pages/HomePage.jsx`
- Modify: `src/pages/HomePage.css`

**Interfaces:**
- Consumes: `ExplorePlatformSlide` from Task 7; `EXPLORE_PLATFORM_SLIDES` from Task 2.
- Produces: `vScroll` now ranges 0..6; stages 3–6 render the 4 Explore Platform slides. No other file depends on this task's internals.

- [ ] **Step 1: Update the stage constants and horizontal-phase gate**

In `src/pages/HomePage.jsx`, replace:

```js
const V_MAX = 2; // 0 = Providers, 1 = Key Numbers, 2 = Selection Standard
```

with:

```js
const SELECTION_STAGE = 2; // Selection Standard's index — the one stage with a horizontal sub-phase
const V_MAX = 6; // 0 Providers, 1 Key Numbers, 2 Selection Standard, 3-6 Explore Platform cards
```

Then replace the horizontal-phase check:

```js
      const atLastVertical = vRef.current >= V_MAX;
      if (atLastVertical && (hRef.current > 0 || dy > 0)) {
```

with:

```js
      // Horizontal phase only applies to Selection Standard itself; once its
      // slides are fully swept (hRef === 1), forward scroll falls through to
      // the normal vertical branch below and continues into Explore Platform.
      const inHorizontalPhase =
        vRef.current === SELECTION_STAGE &&
        (hRef.current > 0 || dy > 0) &&
        (dy < 0 || hRef.current < 1);
      if (inHorizontalPhase) {
```

(The body of that `if` block — the `hRef`/`setHScroll` lines — is unchanged.)

- [ ] **Step 2: Add the new imports and per-stage `rel`/`active` values**

Add near the top, alongside the existing imports:

```js
import ExplorePlatformSlide from "../sections/ExplorePlatform/ExplorePlatformSlide.jsx";
import EXPLORE_PLATFORM_SLIDES from "../data/explorePlatform.js";
```

Replace:

```js
  const selectionRel = rel(vScroll, 2);
```

with:

```js
  const selectionRel = rel(vScroll, 2);
  const explorePlatformStages = [3, 4, 5, 6].map((stageIndex, i) => ({
    stageIndex,
    slide: EXPLORE_PLATFORM_SLIDES[i],
    rel: rel(vScroll, stageIndex),
    active: vScroll > stageIndex - 0.5,
  }));
```

- [ ] **Step 3: Render the 4 new stages**

Replace the closing of the `home__stage--selection` block and the `</main>`:

```jsx
      <div
        className="home__stage home__stage--selection"
        style={{ transform: `translateY(${(-selectionRel * 100).toFixed(3)}%)` }}
        aria-hidden={stage === 0 || selectionRel >= 1}
      >
        <SelectionStandardSection active={selectionActive} progress={hScroll} />
      </div>
    </main>
  );
}
```

with:

```jsx
      <div
        className="home__stage home__stage--selection"
        style={{ transform: `translateY(${(-selectionRel * 100).toFixed(3)}%)` }}
        aria-hidden={stage === 0 || selectionRel >= 1}
      >
        <SelectionStandardSection active={selectionActive} progress={hScroll} />
      </div>

      {explorePlatformStages.map(({ stageIndex, slide, rel: stageRel, active }) => (
        <div
          key={slide.id}
          className="home__stage home__stage--explore"
          style={{ zIndex: 6 + (stageIndex - 3), transform: `translateY(${(-stageRel * 100).toFixed(3)}%)` }}
          aria-hidden={stage === 0 || Math.abs(stageRel) >= 1}
        >
          <ExplorePlatformSlide slide={slide} active={active} />
        </div>
      ))}
    </main>
  );
}
```

- [ ] **Step 4: Add the stage CSS**

In `src/pages/HomePage.css`, after the existing block:

```css
.home__stage--providers { z-index: 3; opacity: 0; pointer-events: none; }
.home__stage--keynumbers { z-index: 4; opacity: 0; pointer-events: none; }
.home__stage--selection { z-index: 5; opacity: 0; pointer-events: none; }
.home[data-stage="1"] .home__stage--providers,
.home[data-stage="1"] .home__stage--keynumbers,
.home[data-stage="1"] .home__stage--selection {
  opacity: 1; pointer-events: auto;
  transition-delay: 0.35s;
}
```

add:

```css
.home__stage--explore { opacity: 0; pointer-events: none; }
.home[data-stage="1"] .home__stage--explore {
  opacity: 1; pointer-events: auto;
  transition-delay: 0.35s;
}
```

(`z-index` for each of the 4 explore stages is set inline per-instance in Task 8 Step 3, since it varies 6–9 while every other rule is shared.)

- [ ] **Step 5: Update the existing HomePage smoke test**

In `src/pages/HomePage.test.jsx`, add a second test asserting the new stages mounted (they're present in the DOM, just visually translated off-stage — `aria-hidden` does not remove them from `getByText` queries in Testing Library):

```jsx
test("renders the Explore Platform stages", () => {
  render(<MemoryRouter><HomePage /></MemoryRouter>);
  expect(screen.getByText("6+ Month")).toBeInTheDocument();
  expect(screen.getByText("Selection Review")).toBeInTheDocument();
  expect(screen.getByText("14 Days")).toBeInTheDocument();
  expect(screen.getAllByText("Explore Platform").length).toBe(4);
});
```

- [ ] **Step 6: Run the full test suite**

Run: `npm test`
Expected: PASS — every test file green, including the new/updated ones from Tasks 2–8.

- [ ] **Step 7: Commit**

```bash
git add src/pages/HomePage.jsx src/pages/HomePage.css src/pages/HomePage.test.jsx
git commit -m "feat: extend homepage scroll-jack with Explore Platform (stages 3-6)"
```

---

### Task 9: Visual verification

**Files:** none (manual/browser verification only).

- [ ] **Step 1: Start the dev server and open it**

Use the project's preview tooling to start `npm run dev` and open the homepage in the browser pane.

- [ ] **Step 2: Scroll through the whole zone**

Dispatch synthetic `wheel` events (as done earlier in this project's sessions — `window.dispatchEvent(new WheelEvent('wheel', {deltaY: 80, bubbles:true, cancelable:true}))` in a loop via the browser's JS-eval tool) to walk from Hero through Providers → Key Numbers → Selection Standard (drain its horizontal slides fully) → the 4 new Explore Platform stages in order.

- [ ] **Step 3: Screenshot each of the 4 new stages**

Confirm for each:
- 6+ Month: gauge arc strokes in and the timer counts from `00:00` to `06:00`.
- Earned Access: checkmark badge pops in with a slight overshoot.
- 14 Days: the two cards ease in with parallax; the wave gently sways.
- Dashboard: the top (balance) region fades/rises in, then the bottom (chart) region wipes in left-to-right.
- Headings reveal line-by-line, bottom-to-top, matching the Hero title's motion.
- Layout alternates text-left/card-right and card-left/text-right per Figma.

- [ ] **Step 4: Confirm scroll gating**

Verify: past Selection Standard's horizontal sweep, one more forward scroll enters stage 3 (six-plus); continuing to scroll moves through all 4 stages in order; scrolling back up retraces them in reverse and eventually re-enters Selection Standard's horizontal phase.

- [ ] **Step 5: Re-run the full test suite one more time**

Run: `npm test`
Expected: PASS.

---

## Self-Review Notes

- **Spec coverage:** scroll architecture (Task 8), component structure (Tasks 3–7), asset mapping (Task 1), all 4 cards' content/animation (Tasks 3–6), alternating layout + per-line reveal (Task 7). Out-of-scope items (no native scroll, no nested dashboard rebuild, no looping ambient beyond the noted wave) are respected by construction.
- **Type/prop consistency:** all 4 card components share the exact `{ active }` prop; `ExplorePlatformSlide` looks cards up by `slide.id`, matching Task 2's `id` values verbatim.
- **No placeholders:** every step above has complete, runnable code.
