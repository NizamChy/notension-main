import type { UserLocation } from "@/stores/sessionStore";

type Coordinate = string | number;

// The delivery location saved with SAVE_USER_CURRENT_LOCATION. Every place
// that saves a location builds it here, so the shape stays the same.
export const toUserLocation = ({
  latitude,
  longitude,
  districtId,
  districtName,
  address = "",
}: {
  latitude: Coordinate;
  longitude: Coordinate;
  districtId: string;
  districtName?: string;
  address?: string;
}): UserLocation => ({
  // The session store types coordinates as strings, but the map picker and
  // the demo locations pass numbers; they are kept as given and only ever
  // end up in request params and strings.
  userLatitude: latitude as string,
  userLongitude: longitude as string,
  districtId,
  districtName,
  address,
});
