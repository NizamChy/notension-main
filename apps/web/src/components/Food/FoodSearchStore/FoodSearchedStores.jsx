"use client";

import toast from "react-hot-toast";
import React, { useEffect, useState } from "react";
import { useFood } from "@/hooks/fetch-data/useFood";
import { useFoodCategory } from "@/hooks/fetch-data/useFoodCategory";
import { toSlug } from "@/utils/slug";
import { useRouter, useSearchParams } from "next/navigation";
import NoStoreFound from "../../ShopInfoSection/NoStoreFound";
import ShopInfoCard from "../../ShopInfoSection/ShopInfoCard";
import ShopInfoCardSkeleton from "../../ShopInfoSection/ShopInfoCardSkeleton";
import { STORE_GRID } from "../FoodSection/FoodSection";
import { PAGE_CONTAINER, SectionTitle } from "@/components/shared/UI/UI";

const FoodSearchedStores = () => {
  const [requested, setRequested] = useState(false);
  const [nearestInfo, setNearestInfo] = useState([]);
  const { category: selectedCategory, ready } = useFoodCategory();

  const router = useRouter();
  const searchParams = useSearchParams();
  const searchText = searchParams.get("query");

  const { progressing, handleSearchStore } = useFood();

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
      `/food/store/${toSlug(shop?.shop_name)}/${shop?._id}/${shop?.custom_store_id}`
    );
  };

  useEffect(() => {
    if (selectedCategory && searchText) {
      handleSearchStore(searchText, setNearestInfo, selectedCategory);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRequested(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- search once per query / category
  }, [searchText, selectedCategory]);

  // Skeleton while a search runs (and before the first one starts). An
  // unknown category (list loaded, id not in it) goes straight to empty.
  const unknownCategory = ready && !selectedCategory;
  const loading =
    progressing || (!requested && !unknownCategory && searchText?.length > 1);
  const count = nearestInfo?.length || 0;

  return (
    <div className={`${PAGE_CONTAINER} py-6 md:py-8`}>
      <SectionTitle
        title={
          <>
            Results for{" "}
            <span className="text-primary dark:text-[#7FB2FF]">
              &ldquo;{searchText}&rdquo;
            </span>
          </>
        }
        subtitle={
          loading
            ? "Searching…"
            : count > 0
              ? `${count} ${count === 1 ? "place" : "places"} found`
              : null
        }
      />

      {!loading && count < 1 && (
        <NoStoreFound
          title="No matching restaurants"
          text="Try a different dish or restaurant name, or check the spelling."
        />
      )}

      {loading && (
        <div className={STORE_GRID}>
          {Array.from({ length: 8 }).map((_, index) => (
            <ShopInfoCardSkeleton key={index} />
          ))}
        </div>
      )}

      <div className={loading ? "hidden" : STORE_GRID}>
        {nearestInfo?.map((shop) => (
          <ShopInfoCard
            onClick={() => {
              handleStoreClick(shop);
            }}
            key={shop?._id}
            shop={shop}
            type="food"
          />
        ))}
      </div>
    </div>
  );
};

export default FoodSearchedStores;
