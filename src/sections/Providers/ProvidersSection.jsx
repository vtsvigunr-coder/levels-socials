import Button from "../../components/Button.jsx";
import ProviderCard from "./ProviderCard.jsx";
import PROVIDERS from "../../data/providers.js";
import logoIcon from "../../assets/logo-icon.svg";
import arrowRight from "../../assets/icons/arrow-right.svg";
import "./Providers.css";

const CARD_W = 755;
const GAP = 20;
const STEP = CARD_W + GAP; // advance one full card per horizontal-scroll step
// One extra "slide" beyond the last card, for the closing CTA to scroll into view.
const SLIDE_COUNT = PROVIDERS.length + 1;

export default function ProvidersSection({ progress = 0 }) {
  // Continuous position across the cards + closing CTA, driven 1:1 by
  // horizontal scroll — no CSS transition, so it never lags behind the
  // scroll amount (same pattern as Selection Standard's panelPos).
  const offset = Math.min(1, Math.max(0, progress)) * (SLIDE_COUNT - 1) * STEP;

  return (
    <section className="providers">
      <div className="providers__inner">
        <div className="providers__text">
          <div className="providers__intro">
            <div className="providers__tag">
              <img className="providers__logoicon" src={logoIcon} alt="" aria-hidden="true" />
              Strategy Providers
            </div>
            <h2 className="providers__title">
              Access Selected<br />Providers in One Place
            </h2>
          </div>
          <div className="providers__cta">
            <p className="providers__lead">
              Explore provider profiles, track records, drawdown, and performance data
              before connecting
            </p>
            <div className="cta-btn-wrap">
              <Button variant="accent" className="btn--notch-br btn--start">Explore Providers</Button>
              <span className="gradient-dot" aria-hidden="true" />
            </div>
          </div>
        </div>

        <div className="providers__carousel">
          <div className="providers__viewport">
            {/* entrance wrapper slides the whole row in from the right */}
            <div className="providers__enter">
              <div
                className="providers__track"
                style={{ transform: `translate3d(${-offset}px,0,0)` }}
              >
                {PROVIDERS.map((p) => (
                  <ProviderCard key={p.id} provider={p} />
                ))}
                <a href="#start" className="providers__finalcta">
                  Start with Levels Socials
                  <img src={arrowRight} alt="" aria-hidden="true" className="providers__finalctaicon" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
