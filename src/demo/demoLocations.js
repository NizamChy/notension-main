// Locations that have demo data. District IDs come from
// public/AllDistrictsData/AllDistricts.js, the same list the location picker
// matches against, so picking these places on the map also finds demo data.
// Any other district shows the normal "nothing found" states.

export const DEMO_LOCATIONS = [
  {
    key: "dhaka",
    label: "Dhaka (Gulshan)",
    districtId: "64f032f6c6635d0242c01e03",
    districtName: "Dhaka (ঢাকা)",
    latitude: 23.7925,
    longitude: 90.4078,
  },
  {
    key: "chittagong",
    label: "Chittagong (Agrabad)",
    districtId: "64f03388fdd8ffc6aa95bdb9",
    districtName: "Chittagong (চট্টগ্রাম)",
    latitude: 22.3264,
    longitude: 91.8123,
  },
];

export const DEFAULT_DEMO_LOCATION = DEMO_LOCATIONS[0];

export const DEMO_DISTRICT_IDS = DEMO_LOCATIONS.map((l) => l.districtId);

export const isDemoDistrict = (districtId) =>
  DEMO_DISTRICT_IDS.includes(districtId);

// Same shape the map picker saves with SAVE_USER_CURRENT_LOCATION.
export { toUserLocation } from "@/utils/userLocation";
