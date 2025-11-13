"use client";

import "swiper/css";
import Link from "next/link";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { IMAGE_URL } from "@/api-endpoints/secret";
import { GrNext, GrPrevious } from "react-icons/gr";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useCategoryItem } from "../hooks/fetchData/useCategoryItem";

const SubCategorySlider = () => {
  const params = useParams();
  const catSlugId = params?.categoryId || null;

  const [slug, catId] = catSlugId?.split("_");

  const { useSubCategoryById } = useCategoryItem();
  const { data: subCategories, isLoading, isError } = useSubCategoryById(catId);

  if (isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full min-h-20 lg:min-h-40 animate-pulse bg-gray-100 rounded-lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-red-500 py-10">
          Failed to load subcategories
        </div>
      </div>
    );
  }

  if (!subCategories || subCategories?.length === 0) {
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
            1024: { slidesPerView: 4 },
            1536: { slidesPerView: 7 },
          }}
        >
          {subCategories.map((category) => (
            <SwiperSlide
              key={category?._id?.toString()}
              className="max-w-[212px] max-h-[212px] lg:max-w-[270px] lg:max-h-[270px] md:max-w-[220px] md:max-h-[220px]"
            >
              <div className="group rounded-lg relative transition-all duration-300 pt-2">
                <Link
                  href={`/fashion_lifestyle/category/${category?.slug}`}
                  className="block"
                  aria-label={`View ${category?.sub_category_name} subcategory`}
                >
                  <div className="lg:w-40 lg:h-40 mx-auto aspect-square rounded-full">
                    <Image
                      src={
                        category?.banner_type_1
                          ? `${IMAGE_URL}/${category?.banner_type_1}`
                          : "/images/png/dummyImage.png"
                      }
                      alt={category?.sub_category_name}
                      width={400}
                      height={400}
                      className="w-full h-full object-contain border rounded-full group-hover:shadow group-hover:scale-105 transition-transform duration-500"
                      priority={false}
                    />
                  </div>

                  <h3 className="text-xs lg:text-lg font-semibold my-1 text-center">
                    {category?.sub_category_name}
                  </h3>
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          aria-label="Next subcategory"
          className="custom-swiper-button-next-cat1 absolute top-1/2 right-2.5 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 text-black flex items-center justify-center shadow-sm cursor-pointer text-[var(--swiper-navigation-size)] font-bold hover:bg-white transition-colors"
        >
          <GrNext />
        </button>

        <button
          aria-label="Previous subcategory"
          className="custom-swiper-button-prev-cat1 absolute top-1/2 left-2.5 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 text-black flex items-center justify-center shadow-sm cursor-pointer text-[var(--swiper-navigation-size)] font-bold hover:bg-white transition-colors"
        >
          <GrPrevious />
        </button>
      </div>
    </div>
  );
};

export default SubCategorySlider;
