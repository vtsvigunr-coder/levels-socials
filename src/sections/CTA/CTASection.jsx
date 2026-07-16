import { memo } from "react";
import Button from "../../components/Button.jsx";
import GradientDot from "../../components/GradientDot.jsx";
import logoIcon from "../../assets/logo-icon.svg";
import ctaBg from "../../assets/cta/cta-bg.webp";
import "./CTA.css";

function CTASection() {
  return (
    <section className="cta">
      <div
        className="cta__bg"
        style={{
          background: `radial-gradient(56.53% 47.19% at 50% 47.12%, rgba(20, 20, 20, 0.20) 0%, #141414 100%), url(${ctaBg}) lightgray 50% / cover no-repeat`,
        }}
        aria-hidden="true"
      />
      <div className="cta__content">
        <img className="cta__icon" src={logoIcon} alt="" aria-hidden="true" />
        <h2 className="cta__title">
          Connect to Proven Strategy Providers with <span className="cta__titleaccent">Full Data Visibility</span>
        </h2>
        <p className="cta__lead">Join 15,000+ investors already copying on Levels Socials</p>
        <div className="cta-btn-wrap">
          <Button variant="accent" className="btn--notch-br btn--start">Start with Levels Socials</Button>
          <GradientDot />
        </div>
      </div>
    </section>
  );
}

// memo: HomePage re-renders on every scroll tick to update the stage
// transforms; without this each tick would also re-render this whole
// subtree, which never changes unless its own props do.
export default memo(CTASection);
