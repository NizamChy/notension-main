// Demo routes for the ALL_CARE backend. See src/demo/README.md for the contract.
// The data lives in ./allCare/data.ts (also read by the API seed).

import {
  EXPLORE_ALL_CARE_SERVICE,
  EXPLORE_CARE_PROVIDER,
} from "@/api-endpoints/api-endpoint";
import { demoResponse, type DemoRequest, type DemoRoute } from "../demoAdapter";
import { DEMO_LOCATIONS } from "../demoLocations";
import { ALL_CARE_PROVIDERS, ALL_SERVICES, CARE_SLIDERS } from "./allCare/data";

const [DHAKA, CHITTAGONG] = DEMO_LOCATIONS;

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------

const DEMO_DISTRICTS = [DHAKA.districtId, CHITTAGONG.districtId];
const NEAREST_RADIUS_M = 12000;
const PAGE_SIZE = 20;

const toRad = (deg: number) => (deg * Math.PI) / 180;
const distanceMeters = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(a)));
};

const toNumber = (value: unknown) => {
  const n = Number(value);
  return value === "" || value == null || Number.isNaN(n) ? null : n;
};

const exploreAllService = ({ query }: DemoRequest) => {
  const districtId = query.district_id;
  const known = DEMO_DISTRICTS.includes(districtId);

  return {
    success: true,
    message: known ? "Services found" : "No service found in this area",
    result: {
      servicesType: known
        ? ALL_SERVICES.filter((s) => s.district_ids.includes(districtId))
        : [],
      sliderByDistrict: CARE_SLIDERS.filter(
        (s) => s.district_id === districtId,
      ),
    },
  };
};

const exploreCareProvider = ({ body }: DemoRequest) => {
  const { district_id: districtId, service_id: serviceId } = body;
  const page = Math.max(1, toNumber(body.page) || 1);
  const lat = toNumber(body.latitude);
  const lng = toNumber(body.longitude);

  if (!serviceId) {
    return demoResponse(400, {
      success: false,
      message: "service_id is required",
    });
  }

  const hasLocation = lat != null && lng != null;
  const matches = ALL_CARE_PROVIDERS.filter(
    (p) => p.district_id === districtId && p.service_ids.includes(serviceId),
  ).map((p): typeof p & { distance?: number } =>
    hasLocation
      ? { ...p, distance: distanceMeters(lat, lng, p.latitude, p.longitude) }
      : { ...p },
  );

  const careProviderByDistrict = [...matches].sort(
    (a, b) => b.rating - a.rating || b.total_reviews - a.total_reviews,
  );

  const nearestCareProvider = hasLocation
    ? matches
        // Every match has a distance when there is a location.
        .filter((p) => p.distance! <= NEAREST_RADIUS_M)
        .sort((a, b) => a.distance! - b.distance!)
    : matches;

  const paginate = <T,>(list: T[]) =>
    list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return {
    success: true,
    message: matches.length ? "Care providers found" : "No care provider found",
    result: {
      careProviderByDistrict: paginate(careProviderByDistrict),
      nearestCareProvider: paginate(nearestCareProvider),
      totalCareProvider: matches.length,
      page,
    },
  };
};

export const routes: DemoRoute[] = [
  {
    service: "ALL_CARE",
    method: "GET",
    path: EXPLORE_ALL_CARE_SERVICE,
    handler: exploreAllService,
  },
  {
    service: "ALL_CARE",
    method: "POST",
    path: EXPLORE_CARE_PROVIDER,
    handler: exploreCareProvider,
  },
];
