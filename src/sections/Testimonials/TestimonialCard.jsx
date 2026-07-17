import StarRating from "./StarRating.jsx";
import logoBadge from "../../assets/testimonials/logo-badge.svg";

export default function TestimonialCard({ testimonial }) {
  const { name, role, rating, quote } = testimonial;

  return (
    <article className="tcard">
      <div className="tcard__top">
        <StarRating rating={rating} />
        <p className="tcard__quote">&ldquo;{quote}&rdquo;</p>
      </div>
      <div className="tcard__bottom">
        <div className="tcard__author">
          <span className="tcard__name">{name}</span>
          <span className="tcard__dot" aria-hidden="true" />
          <span className="tcard__role">{role}</span>
          <img className="tcard__badge" src={logoBadge} alt="" aria-hidden="true" />
        </div>
      </div>
    </article>
  );
}
