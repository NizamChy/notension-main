import type { QueryClient } from "@tanstack/react-query";
import { GROCERY_ITEMS_IMAGES } from "@/api-endpoints/api-endpoint";
import { useGroceryCart } from "@/hooks/grocery/useGroceryCart";
import { seedGroceryItem, useGroceryItem } from "@/hooks/grocery/useGroceryItem";
import { useGroceryItemList } from "@/hooks/grocery/useGroceryItemList";
import type { GroceryItem, ItemListQuery } from "@/lib/api/grocery";

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
};

export type GroceryCartApi = ReturnType<typeof useGroceryCart>;
export type ItemListResult = ReturnType<typeof useGroceryItemList>;
export type ItemResult = ReturnType<typeof useGroceryItem>;

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
  useCart: () => GroceryCartApi;
  useItemList: (q: ItemListQuery | null) => ItemListResult;
  useItem: (id: string | undefined) => ItemResult;
  /** Files a list item under its detail query, so the product page has it. */
  seedItem: (qc: QueryClient, storeId: string, item: StoreItem) => void;
};

export type ItemModuleName = "grocery";

// Per-module settings for the shared item components (tile, details, item
// lists, favourite stores). Medicine joins in PR 3.
export const ITEM_MODULES: Record<ItemModuleName, ItemModuleConfig> = {
  grocery: {
    merchantType: 0,
    basePath: "/grocery",
    imageBaseUrl: GROCERY_ITEMS_IMAGES,
    idField: "productInfoTable",
    titleField: "product_title_eng",
    titleBengField: "product_title_beng",
    subtitle: (item) => item?.pack_size ?? "",
    useCart: useGroceryCart,
    useItemList: useGroceryItemList,
    useItem: useGroceryItem,
    // Only store list items are seeded; they are whole GroceryItems.
    seedItem: (qc, storeId, item) => seedGroceryItem(qc, storeId, item as GroceryItem),
  },
};

/** The image URL of an item, or the placeholder. */
export const itemImageSrc = (config: ItemModuleConfig, item: StoreItem | null | undefined) =>
  item?.app_image ? `${config.imageBaseUrl}/${item?.app_image}` : "/png/dummyImage.png";

/** What the discount saves on one item, or 0 without a discount. */
export const savingsOf = (item: StoreItem | null | undefined) =>
  (item?.less ?? 0) > 0 ? Number(item?.max_retail_price) - Number(item?.sale_price) : 0;
