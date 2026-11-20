// Health care endpoints (doctors, centres, service providers) with the paths
// and response shapes the web app already uses (HEALTH_CARE in
// src/api-endpoints/api-endpoint.js). Patients and appointments are in
// ./appointments.ts.
import { zValidator } from "@hono/zod-validator";
import { healthCare as contract } from "@notension/shared";
import { and, asc, eq, getTableColumns, ilike, inArray, or, sql, type SQL } from "drizzle-orm";
import { Hono } from "hono";
import type { AuthEnv } from "../../auth/middleware";
import type { Db } from "../../db/client";
import {
  districts,
  doctorChambers,
  doctors,
  healthBanners,
  healthDepartments,
  medicalCenters,
  medicalServiceProviders,
  type HealthBannerSlot,
} from "../../db/schema";
import { healthCareWriteRoutes } from "./appointments";

const { location: _location, ...centerColumns } = getTableColumns(medicalCenters);

type CenterRow = Omit<typeof medicalCenters.$inferSelect, "location">;
type DepartmentRow = typeof healthDepartments.$inferSelect;
type DoctorRow = typeof doctors.$inferSelect;
type ChamberRow = {
  chamber: typeof doctorChambers.$inferSelect;
  doctor: DoctorRow;
  center: CenterRow;
  dept: DepartmentRow;
};

// ------------------------------------------------------------ serializers

export const toDepartment = (d: DepartmentRow): contract.Department => ({
  _id: d.id,
  slug: d.slug,
  dept_name: d.name,
  dept_name_bn: d.nameBn,
  banner_1: d.banner1,
  banner_2: d.banner2,
  serial: d.serial,
  is_active: d.isActive,
});

export const toCenter = (c: CenterRow): contract.Center => ({
  _id: c.id,
  center_name: c.name,
  center_type: c.centerType,
  district_id: c.districtId,
  medical_center_banner_app: c.bannerApp,
  is_active: c.isActive,
  address: c.address,
  latitude: c.latitude,
  longitude: c.longitude,
  // Absent rather than null, as the apps receive them.
  ...(c.contact1 != null && { apointment_contact_1: c.contact1 }),
  ...(c.contact2 != null && { apointment_contact_2: c.contact2 }),
});

export const toDoctor = (d: DoctorRow, deptName: string): contract.Doctor => ({
  _id: d.id,
  district_id: d.districtId,
  department: d.departmentId,
  dept_name: deptName,
  speciality: d.speciality,
  is_active: d.isActive,
  doctor_name: d.name,
  gender: d.gender,
  qualifications: d.qualifications,
  designation: d.designation,
  experience_years: d.experienceYears,
  bmdc_reg_no: d.bmdcRegNo,
  consultation_fee: d.consultationFee,
  follow_up_fee: d.followUpFee,
});

export const toChamber = ({ chamber: ch, doctor, center, dept }: ChamberRow): contract.Chamber => {
  const [slot1, slot2, slot3] = ch.slotTexts;
  return {
    _id: ch.id,
    doctorInfo: toDoctor(doctor, dept.name),
    consultationCenterInfo: toCenter(center),
    deptInfo: toDepartment(dept),
    district_id: center.districtId,
    ...(slot1 !== undefined && { chamber_onDay_time_slot_1: slot1 }),
    ...(slot2 !== undefined && { chamber_onDay_time_slot_2: slot2 }),
    ...(slot3 !== undefined && { chamber_onDay_time_slot_3: slot3 }),
    chamber_schedule: ch.schedule,
    appointment_scheduling: ch.scheduling,
    consultation_limit_per_slot: ch.limitPerSlot,
    consultation_fee: ch.consultationFee,
    follow_up_fee: ch.followUpFee,
    room_no: ch.roomNo,
    book_an_appointment: ch.bookingOpen,
    is_chamber_off: ch.isOff,
    is_popular: ch.isPopular,
  };
};

// --------------------------------------------------------------- queries

const chamberColumns = {
  chamber: doctorChambers,
  doctor: doctors,
  center: centerColumns,
  dept: healthDepartments,
};

// Chambers with their doctor, centre and department; `distance` (metres) when
// a distance expression is given, else 0.
const selectChambers = (db: Db, distance: SQL<number> = sql<number>`0::int`) =>
  db
    .select({ ...chamberColumns, distance })
    .from(doctorChambers)
    .innerJoin(doctors, eq(doctors.id, doctorChambers.doctorId))
    .innerJoin(medicalCenters, eq(medicalCenters.id, doctorChambers.centerId))
    .innerJoin(healthDepartments, eq(healthDepartments.id, doctors.departmentId))
    .$dynamic();

const listedChamber = and(eq(doctors.isActive, true), eq(medicalCenters.isActive, true));

const offset = (page: number | undefined) => (Math.max(1, page || 1) - 1) * contract.PAGE_SIZE;

// Distance in metres from a point to the centre (0 without a point).
const distanceTo = (point: { lat: number; lng: number } | null) =>
  point
    ? sql<number>`round(ST_Distance(${medicalCenters.location}, ST_SetSRID(ST_MakePoint(${point.lng}, ${point.lat}), 4326)::geography))::int`
    : sql<number>`0::int`;

// The user's position, or the district's centre when the app has none.
async function userPoint(db: Db, input: { latitude?: number | null; longitude?: number | null; districtId?: string | null }) {
  if (input.latitude != null && input.longitude != null) return { lat: input.latitude, lng: input.longitude };
  if (!input.districtId) return null;
  const [d] = await db
    .select({ lat: districts.latitude, lng: districts.longitude })
    .from(districts)
    .where(eq(districts.id, input.districtId));
  return d?.lat != null && d.lng != null ? { lat: d.lat, lng: d.lng } : null;
}

// A district "has health care" once it has a listed centre.
async function districtHasCenters(db: Db, districtId: string | null | undefined) {
  if (!districtId) return false;
  const [row] = await db
    .select({ id: medicalCenters.id })
    .from(medicalCenters)
    .where(and(eq(medicalCenters.districtId, districtId), eq(medicalCenters.isActive, true)))
    .limit(1);
  return !!row;
}

// "Consultation Center" (or no type) means every centre where doctors sit;
// other types match the centre's own type.
const centerTypeFilter = (db: Db, centerType: string | null | undefined): SQL =>
  !centerType || centerType === "Consultation Center"
    ? inArray(medicalCenters.id, db.select({ id: doctorChambers.centerId }).from(doctorChambers))
    : eq(medicalCenters.centerType, centerType as CenterRow["centerType"]);

const centersIn = (db: Db, districtId: string, centerType: string | null | undefined) =>
  and(eq(medicalCenters.districtId, districtId), eq(medicalCenters.isActive, true), centerTypeFilter(db, centerType));

async function bannersBySlot(db: Db, slots: HealthBannerSlot[]) {
  const rows = await db.select().from(healthBanners).orderBy(asc(healthBanners.position));
  return Object.fromEntries(
    slots.map((slot) => [
      slot,
      rows.filter((r) => r.slot === slot).map((r) => ({ _id: r.id, file_name: r.fileName, title: r.title })),
    ]),
  ) as Record<HealthBannerSlot, contract.Banner[]>;
}

const searchText = (v: unknown) => {
  const text = String(v ?? "").trim();
  return text.length < 2 ? null : `%${text.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
};

// Fixed ids of the banner wrapper objects the apps receive.
const BANNER_GROUP_IDS = {
  medicalService: "6650ba000000000000000070",
  findDoctor: "6650ba000000000000000100",
  centerTypes: "6650ba000000000000000101",
};

// ---------------------------------------------------------------- routes

const P = "/client-app-api/v1/health-care";

export const healthCareRoutes = (db: Db) =>
  new Hono<AuthEnv>()
    // Medical services home banners.
    .get(`${P}/explore-medical-service-provider`, async (c) => {
      const b = await bannersBySlot(db, ["medical_service_banner"]);
      return c.json({
        success: true as const,
        result: [{ _id: BANNER_GROUP_IDS.medicalService, medical_service_banner: b.medical_service_banner }],
      });
    })

    .get(`${P}/get-medical-service-provider`, async (c) => {
      const districtId = c.req.query("district_id") ?? "";
      const serviceType = c.req.query("serviceType");
      const rows = await db
        .select()
        .from(medicalServiceProviders)
        .where(
          and(
            eq(medicalServiceProviders.districtId, districtId),
            serviceType ? eq(medicalServiceProviders.serviceType, serviceType) : undefined,
          ),
        )
        .orderBy(asc(medicalServiceProviders.position));
      return c.json({ success: true as const, result: rows.map(toProvider) });
    })

    .get(`${P}/get-ambulance-service-provider`, async (c) => {
      const districtId = c.req.query("district_id") || c.req.query("districtId") || "";
      const rows = await db
        .select()
        .from(medicalServiceProviders)
        .where(and(eq(medicalServiceProviders.districtId, districtId), eq(medicalServiceProviders.serviceType, "Ambulance")))
        .orderBy(asc(medicalServiceProviders.position));
      return c.json({ success: true as const, result: rows.map(toProvider) });
    })

    // Find doctor home: banners, departments and popular doctors.
    .get(`${P}/explore-find-doctors`, async (c) => {
      const districtId = c.req.query("district_id");
      const b = await bannersBySlot(db, ["find_doctor_banner", "consultation_center_banner", "nearest_doctor_banner"]);
      const banner = [{ _id: BANNER_GROUP_IDS.findDoctor, ...b }];
      if (!(await districtHasCenters(db, districtId))) {
        return c.json({ success: true as const, result: { banner, allDepartments: [], popularDoctors: [] } });
      }
      const [depts, popular] = await Promise.all([
        db.select().from(healthDepartments).where(eq(healthDepartments.isActive, true)).orderBy(asc(healthDepartments.serial)),
        selectChambers(db)
          .where(and(listedChamber, eq(medicalCenters.districtId, districtId!), eq(doctorChambers.isPopular, true)))
          .orderBy(asc(doctorChambers.position)),
      ]);
      return c.json({
        success: true as const,
        result: { banner, allDepartments: depts.map(toDepartment), popularDoctors: popular.map(toChamber) },
      });
    })

    // One chamber per doctor (the nearest), nearest first.
    .post(`${P}/get-nearest-doctors`, zValidator("json", contract.nearbyInput), async (c) => {
      const input = c.req.valid("json");
      if (!input.districtId) return c.json({ success: true as const, result: [] });
      const distance = distanceTo(await userPoint(db, input));
      const rows = await selectChambers(db, distance)
        .where(and(listedChamber, eq(medicalCenters.districtId, input.districtId)))
        .orderBy(asc(distance), asc(doctorChambers.position));
      const seen = new Set<string>();
      const result = rows
        .filter((r) => !seen.has(r.doctor.id) && !!seen.add(r.doctor.id))
        .slice(0, contract.PAGE_SIZE)
        .map((r) => ({ ...toChamber(r), distance: r.distance }));
      return c.json({ success: true as const, result });
    })

    .post(`${P}/get-doctors-by-dept`, zValidator("json", contract.doctorsByDeptInput), async (c) => {
      const { districtId, deptId, page } = c.req.valid("json");
      if (!districtId || !deptId) return c.json({ success: true as const, result: [] });
      const rows = await selectChambers(db)
        .where(and(listedChamber, eq(medicalCenters.districtId, districtId), eq(doctors.departmentId, deptId)))
        .orderBy(asc(doctorChambers.position))
        .limit(contract.PAGE_SIZE)
        .offset(offset(page));
      return c.json({ success: true as const, result: rows.map(toChamber) });
    })

    .post(`${P}/get-doctors-by-center`, zValidator("json", contract.doctorsByCenterInput), async (c) => {
      const { centerId, deptId, page } = c.req.valid("json");
      if (!centerId) return c.json({ success: true as const, result: [] });
      const rows = await selectChambers(db)
        .where(
          and(listedChamber, eq(doctorChambers.centerId, centerId), deptId ? eq(doctors.departmentId, deptId) : undefined),
        )
        .orderBy(asc(doctorChambers.position))
        .limit(contract.PAGE_SIZE)
        .offset(offset(page));
      return c.json({ success: true as const, result: rows.map(toChamber) });
    })

    // Every chamber of one doctor.
    .get(`${P}/get-doctor-profile`, async (c) => {
      const doctorId = c.req.query("doctorId") ?? "";
      const rows = await selectChambers(db)
        .where(and(listedChamber, eq(doctors.id, doctorId)))
        .orderBy(asc(doctorChambers.position));
      return c.json({ success: true as const, result: rows.map(toChamber) });
    })

    // ----------------------------------------------------------- centres

    .post(`${P}/get-nearest-consultation-certer`, zValidator("json", contract.nearbyInput), async (c) => {
      const input = c.req.valid("json");
      if (!input.districtId) return c.json({ success: true as const, result: [] });
      const distance = distanceTo(await userPoint(db, input));
      const rows = await db
        .select({ ...centerColumns, distance })
        .from(medicalCenters)
        .where(centersIn(db, input.districtId, input.centerType))
        .orderBy(asc(distance), asc(medicalCenters.position));
      return c.json({
        success: true as const,
        result: rows.map(({ distance: d, ...center }) => ({ ...toCenter(center), distance: d })),
      });
    })

    .post(`${P}/get-consultation-certer`, zValidator("json", contract.centersByDistrictInput), async (c) => {
      const { districtId, centerType, page } = c.req.valid("json");
      const hasCenters = await districtHasCenters(db, districtId);
      const rows = hasCenters
        ? await db
            .select(centerColumns)
            .from(medicalCenters)
            .where(centersIn(db, districtId!, centerType))
            .orderBy(asc(medicalCenters.position))
            .limit(contract.PAGE_SIZE)
            .offset(offset(page))
        : [];
      const banners = hasCenters
        ? [
            {
              _id: BANNER_GROUP_IDS.centerTypes,
              ...(await bannersBySlot(db, [
                "hospital_banner",
                "diagnostic_center_banner",
                "eye_care_center_banner",
                "deltal_care_center_banner",
              ])),
            },
          ]
        : [];
      return c.json({ success: true as const, result: { consultationCenterInfo: rows.map(toCenter), banners } });
    })

    .post(`${P}/search-consultation-certer`, zValidator("json", contract.searchCentersInput), async (c) => {
      const like = searchText(c.req.valid("json").search);
      if (!like) return c.json({ success: true as const, result: [] });
      const rows = await db
        .select(centerColumns)
        .from(medicalCenters)
        .where(
          and(
            eq(medicalCenters.isActive, true),
            or(ilike(medicalCenters.name, like), ilike(medicalCenters.address, like), ilike(medicalCenters.centerType, like)),
          ),
        )
        .orderBy(asc(medicalCenters.position));
      return c.json({ success: true as const, result: rows.map(toCenter) });
    })

    // A centre with its doctors and their departments.
    .get(`${P}/explore-consultation-certer`, async (c) => {
      const centerId = c.req.query("CenterID") ?? "";
      const [[center], rows] = await Promise.all([
        db.select(centerColumns).from(medicalCenters).where(eq(medicalCenters.id, centerId)),
        selectChambers(db)
          .where(and(listedChamber, eq(doctorChambers.centerId, centerId)))
          .orderBy(asc(doctorChambers.position)),
      ]);
      const chambers = rows.map(toChamber);
      const departments = new Map<string, { _id: string; deptInfo: contract.Department }>();
      for (const ch of chambers) {
        if (!departments.has(ch.deptInfo._id)) departments.set(ch.deptInfo._id, { _id: ch.deptInfo._id, deptInfo: ch.deptInfo });
      }
      return c.json({
        success: true as const,
        result: {
          centerInfo: center ? toCenter(center) : null,
          popularDoctorsByCenter: chambers,
          departmentsInfoByCenter: [...departments.values()],
        },
      });
    })

    .route("/", healthCareWriteRoutes(db));

const toProvider = (p: typeof medicalServiceProviders.$inferSelect) => ({
  _id: p.id,
  district_id: p.districtId,
  service_type: p.serviceType,
  provider_name: p.name,
  contact: p.contact,
  address: p.address,
});
