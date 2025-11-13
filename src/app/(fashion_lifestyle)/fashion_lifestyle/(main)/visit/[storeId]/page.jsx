import React from "react";
import { STORES } from "@/components/FashionLifestyle/utils/constants";
import StoreSection from "@/components/FashionLifestyle/store/StoreSection";

const page = async ({ params }) => {
  const { storeId } = await params;

  const storeInfo = STORES?.find((s) => s?.store_id === storeId);

  return <StoreSection storeInfo={storeInfo} />;
};

export default page;
