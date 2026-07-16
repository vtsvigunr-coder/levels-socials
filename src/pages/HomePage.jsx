import { useCallback, useEffect, useState } from "react";
import BackgroundVideo from "../sections/Hero/BackgroundVideo.jsx";
import Hero from "../sections/Hero/Hero.jsx";
import ProvidersSection from "../sections/Providers/ProvidersSection.jsx";
import KeyNumbersSection from "../sections/KeyNumbers/KeyNumbersSection.jsx";
import SelectionStandardSection from "../sections/SelectionStandard/SelectionStandardSection.jsx";
import ExplorePlatformSlide from "../sections/ExplorePlatform/ExplorePlatformSlide.jsx";
import HowItWorksSection from "../sections/HowItWorks/HowItWorksSection.jsx";
import GetStartedSection from "../sections/HowItWorks/GetStartedSection.jsx";
import WhyLevelsSocialsSection from "../sections/WhyLevelsSocials/WhyLevelsSocialsSection.jsx";
import TestimonialsSection from "../sections/Testimonials/TestimonialsSection.jsx";
import FAQSection from "../sections/FAQ/FAQSection.jsx";
import CTASection from "../sections/CTA/CTASection.jsx";
import FooterSection from "../sections/Footer/FooterSection.jsx";
import EXPLORE_PLATFORM_SLIDES from "../data/explorePlatform.js";
import { mapScroll, HERO_EXIT_PX, TOTAL_SCROLL } from "../lib/scrollMap.js";
import { useSmoothScroll, scrollToY } from "../lib/useSmoothScroll.js";
import { useReducedMotion } from "../lib/useReducedMotion.js";
import "./HomePage.css";

const HOW_IT_WORKS_STAGE = 7;
const GET_STARTED_STAGE = 8;
const WHY_LEVELS_STAGE = 9;
const TESTIMONIALS_STAGE = 10;
const FAQ_STAGE = 11;
const CTA_STAGE = 12;

// Clamped "how far past/before this stage" -> a -1..1 offset, used to slide a
// section fully in (0), fully below (1) or fully above/out (-1) the viewport.
const rel = (p, stageIndex) => Math.min(1, Math.max(-1, p - stageIndex));

// Past this much of the hero's exit, the sections beneath it own the page: they
// take the clicks and the screen readers, and the hero stops answering both.
const HERO_HANDOFF = 0.5;

// How long the page must sit still before we call a scroll finished. Long enough
// to sit out trackpad momentum, short enough not to feel like a delay.
const SETTLE_MS = 140;

export default function HomePage() {
  const [scroll, setScroll] = useState(() => mapScroll(0));

  // Lenis smooths the wheel; every transform on the page is derived from the
  // position it lands on, so this is the only place motion is added. Someone who
  // asked for less of it gets the browser's own scroll back, untouched.
  const reducedMotion = useReducedMotion();
  const lenisRef = useSmoothScroll(!reducedMotion);

  // Something else scrolls the window — Lenis, or the browser itself where Lenis
  // is off; we only read where it got to. Scroll events fire far more often than
  // the screen repaints, so coalesce them into one update per frame — same
  // position, a fraction of the renders.
  useEffect(() => {
    let rafId = 0;
    const update = () => {
      rafId = 0;
      setScroll(mapScroll(window.scrollY));
    };
    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update(); // sync to wherever the page already sits, rather than assuming the top
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // The hero's dissolve should read as one decisive step, not somewhere you can
  // park halfway. CSS scroll-snap cannot express that here, as measured in
  // Chrome: `proximity` never engages over a segment this long, so the page just
  // rests mid-dissolve; and `mandatory` considers the whole 17000px track
  // snappable and yanks a scroll at 7000 back to the hero boundary at 900.
  //
  // So settle this one boundary by hand, and only once the scroll has actually
  // stopped — unlike the old wheel lock, this never fights momentum, it waits
  // for it, Lenis's eased tail included. Every other pixel of the page is left
  // to whoever owns the scroll.
  useEffect(() => {
    let timer = 0;
    const settle = () => {
      const y = window.scrollY;
      if (y <= 0 || y >= HERO_EXIT_PX) return; // outside the hero's segment: not ours to touch
      scrollToY(lenisRef.current, y < HERO_EXIT_PX / 2 ? 0 : HERO_EXIT_PX);
    };
    const onScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(settle, SETTLE_MS);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, [lenisRef]);

  // Footer's "Back to top". useCallback keeps the reference stable so the
  // memoized Footer doesn't re-render on every scroll tick.
  const resetToHero = useCallback(() => {
    scrollToY(lenisRef.current, 0, { immediate: true });
  }, [lenisRef]);

  const { heroExit, vScroll, hProviders, hSelection, hGetStarted, hWhyLevels } = scroll;
  const heroExited = heroExit > HERO_HANDOFF;

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
  const whyLevelsRel = rel(vScroll, WHY_LEVELS_STAGE);
  const whyLevelsActive = vScroll > WHY_LEVELS_STAGE - 0.5;
  const testimonialsRel = rel(vScroll, TESTIMONIALS_STAGE);
  const testimonialsActive = vScroll > TESTIMONIALS_STAGE - 0.5;
  const faqRel = rel(vScroll, FAQ_STAGE);
  const faqActive = vScroll > FAQ_STAGE - 0.5;
  const ctaRel = rel(vScroll, CTA_STAGE);

  return (
    <main
      className="home"
      data-testid="home"
      data-hero-exited={heroExited ? "true" : "false"}
      data-kn-active={knActive ? "true" : "false"}
      style={{ "--hero-exit": heroExit.toFixed(4) }}
    >
      {/* The track's height IS the scroll timeline, so it comes from the same
          constant the timeline is built from rather than a duplicate in CSS.
          The sticky viewport stays pinned for (height - 100vh) of scroll. */}
      <div className="home__track" style={{ height: `calc(${TOTAL_SCROLL}px + 100vh)` }}>
        <div className="home__viewport">
          {/* Video + overlay move together with Providers (same translateY)
              instead of staying pinned while its content scrolls away. */}
          <div
            className="home__bg"
            style={{ transform: `translateY(${(-bgRel * 100).toFixed(3)}%)` }}
          >
            <BackgroundVideo blurred={heroExited} />
            <div className="home__overlay" />
          </div>

          <div className="home__stage home__stage--hero" aria-hidden={heroExited}>
            <Hero />
          </div>

          <div
            className="home__stage home__stage--providers"
            style={{ transform: `translateY(${(-providersRel * 100).toFixed(3)}%)` }}
            aria-hidden={!heroExited || providersRel >= 1}
          >
            <ProvidersSection progress={hProviders} />
          </div>

          <div
            className="home__stage home__stage--keynumbers"
            style={{ transform: `translateY(${(-keynumbersRel * 100).toFixed(3)}%)` }}
            aria-hidden={!heroExited || Math.abs(keynumbersRel) >= 1}
          >
            <KeyNumbersSection />
          </div>

          <div
            className="home__stage home__stage--selection"
            style={{ transform: `translateY(${(-selectionRel * 100).toFixed(3)}%)` }}
            aria-hidden={!heroExited || selectionRel >= 1}
          >
            <SelectionStandardSection active={selectionActive} progress={hSelection} />
          </div>

          {explorePlatformStages.map(({ stageIndex, slide, rel: stageRel, active }) => (
            <div
              key={slide.id}
              className="home__stage home__stage--explore"
              style={{ zIndex: 6 + (stageIndex - 3), transform: `translateY(${(-stageRel * 100).toFixed(3)}%)` }}
              aria-hidden={!heroExited || Math.abs(stageRel) >= 1}
            >
              <ExplorePlatformSlide slide={slide} active={active} />
            </div>
          ))}

          <div
            className="home__stage home__stage--howitworks"
            style={{ zIndex: 10, transform: `translateY(${(-howItWorksRel * 100).toFixed(3)}%)` }}
            aria-hidden={!heroExited || howItWorksRel >= 1}
          >
            <HowItWorksSection />
          </div>

          <div
            className="home__stage home__stage--howitworks"
            style={{ zIndex: 11, transform: `translateY(${(-getStartedRel * 100).toFixed(3)}%)` }}
            aria-hidden={!heroExited || getStartedRel >= 1}
          >
            <GetStartedSection progress={hGetStarted} />
          </div>

          <div
            className="home__stage home__stage--whylevels"
            style={{ zIndex: 12, transform: `translateY(${(-whyLevelsRel * 100).toFixed(3)}%)` }}
            aria-hidden={!heroExited || whyLevelsRel >= 1}
          >
            <WhyLevelsSocialsSection progress={hWhyLevels} active={whyLevelsActive} />
          </div>

          <div
            className="home__stage home__stage--testimonials"
            style={{ zIndex: 13, transform: `translateY(${(-testimonialsRel * 100).toFixed(3)}%)` }}
            aria-hidden={!heroExited || testimonialsRel >= 1}
          >
            <TestimonialsSection active={testimonialsActive} />
          </div>

          <div
            className="home__stage home__stage--faq"
            style={{ zIndex: 14, transform: `translateY(${(-faqRel * 100).toFixed(3)}%)` }}
            aria-hidden={!heroExited || faqRel >= 1}
          >
            <FAQSection active={faqActive} />
          </div>

          <div
            className="home__stage home__stage--cta"
            style={{ zIndex: 15, transform: `translateY(${(-ctaRel * 100).toFixed(3)}%)` }}
            aria-hidden={!heroExited || ctaRel >= 1}
          >
            <CTASection />
          </div>
        </div>
      </div>

      {/* Past the track the viewport unsticks and the footer arrives on ordinary
          scroll. It stays out of the track deliberately: a stage is a layer
          exactly one screen tall, and the footer is taller than that. */}
      <FooterSection onBackToTop={resetToHero} />
    </main>
  );
}
