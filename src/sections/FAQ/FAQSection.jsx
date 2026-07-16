import { useState } from "react";
import CategoryTabs from "./CategoryTabs.jsx";
import FAQItem from "./FAQItem.jsx";
import Button from "../../components/Button.jsx";
import GradientDot from "../../components/GradientDot.jsx";
import FAQ_ITEMS from "../../data/faq.js";
import logoIcon from "../../assets/logo-icon.svg";
import chatIcon from "../../assets/faq/message-multiple-01.svg";
import "./FAQ.css";

export default function FAQSection({ active = false }) {
  const [category, setCategory] = useState("all");
  const [openId, setOpenId] = useState(FAQ_ITEMS[1].id);

  const visibleItems = category === "all" ? FAQ_ITEMS : FAQ_ITEMS.filter((item) => item.category === category);

  const handleCategoryChange = (id) => {
    setCategory(id);
    setOpenId(null);
  };

  return (
    <section className="faq" data-active={active ? "true" : "false"}>
      <div className="faq__inner">
        <div className="faq__left">
          <div className="faq__intro">
            <div className="faq__tag">
              <img className="faq__logoicon" src={logoIcon} alt="" aria-hidden="true" />
              FAQs
            </div>
            <h2 className="faq__title">Frequently Asked Questions</h2>
          </div>

          <div className="faq__cta">
            <img className="faq__ctaicon" src={chatIcon} alt="" aria-hidden="true" />
            <p className="faq__ctaheading">Still have questions?</p>
            <p className="faq__ctatext">Visit the Help Center or speak with our team</p>
            <div className="cta-btn-wrap">
              <Button variant="solid" className="btn--notch-br faq__ctabtn">Explore Help Center</Button>
              <GradientDot />
            </div>
          </div>
        </div>

        <div className="faq__right">
          <CategoryTabs active={category} onChange={handleCategoryChange} />
          <div className="faq__list">
            {visibleItems.map((item) => (
              <FAQItem
                key={item.id}
                item={item}
                open={openId === item.id}
                onToggle={() => setOpenId((cur) => (cur === item.id ? null : item.id))}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
