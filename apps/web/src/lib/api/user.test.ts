import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getApiClient } from "@/lib/apiClient";
import { USER_URL } from "@/api-endpoints/env";
import { DEMO_USER_CONTACT, DEMO_USER_NAME } from "@/demo/demoUser";
import { ContractError, resetWarnedEndpoints } from "./validate";
import {
  demoLogin,
  logoutCustomer,
  saveProfile,
  sendOtp,
  sendOtpLegacy,
  verifyOtp,
  type Customer,
} from "./user";

beforeEach(() => {
  const ls = new Map([["notension-sample-data", "on"]]);
  vi.stubGlobal("window", {
    localStorage: {
      getItem: (k: string) => ls.get(k) ?? null,
      setItem: (k: string, v: string) => void ls.set(k, v),
      removeItem: (k: string) => void ls.delete(k),
    },
  });
  resetWarnedEndpoints();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

// What apps/api's loadCustomer returns.
const apiCustomer: Customer = {
  _id: "u1",
  custom_id: "CUS0000009",
  customer_name: "Rina",
  customer_address: "Road 1, Dhaka",
  email: "",
  contact_no: "01711000000",
  alternative_contact_no: "",
  district_id: "303030303030303030303030",
  district_name_by_location: "",
  district_area_id: "303030303030303030303030",
  district_subarea_id: "303030303030303030303030",
  ref_contact: "",
  location: null,
  roles: ["customer"],
};

const mockPost = (data: unknown) =>
  vi.spyOn(getApiClient(USER_URL), "post").mockResolvedValue({ data, headers: {} });

describe("user API on the demo adapter (old flow)", () => {
  it("looks up, registers and updates a customer; demo answers match the contract", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    const demo = await sendOtpLegacy({ contact_no: DEMO_USER_CONTACT });
    expect(demo.user_exist).toBe(true);
    expect(demo.result?.customer_name).toBe(DEMO_USER_NAME);

    const unknown = await sendOtpLegacy({ contact_no: "01999000111" });
    expect(unknown).toMatchObject({ user_exist: false, result: null });

    const saved = await saveProfile({
      contact_no: "01999000111",
      customer_name: "New Customer",
      customer_address: "House 1, Dhaka",
      longitude: "23.79",
      latitude: "90.41",
    });
    expect(saved.result?.customer_name).toBe("New Customer");
    // [latitude, longitude]: the app sends them swapped.
    expect(saved.result?.location?.coordinates).toEqual([23.79, 90.41]);

    expect(warn).not.toHaveBeenCalled();
  });

  it("rejects an invalid number like the API", async () => {
    await expect(sendOtpLegacy({ contact_no: "123" })).rejects.toMatchObject({
      response: { status: 400 },
    });
  });
});

describe("user API requests (new API)", () => {
  it("sends the number, code and nothing else", async () => {
    const post = mockPost({ success: true, message: "Demo mode", otp_delivery: "response", demo_otp: "123456" });
    expect((await sendOtp("01711000000")).demo_otp).toBe("123456");
    expect(post.mock.calls[0].slice(0, 2)).toEqual(["/api/v1/customer/send-otp", { contact_no: "01711000000" }]);

    post.mockResolvedValue({ data: { success: true, message: "Login successful", is_new: false, result: apiCustomer }, headers: {} });
    expect((await verifyOtp("01711000000", "123456")).result?._id).toBe("u1");
    expect(post.mock.calls[1].slice(0, 2)).toEqual([
      "/api/v1/customer/verify-otp",
      { contact_no: "01711000000", otp: "123456" },
    ]);

    expect((await demoLogin()).is_new).toBe(false);
    expect(post.mock.calls[2][0]).toBe("/api/v1/customer/demo-login");

    post.mockResolvedValue({ data: { success: true, message: "Profile saved", result: apiCustomer }, headers: {} });
    expect((await saveProfile({ customer_name: "Rina" })).result?.roles).toEqual(["customer"]);

    post.mockResolvedValue({ data: { success: true, message: "Logged out" }, headers: {} });
    expect((await logoutCustomer()).message).toBe("Logged out");
  });

  it("throws a ContractError for a live answer that breaks the contract", async () => {
    mockPost({ success: true, message: "Login successful", result: apiCustomer });
    await expect(verifyOtp("01711000000", "123456")).rejects.toBeInstanceOf(ContractError);
  });
});
