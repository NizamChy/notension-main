"use client";

import notify from "@/utils/notify";
import React from "react";
import { useFoodCategory } from "@/hooks/food/useFoodModule";
import { useFoodSearchStores } from "@/hooks/food/useFoodStores";
import { toSlug } from "@/utils/slug";
import { useRouter, useSearchParams } from "next/navigation";
import ShopInfoCard from "../../ShopInfoSection/ShopInfoCard";
import ShopInfoCardSkeleton from "../../ShopInfoSection/ShopInfoCardSkeleton";
import { STORE_GRID } from "../FoodSection/FoodSection";
import { PAGE_CONTAINER } from "@/components/shared/UI/UI";
import { NoStoreFound, SectionTitle } from "@/components/StoreModule/legacyViews";
import type { FoodStore } from "@/lib/api/food";

const FoodSearchedStores = () => {
  const { category: selectedCategory, ready } = useFoodCategory();

  const router = useRouter();
  const searchParams = useSearchParams();
  const searchText = searchParams.get("query");

  const { stores: nearestInfo, isLoading: progressing } = useFoodSearchStores(
    searchText ?? "",
    selectedCategory,
  );

  const handleStoreClick = (shop: FoodStore) => {
    if (!shop || !shop?.shop_name) return;

    if (shop?.is_closed)
      return notify.info("This store is closed right now. Please check back later.");

    router.push(
      `/food/store/${toSlug(shop?.shop_name)}/${shop?._id}/${shop?.custom_store_id}`
    );
  };

  // Skeleton while a search runs (and before the category is known). An
  // unknown category (list loaded, id not in it) goes straight to empty.
  const unknownCategory = ready && !selectedCategory;
  const loading =
    progressing || (!selectedCategory && !unknownCategory && (searchText?.length ?? 0) > 1);
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
