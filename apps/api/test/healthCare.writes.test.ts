// Patients and appointments, through the HTTP app with a signed-in user.
import { healthCare as contract } from "@notension/shared";
import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createDb, type DbHandle } from "../src/db/client";
import { appointments, doctorChambers } from "../src/db/schema";
import { seedDemo } from "../src/seed/demo";
import { seedHealthCare } from "../src/seed/healthCare";
import { client, testApp } from "./helpers";

const P = "/client-app-api/v1/health-care";
const oid = (kind: string, n: number) => `6650${kind}${String(n).padStart(18, "0")}`;
// Chamber 1: doctor 1 at centre 1, evenings, off on Friday, 30 per slot.
const CHAMBER = oid("c7", 1);
const DOCTOR = oid("d0", 1);
const CENTER = oid("ce", 1);
const EVENING = "05:00 PM - 09:00 PM";

let handle: DbHandle;
let app: ReturnType<typeof testApp>;

beforeAll(async () => {
  handle = await createDb({});
  await handle.migrate();
  await seedDemo(handle.db);
  await seedHealthCare(handle.db);
  app = testApp(handle.db);
});
afterAll(() => handle?.close());

async function signIn(phone: string) {
  const c = client(app);
  const sent = await c.request("POST", "/api/v1/customer/send-otp", { contact_no: phone });
  const verified = await c.request("POST", "/api/v1/customer/verify-otp", { contact_no: phone, otp: sent.body.demo_otp });
  expect(verified.status).toBe(200);
  return c;
}

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const dhakaToday = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dhaka", year: "numeric", month: "2-digit", day: "2-digit" }).format(
    new Date(),
  );
const addDays = (ymd: string, n: number) => new Date(Date.parse(`${ymd}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);
const weekday = (ymd: string) => WEEKDAYS[new Date(`${ymd}T00:00:00Z`).getUTCDay()];
// The next date (from today, Dhaka) that is / isn't a Friday.
const nextDate = (friday: boolean) => {
  for (let i = 1; i <= 7; i++) {
    const d = addDays(dhakaToday(), i);
    if ((weekday(d) === "Friday") === friday) return d;
  }
  throw new Error("unreachable");
};

const PATIENT = {
  patient_name: "Karim Uddin",
  contact: "01811111111",
  alternative_contact: "",
  date_of_birth: "1990-05-01",
  gender: "Male",
  email: "",
  address: "Banani, Dhaka",
};

describe("patients", () => {
  it("needs a session", async () => {
    const c = client(app);
    expect((await c.request("GET", `${P}/get-patients-info`)).status).toBe(401);
    expect((await c.request("POST", `${P}/register-patient`, PATIENT)).status).toBe(401);
    expect((await c.request("PUT", `${P}/manage-patient`, PATIENT)).status).toBe(401);
  });

  it("rejects bad input", async () => {
    const c = await signIn("01720000001");
    const short = await c.request("POST", `${P}/register-patient`, { ...PATIENT, patient_name: "Al" });
    expect(short.status).toBe(400);
    expect(short.body).toEqual({ success: false, message: "Patient name is required" });
    const phone = await c.request("POST", `${P}/register-patient`, { ...PATIENT, contact: "12345" });
    expect(phone.status).toBe(400);
    const dob = await c.request("POST", `${P}/register-patient`, { ...PATIENT, date_of_birth: "01/05/1990" });
    expect(dob.status).toBe(400);
    const empty = await c.request("POST", `${P}/register-patient`);
    expect(empty.status).toBe(400);
  });

  it("registers, lists and updates the session user's patients only", async () => {
    const c = await signIn("01720000002");
    const saved = await c.request("POST", `${P}/register-patient`, {
      ...PATIENT,
      contact: "+880 1811-111111",
      createdBy: { user_id: "6650aa000000000000000000", user: "01999999999", user_type: "Customer" },
    });
    expect(saved.status).toBe(200);
    expect(saved.body.message).toBe("Patient registered successfully");
    const patient = contract.patient.parse(saved.body.result);
    expect(patient.contact).toBe("01811111111");
    expect(patient.createdBy.user).toBe("01720000002");
    expect(patient.createdBy.user_id).not.toBe("6650aa000000000000000000");

    // The query's userId is ignored.
    const mine = await c.request("GET", `${P}/get-patients-info`, undefined);
    expect(mine.body.result.map((p: any) => p._id)).toEqual([patient._id]);
    const other = await signIn("01720000003");
    const theirs = await other.request("GET", `${P}/get-patients-info?userId=${patient.createdBy.user_id}`);
    expect(theirs.body.result).toEqual([]);

    const updated = await c.request("PUT", `${P}/manage-patient`, { ...patient, patient_name: "Karim Uddin Ahmed" });
    expect(updated.body.message).toBe("update");
    expect(updated.body.result._id).toBe(patient._id);
    expect(updated.body.result.patient_name).toBe("Karim Uddin Ahmed");

    // Someone else's id: a new patient for the caller; the original is untouched.
    const hijack = await other.request("PUT", `${P}/manage-patient`, { ...patient, patient_name: "Changed Name" });
    expect(hijack.body.message).toBe("delete");
    expect(hijack.body.result._id).not.toBe(patient._id);
    const after = await c.request("GET", `${P}/get-patients-info`);
    expect(after.body.result[0].patient_name).toBe("Karim Uddin Ahmed");
  });
});

describe("appointments", () => {
  const book = (c: Awaited<ReturnType<typeof signIn>>, patientId: string, over: Record<string, unknown> = {}) =>
    c.request("POST", `${P}/book-appointment`, {
      doctor_info: DOCTOR,
      consultation_center_info: CENTER,
      consultation_limit: 9999,
      time_slot: EVENING,
      appointment_date: nextDate(false),
      patient_info: { id: patientId, patient_name: "ignored" },
      createdBy: { user_id: "6650aa000000000000000000", user: "01999999999", user_type: "Customer" },
      ...over,
    });

  const newPatient = async (c: Awaited<ReturnType<typeof signIn>>, name: string) =>
    (await c.request("POST", `${P}/register-patient`, { ...PATIENT, patient_name: name })).body.result._id as string;

  it("needs a session", async () => {
    const res = await client(app).request("POST", `${P}/book-appointment`, { doctor_info: DOCTOR });
    expect(res.status).toBe(401);
  });

  it("rejects bad input and other users' patients", async () => {
    const c = await signIn("01720000010");
    const patientId = await newPatient(c, "Rahima Begum");
    expect((await book(c, patientId, { appointment_date: "tomorrow" })).status).toBe(400);
    expect((await book(c, patientId, { appointment_date: "2026-02-31" })).status).toBe(400);
    expect((await book(c, patientId, { doctor_info: "nope" })).status).toBe(400);

    const other = await signIn("01720000011");
    const res = await book(other, patientId);
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it("checks the chamber's schedule", async () => {
    const c = await signIn("01720000012");
    const patientId = await newPatient(c, "Jamal Hossain");
    // Doctor 1 doesn't sit at centre 2.
    expect((await book(c, patientId, { consultation_center_info: oid("ce", 2) })).status).toBe(404);
    // Friday is the off day.
    const friday = await book(c, patientId, { appointment_date: nextDate(true) });
    expect(friday.status).toBe(409);
    expect(friday.body.message).toMatch(/closed on Friday/);
    // Not one of this chamber's slots.
    expect((await book(c, patientId, { time_slot: "09:00 AM - 01:00 PM" })).status).toBe(400);
    // Past and far-off dates.
    expect((await book(c, patientId, { appointment_date: addDays(dhakaToday(), -3) })).status).toBe(400);
    expect((await book(c, patientId, { appointment_date: addDays(dhakaToday(), 10) })).status).toBe(400);
  });

  it("books serials in order, refuses duplicates and full slots", async () => {
    const c = await signIn("01720000013");
    const first = await newPatient(c, "Patient One");
    const second = await newPatient(c, "Patient Two");
    const third = await newPatient(c, "Patient Three");

    const one = await book(c, first);
    expect(one.status).toBe(200);
    const parsed = contract.bookAppointmentResult.parse(one.body);
    expect(parsed.success).toBe(true);
    expect(one.body.result).toMatchObject({
      chamber_info: CHAMBER,
      doctor_info: DOCTOR,
      consultation_center_info: CENTER,
      serial_no: 1,
      status: "Booked",
      consultation_limit: 30, // the chamber's, not the browser's
      consultation_fee: 1000,
      patient_info: { id: first, patient_name: "Patient One" },
      createdBy: { user: "01720000013", user_type: "Customer" },
    });
    expect(one.body.message).toBe("Appointment booked. Serial no. 1");

    const two = await book(c, second);
    expect(two.body.result.serial_no).toBe(2);

    const again = await book(c, first);
    expect(again.status).toBe(200);
    expect(again.body).toMatchObject({ success: false, isBooked: true, result: { _id: one.body.result._id } });

    await handle.db.update(doctorChambers).set({ limitPerSlot: 2 }).where(eq(doctorChambers.id, CHAMBER));
    try {
      const full = await book(c, third);
      expect(full.body).toEqual({
        success: false,
        isBooked: false,
        message: "All serials for this slot are booked. Please choose another slot.",
      });
    } finally {
      await handle.db.update(doctorChambers).set({ limitPerSlot: 30 }).where(eq(doctorChambers.id, CHAMBER));
    }
    const rows = await handle.db.select().from(appointments).where(eq(appointments.chamberId, CHAMBER));
    expect(rows.filter((r) => r.appointmentDate === nextDate(false))).toHaveLength(2);
  });

  it("takes serials only in the chamber's booking hours and when booking is open", async () => {
    const c = await signIn("01720000014");
    const patientId = await newPatient(c, "Late Booker");
    const chamber2 = oid("c7", 2); // doctor 1 at centre 10, mornings
    const [row] = await handle.db.select().from(doctorChambers).where(eq(doctorChambers.id, chamber2));
    const req = { consultation_center_info: oid("ce", 10), time_slot: "09:00 AM - 01:00 PM" };

    // A window that never includes "now" (a one-minute window 12 hours away).
    const nowMinutes = (() => {
      const p = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dhaka", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date());
      const [h, m] = p.split(":").map(Number);
      return h! * 60 + m!;
    })();
    const away = (nowMinutes + 720) % 1440;
    const fmt = (min: number) => {
      const h = Math.floor(min / 60);
      return `${String(h % 12 || 12).padStart(2, "0")}:${String(min % 60).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
    };
    await handle.db
      .update(doctorChambers)
      .set({ scheduling: { ...row!.scheduling, start_time: fmt(away), end_time: fmt(away) } })
      .where(eq(doctorChambers.id, chamber2));
    const closed = await book(c, patientId, req);
    expect(closed.body.success).toBe(false);
    expect(closed.body.isBooked).toBe(false);
    expect(closed.body.message).toMatch(/Serials are taken between/);

    await handle.db
      .update(doctorChambers)
      .set({ scheduling: row!.scheduling, bookingOpen: false })
      .where(eq(doctorChambers.id, chamber2));
    expect((await book(c, patientId, req)).status).toBe(409);

    await handle.db.update(doctorChambers).set({ bookingOpen: true }).where(eq(doctorChambers.id, chamber2));
    const ok = await book(c, patientId, req);
    expect(ok.body.success).toBe(true);
  });
});
