import { Loader } from "@googlemaps/js-api-loader";

// One shared loader: the Maps script is fetched once, only when a map or the
// location picker is first needed.
const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  version: "weekly",
  libraries: ["places"],
  language: "en",
  region: "BD",
});

// Start fetching the script early (hover/touch on a location button) so the
// picker opens faster. Loading the script costs nothing; only maps do.
export const preloadGoogleMaps = () => {
  loader.importLibrary("maps").catch(() => {});
};

export default loader;
