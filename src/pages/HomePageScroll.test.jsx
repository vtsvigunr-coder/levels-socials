import { act, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "./HomePage.jsx";

// The scroll state machine (hero -> hijacked zone -> released native scroll)
// drives every section's position on the page and has no other coverage, so
// its transitions are pinned down here rather than left to manual scrolling.

// Faking rAF alongside the timers lets the wheel batching below be advanced
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
  return {
    container,
    unmount,
    stage: () => screen.getByTestId("home").getAttribute("data-stage"),
    // The Providers carousel is what the first stretch of scrolling drives.
    track: () => container.querySelector(".providers__track").style.transform,
  };
}

// Deltas are batched into one requestAnimationFrame callback, so a tick only
// lands once a frame has been allowed to run.
function wheel(deltaY, times = 1) {
  act(() => {
    for (let i = 0; i < times; i++) {
      window.dispatchEvent(new WheelEvent("wheel", { deltaY, bubbles: true, cancelable: true }));
    }
    vi.advanceTimersByTime(20);
  });
}

const clearLock = () => act(() => { vi.advanceTimersByTime(1000); });

test("starts on the hero with native scroll locked out", () => {
  const { stage } = renderHome();
  expect(stage()).toBe("0");
  expect(document.body.style.overflow).toBe("hidden");
});

test("a wheel-down enters the hijacked scroll zone", () => {
  const { stage } = renderHome();
  wheel(50);
  expect(stage()).toBe("1");
});

test("a burst of wheel events in one frame applies their sum, once", () => {
  // 10 small events inside a single frame must land exactly where one event
  // carrying the same total delta lands — that is what batching guarantees.
  // Each page is torn down before the next renders: they both listen on
  // `window`, so a live leftover would receive the other's wheel events too.
  const measure = (deltaY, times) => {
    const home = renderHome();
    wheel(50);
    clearLock();
    wheel(deltaY, times);
    const at = home.track();
    home.unmount();
    return at;
  };

  const burst = measure(45, 10);
  const single = measure(450, 1);

  expect(burst).toBe(single);
  expect(burst).not.toBe("translate3d(0px,0,0)"); // it did move
});

test("scrolling past the last stage releases into native scroll for CTA + Footer", () => {
  const { stage } = renderHome();
  wheel(50);
  clearLock();
  for (let i = 0; i < 200; i++) wheel(500);

  expect(stage()).toBe("2");
  expect(document.body.style.overflow).toBe(""); // handed back to the browser
});

test("scrolling up at the top of the released area re-enters the hijack", () => {
  const { stage } = renderHome();
  wheel(50);
  clearLock();
  for (let i = 0; i < 200; i++) wheel(500);
  expect(stage()).toBe("2");

  window.scrollY = 0;
  wheel(-500);
  expect(stage()).toBe("1");
  expect(document.body.style.overflow).toBe("hidden");
});

test("Back to top from the footer returns to the hero", () => {
  const { stage } = renderHome();
  wheel(50);
  clearLock();
  for (let i = 0; i < 200; i++) wheel(500);
  expect(stage()).toBe("2");

  act(() => { screen.getByRole("button", { name: /back to top/i }).click(); });
  expect(stage()).toBe("0");
});
