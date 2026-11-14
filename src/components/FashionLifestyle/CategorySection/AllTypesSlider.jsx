"use client";

import "swiper/css";
import Title from "./Title";
import Link from "next/link";
import Image from "next/image";
import "swiper/css/navigation";
import { slugify } from "../utils/slugify";
import { HiArrowRight } from "react-icons/hi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Skeleton } from "@/components/shared/UI/UI";
import { FASHION_IMAGE_URL } from "@/api-endpoints/env";
import { Navigation, Autoplay } from "swiper/modules";
import FashionSection, { SliderNav } from "../shared/FashionSection";
import { useCategoryItem } from "../hooks/fetchData/useCategoryItem";

const AllTypesSlider = () => {
  const { allType, isLoading, isError } = useCategoryItem();

  if (isLoading)
    return (
      <FashionSection className="bg-gray-50">
        <Skeleton className="mb-6 h-7 w-1/2 !rounded-full sm:w-1/3 lg:w-1/4" />
        <div className="flex gap-4 overflow-hidden lg:gap-6" aria-hidden>
          {[...Array(5)].map((_, i) => (
            <Skeleton
              key={i}
              className="aspect-[3/4] w-[45%] shrink-0 !rounded-2xl sm:w-[30%] lg:w-[19%]"
            />
          ))}
        </div>
      </FashionSection>
    );

  if (isError) {
    return (
      <FashionSection className="bg-gray-50">
        <Title title="Shop by collection" />
        <p className="py-6 text-center text-sm text-[#D92D20]">
          Failed to load categories
        </p>
      </FashionSection>
    );
  }

  if (!allType || allType?.length === 0) return null;

  return (
    <FashionSection className="bg-gray-50">
      <Title
        title="Shop by collection"
        action={
          <SliderNav
            prevClass="custom-swiper-button-prev-cat2"
            nextClass="custom-swiper-button-next-cat2"
            label="collections"
          />
        }
      />

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={12}
        slidesPerView={2.2}
        navigation={{
          nextEl: ".custom-swiper-button-next-cat2",
          prevEl: ".custom-swiper-button-prev-cat2",
        }}
        autoplay={{ delay: 3500, pauseOnMouseEnter: true }}
        loop={allType.length > 5}
        breakpoints={{
          640: { slidesPerView: 3.3, spaceBetween: 16 },
          1024: { slidesPerView: 5, spaceBetween: 24 },
        }}
      >
        {allType?.map((type) => (
          <SwiperSlide key={type?._id?.toString()}>
            <Link
              href={`/fashion-lifestyle/type/${slugify(type?.type_name)}_${
                type?._id
              }`}
              aria-label={`Browse ${type?.type_name}`}
              className="group relative block aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100"
            >
              <Image
                src={
                  type?.type_img
                    ? `${FASHION_IMAGE_URL}/${type?.type_img}`
                    : "/png/dummyImage.png"
                }
                alt={type?.type_name || "Collection"}
                fill
                sizes="(min-width: 1024px) 240px, (min-width: 640px) 30vw, 45vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent px-3 pb-3 pt-12 sm:px-4 sm:pb-4">
                <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-[#FFFFFF] sm:text-base">
                  {type?.type_name}
                </h3>
                <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-[#FFFFFF]/80">
                  Explore
                  <HiArrowRight className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </FashionSection>
  );
};

export default AllTypesSlider;
