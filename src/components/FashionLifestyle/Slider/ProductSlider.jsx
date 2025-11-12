"use client";

import "swiper/css";
import Link from "next/link";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useDispatch } from "react-redux";
import { slugify } from "../utils/slugify";
import Title from "../CategorySection/Title";
import { Swiper, SwiperSlide } from "swiper/react";
import { GrNext, GrPrevious } from "react-icons/gr";
import { FASHION_IMAGE_URL } from "@/api-endpoints/secret";
import { handleProductReducer } from "@/redux/productReducer";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useCategoryItem } from "../hooks/fetchData/useCategoryItem";
import ProductCardSkeleton from "../shared/SkeletonLoading/ProductCardSkeleton";

const ProductSlider = () => {
  const { useAllPopularProducts } = useCategoryItem();

  const {
    data: popularProductInfo,
    isLoading,
    isError,
  } = useAllPopularProducts();

  const dispatch = useDispatch();

  const handleProductClick = (product) => {
    dispatch(
      handleProductReducer({
        type: "SAVE_CURRENT_PRODUCT_DETAILS",
        data: product,
      })
    );
  };

  if (isLoading)
    return (
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="min-h-8 lg:min-h-10 mb-3 rounded-md bg-gray-200 animate-pulse w-1/3 lg:w-1/4" />
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    );

  if (isError) return <div>Error loading products</div>;
  const productInfo = [...(popularProductInfo || [])]?.reverse();
  if (!productInfo || productInfo?.length < 1) return null;

  return (
    <div
      className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-12"
      style={{
        "--swiper-navigation-size": "24px",
        "--swiper-pagination-bullet-size": "10px",
        "--swiper-pagination-bullet-inactive-opacity": "0.5",
        "--swiper-pagination-bullet-horizontal-gap": "6px",
      }}
    >
      <Title title="Featured Collection" />

      <div className="relative">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={2}
          navigation={{
            nextEl: ".custom-swiper-button-next",
            prevEl: ".custom-swiper-button-prev",
          }}
          pagination={{
            clickable: true,
            el: ".custom-swiper-pagination",
            bulletClass: "custom-swiper-pagination-bullet",
            bulletActiveClass: "custom-swiper-pagination-bullet-active",
          }}
          loop={true}
          autoplay={{ delay: 3000 }}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1536: { slidesPerView: 5 },
          }}
        >
          {productInfo?.map((product) => (
            <SwiperSlide key={product?._id?.toString()}>
              <Link
                href={`/view-product/${slugify(product?.product_title_eng)}_${
                  product?._id
                }`}
                onClick={() => handleProductClick(product)}
              >
                <div className="group relative bg-white rounded-lg overflow-hidden my-2 transition-all duration-300 h-full flex flex-col">
                  <div className="aspect-[3/4] rounded-lg overflow-hidden">
                    <img
                      src={
                        product?.web_image
                          ? `${FASHION_IMAGE_URL}/${product?.web_image}`
                          : "/images/dummyImage.png"
                      }
                      alt={product?.product_title_eng}
                      className="w-full h-full object-cover object-center rounded-lg group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      style={{
                        transition: "transform 0.3s ease",
                      }}
                    />
                  </div>
                  <div className="px-4 py-2 flex-grow flex flex-col">
                    <h3 className="lg:text-lg font-medium text-gray-900 mb-1 line-clamp-1">
                      {product?.product_title_eng}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {product?.category_info?.category_name}
                    </p>
                    <div className="mt-auto flex justify-between items-center">
                      <p className="text-sm md:text-lg font-semibold text-gray-900">
                        ৳{product?.sale_price}
                      </p>
                      {product?.sale_price < product?.max_retail_price && (
                        <p className="text-xs md:text-sm text-gray-500 line-through">
                          ৳{product?.max_retail_price}
                        </p>
                      )}
                    </div>
                    {product?.sale_price < product?.max_retail_price && (
                      <span
                        className="absolute top-3 right-3 text-white text-xs font-bold px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: "#ef4444",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        SALE
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        <button className="custom-swiper-button-next absolute top-1/2 right-2.5 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 text-black flex items-center justify-center shadow-sm cursor-pointer text-[var(--swiper-navigation-size)] font-bold">
          <GrNext />
        </button>

        <button className="custom-swiper-button-prev absolute top-1/2 left-2.5 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 text-black flex items-center justify-center shadow-sm cursor-pointer text-[var(--swiper-navigation-size)] font-bold">
          <GrPrevious />
        </button>
      </div>
    </div>
  );
};

export default ProductSlider;
