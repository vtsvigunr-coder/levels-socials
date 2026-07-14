import { render, screen } from "@testing-library/react";
import CursorTrail from "./CursorTrail.jsx";

test("renders a canvas overlay", () => {
  render(<CursorTrail />);
  expect(screen.getByTestId("cursor-trail").tagName).toBe("CANVAS");
});

test("does not attach pointer listeners under reduced motion", () => {
  window.matchMedia = (q) => ({
    matches: true, media: q, addEventListener: () => {}, removeEventListener: () => {},
    addListener: () => {}, removeListener: () => {}, onchange: null, dispatchEvent: () => false,
  });
  const addSpy = vi.spyOn(window, "addEventListener");
  render(<CursorTrail />);
  const pointerMoves = addSpy.mock.calls.filter(([type]) => type === "pointermove");
  expect(pointerMoves).toHaveLength(0);
  addSpy.mockRestore();
});
