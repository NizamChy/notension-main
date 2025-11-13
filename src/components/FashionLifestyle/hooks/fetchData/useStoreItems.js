import {
  ALL_TYPE_BY_STORE,
  SINGLE_STORE_INFO,
  KIDS_PRODUCT_BY_TYPE,
  ALL_CATEGORY_BY_STORE,
  ALL_SUB_CATEGORY_BY_STORE,
} from "@/api-endpoints/api-endpoint";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { FASHION_BASE_URL } from "@/api-endpoints/secret";

const fetchStoreInfo = async (storeId) => {
  const response = await axios.get(
    `${FASHION_BASE_URL}${SINGLE_STORE_INFO}/${storeId}`
  );
  return response?.data?.data;
};

const fetchDataByStore = async (endpoint, storeId) => {
  const response = await axios.get(`${FASHION_BASE_URL}${endpoint}/${storeId}`);
  return response?.data?.data;
};

const fetchPopularProductsByStore = async (typeId, storeId) => {
  const response = await axios.put(
    `${FASHION_BASE_URL}${KIDS_PRODUCT_BY_TYPE}/${typeId}`,
    {
      store_id: storeId,
      is_popular: true,
    }
  );
  return response?.data?.data;
};

const fetchProductsByStoreTypeId = async (typeId, storeId) => {
  const response = await axios.put(
    `${FASHION_BASE_URL}${KIDS_PRODUCT_BY_TYPE}/${typeId}`,
    {
      store_id: storeId,
    }
  );
  return response?.data?.data;
};

const fetchProductsByStoreSubCatId = async (
  storeId,
  typeId,
  catId,
  subCatId
) => {
  const response = await axios.put(
    `${FASHION_BASE_URL}${KIDS_PRODUCT_BY_TYPE}/${typeId}`,
    {
      store_id: storeId,
      category_info: catId,
      sub_category_info: subCatId,
    }
  );

  return response?.data?.data;
};

export const useStoreItems = () => {
  const useStoreInfo = (storeId) => {
    return useQuery({
      queryKey: ["singleStoreInfo", storeId],
      queryFn: () => fetchStoreInfo(storeId),
      enabled: !!storeId,
    });
  };

  const useTypeByStoreId = (storeId) => {
    return useQuery({
      queryKey: ["allTypesByStore", storeId],
      queryFn: () => fetchDataByStore(ALL_TYPE_BY_STORE, storeId),
      enabled: !!storeId,
    });
  };

  const useCategoryByStoreId = (storeId) => {
    return useQuery({
      queryKey: ["allCategoriesByStore", storeId],
      queryFn: () => fetchDataByStore(ALL_CATEGORY_BY_STORE, storeId),
      enabled: !!storeId,
    });
  };

  const useSubCategoryByStoreId = (storeId) => {
    return useQuery({
      queryKey: ["allSubCategoriesByStore", storeId],
      queryFn: () => fetchDataByStore(ALL_SUB_CATEGORY_BY_STORE, storeId),
      enabled: !!storeId,
    });
  };

  const usePopularProductsByStore = (typeId, storeId) => {
    return useQuery({
      queryKey: ["popularProductsByStore", typeId, storeId],
      queryFn: () => fetchPopularProductsByStore(typeId, storeId),
      enabled: !!typeId && !!storeId,
    });
  };

  const useProductsByStoreTypeId = (typeId, storeId) => {
    return useQuery({
      queryKey: ["productsByStoreTypeId", typeId, storeId],
      queryFn: () => fetchProductsByStoreTypeId(typeId, storeId),
    });
  };

  const useProductsByStoreSubCatId = (
    storeId,
    typeId,
    catId = null,
    subCatId = null
  ) => {
    return useQuery({
      queryKey: ["productsByStoreSubCatId", storeId, typeId, catId, subCatId],
      queryFn: () =>
        fetchProductsByStoreSubCatId(storeId, typeId, catId, subCatId),
      enabled: !!typeId,
    });
  };

  return {
    useStoreInfo,
    fetchStoreInfo,
    useTypeByStoreId,
    useCategoryByStoreId,
    useSubCategoryByStoreId,
    useProductsByStoreTypeId,
    usePopularProductsByStore,
    useProductsByStoreSubCatId,
  };
};
