"use client";

import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useFood } from "@/hooks/fetch-data/useFood";
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
  const [catId, setCatId] = useState(null);
  const [nearestInfo, setNearestInfo] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const router = useRouter();
  const { getNearestFoodStoreInfo, progressing } = useFood();

  const shopCategory = useSelector((state) => state.dashboard.shopCategory);

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

    const formattedShopName = shop?.shop_name
      ?.trim()
      .toLowerCase()
      .replace(/[^\p{Script=Bengali}a-z0-9 ]/gu, "")
      .replace(/\s+/g, "-");

    router.push(
      `/food/store/${formattedShopName}/${shop?._id}/${shop?.custom_store_id}`
    );
  };

  useEffect(() => {
    const currentUrl = window.location.href;
    const pathSegments = currentUrl.split("/");
    const categoryId = pathSegments[pathSegments.length - 2];

    setCatId(categoryId);
  }, []);

  useEffect(() => {
    if (catId && shopCategory) {
      const category = shopCategory?.find((item) => item._id === catId);
      setSelectedCategory(category);
    }
  }, [catId, shopCategory]);

  useEffect(() => {
    if (selectedCategory) {
      getNearestFoodStoreInfo(setNearestInfo, selectedCategory);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRequested(true);
    }
  }, [selectedCategory]);

  // Skeleton until the first request has finished, then stores or empty.
  const loading = !requested || progressing;
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
      ) : shopCategory?.length > 0 && count > 0 && !loading ? (
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
