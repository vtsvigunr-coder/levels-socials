import { render, screen } from "@testing-library/react";
import DashboardCard from "./DashboardCard.jsx";

test("renders two stacked copies of the dashboard mockup image", () => {
  const { container } = render(<DashboardCard active={false} />);
  // background photo + the two clipped mockup copies. Two of the three have
  // an empty alt (decorative), which gives them an implicit "presentation"
  // role rather than "img" — querySelectorAll counts all <img> elements
  // regardless of their computed accessible role.
  const images = container.querySelectorAll("img");
  expect(images.length).toBeGreaterThanOrEqual(3);
  expect(screen.getByAltText("Dashboard preview")).toBeInTheDocument();
});
