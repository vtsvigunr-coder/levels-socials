import { useEffect, useRef, useState } from "react";
import BackgroundVideo from "../sections/Hero/BackgroundVideo.jsx";
import Hero from "../sections/Hero/Hero.jsx";
import ProvidersSection from "../sections/Providers/ProvidersSection.jsx";
import KeyNumbersSection from "../sections/KeyNumbers/KeyNumbersSection.jsx";
import SelectionStandardSection from "../sections/SelectionStandard/SelectionStandardSection.jsx";
import ExplorePlatformSlide from "../sections/ExplorePlatform/ExplorePlatformSlide.jsx";
import EXPLORE_PLATFORM_SLIDES from "../data/explorePlatform.js";
import "./HomePage.css";

const LOCK_MS = 900; // debounce only for the hero <-> scroll-zone jump
const ENTER_THRESHOLD = 6; // wheel/touch deadband before that jump fires
const V_RANGE = 900; // accumulated px of scroll per vertical section (Providers/Key Numbers/Selection Standard)
const H_RANGE = 1400; // accumulated px of scroll to sweep all horizontal slides in Selection Standard
const SELECTION_STAGE = 2; // Selection Standard's index — the one stage with a horizontal sub-phase
const V_MAX = 6; // 0 Providers, 1 Key Numbers, 2 Selection Standard, 3-6 Explore Platform cards
const PROVIDERS_GATE_COUNT = 2; // forward scrolls absorbed on Providers before the 3rd hands off to vertical scroll

// Clamped "how far past/before this stage" -> a -1..1 offset, used to slide a
// section fully in (0), fully below (1) or fully above/out (-1) the viewport.
const rel = (p, stageIndex) => Math.min(1, Math.max(-1, p - stageIndex));

export default function HomePage() {
  const [stage, setStage] = useState(0); // 0 = hero, 1 = scroll zone (vertical + horizontal)
  const [vScroll, setVScroll] = useState(0); // 0..2, continuous position across Providers/Key Numbers/Selection Standard
  const [hScroll, setHScroll] = useState(0); // 0..1, horizontal position inside Selection Standard
  const stageRef = useRef(0);
  const vRef = useRef(0);
  const hRef = useRef(0);
  const lockedRef = useRef(false);
  const providersGateRef = useRef(0); // forward scrolls consumed on Providers since it last appeared

  useEffect(() => { stageRef.current = stage; }, [stage]);
  useEffect(() => { vRef.current = vScroll; }, [vScroll]);
  useEffect(() => { hRef.current = hScroll; }, [hScroll]);

  useEffect(() => {
    // Hero <-> scroll-zone is still a discrete pinned jump (debounced so one
    // gesture can't skip past it). Once inside the zone, sections never fade
    // or disappear — they just move, continuously, by the exact amount
    // scrolled, like a normal page: no locking, no snapping. Once fully
    // scrolled into Selection Standard (vScroll === 2), further scroll drives
    // its internal horizontal slides instead of scrolling further down.
    const enterZone = () => {
      lockedRef.current = true;
      vRef.current = 0; hRef.current = 0;
      providersGateRef.current = 0;
      setVScroll(0); setHScroll(0);
      setStage(1);
      setTimeout(() => { lockedRef.current = false; }, LOCK_MS);
    };
    const leaveZone = () => {
      lockedRef.current = true;
      setStage(0);
      setTimeout(() => { lockedRef.current = false; }, LOCK_MS);
    };

    const applyDelta = (dy) => {
      if (stageRef.current === 0) {
        if (lockedRef.current) return;
        if (dy > ENTER_THRESHOLD) enterZone();
        return;
      }
      // Ignore the trailing momentum of the gesture that just entered the
      // zone, so the next section only starts moving on a distinct, later
      // scroll — not as a continuation of the same fling that revealed it.
      if (lockedRef.current) return;

      // Horizontal phase only applies to Selection Standard itself; once its
      // slides are fully swept (hRef === 1), forward scroll falls through to
      // the normal vertical branch below and continues into Explore Platform.
      const inHorizontalPhase =
        vRef.current === SELECTION_STAGE &&
        (hRef.current > 0 || dy > 0) &&
        (dy < 0 || hRef.current < 1);
      if (inHorizontalPhase) {
        // Horizontal phase: scrolling further down sweeps Selection Standard's
        // slides; scrolling up drains it back to 0 before handing control
        // back to the vertical scroll above.
        const nextH = Math.min(1, Math.max(0, hRef.current + dy / H_RANGE));
        if (nextH === hRef.current) return;
        hRef.current = nextH;
        setHScroll(nextH);
        return;
      }

      // Providers (vRef at exactly 0): the first couple of forward scrolls are
      // absorbed instead of moving on immediately — only the next one after
      // that hands off to the vertical scroll toward Key Numbers.
      if (vRef.current === 0 && dy > ENTER_THRESHOLD && providersGateRef.current < PROVIDERS_GATE_COUNT) {
        providersGateRef.current += 1;
        return;
      }

      const nextV = Math.min(V_MAX, Math.max(0, vRef.current + dy / V_RANGE));
      if (nextV === vRef.current) {
        if (nextV === 0 && dy < -ENTER_THRESHOLD && !lockedRef.current) leaveZone();
        return;
      }
      if (nextV === 0) providersGateRef.current = 0;
      vRef.current = nextV;
      setVScroll(nextV);
    };

    const onWheel = (e) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      applyDelta(e.deltaY);
    };

    let touchY = null;
    const onTouchStart = (e) => { touchY = e.touches[0].clientY; };
    const onTouchMove = (e) => {
      if (touchY == null) return;
      const y = e.touches[0].clientY;
      const dy = touchY - y;
      touchY = y;
      applyDelta(dy * 2.2); // touch moves are smaller per-event than wheel ticks
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  const knActive = rel(vScroll, 1) > -0.88 && vScroll < 1.9;
  const selectionActive = vScroll > 1.5;
  const bgRel = rel(vScroll, 0);
  const providersRel = rel(vScroll, 0);
  const keynumbersRel = rel(vScroll, 1);
  const selectionRel = rel(vScroll, 2);
  const explorePlatformStages = [3, 4, 5, 6].map((stageIndex, i) => ({
    stageIndex,
    slide: EXPLORE_PLATFORM_SLIDES[i],
    rel: rel(vScroll, stageIndex),
    active: vScroll > stageIndex - 0.5,
  }));

  return (
    <main
      className="home"
      data-testid="home"
      data-stage={stage}
      data-kn-active={knActive ? "true" : "false"}
    >
      {/* Video + overlay move together with Providers (same translateY) instead
          of staying pinned while its content scrolls away underneath it. */}
      <div
        className="home__bg"
        style={{ transform: `translateY(${(-bgRel * 100).toFixed(3)}%)` }}
      >
        <BackgroundVideo blurred={stage === 1} />
        <div className="home__overlay" />
      </div>

      <div className="home__stage home__stage--hero" aria-hidden={stage !== 0}>
        <Hero />
      </div>

      <div
        className="home__stage home__stage--providers"
        style={{ transform: `translateY(${(-providersRel * 100).toFixed(3)}%)` }}
        aria-hidden={stage === 0 || providersRel >= 1}
      >
        <ProvidersSection />
      </div>

      <div
        className="home__stage home__stage--keynumbers"
        style={{ transform: `translateY(${(-keynumbersRel * 100).toFixed(3)}%)` }}
        aria-hidden={stage === 0 || Math.abs(keynumbersRel) >= 1}
      >
        <KeyNumbersSection />
      </div>

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
