"use client";

import { useMemo, useState, type Dispatch, type SetStateAction } from "react";

export const PRICE_MIN = 0;
export const PRICE_MAX = 25000;

const EMPTY_VALUES = new Set(["", "null", "undefined"]);
const SIZE_ORDER = ["xxs", "xs", "s", "m", "l", "xl", "xxl", "xxxl"];

/** One choice in a filter list: `value` is normalised, `label` is shown. */
export type FilterOption = { value: string; label: string };

export type FilterOptions = {
  brands: FilterOption[];
  sizes: FilterOption[];
  colors: FilterOption[];
};

export type FilterType =
  | "size"
  | "color"
  | "brand"
  | "fit"
  | "fabric"
  | "embelishment"
  | "sleeveLength"
  | "segment";

export type PriceRange = [number, number];

type BrandRef = { _id?: string; brand_name?: string };

/**
 * The product fields the filters read. Listings pass FashionProduct, but the
 * API has also sent bare ids and "null" / "" / arrays for these, so they are
 * kept loose and normalised below.
 */
export type FilterableProduct = {
  sub_category_info?: { _id: string } | null;
  brand_info?: string | BrandRef | null;
  sizes?: unknown;
  colors?: unknown;
  sale_price?: unknown;
  max_retail_price?: unknown;
  stock_qty?: unknown;
};

// Products store sizes / colors as comma-separated strings ("S,M,L"), but the
// API has also returned "null" / "" / arrays, so normalise everything here.
export const toList = (value: unknown): string[] => {
  if (value === null || value === undefined) return [];
  const raw: unknown[] = Array.isArray(value) ? value : String(value).split(",");
  return raw
    .map((item) => {
      if (item && typeof item === "object") {
        const named = item as { name?: unknown; label?: unknown; value?: unknown };
        return named.name ?? named.label ?? named.value ?? "";
      }
      return item;
    })
    .map((item) => String(item ?? "").trim())
    .filter((item) => item && !EMPTY_VALUES.has(item.toLowerCase()));
};

const normalise = (value: unknown) => String(value).trim().toLowerCase();

// brand_info is usually populated ({ _id, brand_name }) but may be a bare id.
const getBrand = (
  product: FilterableProduct,
  brandList: BrandRef[] | null | undefined
): FilterOption | null => {
  const info = product?.brand_info;
  if (!info) return null;
  if (typeof info === "string") {
    const match = brandList?.find((b) => b?._id === info);
    return { value: info, label: match?.brand_name || info };
  }
  const value = info._id || info.brand_name;
  if (!value) return null;
  return { value, label: info.brand_name || value };
};

const getPrice = (product: FilterableProduct) =>
  Number(product?.sale_price || product?.max_retail_price || 0);

const compareSizes = (a: FilterOption, b: FilterOption) => {
  const ai = SIZE_ORDER.indexOf(a.value);
  const bi = SIZE_ORDER.indexOf(b.value);
  if (ai !== -1 && bi !== -1) return ai - bi;
  if (ai !== -1) return -1;
  if (bi !== -1) return 1;
  const an = parseFloat(a.value);
  const bn = parseFloat(b.value);
  if (!Number.isNaN(an) && !Number.isNaN(bn)) return an - bn;
  return a.label.localeCompare(b.label);
};

const collectOptions = <P extends FilterableProduct>(
  products: P[],
  pick: (product: P) => unknown
): FilterOption[] => {
  const map = new Map<string, FilterOption>();
  products.forEach((product) => {
    toList(pick(product)).forEach((label) => {
      const value = normalise(label);
      if (!map.has(value)) map.set(value, { value, label });
    });
  });
  return [...map.values()];
};

const matchesAny = (selected: string[], values: string[]) =>
  !selected.length || values.some((value) => selected.includes(value));

// The sub-category a product is in ("" when it has none, which no segment matches).
const segmentOf = (product: FilterableProduct) =>
  product?.sub_category_info?._id ?? "";

type Options = {
  defaultSegments?: string[];
  brands?: BrandRef[];
};

/**
 * Client-side filtering for the fashion product listings.
 * OR within a filter (multi-select), AND across filters.
 */
export const useProductFilters = <P extends FilterableProduct>(
  products: P[] | null | undefined,
  { defaultSegments = [], brands = [] }: Options = {}
) => {
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedFits, setSelectedFits] = useState<string[]>([]);
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
  const [selectedEmbelishments, setSelectedEmbelishments] = useState<string[]>([]);
  const [selectedSleeveLengths, setSelectedSleeveLengths] = useState<string[]>([]);
  const [selectedSegments, setSelectedSegments] = useState<string[]>(defaultSegments);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<PriceRange>([PRICE_MIN, PRICE_MAX]);

  const allProducts = useMemo(
    () => (Array.isArray(products) ? products : []),
    [products]
  );

  // Products in the selected sub-categories; the other filter options are
  // built from this set so only relevant brands / sizes / colours show up.
  const segmentProducts = useMemo(() => {
    if (!selectedSegments.length) return allProducts;
    return allProducts
      .filter((item) =>
        selectedSegments.includes(segmentOf(item))
      )
      .sort(
        // last selected segment first
        (a, b) =>
          selectedSegments.indexOf(segmentOf(b)) -
          selectedSegments.indexOf(segmentOf(a))
      );
  }, [allProducts, selectedSegments]);

  const filterOptions = useMemo((): FilterOptions => {
    const brandMap = new Map<string, FilterOption>();
    segmentProducts.forEach((product) => {
      const brand = getBrand(product, brands);
      if (brand && !brandMap.has(brand.value)) brandMap.set(brand.value, brand);
    });

    return {
      brands: [...brandMap.values()].sort((a, b) =>
        a.label.localeCompare(b.label)
      ),
      sizes: collectOptions(segmentProducts, (p) => p?.sizes).sort(
        compareSizes
      ),
      colors: collectOptions(segmentProducts, (p) => p?.colors).sort((a, b) =>
        a.label.localeCompare(b.label)
      ),
    };
  }, [segmentProducts, brands]);

  const filteredProducts = useMemo(
    () =>
      segmentProducts.filter((product) => {
        const price = getPrice(product);
        if (price < priceRange[0] || price > priceRange[1]) return false;

        if (selectedBrands.length) {
          const brand = getBrand(product, brands);
          if (!brand || !selectedBrands.includes(brand.value)) return false;
        }

        if (!matchesAny(selectedSizes, toList(product?.sizes).map(normalise)))
          return false;

        if (!matchesAny(selectedColors, toList(product?.colors).map(normalise)))
          return false;

        if (inStockOnly && Number(product?.stock_qty ?? 1) <= 0) return false;

        return true;
      }),
    [
      segmentProducts,
      priceRange,
      selectedBrands,
      selectedSizes,
      selectedColors,
      inStockOnly,
      brands,
    ]
  );

  const setters: Record<FilterType, Dispatch<SetStateAction<string[]>>> = {
    size: setSelectedSizes,
    color: setSelectedColors,
    brand: setSelectedBrands,
    fit: setSelectedFits,
    fabric: setSelectedFabrics,
    embelishment: setSelectedEmbelishments,
    sleeveLength: setSelectedSleeveLengths,
    segment: setSelectedSegments,
  };

  const toggleFilter = (filterType: FilterType, value: string) => {
    const setter = setters[filterType];
    if (!setter) return;
    setter((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  };

  const handlePriceChange = (min: number, max: number) => setPriceRange([min, max]);

  const clearAllFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedBrands([]);
    setSelectedFits([]);
    setSelectedFabrics([]);
    setSelectedEmbelishments([]);
    setSelectedSleeveLengths([]);
    setSelectedSegments(defaultSegments);
    setInStockOnly(false);
    setPriceRange([PRICE_MIN, PRICE_MAX]);
  };

  return {
    selectedSizes,
    selectedColors,
    selectedBrands,
    selectedFits,
    selectedFabrics,
    selectedEmbelishments,
    selectedSleeveLengths,
    selectedSegments,
    inStockOnly,
    setInStockOnly,
    priceRange,
    toggleFilter,
    handlePriceChange,
    clearAllFilters,
    filterOptions,
    filteredProducts,
    totalCount: segmentProducts.length,
  };
};
