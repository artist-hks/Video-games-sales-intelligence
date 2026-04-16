import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the gaming dashboard heading", () => {
  render(<App />);
  const heading = screen.getByText(/video games sales intelligence/i);
  expect(heading).toBeInTheDocument();
});
