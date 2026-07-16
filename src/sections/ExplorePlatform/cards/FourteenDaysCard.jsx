import { motion } from "framer-motion";
import { useReducedMotion } from "../../../lib/useReducedMotion.js";
import cardImg from "../../../assets/explore-platform/dashboard3.webp";

export default function FourteenDaysCard({ active }) {
  const reduced = useReducedMotion();

  return (
    <div className="xp-card">
      <motion.img
        className="xp-card__img"
        src={cardImg}
        alt=""
        aria-hidden="true"
        initial={false}
        animate={{ opacity: active ? 1 : 0, filter: active ? "blur(0px)" : "blur(16px)" }}
        transition={{ duration: reduced ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
