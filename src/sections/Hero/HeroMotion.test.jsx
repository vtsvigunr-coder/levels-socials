import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Hero from "./Hero.jsx";

test("still renders three headline lines after motion wiring", () => {
  render(<MemoryRouter><Hero /></MemoryRouter>);
  expect(document.querySelectorAll(".hero-line")).toHaveLength(3);
  expect(document.querySelector(".hero-title")).toBeInTheDocument();
});

test("respects reduced motion (renders content, no crash)", () => {
  window.matchMedia = (q) => ({
    matches: true, media: q, addEventListener: () => {}, removeEventListener: () => {},
    addListener: () => {}, removeListener: () => {}, onchange: null, dispatchEvent: () => false,
  });
  render(<MemoryRouter><Hero /></MemoryRouter>);
  expect(screen.getByRole("button", { name: "Start with Levels Socials" })).toBeInTheDocument();
});
