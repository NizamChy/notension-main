"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import ShopInfoCard from "../ShopInfoSection/ShopInfoCard";
import ShopInfoCardSkeleton from "../ShopInfoSection/ShopInfoCardSkeleton";
import NoStoreFound from "../ShopInfoSection/NoStoreFound";
import { useFood } from "@/hooks/fetch-data/useFood";
import { useSelector } from "react-redux";

const FoodSearchedStores = () => {
  const [nearestInfo, setNearestInfo] = useState([]);
  const [catId, setCatId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();

  const searchText = searchParams.get("query");

  const { exploreFoodModule, progressing, handleSearchStore } = useFood();

  // useEffect(() => {
  //   const currentUrl = window.location.href;
  //   const pathSegments = currentUrl.split("/");
  //   const categoryId = pathSegments[pathSegments.length - 2];

  //   console.log(currentUrl);

  //   console.log("categoryId:", categoryId);

  //   setCatId(categoryId);
  // }, []);

  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    const pathSegments = currentUrl.pathname.split("/");
    const categoryId = pathSegments.find((segment) =>
      /^[a-f0-9]{24}$/.test(segment)
    );

    // console.log("currentUrl:", currentUrl.href);
    // console.log("categoryId:", categoryId);

    setCatId(categoryId);
  }, []);

  // useEffect(() => {
  //   exploreFoodModule();
  // }, []);

  const shopCategory = useSelector((state) => state.dashboard.shopCategory);

  useEffect(() => {
    if (catId && shopCategory) {
      const category = shopCategory?.find((item) => item._id === catId);
      setSelectedCategory(category);
    }
  }, [catId, shopCategory]);

  useEffect(() => {
    if (selectedCategory && searchText) {
      handleSearchStore(searchText, setNearestInfo, selectedCategory);
    }
    setLoading(false);
  }, [searchText, selectedCategory]);

  return (
    <div className="mx-auto px-4 lg:px-24 py-6">
      <h4 className="text-sm md:text-xl font-medium text-gray-500 pb-4">
        Store found for <span className="text-gray-700">"{searchText}"</span>
      </h4>

      {!progressing && nearestInfo?.length < 1 && <NoStoreFound />}

      {progressing && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <ShopInfoCardSkeleton key={index} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {nearestInfo.map((shop) => (
          <ShopInfoCard key={shop._id} shop={shop} type="food" />
        ))}
      </div>
    </div>
  );
};

export default FoodSearchedStores;
