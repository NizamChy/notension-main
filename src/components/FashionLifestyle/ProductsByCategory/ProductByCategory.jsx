"use client";

import Head from "next/head";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import FiltersSidebar from "./FiltersSidebar";
import FilterProducts from "./FilterProducts";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useCategoryItem } from "../hooks/fetchData/useCategoryItem";

const ProductByCategory = () => {
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
  const typeCatSubIdSlug = params?.category;

  const [typeSlug, typeId, catSlug, catId, subCatSlug, subCatId] =
    typeCatSubIdSlug.split("_");

  const { useKidsProductsByType, useSubCategoryById, brands } =
    useCategoryItem();

  const {
    data: filteredKidsProducts,
    isLoading,
    isError,
  } = useKidsProductsByType(typeId, catId, subCatId);

  const { data: subCategories } = useSubCategoryById(catId);

  let products = filteredKidsProducts || [];

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
    <div className="bg-gray-50 max-w-screen-2xl mx-auto">
      <Head>
        <title>{typeSlug} | Fashion Store</title>
        <meta
          name="description"
          content={`Browse our ${typeSlug} collection`}
        />
      </Head>

      <main className="py-4 lg:py-8 px-4">
        <h1 className="md:text-2xl font-semibold text-gray-700 capitalize lg:mb-8 flex items-center">
          <Link href={`/fashion_lifestyle/cat/${typeSlug}_${typeId}`}>
            <span className="flex items-center text-gray-800 hover:text-blue-600">
              {typeSlug?.replace(/-/g, " ")}{" "}
              <MdKeyboardArrowRight className="text-gray-500" />
            </span>
          </Link>

          <Link
            href={`/fashion_lifestyle/subcat/${typeSlug}_${typeId}_${catSlug}_${catId}`}
          >
            <span className="flex items-center text-gray-700 hover:text-blue-600">
              {catSlug?.replace(/-/g, " ")}{" "}
              <MdKeyboardArrowRight className="text-gray-500" />
            </span>
          </Link>
          <span className="text-gray-600">
            {subCatSlug?.replace(/-/g, " ")}
          </span>
        </h1>

        <div className="flex flex-col md:flex-row gap-8">
          <FiltersSidebar
            priceRange={priceRange}
            inStockOnly={inStockOnly}
            toggleFilter={toggleFilter}
            selectedFits={selectedFits}
            selectedSizes={selectedSizes}
            selectedColors={selectedColors}
            setInStockOnly={setInStockOnly}
            selectedBrands={selectedBrands}
            clearAllFilters={clearAllFilters}
            selectedFabrics={selectedFabrics}
            selectedSegments={selectedSegments}
            handlePriceChange={handlePriceChange}
            selectedEmbelishments={selectedEmbelishments}
            selectedSleeveLengths={selectedSleeveLengths}
            subCategories={subCategories}
            brands={brands}
            typeCatSubIdSlug={typeCatSubIdSlug}
          />

          <FilterProducts
            isError={isError}
            loading={loading}
            products={products}
            isLoading={isLoading}
            sortOption={sortOption}
            onSortChange={handleSortChange}
            clearAllFilters={clearAllFilters}
            filteredProducts={filteredProducts}
          />
        </div>
      </main>
    </div>
  );
};

export default ProductByCategory;
