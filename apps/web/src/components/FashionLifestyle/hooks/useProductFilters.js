"use client";

import { useMemo, useState } from "react";

export const PRICE_MIN = 0;
export const PRICE_MAX = 25000;

const EMPTY_VALUES = new Set(["", "null", "undefined"]);
const SIZE_ORDER = ["xxs", "xs", "s", "m", "l", "xl", "xxl", "xxxl"];

// Products store sizes / colors as comma-separated strings ("S,M,L"), but the
// API has also returned "null" / "" / arrays, so normalise everything here.
export const toList = (value) => {
  if (value === null || value === undefined) return [];
  const raw = Array.isArray(value) ? value : String(value).split(",");
  return raw
    .map((item) =>
      item && typeof item === "object"
        ? item.name ?? item.label ?? item.value ?? ""
        : item
    )
    .map((item) => String(item ?? "").trim())
    .filter((item) => item && !EMPTY_VALUES.has(item.toLowerCase()));
};

const normalise = (value) => String(value).trim().toLowerCase();

// brand_info is usually populated ({ _id, brand_name }) but may be a bare id.
const getBrand = (product, brandList) => {
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

const getPrice = (product) =>
  Number(product?.sale_price || product?.max_retail_price || 0);

const compareSizes = (a, b) => {
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

const collectOptions = (products, pick) => {
  const map = new Map();
  products.forEach((product) => {
    toList(pick(product)).forEach((label) => {
      const value = normalise(label);
      if (!map.has(value)) map.set(value, { value, label });
    });
  });
  return [...map.values()];
};

const matchesAny = (selected, values) =>
  !selected.length || values.some((value) => selected.includes(value));

/**
 * Client-side filtering for the fashion product listings.
 * OR within a filter (multi-select), AND across filters.
 */
export const useProductFilters = (
  products,
  { defaultSegments = [], brands = [] } = {}
) => {
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedFits, setSelectedFits] = useState([]);
  const [selectedFabrics, setSelectedFabrics] = useState([]);
  const [selectedEmbelishments, setSelectedEmbelishments] = useState([]);
  const [selectedSleeveLengths, setSelectedSleeveLengths] = useState([]);
  const [selectedSegments, setSelectedSegments] = useState(defaultSegments);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState([PRICE_MIN, PRICE_MAX]);

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
        selectedSegments.includes(item?.sub_category_info?._id)
      )
      .sort(
        // last selected segment first
        (a, b) =>
          selectedSegments.indexOf(b?.sub_category_info?._id) -
          selectedSegments.indexOf(a?.sub_category_info?._id)
      );
  }, [allProducts, selectedSegments]);

  const filterOptions = useMemo(() => {
    const brandMap = new Map();
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

  const setters = {
    size: setSelectedSizes,
    color: setSelectedColors,
    brand: setSelectedBrands,
    fit: setSelectedFits,
    fabric: setSelectedFabrics,
    embelishment: setSelectedEmbelishments,
    sleeveLength: setSelectedSleeveLengths,
    segment: setSelectedSegments,
  };

  const toggleFilter = (filterType, value) => {
    const setter = setters[filterType];
    if (!setter) return;
    setter((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  };

  const handlePriceChange = (min, max) => setPriceRange([min, max]);

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
