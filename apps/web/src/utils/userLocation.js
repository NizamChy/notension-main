// The delivery location saved with SAVE_USER_CURRENT_LOCATION. Every place
// that saves a location builds it here, so the shape stays the same.
export const toUserLocation = ({
  latitude,
  longitude,
  districtId,
  districtName,
  address = "",
}) => ({
  userLatitude: latitude,
  userLongitude: longitude,
  districtId,
  districtName,
  address,
});
