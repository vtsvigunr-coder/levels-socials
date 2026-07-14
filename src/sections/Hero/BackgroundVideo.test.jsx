import { render, screen } from "@testing-library/react";
import BackgroundVideo from "./BackgroundVideo.jsx";

test("plays once (muted, no loop) with a poster", () => {
  render(<BackgroundVideo />);
  const video = screen.getByTestId("hero-video");
  expect(video.muted).toBe(true);
  expect(video).not.toHaveAttribute("loop");
  expect(video).toHaveAttribute("playsinline");
  expect(video.getAttribute("poster")).toBeTruthy();
});

test("adds the blur class when blurred", () => {
  render(<BackgroundVideo blurred />);
  expect(screen.getByTestId("hero-video")).toHaveClass("bg-video--blur");
});
