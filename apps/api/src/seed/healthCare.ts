// Loads the web app's health care demo data (departments, centres, doctors,
// chambers, service providers, banners), keeping the demo ids so the web
// app's URLs keep working.
import { DEMO_LOCATIONS } from "@/demo/demoLocations";
import {
  CENTER_TYPE_BANNERS,
  CONSULTATION_CENTER_BANNER,
  DEMO_CENTERS,
  DEMO_CHAMBERS,
  DEMO_DEPARTMENTS,
  DEMO_DOCTORS,
  DEMO_MEDICAL_SERVICE_PROVIDERS,
  FIND_DOCTOR_BANNER,
  MEDICAL_SERVICE_BANNER,
  NEAREST_DOCTOR_BANNER,
} from "@/demo/modules/healthCare/data";
import { count } from "drizzle-orm";
import type { Db } from "../db/client";
import {
  districts,
  doctorChambers,
  doctors,
  healthBanners,
  healthDepartments,
  medicalCenters,
  medicalServiceProviders,
  type HealthBannerSlot,
} from "../db/schema";

type Any = Record<string, any>;

export async function hasHealthCareData(db: Db): Promise<boolean> {
  const [row] = await db.select({ n: count() }).from(medicalCenters);
  return (row?.n ?? 0) > 0;
}

export async function seedHealthCare(db: Db) {
  const bannerGroups: [HealthBannerSlot, Any[]][] = [
    ["find_doctor_banner", FIND_DOCTOR_BANNER],
    ["consultation_center_banner", CONSULTATION_CENTER_BANNER],
    ["nearest_doctor_banner", NEAREST_DOCTOR_BANNER],
    ["hospital_banner", CENTER_TYPE_BANNERS.hospital_banner],
    ["diagnostic_center_banner", CENTER_TYPE_BANNERS.diagnostic_center_banner],
    ["eye_care_center_banner", CENTER_TYPE_BANNERS.eye_care_center_banner],
    ["deltal_care_center_banner", CENTER_TYPE_BANNERS.deltal_care_center_banner],
    ["medical_service_banner", MEDICAL_SERVICE_BANNER],
  ];

  await db.transaction(async (tx) => {
    await tx
      .insert(districts)
      .values(
        DEMO_LOCATIONS.map((l: Any) => ({
          id: l.districtId,
          name: l.districtName,
          latitude: l.latitude,
          longitude: l.longitude,
        })),
      )
      .onConflictDoNothing();

    await tx.insert(healthBanners).values(
      bannerGroups.flatMap(([slot, list]) =>
        list.map((b, position) => ({ id: b._id, slot, fileName: b.file_name, title: b.title, position })),
      ),
    );

    await tx.insert(healthDepartments).values(
      DEMO_DEPARTMENTS.map((d: Any) => ({
        id: d._id,
        slug: d.slug,
        name: d.dept_name,
        nameBn: d.dept_name_bn,
        banner1: d.banner_1,
        banner2: d.banner_2,
        serial: d.serial,
        isActive: d.is_active,
      })),
    );

    await tx.insert(medicalCenters).values(
      DEMO_CENTERS.map((c: Any, position: number) => ({
        id: c._id,
        name: c.center_name,
        centerType: c.center_type,
        districtId: c.district_id,
        address: c.address,
        latitude: c.latitude,
        longitude: c.longitude,
        bannerApp: c.medical_center_banner_app,
        contact1: c.apointment_contact_1,
        contact2: c.apointment_contact_2,
        isActive: c.is_active,
        position,
      })),
    );

    await tx.insert(doctors).values(
      DEMO_DOCTORS.map((d: Any, position: number) => ({
        id: d._id,
        districtId: d.district_id,
        departmentId: d.department,
        name: d.doctor_name,
        gender: d.gender,
        speciality: d.speciality,
        qualifications: d.qualifications,
        designation: d.designation,
        experienceYears: d.experience_years,
        bmdcRegNo: d.bmdc_reg_no,
        consultationFee: d.consultation_fee,
        followUpFee: d.follow_up_fee,
        isActive: d.is_active,
        position,
      })),
    );

    await tx.insert(doctorChambers).values(
      DEMO_CHAMBERS.map((ch: Any, position: number) => ({
        id: ch._id,
        doctorId: ch.doctorInfo._id,
        centerId: ch.consultationCenterInfo._id,
        slotTexts: [ch.chamber_onDay_time_slot_1, ch.chamber_onDay_time_slot_2, ch.chamber_onDay_time_slot_3].filter(
          (t): t is string => typeof t === "string",
        ),
        schedule: ch.chamber_schedule,
        scheduling: ch.appointment_scheduling,
        limitPerSlot: ch.consultation_limit_per_slot,
        consultationFee: ch.consultation_fee,
        followUpFee: ch.follow_up_fee,
        roomNo: ch.room_no,
        bookingOpen: ch.book_an_appointment,
        isOff: ch.is_chamber_off,
        isPopular: ch.is_popular,
        position,
      })),
    );

    await tx.insert(medicalServiceProviders).values(
      DEMO_MEDICAL_SERVICE_PROVIDERS.map((p: Any, position: number) => ({
        id: p._id,
        districtId: p.district_id,
        serviceType: p.service_type,
        name: p.provider_name,
        contact: p.contact,
        address: p.address,
        position,
      })),
    );
  });
}
