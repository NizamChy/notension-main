"use client";

import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { Pagination, Autoplay } from "swiper/modules";
import { DEMO_MODE_DEFAULT, isDemoMode } from "@/demo/demoMode";
import { FASHION_IMAGE_URL } from "@/api-endpoints/env";
import { FASHION_CAROUSEL_SLIDES } from "../utils/constants";

// Demo mode serves the banner through the fashion image base URL
// (/demo-images/fashion/fashion/x.svg -> public/demo/fashion/x.svg). Outside
// demo mode FASHION_IMAGE_URL is the remote CDN, so use the local file
// directly (or the slide's local photo when it has one).
const slideImage = (slide, demo) => {
  if (demo) return `${FASHION_IMAGE_URL}/fashion/${slide.image}`;
  return slide.liveImage || `/demo/fashion/${slide.image}`;
};

// Demo mode only changes via a full page reload, so nothing to subscribe to.
const noopSubscribe = () => () => {};

const FashionCarousel = () => {
  // isDemoMode() reads localStorage; the server snapshot keeps SSR and
  // hydration identical, then the client value takes over.
  const demo = useSyncExternalStore(
    noopSubscribe,
    isDemoMode,
    () => DEMO_MODE_DEFAULT
  );

  return (
    <div className="w-full py-10 px-3 md:px-0">
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet !bg-gray-100 !opacity-100",
          bulletActiveClass: "swiper-pagination-bullet-active !bg-gray-600",
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="w-full h-full rounded-lg md:rounded-none"
      >
        {FASHION_CAROUSEL_SLIDES?.map((slide) => (
          <SwiperSlide key={slide?.id} className="w-full">
            <div className="relative w-full h-[220px] md:h-[600px] lg:h-[700px] rounded-lg md:rounded-none">
              <img
                src={slideImage(slide, demo)}
                alt={slide?.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-lg md:rounded-none">
                <div className="text-center px-4 max-w-3xl">
                  <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-2 sm:mb-4">
                    {slide?.title}
                  </h2>
                  <p className="sm:text-xl md:text-2xl text-white mb-4 sm:mb-8">
                    {slide?.subtitle}
                  </p>

                  <Link
                    href={slide?.href || "/fashion-lifestyle"}
                    className="inline-flex items-center px-3 sm:px-6 py-1.5 sm:py-2.5 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-100 hover:border-gray-400 transition-colors">
                    {slide?.cta}
                    <svg
                      className="ml-2 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FashionCarousel;
