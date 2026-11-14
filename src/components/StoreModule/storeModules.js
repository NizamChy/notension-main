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
    customTypes: {
      specialOffer: "65128cbd20db0921f13b40b3",
      dealOfTheDay: "64ec724d538280d7999a2d39",
      popularItem: "651284f9330595b483e38d73",
    },
  },
};

// Shared page frame for every page inside a grocery / medicine store: clears
// the fixed navbar (64px, 72px on lg+), gives one side padding per
// breakpoint and keeps a right gutter on lg+ for the floating cart tab.
export const STORE_PAGE_CLASS =
  "pt-[calc(64px+1.25rem)] md:pt-[calc(64px+2rem)] lg:pt-[calc(72px+2rem)] pb-10 md:pb-14 px-4 md:px-6 lg:pl-8 lg:pr-24";

// Product card grid used by every item list in the store modules. On lg the
// category sidebar takes 20% of the width, so it stays at 3 columns there.
export const ITEM_GRID_CLASS =
  "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-4";

// Shop card grid for the store lists (find / search / favourite stores).
export const SHOP_GRID_CLASS =
  "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5";

// Section heading used above item lists.
export const SECTION_TITLE_CLASS =
  "text-lg md:text-xl font-bold tracking-tight text-gray-900 mb-4 md:mb-5";

// Page frame for the store list pages (no category sidebar).
export const STORE_LIST_PAGE_CLASS =
  "mx-auto w-full max-w-[1312px] px-4 sm:px-6 lg:px-8 pb-12 md:pb-16";

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
