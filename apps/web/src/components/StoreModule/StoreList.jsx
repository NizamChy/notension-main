"use client";

import React from "react";
import { PageHeader } from "@/components/shared/UI/UI";
import { SHOP_GRID_CLASS, STORE_LIST_PAGE_CLASS } from "./storeModules";
import NoStoreFound from "@/components/ShopInfoSection/NoStoreFound";
import ShopInfoCard from "@/components/ShopInfoSection/ShopInfoCard";
import ShopInfoCardSkeleton from "@/components/ShopInfoSection/ShopInfoCardSkeleton";

// Page body for the grocery / medicine store lists (nearest stores, store
// search): title, then a skeleton grid, the shop cards or an empty state.
const StoreList = ({
  moduleName,
  title,
  subtitle,
  shops,
  isLoading,
  onShopClick,
  emptyTitle,
  emptyText,
}) => {
  const count = shops?.length || 0;

  return (
    <div className={STORE_LIST_PAGE_CLASS}>
      <PageHeader
        title={title}
        subtitle={
          !isLoading && count > 0
            ? `${count} ${count === 1 ? "store" : "stores"}${subtitle ? ` · ${subtitle}` : ""}`
            : subtitle
        }
      />

      {isLoading ? (
        <div className={SHOP_GRID_CLASS}>
          {Array.from({ length: 8 }).map((_, index) => (
            <ShopInfoCardSkeleton key={index} />
          ))}
        </div>
      ) : count > 0 ? (
        <div className={SHOP_GRID_CLASS}>
          {shops.map((shop) => (
            <ShopInfoCard
              key={shop?._id}
              shop={shop}
              type={moduleName}
              onClick={() => onShopClick(shop)}
            />
          ))}
        </div>
      ) : (
        <NoStoreFound title={emptyTitle} text={emptyText} />
      )}
    </div>
  );
};

export default StoreList;
