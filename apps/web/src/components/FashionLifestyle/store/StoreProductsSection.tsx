"use client";

import React from "react";
import { useParams } from "next/navigation";
import StoreProducts from "./StoreProducts";
import { useStoreItems } from "../hooks/fetchData/useStoreItems";

import type { StoreType } from "@/lib/api/fashion";

type Props = { type: StoreType };

const StoreProductsSection = ({ type }: Props) => {
  const { useProductsByStoreTypeId } = useStoreItems();

  const params = useParams<{ shopSlugId?: string }>();
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
