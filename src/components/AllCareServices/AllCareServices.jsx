import React from "react";
import Image from "next/image";
import { HiArrowRight } from "react-icons/hi";
import {
  HiOutlineCheckBadge,
  HiOutlineStar,
  HiOutlinePhone,
} from "react-icons/hi2";

const HIGHLIGHTS = [
  { icon: HiOutlineCheckBadge, label: "Verified local providers" },
  { icon: HiOutlineStar, label: "Real ratings & reviews" },
  { icon: HiOutlinePhone, label: "Call or WhatsApp directly" },
];

// All Care landing hero.
const AllCareServices = () => {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white bg-gradient-to-br from-[#0C3F8E]/[0.07] via-transparent to-[#EB5C2F]/[0.07]">
      <div className="grid items-center gap-8 p-5 sm:p-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:p-12">
        <div className="text-center lg:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#EB5C2F] md:text-sm">
            NoTension All Care
          </p>
          <h1 className="mt-2 text-[28px] font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            Trusted experts for every job,{" "}
            <span className="text-[#0C3F8E] dark:text-[#7FB2FF]">
              right in your area
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-gray-500 md:text-base lg:mx-0 lg:text-lg">
            Find top-rated electricians, tutors, cleaners, movers and more.
            Compare reviews, check service hours and contact providers with
            confidence, all in one place.
          </p>

          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <a
              href="#all-care-services"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#0C3F8E] px-6 text-sm font-semibold text-white shadow-sm shadow-[#0C3F8E]/20 transition-colors hover:bg-[#0A3478] sm:w-auto"
            >
              Browse services
              <HiArrowRight aria-hidden="true" />
            </a>
          </div>

          <ul className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 lg:justify-start">
            {HIGHLIGHTS.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 sm:text-sm"
              >
                <Icon
                  aria-hidden="true"
                  className="text-base text-[#12B76A] sm:text-lg"
                />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[480px]">
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-[#FFFFFF] shadow-xl shadow-gray-900/10 ring-1 ring-gray-200">
            <Image
              src="/images/all-care-services/all-care-service-banner.jpg"
              alt="Service professionals ready to help"
              fill
              sizes="(min-width: 1024px) 480px, (min-width: 640px) 400px, 320px"
              className="object-cover"
              preload
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AllCareServices;
