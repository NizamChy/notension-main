// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import notify from "@/utils/notify";
import UserInfoInputs from "./UserInfoInputs";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  useParams: () => ({}),
}));

beforeEach(() => {
  vi.spyOn(notify, "warning").mockImplementation(() => "");
  vi.spyOn(notify, "error").mockImplementation(() => "");
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const typeCode = (code: string) =>
  code.split("").forEach((digit, i) =>
    fireEvent.change(screen.getByLabelText(`Digit ${i + 1}`), { target: { value: digit } }),
  );

describe("UserInfoInputs (old flow: code and details together)", () => {
  const setup = (registerUser = vi.fn().mockResolvedValue(true)) => {
    render(
      <UserInfoInputs
        phone="01711000000"
        userInfo={{ customer_name: "", customer_address: "", alternative_contact_no: "" }}
        otpGenerated="1234"
        sendSms={() => {}}
        progressing={false}
        registerUser={registerUser}
      />,
    );
    return registerUser;
  };

  it("shows the old messages inline and as a toast, without saving", async () => {
    const registerUser = setup();
    fireEvent.change(screen.getByLabelText(/Name/), { target: { value: "Al" } });
    fireEvent.click(screen.getByRole("button", { name: "Log in" }));

    await waitFor(() =>
      expect(notify.warning).toHaveBeenCalledWith("Name must be between 3 and 50 characters."),
    );
    expect(screen.getByText("Name must be between 3 and 50 characters.")).toBeTruthy();
    expect(screen.getByText("Address must be between 5 and 200 characters.")).toBeTruthy();
    expect(screen.getByText("Please enter the verification code.")).toBeTruthy();
    expect(screen.getByLabelText(/Name/).getAttribute("aria-invalid")).toBe("true");
    expect(registerUser).not.toHaveBeenCalled();
  });

  it("refuses a wrong code, then saves the typed details", async () => {
    const registerUser = setup();
    fireEvent.change(screen.getByLabelText(/Name/), { target: { value: "Rina Akter" } });
    fireEvent.change(screen.getByLabelText(/Address/), { target: { value: "House 1, Dhaka" } });
    typeCode("9999");
    fireEvent.click(screen.getByRole("button", { name: "Log in" }));
    await waitFor(() =>
      expect(notify.error).toHaveBeenCalledWith("The verification code is incorrect. Please try again."),
    );
    expect(registerUser).not.toHaveBeenCalled();

    typeCode("1234");
    fireEvent.click(screen.getByRole("button", { name: "Log in" }));
    await waitFor(() =>
      expect(registerUser).toHaveBeenCalledWith(
        { customer_name: "Rina Akter", customer_address: "House 1, Dhaka", alternative_contact_no: "" },
        "Logged in successfully",
      ),
    );
  });
});

describe("UserInfoInputs (new API: code first)", () => {
  it("asks for the 6-digit code before verifying", async () => {
    const verifyOtp = vi.fn().mockResolvedValue({ ok: true, isNew: true });
    render(
      <UserInfoInputs
        phone="01711000000"
        userInfo={{}}
        sendSms={() => {}}
        progressing={false}
        registerUser={vi.fn()}
        verifyOtp={verifyOtp}
      />,
    );
    typeCode("123");
    fireEvent.click(screen.getByRole("button", { name: "Verify" }));
    await waitFor(() =>
      expect(notify.warning).toHaveBeenCalledWith("Please enter the 6-digit verification code."),
    );
    expect(verifyOtp).not.toHaveBeenCalled();

    typeCode("123456");
    fireEvent.click(screen.getByRole("button", { name: "Verify" }));
    await waitFor(() => expect(verifyOtp).toHaveBeenCalledWith("01711000000", "123456"));
    // A new account goes on to the details, which are not checked yet.
    await waitFor(() => expect(screen.getByRole("button", { name: "Save and continue" })).toBeTruthy());
  });
});
