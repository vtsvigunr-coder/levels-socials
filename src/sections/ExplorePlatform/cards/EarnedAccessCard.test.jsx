import { render, screen } from "@testing-library/react";
import EarnedAccessCard from "./EarnedAccessCard.jsx";

test("renders the pill copy", () => {
  render(<EarnedAccessCard active={false} />);
  expect(screen.getByText("Selection Review")).toBeInTheDocument();
  expect(screen.getByText("Earned Access")).toBeInTheDocument();
});
