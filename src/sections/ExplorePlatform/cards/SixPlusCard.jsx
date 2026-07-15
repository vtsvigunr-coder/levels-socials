import { useEffect, useState } from "react";
import { useReducedMotion } from "../../../lib/useReducedMotion.js";
import sixPlusBg from "../../../assets/explore-platform/six-plus-bg.png";
import gaugeRays from "../../../assets/explore-platform/gauge-rays.png";
import calendarIcon from "../../../assets/explore-platform/calendar-icon.svg";
import "./SixPlusCard.css";

// Traced from the Figma gauge arc (Vector, 301.17x150.585 viewBox).
const ARC_PATH =
  "M296.185 0C296.185 46.828 274.078 88.4928 239.732 115.127C215.099 134.229 184.17 145.6 150.585 145.6C70.1725 145.6 4.98515 80.4127 4.98515 0";
const TIMER_TARGET_SECONDS = 360; // "06:00"
const TIMER_DURATION_MS = 1200;

function formatTimer(totalSeconds) {
  const mm = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const ss = String(totalSeconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

function useTimerCount(active, reduced) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!active) {
      setSeconds(0);
      return;
    }
    if (reduced) {
      setSeconds(TIMER_TARGET_SECONDS);
      return;
    }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / TIMER_DURATION_MS);
      setSeconds(Math.round(t * TIMER_TARGET_SECONDS));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, reduced]);

  return seconds;
}

export default function SixPlusCard({ active }) {
  const reduced = useReducedMotion();
  const seconds = useTimerCount(active, reduced);

  return (
    <div className="xp-card xp-card--sixplus">
      <img className="xp-card__bg" src={sixPlusBg} alt="" aria-hidden="true" />

      <div className="xp-sixplus__chip">
        <img src={calendarIcon} alt="" aria-hidden="true" />
      </div>

      <div className="xp-sixplus__gauge">
        <img className="xp-sixplus__rays" src={gaugeRays} alt="" aria-hidden="true" />
        <svg className="xp-sixplus__arc" viewBox="0 0 301.17 150.585" fill="none" aria-hidden="true">
          <path
            d={ARC_PATH}
            stroke="url(#xp-arc-grad)"
            strokeWidth="9.97"
            pathLength="1"
            style={{
              strokeDasharray: 1,
              strokeDashoffset: active ? 0 : 1,
              transition: reduced ? "none" : "stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)",
            }}
          />
          <defs>
            <linearGradient id="xp-arc-grad" x1="296.185" y1="24.98" x2="11.238" y2="21.76" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF7E38" />
              <stop offset="0.52" stopColor="#FFC943" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        <div className="xp-sixplus__label">
          <span className="xp-sixplus__linebar" aria-hidden="true" />
          <span className="xp-sixplus__text">
            <span className="xp-sixplus__title">6+ Month</span>
            <span className="xp-sixplus__subtitle">Verified Performance</span>
          </span>
        </div>

        <div className="xp-sixplus__timer">{formatTimer(seconds)}</div>
      </div>

      <p className="xp-card__caption">Minimum trading history required</p>
    </div>
  );
}
