// @vitest-environment jsdom
import type { ReactNode } from "react";
import { cleanup, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getApiClient } from "@/lib/apiClient";
import { ALL_CARE_SERVICE_URL } from "@/api-endpoints/env";
import { DEMO_LOCATIONS } from "@/demo/demoLocations";
import { resetWarnedEndpoints } from "@/lib/api/validate";
import { exploreProviders, exploreServices } from "@/lib/api/allCare";
import { queryKeys } from "@/lib/api/queryKeys";
import { useSessionStore } from "@/stores/sessionStore";
import { useCareProvider, useCareService, useCareServices } from "./useAllCare";

const dhaka = DEMO_LOCATIONS[0];
const loc = { districtId: dhaka.districtId, lat: String(dhaka.latitude), lng: String(dhaka.longitude) };

let qc: QueryClient;
const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={qc}>{children}</QueryClientProvider>
);

beforeEach(() => {
  window.localStorage.setItem("notension-sample-data", "on");
  resetWarnedEndpoints();
  qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  useSessionStore.setState({ districtId: loc.districtId, userLatitude: loc.lat, userLongitude: loc.lng });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  window.localStorage.clear();
});

describe("All Care API on the demo adapter", () => {
  it("every demo answer matches the contract", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { servicesType, sliderByDistrict } = await exploreServices(loc.districtId);
    expect(servicesType.length).toBeGreaterThan(0);
    expect(sliderByDistrict.length).toBeGreaterThan(0);
    for (const service of servicesType.slice(0, 5)) await exploreProviders(service._id, loc);
    expect(warn.mock.calls.map((c) => String(c[0]) + JSON.stringify(c[1]))).toEqual([]);
  });

  it("sends today's provider params", async () => {
    const post = vi
      .spyOn(getApiClient(ALL_CARE_SERVICE_URL), "post")
      .mockResolvedValue({ data: {}, headers: {} });
    vi.spyOn(console, "warn").mockImplementation(() => {});
    await exploreProviders("s1", { districtId: "d", lat: "1", lng: "2" }).catch(() => {});
    expect(post.mock.calls[0][1]).toEqual({ longitude: "2", latitude: "1", district_id: "d", service_id: "s1", page: 1 });
  });

  it("keys services by district", () => {
    expect(queryKeys.allCare.services("d")).toEqual(["allCare", "services", "d"]);
  });
});

describe("All Care hooks", () => {
  it("finds the service and a provider from their URL ids", async () => {
    const list = renderHook(() => useCareServices(), { wrapper });
    await waitFor(() => expect(list.result.current.isLoading).toBe(false));
    // A service that has providers in Dhaka.
    let serviceId = "";
    let providerId = "";
    for (const s of list.result.current.services) {
      const res = await exploreProviders(s._id, loc);
      const first = res.careProviderByDistrict[0] ?? res.nearestCareProvider[0];
      if (first) {
        serviceId = s._id;
        providerId = first._id;
        break;
      }
    }
    expect(serviceId).not.toBe("");

    const service = renderHook(() => useCareService(serviceId), { wrapper });
    expect(service.result.current.service?._id).toBe(serviceId);

    const provider = renderHook(() => useCareProvider(serviceId, providerId), { wrapper });
    await waitFor(() => expect(provider.result.current.isLoading).toBe(false));
    expect(provider.result.current.provider?._id).toBe(providerId);

    const unknown = renderHook(() => useCareProvider(serviceId, "ffffffffffffffffffffffff"), { wrapper });
    await waitFor(() => expect(unknown.result.current.isLoading).toBe(false));
    expect(unknown.result.current.provider).toBeUndefined();
  });
});
