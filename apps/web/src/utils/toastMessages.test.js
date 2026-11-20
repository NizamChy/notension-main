import { describe, expect, it } from "vitest";
import {
  GENERIC_ERROR,
  errorMessage,
  friendlyMessage,
} from "./toastMessages";

describe("friendlyMessage", () => {
  it("keeps a readable server message", () => {
    expect(friendlyMessage("Appointment booked", "x")).toBe("Appointment booked");
  });

  it("falls back for missing, empty or technical text", () => {
    expect(friendlyMessage(undefined, "Fallback")).toBe("Fallback");
    expect(friendlyMessage("   ", "Fallback")).toBe("Fallback");
    expect(friendlyMessage("undefined", "Fallback")).toBe("Fallback");
    expect(
      friendlyMessage("Request failed with status code 500", "Fallback")
    ).toBe("Fallback");
    expect(friendlyMessage("TypeError: x is not a function")).toBe(
      GENERIC_ERROR
    );
    expect(friendlyMessage("<html><body>502</body></html>")).toBe(
      GENERIC_ERROR
    );
  });
});

describe("errorMessage", () => {
  it("reads the API message from an axios error", () => {
    const error = { response: { data: { message: "Invalid code" } } };
    expect(errorMessage(error)).toBe("Invalid code");
  });

  it("falls back when there is no response", () => {
    expect(errorMessage(new Error("Network Error"), "Try again")).toBe(
      "Try again"
    );
  });
});
