"use client";

import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { useFood } from "@/hooks/fetch-data/useFood";
import { useRouter, useSearchParams } from "next/navigation";
import NoStoreFound from "../../ShopInfoSection/NoStoreFound";
import ShopInfoCard from "../../ShopInfoSection/ShopInfoCard";
import ShopInfoCardSkeleton from "../../ShopInfoSection/ShopInfoCardSkeleton";
import { STORE_GRID } from "../FoodSection/FoodSection";
import { PAGE_CONTAINER, SectionTitle } from "@/components/shared/UI/UI";

const FoodSearchedStores = () => {
  const [catId, setCatId] = useState("");
  const [requested, setRequested] = useState(false);
  const [nearestInfo, setNearestInfo] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

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
    const currentUrl = new URL(window.location.href);
    const pathSegments = currentUrl.pathname.split("/");
    const categoryId = pathSegments.find((segment) =>
      /^[a-f0-9]{24}$/.test(segment)
    );

    setCatId(categoryId);
  }, []);

  const shopCategory = useSelector((state) => state.dashboard.shopCategory);

  useEffect(() => {
    if (catId && shopCategory) {
      const category = shopCategory?.find((item) => item?._id === catId);
      setSelectedCategory(category);
    }
  }, [catId, shopCategory]);

  useEffect(() => {
    if (selectedCategory && searchText) {
      handleSearchStore(searchText, setNearestInfo, selectedCategory);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRequested(true);
    }
  }, [searchText, selectedCategory]);

  // Skeleton while a search runs (and before the first one starts).
  const loading = progressing || (!requested && searchText?.length > 1);
  const count = nearestInfo?.length || 0;

  return (
    <div className={`${PAGE_CONTAINER} py-6 md:py-8`}>
      <SectionTitle
        title={
          <>
            Results for{" "}
            <span className="text-[#0C3F8E] dark:text-[#7FB2FF]">
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
