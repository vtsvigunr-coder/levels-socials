import { useEffect, useRef } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

// Lenis eases the real window scroll position rather than replacing it: it takes
// the wheel input, animates window.scrollY towards the target, and fires ordinary
// scroll events on the way. So the page stays driven by src/lib/scrollMap.js off
// window.scrollY exactly as before — the position just arrives smoothed, and
// every scroll-linked transform inherits that for free.
//
// Touch is left alone (syncTouch defaults off): a phone's native scroll already
// has momentum of its own, and doubling it up reads as lag.
export function useSmoothScroll(enabled) {
  const ref = useRef(null);

  useEffect(() => {
    if (!enabled) return undefined;

    const lenis = new Lenis({
      // ~1s to settle, with the last stretch decelerating hard. Slower than this
      // and the 17000px track starts feeling like it is resisting the wheel.
      duration: 1.0,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
    });
    ref.current = lenis;

    let rafId = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    });

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      ref.current = null;
    };
  }, [enabled]);

  return ref;
}

// The one way to move the page programmatically. While Lenis is running it owns
// the scroll position and rewrites it every frame, so a native
// `window.scrollTo({behavior:"smooth"})` would be fought and dropped; when Lenis
// is off (reduced motion), the native call is all there is.
export function scrollToY(lenis, top, { immediate = false } = {}) {
  if (lenis) lenis.scrollTo(top, { immediate });
  else window.scrollTo({ top, behavior: immediate ? "instant" : "smooth" });
}
