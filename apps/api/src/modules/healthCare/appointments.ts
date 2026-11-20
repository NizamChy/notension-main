// Patients and appointments: the signed-in user's patients (self, family)
// and serial bookings with a doctor. The owner is always the session user;
// `createdBy` / `userId` from the browser are ignored. A booking is checked
// against the chamber's schedule here (open day, time slot, booking hours,
// serial limit), and the serial number is assigned under a row lock.
import { healthCare as contract } from "@notension/shared";
import { and, asc, count, eq, max, ne } from "drizzle-orm";
import { Hono, type Context } from "hono";
import type { z } from "zod";
import { requireUser, type AuthEnv } from "../../auth/middleware";
import { normalizeBdPhone } from "../../auth/sms";
import type { Db } from "../../db/client";
import { appointments, doctorChambers, doctors, medicalCenters, patients, user } from "../../db/schema";

const P = "/client-app-api/v1/health-care";

const fail = (c: Context, status: 400 | 404 | 409, message: string) =>
  c.json({ success: false as const, message }, status);

const body = (c: Context) => c.req.json().catch(() => null);

// ------------------------------------------------------------- patients

type PatientRow = typeof patients.$inferSelect;

const createdBy = (userId: string, phone: string | null | undefined) => ({
  user_id: userId,
  user: (phone ?? "").slice(-11),
  user_type: "Customer" as const,
});

const toPatient = (p: PatientRow, phone: string | null): contract.Patient => ({
  _id: p.id,
  patient_name: p.name,
  contact: p.contact,
  alternative_contact: p.altContact,
  date_of_birth: p.dateOfBirth,
  gender: p.gender,
  email: p.email,
  address: p.address,
  createdBy: createdBy(p.ownerId, phone),
  createdAt: p.createdAt.toISOString(),
  updatedAt: p.updatedAt.toISOString(),
});

async function phoneOf(db: Db, userId: string) {
  const [row] = await db.select({ phone: user.phoneNumber }).from(user).where(eq(user.id, userId));
  return row?.phone ?? null;
}

// Validates a patient form; the message names the first problem.
function parsePatient<T extends z.ZodType<contract.PatientInput>>(schema: T, raw: unknown) {
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const field = parsed.error.issues[0]?.path[0];
    const message =
      field === "patient_name"
        ? "Patient name is required"
        : field === "contact"
          ? "Please enter a valid mobile number"
          : "Invalid patient info";
    return { error: message } as const;
  }
  const data = parsed.data as z.infer<T>;
  const contact = normalizeBdPhone(data.contact);
  if (!contact) return { error: "Please enter a valid mobile number" } as const;
  const alt = data.alternative_contact ? normalizeBdPhone(data.alternative_contact) : "";
  if (alt === null) return { error: "Please enter a valid alternative mobile number" } as const;
  return {
    data,
    values: {
      name: data.patient_name,
      contact,
      altContact: alt,
      dateOfBirth: data.date_of_birth,
      gender: data.gender,
      email: data.email,
      address: data.address,
    },
  } as const;
}

// --------------------------------------------------------- appointments

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const SLOT_KEYS = ["morning", "afternoon", "evening"] as const;
const MAX_DAYS_AHEAD = 7;

// Today in Dhaka as YYYY-MM-DD, and the minutes since midnight there.
const dhakaNow = (now = new Date()) => {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Dhaka",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  );
  return { date: `${parts.year}-${parts.month}-${parts.day}`, minutes: Number(parts.hour) * 60 + Number(parts.minute) };
};

const dayNumber = (ymd: string) => {
  const [y, m, d] = ymd.split("-").map(Number);
  const t = Date.UTC(y!, m! - 1, d!);
  const back = new Date(t);
  // Rejects 2026-02-31 and the like.
  return back.getUTCFullYear() === y && back.getUTCMonth() === m! - 1 && back.getUTCDate() === d ? t / 86_400_000 : null;
};

// "05:00 PM" -> 1020; null when unreadable.
const minutesOf = (time: string) => {
  const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(time.trim());
  if (!m) return null;
  const hours = (Number(m[1]) % 12) + (m[3]!.toUpperCase() === "PM" ? 12 : 0);
  return hours * 60 + Number(m[2]);
};

type AppointmentRow = typeof appointments.$inferSelect;

const toAppointment = (a: AppointmentRow, phone: string | null): contract.Appointment => ({
  _id: a.id,
  doctor_info: a.doctorId,
  consultation_center_info: a.centerId,
  chamber_info: a.chamberId,
  consultation_limit: a.limitPerSlot,
  consultation_fee: a.consultationFee,
  appointment_date: a.appointmentDate,
  time_slot: a.timeSlot,
  patient_info: { id: a.patientId, patient_name: a.patientName },
  createdBy: createdBy(a.userId, phone),
  serial_no: a.serialNo,
  status: a.status,
  createdAt: a.createdAt.toISOString(),
});

const notCancelled = ne(appointments.status, "Cancelled");

export const healthCareWriteRoutes = (db: Db, clock: () => Date = () => new Date()) =>
  new Hono<AuthEnv>()
    // `userId` / `contact` in the query are ignored: always the session user.
    .get(`${P}/get-patients-info`, requireUser, async (c) => {
      const me = c.get("user")!;
      const [rows, phone] = await Promise.all([
        db.select().from(patients).where(eq(patients.ownerId, me.id)).orderBy(asc(patients.createdAt), asc(patients.id)),
        phoneOf(db, me.id),
      ]);
      return c.json({ success: true as const, result: rows.map((p) => toPatient(p, phone)) });
    })

    .post(`${P}/register-patient`, requireUser, async (c) => {
      const me = c.get("user")!;
      const parsed = parsePatient(contract.patientInput, await body(c));
      if ("error" in parsed) return fail(c, 400, parsed.error!);
      const [saved] = await db
        .insert(patients)
        .values({ ...parsed.values, ownerId: me.id })
        .returning();
      return c.json({
        success: true as const,
        message: "Patient registered successfully",
        result: toPatient(saved!, await phoneOf(db, me.id)),
      });
    })

    // Updates one of my patients ("update"). An unknown id saves a new
    // patient instead and answers "delete", which tells the app to replace
    // its local copy with the returned one.
    .put(`${P}/manage-patient`, requireUser, async (c) => {
      const me = c.get("user")!;
      const parsed = parsePatient(contract.managePatientInput, await body(c));
      if ("error" in parsed) return fail(c, 400, parsed.error!);
      const patientId = (parsed.data as z.infer<typeof contract.managePatientInput>)._id;
      const phone = await phoneOf(db, me.id);
      const [updated] = patientId
        ? await db
            .update(patients)
            .set(parsed.values)
            .where(and(eq(patients.id, patientId), eq(patients.ownerId, me.id)))
            .returning()
        : [];
      if (updated) return c.json({ success: true as const, message: "update", result: toPatient(updated, phone) });
      const [saved] = await db
        .insert(patients)
        .values({ ...parsed.values, ownerId: me.id })
        .returning();
      return c.json({ success: true as const, message: "delete", result: toPatient(saved!, phone) });
    })

    .post(`${P}/book-appointment`, requireUser, async (c) => {
      const me = c.get("user")!;
      const parsed = contract.bookAppointmentInput.safeParse(await body(c));
      if (!parsed.success) return fail(c, 400, "Invalid appointment");
      const input = parsed.data;

      const [patient] = await db
        .select()
        .from(patients)
        .where(and(eq(patients.id, input.patient_info.id), eq(patients.ownerId, me.id)));
      if (!patient) return fail(c, 404, "Patient not found. Please register the patient again.");

      const [row] = await db
        .select({ chamber: doctorChambers, doctorActive: doctors.isActive, centerActive: medicalCenters.isActive })
        .from(doctorChambers)
        .innerJoin(doctors, eq(doctors.id, doctorChambers.doctorId))
        .innerJoin(medicalCenters, eq(medicalCenters.id, doctorChambers.centerId))
        .where(and(eq(doctorChambers.doctorId, input.doctor_info), eq(doctorChambers.centerId, input.consultation_center_info)));
      if (!row) return fail(c, 404, "This doctor does not sit at this centre");
      const { chamber } = row;
      if (!row.doctorActive || !row.centerActive || !chamber.bookingOpen || chamber.isOff) {
        return fail(c, 409, "This chamber is not taking appointments right now");
      }

      // The date: today (Dhaka) up to a week ahead; same-day chambers only
      // today. One day of slack before today for browsers behind Dhaka.
      const now = dhakaNow(clock());
      const day = dayNumber(input.appointment_date);
      const today = dayNumber(now.date)!;
      if (day === null) return fail(c, 400, "Invalid date");
      const sameDay = chamber.scheduling.scheduling_type === "ScheduleForSameDay";
      if (day < today - 1 || day > today + (sameDay ? 0 : MAX_DAYS_AHEAD)) {
        return fail(c, 400, sameDay ? "This chamber takes serials for today only" : "Please choose a date within the next 7 days");
      }

      // The day must be open and the slot one of that day's slots.
      const dayName = WEEKDAYS[new Date(day * 86_400_000).getUTCDay()]!;
      const scheduleDay = chamber.schedule.find((d) => d.day_name === dayName);
      if (!scheduleDay || scheduleDay.is_closed) return fail(c, 409, `The chamber is closed on ${dayName}`);
      const slots = SLOT_KEYS.map((k) => scheduleDay[k])
        .filter((s) => s && s.start && !s.start.startsWith("00:00"))
        .map((s) => `${s.start} - ${s.end}`);
      if (!slots.includes(input.time_slot)) return fail(c, 400, "Please choose one of the chamber's time slots");

      // Serials are only taken during the chamber's booking hours.
      const { start_time, end_time } = chamber.scheduling;
      const from = minutesOf(start_time);
      const to = minutesOf(end_time);
      if (from !== null && to !== null && (now.minutes < from || now.minutes > to)) {
        return c.json({
          success: false as const,
          isBooked: false as const,
          message: `Serials are taken between ${start_time} and ${end_time}`,
        });
      }

      const phone = await phoneOf(db, me.id);
      const outcome = await db.transaction(async (tx) => {
        // One booking at a time per chamber, so serial numbers don't clash.
        await tx.select({ id: doctorChambers.id }).from(doctorChambers).where(eq(doctorChambers.id, chamber.id)).for("update");
        const sameSlot = and(
          eq(appointments.chamberId, chamber.id),
          eq(appointments.appointmentDate, input.appointment_date),
          eq(appointments.timeSlot, input.time_slot),
        );
        const [duplicate] = await tx
          .select()
          .from(appointments)
          .where(and(sameSlot, notCancelled, eq(appointments.patientId, patient.id)));
        if (duplicate) return { kind: "duplicate" as const, row: duplicate };

        const [booked] = await tx.select({ n: count() }).from(appointments).where(and(sameSlot, notCancelled));
        if ((booked?.n ?? 0) >= chamber.limitPerSlot) return { kind: "full" as const };

        // Cancelled serials keep their numbers.
        const [lastAny] = await tx.select({ last: max(appointments.serialNo) }).from(appointments).where(sameSlot);
        const [saved] = await tx
          .insert(appointments)
          .values({
            userId: me.id,
            patientId: patient.id,
            patientName: patient.name,
            chamberId: chamber.id,
            doctorId: chamber.doctorId,
            centerId: chamber.centerId,
            appointmentDate: input.appointment_date,
            timeSlot: input.time_slot,
            serialNo: (lastAny?.last ?? 0) + 1,
            limitPerSlot: chamber.limitPerSlot,
            consultationFee: chamber.consultationFee,
          })
          .returning();
        return { kind: "booked" as const, row: saved! };
      });

      if (outcome.kind === "duplicate") {
        return c.json({
          success: false as const,
          isBooked: true as const,
          message: "This patient already has a serial in this slot.",
          result: toAppointment(outcome.row, phone),
        });
      }
      if (outcome.kind === "full") {
        return c.json({
          success: false as const,
          isBooked: false as const,
          message: "All serials for this slot are booked. Please choose another slot.",
        });
      }
      const result = toAppointment(outcome.row, phone);
      return c.json({
        success: true as const,
        isBooked: true as const,
        message: `Appointment booked. Serial no. ${result.serial_no}`,
        result,
      });
    });
