import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Hero from "./Hero.jsx";

const renderHero = () => render(<MemoryRouter><Hero /></MemoryRouter>);

test("renders headline as three separate lines", () => {
  renderHero();
  const lines = document.querySelectorAll(".hero-line");
  expect(lines).toHaveLength(3);
  expect(lines[0]).toHaveTextContent("Social Copy Trading");
  expect(lines[2]).toHaveTextContent("and Control");
});

test("background video plays once (muted, no loop) with poster", () => {
  renderHero();
  const video = screen.getByTestId("hero-video");
  expect(video.muted).toBe(true);
  expect(video).not.toHaveAttribute("loop");
  expect(video).toHaveAttribute("playsinline");
  expect(video.getAttribute("poster")).toBeTruthy();
});

test("renders CTA button and explore affordance", () => {
  renderHero();
  expect(screen.getByRole("button", { name: "Start with Levels Socials" })).toBeInTheDocument();
  expect(screen.getByText("Explore more")).toBeInTheDocument();
});
