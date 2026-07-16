import { render, screen } from "@testing-library/react";
import GetStartedSection from "./GetStartedSection.jsx";

test("at progress 0, renders the step 1 circle copy and tracker labels", () => {
  render(<GetStartedSection progress={0} />);
  expect(screen.getByText("Choose a Provider")).toBeInTheDocument();
  expect(screen.getByText("Choose")).toBeInTheDocument();
  expect(screen.getByText("Connect")).toBeInTheDocument();
  expect(screen.getByText("Control")).toBeInTheDocument();
});

test("at progress 0, renders the step 1 floating cards", () => {
  render(<GetStartedSection progress={0} />);
  expect(screen.getByText("NHEA EA")).toBeInTheDocument();
  expect(screen.getByText("+21.57%")).toBeInTheDocument();
  expect(screen.getByText("XXXX")).toBeInTheDocument();
});

test("at progress 0.5 (step 2), renders the Connect Capital circle copy and cards", () => {
  render(<GetStartedSection progress={0.5} />);
  expect(screen.getByText("Connect Capital")).toBeInTheDocument();
  expect(screen.getByText("Secure Link")).toBeInTheDocument();
  expect(screen.getByText("Capital Allocation")).toBeInTheDocument();
});

test("at progress 1 (step 3), renders the Monitor Performance circle copy and cards", () => {
  render(<GetStartedSection progress={1} />);
  expect(screen.getByText("Monitor Performance")).toBeInTheDocument();
  expect(screen.getByText("Account Growth")).toBeInTheDocument();
  expect(screen.getByText("+8.6%")).toBeInTheDocument();
});
