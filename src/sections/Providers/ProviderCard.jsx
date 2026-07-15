import { RISK_LABEL } from "../../data/providers.js";
import GradientDot from "../../components/GradientDot.jsx";
import chart from "../../assets/card-chart.svg";

export default function ProviderCard({ provider }) {
  const { name, strategy, risk, description, totalRoi, accuracy, drawdown } = provider;

  return (
    <article className="pcard">
      <div className="pcard__top">
        <div className="pcard__info">
          <div className="pcard__head">
            <div className="pcard__name">
              <span className="pcard__accent" aria-hidden="true" />
              <span className="pcard__nametext">
                <span className="pcard__title">{name}</span>
                <span className="pcard__strategy">{strategy}</span>
              </span>
            </div>
            <span className={`risk risk--${risk}`}>
              <span className="risk__dot" aria-hidden="true" />
              {RISK_LABEL[risk]}
            </span>
          </div>
          <p className="pcard__desc">{description}</p>
        </div>

        <div className="pcard__profile">
          <GradientDot />
          <button type="button" className="pcard__profilebtn">View Profile</button>
        </div>
      </div>

      <div className="pcard__bottom">
        <div className="pcard__statscol">
          <div className="pcard__stats">
            <div className="stat">
              <span className="stat__label">Total ROI</span>
              <span className="stat__value">{totalRoi}</span>
            </div>
            <div className="stat">
              <span className="stat__label">Accuracy</span>
              <span className="stat__value">{accuracy}</span>
            </div>
            <div className="stat">
              <span className="stat__label">Drawdown</span>
              <span className="stat__value">{drawdown}</span>
            </div>
          </div>
          <a href="#risk" className="pcard__disclaimer">Risk Disclaimer</a>
        </div>

        <img className="pcard__chart" src={chart} alt="" aria-hidden="true" />
      </div>
    </article>
  );
}
