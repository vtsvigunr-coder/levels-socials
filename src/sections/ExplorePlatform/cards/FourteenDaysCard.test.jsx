import { render } from "@testing-library/react";
import FourteenDaysCard from "./FourteenDaysCard.jsx";

test("renders the card image", () => {
  const { container } = render(<FourteenDaysCard active={false} />);
  expect(container.querySelector("img.xp-card__img")).toBeInTheDocument();
});
