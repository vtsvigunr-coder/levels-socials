import { useEffect, useState } from "react";

// Read on the first render rather than settled by the mount effect: starting at
// `false` means one render's worth of motion set up for someone who asked for
// none, and the pieces that key off this (Lenis above all) are built and torn
// down again for nothing.
const prefersReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useReducedMotion() {
  const [reduced, setReduced] = useState(prefersReduced);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}
