import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import Header from "./Header.jsx";

const renderHeader = () => render(<MemoryRouter><Header /></MemoryRouter>);

test("renders logo, nav items and auth actions", () => {
  renderHeader();
  expect(screen.getByAltText("Levels Socials")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /company/i })).toBeInTheDocument();
  expect(screen.getByText("Blog")).toBeInTheDocument();
  expect(screen.getByText("Help Center")).toBeInTheDocument();
  expect(screen.getByText("Contact")).toBeInTheDocument();
  expect(screen.getByText("Login")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Create Account" })).toBeInTheDocument();
});

test("opens the Company menu on hover and closes on leave", async () => {
  renderHeader();
  const company = screen.getByRole("button", { name: /company/i });
  expect(company).toHaveAttribute("aria-expanded", "false");
  expect(screen.queryByRole("menu")).toBeNull();
  await userEvent.hover(company);
  expect(company).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByRole("menu")).toBeInTheDocument();
  await userEvent.unhover(company);
  await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
});
