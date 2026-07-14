import { render, screen } from "@testing-library/react";
import GlassSurface from "./GlassSurface.jsx";

test("renders children inside a .glass element and forwards props", () => {
  render(<GlassSurface data-testid="g" aria-label="panel">hi</GlassSurface>);
  const el = screen.getByTestId("g");
  expect(el).toHaveClass("glass");
  expect(el).toHaveAttribute("aria-label", "panel");
  expect(el).toHaveTextContent("hi");
});

test("renders as a custom element and applies radius var", () => {
  render(<GlassSurface as="nav" radius={40} data-testid="g2">x</GlassSurface>);
  const el = screen.getByTestId("g2");
  expect(el.tagName).toBe("NAV");
  expect(el.style.getPropertyValue("--glass-radius")).toBe("40px");
});
