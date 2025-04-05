"use client";

import {
  FOOD_ITEMS_IMAGES,
  FOOD_SLIDER_TYPE_SUBTYPE_IMAGES,
} from "@/api-endpoints/api-endpoint";
import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import { useFood } from "@/hooks/fetch-data/useFood";
import CategoryCardSkeleton from "./CategoryCardSkeleton";
import { useRouter, usePathname, useParams } from "next/navigation";

const CategorySidebar = ({ scrollToFoodItems }) => {
  const [activeCategory, setActiveCategory] = useState(null);

  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();

  const { progressing } = useFood();
  const { productCategory } = useSelector((state) => state.itemsByStore);

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);

    // router.push(`/food/store/${params?.store}/${categoryId}`);
    router.push(
      `/food/store/${params?.store}/${params?.storeId}/${params?.customStoreId}/${categoryId}`
    );
  };

  useEffect(() => {
    const categoryIdFromUrl = pathname.split("/").pop();
    if (categoryIdFromUrl) {
      setActiveCategory(categoryIdFromUrl);
    }
  }, [pathname]);

  useEffect(() => {
    if (activeCategory) {
      scrollToFoodItems();
    }
  }, [activeCategory, scrollToFoodItems]);

  return (
    <>
      <div className="max-w-screen-md hidden lg:block">
        <div className="h-full border-e ps-7 max-w-screen-md py-16 bg-[#F3F4F6]">
          <div className="overflow-y-auto overflow-x-hidden h-[85vh] no-scrollbar mt-10">
            <div className="grid grid-cols-2 gap-5 justify-items-center my-5 mx-5">
              {progressing
                ? Array.from({ length: 6 }).map((_, index) => (
                    <CategoryCardSkeleton key={index} />
                  ))
                : productCategory.map((category) => (
                    <div
                      key={category?._id}
                      className={`max-w-32 px-2 pt-2 flex flex-col justify-center items-center border-2 rounded-lg cursor-pointer bg-white shadow-sm ${
                        activeCategory === category.categoryInfo._id
                          ? "border-primaryFood"
                          : "border-white"
                      }`}
                      onClick={() =>
                        handleCategoryClick(category.categoryInfo._id)
                      }
                    >
                      <div className="flex flex-col justify-center items-center text-center">
                        <img
                          src={
                            category?.categoryInfo?.banner_type_1
                              ? `${FOOD_ITEMS_IMAGES}/${FOOD_SLIDER_TYPE_SUBTYPE_IMAGES}/${category?.categoryInfo?.banner_type_1}`
                              : "/png/dummyImage.png"
                          }
                          alt="category image"
                          width={200}
                          height={200}
                          className="rounded object-contain"
                        />
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategorySidebar;

// "use client";

// import {
//   FOOD_ITEMS_IMAGES,
//   FOOD_SLIDER_TYPE_SUBTYPE_IMAGES,
// } from "@/api-endpoints/api-endpoint";
// import { useSelector } from "react-redux";
// import React, { useState, useEffect } from "react";
// import { useFood } from "@/hooks/fetch-data/useFood";
// import CategoryCardSkeleton from "./CategoryCardSkeleton";
// import { useRouter, usePathname, useParams } from "next/navigation";

// const CategorySidebar = ({ scrollToFoodItems }) => {
//   const [activeCategory, setActiveCategory] = useState(null);

//   const router = useRouter();
//   const params = useParams();
//   const pathname = usePathname();

//   const { progressing } = useFood();
//   const { productCategory } = useSelector((state) => state.itemsByStore);

//   const handleCategoryClick = (categoryId) => {
//     setActiveCategory(categoryId);

//     router.push(`/food/store/${params?.store}/${categoryId}`);
//   };

//   useEffect(() => {
//     const categoryIdFromUrl = pathname.split("/").pop();
//     if (categoryIdFromUrl) {
//       setActiveCategory(categoryIdFromUrl);
//     }
//   }, [pathname]);

//   useEffect(() => {
//     if (activeCategory) {
//       scrollToFoodItems();
//     }
//   }, [activeCategory, scrollToFoodItems]);

//   return (
//     <>
//       <div className="max-w-screen-md hidden lg:block">
//         <div className="h-full border-e ps-7 max-w-screen-md py-16 bg-[#F3F4F6]">
//           <div className="overflow-y-auto overflow-x-hidden h-[85vh] no-scrollbar mt-10">
//             <div className="grid grid-cols-2 gap-5 justify-items-center my-5 mx-5">
//               {progressing
//                 ? Array.from({ length: 6 }).map((_, index) => (
//                     <CategoryCardSkeleton key={index} />
//                   ))
//                 : productCategory.map((category) => (
//                     <div
//                       key={category._id}
//                       className={`max-w-32 px-2 pt-2 flex flex-col justify-center items-center border-2 rounded-lg cursor-pointer bg-white shadow-sm ${
//                         activeCategory === category.categoryInfo._id
//                           ? "border-primaryFood"
//                           : "border-white"
//                       }`}
//                       onClick={() =>
//                         handleCategoryClick(category.categoryInfo._id)
//                       }
//                     >
//                       <div className="flex flex-col justify-center items-center text-center">
//                         <img
//                           src={
//                             category?.categoryInfo?.banner_type_1
//                               ? `${FOOD_ITEMS_IMAGES}/${FOOD_SLIDER_TYPE_SUBTYPE_IMAGES}/${category?.categoryInfo?.banner_type_1}`
//                               : "/png/dummyImage.png"
//                           }
//                           alt="category image"
//                           width={200}
//                           height={200}
//                           className="rounded object-contain"
//                         />
//                       </div>
//                     </div>
//                   ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default CategorySidebar;
