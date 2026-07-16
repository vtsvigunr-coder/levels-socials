import plusIcon from "../../assets/faq/plus-sign.svg";
import minusIcon from "../../assets/faq/minus-sign.svg";

export default function FAQItem({ item, open, onToggle }) {
  return (
    <div className="faq__item">
      <button type="button" className="faq__itemhead" onClick={onToggle} aria-expanded={open}>
        <span className="faq__itemtext">
          <span className="faq__question">{item.question}</span>
          {open && <span className="faq__answer">{item.answer}</span>}
        </span>
        <img className="faq__toggleicon" src={open ? minusIcon : plusIcon} alt="" aria-hidden="true" />
      </button>
    </div>
  );
}
