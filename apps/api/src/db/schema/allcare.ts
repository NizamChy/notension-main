// All Care: home services (electrician, tutor, movers, ...), the providers
// that offer them, and the module's home-page sliders.
import { sql } from "drizzle-orm";
import {
  customType,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { objectId } from "../ids";
import { user } from "./auth";
import { districts } from "./catalog";

const id = () => text("id").primaryKey().$defaultFn(objectId);
const createdAt = () => timestamp("created_at", { withTimezone: true }).notNull().defaultNow();
const emptyIds = () => sql`'{}'::text[]`;

// Same as store.location in catalog.ts: only used inside SQL.
const geographyPoint = customType<{ data: string; driverData: string }>({
  dataType: () => "geography",
});

export const careServices = pgTable(
  "care_service",
  {
    id: id(),
    nameEn: text("name_en").notNull(),
    nameBn: text("name_bn"),
    serialNo: integer("serial_no").notNull().default(0),
    bannerApp: text("banner_app"),
    status: text("status", { enum: ["active", "inactive"] }).notNull().default("active"),
    // Districts the service is offered in.
    districtIds: text("district_ids").array().notNull().default(emptyIds()),
    // The slides on the service's own page (legacy sliderInfo).
    sliderId: text("slider_id").$defaultFn(objectId),
    sliderImages: text("slider_images").array().notNull().default(emptyIds()),
    createdAt: createdAt(),
  },
  (t) => [index("care_service_districts_idx").using("gin", t.districtIds)],
);

export const CARE_SLIDER_SLOTS = [
  "first_slider",
  "second_slider",
  "third_slider",
  "fourth_slider",
  "fifth_slider",
  "sixth_slider",
  "seventh_slider",
] as const;
export type CareSliderSlot = (typeof CARE_SLIDER_SLOTS)[number];
export type CareSlide = { _id: string; file_name: string };

// The All Care home page sliders of one district.
export const careSliders = pgTable("care_slider", {
  id: id(),
  districtId: text("district_id")
    .notNull()
    .unique()
    .references(() => districts.id),
  slides: jsonb("slides").$type<Partial<Record<CareSliderSlot, CareSlide[]>>>().notNull().default({}),
});

export const careProviders = pgTable(
  "care_provider",
  {
    id: id(),
    // The account that manages this provider (role service_provider), if any.
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    districtId: text("district_id")
      .notNull()
      .references(() => districts.id),
    address: text("address").notNull().default(""),
    latitude: doublePrecision("latitude").notNull(),
    longitude: doublePrecision("longitude").notNull(),
    location: geographyPoint("location").generatedAlwaysAs(
      sql`ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography`,
    ),
    contactPerson: text("contact_person"),
    phone: text("phone"),
    altPhone: text("alt_phone"),
    serviceIds: text("service_ids").array().notNull().default(emptyIds()),
    rating: doublePrecision("rating").notNull().default(0),
    totalReviews: integer("total_reviews").notNull().default(0),
    experienceYears: integer("experience_years").notNull().default(0),
    serviceHours: text("service_hours"),
    bannerApp: text("banner_app"),
    logo: text("logo"),
    serviceDetails: text("service_details").notNull().default(""),
    status: text("status", { enum: ["active", "inactive"] }).notNull().default("active"),
    createdAt: createdAt(),
  },
  (t) => [
    index("care_provider_district_idx").on(t.districtId),
    index("care_provider_services_idx").using("gin", t.serviceIds),
    index("care_provider_location_idx").using("gist", t.location),
    index("care_provider_user_idx").on(t.userId),
  ],
);
