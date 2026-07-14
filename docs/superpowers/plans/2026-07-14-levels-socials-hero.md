# Levels Socials — Hero Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Levels Socials homepage Hero — full-screen play-once video background, glass header with a two-state Company menu, animated headline/CTA, and a custom cursor-trail effect — in React + Vite.

**Architecture:** A single `HomePage` route renders a `Hero` section. Hero composes focused components: `Header` (logo + glass nav pill + auth actions), `CompanyMenu` (two-state glass dropdown), `CursorTrail` (canvas overlay). Cross-cutting UI (`GlassSurface`, `Button`) lives in `src/components/` for reuse by later Login/Create Account pages. Design tokens are CSS custom properties; entrance motion uses framer-motion.

**Tech Stack:** React 19, Vite, react-router-dom, framer-motion, Vitest + @testing-library/react (jsdom).

## Global Constraints

- Fonts: `Onest` (Medium 500 headings, Regular 400 body) and `DM Sans` (Regular/Medium) — self-hosted via `@font-face`, no external CDN.
- Colors (exact): accent `#FF8C3A`, logo `#EF5E32` / `#FF964F`, text/white `#FFFFFF`, black `#000000`.
- Typography: H1 = 50px / lineHeight 54 / letterSpacing −3px / weight 500; body p2 = 14/18/−2/400; p3 = 12/16/−2/400.
- Liquid glass = CSS `backdrop-filter: blur() saturate()` + light border + inner highlight (NOT SVG refraction).
- Hero video: `autoPlay muted playsInline`, **no `loop`** — plays once, holds last frame; `poster` set.
- Default system cursor stays visible; the Figma arrow-cursor graphic is NOT reproduced.
- Entrance motion is bottom-up (`opacity 0→1`, `y:24→0`); headline animates per-line with stagger.
- All motion + cursor trail disabled under `prefers-reduced-motion: reduce`.
- Reference design at 1440×900; layout must not break on smaller widths (content stacks, video still covers).
- Menu items (order, titles, subtitles, icons) exactly as listed in Task 5.

---

## File Structure

- `index.html`, `vite.config.js`, `package.json` — project root config.
- `src/main.jsx` — Router mount. `src/App.jsx` — routes.
- `src/pages/HomePage.jsx` — renders `<Hero/>`.
- `src/data/companyMenu.js` — the 7 menu items (single source of truth).
- `src/styles/tokens.css`, `fonts.css`, `global.css` — tokens, `@font-face`, reset/base.
- `src/components/GlassSurface.jsx` + `.css` — reusable glass wrapper.
- `src/components/Button.jsx` + `.css` — glass/solid button.
- `src/sections/Hero/Hero.jsx`, `Header.jsx`, `CompanyMenu.jsx`, `CursorTrail.jsx`, `Hero.css`.
- `src/lib/useReducedMotion.js` — shared reduced-motion hook.
- `src/test/setup.js` — Vitest/jsdom setup.
- `src/assets/` — `hero.mp4`, `hero-poster.jpg`, `logo.svg`, `icons/*`, `fonts/*`.

---

### Task 1: Project scaffold, assets, tokens & test harness

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `.gitignore` (exists — extend), `src/main.jsx`, `src/App.jsx`, `src/pages/HomePage.jsx`
- Create: `src/styles/tokens.css`, `src/styles/fonts.css`, `src/styles/global.css`
- Create: `src/lib/useReducedMotion.js`, `src/test/setup.js`
- Assets: extract into `src/assets/`
- Test: `src/pages/HomePage.test.jsx`

**Interfaces:**
- Produces: `HomePage` default-exported React component (route `/`); `useReducedMotion()` → `boolean`; CSS vars `--accent`, `--logo-1`, `--logo-3`, `--white`, `--black`, font families `--font-heading` (Onest), `--font-body` (Onest), `--font-ui` (DM Sans); glass vars `--glass-blur`, `--glass-bg`, `--glass-border`.

- [ ] **Step 1: Scaffold Vite React app in the project root**

Run from `Levels Socials/`:
```bash
npm create vite@latest . -- --template react
npm install
npm install react-router-dom framer-motion
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```
Remove the template's demo files: `src/App.css`, `src/index.css`, `src/assets/react.svg`, and the counter body of `App.jsx` (replaced below).

- [ ] **Step 2: Extract fonts, icons, logo, video into `src/assets/`**

```bash
mkdir -p src/assets/fonts src/assets/icons/nav
unzip -o "main page/DM_Sans,Onest.zip" -d /tmp/ls-fonts 2>/dev/null || unzip -o "main page/font/DM_Sans,Onest.zip" -d /tmp/ls-fonts
cp "/tmp/ls-fonts/Onest/static/Onest-Regular.ttf" src/assets/fonts/Onest-Regular.ttf
cp "/tmp/ls-fonts/Onest/static/Onest-Medium.ttf"  src/assets/fonts/Onest-Medium.ttf
cp "/tmp/ls-fonts/DM_Sans/static/DMSans-Regular.ttf" src/assets/fonts/DMSans-Regular.ttf
cp "/tmp/ls-fonts/DM_Sans/static/DMSans-Medium.ttf"  src/assets/fonts/DMSans-Medium.ttf
cp "main page/Logo.svg" src/assets/logo.svg
cp "main page/icon/arrow-down.svg" src/assets/icons/arrow-down.svg
cp "main page/icon/arrow.svg" src/assets/icons/arrow.svg
cp "main page/icon/nav menu/"*.svg src/assets/icons/nav/
cp "main page/hero section.mp4" src/assets/hero.mp4
```
Export the Hero poster (last/first frame). If `ffmpeg` is available:
```bash
ffmpeg -y -i src/assets/hero.mp4 -frames:v 1 -q:v 3 src/assets/hero-poster.jpg
```
Otherwise copy the Figma background still already downloaded to the scratchpad as the poster:
```bash
sips -s format jpeg "/private/tmp/claude-501/-Users-valeriytsvigun/65f2e5cf-4540-4df6-bfce-b64b010fa017/scratchpad/design_789.png" --out src/assets/hero-poster.jpg
```

- [ ] **Step 3: Write design tokens** — `src/styles/tokens.css`

```css
:root {
  --white: #FFFFFF;
  --black: #000000;
  --accent: #FF8C3A;
  --logo-1: #FF964F;
  --logo-3: #EF5E32;

  --font-heading: "Onest", system-ui, sans-serif;
  --font-body: "Onest", system-ui, sans-serif;
  --font-ui: "DM Sans", system-ui, sans-serif;

  /* liquid glass */
  --glass-blur: 29px;
  --glass-bg: rgba(30, 24, 20, 0.28);
  --glass-border: rgba(255, 255, 255, 0.18);
  --glass-highlight: rgba(255, 255, 255, 0.25);
}
```

- [ ] **Step 4: Write `@font-face`** — `src/styles/fonts.css`

```css
@font-face { font-family: "Onest"; font-style: normal; font-weight: 400; font-display: swap;
  src: url("../assets/fonts/Onest-Regular.ttf") format("truetype"); }
@font-face { font-family: "Onest"; font-style: normal; font-weight: 500; font-display: swap;
  src: url("../assets/fonts/Onest-Medium.ttf") format("truetype"); }
@font-face { font-family: "DM Sans"; font-style: normal; font-weight: 400; font-display: swap;
  src: url("../assets/fonts/DMSans-Regular.ttf") format("truetype"); }
@font-face { font-family: "DM Sans"; font-style: normal; font-weight: 500; font-display: swap;
  src: url("../assets/fonts/DMSans-Medium.ttf") format("truetype"); }
```

- [ ] **Step 5: Write global reset/base** — `src/styles/global.css`

```css
@import "./fonts.css";
@import "./tokens.css";

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #root { height: 100%; }
body {
  font-family: var(--font-body);
  color: var(--white);
  background: var(--black);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
a { color: inherit; text-decoration: none; }
button { font: inherit; color: inherit; background: none; border: none; cursor: pointer; }
img, svg, video { display: block; max-width: 100%; }
```

- [ ] **Step 6: Reduced-motion hook** — `src/lib/useReducedMotion.js`

```js
import { useEffect, useState } from "react";

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}
```

- [ ] **Step 7: Router, App, HomePage**

`src/main.jsx`:
```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles/global.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
```

`src/App.jsx`:
```jsx
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}
```

`src/pages/HomePage.jsx` (Hero wired in Task 6; placeholder now):
```jsx
export default function HomePage() {
  return <main data-testid="home" />;
}
```

- [ ] **Step 8: Configure Vitest** — extend `vite.config.js`

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.js",
  },
});
```
`src/test/setup.js`:
```js
import "@testing-library/jest-dom/vitest";

// jsdom lacks matchMedia; provide a non-matching stub by default
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false, media: query, onchange: null,
    addEventListener: () => {}, removeEventListener: () => {},
    addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false,
  });
}
```
Add to `package.json` scripts: `"test": "vitest run"`.

- [ ] **Step 9: Write the failing test** — `src/pages/HomePage.test.jsx`

```jsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "./HomePage.jsx";

test("HomePage renders a home landmark", () => {
  render(<MemoryRouter><HomePage /></MemoryRouter>);
  expect(screen.getByTestId("home")).toBeInTheDocument();
});
```

- [ ] **Step 10: Run tests + dev server**

Run: `npx vitest run src/pages/HomePage.test.jsx`
Expected: PASS.
Run: `npm run dev` and confirm the server boots with no console errors (blank page is fine).

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: scaffold Vite React app with tokens, fonts, assets, test harness"
```

---

### Task 2: GlassSurface component

**Files:**
- Create: `src/components/GlassSurface.jsx`, `src/components/GlassSurface.css`
- Test: `src/components/GlassSurface.test.jsx`

**Interfaces:**
- Produces: `<GlassSurface as="div" className radius blur ...rest>` — renders element `as` (default `div`) with class `glass` + passed `className`, sets `--glass-radius`/`--glass-blur-local` inline from `radius`/`blur` props (defaults 29/29 px), forwards remaining props and children.

- [ ] **Step 1: Write the failing test**

```jsx
import { render, screen } from "@testing-library/react";
import GlassSurface from "./GlassSurface.jsx";

test("renders children inside a .glass element and forwards props", () => {
  render(<GlassSurface data-testid="g" aria-label="panel">hi</GlassSurface>);
  const el = screen.getByTestId("g");
  expect(el).toHaveClass("glass");
  expect(el).toHaveAttribute("aria-label", "panel");
  expect(el).toHaveTextContent("hi");
});

test("renders as a custom element and applies radius var", () => {
  render(<GlassSurface as="nav" radius={40} data-testid="g2">x</GlassSurface>);
  const el = screen.getByTestId("g2");
  expect(el.tagName).toBe("NAV");
  expect(el.style.getPropertyValue("--glass-radius")).toBe("40px");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/GlassSurface.test.jsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement** — `src/components/GlassSurface.jsx`

```jsx
import "./GlassSurface.css";

export default function GlassSurface({
  as: Tag = "div",
  className = "",
  radius = 29,
  blur = 29,
  style,
  children,
  ...rest
}) {
  return (
    <Tag
      className={`glass ${className}`.trim()}
      style={{ "--glass-radius": `${radius}px`, "--glass-blur-local": `${blur}px`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
```
`src/components/GlassSurface.css`:
```css
.glass {
  position: relative;
  border-radius: var(--glass-radius, 29px);
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(var(--glass-blur-local, 29px)) saturate(140%);
  -webkit-backdrop-filter: blur(var(--glass-blur-local, 29px)) saturate(140%);
  box-shadow: inset 0 1px 0 var(--glass-highlight), 0 8px 30px rgba(0, 0, 0, 0.25);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/GlassSurface.test.jsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/GlassSurface.*
git commit -m "feat: add reusable GlassSurface component"
```

---

### Task 3: Button component

**Files:**
- Create: `src/components/Button.jsx`, `src/components/Button.css`
- Test: `src/components/Button.test.jsx`

**Interfaces:**
- Produces: `<Button variant="solid|glass|ghost" onClick>label</Button>` — renders a `<button>` with class `btn btn--{variant}` (default `solid`), forwards `onClick` and other props. `glass` variant wraps content in glass styling directly (no GlassSurface dependency needed).

- [ ] **Step 1: Write the failing test**

```jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "./Button.jsx";

test("renders label and variant class, handles click", async () => {
  const onClick = vi.fn();
  render(<Button variant="glass" onClick={onClick}>Create Account</Button>);
  const btn = screen.getByRole("button", { name: "Create Account" });
  expect(btn).toHaveClass("btn", "btn--glass");
  await userEvent.click(btn);
  expect(onClick).toHaveBeenCalledOnce();
});

test("defaults to solid variant", () => {
  render(<Button>Go</Button>);
  expect(screen.getByRole("button", { name: "Go" })).toHaveClass("btn--solid");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/Button.test.jsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement** — `src/components/Button.jsx`

```jsx
import "./Button.css";

export default function Button({ variant = "solid", className = "", children, ...rest }) {
  return (
    <button className={`btn btn--${variant} ${className}`.trim()} {...rest}>
      {children}
    </button>
  );
}
```
`src/components/Button.css`:
```css
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  font-family: var(--font-ui); font-weight: 500; font-size: 14px; letter-spacing: -0.02em;
  padding: 9px 20px; border-radius: 999px; white-space: nowrap;
  transition: transform 0.15s ease, background 0.2s ease, opacity 0.2s ease;
}
.btn:hover { transform: translateY(-1px); }
.btn--solid { background: var(--white); color: var(--black); }
.btn--ghost { background: transparent; color: var(--white); }
.btn--glass {
  color: var(--white);
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(20px) saturate(140%);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
  box-shadow: inset 0 1px 0 var(--glass-highlight);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/Button.test.jsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Button.*
git commit -m "feat: add Button component with solid/glass/ghost variants"
```

---

### Task 4: Company menu data + CompanyMenu component (two states)

**Files:**
- Create: `src/data/companyMenu.js`
- Create: `src/sections/Hero/CompanyMenu.jsx`
- Test: `src/sections/Hero/CompanyMenu.test.jsx`
- (Styles for the panel are added inline to `Hero.css` in Task 6; here use classNames only.)

**Interfaces:**
- Consumes: `GlassSurface` (Task 2).
- Produces:
  - `src/data/companyMenu.js` default export `COMPANY_MENU`: array of `{ id, title, subtitle, icon, active?, badge? }`.
  - `<CompanyMenu open onClose />` — when `open` is false renders nothing; when true renders a `role="menu"` glass panel listing all `COMPANY_MENU` items. Each item is a `role="menuitem"` with title, subtitle, `<img>` icon, and a `›` chevron. Item with `active` gets class `menu-item--active`; item with `badge` renders a `<span class="badge">` with the badge text. Calls `onClose` on `Escape` keydown and on outside click.

- [ ] **Step 1: Create menu data** — `src/data/companyMenu.js`

```js
import about from "../assets/icons/nav/about.svg";
import howItWorks from "../assets/icons/nav/how-it-works.svg";
import strategyProviders from "../assets/icons/nav/strategy-providers.svg";
import affiliates from "../assets/icons/nav/affiliates.svg";
import platform from "../assets/icons/nav/platform.svg";
import selectionStandard from "../assets/icons/nav/selection-standard.svg";
import investorsStories from "../assets/icons/nav/investors-stories.svg";

const COMPANY_MENU = [
  { id: "about", title: "About", subtitle: "Company story and mission", icon: about, active: true },
  { id: "how-it-works", title: "How It Works", subtitle: "Simple platform walkthrough", icon: howItWorks },
  { id: "strategy-providers", title: "Strategy Providers", subtitle: "Review selected providers", icon: strategyProviders },
  { id: "affiliates", title: "Affiliates", subtitle: "Partner with us", icon: affiliates },
  { id: "platform", title: "Platform", subtitle: "Explore product features", icon: platform },
  { id: "selection-standard", title: "Selection Standard", subtitle: "See provider criteria", icon: selectionStandard },
  { id: "investors-stories", title: "Investors Stories", subtitle: "Read client experiences", icon: investorsStories, badge: "New" },
];

export default COMPANY_MENU;
```

- [ ] **Step 2: Write the failing test** — `src/sections/Hero/CompanyMenu.test.jsx`

```jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CompanyMenu from "./CompanyMenu.jsx";

test("renders nothing when closed", () => {
  const { container } = render(<CompanyMenu open={false} onClose={() => {}} />);
  expect(container).toBeEmptyDOMElement();
});

test("renders all 7 items with active + badge when open", () => {
  render(<CompanyMenu open onClose={() => {}} />);
  expect(screen.getAllByRole("menuitem")).toHaveLength(7);
  expect(screen.getByText("About").closest(".menu-item")).toHaveClass("menu-item--active");
  expect(screen.getByText("New")).toBeInTheDocument();
  expect(screen.getByText("Read client experiences")).toBeInTheDocument();
});

test("calls onClose on Escape", async () => {
  const onClose = vi.fn();
  render(<CompanyMenu open onClose={onClose} />);
  await userEvent.keyboard("{Escape}");
  expect(onClose).toHaveBeenCalled();
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run src/sections/Hero/CompanyMenu.test.jsx`
Expected: FAIL (module not found).

- [ ] **Step 4: Implement** — `src/sections/Hero/CompanyMenu.jsx`

```jsx
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassSurface from "../../components/GlassSurface.jsx";
import COMPANY_MENU from "../../data/companyMenu.js";

export default function CompanyMenu({ open, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          className="company-menu-wrap"
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <GlassSurface as="ul" role="menu" className="company-menu" radius={20} blur={40}>
            {COMPANY_MENU.map((item) => (
              <li
                key={item.id}
                role="menuitem"
                tabIndex={0}
                className={`menu-item ${item.active ? "menu-item--active" : ""}`.trim()}
              >
                <span className="menu-item__icon">
                  <img src={item.icon} alt="" aria-hidden="true" />
                </span>
                <span className="menu-item__text">
                  <span className="menu-item__title">
                    {item.title}
                    {item.badge && <span className="badge">{item.badge}</span>}
                  </span>
                  <span className="menu-item__subtitle">{item.subtitle}</span>
                </span>
                <span className="menu-item__chevron" aria-hidden="true">›</span>
              </li>
            ))}
          </GlassSurface>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/sections/Hero/CompanyMenu.test.jsx`
Expected: PASS. (framer-motion renders synchronously in jsdom; `AnimatePresence` mounts children immediately when `open`.)

- [ ] **Step 6: Commit**

```bash
git add src/data/companyMenu.js src/sections/Hero/CompanyMenu.*
git commit -m "feat: add CompanyMenu dropdown with two states"
```

---

### Task 5: Header (logo + glass nav pill + auth actions)

**Files:**
- Create: `src/sections/Hero/Header.jsx`
- Test: `src/sections/Hero/Header.test.jsx`

**Interfaces:**
- Consumes: `GlassSurface` (Task 2), `Button` (Task 3), `CompanyMenu` (Task 4), `logo.svg`.
- Produces: `<Header />` — renders `<header>` containing the logo (`<img alt="Levels Socials">`), a glass nav pill with a `Company` toggle button (`aria-expanded`) plus `Blog`, `Help Center`, `Contact` links, a `Login` link, and a glass `Create Account` `Button`. Owns `menuOpen` state; clicking `Company` toggles it and renders `<CompanyMenu open={menuOpen} onClose={...}/>`. The Company button has class `nav-company` and its chevron gets class `is-open` when expanded.

- [ ] **Step 1: Write the failing test** — `src/sections/Hero/Header.test.jsx`

```jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "./Header.jsx";

test("renders logo, nav items and auth actions", () => {
  render(<Header />);
  expect(screen.getByAltText("Levels Socials")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /company/i })).toBeInTheDocument();
  expect(screen.getByText("Blog")).toBeInTheDocument();
  expect(screen.getByText("Help Center")).toBeInTheDocument();
  expect(screen.getByText("Contact")).toBeInTheDocument();
  expect(screen.getByText("Login")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Create Account" })).toBeInTheDocument();
});

test("toggles the Company menu open and closed", async () => {
  render(<Header />);
  const company = screen.getByRole("button", { name: /company/i });
  expect(company).toHaveAttribute("aria-expanded", "false");
  expect(screen.queryByRole("menu")).toBeNull();
  await userEvent.click(company);
  expect(company).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByRole("menu")).toBeInTheDocument();
  await userEvent.click(company);
  expect(screen.queryByRole("menu")).toBeNull();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/sections/Hero/Header.test.jsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement** — `src/sections/Hero/Header.jsx`

```jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import GlassSurface from "../../components/GlassSurface.jsx";
import Button from "../../components/Button.jsx";
import CompanyMenu from "./CompanyMenu.jsx";
import logo from "../../assets/logo.svg";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="hero-header">
      <Link to="/" className="hero-logo">
        <img src={logo} alt="Levels Socials" />
      </Link>

      <div className="nav-center">
        <GlassSurface as="nav" className="nav-pill" radius={22} blur={30}>
          <button
            type="button"
            className="nav-company"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="nav-dot" aria-hidden="true" /> Company
            <span className={`nav-chevron ${menuOpen ? "is-open" : ""}`} aria-hidden="true">⌄</span>
          </button>
          <Link to="/blog">Blog</Link>
          <Link to="/help">Help Center</Link>
          <Link to="/contact">Contact</Link>
        </GlassSurface>
        <CompanyMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>

      <div className="nav-actions">
        <Link to="/login" className="nav-login">Login</Link>
        <Button variant="glass">Create Account</Button>
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/sections/Hero/Header.test.jsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/sections/Hero/Header.*
git commit -m "feat: add Hero Header with glass nav pill and Company toggle"
```

---

### Task 6: Hero layout, video background & styles

**Files:**
- Create: `src/sections/Hero/Hero.jsx`, `src/sections/Hero/Hero.css`
- Modify: `src/pages/HomePage.jsx` (render `<Hero/>`)
- Test: `src/sections/Hero/Hero.test.jsx`

**Interfaces:**
- Consumes: `Header` (Task 5), `hero.mp4`, `hero-poster.jpg`, `arrow-down.svg`, `Button`.
- Produces: `<Hero />` — a `<section class="hero">` containing: background `<video>` (`autoPlay muted playsInline`, **no `loop`**, `poster`, `data-testid="hero-video"`), a `.hero-overlay` gradient, `Header`, an `<h1 class="hero-title">` with the three lines each wrapped in `<span class="hero-line">`, a lower-right `.hero-cta` (paragraph + `Button` "Start with Levels Socials"), and a lower-left `.hero-explore` ("Explore more" + arrow-down icon). Headline lines exposed as separate elements so Task 7 can animate them. `HERO_LINES = ["Social Copy Trading", "Built for Transparency", "and Control"]`.

- [ ] **Step 1: Write the failing test** — `src/sections/Hero/Hero.test.jsx`

```jsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Hero from "./Hero.jsx";

const renderHero = () => render(<MemoryRouter><Hero /></MemoryRouter>);

test("renders headline as three separate lines", () => {
  renderHero();
  const lines = document.querySelectorAll(".hero-line");
  expect(lines).toHaveLength(3);
  expect(lines[0]).toHaveTextContent("Social Copy Trading");
  expect(lines[2]).toHaveTextContent("and Control");
});

test("background video plays once (muted, no loop) with poster", () => {
  renderHero();
  const video = screen.getByTestId("hero-video");
  expect(video).toHaveAttribute("muted");
  expect(video).not.toHaveAttribute("loop");
  expect(video).toHaveAttribute("playsinline");
  expect(video.getAttribute("poster")).toBeTruthy();
});

test("renders CTA button and explore affordance", () => {
  renderHero();
  expect(screen.getByRole("button", { name: "Start with Levels Socials" })).toBeInTheDocument();
  expect(screen.getByText("Explore more")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/sections/Hero/Hero.test.jsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement** — `src/sections/Hero/Hero.jsx`

```jsx
import Header from "./Header.jsx";
import Button from "../../components/Button.jsx";
import heroVideo from "../../assets/hero.mp4";
import heroPoster from "../../assets/hero-poster.jpg";
import arrowDown from "../../assets/icons/arrow-down.svg";
import "./Hero.css";

export const HERO_LINES = ["Social Copy Trading", "Built for Transparency", "and Control"];

export default function Hero() {
  return (
    <section className="hero">
      <video
        className="hero-video"
        data-testid="hero-video"
        src={heroVideo}
        poster={heroPoster}
        autoPlay
        muted
        playsInline
      />
      <div className="hero-overlay" />

      <Header />

      <h1 className="hero-title">
        {HERO_LINES.map((line) => (
          <span className="hero-line" key={line}>{line}</span>
        ))}
      </h1>

      <div className="hero-cta">
        <p className="hero-lead">
          A platform where investors connect to strategy providers and participate in
          their performance, with full data and complete capital control.
        </p>
        <Button variant="solid">Start with Levels Socials</Button>
      </div>

      <a className="hero-explore" href="#next">
        Explore more <img src={arrowDown} alt="" aria-hidden="true" />
      </a>
    </section>
  );
}
```
Note: React drops a bare `muted` prop from the DOM in some versions; the test asserts the attribute. Ensure it renders by keeping `muted` (React 19 forwards it). If the attribute is missing at runtime, set it imperatively via a `ref` in Task 7's effect. For now the JSX above is sufficient for React 19.

- [ ] **Step 4: Write `Hero.css`** (layout + glass nav + menu panel styles)

```css
.hero {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  padding: 32px 120px;
  isolation: isolate;
}
.hero-video {
  position: absolute; inset: 0; width: 100%; height: 100%;
  object-fit: cover; z-index: -2;
}
.hero-overlay {
  position: absolute; inset: 0; z-index: -1;
  background: linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.05) 100%);
}

/* Header */
.hero-header {
  display: grid; grid-template-columns: 1fr auto 1fr; align-items: center;
  gap: 24px;
}
.hero-logo img { height: 24px; }
.nav-center { position: relative; justify-self: center; }
.nav-pill {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 8px; font-family: var(--font-ui); font-size: 14px;
}
.nav-pill a, .nav-company { padding: 6px 14px; border-radius: 999px; color: var(--white); }
.nav-pill a:hover, .nav-company:hover { background: rgba(255,255,255,0.08); }
.nav-company { display: inline-flex; align-items: center; gap: 6px; }
.nav-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); }
.nav-chevron { transition: transform 0.2s ease; }
.nav-chevron.is-open { transform: rotate(180deg); }
.nav-actions { justify-self: end; display: flex; align-items: center; gap: 20px; }
.nav-login { font-family: var(--font-ui); font-size: 14px; }

/* Company dropdown */
.company-menu-wrap { position: absolute; top: calc(100% + 10px); left: 50%; transform: translateX(-50%); width: 360px; z-index: 20; }
.company-menu { list-style: none; padding: 8px; display: flex; flex-direction: column; gap: 2px; }
.menu-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 14px; cursor: pointer; }
.menu-item:hover, .menu-item--active { background: rgba(255,255,255,0.10); }
.menu-item__icon { width: 36px; height: 36px; display: grid; place-items: center; border-radius: 10px; background: rgba(255,255,255,0.10); flex: none; }
.menu-item--active .menu-item__icon { background: var(--accent); }
.menu-item__icon img { width: 18px; height: 18px; }
.menu-item__text { display: flex; flex-direction: column; flex: 1; }
.menu-item__title { display: flex; align-items: center; gap: 8px; font-family: var(--font-heading); font-weight: 500; font-size: 14px; }
.menu-item__subtitle { font-size: 12px; color: rgba(255,255,255,0.6); }
.badge { font-size: 10px; padding: 2px 7px; border-radius: 999px; background: var(--accent); color: var(--black); }
.menu-item__chevron { color: rgba(255,255,255,0.5); }

/* Hero content */
.hero-title {
  position: absolute; left: 120px; top: 200px; max-width: 560px;
  font-family: var(--font-heading); font-weight: 500;
  font-size: 50px; line-height: 54px; letter-spacing: -0.03em;
  display: flex; flex-direction: column;
}
.hero-line { display: block; overflow: hidden; }
.hero-cta { position: absolute; right: 120px; bottom: 70px; width: 372px; display: flex; flex-direction: column; gap: 24px; align-items: flex-start; }
.hero-lead { font-family: var(--font-heading); font-size: 20px; line-height: 26px; letter-spacing: -0.02em; }
.hero-explore { position: absolute; left: 120px; bottom: 70px; display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-ui); font-size: 14px; }
.hero-explore img { width: 16px; height: 16px; }

@media (max-width: 900px) {
  .hero { padding: 20px; }
  .hero-header { grid-template-columns: 1fr auto; }
  .nav-center { display: none; }
  .hero-title { position: static; margin-top: 120px; font-size: 36px; line-height: 40px; }
  .hero-cta, .hero-explore { position: static; width: auto; margin-top: 32px; }
}
```

- [ ] **Step 5: Wire HomePage** — `src/pages/HomePage.jsx`

```jsx
import Hero from "../sections/Hero/Hero.jsx";

export default function HomePage() {
  return (
    <main data-testid="home">
      <Hero />
    </main>
  );
}
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npx vitest run src/sections/Hero/Hero.test.jsx src/pages/HomePage.test.jsx`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/sections/Hero/Hero.* src/pages/HomePage.jsx
git commit -m "feat: add Hero layout with play-once video background"
```

---

### Task 7: Entrance motion (framer-motion, per-line headline)

**Files:**
- Modify: `src/sections/Hero/Hero.jsx`
- Test: `src/sections/Hero/HeroMotion.test.jsx`

**Interfaces:**
- Consumes: `useReducedMotion` (Task 1), `HERO_LINES` (Task 6).
- Produces: Hero wraps its animated groups in `motion` elements with a shared bottom-up variant. Headline uses a container with `staggerChildren` so each `.hero-line` animates independently. When `useReducedMotion()` is true, elements render in their final state (no initial offset). Video gets a `ref`; an effect sets `video.muted = true` and calls `video.play().catch(()=>{})` once on mount to guarantee play-once autoplay across browsers.

- [ ] **Step 1: Write the failing test** — `src/sections/Hero/HeroMotion.test.jsx`

```jsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Hero from "./Hero.jsx";

test("still renders three headline lines after motion wiring", () => {
  render(<MemoryRouter><Hero /></MemoryRouter>);
  expect(document.querySelectorAll(".hero-line")).toHaveLength(3);
  // each line lives inside an animated wrapper
  expect(document.querySelector(".hero-title")).toBeInTheDocument();
});

test("respects reduced motion (renders content, no crash)", () => {
  window.matchMedia = (q) => ({
    matches: true, media: q, addEventListener: () => {}, removeEventListener: () => {},
    addListener: () => {}, removeListener: () => {}, onchange: null, dispatchEvent: () => false,
  });
  render(<MemoryRouter><Hero /></MemoryRouter>);
  expect(screen.getByRole("button", { name: "Start with Levels Socials" })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails/passes appropriately**

Run: `npx vitest run src/sections/Hero/HeroMotion.test.jsx`
Expected: PASS for line-count test even before edits; write it first, then keep green through the refactor. If it fails after edits, the motion wiring broke the DOM — fix before committing.

- [ ] **Step 3: Add motion + video autoplay effect** — edit `src/sections/Hero/Hero.jsx`

```jsx
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "../../lib/useReducedMotion.js";
import Header from "./Header.jsx";
import Button from "../../components/Button.jsx";
import heroVideo from "../../assets/hero.mp4";
import heroPoster from "../../assets/hero-poster.jpg";
import arrowDown from "../../assets/icons/arrow-down.svg";
import "./Hero.css";

export const HERO_LINES = ["Social Copy Trading", "Built for Transparency", "and Control"];

export default function Hero() {
  const reduced = useReducedMotion();
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  const rise = reduced
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : 0.12, delayChildren: reduced ? 0 : 0.15 } },
  };

  const ease = [0.22, 1, 0.36, 1];

  return (
    <section className="hero">
      <video
        ref={videoRef}
        className="hero-video"
        data-testid="hero-video"
        src={heroVideo}
        poster={heroPoster}
        autoPlay
        muted
        playsInline
      />
      <div className="hero-overlay" />

      <Header />

      <motion.h1
        className="hero-title"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {HERO_LINES.map((line) => (
          <span className="hero-line" key={line}>
            <motion.span
              style={{ display: "block" }}
              variants={rise}
              transition={{ duration: 0.6, ease }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </motion.h1>

      <motion.div
        className="hero-cta"
        variants={rise}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.6, ease, delay: reduced ? 0 : 0.55 }}
      >
        <p className="hero-lead">
          A platform where investors connect to strategy providers and participate in
          their performance, with full data and complete capital control.
        </p>
        <Button variant="solid">Start with Levels Socials</Button>
      </motion.div>

      <motion.a
        className="hero-explore"
        href="#next"
        variants={rise}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.6, ease, delay: reduced ? 0 : 0.7 }}
      >
        Explore more <img src={arrowDown} alt="" aria-hidden="true" />
      </motion.a>
    </section>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/sections/Hero/HeroMotion.test.jsx src/sections/Hero/Hero.test.jsx`
Expected: PASS (both files).

- [ ] **Step 5: Commit**

```bash
git add src/sections/Hero/Hero.jsx src/sections/Hero/HeroMotion.test.jsx
git commit -m "feat: add bottom-up entrance motion incl. per-line headline"
```

---

### Task 8: CursorTrail canvas effect

**Files:**
- Create: `src/sections/Hero/CursorTrail.jsx`
- Modify: `src/sections/Hero/Hero.jsx` (mount `<CursorTrail/>`), `src/sections/Hero/Hero.css` (canvas positioning)
- Test: `src/sections/Hero/CursorTrail.test.jsx`

**Interfaces:**
- Consumes: `useReducedMotion` (Task 1).
- Produces: `<CursorTrail />` — a full-parent `<canvas class="cursor-trail" data-testid="cursor-trail">`. On mount (when not reduced-motion and not a coarse pointer) it tracks pointer positions and draws **two** slightly-offset polylines trailing the cursor, opaque/sharp near the head and fading with increasing blur toward the tail, animated via `requestAnimationFrame`. When reduced-motion or `matchMedia("(pointer: coarse)")` matches, it renders the canvas but attaches no listeners and starts no animation loop.

- [ ] **Step 1: Write the failing test** — `src/sections/Hero/CursorTrail.test.jsx`

```jsx
import { render, screen } from "@testing-library/react";
import CursorTrail from "./CursorTrail.jsx";

test("renders a canvas overlay", () => {
  render(<CursorTrail />);
  expect(screen.getByTestId("cursor-trail").tagName).toBe("CANVAS");
});

test("does not attach pointer listeners under reduced motion", () => {
  window.matchMedia = (q) => ({
    matches: true, media: q, addEventListener: () => {}, removeEventListener: () => {},
    addListener: () => {}, removeListener: () => {}, onchange: null, dispatchEvent: () => false,
  });
  const addSpy = vi.spyOn(window, "addEventListener");
  render(<CursorTrail />);
  const pointerMoves = addSpy.mock.calls.filter(([type]) => type === "pointermove");
  expect(pointerMoves).toHaveLength(0);
  addSpy.mockRestore();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/sections/Hero/CursorTrail.test.jsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement** — `src/sections/Hero/CursorTrail.jsx`

```jsx
import { useEffect, useRef } from "react";
import { useReducedMotion } from "../../lib/useReducedMotion.js";

const MAX_POINTS = 22;   // trail length (history samples)
const OFFSET = 5;        // px separation between the two lines

export default function CursorTrail() {
  const canvasRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const coarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    if (reduced || coarse) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const parent = canvas.parentElement;
    let raf = 0;
    const points = []; // {x, y}

    const resize = () => {
      const r = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      canvas.style.width = `${r.width}px`;
      canvas.style.height = `${r.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (e) => {
      const r = parent.getBoundingClientRect();
      points.push({ x: e.clientX - r.left, y: e.clientY - r.top });
      while (points.length > MAX_POINTS) points.shift();
    };

    // Draw one fading/blurring polyline offset perpendicular to travel direction.
    const drawLine = (sign) => {
      for (let i = 1; i < points.length; i++) {
        const p0 = points[i - 1];
        const p1 = points[i];
        const t = i / points.length;              // 0 tail → 1 head
        const dx = p1.x - p0.x, dy = p1.y - p0.y;
        const len = Math.hypot(dx, dy) || 1;
        const nx = (-dy / len) * OFFSET * sign;   // perpendicular offset
        const ny = (dx / len) * OFFSET * sign;
        ctx.beginPath();
        ctx.moveTo(p0.x + nx, p0.y + ny);
        ctx.lineTo(p1.x + nx, p1.y + ny);
        ctx.lineCap = "round";
        ctx.lineWidth = 0.5 + t * 1.5;            // thinner at tail
        ctx.strokeStyle = `rgba(255,255,255,${t * 0.9})`; // fade toward tail
        ctx.shadowBlur = (1 - t) * 8;             // blur toward tail
        ctx.shadowColor = "rgba(255,255,255,0.6)";
        ctx.stroke();
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (points.length > 1) { drawLine(1); drawLine(-1); }
      if (points.length) points.shift(); // trail decays when the mouse stops
      raf = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduced]);

  return <canvas ref={canvasRef} className="cursor-trail" data-testid="cursor-trail" aria-hidden="true" />;
}
```

- [ ] **Step 4: Mount in Hero + style the canvas**

In `src/sections/Hero/Hero.jsx`, import and render `<CursorTrail />` as the last child inside `<section className="hero">`:
```jsx
import CursorTrail from "./CursorTrail.jsx";
// ...
      </motion.a>
      <CursorTrail />
    </section>
```
Add to `src/sections/Hero/Hero.css`:
```css
.cursor-trail { position: absolute; inset: 0; z-index: 5; pointer-events: none; }
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/sections/Hero/CursorTrail.test.jsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/sections/Hero/CursorTrail.jsx src/sections/Hero/Hero.jsx src/sections/Hero/Hero.css
git commit -m "feat: add canvas cursor-trail effect (two fading/blurring lines)"
```

---

### Task 9: Full-suite run + visual verification against Figma

**Files:**
- Modify: any of the above as needed to match the design.

- [ ] **Step 1: Run the full test suite**

Run: `npm run test`
Expected: all tests PASS.

- [ ] **Step 2: Build sanity check**

Run: `npm run build`
Expected: build completes with no errors.

- [ ] **Step 3: Visual verification (manual, against Figma)**

Run: `npm run dev`, open the app, and compare to the two Figma states:
- Default: [`548-9533`](https://www.figma.com/design/UQCKaa4bTakuFG2UdfW8C9/Levels-Socials-Web-Working?node-id=548-9533)
- Expanded menu: [`801-15552`](https://www.figma.com/design/UQCKaa4bTakuFG2UdfW8C9/Levels-Socials-Web-Working?node-id=801-15552)

Checklist:
- [ ] Video autoplays once (muted), holds last frame; poster shows before load.
- [ ] Glass visible on nav pill, dropdown panel, and Create Account button.
- [ ] Headline reveals line-by-line, bottom-up; CTA + Explore follow in stagger.
- [ ] Clicking "Company" opens the 7-item panel; About active; New badge present; chevron flips; closes on outside click / Esc.
- [ ] Moving the mouse draws two fading, blurring trailing lines; default cursor stays.
- [ ] Layout does not break at ~900px wide.
- [ ] With OS "reduce motion" on: no entrance motion, no cursor trail.

Fix any visual mismatches (spacing, colors, sizes) directly in `Hero.css` / component files, keeping tests green.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: polish Hero to match Figma; full suite green"
```

---

## Self-Review Notes

- **Spec coverage:** scaffold/tokens/fonts (T1), reusable glass (T2) + button (T3), two-state menu (T4), header (T5), play-once video + layout (T6), bottom-up + per-line motion (T7), cursor trail (T8), reduced-motion in T1/T7/T8, visual verification (T9). All spec sections mapped.
- **Types consistent:** `GlassSurface` props (`as/radius/blur`), `COMPANY_MENU` shape, `HERO_LINES`, `useReducedMotion()` used identically across tasks.
- **No placeholders:** every code step contains full, runnable code.
- **Known risk:** React's handling of the bare `muted` attribute — mitigated by the imperative `video.muted = true; video.play()` effect in T7.
