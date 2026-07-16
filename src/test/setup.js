import "@testing-library/jest-dom/vitest";

// jsdom lacks ResizeObserver, which Lenis measures the viewport with. Nothing in
// jsdom ever resizes, so a stub that observes and reports nothing is honest.
if (!window.ResizeObserver) {
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// jsdom lacks matchMedia; provide a non-matching stub by default
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false, media: query, onchange: null,
    addEventListener: () => {}, removeEventListener: () => {},
    addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false,
  });
}
