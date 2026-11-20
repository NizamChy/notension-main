// The All Care API as the web app reads it (legacy field names).
// Paths: /client-app-api/v1/all-care/*.
import { z } from "zod";

const id = z.string().regex(/^[0-9a-f]{24}$/, "24-char hex id");

export const PAGE_SIZE = 20;
// "Nearest" providers are the ones within this distance, in metres.
export const NEAREST_RADIUS_M = 12_000;

export const careService = z.object({
  _id: id,
  service_name_eng: z.string(),
  service_name_bn: z.string().nullable(),
  serial_no: z.number(),
  service_banner_app: z.string().nullable(),
  status: z.string(),
  district_ids: z.array(id),
  sliderInfo: z.object({
    _id: z.string().nullable(),
    service_id: id,
    service_slider: z.array(z.string()),
  }),
});
export type CareService = z.infer<typeof careService>;

export const careSlide = z.object({ _id: z.string(), file_name: z.string() });

export const careSlider = z.object({
  _id: id,
  district_id: id,
  first_slider: z.array(careSlide),
  second_slider: z.array(careSlide),
  third_slider: z.array(careSlide),
  fourth_slider: z.array(careSlide),
  fifth_slider: z.array(careSlide),
  sixth_slider: z.array(careSlide),
  seventh_slider: z.array(careSlide),
});
export type CareSlider = z.infer<typeof careSlider>;

export const careProvider = z.object({
  _id: id,
  provider_name: z.string(),
  district_id: id,
  district_name: z.string(),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  location: z.object({ type: z.literal("Point"), coordinates: z.tuple([z.number(), z.number()]) }),
  contact_person_name: z.string().nullable(),
  contact_no: z.string().nullable(),
  alternative_contact_no: z.string().nullable(),
  service_ids: z.array(id),
  rating: z.number(),
  total_reviews: z.number(),
  experience_years: z.number(),
  service_hours: z.string().nullable(),
  provider_banner_app: z.string().nullable(),
  provider_logo: z.string().nullable(),
  service_details: z.string(),
  status: z.string(),
  // Metres from the customer; only when the request had a position.
  distance: z.number().optional(),
});
export type CareProvider = z.infer<typeof careProvider>;

export const exploreServicesInput = z.object({ district_id: z.string().default("") });

export const exploreServicesResult = z.object({
  success: z.literal(true),
  message: z.string(),
  result: z.object({ servicesType: z.array(careService), sliderByDistrict: z.array(careSlider) }),
});

// "" / null / not a number count as missing, like the old backend.
const optionalNumber = z.preprocess(
  (v) => (v === "" || v == null || Number.isNaN(Number(v)) ? undefined : Number(v)),
  z.number().optional(),
);

export const exploreProvidersInput = z.object({
  district_id: z.string().default(""),
  service_id: z.string().optional(),
  latitude: optionalNumber,
  longitude: optionalNumber,
  page: optionalNumber,
});

export const exploreProvidersResult = z.object({
  success: z.literal(true),
  message: z.string(),
  result: z.object({
    careProviderByDistrict: z.array(careProvider),
    nearestCareProvider: z.array(careProvider),
    totalCareProvider: z.number(),
    page: z.number(),
  }),
});
