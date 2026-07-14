import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CompanyMenu from "./CompanyMenu.jsx";

test("renders nothing when closed", () => {
  const { container } = render(<CompanyMenu open={false} onClose={() => {}} />);
  expect(container).toBeEmptyDOMElement();
});

test("renders all 7 items with active + badge when open", () => {
  render(<CompanyMenu open onClose={() => {}} />);
  expect(screen.getAllByRole("menuitem")).toHaveLength(7);
  expect(screen.getByText("About").closest(".menu-item")).toHaveClass("menu-item--active");
  expect(screen.getByText("New")).toBeInTheDocument();
  expect(screen.getByText("Read client experiences")).toBeInTheDocument();
});

test("calls onClose on Escape", async () => {
  const onClose = vi.fn();
  render(<CompanyMenu open onClose={onClose} />);
  await userEvent.keyboard("{Escape}");
  expect(onClose).toHaveBeenCalled();
});
