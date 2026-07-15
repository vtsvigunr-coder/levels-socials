import { render } from "@testing-library/react";
import SixPlusCard from "./SixPlusCard.jsx";

test("renders the card image", () => {
  const { container } = render(<SixPlusCard active={false} />);
  expect(container.querySelector("img.xp-card__img")).toBeInTheDocument();
});
