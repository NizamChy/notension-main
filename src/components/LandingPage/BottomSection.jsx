import React from "react";
import Image from "next/image";
import Link from "next/link";

const BottomSection = () => {
  return (
    <div className="flex lg:gap-4">
      <Link
        href="https://play.google.com/store/apps/details?id=com.bitsnotension"
        prefetch={false}
        target="_blank"
      >
        <div className="group overflow-hidden relative">
          <Image
            width={416}
            height={350}
            className="transition-transform duration-300 group-hover:scale-105"
            src="/images/home/home-banner-9.webp"
            alt="home-banner-9"
          />

          <div className="absolute bottom-0 left-0.5 md:bottom-10 md:left-8">
            <h3 className="text-xs md:text-2xl font-semibold tracking-widest text-gray-500">
              Find <br className="md:hidden" /> Nurse
            </h3>
            <p className="text-[9px] md:text-base tracking-wider font-semibold text-gray-500">
              + Contact <br className="md:hidden" />{" "}
              <span className="ps-3 md:ps-0">Now</span>
            </p>
          </div>
        </div>
      </Link>

      <Link
        href="https://play.google.com/store/apps/details?id=com.bitsnotension"
        prefetch={false}
        target="_blank"
      >
        <div className="group overflow-hidden relative">
          <Image
            width={416}
            height={350}
            className="transition-transform duration-300 group-hover:scale-105"
            src="/images/home/home-banner-10.webp"
            alt="home-banner-10"
          />

          <div className="absolute bottom-0 left-1 md:bottom-10 md:left-8">
            <h3 className="text-xs md:text-2xl font-semibold tracking-widest text-gray-500">
              Find Ambulance
            </h3>
            <p className="text-[9px] md:text-base tracking-wider font-semibold text-gray-500">
              + Contact Now
            </p>
          </div>
        </div>
      </Link>

      <Link
        href="https://play.google.com/store/apps/details?id=com.bitsnotension"
        prefetch={false}
        target="_blank"
      >
        <div className="group overflow-hidden relative">
          <Image
            width={416}
            height={350}
            className="transition-transform duration-300 group-hover:scale-105"
            src="/images/home/home-banner-11.webp"
            alt="home-banner-11"
          />

          <div className="absolute bottom-0 left-1 md:bottom-10 md:left-8">
            <h3 className="text-xs md:text-2xl font-semibold tracking-widest text-gray-500">
              Find Blood Donar
            </h3>
            <p className="text-[9px] md:text-base tracking-wider font-semibold text-gray-500">
              + Contact Now
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BottomSection;
