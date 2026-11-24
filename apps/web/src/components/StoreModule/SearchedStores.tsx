"use client";

import notify from "@/utils/notify";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import StoreList from "./StoreList";
import { getStoreModule, toSlug, type ListedStore } from "./storeModules";
import type { StoreModuleName } from "./useStoreData";

type Props = { moduleName: StoreModuleName };

const SearchedStores = ({ moduleName }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchText = searchParams.get("query");

  const { basePath, useStores } = getStoreModule(moduleName);
  const useSearchStores = useStores.search;
  const { stores, isLoading } = useSearchStores(searchText ?? "");

  const handleStoreClick = (shop: ListedStore) => {
    if (!shop || !shop?.shop_name) return;

    if (shop?.is_closed)
      return notify.info("This store is closed right now. Please check back later.");

    router.push(
      `${basePath}/${toSlug(shop?.shop_name)}/${shop?._id}/${shop?.custom_store_id}`,
    );
  };

  return (
    <StoreList
      moduleName={moduleName}
      title={searchText ? `Stores matching “${searchText}”` : "Search stores"}
      subtitle={searchText ? null : "Type a store name in the search bar above."}
      shops={stores}
      isLoading={isLoading}
      onShopClick={handleStoreClick}
      emptyTitle="No matching stores"
      emptyText="Check the spelling or try a shorter store name."
    />
  );
};

export default SearchedStores;
