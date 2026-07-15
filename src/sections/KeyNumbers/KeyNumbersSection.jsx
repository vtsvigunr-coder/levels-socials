import Button from "../../components/Button.jsx";
import KeyNumberCard from "./KeyNumberCard.jsx";
import KEY_NUMBERS from "../../data/keyNumbers.js";
import logoIcon from "../../assets/logo-icon.svg";
import "./KeyNumbers.css";

export default function KeyNumbersSection() {
  return (
    <section className="keynum" data-testid="key-numbers">
      <div className="keynum__inner">
        <div className="keynum__head">
          <div className="keynum__tag">
            <img className="keynum__tagicon" src={logoIcon} alt="" aria-hidden="true" />
            Key Numbers
          </div>
          <div className="keynum__headtext">
            <h2 className="keynum__title">Levels Socials Today</h2>
            <p className="keynum__subtitle">A live platform, with real capital and activity.</p>
          </div>
        </div>

        <div className="keynum__cards">
          {KEY_NUMBERS.map((card) => (
            <KeyNumberCard key={card.id} card={card} />
          ))}
        </div>

        <div className="keynum__cta cta-btn-wrap">
          <Button variant="dark" className="btn--notch-br btn--start">Start with Levels Socials</Button>
          <span className="gradient-dot" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
