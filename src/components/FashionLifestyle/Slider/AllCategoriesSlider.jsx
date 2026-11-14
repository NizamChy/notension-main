"use client";

import "swiper/css";
import "swiper/css/navigation";
import { slugify } from "../utils/slugify";
import Title from "../CategorySection/Title";
import { Swiper, SwiperSlide } from "swiper/react";
import { Skeleton } from "@/components/shared/UI/UI";
import { Navigation, Autoplay } from "swiper/modules";
import { CategoryBubble } from "../shared/Card/CategoryCard";
import FashionSection, { SliderNav } from "../shared/FashionSection";
import { useCategoryItem } from "../hooks/fetchData/useCategoryItem";

export const CategoryRailSkeleton = ({ title }) => (
  <FashionSection>
    {title ? (
      <Title title={title} />
    ) : (
      <Skeleton className="mb-6 h-7 w-1/3 !rounded-full lg:w-1/5" />
    )}
    <div className="flex gap-4 overflow-hidden lg:gap-6" aria-hidden>
      {[...Array(7)].map((_, i) => (
        <div key={i} className="w-[26%] shrink-0 sm:w-[18%] lg:w-[14%]">
          <Skeleton className="aspect-square !rounded-full" />
          <Skeleton className="mx-auto mt-3 h-3 w-2/3 !rounded-full" />
        </div>
      ))}
    </div>
  </FashionSection>
);

const AllCategoriesSlider = () => {
  const { allCategory, isLoading, error } = useCategoryItem();

  if (isLoading) return <CategoryRailSkeleton title="Shop by category" />;

  if (error) {
    return (
      <FashionSection>
        <Title title="Shop by category" />
        <p className="py-6 text-center text-sm text-[#D92D20]">
          Failed to load categories
        </p>
      </FashionSection>
    );
  }

  return (
    <FashionSection>
      <Title
        title="Shop by category"
        subtitle="Find your fit across every collection"
        action={
          <SliderNav
            prevClass="custom-swiper-button-prev-cat1"
            nextClass="custom-swiper-button-next-cat1"
            label="categories"
          />
        }
      />

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={12}
        slidesPerView={3.4}
        navigation={{
          nextEl: ".custom-swiper-button-next-cat1",
          prevEl: ".custom-swiper-button-prev-cat1",
        }}
        autoplay={{ delay: 3000, pauseOnMouseEnter: true }}
        loop={true}
        breakpoints={{
          640: { slidesPerView: 5.3, spaceBetween: 16 },
          1024: { slidesPerView: 7, spaceBetween: 24 },
        }}
        className="!py-1"
      >
        {allCategory?.map((category) => (
          <SwiperSlide key={category?._id.toString()}>
            <CategoryBubble
              href={`/fashion-lifestyle/category/all_${
                category?.type_info
              }_${slugify(category?.category_name)}_${category?._id}`}
              image={category?.banner}
              name={category?.category_name}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </FashionSection>
  );
};

export default AllCategoriesSlider;
