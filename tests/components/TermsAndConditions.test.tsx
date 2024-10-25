import { render, screen } from "@testing-library/react";
import TermsAndConditions from "../../src/components/TermsAndConditions";
import userEvent from "@testing-library/user-event";

describe("TermsAndConditions", () => {
  //create a helper function for rendering our component and common parts we want to query
  const renderComponent = () => {
    render(<TermsAndConditions />);
    
    return {
      heading: screen.getByRole("heading"),
      checkbox: screen.getByRole("checkbox"),
      button: screen.getByRole("button"),
    }
  }

  it("should render with correct text and initial state", () => {
    const { heading, checkbox, button } = renderComponent();

    // we don't need to check for heading, checkbox, button to be in the document, since if it isn't the renderComponent will throw an error
    
    expect(heading).toHaveTextContent("Terms & Conditions");
    expect(checkbox).not.toBeChecked();
    expect(button).toHaveTextContent(/submit/i);
    expect(button).toBeDisabled();
  });

  it("should enable the submit button when checkbox is checked", async () => {
    const { checkbox, button } = renderComponent();

    const user = userEvent.setup();
    await user.click(checkbox);

    expect(button).toBeEnabled();
  });
});
