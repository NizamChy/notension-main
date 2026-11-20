// Demo routes for the HEALTH_CARE backend (doctors, consultation centers,
// hospitals, diagnostic / eye / dental centers, patients and appointments).
// See src/demo/README.md for the contract. The data is in ./healthCare/data.js.

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
import { demoResponse } from "../demoAdapter";
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

const patients = [];
const appointments = [];
let writeCounter = 0;

const newId = (kind) => {
  writeCounter += 1;
  const stamp = Date.now().toString(16).slice(-10).padStart(10, "0");
  return `6650${kind}${stamp}${writeCounter.toString(16).padStart(8, "0")}`;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const toNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) && n !== 0 ? n : null;
};

const userPoint = ({ latitude, longitude, districtId }) => {
  const lat = toNumber(latitude);
  const lng = toNumber(longitude);
  if (lat !== null && lng !== null) return { lat, lng };
  const fallback =
    DEMO_LOCATIONS.find((l) => l.districtId === districtId) || DHAKA;
  return { lat: fallback.latitude, lng: fallback.longitude };
};

// Distance in metres (the center card shows distance / 1000 km).
const distanceMeters = (a, b) => {
  const rad = (deg) => (deg * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * 6371000 * Math.asin(Math.sqrt(h)));
};

const centerPoint = (c) => ({ lat: c.latitude, lng: c.longitude });

const paginate = (list, page) => {
  const p = Math.max(1, Number(page) || 1);
  return list.slice((p - 1) * PAGE_SIZE, p * PAGE_SIZE);
};

// "Consultation Center" lists every center where doctors sit; the other
// types match the center's own type.
const matchesType = (c, centerType) => {
  if (!centerType || centerType === "Consultation Center") {
    return DEMO_CHAMBERS.some((ch) => ch.consultationCenterInfo._id === c._id);
  }
  return c.center_type === centerType;
};

const centersFor = (districtId, centerType) =>
  isDemoDistrict(districtId)
    ? DEMO_CENTERS.filter(
        (c) => c.district_id === districtId && matchesType(c, centerType),
      )
    : [];

const chambersInDistrict = (districtId) =>
  isDemoDistrict(districtId)
    ? DEMO_CHAMBERS.filter((ch) => ch.district_id === districtId)
    : [];

const chambersAtCenter = (centerId) =>
  DEMO_CHAMBERS.filter((ch) => ch.consultationCenterInfo._id === centerId);

const firstChamberPerDoctor = (list) => {
  const seen = new Set();
  return list.filter((ch) => {
    if (seen.has(ch.doctorInfo._id)) return false;
    seen.add(ch.doctorInfo._id);
    return true;
  });
};

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

export const routes = [
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
      const departments = [];
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
      const saved = {
        ...body,
        _id: newId("9a"),
        createdAt: new Date().toISOString(),
      };
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
        const saved = { ...body, _id: newId("9a"), createdAt: new Date().toISOString() };
        patients.push(saved);
        return { success: true, message: "delete", result: saved };
      }
      patients[index] = { ...patients[index], ...body, updatedAt: new Date().toISOString() };
      return { success: true, message: "update", result: patients[index] };
    },
  },

  // Appointments (in memory). Serial numbers count per chamber, date and slot.
  {
    service: SERVICE,
    method: "POST",
    path: BOOK_APPOINTMENT,
    handler: ({ body }) => {
      const sameSlot = (a) =>
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

      const saved = {
        ...body,
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
