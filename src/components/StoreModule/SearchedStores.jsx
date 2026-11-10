"use client";

import toast from "react-hot-toast";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getStoreModule, toSlug } from "./storeModules";
import ShopInfoCard from "../ShopInfoSection/ShopInfoCard";
import NoStoreFound from "../ShopInfoSection/NoStoreFound";
import ShopInfoCardSkeleton from "../ShopInfoSection/ShopInfoCardSkeleton";

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
    <div className="mx-auto px-4 lg:px-24 py-6">
      <h4 className="text-sm md:text-xl font-medium text-gray-500 pb-4">
        Store found for{" "}
        <span className="text-gray-700">&ldquo;{searchText}&rdquo;</span>
      </h4>

      {!progressing && nearestInfo?.length < 1 && <NoStoreFound />}

      {progressing && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <ShopInfoCardSkeleton key={index} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-8">
        {nearestInfo?.map((shop) => (
          <ShopInfoCard
            onClick={() => handleStoreClick(shop)}
            key={shop?._id}
            shop={shop}
            type={moduleName}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchedStores;
