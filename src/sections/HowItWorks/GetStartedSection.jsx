import { memo } from "react";
import GlassSurface from "../../components/GlassSurface.jsx";
import HOW_IT_WORKS_STEPS from "../../data/howItWorks.js";
import bgImage from "../../assets/how-it-works/how-it-work.webp";
import checkmarkBadge from "../../assets/how-it-works/checkmark-badge-01.svg";
import topProviderChart from "../../assets/how-it-works/top-provider-chart.svg";
import xxxxRings from "../../assets/how-it-works/xxxx-rings.svg";
import userSharingIcon from "../../assets/how-it-works/user-sharing.svg";
import securityLockIcon from "../../assets/how-it-works/security-lock.svg";
import secureLinkDivider from "../../assets/how-it-works/secure-link-divider.svg";
import capitalAllocationTexture from "../../assets/how-it-works/capital-allocation-texture.svg";
import capitalAllocationDot from "../../assets/how-it-works/capital-allocation-dot.svg";
import accountGrowthChart from "../../assets/how-it-works/account-growth-chart.svg";
import carouselChartBars from "../../assets/how-it-works/carousel-chart-bars.svg";
import carouselChartLine from "../../assets/how-it-works/carousel-chart-line.svg";
import "./HowToGetStarted.css";

const SLIDE_COUNT = HOW_IT_WORKS_STEPS.length; // 3
// The circle's progress ring never resets between steps — it grows
// continuously from a short arc (Step 1) to almost a full loop (Step 3),
// matching the Figma references for all three states.
const RING_MIN = 0.3;
const RING_MAX = 0.95;
const RING_R = 166; // svg circle radius, sized for a 340px circle (170 - half of the 8px stroke)

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
  // control
  return (
    <div className="hiw-steps__carousel">
      <img className="hiw-steps__carouselbars" src={carouselChartBars} alt="" aria-hidden="true" />
      <img className="hiw-steps__carouselline" src={carouselChartLine} alt="" aria-hidden="true" />
    </div>
  );
}

function GetStartedSection({ progress = 0 }) {
  const p = clamp01(progress);
  const panelPos = p * (SLIDE_COUNT - 1);
  const index = Math.min(SLIDE_COUNT - 2, Math.floor(panelPos));
  const frac = panelPos - index;
  const current = HOW_IT_WORKS_STEPS[index];
  const next = HOW_IT_WORKS_STEPS[index + 1];

  // Non-overlapping crossfade: the outgoing content fades out over the first
  // half of the step transition, the incoming one only fades in once the
  // outgoing one is fully gone (same pattern as Selection Standard).
  const outT = Math.min(1, frac * 2);
  const inT = Math.max(0, frac * 2 - 1);

  const ringFrac = RING_MIN + (RING_MAX - RING_MIN) * p;
  const ringCirc = 2 * Math.PI * RING_R;

  const stepPos = index + frac; // continuous 0..2 across all 3 steps
  const barFrac = stepPos / (SLIDE_COUNT - 1);
  const dotAmounts = HOW_IT_WORKS_STEPS.map((_, i) => smoothstep(stepPos - i + 1));

  return (
    <section className="hiw-steps">
      <div className="hiw-steps__bg" aria-hidden="true">
        <img className="hiw-steps__bgimg" src={bgImage} alt="" />
        <div className="hiw-steps__bggradient" />
      </div>

      <div className="hiw-steps__stage">
        <div className="hiw-steps__cardslot hiw-steps__cardslot--left">
          <GlassSurface as="div" radius={16} className="hiw-steps__card" style={{ opacity: 1 - outT }}>
            <LeftCard stepId={current.id} />
          </GlassSurface>
          {inT > 0 && (
            <GlassSurface as="div" radius={16} className="hiw-steps__card" style={{ opacity: inT }}>
              <LeftCard stepId={next.id} />
            </GlassSurface>
          )}
        </div>

        <div className="hiw-steps__cardslot hiw-steps__cardslot--right">
          <GlassSurface as="div" radius={16} className={`hiw-steps__card ${rightCardClass(current.id)}`} style={{ opacity: 1 - outT }}>
            <RightCard stepId={current.id} />
          </GlassSurface>
          {inT > 0 && (
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
              {inT > 0 && <span className="hiw-steps__steppill hiw-steps__steppill--next" style={{ opacity: inT }}>{next.tag}</span>}
            </div>
            <div className="hiw-steps__circlerow">
              <h3 className="hiw-steps__stepname" style={{ opacity: 1 - outT }}>{current.title}</h3>
              {inT > 0 && <h3 className="hiw-steps__stepname hiw-steps__stepname--next" style={{ opacity: inT }}>{next.title}</h3>}
            </div>
            <div className="hiw-steps__circlerow">
              <p className="hiw-steps__stepdesc" style={{ opacity: 1 - outT }}>{current.description}</p>
              {inT > 0 && <p className="hiw-steps__stepdesc hiw-steps__stepdesc--next" style={{ opacity: inT }}>{next.description}</p>}
            </div>
          </div>
        </GlassSurface>

        <div className="hiw-steps__tracker">
          <div className="hiw-steps__trackerprogress">
            <span className="hiw-steps__trackertrack" />
            <span className="hiw-steps__trackerfill" style={{ width: `${(barFrac * 100).toFixed(3)}%` }} />
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
