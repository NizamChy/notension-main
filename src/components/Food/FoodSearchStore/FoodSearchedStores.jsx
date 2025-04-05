"use client";

import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { useFood } from "@/hooks/fetch-data/useFood";
import { useRouter, useSearchParams } from "next/navigation";
import NoStoreFound from "../../ShopInfoSection/NoStoreFound";
import ShopInfoCard from "../../ShopInfoSection/ShopInfoCard";
import ShopInfoCardSkeleton from "../../ShopInfoSection/ShopInfoCardSkeleton";

const FoodSearchedStores = () => {
  const [catId, setCatId] = useState("");
  const [nearestInfo, setNearestInfo] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const searchText = searchParams.get("query");

  const { progressing, handleSearchStore } = useFood();

  const handleStoreClick = (shop) => {
    if (!shop || !shop?.shop_name) return;

    const formattedShopName = shop?.shop_name
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "") // Remove non-alphanumeric characters
      .replace(/\s+/g, "-"); // Replace spaces with hyphens

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
    }
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

// "use client";

// import { useSelector } from "react-redux";
// import Loader from "@/components/common/Loader";
// import React, { useEffect, useState } from "react";
// import { useFood } from "@/hooks/fetch-data/useFood";
// import { useRouter, useSearchParams } from "next/navigation";
// import NoStoreFound from "../../ShopInfoSection/NoStoreFound";
// import ShopInfoCard from "../../ShopInfoSection/ShopInfoCard";
// import ShopInfoCardSkeleton from "../../ShopInfoSection/ShopInfoCardSkeleton";

// const FoodSearchedStores = () => {
//   const [catId, setCatId] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [nearestInfo, setNearestInfo] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(null);

//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const searchText = searchParams.get("query");

//   const { exploreStore, progressing, handleSearchStore } = useFood();

//   const handleStoreClick = (shop) => {
//     if (!shop || !shop.shop_name) return;

//     setLoading(true);
//     const formattedShopName = shop.shop_name
//       .toLowerCase()
//       .replace(/[^a-z0-9 ]/g, "") // Remove non-alphanumeric characters
//       .replace(/\s+/g, "-"); // Replace spaces with hyphens

//     exploreStore(shop);

//     router.push(`/food/store/${formattedShopName}`);
//   };

//   useEffect(() => {
//     const currentUrl = new URL(window.location.href);
//     const pathSegments = currentUrl.pathname.split("/");
//     const categoryId = pathSegments.find((segment) =>
//       /^[a-f0-9]{24}$/.test(segment)
//     );

//     setCatId(categoryId);
//   }, []);

//   const shopCategory = useSelector((state) => state.dashboard.shopCategory);

//   useEffect(() => {
//     if (catId && shopCategory) {
//       const category = shopCategory?.find((item) => item._id === catId);
//       setSelectedCategory(category);
//     }
//   }, [catId, shopCategory]);

//   useEffect(() => {
//     if (selectedCategory && searchText) {
//       handleSearchStore(searchText, setNearestInfo, selectedCategory);
//     }
//   }, [searchText, selectedCategory]);

//   if (loading) return <Loader />;

//   return (
//     <div className="mx-auto px-4 lg:px-24 py-6">
//       <h4 className="text-sm md:text-xl font-medium text-gray-500 pb-4">
//         Store found for <span className="text-gray-700">"{searchText}"</span>
//       </h4>

//       {!progressing && nearestInfo?.length < 1 && <NoStoreFound />}

//       {progressing && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//           {Array.from({ length: 8 }).map((_, index) => (
//             <ShopInfoCardSkeleton key={index} />
//           ))}
//         </div>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//         {nearestInfo.map((shop) => (
//           <ShopInfoCard
//             onClick={() => {
//               handleStoreClick(shop);
//             }}
//             key={shop._id}
//             shop={shop}
//             type="food"
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default FoodSearchedStores;
