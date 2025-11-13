"use client";

import React from "react";
import { useParams } from "next/navigation";
import StoreProductsSection from "./StoreProductsSection";
import { useStoreItems } from "../hooks/fetchData/useStoreItems";

const StoreProductsByType = () => {
  const { useTypeByStoreId } = useStoreItems();

  const params = useParams();
  const shopId = params?.shopSlugId?.split("_")[1];
  const { data: allTypesByStore } = useTypeByStoreId(shopId);

  return (
    <>
      {allTypesByStore?.map((type) => (
        <StoreProductsSection key={type?._id?.toString()} type={type} />
      ))}
    </>
  );
};

export default StoreProductsByType;
