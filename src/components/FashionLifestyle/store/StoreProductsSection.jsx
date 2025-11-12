"use client";

import React from "react";
import { useParams } from "next/navigation";
import StoreProducts from "./StoreProducts";
import { useStoreItems } from "@/hooks/fetchData/useStoreItems";

const StoreProductsSection = ({ type }) => {
  const { useProductsByStoreTypeId } = useStoreItems();

  const params = useParams();
  const shopId = params?.shopSlugId?.split("_")[1];

  const {
    data: productByStoreId,
    isLoading: isLoadingProductInfo,
    isError: isProductInfoError,
  } = useProductsByStoreTypeId(type?.type_info?._id, shopId);

  return (
    <>
      <StoreProducts
        title={type?.type_info?.type_name}
        productInfo={productByStoreId}
        isLoading={isLoadingProductInfo}
        isError={isProductInfoError}
      />
    </>
  );
};

export default StoreProductsSection;
