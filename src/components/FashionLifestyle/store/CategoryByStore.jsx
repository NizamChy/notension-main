"use client";

import "swiper/css";
import Link from "next/link";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { slugify } from "../utils/slugify";
import { useParams } from "next/navigation";
import Title from "../CategorySection/Title";
import { Swiper, SwiperSlide } from "swiper/react";
import { GrNext, GrPrevious } from "react-icons/gr";
import { FASHION_IMAGE_URL } from "@/api-endpoints/secret";
import { useStoreItems } from "../hooks/fetchData/useStoreItems";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

const CategoryByStoreSlider = () => {
  const params = useParams();
  const shopSlugId = params?.shopSlugId;
  const storeId = shopSlugId?.split("_")[1];

  const { useSubCategoryByStoreId } = useStoreItems();
  const {
    data: allSubCategoriesByStore,
    isLoading,
    error,
  } = useSubCategoryByStoreId(storeId);

  if (isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Title title="Shop by Category" />
        <div className="w-full min-h-20 lg:min-h-56 animate-pulse bg-gray-100 rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Title title="Shop by Category" />
        <div className="text-center text-red-500 py-10">
          Failed to load categories
        </div>
      </div>
    );
  }

  if (!allSubCategoriesByStore || allSubCategoriesByStore?.length === 0) {
    return null;
  }

  return (
    <div
      className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      style={{
        "--swiper-navigation-size": "24px",
        "--swiper-pagination-bullet-size": "10px",
        "--swiper-pagination-bullet-inactive-opacity": "0.5",
        "--swiper-pagination-bullet-horizontal-gap": "6px",
      }}
    >
      <Title title="Categories" />

      <div className="relative">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={3}
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
            640: { slidesPerView: 3 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 6 },
            1536: { slidesPerView: 9 },
          }}
        >
          {allSubCategoriesByStore?.map((category) => (
            <SwiperSlide
              key={category?._id.toString()}
              className="group relative rounded-lg transition-shadow duration-300"
            >
              <Link
                href={`/fashion_lifestyle/shop/${shopSlugId}/category/type_${
                  category?.type_info
                }_category_${category?.category_info}_${slugify(
                  category?.sub_category_info?.sub_category_name
                )}_${category?.sub_category_info?._id}`}
                className="flex flex-col items-center"
              >
                <div className="aspect-square min-h-[111px] lg:min-h-[133px] max-w-[111px] lg:max-w-[133px] rounded-full border group-hover:border-blue-500">
                  <Image
                    src={
                      category?.sub_category_info?.banner_type_1
                        ? `${FASHION_IMAGE_URL}/${category?.sub_category_info?.banner_type_1}`
                        : "/png/dummyImage.png"
                    }
                    alt={category?.sub_category_info?.sub_category_name}
                    width={183}
                    height={183}
                    className="w-full h-full object-contain rounded-full"
                    priority={false}
                  />
                </div>

                <h3 className="text-sm lg:text-base text-center font-semibold text-gray-800 p-2 group-hover:text-blue-500">
                  {category?.sub_category_info?.sub_category_name}
                </h3>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          aria-label="Next category"
          className="custom-swiper-button-next-cat1 absolute top-1/2 right-2.5 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 text-black flex items-center justify-center shadow-sm cursor-pointer text-[var(--swiper-navigation-size)] font-bold hover:bg-white transition-colors"
        >
          <GrNext />
        </button>

        <button
          aria-label="Previous category"
          className="custom-swiper-button-prev-cat1 absolute top-1/2 left-2.5 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 text-black flex items-center justify-center shadow-sm cursor-pointer text-[var(--swiper-navigation-size)] font-bold hover:bg-white transition-colors"
        >
          <GrPrevious />
        </button>
      </div>
    </div>
  );
};

export default CategoryByStoreSlider;
