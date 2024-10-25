import { render, screen } from "@testing-library/react";
import UserAccount from "../../src/components/UserAccount";
import { User } from "../../src/entities";

describe("UserAccount", () => {
  const user: User = { id: 1, name: "Mosh", isAdmin: true };
  it("should render the edit button if user is an admin", () => {
    render(<UserAccount user={user} />);

    // screen.debug();
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/edit/i);
  });

  it("should not render the edit button if user is not an admin", () => {
    render(<UserAccount user={{ id: 1, name: "Mosh" }} />);

    // screen.debug();
    const button = screen.queryByRole("button");
    expect(button).not.toBeInTheDocument();
  });

  it("should render the user name", () => {
    render(<UserAccount user={user} />);

    // screen.debug();
    const name = screen.getByText(/mosh/i);
    expect(name).toBeInTheDocument();
  });
});

//Notes:
// getByRole is used when you expect the element to be present (e.g., the edit button for an admin user).
// queryByRole is used when you expect the element to be absent (e.g., the edit button for a non-admin user).
