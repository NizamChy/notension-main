"use client";

import "swiper/css";
import Title from "./Title";
import Link from "next/link";
import Image from "next/image";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { slugify } from "../utils/slugify";
import { Swiper, SwiperSlide } from "swiper/react";
import { GrNext, GrPrevious } from "react-icons/gr";
import { FASHION_IMAGE_URL } from "@/api-endpoints/secret";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useCategoryItem } from "../hooks/fetchData/useCategoryItem";
import CategorySkeleton from "../shared/SkeletonLoading/CategorySkeleton";

const AllTypesSlider = () => {
  const { allType, isLoading, isError } = useCategoryItem();

  if (isLoading) return <CategorySkeleton />;

  if (isError) {
    return (
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <Title title="Shop By Category" />
          <div className="text-center text-red-500 py-10">
            Failed to load categories
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div
        style={{
          "--swiper-navigation-size": "24px",
          "--swiper-pagination-bullet-size": "10px",
          "--swiper-pagination-bullet-inactive-opacity": "0.5",
          "--swiper-pagination-bullet-horizontal-gap": "6px",
        }}
        className="max-w-7xl mx-auto"
      >
        <Title title="Shop By Category" />

        <div className="relative max-h-32 sm:max-h-64">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={3}
            navigation={{
              nextEl: ".custom-swiper-button-next-cat2",
              prevEl: ".custom-swiper-button-prev-cat2",
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
              640: { slidesPerView: 3 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 6 },
              1536: { slidesPerView: 6 },
            }}
          >
            {allType?.map((type) => (
              <SwiperSlide
                key={type?._id?.toString()}
                className="group relative rounded-lg transition-shadow duration-300"
              >
                <Link
                  href={`/fashion_lifestyle/cat/${slugify(type?.type_name)}_${
                    type?._id
                  }`}
                  className="block"
                  aria-label={`Browse ${type?.type_name} category`}
                >
                  <div className="aspect-square">
                    <Image
                      src={
                        type?.type_img
                          ? `${FASHION_IMAGE_URL}/${type?.type_img}`
                          : "/png/dummyImage.png"
                      }
                      alt={type?.type_name}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover rounded-lg"
                      priority={false}
                    />
                  </div>

                  <h3 className="text-sm lg:text-base text-center font-semibold text-gray-800 p-2 group-hover:underline">
                    {type?.type_name}
                  </h3>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            aria-label="Next category"
            className="custom-swiper-button-next-cat2 absolute top-1/2 -right-2.5 sm:-right-5 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 text-black flex items-center justify-center shadow-sm cursor-pointer text-[var(--swiper-navigation-size)] font-bold hover:bg-white transition-colors"
          >
            <GrNext />
          </button>

          <button
            aria-label="Previous category"
            className="custom-swiper-button-prev-cat2 absolute top-1/2 -left-2.5 sm:-left-5 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 text-black flex items-center justify-center shadow-sm cursor-pointer text-[var(--swiper-navigation-size)] font-bold hover:bg-white transition-colors"
          >
            <GrPrevious />
          </button>
        </div>
      </div>
    </section>
  );
};

export default AllTypesSlider;
