import { render } from "@testing-library/react";
import DashboardCard from "./DashboardCard.jsx";

test("renders the card image", () => {
  const { container } = render(<DashboardCard active={false} />);
  expect(container.querySelector("img.xp-card__img")).toBeInTheDocument();
});
