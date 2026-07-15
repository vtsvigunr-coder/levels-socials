import { render, screen } from "@testing-library/react";
import FourteenDaysCard from "./FourteenDaysCard.jsx";

test("renders the '14 Days' headline and Trend pill", () => {
  render(<FourteenDaysCard active={false} />);
  expect(screen.getByText("14 Days")).toBeInTheDocument();
  expect(screen.getByText("Trend")).toBeInTheDocument();
});
