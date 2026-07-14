import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "./Button.jsx";

test("renders label and variant class, handles click", async () => {
  const onClick = vi.fn();
  render(<Button variant="glass" onClick={onClick}>Create Account</Button>);
  const btn = screen.getByRole("button", { name: "Create Account" });
  expect(btn).toHaveClass("btn", "btn--glass");
  await userEvent.click(btn);
  expect(onClick).toHaveBeenCalledOnce();
});

test("defaults to solid variant", () => {
  render(<Button>Go</Button>);
  expect(screen.getByRole("button", { name: "Go" })).toHaveClass("btn--solid");
});
