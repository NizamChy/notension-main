import { useQuery } from "@tanstack/react-query";
import {
  filterProducts,
  getStore,
  getStoreCategories,
  getStoreSubCategories,
  getStoreTypes,
} from "@/lib/api/fashion";
import { queryKeys } from "@/lib/api/queryKeys";

// One fashion store's reads (its info, taxonomy and products), typed on the
// shared `fashion` contract.

type Id = string | null | undefined;

const useStoreInfo = (storeId: Id) =>
  useQuery({
    queryKey: queryKeys.fashion.store(storeId ?? ""),
    queryFn: () => getStore(storeId ?? ""),
    enabled: !!storeId,
  });

const useTypeByStoreId = (storeId: Id) =>
  useQuery({
    queryKey: queryKeys.fashion.storeTypes(storeId ?? ""),
    queryFn: () => getStoreTypes(storeId ?? ""),
    enabled: !!storeId,
  });

const useCategoryByStoreId = (storeId: Id) =>
  useQuery({
    queryKey: queryKeys.fashion.storeCategories(storeId ?? ""),
    queryFn: () => getStoreCategories(storeId ?? ""),
    enabled: !!storeId,
  });

const useSubCategoryByStoreId = (storeId: Id) =>
  useQuery({
    queryKey: queryKeys.fashion.storeSubCategories(storeId ?? ""),
    queryFn: () => getStoreSubCategories(storeId ?? ""),
    enabled: !!storeId,
  });

const useProductsByStoreTypeId = (typeId: Id, storeId: Id) => {
  const filter = { store_id: storeId ?? null };
  return useQuery({
    queryKey: queryKeys.fashion.products(typeId ?? "", filter),
    queryFn: () => filterProducts(typeId ?? "", filter),
    enabled: !!typeId && !!storeId,
  });
};

const useProductsByStoreSubCatId = (storeId: Id, typeId: Id, catId: Id = null, subCatId: Id = null) => {
  const filter = { store_id: storeId ?? null, category_info: catId, sub_category_info: subCatId };
  return useQuery({
    queryKey: queryKeys.fashion.products(typeId ?? "", filter),
    queryFn: () => filterProducts(typeId ?? "", filter),
    enabled: !!typeId,
  });
};

export const useStoreItems = () => ({
  useStoreInfo,
  useTypeByStoreId,
  useCategoryByStoreId,
  useSubCategoryByStoreId,
  useProductsByStoreTypeId,
  useProductsByStoreSubCatId,
});
