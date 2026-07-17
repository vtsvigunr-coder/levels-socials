import { memo } from "react";
import GlassSurface from "../../components/GlassSurface.jsx";
import HOW_IT_WORKS_STEPS from "../../data/howItWorks.js";
import bgImage from "../../assets/how-it-works/how-it-work.webp";
import checkmarkBadge from "../../assets/how-it-works/checkmark-badge-01.svg";
import topProviderChart from "../../assets/how-it-works/top-provider.svg";
import xxxxRings from "../../assets/how-it-works/xxxx.svg";
import userSharingIcon from "../../assets/how-it-works/user-sharing.svg";
import securityLockIcon from "../../assets/how-it-works/security-lock.svg";
import secureLinkDivider from "../../assets/how-it-works/secure-link-divider.svg";
import capitalAllocationTexture from "../../assets/how-it-works/capital-allocation-texture.svg";
import capitalAllocationDot from "../../assets/how-it-works/capital-allocation-dot.svg";
import accountGrowthChart from "../../assets/how-it-works/account-growth.svg";
import controlChart from "../../assets/how-it-works/control.svg";
import "./HowToGetStarted.css";

const SLIDE_COUNT = HOW_IT_WORKS_STEPS.length; // 3
// The circle's progress ring never resets between steps — it grows
// continuously from empty (Step 1 start) to a full loop (Step 3 end).
const RING_MIN = 0;
const RING_MAX = 1;
const RING_R = 166; // svg circle radius, sized for a 340px circle (170 - half of the 8px stroke)
// Each step now owns an equal third of the scroll range (0-33%, 33-66%,
// 66-100%) and holds its card/circle content static for most of it — the
// crossfade to the next step is squeezed into the tail end of that third,
// so switching reads as "arrived at 33%, old is gone, new is in" rather
// than a crossfade smeared across the whole step.
const SEGMENT = 1 / SLIDE_COUNT;
const TRANSITION_WIDTH = 0.25; // fraction of a segment spent crossfading into the next step

function clamp01(t) { return Math.min(1, Math.max(0, t)); }
function smoothstep(t) { const c = clamp01(t); return c * c * (3 - 2 * c); }

function LeftCard({ stepId }) {
  if (stepId === "choose") {
    return (
      <>
        <p className="hiw-steps__cardlabel">Top Provider</p>
        <div className="hiw-steps__cardname">
          <span>NHEA EA</span>
          <img src={checkmarkBadge} alt="" aria-hidden="true" className="hiw-steps__cardbadge" />
        </div>
        <div className="hiw-steps__cardstat">
          <p className="hiw-steps__cardstatlabel">ROI (12M)</p>
          <p className="hiw-steps__cardstatvalue">+21.57%</p>
        </div>
        <img className="hiw-steps__cardchart" src={topProviderChart} alt="" aria-hidden="true" />
      </>
    );
  }
  if (stepId === "connect") {
    return (
      <>
        <p className="hiw-steps__cardtitle">Secure Link</p>
        <div className="hiw-steps__securerow">
          <span className="hiw-steps__securebadge">
            <img src={userSharingIcon} alt="" aria-hidden="true" className="hiw-steps__securebadgeicon" />
            Provider connected
          </span>
          <img src={secureLinkDivider} alt="" aria-hidden="true" className="hiw-steps__securedivider" />
          <span className="hiw-steps__securelock">
            <img src={securityLockIcon} alt="" aria-hidden="true" className="hiw-steps__securelockicon" />
          </span>
        </div>
      </>
    );
  }
  // control
  return (
    <>
      <img className="hiw-steps__growthchart" src={accountGrowthChart} alt="" aria-hidden="true" />
      <p className="hiw-steps__growthvalue">+8.6%</p>
      <span className="hiw-steps__growthlabel">Account Growth</span>
    </>
  );
}

// Only Step 1's right card ("XXXX Top providers") needs a fixed box — its
// rings graphic is deliberately cropped by the card's own bounds. Steps 2/3
// size their card to their own (differently-shaped) content instead.
function rightCardClass(stepId) {
  return stepId === "choose" ? "hiw-steps__card--xxxx" : "";
}

function RightCard({ stepId }) {
  if (stepId === "choose") {
    return (
      <>
        <img className="hiw-steps__cardrings" src={xxxxRings} alt="" aria-hidden="true" />
        <div className="hiw-steps__cardcounttext">
          <span className="hiw-steps__cardcount">XXXX</span>
          <span className="hiw-steps__cardcountlabel">Top providers</span>
        </div>
      </>
    );
  }
  if (stepId === "connect") {
    return (
      <>
        <p className="hiw-steps__cardtitle">Capital Allocation</p>
        <div className="hiw-steps__allocationrow">
          <div className="hiw-steps__allocationbar">
            <img className="hiw-steps__allocationtexture" src={capitalAllocationTexture} alt="" aria-hidden="true" />
            <span className="hiw-steps__allocationfill" />
          </div>
          <img className="hiw-steps__allocationdot" src={capitalAllocationDot} alt="" aria-hidden="true" />
          <span className="hiw-steps__allocationpct">+101.4%</span>
        </div>
      </>
    );
  }
  // control — control.svg bakes in the bar chart, the trend line, the mini
  // scrollbar track and its two dots as one export, so it replaces all of
  // that previously hand-built markup.
  return <img className="hiw-steps__controlchart" src={controlChart} alt="" aria-hidden="true" />;
}

function GetStartedSection({ progress = 0 }) {
  const p = clamp01(progress);
  const index = Math.min(SLIDE_COUNT - 1, Math.floor(p / SEGMENT));
  const hasNext = index < SLIDE_COUNT - 1;
  const localP = clamp01((p - index * SEGMENT) / SEGMENT); // 0..1 within this step's own third
  const current = HOW_IT_WORKS_STEPS[index];
  const next = HOW_IT_WORKS_STEPS[hasNext ? index + 1 : index];

  // Held static for most of the segment; only the tail TRANSITION_WIDTH of
  // it is spent transitioning into the next step. That transition is
  // sequential, not an overlapping crossfade: the first half fades the
  // current step fully out, then the second half fades the next step in —
  // so a step always fully disappears before the next one appears, rather
  // than the two blending into each other.
  const rawT = hasNext ? clamp01((localP - (1 - TRANSITION_WIDTH)) / TRANSITION_WIDTH) : 0;
  const outT = smoothstep(clamp01(rawT * 2));
  const inT = smoothstep(clamp01(rawT * 2 - 1));

  const ringFrac = RING_MIN + (RING_MAX - RING_MIN) * p;
  const ringCirc = 2 * Math.PI * RING_R;

  // Dot i lights up fully once its step has been reached, and eases in
  // during the same tail-of-segment window as the card/circle crossfade —
  // one shared transition, not a second independently-timed one.
  const dotAmounts = HOW_IT_WORKS_STEPS.map((_, i) => {
    if (i <= index) return 1;
    if (i === index + 1) return inT;
    return 0;
  });

  return (
    <section className="hiw-steps">
      <div className="hiw-bg-clip" aria-hidden="true">
        <div className="hiw-bg-inner hiw-bg-inner--bottom">
          <img className="hiw-bg-inner__img" src={bgImage} alt="" />
        </div>
      </div>
      <div className="hiw-steps__bggradient" aria-hidden="true" />

      <div className="hiw-steps__stage">
        <div className="hiw-steps__cardslot hiw-steps__cardslot--left">
          {/* Both current and next are always mounted (opacity-toggled, never
              conditionally rendered) — a GlassSurface that only mounts
              partway through the crossfade pops in unblurred for a frame
              before its backdrop-filter composites, which read as the card
              flashing in twice. Keeping it mounted the whole time avoids
              that entirely. */}
          <GlassSurface as="div" radius={16} className="hiw-steps__card" style={{ opacity: 1 - outT }}>
            <LeftCard stepId={current.id} />
          </GlassSurface>
          {hasNext && (
            <GlassSurface as="div" radius={16} className="hiw-steps__card" style={{ opacity: inT }}>
              <LeftCard stepId={next.id} />
            </GlassSurface>
          )}
        </div>

        <div className="hiw-steps__cardslot hiw-steps__cardslot--right">
          <GlassSurface as="div" radius={16} className={`hiw-steps__card ${rightCardClass(current.id)}`} style={{ opacity: 1 - outT }}>
            <RightCard stepId={current.id} />
          </GlassSurface>
          {hasNext && (
            <GlassSurface as="div" radius={16} className={`hiw-steps__card ${rightCardClass(next.id)}`} style={{ opacity: inT }}>
              <RightCard stepId={next.id} />
            </GlassSurface>
          )}
        </div>

        <GlassSurface as="div" radius={170} className="hiw-steps__circle">
          <svg className="hiw-steps__ring" viewBox="0 0 340 340" width="340" height="340" aria-hidden="true">
            <defs>
              <linearGradient id="hiwRingGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#FF8C3A" />
                <stop offset="1" stopColor="#FFC943" />
              </linearGradient>
            </defs>
            <circle
              cx="170" cy="170" r={RING_R}
              fill="none" stroke="url(#hiwRingGrad)" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={ringCirc}
              strokeDashoffset={ringCirc * (1 - ringFrac)}
              transform="rotate(-90 170 170)"
            />
          </svg>
          <div className="hiw-steps__circletext">
            <div className="hiw-steps__circlerow">
              <span className="hiw-steps__steppill" style={{ opacity: 1 - outT }}>{current.tag}</span>
              {hasNext && <span className="hiw-steps__steppill hiw-steps__steppill--next" style={{ opacity: inT }}>{next.tag}</span>}
            </div>
            <div className="hiw-steps__circlerow">
              <h3 className="hiw-steps__stepname" style={{ opacity: 1 - outT }}>{current.title}</h3>
              {hasNext && <h3 className="hiw-steps__stepname hiw-steps__stepname--next" style={{ opacity: inT }}>{next.title}</h3>}
            </div>
            <div className="hiw-steps__circlerow">
              <p className="hiw-steps__stepdesc" style={{ opacity: 1 - outT }}>{current.description}</p>
              {hasNext && <p className="hiw-steps__stepdesc hiw-steps__stepdesc--next" style={{ opacity: inT }}>{next.description}</p>}
            </div>
          </div>
        </GlassSurface>

        <div className="hiw-steps__tracker">
          <div className="hiw-steps__trackerprogress">
            <span className="hiw-steps__trackertrack" />
          </div>
          {HOW_IT_WORKS_STEPS.map((step, i) => (
            <div key={step.id} className="hiw-steps__trackerstep">
              <span className="hiw-steps__trackerdot" style={{ "--active-t": dotAmounts[i].toFixed(3) }}>
                {step.number}
              </span>
              <p className="hiw-steps__trackerlabel">{step.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// memo: HomePage re-renders on every scroll tick to update the stage
// transforms; without this each tick would also re-render this whole
// subtree, which never changes unless its own props do.
export default memo(GetStartedSection);
