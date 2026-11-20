// All Care endpoints with the paths and response shapes the web app uses
// (EXPLORE_ALL_CARE_SERVICE, EXPLORE_CARE_PROVIDER). Read-only: the app has
// no booking or request flow for All Care; customers call the provider.
import { zValidator } from "@hono/zod-validator";
import { allCare as contract } from "@notension/shared";
import { and, asc, desc, eq, getTableColumns, lte, sql } from "drizzle-orm";
import { Hono } from "hono";
import type { AuthEnv } from "../../auth/middleware";
import type { Db } from "../../db/client";
import { CARE_SLIDER_SLOTS, careProviders, careServices, careSliders, districts } from "../../db/schema";

type ProviderRow = Omit<typeof careProviders.$inferSelect, "location" | "userId"> & {
  districtName: string | null;
  distance?: number;
};

// ------------------------------------------------------------ serializers

export const toLegacyService = (s: typeof careServices.$inferSelect): contract.CareService => ({
  _id: s.id,
  service_name_eng: s.nameEn,
  service_name_bn: s.nameBn,
  serial_no: s.serialNo,
  service_banner_app: s.bannerApp,
  status: s.status,
  district_ids: s.districtIds,
  sliderInfo: { _id: s.sliderId, service_id: s.id, service_slider: s.sliderImages },
});

export const toLegacySlider = (s: typeof careSliders.$inferSelect): contract.CareSlider => ({
  _id: s.id,
  district_id: s.districtId,
  ...(Object.fromEntries(CARE_SLIDER_SLOTS.map((slot) => [slot, s.slides[slot] ?? []])) as Omit<
    contract.CareSlider,
    "_id" | "district_id"
  >),
});

export const toLegacyProvider = ({ distance, ...p }: ProviderRow): contract.CareProvider => ({
  _id: p.id,
  provider_name: p.name,
  district_id: p.districtId,
  district_name: p.districtName ?? "",
  address: p.address,
  latitude: p.latitude,
  longitude: p.longitude,
  location: { type: "Point", coordinates: [p.longitude, p.latitude] },
  contact_person_name: p.contactPerson,
  contact_no: p.phone,
  alternative_contact_no: p.altPhone,
  service_ids: p.serviceIds,
  rating: p.rating,
  total_reviews: p.totalReviews,
  experience_years: p.experienceYears,
  service_hours: p.serviceHours,
  provider_banner_app: p.bannerApp,
  provider_logo: p.logo,
  service_details: p.serviceDetails,
  status: p.status,
  ...(distance === undefined ? {} : { distance }),
});

// ---------------------------------------------------------------- routes

const P = "/client-app-api/v1/all-care";

const { location: _location, userId: _userId, ...providerCols } = getTableColumns(careProviders);
const hasElement = (column: typeof careServices.districtIds | typeof careProviders.serviceIds, value: string) =>
  sql`${column} @> ARRAY[${value}]::text[]`;

export const allCareRoutes = (db: Db) =>
  new Hono<AuthEnv>()
    .get(`${P}/explore-all-service`, zValidator("query", contract.exploreServicesInput), async (c) => {
      const { district_id: districtId } = c.req.valid("query");
      const [services, slider] = await Promise.all([
        db
          .select()
          .from(careServices)
          .where(and(eq(careServices.status, "active"), hasElement(careServices.districtIds, districtId)))
          .orderBy(asc(careServices.serialNo), asc(careServices.id)),
        db.select().from(careSliders).where(eq(careSliders.districtId, districtId)),
      ]);
      return c.json({
        success: true as const,
        message: services.length ? "Services found" : "No service found in this area",
        result: { servicesType: services.map(toLegacyService), sliderByDistrict: slider.map(toLegacySlider) },
      });
    })

    .post(`${P}/explore-care-provider`, zValidator("json", contract.exploreProvidersInput), async (c) => {
      const { district_id: districtId, service_id: serviceId, latitude: lat, longitude: lng, ...input } =
        c.req.valid("json");
      if (!serviceId) return c.json({ success: false as const, message: "service_id is required" }, 400);
      const page = Math.max(1, Math.floor(input.page || 1));
      const hasLocation = lat !== undefined && lng !== undefined;

      // Distance on a sphere, like the old backend (and demo mode).
      const distance = sql<number>`round(ST_Distance(${careProviders.location}, ST_SetSRID(ST_MakePoint(${lng ?? 0}, ${lat ?? 0}), 4326)::geography, false))::int`;
      const matches = and(
        eq(careProviders.districtId, districtId),
        eq(careProviders.status, "active"),
        hasElement(careProviders.serviceIds, serviceId),
      );
      const select = () =>
        db
          .select({ ...providerCols, districtName: districts.name, ...(hasLocation ? { distance } : {}) })
          .from(careProviders)
          .leftJoin(districts, eq(districts.id, careProviders.districtId))
          .$dynamic();
      const paged = <T extends ReturnType<typeof select>>(q: T) =>
        q.limit(contract.PAGE_SIZE).offset((page - 1) * contract.PAGE_SIZE);

      const [[total], popular, nearest] = await Promise.all([
        db.select({ n: sql<number>`count(*)::int` }).from(careProviders).where(matches),
        paged(
          select()
            .where(matches)
            .orderBy(desc(careProviders.rating), desc(careProviders.totalReviews), asc(careProviders.id)),
        ),
        hasLocation
          ? paged(
              select()
                .where(and(matches, lte(distance, contract.NEAREST_RADIUS_M)))
                .orderBy(asc(distance), asc(careProviders.id)),
            )
          : paged(select().where(matches).orderBy(asc(careProviders.id))),
      ]);
      const count = total?.n ?? 0;

      return c.json({
        success: true as const,
        message: count ? "Care providers found" : "No care provider found",
        result: {
          careProviderByDistrict: popular.map(toLegacyProvider),
          nearestCareProvider: nearest.map(toLegacyProvider),
          totalCareProvider: count,
          page,
        },
      });
    });
