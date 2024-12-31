import React from "react";
import Image from "next/image";
import Link from "next/link";

const TopRightSection = () => {
  return (
    <div className="space-y-4">
      <Link href="/medicine/all">
        <div className="group overflow-hidden relative">
          <Image
            width={632}
            height={300}
            className="transition-transform duration-300 group-hover:scale-105"
            src="/images/home/home-banner-2.webp"
            alt="home-banner-2"
          />

          <div className="absolute bottom-10 left-8">
            <h3
              className="text-xl md:text-2xl font-semibold tracking-widest text-gray-500
            "
            >
              Medicine Store
            </h3>
            <p className="text-xs md:text-base tracking-wider font-semibold text-gray-500">
              + Order Now
            </p>
          </div>
        </div>
      </Link>

      <div className="flex justify-center gap-4">
        <Link href="/food">
          <div className="group overflow-hidden relative">
            <Image
              width={308}
              height={470}
              className="transition-transform duration-300 group-hover:scale-105"
              src="/images/home/home-banner-4.webp"
              alt="home-banner-4"
            />

            <div className="absolute bottom-10 left-8">
              <h3
                className="text-xl md:text-2xl font-semibold tracking-widest text-gray-500
            "
              >
                Biryani House
              </h3>
              <p className="text-xs md:text-base tracking-wider font-semibold text-gray-500">
                + Order Now
              </p>
            </div>
          </div>
        </Link>

        <Link href="/food">
          <div className="group overflow-hidden relative">
            <Image
              width={308}
              height={470}
              className="transition-transform duration-300 group-hover:scale-105"
              src="/images/home/home-banner-5.webp"
              alt="home-banner-5"
            />

            <div className="absolute bottom-10 left-8">
              <h3
                className="text-xl md:text-2xl font-semibold tracking-widest text-gray-500
            "
              >
                Find Restaurant
              </h3>
              <p className="text-xs md:text-base tracking-wider font-semibold text-gray-500">
                + Order Now
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default TopRightSection;
