import { render, screen, waitFor } from "@testing-library/react";
import Login from "../login/page";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

describe("Login", () => {
  it("should render login form", () => {
    render(<Login />);

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(
      screen.getByTestId("password-input") as HTMLInputElement
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("should hide password when clicking on the eye icon", async () => {
    // By default, the password input should be of type "text"
    render(<Login />);
    const eyeIcon = screen.getByRole("button", { name: /show password/i });
    const passwordInput = screen.getByTestId(
      "password-input"
    ) as HTMLInputElement;

    await waitFor(() => {
      expect(passwordInput.type).toBe("text");
    });

    userEvent.click(eyeIcon);

    await waitFor(() => {
      expect(passwordInput.type).toBe("password");
    });
  });
});

describe("handle change", () => {
  it("should update the input value when typing", async () => {
    render(<Login />);
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByTestId(
      "password-input"
    ) as HTMLInputElement;

    userEvent.type(usernameInput, "test username");
    userEvent.type(passwordInput, "test password");

    waitFor(() => {
      expect(usernameInput).toHaveValue("test username");
      expect(passwordInput).toHaveValue("test password");
    });
  });
});
