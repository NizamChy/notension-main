"use client";

import "swiper/css";
import React, { useState } from "react";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { SectionTitle } from "@/components/shared/UI/UI";
import NearestInfoCard from "./NearestInfoCard";
import { SLIDER_ARROW } from "./ServicesSlider";

// Top-rated providers in the district, as a swipeable row of cards.
const PopularInfoSlider = ({ slider }) => {
  // Each slider binds its own arrow elements (no shared DOM ids).
  const [prevEl, setPrevEl] = useState(null);
  const [nextEl, setNextEl] = useState(null);

  if (!(slider?.length > 0)) return null;

  return (
    <section>
      <SectionTitle
        title="Popular providers"
        subtitle="Top-rated by customers in your area"
      />

      <div className="relative">
        <button
          type="button"
          aria-label="Previous providers"
          className={`${SLIDER_ARROW} left-0 -translate-x-1/2`}
          ref={setPrevEl}
        >
          <HiChevronLeft aria-hidden="true" />
        </button>

        <button
          type="button"
          aria-label="Next providers"
          className={`${SLIDER_ARROW} right-0 translate-x-1/2`}
          ref={setNextEl}
        >
          <HiChevronRight aria-hidden="true" />
        </button>

        <Swiper
          slidesPerView={1.15}
          spaceBetween={12}
          loop={slider?.length >= 6}
          rewind={slider?.length < 6}
          navigation={{ prevEl, nextEl }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 16,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
          }}
          modules={[Navigation]}
          // Bottom padding keeps the cards' hover shadow from being clipped.
          className="w-full !pb-2"
        >
          {slider?.map((provider) => (
            <SwiperSlide key={provider?._id} className="!h-auto pt-1">
              <NearestInfoCard provider={provider} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default PopularInfoSlider;
