"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { HiOutlineBuildingStorefront } from "react-icons/hi2";
import { EmptyState, PRIMARY_BUTTON } from "@/components/shared/UI/UI";
import StoreBanner from "./StoreBanner";
import CategoryByStore from "./CategoryByStore";
import StoreProductsByType from "./StoreProductsByType";
import { FASHION_CONTAINER } from "../shared/FashionSection";
import { useStoreItems } from "../hooks/fetchData/useStoreItems";

const StoreSection = () => {
  const params = useParams();
  const storeId = params?.shopSlugId?.split("_")[1];

  // Same query as StoreBanner (shared cache), used to catch unknown shops.
  const { useStoreInfo } = useStoreItems();
  const { data: storeInfo, isLoading } = useStoreInfo(storeId);

  if (!isLoading && !storeInfo?._id) {
    return (
      <div className={`${FASHION_CONTAINER} min-h-content py-10 md:py-16`}>
        <EmptyState
          icon={<HiOutlineBuildingStorefront />}
          title="Shop not found"
          text="This link doesn't match a shop. It may have moved or been removed."
          action={
            <Link href="/fashion-lifestyle" className={PRIMARY_BUTTON}>
              Continue shopping
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <>
      <StoreBanner />
      <CategoryByStore />
      <StoreProductsByType />
    </>
  );
};

export default StoreSection;
