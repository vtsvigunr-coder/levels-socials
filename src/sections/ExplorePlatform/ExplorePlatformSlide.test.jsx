import { render, screen } from "@testing-library/react";
import ExplorePlatformSlide from "./ExplorePlatformSlide.jsx";
import EXPLORE_PLATFORM_SLIDES from "../../data/explorePlatform.js";

test("renders the tag, full headline text, lead, and CTA for a text-left slide", () => {
  const slide = EXPLORE_PLATFORM_SLIDES[0]; // six-plus, text-left
  render(<ExplorePlatformSlide slide={slide} active={false} />);
  expect(screen.getByText("Explore Platform")).toBeInTheDocument();
  expect(screen.getByText("The bridge between")).toBeInTheDocument();
  expect(screen.getByText("strategy providers")).toBeInTheDocument();
  expect(screen.getByText(slide.lead)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Explore the Platform" })).toBeInTheDocument();
  // renders the matching card (six-plus copy)
  expect(screen.getByText("6+ Month")).toBeInTheDocument();
});

test("renders the card-left layout class for a card-left slide", () => {
  const slide = EXPLORE_PLATFORM_SLIDES[1]; // earned-access, card-left
  const { container } = render(<ExplorePlatformSlide slide={slide} active={false} />);
  expect(container.querySelector(".xp-slide--card-left")).toBeTruthy();
});
