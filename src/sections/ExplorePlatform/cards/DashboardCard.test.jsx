import { render, screen } from "@testing-library/react";
import DashboardCard from "./DashboardCard.jsx";

test("renders two stacked copies of the dashboard mockup image", () => {
  render(<DashboardCard active={false} />);
  const images = screen.getAllByRole("img");
  // background photo + the two clipped mockup copies (one has real alt text)
  expect(images.length).toBeGreaterThanOrEqual(3);
  expect(screen.getByAltText("Dashboard preview")).toBeInTheDocument();
});
