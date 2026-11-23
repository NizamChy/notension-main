import type { ItemListQuery } from "./grocery";
import type { ProductFilter } from "./fashion";

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
  fashion: {
    all: () => ["fashion"] as const,
    types: () => ["fashion", "types"] as const,
    categories: () => ["fashion", "categories"] as const,
    subCategories: () => ["fashion", "subCategories"] as const,
    brands: () => ["fashion", "brands"] as const,
    allPopular: () => ["fashion", "allPopular"] as const,
    products: (typeId: string, filter: ProductFilter) =>
      ["fashion", "products", typeId, filter] as const,
    product: (productId: string) => ["fashion", "product", productId] as const,
    store: (storeId: string) => ["fashion", "store", storeId] as const,
    storeTypes: (storeId: string) => ["fashion", "storeTypes", storeId] as const,
    storeCategories: (storeId: string) => ["fashion", "storeCategories", storeId] as const,
    storeSubCategories: (storeId: string) => ["fashion", "storeSubCategories", storeId] as const,
    orders: (customerId: string, customId: string) =>
      ["fashion", "orders", customerId, customId] as const,
  },
  healthCare: {
    all: () => ["healthCare"] as const,
    findDoctor: (districtId: string) => ["healthCare", "findDoctor", districtId] as const,
    medicalServices: (districtId: string) => ["healthCare", "medicalServices", districtId] as const,
    nearestDoctors: (districtId: string, lat: string, lng: string) =>
      ["healthCare", "nearestDoctors", districtId, lat, lng] as const,
    doctorsByDept: (deptId: string, districtId: string) =>
      ["healthCare", "doctorsByDept", deptId, districtId] as const,
    doctorsByCenter: (centerId: string, deptId: string) =>
      ["healthCare", "doctorsByCenter", centerId, deptId] as const,
    doctorProfile: (doctorId: string) => ["healthCare", "doctorProfile", doctorId] as const,
    nearestCenters: (centerType: string, districtId: string, lat: string, lng: string) =>
      ["healthCare", "nearestCenters", centerType, districtId, lat, lng] as const,
    centersByDistrict: (centerType: string, districtId: string) =>
      ["healthCare", "centersByDistrict", centerType, districtId] as const,
    searchCenters: (centerType: string, text: string) =>
      ["healthCare", "searchCenters", centerType, text] as const,
    center: (centerId: string) => ["healthCare", "center", centerId] as const,
    patients: (userId: string) => ["healthCare", "patients", userId] as const,
  },
  user: {
    all: () => ["user"] as const,
    me: () => ["user", "me"] as const,
  },
};
