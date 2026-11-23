"use client";

import notify from "@/utils/notify";
import { useRouter } from "next/navigation";
import React from "react";
import { useFoodCategory } from "@/hooks/food/useFoodModule";
import { useNearestFoodStores } from "@/hooks/food/useFoodStores";
import { toSlug } from "@/utils/slug";
import NoStoreFound from "../../ShopInfoSection/NoStoreFound";
import ShopInfoCard from "../../ShopInfoSection/ShopInfoCard";
import ShopInfoCardSkeleton from "../../ShopInfoSection/ShopInfoCardSkeleton";
import Link from "next/link";
import {
  PAGE_CONTAINER,
  SECONDARY_BUTTON,
  SectionTitle,
} from "@/components/shared/UI/UI";

export const STORE_GRID =
  "grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 xl:grid-cols-4";

const FoodSection = () => {
  const router = useRouter();
  const { category: selectedCategory, ready } = useFoodCategory();
  const { stores: nearestInfo, isLoading } = useNearestFoodStores(selectedCategory);

  const handleStoreClick = (shop) => {
    if (!shop || !shop?.shop_name) return;

    if (shop?.is_closed)
      return notify.info("This store is closed right now. Please check back later.");

    router.push(
      `/food/store/${toSlug(shop?.shop_name)}/${shop?._id}/${shop?.custom_store_id}`
    );
  };

  // Skeleton until the first request has finished, then stores or empty.
  // An unknown category (list loaded, id not in it) goes straight to empty.
  const unknownCategory = ready && !selectedCategory;
  const loading = (!selectedCategory && !unknownCategory) || isLoading;
  const count = nearestInfo?.length || 0;

  return (
    <div className={`${PAGE_CONTAINER} py-6 md:py-8`}>
      <SectionTitle
        title="Nearest restaurants"
        subtitle={
          loading
            ? "Finding restaurants around you…"
            : count > 0
              ? `${count} ${count === 1 ? "place" : "places"} delivering to you`
              : null
        }
      />

      {!loading && count < 1 ? (
        <NoStoreFound
          title="No restaurants nearby"
          text="We couldn't find a restaurant in this category near you. Try another category or change your delivery location."
          action={
            <Link href="/food" className={SECONDARY_BUTTON}>
              Browse categories
            </Link>
          }
        />
      ) : !loading ? (
        <div className={STORE_GRID}>
          {nearestInfo.map((shop) => (
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
      ) : (
        <div className={STORE_GRID}>
          {Array.from({ length: 8 }).map((_, index) => (
            <ShopInfoCardSkeleton key={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodSection;
