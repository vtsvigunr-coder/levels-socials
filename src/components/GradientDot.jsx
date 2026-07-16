import arrowUpRight from "../assets/icons/arrow-up-right.svg";
import "./GradientDot.css";

// Small orange dot that sits at a button's sharp notch corner; on hover it
// grows into an arrow (see GradientDot.css).
export default function GradientDot() {
  return (
    <span className="gradient-dot" aria-hidden="true">
      <img src={arrowUpRight} alt="" className="gradient-dot__icon" />
    </span>
  );
}
