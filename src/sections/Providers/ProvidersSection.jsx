import { memo, useLayoutEffect, useRef, useState } from "react";
import Button from "../../components/Button.jsx";
import GradientDot from "../../components/GradientDot.jsx";
import RevealLines from "../../components/RevealLines.jsx";
import ProviderCard from "./ProviderCard.jsx";
import PROVIDERS from "../../data/providers.js";
import logoIcon from "../../assets/logo-icon.svg";
import arrowRight from "../../assets/icons/arrow-right.svg";
import "./Providers.css";

// The track's leading edge is inset 120px from the viewport (padding-left on
// .providers__track, matching the text row above it). Design mirrors that on
// the trailing edge too — the closing cta rests 120px short of the viewport's
// right edge, not flush against it.
const RIGHT_INSET = 120;

function ProvidersSection({ progress = 0 }) {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  // Measured from the live DOM rather than hardcoded card/cta pixel widths,
  // so it tracks the real (full-bleed) viewport and the cta's actual
  // rendered text width instead of drifting from font-metric guesses.
  const [maxOffset, setMaxOffset] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!viewport || !track) return;
      setMaxOffset(Math.max(0, track.scrollWidth - viewport.clientWidth + RIGHT_INSET));
    };
    measure();
    // Re-measure once the custom font swaps in — its metrics differ from the
    // fallback font the first layout pass measured against, which otherwise
    // leaves the cta a few px short of its resting position.
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Continuous position across the cards + closing CTA, driven 1:1 by
  // horizontal scroll — no CSS transition, so it never lags behind the
  // scroll amount (same pattern as Selection Standard's panelPos). Docks the
  // closing cta 120px short of the viewport's right edge once fully
  // scrolled, mirroring the 120px inset on the left, rather than sliding a
  // further card-width past the last card or running flush to the edge.
  const offset = Math.min(1, Math.max(0, progress)) * maxOffset;

  return (
    <section className="providers">
      <div className="providers__inner">
        <div className="providers__text">
          <div className="providers__intro">
            <div className="providers__tag">
              <img className="providers__logoicon" src={logoIcon} alt="" aria-hidden="true" />
              Strategy Providers
            </div>
            <RevealLines
              as="h2"
              className="providers__title"
              lines={["Access Selected", "Providers in One Place"]}
              baseDelay={0.52}
            />
          </div>
          <div className="providers__cta">
            <RevealLines
              as="p"
              className="providers__lead"
              lines={["Explore provider profiles, track records, drawdown, and performance data before connecting"]}
              baseDelay={0.52}
            />
            <div className="cta-btn-wrap">
              <Button variant="accent" className="btn--notch-br btn--start">Explore Providers</Button>
              <GradientDot />
            </div>
          </div>
        </div>

        <div className="providers__carousel">
          <div className="providers__viewport" ref={viewportRef}>
            {/* entrance wrapper slides the whole row in from the right */}
            <div className="providers__enter">
              <div
                className="providers__track"
                ref={trackRef}
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

// memo: HomePage re-renders on every scroll tick to update the stage
// transforms; without this each tick would also re-render this whole
// subtree, which never changes unless its own props do.
export default memo(ProvidersSection);
