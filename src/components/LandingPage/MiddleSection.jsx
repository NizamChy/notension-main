"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import HomeSlider from "./HomeSlider";

const MiddleSection = () => {
  return (
    <div className="lg:flex gap-4">
      <Link href="/medical-services/medical-service">
        <div className="group overflow-hidden relative mb-4 lg:mb-0">
          <Image
            width={632}
            height={300}
            className="w-full transition-transform duration-300 group-hover:scale-105"
            src="/images/home/find-medical-services.jpg"
            alt="find-medical-services.jpg"
          />

          <div className="absolute bottom-3 left-4 md:bottom-10 md:left-8">
            <h3
              className="text-sm md:text-2xl font-semibold tracking-widest text-gray-500
            "
            >
              Find Medical Services
            </h3>
            <p className="text-xs md:text-base tracking-wider font-semibold text-gray-500">
              + Contact Now
            </p>
          </div>
        </div>
      </Link>

      <HomeSlider />
    </div>
  );
};

export default MiddleSection;
