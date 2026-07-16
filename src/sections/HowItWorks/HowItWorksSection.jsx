import { memo } from "react";
import Button from "../../components/Button.jsx";
import GradientDot from "../../components/GradientDot.jsx";
import logoIcon from "../../assets/logo-icon.svg";
import bgImage from "../../assets/how-it-works/how-it-work.webp";
import "./HowItWorksIntro.css";

// First half of the "How it Works" spread (Figma node 799:15810) — the
// second half (799:15818, the step circle) lives in GetStartedSection.jsx.
// Both sections crop the same shared background rectangle (node 799:15809,
// 1443x1605 behind both frames combined) — this one shows its top (0-750 of
// 1605), the next section shows the rest (750-1605). See .hiw-intro__bg.
function HowItWorksSection() {
  return (
    <section className="hiw-intro">
      <div className="hiw-intro__bg" aria-hidden="true">
        <img className="hiw-intro__bgimg" src={bgImage} alt="" />
        <div className="hiw-intro__bggradient" />
      </div>

      <div className="hiw-intro__text">
        <div className="hiw-intro__tag">
          <img className="hiw-intro__tagicon" src={logoIcon} alt="" aria-hidden="true" />
          How it Works
        </div>
        <h2 className="hiw-intro__title">
          Start Copying in<br />Three Steps
        </h2>
        <p className="hiw-intro__lead">
          Choose a strategy provider, connect capital, and let trades copy automatically.
          Monitor, adjust, or disconnect anytime
        </p>
        <div className="cta-btn-wrap">
          <Button variant="solid" className="btn--notch-br btn--start">See How it Works</Button>
          <GradientDot />
        </div>
      </div>
    </section>
  );
}

// memo: HomePage re-renders on every scroll tick to update the stage
// transforms; without this each tick would also re-render this whole
// subtree, which never changes unless its own props do.
export default memo(HowItWorksSection);
