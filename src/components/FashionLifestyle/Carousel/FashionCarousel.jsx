"use client";

import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import Image from "next/image";
import { useSyncExternalStore } from "react";
import { HiArrowRight } from "react-icons/hi";
import { Pagination, Autoplay } from "swiper/modules";
import { DEMO_MODE_DEFAULT, isDemoMode } from "@/demo/demoMode";
import { FASHION_IMAGE_URL } from "@/api-endpoints/env";
import { FASHION_CAROUSEL_SLIDES } from "../utils/constants";
import { FASHION_CONTAINER } from "../shared/FashionSection";

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
    <div className={`${FASHION_CONTAINER} pt-4 md:pt-6`}>
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{
          clickable: true,
          bulletClass:
            "swiper-pagination-bullet !h-1.5 !w-1.5 !rounded-full !bg-[#FFFFFF]/60 !opacity-100 !transition-all",
          bulletActiveClass:
            "swiper-pagination-bullet-active !w-6 !bg-[#FFFFFF]",
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="w-full overflow-hidden rounded-2xl bg-gray-100"
      >
        {FASHION_CAROUSEL_SLIDES?.map((slide, index) => (
          <SwiperSlide key={slide?.id} className="w-full">
            <div className="relative h-[220px] w-full sm:h-[300px] md:h-[380px] lg:h-[460px]">
              <Image
                src={slideImage(slide, demo)}
                alt={slide?.title || "Fashion banner"}
                fill
                sizes="(min-width: 1312px) 1248px, 100vw"
                priority={index === 0}
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/0 sm:from-black/60 sm:via-black/25" />

              <div className="absolute inset-0 flex items-center">
                <div className="max-w-[85%] px-6 sm:max-w-md sm:px-10 lg:max-w-xl lg:px-16">
                  {slide?.subtitle && (
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FFFFFF]/80 sm:text-xs">
                      {slide.subtitle}
                    </p>
                  )}
                  <h2 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-[#FFFFFF] sm:text-4xl lg:text-5xl">
                    {slide?.title}
                  </h2>

                  <Link
                    href={slide?.href || "/fashion-lifestyle"}
                    className="group mt-4 inline-flex h-10 items-center gap-2 rounded-full bg-[#FFFFFF] px-5 text-sm font-semibold text-[#111827] shadow-sm transition-colors hover:bg-[#F3F4F6] sm:mt-6 sm:h-11 sm:px-6"
                  >
                    {slide?.cta}
                    <HiArrowRight className="transition-transform group-hover:translate-x-0.5" />
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
