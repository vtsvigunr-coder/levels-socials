import { motion } from "framer-motion";
import { useReducedMotion } from "../../../lib/useReducedMotion.js";
import sharedBg from "../../../assets/explore-platform/shared-bg.png";
import earnedWave from "../../../assets/explore-platform/earned-wave.png";
import checkmarkIcon from "../../../assets/explore-platform/checkmark-badge-icon.svg";
import "./EarnedAccessCard.css";

export default function EarnedAccessCard({ active }) {
  const reduced = useReducedMotion();

  return (
    <div className="xp-card xp-card--earned">
      <img className="xp-card__bg" src={sharedBg} alt="" aria-hidden="true" />
      <div className="xp-card__overlay" aria-hidden="true" />
      <img className="xp-earned__wave" src={earnedWave} alt="" aria-hidden="true" />

      <div className="xp-earned__pill">
        <motion.span
          className="xp-earned__badge"
          initial={false}
          animate={{ scale: active ? 1 : 0.6, opacity: active ? 1 : 0 }}
          transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 14 }}
        >
          <img src={checkmarkIcon} alt="" aria-hidden="true" />
        </motion.span>
        <span className="xp-earned__text">
          <span className="xp-earned__title">Selection Review</span>
          <span className="xp-earned__subtitle">Earned Access</span>
        </span>
      </div>
    </div>
  );
}
