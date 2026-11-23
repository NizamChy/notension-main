// Demo routes for the HEALTH_CARE backend (doctors, consultation centers,
// hospitals, diagnostic / eye / dental centers, patients and appointments).
// See src/demo/README.md for the contract. The data is in ./healthCare/data.ts.

import {
  GET_PATIENTS,
  MANAGE_PATIENT,
  BOOK_APPOINTMENT,
  REGISTER_PATIENT,
  GET_DOCTOR_PROFILE,
  EXPLORE_FIND_DOCTOR,
  FIND_NEAREST_DOCTOR,
  FIND_DOCTOR_BY_DEPT,
  SEARCH_CONSULTATION_CENTER,
  EXPLORE_CONSULTATION_CENTER,
  NEAREST_CONSULTATION_CENTER,
  FIND_MEDICAL_SERVICE_PROVIDER,
  CONSULTATION_CENTER_BY_DISTRICT,
  FIND_AMBULANCE_SERVICE_PROVIDER,
  EXPLORE_MEDICAL_SERVICE_PROVIDER,
  FIND_DOCTOR_BY_CONSULTATION_CENTER,
} from "@/api-endpoints/api-endpoint";
import { demoResponse, type DemoRequest, type DemoRoute } from "../demoAdapter";
import { DEMO_LOCATIONS, isDemoDistrict } from "../demoLocations";
import {
  oid,
  DEMO_CENTERS,
  DEMO_CHAMBERS,
  DEMO_DEPARTMENTS,
  FIND_DOCTOR_BANNER,
  CENTER_TYPE_BANNERS,
  NEAREST_DOCTOR_BANNER,
  MEDICAL_SERVICE_BANNER,
  CONSULTATION_CENTER_BANNER,
  DEMO_MEDICAL_SERVICE_PROVIDERS,
} from "./healthCare/data";

const SERVICE = "HEALTH_CARE";
const PAGE_SIZE = 20;

const [DHAKA] = DEMO_LOCATIONS;

// ---------------------------------------------------------------------------
// In-memory writes (patients, appointments)
// ---------------------------------------------------------------------------

type Center = (typeof DEMO_CENTERS)[number];
type Chamber = (typeof DEMO_CHAMBERS)[number];

// A patient as toPatient builds it; the profile fields are strings.
type Patient = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: { user_id?: unknown; user?: unknown };
  [field: string]: unknown;
};

type Appointment = {
  doctor_info: unknown;
  consultation_center_info: unknown;
  appointment_date: unknown;
  time_slot: unknown;
  patient_info: { id?: unknown; patient_name: unknown };
  serial_no: number;
  [field: string]: unknown;
};

const patients: Patient[] = [];
const appointments: Appointment[] = [];
let writeCounter = 0;

const newId = (kind: string) => {
  writeCounter += 1;
  const stamp = Date.now().toString(16).slice(-10).padStart(10, "0");
  return `6650${kind}${stamp}${writeCounter.toString(16).padStart(8, "0")}`;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const toNumber = (value: unknown) => {
  const n = Number(value);
  return Number.isFinite(n) && n !== 0 ? n : null;
};

type Point = { lat: number; lng: number };

const userPoint = ({
  latitude,
  longitude,
  districtId,
}: {
  latitude?: unknown;
  longitude?: unknown;
  districtId?: unknown;
}): Point => {
  const lat = toNumber(latitude);
  const lng = toNumber(longitude);
  if (lat !== null && lng !== null) return { lat, lng };
  const fallback =
    DEMO_LOCATIONS.find((l) => l.districtId === districtId) || DHAKA;
  return { lat: fallback.latitude, lng: fallback.longitude };
};

// Distance in metres (the center card shows distance / 1000 km).
const distanceMeters = (a: Point, b: Point) => {
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * 6371000 * Math.asin(Math.sqrt(h)));
};

const centerPoint = (c: { latitude: number; longitude: number }) => ({ lat: c.latitude, lng: c.longitude });

const paginate = <T,>(list: T[], page: unknown) => {
  const p = Math.max(1, Number(page) || 1);
  return list.slice((p - 1) * PAGE_SIZE, p * PAGE_SIZE);
};

// "Consultation Center" lists every center where doctors sit; the other
// types match the center's own type.
const matchesType = (c: Center, centerType: unknown) => {
  if (!centerType || centerType === "Consultation Center") {
    return DEMO_CHAMBERS.some((ch) => ch.consultationCenterInfo._id === c._id);
  }
  return c.center_type === centerType;
};

const centersFor = (districtId: string, centerType: unknown) =>
  isDemoDistrict(districtId)
    ? DEMO_CENTERS.filter(
        (c) => c.district_id === districtId && matchesType(c, centerType),
      )
    : [];

const chambersInDistrict = (districtId: string) =>
  isDemoDistrict(districtId)
    ? DEMO_CHAMBERS.filter((ch) => ch.district_id === districtId)
    : [];

const chambersAtCenter = (centerId: unknown) =>
  DEMO_CHAMBERS.filter((ch) => ch.consultationCenterInfo._id === centerId);

const firstChamberPerDoctor = <T extends Pick<Chamber, "doctorInfo">>(list: T[]) => {
  const seen = new Set<string>();
  return list.filter((ch) => {
    if (seen.has(ch.doctorInfo._id)) return false;
    seen.add(ch.doctorInfo._id);
    return true;
  });
};

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

// A patient as the API returns it: every field set, blank when not given.
const PATIENT_FIELDS = ["patient_name", "contact", "alternative_contact", "date_of_birth", "gender", "email", "address"];
const toPatient = (body: DemoRequest["body"], base: Partial<Patient> = {}): Patient => {
  const now = new Date().toISOString();
  const patient: Partial<Patient> = { ...base, createdBy: base.createdBy ?? body.createdBy, updatedAt: now };
  for (const field of PATIENT_FIELDS) {
    const value = body[field] ?? base[field];
    patient[field] = typeof value === "string" ? value.trim() : "";
  }
  patient._id = base._id ?? newId("9a");
  patient.createdAt = base.createdAt ?? now;
  // _id, createdAt and updatedAt are all set above.
  return patient as Patient;
};

export const routes: DemoRoute[] = [
  // Medical services home banners.
  {
    service: SERVICE,
    method: "GET",
    path: EXPLORE_MEDICAL_SERVICE_PROVIDER,
    handler: () => ({
      success: true,
      result: [{ _id: oid("ba", 70), medical_service_banner: MEDICAL_SERVICE_BANNER }],
    }),
  },
  {
    service: SERVICE,
    method: "GET",
    path: FIND_MEDICAL_SERVICE_PROVIDER,
    handler: ({ query }) => ({
      success: true,
      result: DEMO_MEDICAL_SERVICE_PROVIDERS.filter(
        (p) =>
          p.district_id === query.district_id &&
          (!query.serviceType || p.service_type === query.serviceType),
      ),
    }),
  },
  {
    service: SERVICE,
    method: "GET",
    path: FIND_AMBULANCE_SERVICE_PROVIDER,
    handler: ({ query }) => ({
      success: true,
      result: DEMO_MEDICAL_SERVICE_PROVIDERS.filter(
        (p) =>
          p.district_id === (query.district_id || query.districtId) &&
          p.service_type === "Ambulance",
      ),
    }),
  },

  // Find doctor home: banners, departments and popular doctors.
  {
    service: SERVICE,
    method: "GET",
    path: EXPLORE_FIND_DOCTOR,
    handler: ({ query }) => {
      const districtId = query.district_id;
      const banner = [
        {
          _id: oid("ba", 100),
          find_doctor_banner: FIND_DOCTOR_BANNER,
          consultation_center_banner: CONSULTATION_CENTER_BANNER,
          nearest_doctor_banner: NEAREST_DOCTOR_BANNER,
        },
      ];
      if (!isDemoDistrict(districtId)) {
        return { success: true, result: { banner, allDepartments: [], popularDoctors: [] } };
      }
      return {
        success: true,
        result: {
          banner,
          allDepartments: DEMO_DEPARTMENTS,
          popularDoctors: chambersInDistrict(districtId).filter((ch) => ch.is_popular),
        },
      };
    },
  },
  {
    service: SERVICE,
    method: "POST",
    path: FIND_NEAREST_DOCTOR,
    handler: ({ body }) => {
      const here = userPoint(body);
      const result = chambersInDistrict(body.districtId)
        .map((ch) => ({
          ...ch,
          distance: distanceMeters(here, centerPoint(ch.consultationCenterInfo)),
        }))
        .sort((a, b) => a.distance - b.distance);
      return { success: true, result: firstChamberPerDoctor(result).slice(0, PAGE_SIZE) };
    },
  },
  {
    service: SERVICE,
    method: "POST",
    path: FIND_DOCTOR_BY_DEPT,
    handler: ({ body }) => ({
      success: true,
      result: paginate(
        chambersInDistrict(body.districtId).filter(
          (ch) => ch.doctorInfo.department === body.deptId,
        ),
        body.page,
      ),
    }),
  },
  {
    service: SERVICE,
    method: "POST",
    path: FIND_DOCTOR_BY_CONSULTATION_CENTER,
    handler: ({ body }) => ({
      success: true,
      result: paginate(
        chambersAtCenter(body.centerId).filter(
          (ch) => !body.deptId || ch.doctorInfo.department === body.deptId,
        ),
        body.page,
      ),
    }),
  },
  {
    service: SERVICE,
    method: "GET",
    path: GET_DOCTOR_PROFILE,
    handler: ({ query }) => ({
      success: true,
      result: DEMO_CHAMBERS.filter((ch) => ch.doctorInfo._id === query.doctorId),
    }),
  },

  // Centers.
  {
    service: SERVICE,
    method: "POST",
    path: NEAREST_CONSULTATION_CENTER,
    handler: ({ body }) => {
      const here = userPoint(body);
      const result = centersFor(body.districtId, body.centerType)
        .map((c) => ({ ...c, distance: distanceMeters(here, centerPoint(c)) }))
        .sort((a, b) => a.distance - b.distance);
      return { success: true, result };
    },
  },
  {
    service: SERVICE,
    method: "POST",
    path: CONSULTATION_CENTER_BY_DISTRICT,
    handler: ({ body }) => {
      const demo = isDemoDistrict(body.districtId);
      return {
        success: true,
        result: {
          consultationCenterInfo: paginate(
            centersFor(body.districtId, body.centerType),
            body.page,
          ),
          banners: demo ? [{ _id: oid("ba", 101), ...CENTER_TYPE_BANNERS }] : [],
        },
      };
    },
  },
  {
    service: SERVICE,
    method: "POST",
    path: SEARCH_CONSULTATION_CENTER,
    handler: ({ body }) => {
      const text = String(body.search || "").trim().toLowerCase();
      if (text.length < 2) return { success: true, result: [] };
      return {
        success: true,
        result: DEMO_CENTERS.filter((c) =>
          [c.center_name, c.address, c.center_type].some((field) =>
            field.toLowerCase().includes(text),
          ),
        ),
      };
    },
  },
  {
    service: SERVICE,
    method: "GET",
    path: EXPLORE_CONSULTATION_CENTER,
    handler: ({ query }) => {
      const list = chambersAtCenter(query.CenterID);
      const departments: { _id: string; deptInfo: Chamber["deptInfo"] }[] = [];
      list.forEach((ch) => {
        if (!departments.some((d) => d._id === ch.deptInfo._id)) {
          departments.push({ _id: ch.deptInfo._id, deptInfo: ch.deptInfo });
        }
      });
      return {
        success: true,
        result: {
          centerInfo: DEMO_CENTERS.find((c) => c._id === query.CenterID) || null,
          popularDoctorsByCenter: list,
          departmentsInfoByCenter: departments,
        },
      };
    },
  },

  // Patients (in memory).
  {
    service: SERVICE,
    method: "GET",
    path: GET_PATIENTS,
    handler: ({ query }) => ({
      success: true,
      result: patients.filter(
        (p) =>
          (query.userId && p.createdBy?.user_id === query.userId) ||
          (query.contact && p.createdBy?.user === query.contact),
      ),
    }),
  },
  {
    service: SERVICE,
    method: "POST",
    path: REGISTER_PATIENT,
    handler: ({ body }) => {
      if (!body.patient_name || String(body.patient_name).trim().length < 3) {
        return demoResponse(400, { success: false, message: "Patient name is required" });
      }
      const saved = toPatient(body);
      patients.push(saved);
      return { success: true, message: "Patient registered successfully", result: saved };
    },
  },
  {
    service: SERVICE,
    method: "PUT",
    path: MANAGE_PATIENT,
    handler: ({ body }) => {
      const index = patients.findIndex((p) => p._id === body._id);
      if (index === -1) {
        // Unknown record: the hook replaces it with the returned one.
        const saved = toPatient(body);
        patients.push(saved);
        return { success: true, message: "delete", result: saved };
      }
      patients[index] = toPatient(body, patients[index]);
      return { success: true, message: "update", result: patients[index] };
    },
  },

  // Appointments (in memory). Serial numbers count per chamber, date and slot.
  {
    service: SERVICE,
    method: "POST",
    path: BOOK_APPOINTMENT,
    handler: ({ body }) => {
      const sameSlot = (a: Appointment) =>
        a.doctor_info === body.doctor_info &&
        a.consultation_center_info === body.consultation_center_info &&
        a.appointment_date === body.appointment_date &&
        a.time_slot === body.time_slot;

      const duplicate = appointments.find(
        (a) => sameSlot(a) && a.patient_info?.id === body.patient_info?.id,
      );
      if (duplicate) {
        return {
          success: false,
          isBooked: true,
          message: "This patient already has a serial in this slot.",
          result: duplicate,
        };
      }

      const booked = appointments.filter(sameSlot).length;
      const limit = Number(body.consultation_limit) || 30;
      if (booked >= limit) {
        return {
          success: false,
          isBooked: false,
          message: "All serials for this slot are booked. Please choose another slot.",
        };
      }

      // Like the API: the chamber supplies its id, fee and limit.
      const chamber = DEMO_CHAMBERS.find(
        (ch) =>
          ch.doctorInfo._id === body.doctor_info &&
          ch.consultationCenterInfo._id === body.consultation_center_info,
      );
      const saved: Appointment = {
        doctor_info: body.doctor_info,
        consultation_center_info: body.consultation_center_info,
        chamber_info: chamber?._id ?? body.consultation_center_info,
        consultation_limit: limit,
        consultation_fee: chamber?.consultation_fee ?? 0,
        appointment_date: body.appointment_date,
        time_slot: body.time_slot,
        patient_info: {
          id: body.patient_info?.id,
          patient_name:
            patients.find((p) => p._id === body.patient_info?.id)?.patient_name ??
            body.patient_info?.patient_name ??
            "",
        },
        createdBy: body.createdBy,
        _id: newId("a9"),
        serial_no: booked + 1,
        status: "Booked",
        createdAt: new Date().toISOString(),
      };
      appointments.push(saved);
      return {
        success: true,
        isBooked: true,
        message: `Appointment booked. Serial no. ${saved.serial_no}`,
        result: saved,
      };
    },
  },
];
