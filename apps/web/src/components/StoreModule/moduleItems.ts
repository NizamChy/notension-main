import type { QueryClient } from "@tanstack/react-query";
import { GROCERY_ITEMS_IMAGES, MEDICINE_ITEMS_IMAGES } from "@/api-endpoints/api-endpoint";
import { useGroceryCart } from "@/hooks/grocery/useGroceryCart";
import { seedGroceryItem, useGroceryItem } from "@/hooks/grocery/useGroceryItem";
import { useGroceryItemList } from "@/hooks/grocery/useGroceryItemList";
import { useMedicineCart } from "@/hooks/medicine/useMedicineCart";
import { seedMedicineItem, useMedicineItem } from "@/hooks/medicine/useMedicineItem";
import { useMedicineItemList } from "@/hooks/medicine/useMedicineItemList";
import type { GroceryItem, ItemListQuery } from "@/lib/api/grocery";
import type { MedicineItem } from "@/lib/api/medicine";

/**
 * A product as the shared item components read it: a store list item, or a
 * saved favourite (`productId` plus the saved fields). The medicine names
 * are here so a config field can name either module's column.
 */
export type StoreItem = Partial<GroceryItem> & {
  productId?: string;
  medStoreProductInfo?: string;
  item_title_eng?: string;
  item_title_beng?: string | null;
  strength?: string | null;
  generic_name?: string;
  company_name?: string;
  prescription_required?: boolean;
};

/** The cart API every module's cart hook gives. */
export type CartApi = {
  addToCart: (item: StoreItem) => boolean;
  incrementQty: (id: string) => void;
  decrementQty: (id: string) => void;
  getCurrentQty: (item: { _id?: string }) => number;
  removeFromCart: (id: string) => void;
};
export type ItemListResult = Omit<ReturnType<typeof useGroceryItemList>, "items"> & {
  items: StoreItem[];
};
export type ItemResult = Omit<ReturnType<typeof useGroceryItem>, "item"> & {
  item: StoreItem | undefined;
};

type Text = string | null | undefined;
type Badge = { label: string; tone: string };

/** What the product details (page and quick views) show beyond the basics. */
export type DetailExtras = {
  altTitle: Text;
  highlight?: Text;
  byline?: Text;
  chips: Text[];
  badges?: Badge[];
  /** The rows of the product page's details table. */
  details: { label: string; value: Text }[];
};

export type ItemModuleConfig = {
  /** 0 = grocery, 1 = medicine, as the favourites API counts them. */
  merchantType: 0 | 1;
  basePath: string;
  imageBaseUrl: string;
  idField: "productInfoTable" | "medStoreProductInfo";
  titleField: "product_title_eng" | "item_title_eng";
  titleBengField: "product_title_beng" | "item_title_beng";
  /** The small line under a card title. */
  subtitle: (item: StoreItem) => string;
  detailExtras: (item: StoreItem | undefined) => DetailExtras;
  /** What the discount saves on one item, or 0 without a discount. */
  savings: (item: StoreItem | null | undefined) => number;
  /**
   * The favourite quick view's remove: "saved" passes the saved entry,
   * "loaded" builds it from the loaded item (as the old Medicine modal did).
   */
  favouriteRemoval: "saved" | "loaded";
  labels: {
    /** "products" / "medicines" in list counts. */
    items: string;
    searchEmptyTitle: string;
    searchEmptyText: string;
    subTypeEmptyText: string;
  };
  useCart: () => CartApi;
  useItemList: (q: ItemListQuery | null) => ItemListResult;
  useItem: (id: string | undefined) => ItemResult;
  /** Files a list item under its detail query, so the product page has it. */
  seedItem: (qc: QueryClient, storeId: string, item: StoreItem) => void;
};

export type ItemModuleName = "grocery" | "medicine";

const rawSavings = (item: StoreItem | null | undefined) =>
  (item?.less ?? 0) > 0 ? Number(item?.max_retail_price) - Number(item?.sale_price) : 0;

// Per-module settings for the shared item components (tile, details, item
// lists, favourite stores, checkout, orders).
export const ITEM_MODULES: Record<ItemModuleName, ItemModuleConfig> = {
  grocery: {
    merchantType: 0,
    basePath: "/grocery",
    imageBaseUrl: GROCERY_ITEMS_IMAGES,
    idField: "productInfoTable",
    titleField: "product_title_eng",
    titleBengField: "product_title_beng",
    subtitle: (item) => item?.pack_size ?? "",
    detailExtras: (item) => ({
      altTitle: item?.product_title_beng,
      chips: [item?.pack_size],
      details: [
        { label: "Pack size", value: item?.pack_size },
        { label: "Unit", value: item?.unit_symbol },
      ],
    }),
    savings: rawSavings,
    favouriteRemoval: "saved",
    labels: {
      items: "products",
      searchEmptyTitle: "No products found",
      searchEmptyText: "Check the spelling or try a more general word.",
      subTypeEmptyText: "This category has no products in stock right now.",
    },
    // boundary: the grocery cart takes a GroceryItem; a StoreItem from a
    // grocery list is one.
    useCart: useGroceryCart as unknown as () => CartApi,
    useItemList: useGroceryItemList,
    useItem: useGroceryItem,
    // Only store list items are seeded; they are whole GroceryItems.
    seedItem: (qc, storeId, item) => seedGroceryItem(qc, storeId, item as GroceryItem),
  },
  medicine: {
    merchantType: 1,
    basePath: "/medicine",
    imageBaseUrl: MEDICINE_ITEMS_IMAGES,
    idField: "medStoreProductInfo",
    titleField: "item_title_eng",
    titleBengField: "item_title_beng",
    subtitle: (item) => item?.strength || item?.pack_size || "",
    detailExtras: (item) => ({
      altTitle: item?.item_title_beng || item?.product_title_beng,
      highlight: item?.generic_name,
      byline: item?.company_name,
      chips: [item?.strength, item?.pack_size],
      badges: item?.prescription_required
        ? [{ label: "Prescription required", tone: "amber" }]
        : [],
      details: [
        { label: "Generic name", value: item?.generic_name },
        { label: "Manufacturer", value: item?.company_name },
        { label: "Strength", value: item?.strength },
        { label: "Pack size", value: item?.pack_size },
        { label: "Unit", value: item?.unit_symbol },
      ],
    }),
    // The old medicine views rounded the saving to 2 decimals.
    savings: (item) => Number(rawSavings(item).toFixed(2)),
    favouriteRemoval: "loaded",
    labels: {
      items: "medicines",
      searchEmptyTitle: "No medicines found",
      searchEmptyText: "Check the spelling, or search by brand or generic name.",
      subTypeEmptyText: "This category has no medicines in stock right now.",
    },
    // boundary: the medicine cart takes a MedicineItem; a StoreItem from a
    // medicine list is one.
    useCart: useMedicineCart as unknown as () => CartApi,
    useItemList: useMedicineItemList as unknown as (q: ItemListQuery | null) => ItemListResult,
    useItem: useMedicineItem as unknown as (id: string | undefined) => ItemResult,
    seedItem: (qc, storeId, item) => seedMedicineItem(qc, storeId, item as MedicineItem),
  },
};

/** The image URL of an item, or the placeholder. */
export const itemImageSrc = (config: ItemModuleConfig, item: StoreItem | null | undefined) =>
  item?.app_image ? `${config.imageBaseUrl}/${item?.app_image}` : "/png/dummyImage.png";

/** The quick views show everything but the page's details table. */
export const quickViewExtras = ({ details: _details, ...rest }: DetailExtras) => rest;
