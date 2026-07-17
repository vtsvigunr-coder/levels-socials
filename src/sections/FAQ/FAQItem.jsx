import plusIcon from "../../assets/faq/plus-sign.svg";
import minusIcon from "../../assets/faq/minus-sign.svg";

export default function FAQItem({ item, open, onToggle }) {
  return (
    <div className="faq__item">
      <button type="button" className="faq__itemhead" onClick={onToggle} aria-expanded={open}>
        <span className="faq__itemtext">
          <span className="faq__question">{item.question}</span>
          {/* Always mounted (never conditionally rendered) so grid-template-rows
              can animate 0fr <-> 1fr on open/close — a smooth height reveal
              instead of the answer just popping in and out. */}
          <span className={`faq__answerwrap${open ? " faq__answerwrap--open" : ""}`} aria-hidden={!open}>
            <span className="faq__answerinner">
              <span className="faq__answer">{item.answer}</span>
            </span>
          </span>
        </span>
        <img className="faq__toggleicon" src={open ? minusIcon : plusIcon} alt="" aria-hidden="true" />
      </button>
    </div>
  );
}
