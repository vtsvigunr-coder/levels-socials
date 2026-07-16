import allIcon from "../../assets/faq/all.svg";
import gettingStartedIcon from "../../assets/faq/getting-started.svg";
import copyTradingIcon from "../../assets/faq/copy-trading.svg";
import strategyProvidersIcon from "../../assets/faq/strategy-providers.svg";
import { FAQ_CATEGORIES } from "../../data/faq.js";

const ICONS = {
  all: allIcon,
  "getting-started": gettingStartedIcon,
  "copy-trading": copyTradingIcon,
  "strategy-providers": strategyProvidersIcon,
};

export default function CategoryTabs({ active, onChange }) {
  return (
    <div className="faq__tabs">
      {FAQ_CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          type="button"
          className={`faq__tab ${active === cat.id ? "faq__tab--active" : ""}`}
          onClick={() => onChange(cat.id)}
        >
          <img className="faq__tabicon" src={ICONS[cat.icon]} alt="" aria-hidden="true" />
          {cat.label}
        </button>
      ))}
    </div>
  );
}
