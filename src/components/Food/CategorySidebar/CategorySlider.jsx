"use client";

import {
  FOOD_ITEMS_IMAGES,
  FOOD_SLIDER_TYPE_SUBTYPE_IMAGES,
} from "@/api-endpoints/api-endpoint";
import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import { GrPrevious, GrNext } from "react-icons/gr";
import { useParams, usePathname, useRouter } from "next/navigation";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const CategorySlider = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const { productCategory } = useSelector((state) => state.itemsByStore);

  const categoryIdFromUrl = pathname.split("/").pop();

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);

    router.push(
      `/food/store/${params?.store}/${params?.storeId}/${params?.customStoreId}/${categoryId}`
    );
  };

  useEffect(() => {
    if (categoryIdFromUrl) {
      setActiveCategory(categoryIdFromUrl);
    }
  }, [categoryIdFromUrl]);

  return (
    <div className="lg:hidden my-5 relative flex justify-center items-center">
      <button
        className="absolute top-1/2 left-2 z-10 -translate-y-1/2 p-2 bg-gray-200 rounded-full shadow-md hover:bg-gray-300 text-deepGray"
        id="custom-prev"
      >
        <GrPrevious />
      </button>
      <button
        className="absolute top-1/2 right-2 z-10 -translate-y-1/2 p-2 bg-gray-200 rounded-full shadow-md hover:bg-gray-300 text-deepGray"
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
                className={`bg-white w-full flex flex-col justify-center items-center border-2 rounded-lg cursor-pointer ${
                  activeCategory === category.categoryInfo._id
                    ? "border-primaryFood"
                    : "border-gray-100"
                }`}
                onClick={() => handleCategoryClick(category.categoryInfo._id)}
              >
                <div className="flex flex-col justify-center items-center text-center">
                  <img
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
