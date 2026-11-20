// Loads the web app's All Care demo data (services, home sliders, providers).
import { DEMO_LOCATIONS } from "@/demo/demoLocations";
import { ALL_CARE_PROVIDERS, ALL_SERVICES, CARE_SLIDERS } from "@/demo/modules/allCare/data";
import { count } from "drizzle-orm";
import type { Db } from "../db/client";
import { CARE_SLIDER_SLOTS, careProviders, careServices, careSliders, districts } from "../db/schema";

type Any = Record<string, any>;

export async function hasAllCareData(db: Db): Promise<boolean> {
  const [row] = await db.select({ n: count() }).from(careServices);
  return (row?.n ?? 0) > 0;
}

export async function seedAllCare(db: Db) {
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

    await tx.insert(careServices).values(
      ALL_SERVICES.map((s: Any) => ({
        id: s._id,
        nameEn: s.service_name_eng,
        nameBn: s.service_name_bn,
        serialNo: s.serial_no,
        bannerApp: s.service_banner_app,
        status: s.status,
        districtIds: s.district_ids,
        sliderId: s.sliderInfo?._id ?? null,
        sliderImages: s.sliderInfo?.service_slider ?? [],
      })),
    );

    await tx.insert(careSliders).values(
      CARE_SLIDERS.map((s: Any) => ({
        id: s._id,
        districtId: s.district_id,
        slides: Object.fromEntries(CARE_SLIDER_SLOTS.map((slot) => [slot, s[slot] ?? []])),
      })),
    );

    await tx.insert(careProviders).values(
      ALL_CARE_PROVIDERS.map((p: Any) => ({
        id: p._id,
        name: p.provider_name,
        districtId: p.district_id,
        address: p.address,
        latitude: p.latitude,
        longitude: p.longitude,
        contactPerson: p.contact_person_name,
        phone: p.contact_no,
        altPhone: p.alternative_contact_no,
        serviceIds: p.service_ids,
        rating: p.rating,
        totalReviews: p.total_reviews,
        experienceYears: p.experience_years,
        serviceHours: p.service_hours,
        bannerApp: p.provider_banner_app,
        logo: p.provider_logo,
        serviceDetails: p.service_details,
        status: p.status,
      })),
    );
  });
}
