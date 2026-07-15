import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "./HomePage.jsx";

test("HomePage renders a home landmark", () => {
  render(<MemoryRouter><HomePage /></MemoryRouter>);
  expect(screen.getByTestId("home")).toBeInTheDocument();
});

test("renders the Explore Platform stages", () => {
  render(<MemoryRouter><HomePage /></MemoryRouter>);
  expect(screen.getByText("6+ Month")).toBeInTheDocument();
  expect(screen.getByText("Selection Review")).toBeInTheDocument();
  expect(screen.getByText("14 Days")).toBeInTheDocument();
  expect(screen.getAllByText("Explore Platform").length).toBe(4);
});
