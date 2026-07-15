import { motion } from "framer-motion";
import { useReducedMotion } from "../../../lib/useReducedMotion.js";
import sharedBg from "../../../assets/explore-platform/shared-bg.png";
import dashboardImg from "../../../assets/explore-platform/dashboard-mockup.png";
import "./DashboardCard.css";

export default function DashboardCard({ active }) {
  const reduced = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1];

  return (
    <div className="xp-card xp-card--dashboard">
      <img className="xp-card__bg" src={sharedBg} alt="" aria-hidden="true" />
      <div className="xp-card__overlay" aria-hidden="true" />

      <div className="xp-dash">
        {/* Top ~55%: the balance figure. Fades + rises in. */}
        <motion.img
          className="xp-dash__layer"
          src={dashboardImg}
          alt=""
          aria-hidden="true"
          initial={false}
          animate={{ opacity: active ? 1 : 0, y: active ? 0 : 12 }}
          transition={{ duration: reduced ? 0 : 0.6, ease }}
          style={{ clipPath: "inset(0% 0% 55% 0%)" }}
        />
        {/* Bottom ~58%: the performance chart. Wipes in left-to-right. */}
        <motion.img
          className="xp-dash__layer"
          src={dashboardImg}
          alt="Dashboard preview"
          initial={false}
          animate={{ clipPath: active ? "inset(42% 0% 0% 0%)" : "inset(42% 100% 0% 0%)" }}
          transition={{ duration: reduced ? 0 : 0.9, ease, delay: reduced ? 0 : 0.25 }}
        />
      </div>
    </div>
  );
}
