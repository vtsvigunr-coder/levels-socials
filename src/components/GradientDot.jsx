import arrowUpRight from "../assets/icons/arrow-up-right.svg";
import "./GradientDot.css";

// Small orange dot that sits at a button's sharp notch corner; on hover it
// grows into an arrow (see GradientDot.css). The footprint is a fixed 36x36
// box at all times — only `.gradient-dot__blob` scales — so nothing here
// ever changes layout (width/height/reflow) and neighboring content never
// shifts. The icon is a sibling of the blob, not a descendant of it, so its
// own 20x20 size stays crisp instead of getting stretched by the blob's scale.
export default function GradientDot() {
  return (
    <span className="gradient-dot" aria-hidden="true">
      <span className="gradient-dot__blob" />
      <img src={arrowUpRight} alt="" className="gradient-dot__icon" />
    </span>
  );
}
