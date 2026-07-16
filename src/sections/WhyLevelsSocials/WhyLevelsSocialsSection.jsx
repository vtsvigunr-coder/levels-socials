import { memo } from "react";
import Button from "../../components/Button.jsx";
import GradientDot from "../../components/GradientDot.jsx";
import WhyCard from "./WhyCard.jsx";
import WHY_LEVELS_SOCIALS from "../../data/whyLevelsSocials.js";
import logoIcon from "../../assets/logo-icon.svg";
import "./WhyLevelsSocials.css";

const CARD_W = 900;
const GAP = 20;
const STEP = CARD_W + GAP; // advance one full card per horizontal-scroll step
const SLIDE_COUNT = WHY_LEVELS_SOCIALS.length;

function WhyLevelsSocialsSection({ progress = 0, active = false }) {
  // Continuous position across the 3 cards, driven 1:1 by horizontal scroll —
  // no CSS transition, so it never lags behind the scroll amount (same
  // pattern as the Providers carousel).
  const offset = Math.min(1, Math.max(0, progress)) * (SLIDE_COUNT - 1) * STEP;

  return (
    <section className="why" data-active={active ? "true" : "false"}>
      <div className="why__inner">
        <div className="why__head">
          <div className="why__intro">
            <div className="why__tag">
              <img className="why__logoicon" src={logoIcon} alt="" aria-hidden="true" />
              Why Levels Socials
            </div>
            <h2 className="why__title">Why Levels Socials</h2>
          </div>
          <div className="cta-btn-wrap">
            <Button variant="solid" className="btn--notch-br why__btn">Explore Providers</Button>
            <GradientDot />
          </div>
        </div>

        <div className="why__carousel">
          <div className="why__viewport">
            {/* entrance wrapper slides the whole row in from the right */}
            <div className="why__enter">
              <div
                className="why__track"
                style={{ transform: `translate3d(${-offset}px,0,0)` }}
              >
                {WHY_LEVELS_SOCIALS.map((item, i) => (
                  <WhyCard key={item.id} item={item} style={{ "--i": i }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// memo: HomePage re-renders on every scroll tick to update the stage
// transforms; without this each tick would also re-render this whole
// subtree, which never changes unless its own props do.
export default memo(WhyLevelsSocialsSection);
