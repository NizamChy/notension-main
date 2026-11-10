"use client";

import "swiper/css";
import Link from "next/link";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { slugify } from "../utils/slugify";
import Title from "../CategorySection/Title";
import { Swiper, SwiperSlide } from "swiper/react";
import { GrNext, GrPrevious } from "react-icons/gr";
import { FASHION_IMAGE_URL } from "@/api-endpoints/env";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useCategoryItem } from "../hooks/fetchData/useCategoryItem";

const AllCategoriesSlider = () => {
  const { allCategory, isLoading, error } = useCategoryItem();

  if (isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Title title="All Categories" />
        <div className="w-full min-h-20 lg:min-h-56 animate-pulse bg-gray-100 rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Title title="All Categories" />
        <div className="text-center text-red-500 py-10">
          Failed to load categories
        </div>
      </div>
    );
  }

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10"
      style={{
        "--swiper-navigation-size": "24px",
        "--swiper-pagination-bullet-size": "10px",
        "--swiper-pagination-bullet-inactive-opacity": "0.5",
        "--swiper-pagination-bullet-horizontal-gap": "6px",
      }}
    >
      <Title title="All Categories" />

      <div className="relative">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={12}
          slidesPerView={3.5}
          navigation={{
            nextEl: ".custom-swiper-button-next-cat1",
            prevEl: ".custom-swiper-button-prev-cat1",
          }}
          pagination={{
            clickable: true,
            el: ".custom-swiper-pagination",
            bulletClass: "custom-swiper-pagination-bullet",
            bulletActiveClass: "custom-swiper-pagination-bullet-active",
          }}
          autoplay={{ delay: 2000 }}
          loop={true}
          breakpoints={{
            640: { slidesPerView: 5, spaceBetween: 16 },
            1024: { slidesPerView: 6, spaceBetween: 24 },
          }}
        >
          {allCategory?.map((category) => (
            <SwiperSlide
              key={category?._id.toString()}
              className="group relative rounded-lg transition-shadow duration-300"
            >
              <Link
                href={`/fashion-lifestyle/category/all_${
                  category?.type_info
                }_${slugify(category?.category_name)}_${category?._id}`}
                className="flex flex-col items-center"
              >
                <div className="w-full max-w-[170px] aspect-square rounded-full border overflow-hidden bg-gray-50 group-hover:border-blue-500 transition-colors">
                  <Image
                    src={
                      category?.banner
                        ? `${FASHION_IMAGE_URL}/${category?.banner}`
                        : "/png/dummyImage.png"
                    }
                    alt={category?.category_name}
                    width={183}
                    height={183}
                    className="w-full h-full object-contain rounded-full"
                    priority={false}
                  />
                </div>

                <h3 className="mt-2 text-xs md:text-sm lg:text-base text-center font-semibold text-gray-800 leading-snug line-clamp-2 group-hover:text-blue-500">
                  {category?.category_name}
                </h3>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          aria-label="Next category"
          className="custom-swiper-button-next-cat1 absolute top-[40%] right-0 translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white text-black hidden md:flex items-center justify-center shadow-sm cursor-pointer text-[var(--swiper-navigation-size)] font-bold hover:bg-white transition-colors"
        >
          <GrNext />
        </button>

        <button
          aria-label="Previous category"
          className="custom-swiper-button-prev-cat1 absolute top-[40%] left-0 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white text-black hidden md:flex items-center justify-center shadow-sm cursor-pointer text-[var(--swiper-navigation-size)] font-bold hover:bg-white transition-colors"
        >
          <GrPrevious />
        </button>
      </div>
    </div>
  );
};

export default AllCategoriesSlider;
