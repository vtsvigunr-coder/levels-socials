import { memo } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "../../lib/useReducedMotion.js";
import Button from "../../components/Button.jsx";
import GradientDot from "../../components/GradientDot.jsx";
import logoIcon from "../../assets/logo-icon.svg";
import SixPlusCard from "./cards/SixPlusCard.jsx";
import EarnedAccessCard from "./cards/EarnedAccessCard.jsx";
import FourteenDaysCard from "./cards/FourteenDaysCard.jsx";
import DashboardCard from "./cards/DashboardCard.jsx";
import "./ExplorePlatform.css";

const CARDS = {
  "six-plus": SixPlusCard,
  "earned-access": EarnedAccessCard,
  "fourteen-days": FourteenDaysCard,
  dashboard: DashboardCard,
};

function ExplorePlatformSlide({ slide, active }) {
  const reduced = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1];

  const rise = reduced
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };
  const lineContainer = (delay) => ({
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : 0.12, delayChildren: reduced ? 0 : delay } },
  });
  const animate = active ? "show" : "hidden";

  const Card = CARDS[slide.id];

  return (
    <section className={`xp-slide xp-slide--${slide.layout}`}>
      <div className="xp-slide__text">
        <motion.div className="xp-slide__tag" variants={rise} initial="hidden" animate={animate} transition={{ duration: 0.6, ease }}>
          <img className="xp-slide__tagicon" src={logoIcon} alt="" aria-hidden="true" />
          Explore Platform
        </motion.div>

        <motion.h2 className="xp-slide__title" variants={lineContainer(0.1)} initial="hidden" animate={animate}>
          {slide.lines.map((line, i) => (
            <span className="xp-slide__line" key={i}>
              <motion.span style={{ display: "block" }} variants={rise} transition={{ duration: 0.6, ease }}>
                {line.map((seg, j) => (
                  <span key={j} className={seg.accent ? "xp-slide__accent" : undefined}>
                    {seg.text}
                  </span>
                ))}
              </motion.span>
            </span>
          ))}
        </motion.h2>

        <motion.div className="xp-slide__ctawrap" variants={lineContainer(0.45)} initial="hidden" animate={animate}>
          <motion.p className="xp-slide__lead" variants={rise} transition={{ duration: 0.6, ease }}>
            {slide.lead}
          </motion.p>
          <motion.div className="cta-btn-wrap" variants={rise} transition={{ duration: 0.6, ease }}>
            <Button variant="dark" className="btn--notch-br">Explore the Platform</Button>
            <GradientDot />
          </motion.div>
        </motion.div>
      </div>

      <div className="xp-slide__card">
        <Card active={active} />
      </div>
    </section>
  );
}

// memo: HomePage re-renders on every scroll tick to update the stage
// transforms; without this each tick would also re-render this whole
// subtree, which never changes unless its own props do.
export default memo(ExplorePlatformSlide);
