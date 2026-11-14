"use client";

import "swiper/css";
import "swiper/css/navigation";
import React, { useRef } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import PopularDoctorSliderCard from "./PopularDoctorSliderCard";
import { MedicalSectionTitle } from "../../Layout/MedicalLayout";

const arrowClass =
  "flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40 [&.swiper-button-lock]:!hidden";

// Horizontal list of doctor cards with per-instance arrows in the section
// header. The Swiper is a plain full-width block (not a shrink-wrapped flex
// item), so it always measures the real container width and never collapses
// its slides.
const DoctorCarousel = ({
  doctors,
  isVisited = false,
  title = "Popular specialists",
  subtitle = "জনপ্রিয় বিশেষজ্ঞ",
}) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  if (!doctors?.length) return null;

  return (
    <section>
      <MedicalSectionTitle
        subtitle={subtitle}
        action={
          <div className="hidden items-center gap-2 sm:flex">
            <button
              ref={prevRef}
              type="button"
              aria-label="Previous doctors"
              className={arrowClass}
            >
              <LuChevronLeft className="text-lg" />
            </button>
            <button
              ref={nextRef}
              type="button"
              aria-label="Next doctors"
              className={arrowClass}
            >
              <LuChevronRight className="text-lg" />
            </button>
          </div>
        }
      >
        {title}
      </MedicalSectionTitle>

      <Swiper
        slidesPerView={1.12}
        spaceBetween={12}
        rewind={true}
        navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
        onBeforeInit={(swiper) => {
          // Refs are attached before Swiper initialises, so bind the
          // arrows here instead of relying on the first-render values.
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 16 },
          1024: { slidesPerView: 3, spaceBetween: 20 },
          1280: { slidesPerView: 3, spaceBetween: 20 },
        }}
        modules={[Navigation]}
        className="w-full !px-0.5 !py-1"
      >
        {doctors.map((doctor) => (
          <SwiperSlide key={doctor?._id} className="!h-auto">
            <PopularDoctorSliderCard doctor={doctor} isVisited={isVisited} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default DoctorCarousel;
