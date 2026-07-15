import { render } from "@testing-library/react";
import EarnedAccessCard from "./EarnedAccessCard.jsx";

test("renders the card image", () => {
  const { container } = render(<EarnedAccessCard active={false} />);
  expect(container.querySelector("img.xp-card__img")).toBeInTheDocument();
});
