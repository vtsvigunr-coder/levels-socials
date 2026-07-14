import { useEffect, useRef, useState } from "react";
import Button from "../../components/Button.jsx";
import ProviderCard from "./ProviderCard.jsx";
import PROVIDERS from "../../data/providers.js";
import logoIcon from "../../assets/logo-icon.svg";
import arrow from "../../assets/icons/arrow.svg";
import "./Providers.css";

const CARD_W = 755;
const GAP = 20;
const STEP = CARD_W + GAP;

export default function ProvidersSection() {
  const [index, setIndex] = useState(0);
  const [metrics, setMetrics] = useState({ maxScroll: 0, maxIndex: 0 });
  const vpRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const measure = () => {
      const vp = vpRef.current;
      const tr = trackRef.current;
      if (!vp || !tr) return;
      const maxScroll = Math.max(0, tr.scrollWidth - vp.clientWidth);
      setMetrics({ maxScroll, maxIndex: Math.ceil(maxScroll / STEP) });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const clampedIndex = Math.min(index, metrics.maxIndex);
  const offset = Math.min(clampedIndex * STEP, metrics.maxScroll);
  const progress = metrics.maxScroll > 0 ? (offset / metrics.maxScroll) * 100 : 0;
  const canPrev = clampedIndex > 0;
  const canNext = offset < metrics.maxScroll - 0.5;

  const prev = () => setIndex((i) => Math.max(0, Math.min(i, metrics.maxIndex) - 1));
  const next = () => setIndex((i) => Math.min(metrics.maxIndex, i + 1));

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
          <div className="providers__viewport" ref={vpRef}>
            <div
              className="providers__track"
              ref={trackRef}
              style={{ transform: `translate3d(${-offset}px,0,0)` }}
            >
              {PROVIDERS.map((p) => (
                <ProviderCard key={p.id} provider={p} />
              ))}
            </div>
          </div>

          <div className="providers__nav">
            <div className="providers__progress" role="progressbar" aria-valuenow={Math.round(progress)}>
              <span className="providers__progressfill" style={{ width: `${progress}%` }} />
            </div>
            <div className="providers__arrows">
              <button
                type="button"
                className="providers__arrow"
                onClick={prev}
                disabled={!canPrev}
                aria-label="Previous providers"
              >
                <img src={arrow} alt="" aria-hidden="true" style={{ transform: "rotate(90deg)" }} />
              </button>
              <button
                type="button"
                className="providers__arrow"
                onClick={next}
                disabled={!canNext}
                aria-label="Next providers"
              >
                <img src={arrow} alt="" aria-hidden="true" style={{ transform: "rotate(-90deg)" }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
