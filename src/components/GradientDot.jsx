import arrowUpRight from "../assets/icons/arrow-up-right.svg";

// Small orange dot that sits at a button's sharp notch corner; on hover it
// grows into an arrow (see .gradient-dot rules in Hero.css).
export default function GradientDot() {
  return (
    <span className="gradient-dot" aria-hidden="true">
      <img src={arrowUpRight} alt="" className="gradient-dot__icon" />
    </span>
  );
}
