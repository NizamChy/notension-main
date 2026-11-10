import { useMedicine } from "@/hooks/fetch-data/useMedicine";
import { useGroceryShop } from "@/hooks/fetch-data/useGroceryShop";
import {
  GROCERY_SLIDER_TYPE_SUBTYPE_IMAGES,
  MEDICINE_SLIDER_TYPE_SUBTYPE_IMAGES,
} from "@/api-endpoints/api-endpoint";

// Per-module settings for the components shared by the grocery and
// medicine store modules. Tailwind classes are kept as full strings so
// the class scanner still sees them.
export const STORE_MODULES = {
  grocery: {
    basePath: "/grocery",
    sliderImageBaseUrl: GROCERY_SLIDER_TYPE_SUBTYPE_IMAGES,
    useShop: useGroceryShop,
    bannerHeightClass: "max-h-[140px] md:max-h-[400px]",
    customTypes: {
      specialOffer: "64f5a306baa57a4707524d6e",
      dealOfTheDay: "6525306cf79d9e77f12a2a63",
      popularItem: "64f5b63a256e0838327efaef",
    },
  },
  medicine: {
    basePath: "/medicine",
    sliderImageBaseUrl: MEDICINE_SLIDER_TYPE_SUBTYPE_IMAGES,
    useShop: useMedicine,
    bannerHeightClass: "max-h-[167px] md:max-h-[400px]",
    customTypes: {
      specialOffer: "65128cbd20db0921f13b40b3",
      dealOfTheDay: "64ec724d538280d7999a2d39",
      popularItem: "651284f9330595b483e38d73",
    },
  },
};

export const getStoreModule = (moduleName) => {
  const config = STORE_MODULES[moduleName];
  if (!config) throw new Error(`Unknown store module: ${moduleName}`);
  return config;
};

// "Fresh Mart & Co." -> "fresh-mart-co" (keeps Bengali letters).
export const toSlug = (text) =>
  text
    ?.trim()
    .toLowerCase()
    .replace(/[^\p{Script=Bengali}a-z0-9 ]/gu, "")
    .replace(/\s+/g, "-");
