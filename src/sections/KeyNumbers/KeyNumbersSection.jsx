import { memo } from "react";
import Button from "../../components/Button.jsx";
import GradientDot from "../../components/GradientDot.jsx";
import RevealLines from "../../components/RevealLines.jsx";
import KeyNumberCard from "./KeyNumberCard.jsx";
import KEY_NUMBERS from "../../data/keyNumbers.js";
import logoIcon from "../../assets/logo-icon.svg";
import "./KeyNumbers.css";

function KeyNumbersSection() {
  return (
    <section className="keynum" data-testid="key-numbers">
      <div className="keynum__inner">
        <div className="keynum__head">
          <div className="keynum__tag">
            <img className="keynum__tagicon" src={logoIcon} alt="" aria-hidden="true" />
            Key Numbers
          </div>
          <div className="keynum__headtext">
            <RevealLines as="h2" className="keynum__title" lines={["Levels Socials Today"]} baseDelay={0.12} />
            <RevealLines as="p" className="keynum__subtitle" lines={["A live platform, with real capital and activity."]} baseDelay={0.18} />
          </div>
        </div>

        <div className="keynum__cards">
          {KEY_NUMBERS.map((card) => (
            <KeyNumberCard key={card.id} card={card} />
          ))}
        </div>

        <div className="keynum__cta cta-btn-wrap">
          <Button variant="dark" className="btn--notch-br btn--start">Start with Levels Socials</Button>
          <GradientDot />
        </div>
      </div>
    </section>
  );
}

// memo: HomePage re-renders on every scroll tick to update the stage
// transforms; without this each tick would also re-render this whole
// subtree, which never changes unless its own props do.
export default memo(KeyNumbersSection);
