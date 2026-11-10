import React from "react";
import Image from "next/image";

const AllCareServices = () => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
        <div className="space-y-4 md:space-y-5">
          <h1 className="text-center lg:text-start text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight font-semibold text-primary">
            Choose Experts <br /> to Complete Your <br />{" "}
            <span className="text-[#F78F1E]">Work</span> Done
          </h1>

          <p className="text-center lg:text-start text-sm md:text-base lg:text-xl text-mediumGray max-w-xl mx-auto lg:mx-0">
            Explore{" "}
            <span className="text-primary font-medium">
              Notension All Care Service
            </span>{" "}
            to find top-rated professionals in your area. Compare reviews, check
            availability, and book services with confidence -all in one place.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-[320px] sm:max-w-[420px] lg:max-w-[520px]">
            <Image
              src="/images/all-care-services/all-care-service-banner.jpg"
              alt="all-care-service-banner.jpg"
              width={600}
              height={600}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>

      {/* <div className="pt-10">
        <Image
          className="rounded-xl"
          src="/images/all-care-services/join-us-provider-banner.jpg"
          alt="join-us-provider-banner.jpg"
          width={1875}
          height={417}
        />
      </div> */}
    </>
  );
};

export default AllCareServices;
