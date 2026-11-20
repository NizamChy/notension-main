// Service-side panels inside /api/v1/admin: riders (deliveries), doctors
// (appointments, chambers, profile) and All Care service providers (their own
// listing). Also the admin side of these: assigning riders to orders and
// linking doctor / provider profiles to user accounts.
//
// Every panel route checks that the record belongs to the signed-in person:
// a rider's order (order.rider_id), a doctor's appointment or chamber (via
// doctor.user_id), a provider's listing (care_provider.user_id).
import { zValidator } from "@hono/zod-validator";
import { and, asc, count, desc, eq, gte, ilike, inArray, isNotNull, notInArray, or, type SQL } from "drizzle-orm";
import type { Hono } from "hono";
import { z } from "zod";
import type { Db } from "../../db/client";
import {
  appointments,
  careProviders,
  careServices,
  districts,
  doctorChambers,
  doctors,
  healthDepartments,
  medicalCenters,
  orderItems,
  orders,
  patients,
  stores,
  user,
  userRole,
} from "../../db/schema";
import { canStore, forbidden, hasGlobal, hasOwnRole, MERCHANT_EDIT, type Access, type AdminContext, type AdminEnv } from "./access";
import { searchPattern } from "./staff";

const P = "/api/v1/admin";
const PAGE = 25;
const page = z.coerce.number().int().min(1).catch(1).default(1);
const money = z.coerce.number().min(0).max(1_000_000);

const DONE: ("Delivered" | "Cancelled")[] = ["Delivered", "Cancelled"];
// What a rider may move their own order to.
const RIDER_NEXT: Record<string, string> = { Processing: "On the way", "On the way": "Delivered" };

const notFound = (c: AdminContext, message: string) => c.json({ success: false, message }, 404);
const badRequest = (c: AdminContext, message: string) => c.json({ success: false, message }, 400);
const conflict = (c: AdminContext, message: string) => c.json({ success: false, message }, 409);

const isCash = (method: string) => /cash/i.test(method);

// Today in Dhaka as YYYY-MM-DD.
const dhakaToday = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dhaka", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());

// Whole years from a YYYY-MM-DD birth date; null when unknown.
const ageOf = (dob: string, today = dhakaToday()) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dob);
  if (!m) return null;
  const [ty, tm, td] = today.split("-").map(Number);
  let age = ty! - Number(m[1]);
  if (tm! < Number(m[2]) || (tm === Number(m[2]) && td! < Number(m[3]))) age -= 1;
  return age >= 0 && age < 150 ? age : null;
};

// Stores where this person may assign riders (owner / manager).
const assignsAnyStore = (a: Access) => [...a.stores.values()].some((roles) => MERCHANT_EDIT.some((r) => roles.has(r)));

async function holdsRole(db: Db, userId: string, role: "rider" | "doctor" | "service_provider") {
  const [row] = await db
    .select({ banned: user.banned })
    .from(userRole)
    .innerJoin(user, eq(user.id, userRole.userId))
    .where(and(eq(userRole.userId, userId), eq(userRole.role, role)));
  return !!row && !row.banned;
}

export function servicePanelRoutes(app: Hono<AdminEnv>, db: Db) {
  // ================================================================ riders

  // Riders to pick from, with how many open deliveries each has.
  app.get(`${P}/riders`, async (c) => {
    const a = c.get("access");
    if (!hasGlobal(a, ["admin", "support"]) && !assignsAnyStore(a)) return forbidden(c);
    const rows = await db
      .select({ id: user.id, name: user.name, phone: user.phoneNumber })
      .from(userRole)
      .innerJoin(user, eq(user.id, userRole.userId))
      .where(and(eq(userRole.role, "rider"), eq(user.banned, false)))
      .orderBy(asc(user.name), asc(user.phoneNumber));
    const load = await db
      .select({ riderId: orders.riderId, n: count() })
      .from(orders)
      .where(and(isNotNull(orders.riderId), notInArray(orders.status, DONE)))
      .groupBy(orders.riderId);
    return c.json({
      success: true,
      result: rows.map((r) => ({ ...r, openDeliveries: load.find((l) => l.riderId === r.id)?.n ?? 0 })),
    });
  });

  app.patch(
    `${P}/orders/:id/rider`,
    zValidator("json", z.object({ riderId: z.string().min(1).nullable() })),
    async (c) => {
      const a = c.get("access");
      const { riderId } = c.req.valid("json");
      const id = c.req.param("id");
      const [row] = await db.select({ storeId: orders.storeId, status: orders.status }).from(orders).where(eq(orders.id, id));
      if (!row) return notFound(c, "Order not found");
      if (!canStore(a, row.storeId, ["admin", "support"], MERCHANT_EDIT)) return forbidden(c);
      if ((DONE as string[]).includes(row.status)) return conflict(c, `This order is ${row.status}`);
      if (riderId && !(await holdsRole(db, riderId, "rider"))) return badRequest(c, "Choose one of the riders");
      await db
        .update(orders)
        .set({ riderId, assignedAt: riderId ? new Date() : null })
        .where(eq(orders.id, id));
      return c.json({ success: true, message: riderId ? "Rider assigned" : "Rider removed" });
    },
  );

  // The rider's own deliveries. view=active: not delivered or cancelled,
  // newest first; view=done: history, last change first.
  app.get(
    `${P}/rider/orders`,
    zValidator("query", z.object({ view: z.enum(["active", "done"]).default("active"), page })),
    async (c) => {
      const a = c.get("access");
      if (!hasOwnRole(a, "rider")) return forbidden(c);
      const q = c.req.valid("query");
      const where = and(
        eq(orders.riderId, a.userId),
        q.view === "active" ? notInArray(orders.status, DONE) : inArray(orders.status, DONE),
      );
      const [total] = await db.select({ n: count() }).from(orders).where(where);
      const rows = await db
        .select({
          id: orders.id,
          code: orders.code,
          module: orders.module,
          status: orders.status,
          total: orders.total,
          paymentMethod: orders.paymentMethod,
          note: orders.note,
          delivery: orders.delivery,
          createdAt: orders.createdAt,
          updatedAt: orders.updatedAt,
          assignedAt: orders.assignedAt,
          store: {
            id: stores.id,
            name: stores.name,
            address: stores.address,
            phone: stores.phone,
            altPhone: stores.altPhone,
            latitude: stores.latitude,
            longitude: stores.longitude,
          },
        })
        .from(orders)
        .innerJoin(stores, eq(stores.id, orders.storeId))
        .where(where)
        .orderBy(q.view === "active" ? desc(orders.createdAt) : desc(orders.updatedAt))
        .limit(PAGE)
        .offset((q.page - 1) * PAGE);
      const items = rows.length
        ? await db
            .select({
              orderId: orderItems.orderId,
              titleEn: orderItems.titleEn,
              packSize: orderItems.packSize,
              unit: orderItems.unit,
              quantity: orderItems.quantity,
              salePrice: orderItems.salePrice,
            })
            .from(orderItems)
            .where(inArray(orderItems.orderId, rows.map((r) => r.id)))
            .orderBy(asc(orderItems.position))
        : [];
      return c.json({
        success: true,
        result: rows.map((r) => ({
          ...r,
          cashToCollect: isCash(r.paymentMethod) ? r.total : 0,
          nextStatus: RIDER_NEXT[r.status] ?? null,
          items: items.filter((i) => i.orderId === r.id).map(({ orderId: _o, ...i }) => i),
        })),
        total: total?.n ?? 0,
        pageSize: PAGE,
      });
    },
  );

  app.patch(
    `${P}/rider/orders/:id/status`,
    zValidator("json", z.object({ status: z.enum(["On the way", "Delivered"]) })),
    async (c) => {
      const a = c.get("access");
      if (!hasOwnRole(a, "rider")) return forbidden(c);
      const { status } = c.req.valid("json");
      const id = c.req.param("id");
      const [row] = await db.select({ riderId: orders.riderId, status: orders.status }).from(orders).where(eq(orders.id, id));
      if (!row) return notFound(c, "Order not found");
      if (row.riderId !== a.userId) return forbidden(c);
      if (RIDER_NEXT[row.status] !== status) return conflict(c, `An order that is ${row.status} can't become ${status}`);
      await db.update(orders).set({ status }).where(and(eq(orders.id, id), eq(orders.status, row.status)));
      return c.json({ success: true, message: `Order is now ${status}` });
    },
  );

  // ======================================================= profile links
  // Admin only: which login manages which doctor / provider profile.

  const linkBody = zValidator("json", z.object({ userId: z.string().min(1).nullable() }));
  const listQuery = zValidator("query", z.object({ q: z.string().optional(), userId: z.string().optional(), page }));

  app.get(`${P}/doctors`, listQuery, async (c) => {
    if (!hasGlobal(c.get("access"), ["admin"])) return forbidden(c);
    const q = c.req.valid("query");
    const where = and(
      q.userId ? eq(doctors.userId, q.userId) : undefined,
      q.q ? or(ilike(doctors.name, searchPattern(q.q)), ilike(doctors.speciality, searchPattern(q.q))) : undefined,
    );
    const [total] = await db.select({ n: count() }).from(doctors).where(where);
    const rows = await db
      .select({
        id: doctors.id,
        name: doctors.name,
        speciality: doctors.speciality,
        designation: doctors.designation,
        departmentName: healthDepartments.name,
        districtName: districts.name,
        isActive: doctors.isActive,
        userId: doctors.userId,
        userName: user.name,
        userPhone: user.phoneNumber,
      })
      .from(doctors)
      .innerJoin(healthDepartments, eq(healthDepartments.id, doctors.departmentId))
      .innerJoin(districts, eq(districts.id, doctors.districtId))
      .leftJoin(user, eq(user.id, doctors.userId))
      .where(where)
      .orderBy(asc(doctors.name))
      .limit(PAGE)
      .offset((q.page - 1) * PAGE);
    return c.json({ success: true, result: rows, total: total?.n ?? 0, pageSize: PAGE });
  });

  app.patch(`${P}/doctors/:id/user`, linkBody, async (c) => {
    if (!hasGlobal(c.get("access"), ["admin"])) return forbidden(c);
    const { userId } = c.req.valid("json");
    const id = c.req.param("id");
    const [doc] = await db.select({ userId: doctors.userId }).from(doctors).where(eq(doctors.id, id));
    if (!doc) return notFound(c, "Doctor not found");
    if (userId) {
      if (!(await holdsRole(db, userId, "doctor"))) return badRequest(c, "Give this person the doctor role first");
      if (doc.userId && doc.userId !== userId) return conflict(c, "This profile is linked to someone else. Unlink it first.");
      const [other] = await db.select({ id: doctors.id }).from(doctors).where(eq(doctors.userId, userId));
      if (other && other.id !== id) return conflict(c, "This person is already linked to another doctor profile");
    }
    await db.update(doctors).set({ userId }).where(eq(doctors.id, id));
    return c.json({ success: true, message: userId ? "Doctor profile linked" : "Doctor profile unlinked" });
  });

  app.get(`${P}/care-providers`, listQuery, async (c) => {
    if (!hasGlobal(c.get("access"), ["admin"])) return forbidden(c);
    const q = c.req.valid("query");
    const where = and(
      q.userId ? eq(careProviders.userId, q.userId) : undefined,
      q.q ? or(ilike(careProviders.name, searchPattern(q.q)), ilike(careProviders.phone, searchPattern(q.q))) : undefined,
    );
    const [total] = await db.select({ n: count() }).from(careProviders).where(where);
    const rows = await db
      .select({
        id: careProviders.id,
        name: careProviders.name,
        phone: careProviders.phone,
        address: careProviders.address,
        districtName: districts.name,
        status: careProviders.status,
        userId: careProviders.userId,
        userName: user.name,
        userPhone: user.phoneNumber,
      })
      .from(careProviders)
      .innerJoin(districts, eq(districts.id, careProviders.districtId))
      .leftJoin(user, eq(user.id, careProviders.userId))
      .where(where)
      .orderBy(asc(careProviders.name))
      .limit(PAGE)
      .offset((q.page - 1) * PAGE);
    return c.json({ success: true, result: rows, total: total?.n ?? 0, pageSize: PAGE });
  });

  app.patch(`${P}/care-providers/:id/user`, linkBody, async (c) => {
    if (!hasGlobal(c.get("access"), ["admin"])) return forbidden(c);
    const { userId } = c.req.valid("json");
    const id = c.req.param("id");
    const [prov] = await db.select({ userId: careProviders.userId }).from(careProviders).where(eq(careProviders.id, id));
    if (!prov) return notFound(c, "Service provider not found");
    if (userId) {
      if (!(await holdsRole(db, userId, "service_provider"))) return badRequest(c, "Give this person the service provider role first");
      if (prov.userId && prov.userId !== userId) return conflict(c, "This provider is linked to someone else. Unlink it first.");
    }
    await db.update(careProviders).set({ userId }).where(eq(careProviders.id, id));
    return c.json({ success: true, message: userId ? "Provider linked" : "Provider unlinked" });
  });

  // =============================================================== doctors

  // The signed-in doctor's profile, or an error response.
  async function myDoctor(c: AdminContext) {
    const a = c.get("access");
    if (!hasOwnRole(a, "doctor")) return { error: forbidden(c) } as const;
    const [doc] = await db.select().from(doctors).where(eq(doctors.userId, a.userId));
    if (!doc) return { error: notFound(c, "No doctor profile is linked to your account yet. Please ask an admin.") } as const;
    return { doc } as const;
  }

  app.get(`${P}/doctor/profile`, async (c) => {
    const me = await myDoctor(c);
    if ("error" in me) return me.error;
    const [dept] = await db.select({ name: healthDepartments.name }).from(healthDepartments).where(eq(healthDepartments.id, me.doc.departmentId));
    const chambers = await db
      .select({
        id: doctorChambers.id,
        centerId: medicalCenters.id,
        centerName: medicalCenters.name,
        centerType: medicalCenters.centerType,
        centerAddress: medicalCenters.address,
        slotTexts: doctorChambers.slotTexts,
        roomNo: doctorChambers.roomNo,
        limitPerSlot: doctorChambers.limitPerSlot,
        consultationFee: doctorChambers.consultationFee,
        followUpFee: doctorChambers.followUpFee,
        bookingOpen: doctorChambers.bookingOpen,
        isOff: doctorChambers.isOff,
      })
      .from(doctorChambers)
      .innerJoin(medicalCenters, eq(medicalCenters.id, doctorChambers.centerId))
      .where(eq(doctorChambers.doctorId, me.doc.id))
      .orderBy(asc(doctorChambers.position), asc(medicalCenters.name));
    const { userId: _u, ...doc } = me.doc;
    return c.json({ success: true, result: { ...doc, departmentName: dept?.name ?? "", chambers } });
  });

  const doctorProfileFields = z.object({
    speciality: z.string().trim().max(200),
    designation: z.string().trim().max(200),
    qualifications: z.string().trim().max(500),
    experienceYears: z.coerce.number().int().min(0).max(80),
    consultationFee: money,
    followUpFee: money,
  });

  app.patch(`${P}/doctor/profile`, async (c) => {
    const me = await myDoctor(c);
    if ("error" in me) return me.error;
    const parsed = doctorProfileFields.partial().strict().safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) return badRequest(c, parsed.error.issues[0]?.message ?? "Invalid data");
    if (Object.keys(parsed.data).length) await db.update(doctors).set(parsed.data).where(eq(doctors.id, me.doc.id));
    return c.json({ success: true, message: "Profile saved" });
  });

  const chamberFields = z.object({ bookingOpen: z.boolean(), consultationFee: money, followUpFee: money });

  app.patch(`${P}/doctor/chambers/:id`, async (c) => {
    const me = await myDoctor(c);
    if ("error" in me) return me.error;
    const [ch] = await db.select({ doctorId: doctorChambers.doctorId }).from(doctorChambers).where(eq(doctorChambers.id, c.req.param("id")));
    if (!ch) return notFound(c, "Chamber not found");
    if (ch.doctorId !== me.doc.id) return forbidden(c);
    const parsed = chamberFields.partial().strict().safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) return badRequest(c, parsed.error.issues[0]?.message ?? "Invalid data");
    if (Object.keys(parsed.data).length) await db.update(doctorChambers).set(parsed.data).where(eq(doctorChambers.id, c.req.param("id")));
    const msg = parsed.data.bookingOpen === undefined ? "Chamber saved" : parsed.data.bookingOpen ? "Booking is open" : "Booking is closed";
    return c.json({ success: true, message: msg });
  });

  // Appointments at the doctor's chambers: one date, or today and later.
  app.get(
    `${P}/doctor/appointments`,
    zValidator(
      "query",
      z.object({
        date: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/, "Use a date like 2026-11-20")
          .optional(),
        chamberId: z.string().optional(),
      }),
    ),
    async (c) => {
      const me = await myDoctor(c);
      if ("error" in me) return me.error;
      const q = c.req.valid("query");
      const today = dhakaToday();
      const conds: (SQL | undefined)[] = [
        eq(appointments.doctorId, me.doc.id),
        q.date ? eq(appointments.appointmentDate, q.date) : gte(appointments.appointmentDate, today),
        q.chamberId ? eq(appointments.chamberId, q.chamberId) : undefined,
      ];
      const rows = await db
        .select({
          id: appointments.id,
          date: appointments.appointmentDate,
          timeSlot: appointments.timeSlot,
          serialNo: appointments.serialNo,
          status: appointments.status,
          consultationFee: appointments.consultationFee,
          chamberId: appointments.chamberId,
          centerName: medicalCenters.name,
          patientName: appointments.patientName,
          patientPhone: patients.contact,
          patientAltPhone: patients.altContact,
          patientGender: patients.gender,
          patientDob: patients.dateOfBirth,
        })
        .from(appointments)
        .innerJoin(patients, eq(patients.id, appointments.patientId))
        .innerJoin(medicalCenters, eq(medicalCenters.id, appointments.centerId))
        .where(and(...conds))
        .orderBy(asc(appointments.appointmentDate), asc(medicalCenters.name), asc(appointments.timeSlot), asc(appointments.serialNo))
        .limit(500);
      return c.json({
        success: true,
        today,
        result: rows.map(({ patientDob, ...r }) => ({ ...r, patientAge: ageOf(patientDob, today) })),
      });
    },
  );

  app.patch(
    `${P}/doctor/appointments/:id`,
    zValidator("json", z.object({ status: z.enum(["Visited", "Cancelled", "No-show"]) })),
    async (c) => {
      const me = await myDoctor(c);
      if ("error" in me) return me.error;
      const { status } = c.req.valid("json");
      const id = c.req.param("id");
      const [row] = await db.select({ doctorId: appointments.doctorId, status: appointments.status }).from(appointments).where(eq(appointments.id, id));
      if (!row) return notFound(c, "Appointment not found");
      if (row.doctorId !== me.doc.id) return forbidden(c);
      if (row.status === "Cancelled") return conflict(c, "This appointment was cancelled");
      await db.update(appointments).set({ status }).where(eq(appointments.id, id));
      const label = status === "Visited" ? "completed" : status === "No-show" ? "a no-show" : "cancelled";
      return c.json({ success: true, message: `Marked ${label}` });
    },
  );

  // ===================================================== service providers

  const providerCols = {
    id: careProviders.id,
    name: careProviders.name,
    districtName: districts.name,
    address: careProviders.address,
    contactPerson: careProviders.contactPerson,
    phone: careProviders.phone,
    altPhone: careProviders.altPhone,
    serviceIds: careProviders.serviceIds,
    experienceYears: careProviders.experienceYears,
    serviceHours: careProviders.serviceHours,
    serviceDetails: careProviders.serviceDetails,
    rating: careProviders.rating,
    totalReviews: careProviders.totalReviews,
    logo: careProviders.logo,
    status: careProviders.status,
  };

  // The provider listings this person manages (usually one).
  app.get(`${P}/provider/listings`, async (c) => {
    const a = c.get("access");
    if (!hasOwnRole(a, "service_provider")) return forbidden(c);
    const rows = await db
      .select(providerCols)
      .from(careProviders)
      .innerJoin(districts, eq(districts.id, careProviders.districtId))
      .where(eq(careProviders.userId, a.userId))
      .orderBy(asc(careProviders.name));
    const ids = [...new Set(rows.flatMap((r) => r.serviceIds))];
    const services = ids.length
      ? await db.select({ id: careServices.id, name: careServices.nameEn }).from(careServices).where(inArray(careServices.id, ids))
      : [];
    return c.json({
      success: true,
      result: rows.map(({ serviceIds, ...r }) => ({
        ...r,
        services: serviceIds.map((id) => services.find((s) => s.id === id)?.name).filter(Boolean),
      })),
    });
  });

  const phone = z.string().trim().max(20).nullable();
  const providerFields = z.object({
    contactPerson: z.string().trim().max(100).nullable(),
    phone,
    altPhone: phone,
    address: z.string().trim().max(300),
    serviceHours: z.string().trim().max(200).nullable(),
    serviceDetails: z.string().trim().max(3000),
    experienceYears: z.coerce.number().int().min(0).max(80),
    status: z.enum(["active", "inactive"]),
  });

  app.patch(`${P}/provider/listings/:id`, async (c) => {
    const a = c.get("access");
    if (!hasOwnRole(a, "service_provider")) return forbidden(c);
    const id = c.req.param("id");
    const [row] = await db.select({ userId: careProviders.userId }).from(careProviders).where(eq(careProviders.id, id));
    if (!row) return notFound(c, "Listing not found");
    if (row.userId !== a.userId) return forbidden(c);
    const parsed = providerFields.partial().strict().safeParse(await c.req.json().catch(() => null));
    if (!parsed.success) return badRequest(c, parsed.error.issues[0]?.message ?? "Invalid data");
    if (Object.keys(parsed.data).length) await db.update(careProviders).set(parsed.data).where(eq(careProviders.id, id));
    const msg = parsed.data.status === "inactive" ? "Listing hidden" : parsed.data.status === "active" ? "Listing is live" : "Listing saved";
    return c.json({ success: true, message: msg });
  });
}
