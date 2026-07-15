import logoIcon from "../../assets/logo-icon.svg";

export default function KeyNumberCard({ card }) {
  const { chart, footer } = card;

  const body = (
    <>
      {card.topIcon && (
        <span className="kn-card__topicon">
          <img className="kn-card__topicon-img kn-card__topicon-img--white" src={logoIcon} alt="" aria-hidden="true" />
          <img className="kn-card__topicon-img kn-card__topicon-img--color" src={logoIcon} alt="" aria-hidden="true" />
        </span>
      )}

      <div className="kn-card__head">
        <div className="kn-card__metric">
          <span className="kn-card__value">{card.metric}</span>
          <span className="kn-card__label">{card.label}</span>
        </div>
        <button type="button" className="kn-card__disclaimer">Risk Disclaimer</button>
      </div>

      <div className={`kn-chart kn-chart--${chart.variant}`}>
        <img className="kn-chart__img kn-chart__img--default" src={chart.default} alt="" aria-hidden="true" />
        <img className="kn-chart__img kn-chart__img--hover" src={chart.hover} alt="" aria-hidden="true" />
        {chart.tag && <span className="kn-chart__tag">{chart.tag}</span>}
        {chart.axis && (
          <div className="kn-chart__axis" aria-hidden="true">
            {chart.axis.map((a) => (
              <span key={a}>{a}</span>
            ))}
          </div>
        )}
      </div>

      {footer.type === "text" && <p className="kn-card__foot">{footer.text}</p>}
      {footer.type === "pill" && (
        <div className="kn-card__pill">
          <span>{footer.text}</span>
          <span className="kn-card__pillicon">
            <img className="kn-card__pillicon-img kn-card__pillicon-img--white" src={logoIcon} alt="" aria-hidden="true" />
            <img className="kn-card__pillicon-img kn-card__pillicon-img--color" src={logoIcon} alt="" aria-hidden="true" />
          </span>
        </div>
      )}
    </>
  );

  return (
    <article className={`kn-card kn-card--${card.id}`} data-theme={card.theme}>
      <div className="kn-card__bg" style={{ backgroundImage: `url(${card.img})` }} aria-hidden="true" />
      <div className="kn-card__overlay" aria-hidden="true" />
      {card.plate ? <div className="kn-card__plate">{body}</div> : body}
    </article>
  );
}
