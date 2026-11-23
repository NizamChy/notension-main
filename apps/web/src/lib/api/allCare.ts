import { z } from "zod";
import { allCare } from "@notension/shared";
import { EXPLORE_ALL_CARE_SERVICE, EXPLORE_CARE_PROVIDER } from "@/api-endpoints/api-endpoint";
import { apiGet, apiPost } from "./request";

// The All Care API: the same calls and params the old useAllCareService made.

export type CareService = allCare.CareService;
export type CareSlider = allCare.CareSlider;
export type CareProvider = allCare.CareProvider;
export type CareServices = z.infer<typeof allCare.exploreServicesResult>["result"];
export type CareProviders = z.infer<typeof allCare.exploreProvidersResult>["result"];

/** The district's service categories and home sliders. */
export async function exploreServices(districtId: string): Promise<CareServices> {
  const res = await apiGet("ALL_CARE", EXPLORE_ALL_CARE_SERVICE, allCare.exploreServicesResult, {
    district_id: districtId,
  });
  return res.result;
}

/** A service's providers in the district (popular) and near the user (nearest). */
export async function exploreProviders(
  serviceId: string,
  loc: { districtId: string; lat: string; lng: string },
  page = 1,
): Promise<CareProviders> {
  const res = await apiPost(
    "ALL_CARE",
    EXPLORE_CARE_PROVIDER,
    {
      longitude: loc.lng,
      latitude: loc.lat,
      district_id: loc.districtId,
      service_id: serviceId,
      page,
    },
    allCare.exploreProvidersResult,
  );
  return res.result;
}
