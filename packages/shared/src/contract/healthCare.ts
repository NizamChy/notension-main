// The health care API as the web app reads it today (legacy field names,
// "certer" and "apointment" spellings included). The API builds these shapes
// and tests validate every response against them.
import { z } from "zod";

const id = z.string().regex(/^[0-9a-f]{24}$/, "24-char hex id");

export const PAGE_SIZE = 20;

export const ok = <T extends z.ZodType>(result: T) => z.object({ success: z.literal(true), result });

// ---------------------------------------------------------------- reads

export const banner = z.object({ _id: id, file_name: z.string(), title: z.string() });
export type Banner = z.infer<typeof banner>;

export const department = z.object({
  _id: id,
  slug: z.string(),
  dept_name: z.string(),
  dept_name_bn: z.string().nullable(),
  banner_1: z.string().nullable(),
  banner_2: z.string().nullable(),
  serial: z.number(),
  is_active: z.boolean(),
});
export type Department = z.infer<typeof department>;

export const center = z.object({
  _id: id,
  center_name: z.string(),
  center_type: z.string(),
  district_id: id,
  medical_center_banner_app: z.string().nullable(),
  is_active: z.boolean(),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  apointment_contact_1: z.string().optional(),
  apointment_contact_2: z.string().optional(),
});
export type Center = z.infer<typeof center>;

export const nearbyCenter = center.extend({ distance: z.number() });

export const doctor = z.object({
  _id: id,
  district_id: id,
  department: id,
  dept_name: z.string(),
  speciality: z.string(),
  is_active: z.boolean(),
  doctor_name: z.string(),
  gender: z.string().nullable(),
  qualifications: z.string(),
  designation: z.string(),
  experience_years: z.number(),
  bmdc_reg_no: z.string().nullable(),
  consultation_fee: z.number(),
  follow_up_fee: z.number(),
});
export type Doctor = z.infer<typeof doctor>;

const slotTime = z.object({ start: z.string(), end: z.string() });

export const scheduleDay = z.object({
  day_name: z.string(),
  is_closed: z.boolean(),
  morning: slotTime,
  afternoon: slotTime,
  evening: slotTime,
});

export const chamber = z.object({
  _id: id,
  doctorInfo: doctor,
  consultationCenterInfo: center,
  deptInfo: department,
  district_id: id,
  chamber_onDay_time_slot_1: z.string().optional(),
  chamber_onDay_time_slot_2: z.string().optional(),
  chamber_onDay_time_slot_3: z.string().optional(),
  chamber_schedule: z.array(scheduleDay),
  appointment_scheduling: z.object({
    scheduling_type: z.enum(["ScheduleForNextDay", "ScheduleForSameDay"]),
    start_time: z.string(),
    end_time: z.string(),
  }),
  consultation_limit_per_slot: z.number(),
  consultation_fee: z.number(),
  follow_up_fee: z.number(),
  room_no: z.string().nullable(),
  book_an_appointment: z.boolean(),
  is_chamber_off: z.boolean(),
  is_popular: z.boolean(),
});
export type Chamber = z.infer<typeof chamber>;

export const nearbyChamber = chamber.extend({ distance: z.number() });

export const serviceProvider = z.object({
  _id: id,
  district_id: id,
  service_type: z.string(),
  provider_name: z.string(),
  contact: z.string(),
  address: z.string(),
});

export const exploreFindDoctor = z.object({
  banner: z.array(
    z.object({
      _id: id,
      find_doctor_banner: z.array(banner),
      consultation_center_banner: z.array(banner),
      nearest_doctor_banner: z.array(banner),
    }),
  ),
  allDepartments: z.array(department),
  popularDoctors: z.array(chamber),
});

export const centersByDistrict = z.object({
  consultationCenterInfo: z.array(center),
  banners: z.array(
    z.object({
      _id: id,
      hospital_banner: z.array(banner),
      diagnostic_center_banner: z.array(banner),
      eye_care_center_banner: z.array(banner),
      deltal_care_center_banner: z.array(banner),
    }),
  ),
});

export const exploreCenter = z.object({
  centerInfo: center.nullable(),
  popularDoctorsByCenter: z.array(chamber),
  departmentsInfoByCenter: z.array(z.object({ _id: id, deptInfo: department })),
});

export const exploreServiceProvider = z.array(z.object({ _id: id, medical_service_banner: z.array(banner) }));

// ---------------------------------------------------------- read inputs

// Coordinates arrive as numbers, numeric strings or nothing; 0 means unknown.
const coordinate = z.preprocess((v) => {
  const n = Number(v);
  return v === null || v === undefined || v === "" || !Number.isFinite(n) || n === 0 ? null : n;
}, z.number().nullable());

const page = z.coerce.number().int().catch(1).optional();
const optionalText = z.string().optional().nullable();

export const nearbyInput = z.object({
  districtId: optionalText,
  latitude: coordinate.optional(),
  longitude: coordinate.optional(),
  centerType: optionalText,
});

export const doctorsByDeptInput = z.object({ districtId: optionalText, deptId: optionalText, page });
export const doctorsByCenterInput = z.object({ centerId: optionalText, deptId: optionalText, page });
export const centersByDistrictInput = z.object({ districtId: optionalText, centerType: optionalText, page });
export const searchCentersInput = z.object({ search: z.unknown().optional(), centerType: optionalText });

// ---------------------------------------------------------------- writes

export const createdBy = z.object({ user_id: id, user: z.string(), user_type: z.literal("Customer") });

export const patient = z.object({
  _id: id,
  patient_name: z.string(),
  contact: z.string(),
  alternative_contact: z.string(),
  date_of_birth: z.string(),
  gender: z.string(),
  email: z.string(),
  address: z.string(),
  createdBy,
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Patient = z.infer<typeof patient>;

const trimmed = (max: number) => z.string().trim().max(max);
const blankable = <T extends z.ZodType>(s: T) => z.union([z.literal(""), s]);

// What the register form posts. `createdBy` / `updatedBy` from the browser
// are ignored: the owner is the signed-in user.
export const patientInput = z.object({
  patient_name: z.string().trim().min(3, "Patient name is required").max(99),
  contact: z.string().trim().min(1),
  alternative_contact: trimmed(20).optional().default(""),
  date_of_birth: blankable(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional().default(""),
  gender: blankable(z.enum(["Male", "Female", "Other"])).optional().default(""),
  email: blankable(z.email().max(200)).optional().default(""),
  address: trimmed(300).optional().default(""),
});
export type PatientInput = z.infer<typeof patientInput>;

export const managePatientInput = patientInput.extend({ _id: z.string().optional() });

export const bookAppointmentInput = z.object({
  doctor_info: id,
  consultation_center_info: id,
  appointment_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  time_slot: z.string().trim().min(1).max(40),
  patient_info: z.object({ id }),
  // Sent by the web app, ignored: the chamber's own limit applies.
  consultation_limit: z.unknown().optional(),
});
export type BookAppointmentInput = z.infer<typeof bookAppointmentInput>;

export const appointment = z.object({
  _id: id,
  doctor_info: id,
  consultation_center_info: id,
  chamber_info: id,
  consultation_limit: z.number(),
  consultation_fee: z.number(),
  appointment_date: z.string(),
  time_slot: z.string(),
  patient_info: z.object({ id, patient_name: z.string() }),
  createdBy,
  serial_no: z.number(),
  status: z.string(),
  createdAt: z.string(),
});
export type Appointment = z.infer<typeof appointment>;

export const bookAppointmentResult = z.union([
  z.object({ success: z.literal(true), isBooked: z.literal(true), message: z.string(), result: appointment }),
  z.object({ success: z.literal(false), isBooked: z.literal(true), message: z.string(), result: appointment }),
  z.object({ success: z.literal(false), isBooked: z.literal(false), message: z.string() }),
]);
