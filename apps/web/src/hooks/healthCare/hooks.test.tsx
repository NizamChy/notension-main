// @vitest-environment jsdom
import type { ReactNode } from "react";
import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getApiClient } from "@/lib/apiClient";
import { HEALTH_CARE_URL } from "@/api-endpoints/env";
import { DEMO_LOCATIONS } from "@/demo/demoLocations";
import { DEMO_CHAMBERS } from "@/demo/modules/healthCare/data";
import { resetWarnedEndpoints } from "@/lib/api/validate";
import type { Chamber } from "@/lib/api/healthCare";
import { useHealthStore } from "@/stores/healthStore";
import { useSessionStore } from "@/stores/sessionStore";
import {
  bookingPath,
  chamberAt,
  nextPage,
  useBookingChamber,
  useDoctorsByDept,
  useFindDoctor,
} from "./useDoctors";
import { useCentersByDistrict, useConsultationCenter } from "./useCenters";
import { useBookAppointment, usePatients } from "./usePatients";

const dhaka = DEMO_LOCATIONS[0];
const chambers = DEMO_CHAMBERS as Chamber[];
const chamber = chambers.find((c) => c.district_id === dhaka.districtId && c.book_an_appointment)!;

let search = new URLSearchParams();
const push = vi.fn();
vi.mock("next/navigation", () => ({
  useSearchParams: () => search,
  useRouter: () => ({ push }),
}));

let qc: QueryClient;
const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={qc}>{children}</QueryClientProvider>
);

beforeEach(() => {
  window.localStorage.setItem("notension-sample-data", "on");
  resetWarnedEndpoints();
  qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  useSessionStore.setState({
    districtId: dhaka.districtId,
    userLatitude: String(dhaka.latitude),
    userLongitude: String(dhaka.longitude),
    userInfo: { _id: "65a1d0c0e4b0a1b2c3d4e5f6", contact_no: "+8801700000000" },
  });
  useHealthStore.getState().clear();
  search = new URLSearchParams();
  push.mockReset();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  window.localStorage.clear();
});

describe("paging", () => {
  it("asks for another page only after a full one", () => {
    expect(nextPage(new Array(20).fill(0), [[]])).toBe(2);
    expect(nextPage(new Array(19).fill(0), [[], []])).toBeUndefined();
  });

  it("loads the department's doctors and stops on a short page", async () => {
    const { result } = renderHook(() => useDoctorsByDept(chamber.deptInfo._id), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.doctors.length).toBeGreaterThan(0);
    expect(result.current.doctors.length < 20).toBe(!result.current.hasMore);
  });
});

describe("doctor home and centres", () => {
  it("reads departments and banners for the district", async () => {
    const { result } = renderHook(() => useFindDoctor(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.departments.length).toBeGreaterThan(0);
    expect(result.current.findDoctorBanner.length).toBeGreaterThan(0);
  });

  it("gives a hospital listing with its banner", async () => {
    const { result } = renderHook(() => useCentersByDistrict("Hospital"), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.centers.length).toBeGreaterThan(0);
    expect(result.current.centers.every((c) => c.center_type === "Hospital")).toBe(true);
  });

  it("explores a centre, and says not found for an unknown one", async () => {
    const centerId = chamber.consultationCenterInfo._id;
    const known = renderHook(() => useConsultationCenter(centerId), { wrapper });
    await waitFor(() => expect(known.result.current.isLoading).toBe(false));
    expect(known.result.current.center?._id).toBe(centerId);
    expect(known.result.current.notFound).toBe(false);

    const unknown = renderHook(() => useConsultationCenter("6650ffffffffffffffffffff"), { wrapper });
    await waitFor(() => expect(unknown.result.current.isLoading).toBe(false));
    expect(unknown.result.current.notFound).toBe(true);
  });
});

describe("booking", () => {
  it("finds the chamber from the booking URL", async () => {
    const centerId = chamber.consultationCenterInfo._id;
    const url = new URL(bookingPath(chamber.doctorInfo._id, centerId), "http://x");
    search = url.searchParams;
    const { result } = renderHook(() => useBookingChamber(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.chamber?._id).toBe(chamber._id);
    expect(chamberAt([chamber], "null")?._id).toBe(chamber._id);
  });

  it("says there is no doctor without one in the URL", () => {
    const { result } = renderHook(() => useBookingChamber(), { wrapper });
    expect(result.current.hasDoctor).toBe(false);
  });

  it("registers a patient, books once for repeat clicks, and saves the appointment", async () => {
    const patients = renderHook(() => usePatients(), { wrapper });
    let ok = false;
    await act(async () => {
      ok = await patients.result.current.register({ patient_name: "Rina Akter", contact: "01700000000" });
    });
    expect(ok).toBe(true);
    const patient = useHealthStore.getState().patients[0];
    expect(patient.patient_name).toBe("Rina Akter");

    const post = vi.spyOn(getApiClient(HEALTH_CARE_URL), "post");
    const booking = renderHook(() => useBookAppointment(), { wrapper });
    const request = {
      doctor_info: chamber.doctorInfo._id,
      doctor_name: chamber.doctorInfo.doctor_name,
      consultation_center_info: chamber.consultationCenterInfo._id,
      consultation_limit: chamber.consultation_limit_per_slot,
      appointment_date: "2026-11-24",
      appointment_day: "Tuesday",
      time_slot: "10:00 AM - 01:00 PM",
      patient_info: { id: patient._id, patient_name: "Rina Akter" },
    };
    let results: boolean[] = [];
    await act(async () => {
      results = await Promise.all([booking.result.current.book(request), booking.result.current.book(request)]);
    });
    expect(results).toEqual([true, false]);
    expect(post).toHaveBeenCalledTimes(1);
    // The display-only fields are not sent.
    expect(post.mock.calls[0][1]).not.toHaveProperty("doctor_name");

    const saved = useHealthStore.getState().appointments;
    expect(saved).toHaveLength(1);
    expect(saved[0].doctor_name).toBe(chamber.doctorInfo.doctor_name);
    expect(push).toHaveBeenCalledWith("/medical-services/doctor/booked-appointment");
  });
});
