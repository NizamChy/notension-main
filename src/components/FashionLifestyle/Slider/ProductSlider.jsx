"use client";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Title from "../CategorySection/Title";
import { Swiper, SwiperSlide } from "swiper/react";
import { GrNext, GrPrevious } from "react-icons/gr";
import FashionSection from "../shared/FashionSection";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useCategoryItem } from "../hooks/fetchData/useCategoryItem";
import FashionProductCard, {
  PRODUCT_GRID_CLASS,
} from "../shared/Card/FashionProductCard";
import ProductCardSkeleton from "../shared/SkeletonLoading/ProductCardSkeleton";

const NAV_BTN =
  "absolute top-[38%] -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white text-gray-800 hidden md:flex items-center justify-center shadow-md cursor-pointer text-base hover:bg-gray-50 transition-colors";

const ProductSlider = () => {
  const { useAllPopularProducts } = useCategoryItem();

  const {
    data: popularProductInfo,
    isLoading,
    isError,
  } = useAllPopularProducts();

  if (isLoading)
    return (
      <FashionSection>
        <div className="h-8 lg:h-9 mb-4 md:mb-6 rounded-md bg-gray-200 animate-pulse w-1/3 lg:w-1/4" />
        <div className={PRODUCT_GRID_CLASS}>
          {[...Array(4)].map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </FashionSection>
    );

  if (isError)
    return (
      <div className="text-center text-red-500">Error loading products</div>
    );
  const productInfo = [...(popularProductInfo || [])]?.reverse();
  if (!productInfo || productInfo?.length < 1) return null;

  return (
    <FashionSection>
      <Title title="Featured Collection" />

      <div className="relative">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={12}
          slidesPerView={2}
          navigation={{
            nextEl: ".custom-swiper-button-next",
            prevEl: ".custom-swiper-button-prev",
          }}
          loop={productInfo.length > 4}
          autoplay={{ delay: 3000 }}
          breakpoints={{
            640: { slidesPerView: 3, spaceBetween: 16 },
            1024: { slidesPerView: 4, spaceBetween: 24 },
          }}
        >
          {productInfo?.map((product) => (
            <SwiperSlide key={product?._id?.toString()} className="!h-auto">
              <FashionProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          aria-label="Next product"
          className={`custom-swiper-button-next right-0 translate-x-1/2 ${NAV_BTN}`}
        >
          <GrNext />
        </button>

        <button
          aria-label="Previous product"
          className={`custom-swiper-button-prev left-0 -translate-x-1/2 ${NAV_BTN}`}
        >
          <GrPrevious />
        </button>
      </div>
    </FashionSection>
  );
};

export default ProductSlider;
