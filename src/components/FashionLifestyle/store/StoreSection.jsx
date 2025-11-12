"use client";

import React from "react";
import StoreBanner from "./StoreBanner";
// import StoreSlider from "./StoreSlider";
import BannerByStore from "./BannerByStore";
// import TypeByStoreSlider from "./TypeByStore";
import ProductsByStore from "./ProductsByStore";
import CategoryByStore from "./CategoryByStore";
import CategoriesByStore from "./CategoriesByStore";
import StoreProductsSection from "./StoreProductsSection";
import StoreProductsByType from "./StoreProductsByType";

const StoreSection = ({
  storeInfo = null,
  isStatic = true,
  isDetails = false,
}) => {
  return (
    <>
      {!isDetails &&
        (isStatic ? <BannerByStore storeInfo={storeInfo} /> : <StoreBanner />)}

      {isStatic ? (
        <>
          <CategoriesByStore storeInfo={storeInfo} />
          <ProductsByStore storeInfo={storeInfo} />
        </>
      ) : (
        <>
          {/* <TypeByStoreSlider /> */}
          <CategoryByStore />
          {/* <StoreSlider /> */}
          <StoreProductsByType />
        </>
      )}
    </>
  );
};

export default StoreSection;
