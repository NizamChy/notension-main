import { z } from "zod";
import { healthCare } from "@notension/shared";
import {
  BOOK_APPOINTMENT,
  CONSULTATION_CENTER_BY_DISTRICT,
  EXPLORE_CONSULTATION_CENTER,
  EXPLORE_FIND_DOCTOR,
  EXPLORE_MEDICAL_SERVICE_PROVIDER,
  FIND_DOCTOR_BY_CONSULTATION_CENTER,
  FIND_DOCTOR_BY_DEPT,
  FIND_NEAREST_DOCTOR,
  GET_DOCTOR_PROFILE,
  GET_PATIENTS,
  MANAGE_PATIENT,
  NEAREST_CONSULTATION_CENTER,
  REGISTER_PATIENT,
  SEARCH_CONSULTATION_CENTER,
} from "@/api-endpoints/api-endpoint";
import { apiGet, apiPost, apiPut } from "./request";

// The health care API (doctors, centres, patients, appointments): the same
// calls and params the old useDoctor / useCenter / usePatient /
// useAppointment made.

export const PAGE_SIZE = healthCare.PAGE_SIZE;

export type Banner = healthCare.Banner;
export type Department = healthCare.Department;
export type Center = healthCare.Center;
export type NearbyCenter = z.infer<typeof healthCare.nearbyCenter>;
export type Chamber = healthCare.Chamber;
export type NearbyChamber = z.infer<typeof healthCare.nearbyChamber>;
export type FindDoctor = z.infer<typeof healthCare.exploreFindDoctor>;
export type CentersByDistrict = z.infer<typeof healthCare.centersByDistrict>;
export type CenterExplore = z.infer<typeof healthCare.exploreCenter>;
export type Patient = healthCare.Patient;
export type Appointment = healthCare.Appointment;
export type BookAppointmentResult = z.infer<typeof healthCare.bookAppointmentResult>;

/** 'Hospital', 'Diagnostic Centre', 'Eye Care Centre', 'Deltal Care Centre' or 'Consultation Center'. */
export type CenterType = string;

export type Location = { districtId: string; lat: string; lng: string };

/** Who made a patient or appointment, as the old hooks sent it (the API uses the session). */
export type Actor = { _id?: unknown; contact_no?: unknown };
const actorOf = (user: Actor) => ({
  user_id: user._id,
  user: typeof user.contact_no === "string" ? user.contact_no.slice(-11) : undefined,
  user_type: "Customer",
});

const ok = healthCare.ok;

export async function exploreFindDoctor(districtId: string): Promise<FindDoctor> {
  const res = await apiGet("HEALTH_CARE", EXPLORE_FIND_DOCTOR, ok(healthCare.exploreFindDoctor), {
    district_id: districtId,
  });
  return res.result;
}

/** The medical services home: its banners for the district. */
export async function exploreMedicalServices(districtId: string): Promise<Banner[]> {
  const res = await apiGet(
    "HEALTH_CARE",
    EXPLORE_MEDICAL_SERVICE_PROVIDER,
    ok(healthCare.exploreServiceProvider),
    { district_id: districtId },
  );
  return res.result[0]?.medical_service_banner ?? [];
}

export async function getNearestDoctors(loc: Location): Promise<NearbyChamber[]> {
  const res = await apiPost(
    "HEALTH_CARE",
    FIND_NEAREST_DOCTOR,
    { longitude: loc.lng, latitude: loc.lat, districtId: loc.districtId },
    ok(z.array(healthCare.nearbyChamber)),
  );
  return res.result;
}

export async function getDoctorsByDept(deptId: string, districtId: string, page: number): Promise<Chamber[]> {
  const res = await apiPost(
    "HEALTH_CARE",
    FIND_DOCTOR_BY_DEPT,
    { page, deptId, districtId },
    ok(z.array(healthCare.chamber)),
  );
  return res.result;
}

export async function getDoctorsByCenter(centerId: string, deptId: string, page: number): Promise<Chamber[]> {
  const res = await apiPost(
    "HEALTH_CARE",
    FIND_DOCTOR_BY_CONSULTATION_CENTER,
    { page, deptId, centerId },
    ok(z.array(healthCare.chamber)),
  );
  return res.result;
}

/** Every chamber of a doctor (empty when the doctor is unknown). */
export async function getDoctorProfile(doctorId: string): Promise<Chamber[]> {
  const res = await apiGet("HEALTH_CARE", GET_DOCTOR_PROFILE, ok(z.array(healthCare.chamber)), {
    doctorId,
  });
  return res.result;
}

export async function getNearestCenters(centerType: CenterType, loc: Location): Promise<NearbyCenter[]> {
  const res = await apiPost(
    "HEALTH_CARE",
    NEAREST_CONSULTATION_CENTER,
    { longitude: loc.lng, latitude: loc.lat, districtId: loc.districtId, centerType },
    ok(z.array(healthCare.nearbyCenter)),
  );
  return res.result;
}

export async function getCentersByDistrict(
  centerType: CenterType,
  districtId: string,
  page: number,
): Promise<CentersByDistrict> {
  const res = await apiPost(
    "HEALTH_CARE",
    CONSULTATION_CENTER_BY_DISTRICT,
    { page, centerType, districtId },
    ok(healthCare.centersByDistrict),
  );
  return res.result;
}

export async function searchCenters(centerType: CenterType, search: string): Promise<Center[]> {
  const res = await apiPost(
    "HEALTH_CARE",
    SEARCH_CONSULTATION_CENTER,
    { centerType, search },
    ok(z.array(healthCare.center)),
  );
  return res.result;
}

/** A centre's page: the centre (null when unknown), its doctors and departments. */
export async function exploreCenter(centerId: string): Promise<CenterExplore> {
  const res = await apiGet("HEALTH_CARE", EXPLORE_CONSULTATION_CENTER, ok(healthCare.exploreCenter), {
    CenterID: centerId,
  });
  return res.result;
}

export async function getPatients(user: Actor): Promise<Patient[]> {
  const res = await apiGet("HEALTH_CARE", GET_PATIENTS, ok(z.array(healthCare.patient)), {
    userId: user._id,
    contact: typeof user.contact_no === "string" ? user.contact_no.slice(-11) : undefined,
  });
  return res.result;
}

const patientResponse = z.object({
  success: z.literal(true),
  message: z.string(),
  result: healthCare.patient,
});

export async function registerPatient(
  patient: Record<string, unknown>,
  user: Actor,
): Promise<z.infer<typeof patientResponse>> {
  return apiPost("HEALTH_CARE", REGISTER_PATIENT, { ...patient, createdBy: actorOf(user) }, patientResponse);
}

/** Updates a patient ("update"), or saves it anew when the server lost it ("delete": replace the local copy). */
export async function managePatient(
  patient: Record<string, unknown>,
  user: Actor,
): Promise<z.infer<typeof patientResponse>> {
  return apiPut("HEALTH_CARE", MANAGE_PATIENT, { ...patient, updatedBy: actorOf(user) }, patientResponse);
}

export async function bookAppointment(
  appointment: Record<string, unknown>,
  user: Actor,
): Promise<BookAppointmentResult> {
  return apiPost(
    "HEALTH_CARE",
    BOOK_APPOINTMENT,
    { ...appointment, createdBy: actorOf(user) },
    healthCare.bookAppointmentResult,
  );
}
