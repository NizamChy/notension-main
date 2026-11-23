import loader from "@/utils/googleMapsLoader";
import { ALL_DISTRICTS } from "../../../../public/AllDistrictsData/AllDistricts";

// The Maps types (@types/google.maps) aren't installed, so these are the
// shapes of the geocoder / places results this file reads.
export type LatLng = { lat: number; lng: number };

export type AddressComponent = {
  long_name?: string;
  short_name?: string;
  types?: string[];
};

export type PlaceResult = {
  address_components?: AddressComponent[];
  formatted_address?: string;
  types?: string[];
};

export type District = (typeof ALL_DISTRICTS)[number];

export type PlaceSummary = {
  title: string;
  subtitle: string;
  district: District | null | undefined;
};

// Gulshan, Dhaka: where the map opens when there is no saved location.
export const DEFAULT_CENTER: LatLng = { lat: 23.7925, lng: 90.4078 };

// Bangladesh with a small margin. The map can't be panned far outside it.
export const BD_BOUNDS = { south: 20.3, west: 87.8, north: 26.9, east: 92.9 };

export const isInBangladesh = ({ lat, lng }: LatLng) =>
  lat >= BD_BOUNDS.south &&
  lat <= BD_BOUNDS.north &&
  lng >= BD_BOUNDS.west &&
  lng <= BD_BOUNDS.east;

// "Sylhet  (সিলেট)" -> "Sylhet (সিলেট)"
export const districtLabel = (district: { district_name?: string | null } | null | undefined) =>
  district?.district_name?.replace(/\s+/g, " ").trim() || "";

// ---------------------------------------------------------------------------
// District matching. Google names some districts differently from our list
// ("Chattogram", "Cumilla", "Jashore"), so names are normalised and aliased.

const normalise = (name = "") =>
  name
    .toLowerCase()
    .replace(/\b(district|zila|zilla|division|city|sadar|hill)\b/g, "")
    .replace(/[^a-z]/g, "");

const ALIASES: Record<string, string> = {
  chattogram: "chittagong",
  cumilla: "comilla",
  barishal: "barisal",
  jashore: "jessore",
  bogura: "bogra",
  joypurhat: "jaipurhat",
  jhalokati: "jhalakathi",
  jhalokathi: "jhalakathi",
  khagrachhari: "khagrachari",
  laxmipur: "lakshmipur",
  netrakona: "netrokona",
  narshingdi: "narsingdi",
  maulvibazar: "moulvibazar",
  hobiganj: "habiganj",
  nawabganj: "chapainawabganj",
};

const DISTRICT_INDEX = new Map(
  ALL_DISTRICTS.map((d) => [normalise(d.district_name.split("(")[0]), d]),
);

const findDistrict = (name: string | undefined) => {
  const key = normalise(name);
  if (!key) return null;
  return DISTRICT_INDEX.get(ALIASES[key] || key) || null;
};

// Districts are administrative_area_level_2 in Bangladesh; locality is a
// fallback for results that only name the city.
const DISTRICT_TYPES = ["administrative_area_level_2", "locality"];

export const districtFromComponents = (components: AddressComponent[] = []) => {
  for (const type of DISTRICT_TYPES) {
    for (const c of components) {
      if (!c.types?.includes(type)) continue;
      const match = findDistrict(c.long_name) || findDistrict(c.short_name);
      if (match) return match;
    }
  }
  return null;
};

// ---------------------------------------------------------------------------
// Address summaries and reverse geocoding.

const pick = (components: AddressComponent[], ...types: string[]) =>
  types
    .map((t) => components.find((c) => c.types?.includes(t))?.long_name)
    .find(Boolean);

// Drops the country and any leading plus code ("QCR5+X4V, Dhaka 1212").
const stripCountry = (text = "") =>
  text
    .replace(/,?\s*Bangladesh$/i, "")
    .replace(/^[23456789CFGHJMPQRVWX]{2,8}\+[23456789CFGHJMPQRVWX]{0,3},?\s*/i, "")
    .trim();

// { title, subtitle, district } from a geocoder result or an autocomplete place.
export const summarisePlace = (
  place: PlaceResult | null | undefined,
  name?: string,
): PlaceSummary => {
  const components = place?.address_components || [];
  const full = stripCountry(place?.formatted_address);
  const title =
    name ||
    pick(components, "premise", "point_of_interest", "establishment") ||
    pick(components, "route") ||
    pick(components, "sublocality_level_1", "sublocality", "neighborhood") ||
    pick(components, "locality") ||
    full.split(",")[0] ||
    "Pinned location";

  return {
    title,
    subtitle: full && full !== title ? full : "",
    district: districtFromComponents(components),
  };
};

// Results are cached per ~10 m so moving back and forth, or re-opening the
// picker, doesn't spend geocoding quota again.
const cache = new Map<string, PlaceSummary | null>();
const cacheKey = ({ lat, lng }: LatLng) => `${lat.toFixed(4)},${lng.toFixed(4)}`;

export const rememberPlace = (position: LatLng, summary: PlaceSummary) =>
  cache.set(cacheKey(position), summary);

export const reverseGeocode = async (position: LatLng): Promise<PlaceSummary | null> => {
  const key = cacheKey(position);
  if (cache.has(key)) return cache.get(key) ?? null;

  const { Geocoder } = await loader.importLibrary("geocoding");
  let results: PlaceResult[] = [];
  try {
    ({ results } = await new Geocoder().geocode({ location: position }));
  } catch (error) {
    // ZERO_RESULTS (sea, border) is a real answer; anything else may be
    // temporary, so it isn't cached.
    if ((error as { code?: unknown } | null)?.code !== "ZERO_RESULTS") throw error;
  }

  // Plus codes ("QCR5+X4V") are the least useful result; prefer a street.
  const best = results.find((r) => !r.types?.includes("plus_code")) || results[0];
  let summary = best ? summarisePlace(best) : null;

  if (summary && !summary.district) {
    // A coarser result often names the district when the street one doesn't.
    for (const r of results) {
      const district = districtFromComponents(r.address_components);
      if (district) {
        summary = { ...summary, district };
        break;
      }
    }
  }

  cache.set(key, summary);
  return summary;
};

// ---------------------------------------------------------------------------
// Map styles: fewer business pins in light mode, a dark map in dark mode.

export const LIGHT_MAP_STYLES = [
  { featureType: "poi.business", stylers: [{ visibility: "off" }] },
  { featureType: "transit", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
];

export const DARK_MAP_STYLES = [
  ...LIGHT_MAP_STYLES,
  { elementType: "geometry", stylers: [{ color: "#1f232b" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1f232b" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8b93a1" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#c7ccd5" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#7c8493" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#1d2e27" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#2c313b" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#1a1d23" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3a404c" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9aa1ad" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2a2f38" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#132235" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#4d6a8a" }] },
];
