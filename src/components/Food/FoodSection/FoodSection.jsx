"use client";

import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useFood } from "@/hooks/fetch-data/useFood";
import NoStoreFound from "../../ShopInfoSection/NoStoreFound";
import ShopInfoCard from "../../ShopInfoSection/ShopInfoCard";
import ShopInfoCardSkeleton from "../../ShopInfoSection/ShopInfoCardSkeleton";

const FoodSection = () => {
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
    }
  }, [selectedCategory]);

  return (
    <div className="mx-auto px-4 lg:px-24 py-6">
      <h1 className="text-2xl font-bold mb-6 text-deepGray">
        Nearest Food Stores
      </h1>

      {!progressing && nearestInfo?.length < 1 && <NoStoreFound />}

      {shopCategory?.length > 0 && nearestInfo?.length > 0 && !progressing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-8">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <ShopInfoCardSkeleton key={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodSection;
