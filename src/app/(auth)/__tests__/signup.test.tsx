import { render, screen, waitFor } from "@testing-library/react";
import Signup from "../signup/page";
import userEvent from "@testing-library/user-event";

describe("Signup", () => {
  test("renders Signup page", () => {
    render(<Signup />);
    expect(
      screen.getByRole("heading", { name: /signup/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Username")).toBeInTheDocument();
    expect(screen.getByText("Password")).toBeInTheDocument();
    expect(screen.getByText("Confirm Password")).toBeInTheDocument();
  });
});

describe("Hide and show password", () => {
  it("should hide password when clicking on the eye icon", async () => {
    render(<Signup />);
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

  it("should hide confirm password when clicking on the slash eye icon", async () => {
    render(<Signup />);
    const eyeIcon = screen.getByRole("button", {
      name: /show confirm password/i,
    });
    const confirmPasswordInput = screen.getByTestId(
      "confirm-password-input"
    ) as HTMLInputElement;

    await waitFor(() => {
      expect(confirmPasswordInput.type).toBe("text");
    });

    userEvent.click(eyeIcon);

    await waitFor(() => {
      expect(confirmPasswordInput.type).toBe("password");
    });
  });
});

describe("handle change", () => {
  it("should update the input value when typing", async () => {
    render(<Signup />);
    const usernameInput = screen.getByLabelText(/username/i);
    userEvent.type(usernameInput, "test username");

    await waitFor(() => {
      expect(usernameInput).toHaveValue("test username");
    });
  });
});
