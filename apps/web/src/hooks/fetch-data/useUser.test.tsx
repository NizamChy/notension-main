// @vitest-environment jsdom
import type { ReactNode } from "react";
import { act, cleanup, renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getApiClient } from "@/lib/apiClient";
import { USER_URL } from "@/api-endpoints/env";
import { DEMO_USER_CONTACT, DEMO_USER_NAME } from "@/demo/demoUser";
import { DEMO_LOCATIONS } from "@/demo/demoLocations";
import { resetWarnedEndpoints } from "@/lib/api/validate";
import { initialSessionState, useSessionStore } from "@/stores/sessionStore";
import notify from "@/utils/notify";
import { isLiveLogin, useUser } from "./useUser";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

const dhaka = DEMO_LOCATIONS[0];

let qc: QueryClient;
const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={qc}>{children}</QueryClientProvider>
);

beforeEach(() => {
  window.localStorage.setItem("notension-sample-data", "on");
  resetWarnedEndpoints();
  qc = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  useSessionStore.setState({
    ...initialSessionState,
    currentUserLocation: {
      userLatitude: String(dhaka.latitude),
      userLongitude: String(dhaka.longitude),
      districtId: dhaka.districtId,
      districtName: dhaka.districtName,
    },
    userLatitude: String(dhaka.latitude),
    userLongitude: String(dhaka.longitude),
  });
  push.mockReset();
  vi.spyOn(notify, "success").mockImplementation(() => "");
  vi.spyOn(notify, "error").mockImplementation(() => "");
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  window.localStorage.clear();
});

describe("useUser on demo data (old flow)", () => {
  it("uses the old flow when sample data is chosen", () => {
    expect(isLiveLogin()).toBe(false);
  });

  it("logs in as the demo user", async () => {
    const { result } = renderHook(() => useUser(), { wrapper });
    let ok = false;
    await act(async () => {
      ok = await result.current.loginAsDemoUser();
    });
    expect(ok).toBe(true);
    const { userInfo, isLoggedin } = useSessionStore.getState();
    expect(isLoggedin).toBe(true);
    expect(userInfo.customer_name).toBe(DEMO_USER_NAME);
    expect(notify.success).toHaveBeenCalledWith(`Logged in as ${DEMO_USER_NAME}`);
    expect(result.current.progressing).toBe(false);
  });

  it("finds an existing account on send-otp and logs in with the form's details", async () => {
    const { result } = renderHook(() => useUser(), { wrapper });
    await act(async () => {
      expect(await result.current.getOtp({ contact_no: DEMO_USER_CONTACT })).toBe(true);
    });
    expect(result.current.isUserRegistered).toBe(true);
    expect(result.current.userInfo.customer_name).toBe(DEMO_USER_NAME);

    const post = vi.spyOn(getApiClient(USER_URL), "post");
    await act(async () => {
      expect(
        await result.current.registerUser(
          { customer_name: DEMO_USER_NAME, customer_address: "New Road 7, Dhaka", alternative_contact_no: "" },
          "Logged in successfully",
        ),
      ).toBe(true);
    });
    // The account fields plus the swapped location go to /register.
    expect(post.mock.calls[0][1]).toMatchObject({
      contact_no: DEMO_USER_CONTACT,
      customer_address: "New Road 7, Dhaka",
      longitude: String(dhaka.latitude),
      latitude: String(dhaka.longitude),
      district_id: dhaka.districtId,
    });
    expect(useSessionStore.getState().userInfo.customer_address).toBe("New Road 7, Dhaka");
    expect(notify.success).toHaveBeenCalledWith("Logged in successfully");
  });

  it("reports a failed send-otp", async () => {
    const { result } = renderHook(() => useUser(), { wrapper });
    await act(async () => {
      expect(await result.current.getOtp({ contact_no: "123" })).toBe(false);
    });
    expect(notify.error).toHaveBeenCalledWith("We couldn't send the code. Please try again.");
  });

  it("logs out and goes home", async () => {
    useSessionStore.getState().login({ _id: "u1" });
    const { result } = renderHook(() => useUser(), { wrapper });
    await act(async () => {
      await result.current.handleUserLogout();
    });
    expect(useSessionStore.getState().isLoggedin).toBe(false);
    expect(push).toHaveBeenCalledWith("/");
  });
});
