export default function WhyCard({ item, style }) {
  const { title, description, image } = item;

  return (
    <article className="whycard" style={style}>
      <div className="whycard__text">
        <h3 className="whycard__title">{title}</h3>
        <p className="whycard__desc">{description}</p>
      </div>
      <img className="whycard__image" src={image} alt="" aria-hidden="true" />
    </article>
  );
}
