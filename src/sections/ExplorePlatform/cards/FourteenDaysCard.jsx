import { motion } from "framer-motion";
import { useReducedMotion } from "../../../lib/useReducedMotion.js";
import sharedBg from "../../../assets/explore-platform/shared-bg.png";
import fourteenPhoto from "../../../assets/explore-platform/fourteen-days-photo.png";
import wave1 from "../../../assets/icons/wave1.svg";
import "./FourteenDaysCard.css";

export default function FourteenDaysCard({ active }) {
  const reduced = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1];

  return (
    <div className="xp-card xp-card--fourteen">
      <img className="xp-card__bg" src={sharedBg} alt="" aria-hidden="true" />
      <div className="xp-card__overlay" aria-hidden="true" />

      <motion.div
        className="xp-14__ghost"
        initial={false}
        animate={{ opacity: active ? 1 : 0, x: active ? 0 : 30, rotate: active ? 31.05 : 40 }}
        transition={{ duration: reduced ? 0 : 0.7, ease, delay: reduced ? 0 : 0.05 }}
        aria-hidden="true"
      />

      <motion.div
        className="xp-14__photo"
        initial={false}
        animate={{ opacity: active ? 1 : 0, x: active ? 0 : -30, rotate: active ? -31.77 : -42 }}
        transition={{ duration: reduced ? 0 : 0.7, ease }}
      >
        <img src={fourteenPhoto} alt="" aria-hidden="true" />
      </motion.div>

      <motion.div
        className="xp-14__panel"
        initial={false}
        animate={{ opacity: active ? 1 : 0, y: active ? 0 : 16 }}
        transition={{ duration: reduced ? 0 : 0.6, ease, delay: reduced ? 0 : 0.25 }}
      >
        <p className="xp-14__title">14 Days</p>
        <img
          className={reduced ? "xp-14__wave" : "xp-14__wave xp-14__wave--sway"}
          src={wave1}
          alt=""
          aria-hidden="true"
        />
        <span className="xp-14__pill">Trend</span>
      </motion.div>
    </div>
  );
}
