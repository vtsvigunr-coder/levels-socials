import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "../../lib/useReducedMotion.js";
import Header from "./Header.jsx";
import CursorTrail from "./CursorTrail.jsx";
import Button from "../../components/Button.jsx";
import heroVideo from "../../assets/hero.mp4";
import heroPoster from "../../assets/hero-poster.jpg";
import arrowDown from "../../assets/icons/arrow-down.svg";
import "./Hero.css";

export const HERO_LINES = ["Social Copy Trading", "Built for Transparency", "and Control"];

// Paragraph line breaks match the Figma layout (372px @ Onest Medium 20/24).
export const CTA_LINES = [
  "A platform where investors connect to",
  "strategy providers and participate in",
  "their performance, with full data and",
  "complete capital control.",
];

export default function Hero() {
  const reduced = useReducedMotion();
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  }, []);

  const ease = [0.22, 1, 0.36, 1];

  const rise = reduced
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };

  const lineContainer = (delay) => ({
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : 0.12, delayChildren: reduced ? 0 : delay } },
  });

  return (
    <section className="hero">
      <video
        ref={videoRef}
        className="hero-video"
        data-testid="hero-video"
        src={heroVideo}
        poster={heroPoster}
        autoPlay
        muted
        playsInline
      />
      <div className="hero-overlay" />

      <Header />

      <motion.h1
        className="hero-title"
        variants={lineContainer(0.15)}
        initial="hidden"
        animate="show"
      >
        {HERO_LINES.map((line) => (
          <span className="hero-line" key={line}>
            <motion.span style={{ display: "block" }} variants={rise} transition={{ duration: 0.6, ease }}>
              {line}
            </motion.span>
          </span>
        ))}
      </motion.h1>

      <motion.div
        className="hero-cta"
        variants={lineContainer(0.55)}
        initial="hidden"
        animate="show"
      >
        <p className="hero-lead">
          {CTA_LINES.map((line) => (
            <span className="hero-lead-line" key={line}>
              <motion.span style={{ display: "block" }} variants={rise} transition={{ duration: 0.6, ease }}>
                {line}
              </motion.span>
            </span>
          ))}
        </p>
        <motion.div className="cta-btn-wrap" variants={rise} transition={{ duration: 0.6, ease }}>
          <Button variant="solid" className="btn--notch-br btn--start">Start with Levels Socials</Button>
          <span className="gradient-dot" aria-hidden="true" />
        </motion.div>
      </motion.div>

      <motion.a
        className="hero-explore"
        href="#next"
        variants={rise}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.6, ease, delay: reduced ? 0 : 0.9 }}
      >
        Explore more <img src={arrowDown} alt="" aria-hidden="true" />
      </motion.a>

      <CursorTrail />
    </section>
  );
}
