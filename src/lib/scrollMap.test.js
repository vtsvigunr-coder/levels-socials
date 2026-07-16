import { mapScroll, TOTAL_SCROLL } from "./scrollMap.js";

test("the segment table adds up to the advertised total", () => {
  expect(TOTAL_SCROLL).toBe(17000);
});

test("at the very top, only the hero is showing", () => {
  expect(mapScroll(0)).toEqual({
    heroExit: 0,
    vScroll: 0,
    hProviders: 0,
    hSelection: 0,
    hGetStarted: 0,
    hWhyLevels: 0,
  });
});

test("the hero dissolves over its own 900px, before anything else moves", () => {
  expect(mapScroll(450).heroExit).toBeCloseTo(0.5);
  expect(mapScroll(450).vScroll).toBe(0);
  expect(mapScroll(450).hProviders).toBe(0);
  expect(mapScroll(900).heroExit).toBe(1);
});

test("Providers sweeps horizontally while the vertical position holds at 0", () => {
  expect(mapScroll(1350).hProviders).toBeCloseTo(0.5);
  expect(mapScroll(1350).vScroll).toBe(0);
  expect(mapScroll(1800).hProviders).toBe(1);
  expect(mapScroll(1800).vScroll).toBe(0);
});

test("vertical scroll resumes only once Providers is fully swept", () => {
  expect(mapScroll(2700).vScroll).toBeCloseTo(1); // halfway through 0 -> 2
  expect(mapScroll(2700).hProviders).toBe(1); // stays swept behind us
  expect(mapScroll(3600).vScroll).toBe(2);
});

test("a horizontal sub-phase pins its own stage index and leaves later ones alone", () => {
  const s = mapScroll(4300); // mid Selection Standard sweep
  expect(s.vScroll).toBe(2);
  expect(s.hSelection).toBeCloseTo(0.5);
  expect(s.hGetStarted).toBe(0);
  expect(s.hWhyLevels).toBe(0);
});

test("a stage's horizontal sweep reads 0 until its stage is actually reached", () => {
  // Regression guard: a naive implementation that applies every segment would
  // let a later segment's stage index leak backwards into vScroll.
  expect(mapScroll(2700).hSelection).toBe(0);
  expect(mapScroll(2700).vScroll).toBeCloseTo(1);
  expect(mapScroll(9000).hGetStarted).toBe(0);
  expect(mapScroll(9000).hWhyLevels).toBe(0);
});

test("Explore Platform and How it Works span one continuous vertical run", () => {
  expect(mapScroll(5000).vScroll).toBe(2);
  expect(mapScroll(5900).vScroll).toBeCloseTo(3);
  expect(mapScroll(9500).vScroll).toBeCloseTo(7);
  expect(mapScroll(10400).vScroll).toBe(8);
});

test("Get Started sweeps horizontally at stage 8", () => {
  expect(mapScroll(11000).vScroll).toBe(8);
  expect(mapScroll(11000).hGetStarted).toBeCloseTo(0.5);
  expect(mapScroll(11600).hGetStarted).toBe(1);
});

test("Why Levels sweeps horizontally at stage 9", () => {
  expect(mapScroll(12500).vScroll).toBe(9);
  expect(mapScroll(13400).hWhyLevels).toBeCloseTo(0.5);
  expect(mapScroll(14300).hWhyLevels).toBe(1);
});

test("the tail runs Testimonials -> FAQ -> CTA", () => {
  expect(mapScroll(15200).vScroll).toBeCloseTo(10);
  expect(mapScroll(16100).vScroll).toBeCloseTo(11);
  expect(mapScroll(TOTAL_SCROLL).vScroll).toBe(12);
});

test("scroll past the end of the track clamps instead of overshooting", () => {
  const end = mapScroll(TOTAL_SCROLL);
  expect(mapScroll(TOTAL_SCROLL + 5000)).toEqual(end);
  expect(end.vScroll).toBe(12);
  expect(end.hWhyLevels).toBe(1);
});

test("negative scroll (rubber-banding at the top) clamps to the hero", () => {
  expect(mapScroll(-500)).toEqual(mapScroll(0));
});

test("vScroll never moves backwards as you scroll down", () => {
  let previous = -1;
  for (let y = 0; y <= TOTAL_SCROLL; y += 100) {
    const { vScroll } = mapScroll(y);
    expect(vScroll).toBeGreaterThanOrEqual(previous);
    previous = vScroll;
  }
});

test("every horizontal sweep is monotonic too, and each ends fully swept", () => {
  const keys = ["hProviders", "hSelection", "hGetStarted", "hWhyLevels"];
  const previous = { hProviders: -1, hSelection: -1, hGetStarted: -1, hWhyLevels: -1 };
  for (let y = 0; y <= TOTAL_SCROLL; y += 100) {
    const state = mapScroll(y);
    for (const key of keys) {
      expect(state[key]).toBeGreaterThanOrEqual(previous[key]);
      expect(state[key]).toBeLessThanOrEqual(1);
      previous[key] = state[key];
    }
  }
  for (const key of keys) expect(previous[key]).toBe(1);
});
