import { Loader } from "@googlemaps/js-api-loader";

const loader = new Loader({
  apiKey: "AIzaSyAdznG_wpszIuufRum1dmkkucPAZtiL2V8",
  version: "weekly",
  libraries: ["places"],
});
export default loader;
