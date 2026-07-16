import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "./HomePage.jsx";
import { TOTAL_SCROLL } from "../lib/scrollMap.js";

// scrollMap.test.js pins down the timeline arithmetic on its own. What's left to
// cover here is the wiring: that a native scroll event reaches the page, lands
// once per frame, and moves what it should.

// Faking rAF alongside the timers lets the per-frame batching below be advanced
// deterministically instead of waiting on real vsync.
const FAKE = ["requestAnimationFrame", "cancelAnimationFrame", "setTimeout", "clearTimeout", "Date"];

beforeEach(() => {
  vi.useFakeTimers({ toFake: FAKE });
  window.scrollTo = vi.fn();
  Object.defineProperty(window, "scrollY", { value: 0, writable: true, configurable: true });
});
afterEach(() => vi.useRealTimers());

function renderHome() {
  const { container, unmount } = render(<MemoryRouter><HomePage /></MemoryRouter>);
  const home = () => screen.getByTestId("home");
  return {
    container,
    unmount,
    home,
    heroExit: () => Number(home().style.getPropertyValue("--hero-exit")),
    heroExited: () => home().getAttribute("data-hero-exited"),
    // The Providers carousel is what the first stretch of scrolling drives.
    track: () => container.querySelector(".providers__track").style.transform,
  };
}

// Scroll events are batched into one requestAnimationFrame callback, so a
// position only lands once a frame has been allowed to run.
function scrollTo(y, { events = 1 } = {}) {
  act(() => {
    window.scrollY = y;
    for (let i = 0; i < events; i++) {
      window.dispatchEvent(new Event("scroll"));
    }
    vi.advanceTimersByTime(20);
  });
}

test("starts on the hero, and never takes native scroll away from the browser", () => {
  const { heroExit, heroExited } = renderHome();
  expect(heroExit()).toBe(0);
  expect(heroExited()).toBe("false");
  expect(document.body.style.overflow).toBe("");
});

test("the track is as tall as the scroll timeline it drives", () => {
  const { container } = renderHome();
  expect(container.querySelector(".home__track").style.height).toBe(`calc(${TOTAL_SCROLL}px + 100vh)`);
});

test("scrolling drives the hero's exit, and hands off at the halfway point", () => {
  const { heroExit, heroExited } = renderHome();

  scrollTo(225);
  expect(heroExit()).toBeCloseTo(0.25);
  expect(heroExited()).toBe("false");

  scrollTo(900);
  expect(heroExit()).toBe(1);
  expect(heroExited()).toBe("true");
});

// Resting halfway through the hero's dissolve isn't a state the page offers, so
// a stopped scroll inside that segment settles to whichever end is nearer.
// Nothing outside the segment may ever be touched.
describe("the hero boundary settles once scrolling stops", () => {
  const settle = () => act(() => { vi.advanceTimersByTime(200); });

  test("a stop just past the start falls back to the hero", () => {
    renderHome();
    scrollTo(300);
    settle();
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  test("a stop past halfway carries on to Providers", () => {
    renderHome();
    scrollTo(600);
    settle();
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 900, behavior: "smooth" });
  });

  test("it waits for the scroll to stop rather than fighting it", () => {
    renderHome();
    scrollTo(300);
    act(() => { vi.advanceTimersByTime(100); }); // still moving
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  test("it never touches a scroll outside the hero's segment", () => {
    renderHome();
    scrollTo(7000);
    settle();
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  test("it leaves both ends of the segment alone", () => {
    renderHome();
    scrollTo(0);
    settle();
    scrollTo(900);
    settle();
    expect(window.scrollTo).not.toHaveBeenCalled();
  });
});

test("scrolling past the hero drives the Providers carousel", () => {
  const { track } = renderHome();
  const atRest = track();

  scrollTo(1350); // halfway through Providers' horizontal sweep

  expect(track()).not.toBe(atRest);
});

test("many scroll events in one frame land once, at the final position", () => {
  // A burst of events inside a single frame must leave the page exactly where a
  // single event for the same position leaves it — that is what batching buys.
  // Each page is torn down before the next renders: they both listen on
  // `window`, so a live leftover would receive the other's scroll events too.
  const measure = (events) => {
    const home = renderHome();
    scrollTo(1350, { events });
    const at = home.track();
    home.unmount();
    return at;
  };

  expect(measure(10)).toBe(measure(1));
});

test("the far end of the track rests on the CTA", () => {
  const { container } = renderHome();
  scrollTo(TOTAL_SCROLL);

  const cta = container.querySelector(".home__stage--cta");
  expect(cta.getAttribute("aria-hidden")).toBe("false");
  expect(cta.style.transform).toBe("translateY(0.000%)");
});

test("overscrolling past the end of the track changes nothing", () => {
  const { container } = renderHome();
  scrollTo(TOTAL_SCROLL);
  const atEnd = container.querySelector(".home__stage--cta").style.transform;

  scrollTo(TOTAL_SCROLL + 5000);

  expect(container.querySelector(".home__stage--cta").style.transform).toBe(atEnd);
});

test("the footer stays outside the track, on ordinary scroll", () => {
  const { container } = renderHome();
  expect(container.querySelector(".home__track .footer")).toBeNull();
  expect(container.querySelector(".footer")).not.toBeNull();
});

test("Back to top from the footer scrolls the page home", () => {
  renderHome();
  scrollTo(TOTAL_SCROLL);

  act(() => { screen.getByRole("button", { name: /back to top/i }).click(); });

  expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "instant" });
});
