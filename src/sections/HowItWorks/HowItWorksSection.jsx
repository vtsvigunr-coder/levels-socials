import { memo } from "react";
import Button from "../../components/Button.jsx";
import GradientDot from "../../components/GradientDot.jsx";
import RevealLines from "../../components/RevealLines.jsx";
import logoIcon from "../../assets/logo-icon.svg";
import "./HowItWorksIntro.css";

// First half of the "How it Works" spread (Figma node 799:15810) — the
// second half (799:15818, the step circle) lives in GetStartedSection.jsx.
// Both sections read as one continuous photo (Figma node 799:15809) without
// actually animating anything: each renders the *same* CSS background (see
// .hiw-bg-inner in HowItWorksIntro.css) inside a box twice its own height,
// then this one clips to that box's top half and GetStartedSection's clips
// to the bottom half (via .hiw-bg-inner--top vs --bottom, a static +/-100%
// offset — no scroll-driven transform, so the photo never appears to move
// independently of its own section).
function HowItWorksSection({ active = false }) {
  return (
    <section className="hiw-intro" data-active={active ? "true" : "false"}>
      <div className="hiw-bg-clip" aria-hidden="true">
        <div className="hiw-bg-inner hiw-bg-inner--top" />
      </div>

      <div className="hiw-intro__text">
        <div className="hiw-intro__tag">
          <img className="hiw-intro__tagicon" src={logoIcon} alt="" aria-hidden="true" />
          How it Works
        </div>
        <RevealLines
          as="h2"
          className="hiw-intro__title"
          lines={["Start Copying in Three Steps"]}
          baseDelay={0.12}
        />
        <RevealLines
          as="p"
          className="hiw-intro__lead"
          lines={["Choose a strategy provider, connect capital, and let trades copy automatically. Monitor, adjust, or disconnect anytime"]}
          baseDelay={0.24}
        />
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
