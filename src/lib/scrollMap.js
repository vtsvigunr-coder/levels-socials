// The homepage's entire scroll timeline, as data.
//
// Every section's position is derived from window.scrollY by mapScroll below —
// nothing is accumulated, so there is no state to drift, lock, or debounce. The
// order mirrors how the page reads: arrive at a section, sweep its horizontal
// sub-phase if it has one, then advance vertically to the next.
//
// Stage indices: 0 Providers, 1 Key Numbers, 2 Selection Standard,
// 3-6 Explore Platform, 7 How it Works, 8 Get Started, 9 Why Levels Socials,
// 10 Testimonials, 11 FAQ, 12 CTA.

// The hero's segment, exported so the scroll-snap marker that ends it is placed
// from the same number the timeline is built from.
export const HERO_EXIT_PX = 900;

const SEGMENTS = [
  { px: HERO_EXIT_PX, hero: true }, //               hero dissolves, Providers fades in
  { px: 900, h: "hProviders" }, //                   Providers' cards + closing CTA
  { px: 1800, vFrom: 0, vTo: 2 }, //                 -> Key Numbers -> Selection Standard
  { px: 1400, h: "hSelection" }, //                  Selection Standard's slides
  { px: 5400, vFrom: 2, vTo: 8 }, //                 -> Explore Platform x4 -> How it Works -> Get Started
  { px: 1200, h: "hGetStarted" }, //                 Get Started's 3 steps
  { px: 900, vFrom: 8, vTo: 9 }, //                  -> Why Levels Socials
  { px: 1800, h: "hWhyLevels" }, //                  Why Levels Socials' 3 cards
  { px: 2700, vFrom: 9, vTo: 12 }, //                -> Testimonials -> FAQ -> CTA
];

export const TOTAL_SCROLL = SEGMENTS.reduce((total, segment) => total + segment.px, 0);

const clamp01 = (n) => Math.min(1, Math.max(0, n));

// scrollY -> where every section sits. Pure: no DOM, no events, no history.
export function mapScroll(scrollY) {
  const y = Math.min(TOTAL_SCROLL, Math.max(0, scrollY));
  const state = {
    heroExit: 0,
    vScroll: 0,
    hProviders: 0,
    hSelection: 0,
    hGetStarted: 0,
    hWhyLevels: 0,
  };

  let start = 0;
  for (const segment of SEGMENTS) {
    // Bail at the first segment we haven't reached. Segments behind us settle at
    // t=1 and stay applied; applying the ones ahead too would let their starting
    // stage index leak backwards into vScroll.
    if (y <= start) break;
    const t = clamp01((y - start) / segment.px);
    if (segment.hero) state.heroExit = t;
    else if (segment.h) state[segment.h] = t;
    else state.vScroll = segment.vFrom + t * (segment.vTo - segment.vFrom);
    start += segment.px;
  }

  return state;
}
