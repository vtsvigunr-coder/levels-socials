import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "./HomePage.jsx";

test("HomePage renders a home landmark", () => {
  render(<MemoryRouter><HomePage /></MemoryRouter>);
  expect(screen.getByTestId("home")).toBeInTheDocument();
});
