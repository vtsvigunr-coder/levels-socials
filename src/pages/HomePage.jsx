import { useEffect, useRef, useState } from "react";
import BackgroundVideo from "../sections/Hero/BackgroundVideo.jsx";
import Hero from "../sections/Hero/Hero.jsx";
import ProvidersSection from "../sections/Providers/ProvidersSection.jsx";
import KeyNumbersSection from "../sections/KeyNumbers/KeyNumbersSection.jsx";
import SelectionStandardSection from "../sections/SelectionStandard/SelectionStandardSection.jsx";
import ExplorePlatformSlide from "../sections/ExplorePlatform/ExplorePlatformSlide.jsx";
import HowItWorksSection from "../sections/HowItWorks/HowItWorksSection.jsx";
import GetStartedSection from "../sections/HowItWorks/GetStartedSection.jsx";
import EXPLORE_PLATFORM_SLIDES from "../data/explorePlatform.js";
import "./HomePage.css";

const LOCK_MS = 900; // debounce only for the hero <-> scroll-zone jump
const ENTER_THRESHOLD = 6; // wheel/touch deadband before that jump fires
const V_RANGE = 900; // accumulated px of scroll per vertical section (Providers/Key Numbers/Selection Standard)
const H_RANGE = 1400; // accumulated px of scroll to sweep all horizontal slides in Selection Standard
const PROVIDERS_H_RANGE = 900; // accumulated px of scroll to sweep Providers' cards + closing CTA
const GET_STARTED_H_RANGE = 1200; // accumulated px of scroll to sweep the 3 Get Started steps
const PROVIDERS_STAGE = 0; // Providers' index — also has a horizontal sub-phase
const SELECTION_STAGE = 2; // Selection Standard's index — the other stage with a horizontal sub-phase
const HOW_IT_WORKS_STAGE = 7; // "How it Works" intro — appears after the last Explore Platform card
const GET_STARTED_STAGE = 8; // "How to Get Started" step circle — right after the intro; also has a horizontal sub-phase
const V_MAX = 8; // 0 Providers, 1 Key Numbers, 2 Selection Standard, 3-6 Explore Platform cards, 7-8 How it Works

// Clamped "how far past/before this stage" -> a -1..1 offset, used to slide a
// section fully in (0), fully below (1) or fully above/out (-1) the viewport.
const rel = (p, stageIndex) => Math.min(1, Math.max(-1, p - stageIndex));

export default function HomePage() {
  const [stage, setStage] = useState(0); // 0 = hero, 1 = scroll zone (vertical + horizontal)
  const [vScroll, setVScroll] = useState(0); // 0..2, continuous position across Providers/Key Numbers/Selection Standard
  const [hScroll, setHScroll] = useState(0); // 0..1, horizontal position inside Selection Standard
  const [hScrollProviders, setHScrollProviders] = useState(0); // 0..1, horizontal position inside Providers
  const [hScrollGetStarted, setHScrollGetStarted] = useState(0); // 0..1, horizontal position inside Get Started
  const stageRef = useRef(0);
  const vRef = useRef(0);
  const hRef = useRef(0);
  const hProvidersRef = useRef(0);
  const hGetStartedRef = useRef(0);
  const lockedRef = useRef(false);

  useEffect(() => { stageRef.current = stage; }, [stage]);
  useEffect(() => { vRef.current = vScroll; }, [vScroll]);
  useEffect(() => { hRef.current = hScroll; }, [hScroll]);
  useEffect(() => { hProvidersRef.current = hScrollProviders; }, [hScrollProviders]);
  useEffect(() => { hGetStartedRef.current = hScrollGetStarted; }, [hScrollGetStarted]);

  useEffect(() => {
    // Hero <-> scroll-zone is still a discrete pinned jump (debounced so one
    // gesture can't skip past it). Once inside the zone, sections never fade
    // or disappear — they just move, continuously, by the exact amount
    // scrolled, like a normal page: no locking, no snapping. Once fully
    // scrolled into Selection Standard (vScroll === 2), further scroll drives
    // its internal horizontal slides instead of scrolling further down.
    const enterZone = () => {
      lockedRef.current = true;
      vRef.current = 0; hRef.current = 0; hProvidersRef.current = 0; hGetStartedRef.current = 0;
      setVScroll(0); setHScroll(0); setHScrollProviders(0); setHScrollGetStarted(0);
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

      // Get Started has its own horizontal sub-phase (the 3-step circle),
      // mirroring Providers' below. Since it sits at V_MAX (the last stage),
      // it can never be overshot from above, so it needs no vertical-snap
      // guard either.
      const inGetStartedHorizontalPhase =
        vRef.current === GET_STARTED_STAGE &&
        (hGetStartedRef.current > 0 || dy > 0) &&
        (dy < 0 || hGetStartedRef.current < 1);
      if (inGetStartedHorizontalPhase) {
        const nextH = Math.min(1, Math.max(0, hGetStartedRef.current + dy / GET_STARTED_H_RANGE));
        if (nextH === hGetStartedRef.current) return;
        hGetStartedRef.current = nextH;
        setHScrollGetStarted(nextH);
        return;
      }

      // Providers has its own horizontal sub-phase (cards + closing CTA), the
      // same shape as Selection Standard's below. Since Providers sits at
      // V_MIN (0), it can never be overshot from below, so — unlike Selection
      // Standard — it needs no extra vertical-snap guard.
      const inProvidersHorizontalPhase =
        vRef.current === PROVIDERS_STAGE &&
        (hProvidersRef.current > 0 || dy > 0) &&
        (dy < 0 || hProvidersRef.current < 1);
      if (inProvidersHorizontalPhase) {
        const nextH = Math.min(1, Math.max(0, hProvidersRef.current + dy / PROVIDERS_H_RANGE));
        if (nextH === hProvidersRef.current) return;
        hProvidersRef.current = nextH;
        setHScrollProviders(nextH);
        return;
      }

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

      let nextV = Math.min(V_MAX, Math.max(0, vRef.current + dy / V_RANGE));

      // SELECTION_STAGE used to double as V_MAX, so the vertical clamp above
      // guaranteed vRef landed exactly on it before Explore Platform existed.
      // Now that V_MAX is well past it, an ordinary scroll delta can step
      // clean over SELECTION_STAGE without ever equaling it, and
      // inHorizontalPhase's exact-equality check above would never fire.
      // Snap to it instead of overshooting, in either direction, whenever
      // that direction's horizontal sweep hasn't finished yet — the leftover
      // delta is dropped for this tick, same as the old hard ceiling did.
      if (dy > 0 && vRef.current < SELECTION_STAGE && nextV > SELECTION_STAGE && hRef.current < 1) {
        nextV = SELECTION_STAGE;
      } else if (dy < 0 && vRef.current > SELECTION_STAGE && nextV < SELECTION_STAGE && hRef.current > 0) {
        nextV = SELECTION_STAGE;
      }

      if (nextV === vRef.current) {
        if (nextV === 0 && dy < -ENTER_THRESHOLD && !lockedRef.current) leaveZone();
        return;
      }
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
  const howItWorksRel = rel(vScroll, HOW_IT_WORKS_STAGE);
  const getStartedRel = rel(vScroll, GET_STARTED_STAGE);

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
        <ProvidersSection progress={hScrollProviders} />
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

      <div
        className="home__stage home__stage--howitworks"
        style={{ zIndex: 10, transform: `translateY(${(-howItWorksRel * 100).toFixed(3)}%)` }}
        aria-hidden={stage === 0 || howItWorksRel >= 1}
      >
        <HowItWorksSection />
      </div>

      <div
        className="home__stage home__stage--howitworks"
        style={{ zIndex: 11, transform: `translateY(${(-getStartedRel * 100).toFixed(3)}%)` }}
        aria-hidden={stage === 0 || getStartedRel >= 1}
      >
        <GetStartedSection progress={hScrollGetStarted} />
      </div>
    </main>
  );
}
