import type { ItemListQuery } from "./grocery";

// Query keys, rooted at the service name. Module PRs add their own roots.
export const queryKeys = {
  grocery: {
    all: () => ["grocery"] as const,
    nearest: (districtId: string, lat: string, lng: string) =>
      ["grocery", "nearest", districtId, lat, lng] as const,
    searchStores: (text: string) => ["grocery", "searchStores", text] as const,
    store: (storeId: string, customStoreId: string) =>
      ["grocery", "store", storeId, customStoreId] as const,
    items: (storeId: string, q: ItemListQuery) => ["grocery", "items", storeId, q] as const,
    item: (storeId: string, productId: string) => ["grocery", "item", storeId, productId] as const,
    orders: (customerId: string) => ["grocery", "orders", customerId] as const,
  },
  medicine: {
    all: () => ["medicine"] as const,
    nearest: (districtId: string, lat: string, lng: string) =>
      ["medicine", "nearest", districtId, lat, lng] as const,
    searchStores: (text: string) => ["medicine", "searchStores", text] as const,
    store: (storeId: string, customStoreId: string) =>
      ["medicine", "store", storeId, customStoreId] as const,
    items: (storeId: string, q: ItemListQuery) => ["medicine", "items", storeId, q] as const,
    item: (storeId: string, productId: string) => ["medicine", "item", storeId, productId] as const,
    orders: (customerId: string) => ["medicine", "orders", customerId] as const,
  },
  food: {
    all: () => ["food"] as const,
    module: (districtId: string) => ["food", "module", districtId] as const,
    nearest: (categoryId: string, districtId: string, lat: string, lng: string) =>
      ["food", "nearest", categoryId, districtId, lat, lng] as const,
    searchStores: (text: string, categoryId: string) =>
      ["food", "searchStores", text, categoryId] as const,
    store: (storeId: string, customStoreId: string) =>
      ["food", "store", storeId, customStoreId] as const,
    orders: (customerId: string) => ["food", "orders", customerId] as const,
  },
  user: {
    all: () => ["user"] as const,
    me: () => ["user", "me"] as const,
  },
};
