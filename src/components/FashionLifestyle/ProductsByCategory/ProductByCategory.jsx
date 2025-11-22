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
  const [selectedFits, setSelectedFits] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  // const [priceRange, setPriceRange] = useState([0, 25000]);
  const [selectedFabrics, setSelectedFabrics] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedEmbelishments, setSelectedEmbelishments] = useState([]);
  const [selectedSleeveLengths, setSelectedSleeveLengths] = useState([]);

  const params = useParams();
  const typeCatSubIdSlug = params?.category;
  const [typeSlug, typeId, catSlug, catId, subCatSlug, subCatId] =
    typeCatSubIdSlug.split("_");

  const [selectedSegments, setSelectedSegments] = useState([subCatId]);

  const {
    brands,
    useSubCategoryById,
    useKidsProductsByType,
    useKidsProductsByCatId,
  } = useCategoryItem();

  // const {
  //   data: filteredKidsProducts,
  //   isLoading,
  //   isError,
  // } = useKidsProductsByType(typeId, catId, subCatId);

  const {
    data: kidsProductsByCatId,
    isLoading,
    isError,
  } = useKidsProductsByCatId(typeId, catId);

  const { data: subCategories, isLoading: isSubCategoriesLoading } =
    useSubCategoryById(catId);

  // let products = filteredKidsProducts || [];

  useEffect(() => {
    if (!kidsProductsByCatId) return;

    const filtered = selectedSegments.length
      ? kidsProductsByCatId.filter((item) =>
          selectedSegments.includes(item?.sub_category_info?._id)
        )
      : kidsProductsByCatId;

    setFilteredProducts(filtered);
  }, [selectedSegments, kidsProductsByCatId]);

  // console.log("filteredProducts : ", filteredProducts);

  // useEffect(() => {
  //   if (!kidsProductsByCatId) return;

  //   const filtered = filteredProducts.filter(
  //     (product) =>
  //       product.sale_price >= priceRange[0] &&
  //       product.sale_price <= priceRange[1]
  //   );

  //   setFilteredProducts(filtered);
  // }, [priceRange]);

  // console.log(priceRange);

  // useEffect(() => {
  //   applyFilters();
  // }, [
  //   selectedSizes,
  //   selectedColors,
  //   selectedBrands,
  //   selectedFits,
  //   selectedFabrics,
  //   selectedEmbelishments,
  //   selectedSleeveLengths,
  //   inStockOnly,
  //   selectedSegments,
  //   priceRange,
  // ]);

  // const applyFilters = () => {
  //   let filtered = [...products];

  //   setFilteredProducts(filtered);
  // };

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
    setSelectedSegments([subCatId]);
    // setSelectedSegments([]);
    setPriceRange([0, 5000]);
    // setPriceRange([0, 25000]);
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
            isSubCategoriesLoading={isSubCategoriesLoading}
          />

          <FilterProducts
            isError={isError}
            isLoading={isLoading}
            products={filteredProducts}
            clearAllFilters={clearAllFilters}
            // products={products}
            // filteredProducts={filteredProducts}
          />
        </div>
      </main>
    </div>
  );
};

export default ProductByCategory;
