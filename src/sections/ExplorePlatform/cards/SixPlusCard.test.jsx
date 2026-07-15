import { render, screen } from "@testing-library/react";
import SixPlusCard from "./SixPlusCard.jsx";

test("renders the static gauge copy regardless of active state", () => {
  render(<SixPlusCard active={false} />);
  expect(screen.getByText("6+ Month")).toBeInTheDocument();
  expect(screen.getByText("Verified Performance")).toBeInTheDocument();
  expect(screen.getByText("Minimum trading history required")).toBeInTheDocument();
});

test("timer reads 00:00 while inactive", () => {
  render(<SixPlusCard active={false} />);
  expect(screen.getByText("00:00")).toBeInTheDocument();
});
