"use client";

import "swiper/css";
import "swiper/css/navigation";
import React, { useRef } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { GrPrevious, GrNext } from "react-icons/gr";
import PopularDoctorSliderCard from "./PopularDoctorSliderCard";
import { MedicalSectionTitle } from "../../Layout/MedicalLayout";

const arrowClass =
  "hidden md:flex absolute top-1/2 z-10 -translate-y-1/2 size-9 items-center justify-center rounded-full bg-white border border-gray-200 shadow-md text-[#0C3F8E] hover:bg-primary hover:text-white transition-colors duration-300 disabled:opacity-40 [&.swiper-button-lock]:!hidden";

// Horizontal list of doctor cards with per-instance arrows. The Swiper is a
// plain full-width block (not a shrink-wrapped flex item), so it always
// measures the real container width and never collapses its slides.
const DoctorCarousel = ({
  doctors,
  isVisited = false,
  title = "জনপ্রিয় বিশেষজ্ঞ",
}) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  if (!doctors?.length) return null;

  return (
    <section>
      <MedicalSectionTitle>{title}</MedicalSectionTitle>

      <div className="relative md:px-12">
        <button
          ref={prevRef}
          type="button"
          aria-label="Previous doctors"
          className={`${arrowClass} left-0`}
        >
          <GrPrevious />
        </button>

        <button
          ref={nextRef}
          type="button"
          aria-label="Next doctors"
          className={`${arrowClass} right-0`}
        >
          <GrNext />
        </button>

        <Swiper
          slidesPerView={1.1}
          spaceBetween={16}
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
            1024: { slidesPerView: 2, spaceBetween: 24 },
            1280: { slidesPerView: 3, spaceBetween: 24 },
          }}
          modules={[Navigation]}
          className="w-full !py-1"
        >
          {doctors.map((doctor) => (
            <SwiperSlide key={doctor?._id} className="!h-auto">
              <PopularDoctorSliderCard doctor={doctor} isVisited={isVisited} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default DoctorCarousel;
