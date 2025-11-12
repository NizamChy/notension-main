"use client";

import Head from "next/head";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import FiltersSidebar from "./FiltersSidebar";
import FilteredProducts from "./FilteredProducts";
import { PRODUCTS_BY_CATEGORY } from "@/utils/constants";

const ProductsByCategory = () => {
  const [loading, setLoading] = useState(false);
  const [selectedFits, setSelectedFits] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [sortOption, setSortOption] = useState("featured");
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 25000]);
  const [selectedFabrics, setSelectedFabrics] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedSegments, setSelectedSegments] = useState([]);
  const [selectedEmbelishments, setSelectedEmbelishments] = useState([]);
  const [selectedSleeveLengths, setSelectedSleeveLengths] = useState([]);

  const params = useParams();
  const categoryId = params?.categoryId.split("_")[0] || null;

  let products =
    params.category === "type"
      ? PRODUCTS_BY_CATEGORY.filter(
          (product) => product.category === categoryId
        )
      : PRODUCTS_BY_CATEGORY || [];

  useEffect(() => {
    applyFilters();
  }, [
    selectedSizes,
    selectedColors,
    selectedBrands,
    selectedFits,
    selectedFabrics,
    selectedEmbelishments,
    selectedSleeveLengths,
    inStockOnly,
    selectedSegments,
    priceRange,
    sortOption,
  ]);

  const applyFilters = () => {
    let filtered = [...products];

    if (selectedSizes.length > 0) {
      filtered = filtered.filter((product) =>
        product.sizes.some((size) => selectedSizes.includes(size))
      );
    }

    if (selectedColors.length > 0) {
      filtered = filtered.filter((product) =>
        selectedColors.includes(product.color.toLowerCase())
      );
    }

    if (selectedBrands.length > 0) {
      filtered = filtered.filter((product) =>
        selectedBrands.includes(product.brand)
      );
    }

    if (selectedFits.length > 0) {
      filtered = filtered.filter((product) =>
        selectedFits.includes(product.fit)
      );
    }

    if (selectedFabrics.length > 0) {
      filtered = filtered.filter((product) =>
        selectedFabrics.includes(product.fabric)
      );
    }

    if (selectedEmbelishments.length > 0) {
      filtered = filtered.filter((product) =>
        product.embelishments.some((emb) => selectedEmbelishments.includes(emb))
      );
    }

    if (selectedSleeveLengths.length > 0) {
      filtered = filtered.filter((product) =>
        selectedSleeveLengths.includes(product.sleeveLength)
      );
    }

    if (inStockOnly) {
      filtered = filtered.filter((product) => product.inStock);
    }

    if (selectedSegments.length > 0) {
      filtered = filtered.filter((product) =>
        selectedSegments.includes(product.segment)
      );
    }

    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    filtered = sortProducts(filtered, sortOption);

    setFilteredProducts(filtered);
  };

  const toggleFilter = (filterType, value) => {
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

    const stateSetters = {
      size: selectedSizes,
      color: selectedColors,
      brand: selectedBrands,
      fit: selectedFits,
      fabric: selectedFabrics,
      embelishment: selectedEmbelishments,
      sleeveLength: selectedSleeveLengths,
      segment: selectedSegments,
    };

    const currentValues = stateSetters[filterType];
    const setter = setters[filterType];

    if (currentValues.includes(value)) {
      setter(currentValues.filter((item) => item !== value));
    } else {
      setter([...currentValues, value]);
    }
  };

  const handlePriceChange = (min, max) => {
    setPriceRange([min, max]);
  };

  const clearAllFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedBrands([]);
    setSelectedFits([]);
    setSelectedFabrics([]);
    setSelectedEmbelishments([]);
    setSelectedSleeveLengths([]);
    setInStockOnly(false);
    setSelectedSegments([]);
    setPriceRange([0, 25000]);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const sortProducts = (products, sortBy) => {
    const sorted = [...products];

    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating);
      default:
        return sorted;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{categoryId} | Fashion Store</title>
        <meta
          name="description"
          content={`Browse our ${categoryId} collection`}
        />
      </Head>

      <main className="container mx-auto py-4 lg:py-8 px-4">
        <h1 className="text-3xl font-bold capitalize lg:mb-8">
          {categoryId?.replace(/-/g, " ").split("_")[0]}
        </h1>

        <div className="flex flex-col md:flex-row gap-8">
          <FiltersSidebar
            selectedSizes={selectedSizes}
            selectedColors={selectedColors}
            selectedBrands={selectedBrands}
            selectedFits={selectedFits}
            selectedFabrics={selectedFabrics}
            selectedEmbelishments={selectedEmbelishments}
            selectedSleeveLengths={selectedSleeveLengths}
            selectedSegments={selectedSegments}
            inStockOnly={inStockOnly}
            priceRange={priceRange}
            toggleFilter={toggleFilter}
            setInStockOnly={setInStockOnly}
            handlePriceChange={handlePriceChange}
            clearAllFilters={clearAllFilters}
          />

          <FilteredProducts
            products={products}
            filteredProducts={filteredProducts}
            loading={loading}
            clearAllFilters={clearAllFilters}
            sortOption={sortOption}
            onSortChange={handleSortChange}
          />
        </div>
      </main>
    </div>
  );
};

export default ProductsByCategory;
