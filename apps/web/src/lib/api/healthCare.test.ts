import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getApiClient } from "@/lib/apiClient";
import { HEALTH_CARE_URL } from "@/api-endpoints/env";
import { DEMO_LOCATIONS } from "@/demo/demoLocations";
import { DEMO_CENTERS, DEMO_CHAMBERS } from "@/demo/modules/healthCare/data";
import { resetWarnedEndpoints } from "./validate";
import { queryKeys } from "./queryKeys";
import {
  bookAppointment,
  exploreCenter,
  exploreFindDoctor,
  getCentersByDistrict,
  getDoctorProfile,
  getDoctorsByCenter,
  getDoctorsByDept,
  getNearestCenters,
  getNearestDoctors,
  getPatients,
  managePatient,
  registerPatient,
  searchCenters,
  type Chamber,
} from "./healthCare";

const dhaka = DEMO_LOCATIONS[0];
const loc = { districtId: dhaka.districtId, lat: String(dhaka.latitude), lng: String(dhaka.longitude) };
const chambers = DEMO_CHAMBERS as Chamber[];
const chamber = chambers.find((c) => c.district_id === dhaka.districtId && c.book_an_appointment)!;
const user = { _id: "6650f1000000000000000001", contact_no: "+8801700000000" };

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

describe("health care API on the demo adapter", () => {
  it("every demo answer matches the contract", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    const home = await exploreFindDoctor(loc.districtId);
    expect(home.allDepartments.length).toBeGreaterThan(0);
    expect((await getNearestDoctors(loc)).length).toBeGreaterThan(0);
    expect((await getDoctorsByDept(chamber.deptInfo._id, loc.districtId, 1)).length).toBeGreaterThan(0);
    const centerId = chamber.consultationCenterInfo._id;
    await getDoctorsByCenter(centerId, chamber.deptInfo._id, 1);
    expect((await getDoctorProfile(chamber.doctorInfo._id)).length).toBeGreaterThan(0);
    expect((await getNearestCenters("Hospital", loc)).length).toBeGreaterThan(0);
    expect((await getCentersByDistrict("Hospital", loc.districtId, 1)).consultationCenterInfo.length).toBeGreaterThan(0);
    await searchCenters("Consultation Center", chamber.consultationCenterInfo.center_name.slice(0, 5));
    expect((await exploreCenter(centerId)).centerInfo?._id).toBe(centerId);

    const registered = await registerPatient({ patient_name: "Test Patient", contact: "01700000000" }, user);
    expect(registered.result.patient_name).toBe("Test Patient");
    const updated = await managePatient({ ...registered.result, address: "Dhaka" }, user);
    expect(updated.message).toBe("update");
    expect((await getPatients(user)).some((p) => p._id === registered.result._id)).toBe(true);

    const booked = await bookAppointment(
      {
        doctor_info: chamber.doctorInfo._id,
        consultation_center_info: centerId,
        consultation_limit: chamber.consultation_limit_per_slot,
        appointment_date: "2026-11-24",
        time_slot: "10:00 AM - 01:00 PM",
        patient_info: { id: registered.result._id, patient_name: "Test Patient" },
      },
      user,
    );
    expect(booked.success).toBe(true);

    expect(warn.mock.calls.map((c) => String(c[0]) + JSON.stringify(c[1]))).toEqual([]);
  });

  it("gives centerInfo null for an unknown centre", async () => {
    expect((await exploreCenter("6650ffffffffffffffffffff")).centerInfo).toBeNull();
    expect((DEMO_CENTERS as unknown[]).length).toBeGreaterThan(0);
  });

  it("sends today's paging and location params", async () => {
    const post = vi
      .spyOn(getApiClient(HEALTH_CARE_URL), "post")
      .mockResolvedValue({ data: { success: true, result: [] }, headers: {} });
    await getDoctorsByDept("d1", "x", 2);
    await getNearestCenters("Hospital", { districtId: "x", lat: "1", lng: "2" });
    expect(post.mock.calls[0][1]).toEqual({ page: 2, deptId: "d1", districtId: "x" });
    expect(post.mock.calls[1][1]).toEqual({ longitude: "2", latitude: "1", districtId: "x", centerType: "Hospital" });
  });

  it("has health care query keys", () => {
    expect(queryKeys.healthCare.center("c")).toEqual(["healthCare", "center", "c"]);
  });
});
