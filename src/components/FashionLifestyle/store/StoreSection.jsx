"use client";

import React from "react";
import StoreBanner from "./StoreBanner";
import CategoryByStore from "./CategoryByStore";
import StoreProductsByType from "./StoreProductsByType";

const StoreSection = () => {
  return (
    <>
      <StoreBanner />
      <CategoryByStore />
      <StoreProductsByType />
    </>
  );
};

export default StoreSection;
