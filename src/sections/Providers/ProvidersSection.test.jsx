import { render, screen } from "@testing-library/react";
import ProvidersSection from "./ProvidersSection.jsx";
import PROVIDERS from "../../data/providers.js";

test("renders exactly 3 provider cards and the section heading", () => {
  render(<ProvidersSection />);
  expect(screen.getByText("Access Selected", { exact: false })).toBeInTheDocument();
  expect(PROVIDERS).toHaveLength(3);
  expect(screen.getByText("Aurix - Pulse")).toBeInTheDocument();
  // one View Profile button per card
  expect(screen.getAllByRole("button", { name: "View Profile" })).toHaveLength(PROVIDERS.length);
});

test("renders the closing 'Start with Levels Socials' link after the cards, with no slider controls", () => {
  render(<ProvidersSection />);
  expect(screen.getByRole("link", { name: /start with levels socials/i })).toBeInTheDocument();
  expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /previous providers/i })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /next providers/i })).not.toBeInTheDocument();
});

test("first card shows its risk badge and metrics", () => {
  render(<ProvidersSection />);
  expect(screen.getAllByText("Low Risk").length).toBeGreaterThan(0);
  expect(screen.getAllByText("Medium Risk").length).toBeGreaterThan(0);
  expect(screen.getByText("+3077.55%")).toBeInTheDocument();
  expect(screen.getAllByText("Total ROI").length).toBe(PROVIDERS.length);
});
