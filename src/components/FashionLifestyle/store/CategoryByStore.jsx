"use client";

import "swiper/css";
import "swiper/css/navigation";
import { slugify } from "../utils/slugify";
import { useParams } from "next/navigation";
import Title from "../CategorySection/Title";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { CategoryBubble } from "../shared/Card/CategoryCard";
import { useStoreItems } from "../hooks/fetchData/useStoreItems";
import FashionSection, { SliderNav } from "../shared/FashionSection";
import { CategoryRailSkeleton } from "../Slider/AllCategoriesSlider";

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

  if (!allSubCategoriesByStore || allSubCategoriesByStore?.length === 0) {
    return null;
  }

  return (
    <FashionSection>
      <Title
        title="Shop by category"
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
        loop={allSubCategoriesByStore.length > 7}
        breakpoints={{
          640: { slidesPerView: 5.3, spaceBetween: 16 },
          1024: { slidesPerView: 7, spaceBetween: 24 },
        }}
        className="!py-1"
      >
        {allSubCategoriesByStore?.map((category) => (
          <SwiperSlide key={category?._id.toString()}>
            <CategoryBubble
              href={`/fashion-lifestyle/shop/${shopSlugId}/category/type_${
                category?.type_info
              }_category_${category?.category_info}_${slugify(
                category?.sub_category_info?.sub_category_name
              )}_${category?.sub_category_info?._id}`}
              image={category?.sub_category_info?.banner_type_1}
              name={category?.sub_category_info?.sub_category_name}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </FashionSection>
  );
};

export default CategoryByStoreSlider;
