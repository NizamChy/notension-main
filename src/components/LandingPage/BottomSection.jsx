import React from "react";
import Image from "next/image";

const BottomSection = () => {
  return (
    <div className="flex gap-4">
      <div className="group overflow-hidden relative">
        <Image
          width={416}
          height={350}
          className="transition-transform duration-300 group-hover:scale-105"
          src="/images/home/home-banner-9.webp"
          alt="home-banner-9"
        />

        <div className="absolute bottom-10 left-8">
          <h3 className="text-xl md:text-2xl font-semibold tracking-widest text-gray-500">
            Find Nurse
          </h3>
          <p className="text-xs md:text-base tracking-wider font-semibold text-gray-500">
            + Contact Now
          </p>
        </div>
      </div>

      <div className="group overflow-hidden relative">
        <Image
          width={416}
          height={350}
          className="transition-transform duration-300 group-hover:scale-105"
          src="/images/home/home-banner-10.webp"
          alt="home-banner-10"
        />

        <div className="absolute bottom-10 left-8">
          <h3 className="text-xl md:text-2xl font-semibold tracking-widest text-gray-500">
            Find Ambulance
          </h3>
          <p className="text-xs md:text-base tracking-wider font-semibold text-gray-500">
            + Contact Now
          </p>
        </div>
      </div>

      <div className="group overflow-hidden relative">
        <Image
          width={416}
          height={350}
          className="transition-transform duration-300 group-hover:scale-105"
          src="/images/home/home-banner-11.webp"
          alt="home-banner-11"
        />

        <div className="absolute bottom-10 left-8">
          <h3 className="text-xl md:text-2xl font-semibold tracking-widest text-gray-500">
            Find Blood Donar
          </h3>
          <p className="text-xs md:text-base tracking-wider font-semibold text-gray-500">
            + Contact Now
          </p>
        </div>
      </div>
    </div>
  );
};

export default BottomSection;
