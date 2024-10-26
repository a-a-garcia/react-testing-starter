import { render, screen, waitFor } from "@testing-library/react";

import ToastDemo from "../../src/components/ToastDemo";
import userEvent from "@testing-library/user-event";
import { Toaster } from "react-hot-toast";

describe("group", () => {
  it('should render a button with the text "Show Toast"', () => {
    render(
      <>
        <ToastDemo />
        <Toaster />
      </>
    );
    expect(screen.getByText("Show Toast")).toBeInTheDocument();
  });

  it("should show a toast notification when the button is clicked", async () => {
    render(
        <>
          <ToastDemo />
          <Toaster />
        </>
      );

    const button = screen.getByText("Show Toast");
    const user = userEvent.setup();
    await user.click(button);

    expect(screen.getByText(/success/i)).toBeInTheDocument();
  });
});
