import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "./HomePage.jsx";

test("HomePage renders a home landmark", () => {
  render(<MemoryRouter><HomePage /></MemoryRouter>);
  expect(screen.getByTestId("home")).toBeInTheDocument();
});

test("renders the Explore Platform stages", () => {
  const { container } = render(<MemoryRouter><HomePage /></MemoryRouter>);
  expect(screen.getAllByText("Explore Platform").length).toBe(4);
  expect(container.querySelectorAll("img.xp-card__img").length).toBe(4);
});
