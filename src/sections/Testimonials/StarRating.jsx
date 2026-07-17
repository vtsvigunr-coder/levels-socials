import GlassSurface from "../../components/GlassSurface.jsx";
import fullStar from "../../assets/testimonials/full-star.svg";
import halfStar from "../../assets/testimonials/star.svg";

export default function StarRating({ rating }) {
  const full = Math.floor(rating);
  const hasHalf = rating % 1 !== 0;
  const stars = Array.from({ length: 5 }, (_, i) => (i < full ? "full" : i === full && hasHalf ? "half" : null));

  return (
    <GlassSurface as="div" radius={12} className="starrating">
      <span className="starrating__value">{rating.toFixed(1)}</span>
      <span className="starrating__stars">
        {stars.map((kind, i) =>
          kind ? <img key={i} className="starrating__star" src={kind === "full" ? fullStar : halfStar} alt="" aria-hidden="true" /> : null
        )}
      </span>
    </GlassSurface>
  );
}
