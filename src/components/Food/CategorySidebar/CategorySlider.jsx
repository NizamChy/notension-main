"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { useSelector } from "react-redux";
import { GrPrevious, GrNext } from "react-icons/gr";
import {
  FOOD_ITEMS_IMAGES,
  FOOD_SLIDER_TYPE_SUBTYPE_IMAGES,
} from "@/api-endpoints/api-endpoint";

const CategorySlider = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const { productCategory } = useSelector((state) => state.itemsByStore);

  const categoryIdFromUrl = pathname.split("/").pop();

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    router.push(`/food/store/${params?.store}/${categoryId}`);
  };

  useEffect(() => {
    if (categoryIdFromUrl) {
      setActiveCategory(categoryIdFromUrl);
    }
  }, [categoryIdFromUrl]);

  return (
    <div className="lg:hidden my-5 relative flex justify-center items-center">
      <button
        className="absolute top-1/2 left-2 z-10 -translate-y-1/2 p-2 bg-gray-200 rounded-full shadow-md hover:bg-gray-300"
        id="custom-prev"
      >
        <GrPrevious />
      </button>
      <button
        className="absolute top-1/2 right-2 z-10 -translate-y-1/2 p-2 bg-gray-200 rounded-full shadow-md hover:bg-gray-300"
        id="custom-next"
      >
        <GrNext />
      </button>

      <div className="w-full flex justify-center mx-auto px-5 items-center">
        <Swiper
          slidesPerView={3}
          spaceBetween={20}
          loop={true}
          navigation={{
            prevEl: "#custom-prev",
            nextEl: "#custom-next",
          }}
          breakpoints={{
            640: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 30,
            },
          }}
          modules={[Navigation]}
          className="w-full max-w-lg mx-auto"
        >
          {productCategory.map((category) => (
            <SwiperSlide key={category._id} className="flex justify-center">
              <div
                className={`bg-white w-full flex flex-col justify-center items-center border-2 rounded-lg cursor-pointer px-2 pt-2 ${
                  activeCategory === category.categoryInfo._id
                    ? "border-primaryFood"
                    : "border-gray-100"
                }`}
                onClick={() => handleCategoryClick(category.categoryInfo._id)}
              >
                <div className="flex flex-col justify-center items-center text-center">
                  <Image
                    src={
                      category?.categoryInfo?.banner_type_1
                        ? `${FOOD_ITEMS_IMAGES}/${FOOD_SLIDER_TYPE_SUBTYPE_IMAGES}/${category?.categoryInfo?.banner_type_1}`
                        : "/png/dummyImage.png"
                    }
                    alt="category image"
                    width={100}
                    height={100}
                    className="rounded object-contain w-full"
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default CategorySlider;

// "use client";

// import Image from "next/image";
// import React, { useState, useEffect } from "react";
// import { useParams, usePathname, useRouter } from "next/navigation";
// import { GrPrevious, GrNext } from "react-icons/gr";
// import { useSelector } from "react-redux";
// import {
//   FOOD_ITEMS_IMAGES,
//   FOOD_SLIDER_TYPE_SUBTYPE_IMAGES,
// } from "@/api-endpoints/api-endpoint";

// const CategorySlider = () => {
//   const [activeCategory, setActiveCategory] = useState(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [itemsPerPage, setItemsPerPage] = useState(2);
//   const router = useRouter();
//   const pathname = usePathname();
//   const params = useParams();

//   const { productCategory } = useSelector((state) => state.itemsByStore);

//   const categoryIdFromUrl = pathname.split("/").pop();

//   const handleCategoryClick = (categoryId) => {
//     setActiveCategory(categoryId);

//     router.push(`/food/store/${params?.store}/${categoryId}`);
//   };

//   const handleNext = () => {
//     const nextIndex =
//       currentIndex + itemsPerPage >= productCategory.length
//         ? 0
//         : currentIndex + itemsPerPage;
//     setCurrentIndex(nextIndex);
//   };

//   const handlePrevious = () => {
//     const prevIndex =
//       currentIndex - itemsPerPage < 0
//         ? productCategory.length - itemsPerPage
//         : currentIndex - itemsPerPage;
//     setCurrentIndex(prevIndex);
//   };

//   const visibleCategories = productCategory.slice(
//     currentIndex,
//     currentIndex + itemsPerPage
//   );

//   useEffect(() => {
//     if (categoryIdFromUrl) {
//       setActiveCategory(categoryIdFromUrl);
//     }
//   }, [categoryIdFromUrl]);

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth <= 767) {
//         setItemsPerPage(2);
//       } else {
//         setItemsPerPage(4);
//       }
//     };

//     handleResize();

//     window.addEventListener("resize", handleResize);

//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   return (
//     <div className="lg:hidden">
//       <div className="flex items-center justify-between my-5 mx-3">
//         <button
//           onClick={handlePrevious}
//           className="p-2 bg-gray-200 rounded-full disabled:opacity-50"
//         >
//           <GrPrevious />
//         </button>

//         <div className="grid grid-cols-2 md:grid-cols-4 gap-5 justify-items-center">
//           {visibleCategories.map((category) => (
//             <div
//               key={category._id}
//               className={`max-h-32 bg-white max-w-32 p-2 flex flex-col justify-center items-center border-2 rounded-lg cursor-pointer ${
//                 activeCategory === category.categoryInfo._id
//                   ? "border-primary"
//                   : "border-white"
//               }`}
//               onClick={() => handleCategoryClick(category.categoryInfo._id)}
//             >
//               <div className="flex flex-col justify-center items-center text-center text-sm">
//                 <Image
//                   src={`${FOOD_ITEMS_IMAGES}/${FOOD_SLIDER_TYPE_SUBTYPE_IMAGES}/${category?.categoryInfo?.banner_type_1}`}
//                   alt={category.categoryName}
//                   width={120}
//                   height={120}
//                   className="rounded object-cover h-16"
//                 />
//                 <span>{category.categoryName}</span>
//               </div>
//             </div>
//           ))}
//         </div>

//         <button
//           onClick={handleNext}
//           className="p-2 bg-gray-200 rounded-full disabled:opacity-50"
//         >
//           <GrNext />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CategorySlider;
