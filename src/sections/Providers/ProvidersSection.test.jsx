import { render, screen } from "@testing-library/react";
import ProvidersSection from "./ProvidersSection.jsx";
import PROVIDERS from "../../data/providers.js";

test("renders all provider cards and the section heading", () => {
  render(<ProvidersSection />);
  expect(screen.getByText("Access Selected", { exact: false })).toBeInTheDocument();
  expect(screen.getByText("Aurix - Pulse")).toBeInTheDocument();
  expect(screen.getByText("GBP Master")).toBeInTheDocument();
  // one View Profile button per card
  expect(screen.getAllByRole("button", { name: "View Profile" })).toHaveLength(PROVIDERS.length);
});

test("renders progress bar and nav arrows; prev disabled at start", () => {
  render(<ProvidersSection />);
  expect(screen.getByRole("progressbar")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /previous providers/i })).toBeDisabled();
  expect(screen.getByRole("button", { name: /next providers/i })).toBeInTheDocument();
});

test("first card shows its risk badge and metrics", () => {
  render(<ProvidersSection />);
  expect(screen.getAllByText("Low Risk").length).toBeGreaterThan(0);
  expect(screen.getAllByText("Medium Risk").length).toBeGreaterThan(0);
  expect(screen.getByText("+3077.55%")).toBeInTheDocument();
  expect(screen.getAllByText("Total ROI").length).toBe(PROVIDERS.length);
});
