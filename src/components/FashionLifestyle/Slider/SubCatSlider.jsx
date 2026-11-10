"use client";

import "swiper/css";
import Link from "next/link";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { slugify } from "../utils/slugify";
import { useParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { GrNext, GrPrevious } from "react-icons/gr";
import { FASHION_IMAGE_URL } from "@/api-endpoints/env";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useCategoryItem } from "../hooks/fetchData/useCategoryItem";

const SubCatSlider = () => {
  const params = useParams();
  const typeCatSubIdSlug = params?.subcategorySlugId;

  const [typeSlug, typeId, catSlug, catId, subCatSlug, subCatId] =
    typeCatSubIdSlug.split("_");

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

  if (!subCategories || subCategories.length === 0) {
    return null;
  }

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-6"
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
          spaceBetween={12}
          slidesPerView={4}
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
            640: { slidesPerView: 6, spaceBetween: 16 },
            1024: { slidesPerView: 8, spaceBetween: 24 },
          }}
        >
          {subCategories.map((category) => (
            <SwiperSlide key={category?._id?.toString()}>
              <div className="group rounded-lg relative transition-all duration-300 pt-1">
                <Link
                  href={`/fashion-lifestyle/subcategory/${typeSlug}_${typeId}_${catSlug}_${catId}_${slugify(
                    category?.sub_category_name
                  )}_${category?._id}`}
                  className="block"
                  aria-label={`View ${category?.sub_category_name} subcategory`}
                >
                  <div className="w-full max-w-[120px] mx-auto aspect-square rounded-full overflow-hidden border bg-gray-50 group-hover:border-blue-500 transition-colors">
                    <Image
                      src={
                        category?.banner_type_1
                          ? `${FASHION_IMAGE_URL}/${category?.banner_type_1}`
                          : "/png/dummyImage.png"
                      }
                      alt={category?.sub_category_name}
                      width={400}
                      height={400}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      priority={false}
                    />
                  </div>

                  <h3 className="mt-2 text-xs lg:text-sm text-gray-700 font-semibold leading-snug text-center line-clamp-2">
                    {category?.sub_category_name}
                  </h3>
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          aria-label="Next subcategory"
          className="custom-swiper-button-next-cat1 absolute top-[40%] right-0 translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white text-black hidden md:flex items-center justify-center shadow-sm cursor-pointer text-[var(--swiper-navigation-size)] font-bold hover:bg-white transition-colors"
        >
          <GrNext />
        </button>

        <button
          aria-label="Previous subcategory"
          className="custom-swiper-button-prev-cat1 absolute top-[40%] left-0 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white text-black hidden md:flex items-center justify-center shadow-sm cursor-pointer text-[var(--swiper-navigation-size)] font-bold hover:bg-white transition-colors"
        >
          <GrPrevious />
        </button>
      </div>
    </div>
  );
};

export default SubCatSlider;
