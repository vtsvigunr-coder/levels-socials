import { render, screen } from "@testing-library/react";
import HowItWorksSection from "./HowItWorksSection.jsx";

test("renders the heading, lead, and CTA", () => {
  render(<HowItWorksSection />);
  expect(screen.getByText("Start Copying in", { exact: false })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "See How it Works" })).toBeInTheDocument();
});
