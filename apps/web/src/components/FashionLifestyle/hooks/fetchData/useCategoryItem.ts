import { useQuery, type QueryClient } from "@tanstack/react-query";
import {
  filterProducts,
  findProduct,
  getBrands,
  getCategories,
  getSubCategories,
  getTypes,
  type FashionCategory,
  type FashionProduct,
  type FashionSubCategory,
  type ProductFilter,
} from "@/lib/api/fashion";
import { queryKeys } from "@/lib/api/queryKeys";
import { generateNavItems } from "../../utils/generateNavItems";
import { KIDS_TYPE_ID, MEN_TYPE_ID, WOMEN_TYPE_ID } from "../../utils/constants";

// The catalogue reads of the fashion module (types, categories, products),
// typed on the shared `fashion` contract. The nested hooks keep the shape the
// components already use.

const useFilteredProducts = (typeId: string | null | undefined, filter: ProductFilter) =>
  useQuery({
    queryKey: queryKeys.fashion.products(typeId ?? "", filter),
    queryFn: () => filterProducts(typeId ?? "", filter),
    enabled: !!typeId,
  });

const useCategoryById = (typeId: string | null | undefined) =>
  useQuery({
    queryKey: queryKeys.fashion.categories(),
    queryFn: getCategories,
    select: (data: FashionCategory[]) => data.filter((cat) => cat?.type_info === typeId),
    enabled: !!typeId,
  });

const useSubCategoryById = (catId: string | null | undefined) =>
  useQuery({
    queryKey: queryKeys.fashion.subCategories(),
    queryFn: getSubCategories,
    select: (data: FashionSubCategory[]) => data?.filter((sub) => sub?.category_info?._id === catId),
    enabled: !!catId,
  });

const useKidsProductsByCatId = (typeId: string | null | undefined, catId: string | null = null) =>
  useFilteredProducts(typeId, { category_info: catId });

const POPULAR_TYPES = [MEN_TYPE_ID, WOMEN_TYPE_ID, KIDS_TYPE_ID];

const useAllPopularProducts = () =>
  useQuery({
    queryKey: queryKeys.fashion.allPopular(),
    queryFn: async (): Promise<FashionProduct[]> =>
      (await Promise.all(POPULAR_TYPES.map((t) => filterProducts(t, { is_popular: true })))).flat(),
  });

// A product a card has already loaded is not searched for again right away
// (the search reads every type).
const PRODUCT_STALE_MS = 5 * 60 * 1000;

/** Puts a product a card shows into the cache its details page reads. */
export function seedFashionProduct(qc: QueryClient, product: { _id?: unknown } | null | undefined) {
  if (typeof product?._id !== "string") return;
  qc.setQueryData(queryKeys.fashion.product(product._id), product as FashionProduct);
}

/** A product by id, from the cache a product card seeded or else searched for. */
const useProductById = (productId: string | null | undefined) =>
  useQuery({
    queryKey: queryKeys.fashion.product(productId ?? ""),
    // null, not undefined: react-query treats undefined data as an error.
    queryFn: () => findProduct(productId ?? ""),
    enabled: !!productId,
    staleTime: PRODUCT_STALE_MS,
  });

const usePopularProductsByType = (typeId: string | null | undefined) =>
  useFilteredProducts(typeId, { is_popular: true });

const useSearchedProductsByType = (typeId: string | null | undefined, searchText: string | null = null) =>
  useFilteredProducts(typeId, { search_text: searchText });

export const useCategoryItem = () => {
  const types = useQuery({ queryKey: queryKeys.fashion.types(), queryFn: getTypes });
  const categories = useQuery({ queryKey: queryKeys.fashion.categories(), queryFn: getCategories });
  const subCategories = useQuery({
    queryKey: queryKeys.fashion.subCategories(),
    queryFn: getSubCategories,
  });
  const brands = useQuery({ queryKey: queryKeys.fashion.brands(), queryFn: getBrands });

  const navItems =
    types.data && categories.data && subCategories.data
      ? generateNavItems(types.data, categories.data, subCategories.data)
      : null;

  const error = types.error || categories.error || subCategories.error || brands.error;

  return {
    brands: brands.data,
    allType: types.data,
    navItems,
    allCategory: categories.data,
    allSubCategory: subCategories.data,
    isLoading: types.isLoading || categories.isLoading || subCategories.isLoading || brands.isLoading,
    error,
    isError: !!error,
    useProductById,
    useCategoryById,
    useSubCategoryById,
    useAllPopularProducts,
    useKidsProductsByCatId,
    usePopularProductsByType,
    useSearchedProductsByType,
  };
};
