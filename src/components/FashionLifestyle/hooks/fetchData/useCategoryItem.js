import {
  ALL_TYPE,
  ALL_BRAND,
  ALL_CATEGORY,
  KIDS_PRODUCT,
  MENS_PRODUCT,
  WOMENS_PRODUCT,
  ALL_SUB_CATEGORY,
  KIDS_PRODUCT_BY_TYPE,
} from "@/api-endpoints/api-endpoint";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { FASHION_BASE_URL } from "@/api-endpoints/secret";
import { generateNavItems } from "../../utils/generateNavItems";
import { KIDS_TYPE_ID, MEN_TYPE_ID, WOMEN_TYPE_ID } from "../../utils/constant";

const fetchData = async (endpoint) => {
  const response = await axios.get(`${FASHION_BASE_URL}${endpoint}`);

  return response?.data?.data;
};

const fetchKidsProductsByType = async (typeId, catId, subCatId) => {
  const response = await axios.put(
    `${FASHION_BASE_URL}${KIDS_PRODUCT_BY_TYPE}/${typeId}`,
    {
      category_info: catId,
      sub_category_info: subCatId,
    }
  );

  return response?.data?.data;
};

const fetchKidsProductsByCatId = async (typeId, catId) => {
  const response = await axios.put(
    `${FASHION_BASE_URL}${KIDS_PRODUCT_BY_TYPE}/${typeId}`,
    {
      category_info: catId,
    }
  );

  return response?.data?.data;
};

const fetchPopularProductsByType = async (typeId) => {
  const response = await axios.put(
    `${FASHION_BASE_URL}${KIDS_PRODUCT_BY_TYPE}/${typeId}`,
    {
      is_popular: true,
    }
  );

  return response?.data?.data;
};

const fetchSearchedProductsByType = async (typeId, searchText) => {
  const response = await axios.put(
    `${FASHION_BASE_URL}${KIDS_PRODUCT_BY_TYPE}/${typeId}`,
    {
      search_text: searchText,
    }
  );

  return response?.data?.data;
};

export const useCategoryItem = () => {
  const {
    data: allType,
    isLoading: isTypesLoading,
    error: typesError,
  } = useQuery({
    queryKey: ["allTypes"],
    queryFn: () => fetchData(ALL_TYPE),
  });

  const {
    data: allCategory,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["allCategories"],
    queryFn: () => fetchData(ALL_CATEGORY),
  });

  const {
    data: allSubCategory,
    isLoading: isSubCategoriesLoading,
    error: subCategoriesError,
  } = useQuery({
    queryKey: ["allSubCategories"],
    queryFn: () => fetchData(ALL_SUB_CATEGORY),
  });

  const {
    data: brands,
    isLoading: isBrandsLoading,
    error: brandsError,
  } = useQuery({
    queryKey: ["allBrands"],
    queryFn: () => fetchData(ALL_BRAND),
  });

  const navItems =
    allType && allCategory && allSubCategory
      ? generateNavItems(allType, allCategory, allSubCategory)
      : null;

  const useCategoryById = (typeId) => {
    return useQuery({
      queryKey: ["categoriesByType", typeId],
      queryFn: () => fetchData(ALL_CATEGORY),
      select: (data) => data.filter((cat) => cat?.type_info === typeId),
      enabled: !!typeId,
    });
  };

  const useSubCategoryById = (catId) => {
    return useQuery({
      queryKey: ["subCategoriesByCategory", catId],
      queryFn: () => fetchData(ALL_SUB_CATEGORY),
      select: (data) =>
        data?.filter((sub) => sub?.category_info?._id === catId),
      enabled: !!catId,
    });
  };

  const useKidsProducts = () => {
    return useQuery({
      queryKey: ["kidsProducts"],
      queryFn: () => fetchData(KIDS_PRODUCT),
    });
  };

  const useMensProducts = () => {
    return useQuery({
      queryKey: ["mensProducts"],
      queryFn: () => fetchData(MENS_PRODUCT),
    });
  };

  const useWomensProducts = () => {
    return useQuery({
      queryKey: ["womensProducts"],
      queryFn: () => fetchData(WOMENS_PRODUCT),
    });
  };

  const useKidsProductById = (productId) => {
    return useQuery({
      queryKey: ["kidsProduct", productId],
      queryFn: () => fetchData(KIDS_PRODUCT),
      select: (data) => data.find((product) => product?._id === productId),
      enabled: !!productId,
    });
  };

  const useKidsProductsByType = (typeId, catId = null, subCatId = null) => {
    return useQuery({
      queryKey: ["kidsProductsByType", typeId, catId, subCatId],
      queryFn: () => fetchKidsProductsByType(typeId, catId, subCatId),
      enabled: !!typeId,
    });
  };

  const useKidsProductsByCatId = (typeId, catId = null) => {
    return useQuery({
      queryKey: ["kidsProductsByCatId", typeId, catId],
      queryFn: () => fetchKidsProductsByCatId(typeId, catId),
      enabled: !!typeId,
    });
  };

  const useAllProducts = () => {
    return useQuery({
      queryKey: ["allProducts"],
      queryFn: async () => {
        const [mens, womens, kids] = await Promise.all([
          fetchData(MENS_PRODUCT),
          fetchData(WOMENS_PRODUCT),
          fetchData(KIDS_PRODUCT),
        ]);

        return [...mens, ...womens, ...kids];
      },
    });
  };

  const useAllPopularProducts = () => {
    return useQuery({
      queryKey: ["allPopularProducts"],
      queryFn: async () => {
        const [mens, womens, kids] = await Promise.all([
          fetchPopularProductsByType(MEN_TYPE_ID),
          fetchPopularProductsByType(WOMEN_TYPE_ID),
          fetchPopularProductsByType(KIDS_TYPE_ID),
        ]);

        return [...mens, ...womens, ...kids];
      },
    });
  };

  const useProductById = (productId) => {
    return useQuery({
      queryKey: ["product", productId],
      queryFn: async () => {
        const [mens, womens, kids] = await Promise.all([
          fetchData(MENS_PRODUCT),
          fetchData(WOMENS_PRODUCT),
          fetchData(KIDS_PRODUCT),
        ]);
        const allProducts = [...mens, ...womens, ...kids];
        return allProducts.find((product) => product?._id === productId);
      },
      enabled: !!productId,
    });
  };

  const usePopularProductsByType = (typeId) => {
    return useQuery({
      queryKey: ["popularProductsByType", typeId],
      queryFn: () => fetchPopularProductsByType(typeId),
      enabled: !!typeId,
    });
  };

  const useSearchedProductsByType = (typeId, searchText = null) => {
    return useQuery({
      queryKey: ["searchedProductsByType", typeId, searchText],
      queryFn: () => fetchSearchedProductsByType(typeId, searchText),
      enabled: !!typeId,
    });
  };

  return {
    brands,
    allType,
    navItems,
    allCategory,
    allSubCategory,
    isLoading:
      isTypesLoading ||
      isCategoriesLoading ||
      isSubCategoriesLoading ||
      isBrandsLoading,
    error: typesError || categoriesError || subCategoriesError || brandsError,
    useAllProducts,
    useProductById,
    useMensProducts,
    useCategoryById,
    useKidsProducts,
    useWomensProducts,
    useSubCategoryById,
    useKidsProductById,
    useAllPopularProducts,
    useKidsProductsByType,
    useKidsProductsByCatId,
    usePopularProductsByType,
    useSearchedProductsByType,
  };
};
