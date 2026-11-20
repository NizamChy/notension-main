"use client";

import notify from "@/utils/notify";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useFood } from "@/hooks/fetch-data/useFood";
import { useFoodCategory } from "@/hooks/fetch-data/useFoodCategory";
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
  const [requested, setRequested] = useState(false);
  const [nearestInfo, setNearestInfo] = useState([]);

  const router = useRouter();
  const { getNearestFoodStoreInfo, progressing } = useFood();
  const { category: selectedCategory, ready } = useFoodCategory();

  const handleStoreClick = (shop) => {
    if (!shop || !shop?.shop_name) return;

    if (shop?.is_closed)
      return notify.info("This store is closed right now. Please check back later.");

    router.push(
      `/food/store/${toSlug(shop?.shop_name)}/${shop?._id}/${shop?.custom_store_id}`
    );
  };

  useEffect(() => {
    if (selectedCategory) {
      getNearestFoodStoreInfo(setNearestInfo, selectedCategory);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRequested(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fetch once per category
  }, [selectedCategory]);

  // Skeleton until the first request has finished, then stores or empty.
  // An unknown category (list loaded, id not in it) goes straight to empty.
  const unknownCategory = ready && !selectedCategory;
  const loading = (!requested && !unknownCategory) || progressing;
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
