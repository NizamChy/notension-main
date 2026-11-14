"use client";

import toast from "react-hot-toast";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import StoreList from "./StoreList";
import { getStoreModule, toSlug } from "./storeModules";

const SearchedStores = ({ moduleName }) => {
  const [nearestInfo, setNearestInfo] = useState([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const searchText = searchParams.get("query");

  const { basePath, useShop } = getStoreModule(moduleName);
  const { handleSearchStore, progressing } = useShop();

  const handleStoreClick = (shop) => {
    if (!shop || !shop?.shop_name) return;

    if (shop?.is_closed)
      return toast("Sorry we're closed!", {
        style: {
          border: "1px solid #FC8F1E",
        },
        icon: "ℹ️",
        iconTheme: {
          primary: "#FC8F1E",
          secondary: "#FFFAEE",
        },
      });

    router.push(
      `${basePath}/${toSlug(shop?.shop_name)}/${shop?._id}/${shop?.custom_store_id}`,
    );
  };

  useEffect(() => {
    handleSearchStore(searchText, setNearestInfo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  return (
    <StoreList
      moduleName={moduleName}
      title={searchText ? `Stores matching “${searchText}”` : "Search stores"}
      subtitle={searchText ? null : "Type a store name in the search bar above."}
      shops={nearestInfo}
      isLoading={progressing}
      onShopClick={handleStoreClick}
      emptyTitle="No matching stores"
      emptyText="Check the spelling or try a shorter store name."
    />
  );
};

export default SearchedStores;
