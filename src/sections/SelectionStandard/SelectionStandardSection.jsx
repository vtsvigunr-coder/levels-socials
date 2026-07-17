import { motion } from "framer-motion";
import { memo, useEffect, useRef } from "react";
import { useReducedMotion } from "../../lib/useReducedMotion.js";
import Button from "../../components/Button.jsx";
import logoIcon from "../../assets/logo-icon.svg";
import SELECTION_STEPS from "../../data/selectionStandard.js";
import "./SelectionStandard.css";

const SLIDE_COUNT = SELECTION_STEPS.length;
const STEP_COUNT = Math.max(...SELECTION_STEPS.map((s) => s.step));
// Bottom progress-bar fill fraction at each slide, taken directly from the
// Figma reference (216/1200, 757/1200, 1116/1200 — 93%). The final slide
// pushes on to 100% so the bar finishes filling exactly as the dark -> light
// re-theme completes.
const BAR_CHECKPOINTS = [0, 0.6308, 0.93, 1];
// Fixed milestone-dot positions on the progress track, as a fraction of the
// track width — taken from the Figma reference (76px, 575px, 1088px centers
// on a 1200px-wide track).
const DOT_POSITIONS = [0.0654, 0.4813, 0.9075];

function lerp(a, b, t) { return a + (b - a) * t; }
function clamp01(t) { return Math.min(1, Math.max(0, t)); }
function smoothstep(t) { const c = clamp01(t); return c * c * (3 - 2 * c); }

function SelectionStandardSection({ active = false, progress = 0 }) {
  const reduced = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1];

  // The CTA trails the real cursor (which stays visible — this isn't a
  // custom-cursor replacement) with a small lag, across the whole section.
  // It stays hidden until the cursor actually enters the section, appearing
  // right where the cursor is rather than at some fixed rest spot, and
  // hides again once the cursor leaves.
  const sectionRef = useRef(null);
  const ctaRef = useRef(null);
  const ctaPos = useRef(null);
  const ctaTarget = useRef(null);
  const ctaRaf = useRef(0);

  useEffect(() => {
    const coarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    const section = sectionRef.current;
    const cta = ctaRef.current;
    if (!section || !cta) return;

    if (reduced || coarse) {
      // No cursor to chase on touch/reduced-motion — keep the button in its
      // static fallback position, fully visible.
      cta.style.opacity = "1";
      return;
    }

    cta.style.opacity = "0";

    const onMove = (e) => {
      const r = section.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (!ctaPos.current) {
        // First sighting of the cursor inside the section: appear right
        // there instead of lagging in from an old position.
        ctaPos.current = { x, y };
        cta.style.opacity = "1";
      }
      ctaTarget.current = { x, y };
    };
    const onLeave = () => {
      cta.style.opacity = "0";
      ctaPos.current = null;
      ctaTarget.current = null;
    };

    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);

    const LAG = 0.09; // trailing ease factor — lower = more delay
    const tick = () => {
      if (ctaPos.current && ctaTarget.current) {
        const p = ctaPos.current, t = ctaTarget.current;
        p.x += (t.x - p.x) * LAG;
        p.y += (t.y - p.y) * LAG;
        cta.style.transform = `translate(${p.x + 18}px, ${p.y + 18}px)`;
      }
      ctaRaf.current = requestAnimationFrame(tick);
    };
    ctaRaf.current = requestAnimationFrame(tick);

    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(ctaRaf.current);
    };
  }, [reduced]);

  const rise = reduced
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };
  const lineContainer = (delay) => ({
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : 0.1, delayChildren: reduced ? 0 : delay } },
  });
  const animate = active ? "show" : "hidden";

  // Continuous position across the 4 slides (0..3), driven 1:1 by scroll —
  // no CSS transition on any of this, so it never lags or jumps behind the
  // scroll amount (matches the progress-bar/slide behavior on q-industrial.com).
  const panelPos = Math.min(SLIDE_COUNT - 1, Math.max(0, progress * (SLIDE_COUNT - 1)));
  const index = Math.min(SLIDE_COUNT - 2, Math.floor(panelPos));
  const frac = panelPos - index;
  const current = SELECTION_STEPS[index];
  const next = SELECTION_STEPS[index + 1];

  // Dark -> light only crossfades across the final slide pair (same step,
  // re-themed), so the rest of the run stays fully dark or fully light.
  const themeT = index === SLIDE_COUNT - 2 && current.step === next.step
    ? frac
    : (current.step === STEP_COUNT && index > SLIDE_COUNT - 2 ? 1 : (current.theme === "light" ? 1 : 0));

  const barFrac = lerp(BAR_CHECKPOINTS[index], BAR_CHECKPOINTS[index + 1], frac);

  // Dot i is invisible (0) until the fill reaches the previous dot's
  // position, then grows from 0 up to the full Figma size (5px) exactly as
  // the fill sweeps from the previous checkpoint to this one.
  const dotAmounts = DOT_POSITIONS.map((pos, i) => {
    const prev = i === 0 ? 0 : DOT_POSITIONS[i - 1];
    return smoothstep((barFrac - prev) / (pos - prev));
  });

  // Non-overlapping crossfade: the outgoing item fades out over the first
  // half of the transition, the incoming item only starts fading in once the
  // outgoing one is fully gone — so they're never both visible at once.
  const outT = Math.min(1, frac * 2);
  const inT = Math.max(0, frac * 2 - 1);

  // The image pair for the final (dark -> light re-theme) transition keeps a
  // true crossfade, since the whole background dissolves alongside it.
  const isThemeCrossfade = index === SLIDE_COUNT - 2 && current.step === next.step;

  const style = {
    "--theme-t": themeT.toFixed(3),
    "--bar-frac": `${(barFrac * 100).toFixed(3)}%`,
  };

  return (
    <section className="selstd" ref={sectionRef} style={style}>
      <motion.div className="selstd__head" variants={lineContainer(0.05)} initial="hidden" animate={animate}>
        <div className="selstd__headtext">
          <motion.div className="selstd__tag" variants={rise} transition={{ duration: 0.6, ease }}>
            <img className="selstd__tagicon" src={logoIcon} alt="" aria-hidden="true" />
            Selection Standard
          </motion.div>
          <motion.h2 className="selstd__title" variants={lineContainer(0.06)} initial="hidden" animate={animate}>
            {["Only Selected Providers", "Reach the Platform"].map((line) => (
              <span className="reveal-line" key={line}>
                <motion.span style={{ display: "block" }} variants={rise} transition={{ duration: 0.6, ease }}>
                  {line}
                </motion.span>
              </span>
            ))}
          </motion.h2>
        </div>
        <motion.p className="selstd__lead" variants={lineContainer(0.06)} initial="hidden" animate={animate}>
          <span className="reveal-line">
            <motion.span style={{ display: "block" }} variants={rise} transition={{ duration: 0.6, ease }}>
              Every provider is sourced by invitation, reviewed against documented criteria, tested, and verified before going live
            </motion.span>
          </span>
        </motion.p>
      </motion.div>

      <motion.div
        className="selstd__body"
        variants={lineContainer(0.2)}
        initial="hidden"
        animate={animate}
      >
        <motion.div className="selstd__graph" variants={rise} transition={{ duration: 0.6, ease }}>
          {SELECTION_STEPS.map((s, i) => {
            const opacity = isThemeCrossfade
              ? (i === index ? 1 - frac : i === index + 1 ? frac : 0)
              : (i === index ? 1 - outT : i === index + 1 ? inT : 0);
            return (
              <img
                key={s.id}
                className="selstd__graphimg"
                src={s.image}
                alt=""
                aria-hidden="true"
                style={{ opacity }}
              />
            );
          })}
        </motion.div>

        <motion.div className="selstd__desc" variants={rise} transition={{ duration: 0.6, ease }}>
          {isThemeCrossfade ? (
            // Same copy on both sides of the dark -> light re-theme, so it
            // just stays put instead of sliding out and back in on itself.
            <p className="selstd__desctext">{current.description}</p>
          ) : (
            // Outgoing description slides left + fades out over the first
            // half of the transition; incoming only starts sliding in from
            // the right once the outgoing one is fully gone — no overlap.
            <>
              <p
                className="selstd__desctext"
                style={{ transform: `translateX(${(-outT * 32).toFixed(2)}px)`, opacity: 1 - outT }}
              >
                {current.description}
              </p>
              <p
                className="selstd__desctext selstd__desctext--next"
                style={{ transform: `translateX(${((1 - inT) * 32).toFixed(2)}px)`, opacity: inT }}
              >
                {next.description}
              </p>
            </>
          )}
        </motion.div>
      </motion.div>

      <div className="selstd__cta" ref={ctaRef}>
        <Button variant={themeT > 0.5 ? "dark" : "accent"} className="btn--notch-bl">
          Explore Provider Standards
        </Button>
      </div>

      <motion.div className="selstd__foot" variants={lineContainer(0.35)} initial="hidden" animate={animate}>
        <motion.div className="selstd__steps" variants={rise} transition={{ duration: 0.6, ease }}>
          {Array.from({ length: STEP_COUNT }, (_, i) => i + 1).map((stepNum) => {
            const label = SELECTION_STEPS.find((s) => s.step === stepNum)?.label;
            const stepPos = lerp(current.step, next.step, frac);
            const activeAmount = Math.max(0, 1 - Math.abs(stepPos - stepNum));
            return (
              <div
                key={stepNum}
                className="selstd__step"
                style={{ "--active-t": activeAmount.toFixed(3) }}
              >
                <span className="selstd__stepnum">{String(stepNum).padStart(2, "0")}</span>
                {label}
              </div>
            );
          })}
        </motion.div>
        <motion.div className="selstd__progress" variants={rise} transition={{ duration: 0.6, ease }}>
          <span className="selstd__progresstrack" />
          <span className="selstd__progressfill" />
          {DOT_POSITIONS.map((pos, i) => (
            <span
              key={i}
              className="selstd__progressdot"
              style={{ left: `${(pos * 100).toFixed(3)}%`, "--dot-t": dotAmounts[i].toFixed(3) }}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

// memo: HomePage re-renders on every scroll tick to update the stage
// transforms; without this each tick would also re-render this whole
// subtree, which never changes unless its own props do.
export default memo(SelectionStandardSection);
