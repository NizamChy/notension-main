// Health care: departments, medical centres (hospitals, diagnostic, eye,
// dental and consultation centres), doctors, chambers (a doctor sitting at a
// centre, with a weekly schedule), patients and appointments.
//
// A doctor profile can be linked to a login (`user_id`, nullable) so a doctor
// panel can later let a user holding the `doctor` role manage their own
// chambers and appointments.
import { sql } from "drizzle-orm";
import {
  boolean,
  customType,
  date,
  doublePrecision,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { objectId } from "../ids";
import { user } from "./auth";
import { districts } from "./catalog";

const id = () => text("id").primaryKey().$defaultFn(objectId);
const createdAt = () => timestamp("created_at", { withTimezone: true }).notNull().defaultNow();
const updatedAt = () =>
  timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date());
const money = (name: string) =>
  numeric(name, { precision: 12, scale: 2, mode: "number" }).notNull().default(0);

const geographyPoint = customType<{ data: string; driverData: string }>({
  dataType: () => "geography",
});

// Banner groups the apps show (legacy field names, "deltal" included).
export const HEALTH_BANNER_SLOTS = [
  "find_doctor_banner",
  "consultation_center_banner",
  "nearest_doctor_banner",
  "hospital_banner",
  "diagnostic_center_banner",
  "eye_care_center_banner",
  "deltal_care_center_banner",
  "medical_service_banner",
] as const;
export type HealthBannerSlot = (typeof HEALTH_BANNER_SLOTS)[number];

export const healthBanners = pgTable("health_banner", {
  id: id(),
  slot: text("slot", { enum: HEALTH_BANNER_SLOTS }).notNull(),
  fileName: text("file_name").notNull(),
  title: text("title").notNull().default(""),
  position: integer("position").notNull().default(0),
});

export const healthDepartments = pgTable("health_department", {
  id: id(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  nameBn: text("name_bn"),
  banner1: text("banner_1"),
  banner2: text("banner_2"),
  serial: integer("serial").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
});

// Center types as the apps spell them.
export const CENTER_TYPES = [
  "Hospital",
  "Diagnostic Centre",
  "Consultation Center",
  "Eye Care Centre",
  "Deltal Care Centre",
] as const;

export const medicalCenters = pgTable(
  "medical_center",
  {
    id: id(),
    name: text("name").notNull(),
    centerType: text("center_type", { enum: CENTER_TYPES }).notNull(),
    districtId: text("district_id")
      .notNull()
      .references(() => districts.id),
    address: text("address").notNull().default(""),
    latitude: doublePrecision("latitude").notNull(),
    longitude: doublePrecision("longitude").notNull(),
    location: geographyPoint("location").generatedAlwaysAs(
      sql`ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography`,
    ),
    bannerApp: text("banner_app"),
    contact1: text("contact_1"),
    contact2: text("contact_2"),
    isActive: boolean("is_active").notNull().default(true),
    position: integer("position").notNull().default(0),
    createdAt: createdAt(),
  },
  (t) => [
    index("medical_center_district_idx").on(t.districtId, t.centerType),
    index("medical_center_location_idx").using("gist", t.location),
  ],
);

export const doctors = pgTable(
  "doctor",
  {
    id: id(),
    // The doctor's own login, for a future doctor panel. One profile per user.
    userId: text("user_id")
      .unique()
      .references(() => user.id, { onDelete: "set null" }),
    districtId: text("district_id")
      .notNull()
      .references(() => districts.id),
    departmentId: text("department_id")
      .notNull()
      .references(() => healthDepartments.id),
    name: text("name").notNull(),
    gender: text("gender"),
    speciality: text("speciality").notNull().default(""),
    qualifications: text("qualifications").notNull().default(""),
    designation: text("designation").notNull().default(""),
    experienceYears: integer("experience_years").notNull().default(0),
    bmdcRegNo: text("bmdc_reg_no"),
    consultationFee: money("consultation_fee"),
    followUpFee: money("follow_up_fee"),
    isActive: boolean("is_active").notNull().default(true),
    position: integer("position").notNull().default(0),
    createdAt: createdAt(),
  },
  (t) => [index("doctor_district_dept_idx").on(t.districtId, t.departmentId)],
);

export type SlotTime = { start: string; end: string };
export type ScheduleDay = {
  day_name: string;
  is_closed: boolean;
  morning: SlotTime;
  afternoon: SlotTime;
  evening: SlotTime;
};
export type AppointmentScheduling = {
  scheduling_type: "ScheduleForNextDay" | "ScheduleForSameDay";
  start_time: string; // "12:00 AM": serials are taken between these times
  end_time: string;
};

// A doctor at one centre: weekly schedule, fees and serial limits.
export const doctorChambers = pgTable(
  "doctor_chamber",
  {
    id: id(),
    doctorId: text("doctor_id")
      .notNull()
      .references(() => doctors.id, { onDelete: "cascade" }),
    centerId: text("center_id")
      .notNull()
      .references(() => medicalCenters.id, { onDelete: "cascade" }),
    // Human-readable schedule lines ("Saturday - Thursday: 05:00 PM - 09:00 PM").
    slotTexts: text("slot_texts").array().notNull().default(sql`'{}'::text[]`),
    schedule: jsonb("schedule").$type<ScheduleDay[]>().notNull(),
    scheduling: jsonb("scheduling").$type<AppointmentScheduling>().notNull(),
    limitPerSlot: integer("limit_per_slot").notNull().default(30),
    consultationFee: money("consultation_fee"),
    followUpFee: money("follow_up_fee"),
    roomNo: text("room_no"),
    bookingOpen: boolean("booking_open").notNull().default(true),
    isOff: boolean("is_off").notNull().default(false),
    isPopular: boolean("is_popular").notNull().default(false),
    position: integer("position").notNull().default(0),
  },
  (t) => [
    unique("doctor_chamber_doctor_center").on(t.doctorId, t.centerId),
    index("doctor_chamber_center_idx").on(t.centerId),
  ],
);

export const medicalServiceProviders = pgTable(
  "medical_service_provider",
  {
    id: id(),
    districtId: text("district_id")
      .notNull()
      .references(() => districts.id),
    serviceType: text("service_type").notNull(), // "Ambulance", ...
    name: text("name").notNull(),
    contact: text("contact").notNull().default(""),
    address: text("address").notNull().default(""),
    position: integer("position").notNull().default(0),
  },
  (t) => [index("medical_service_provider_district_idx").on(t.districtId, t.serviceType)],
);

// People a signed-in user books for (self, family). Owned by that user.
export const patients = pgTable(
  "patient",
  {
    id: id(),
    ownerId: text("owner_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    contact: text("contact").notNull(),
    altContact: text("alt_contact").notNull().default(""),
    dateOfBirth: text("date_of_birth").notNull().default(""), // YYYY-MM-DD or ""
    gender: text("gender").notNull().default(""),
    email: text("email").notNull().default(""),
    address: text("address").notNull().default(""),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("patient_owner_idx").on(t.ownerId, t.createdAt)],
);

export const APPOINTMENT_STATUSES = ["Booked", "Visited", "Cancelled"] as const;

// A serial with a doctor at a chamber for one date and time slot. Serial
// numbers count per chamber, date and slot.
export const appointments = pgTable(
  "appointment",
  {
    id: id(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    patientId: text("patient_id")
      .notNull()
      .references(() => patients.id, { onDelete: "cascade" }),
    patientName: text("patient_name").notNull(),
    chamberId: text("chamber_id")
      .notNull()
      .references(() => doctorChambers.id),
    doctorId: text("doctor_id")
      .notNull()
      .references(() => doctors.id),
    centerId: text("center_id")
      .notNull()
      .references(() => medicalCenters.id),
    appointmentDate: date("appointment_date", { mode: "string" }).notNull(),
    timeSlot: text("time_slot").notNull(), // "05:00 PM - 09:00 PM"
    serialNo: integer("serial_no").notNull(),
    limitPerSlot: integer("limit_per_slot").notNull(),
    consultationFee: money("consultation_fee"),
    status: text("status", { enum: APPOINTMENT_STATUSES }).notNull().default("Booked"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    unique("appointment_serial").on(t.chamberId, t.appointmentDate, t.timeSlot, t.serialNo),
    index("appointment_patient_idx").on(t.patientId),
    index("appointment_user_idx").on(t.userId, t.appointmentDate),
    index("appointment_doctor_idx").on(t.doctorId, t.appointmentDate),
  ],
);
