import React from "react";
import Image from "next/image";

const AllCareServices = () => {
  return (
    <>
      <div className="lg:flex justify-between gap-10 items-center">
        <div className="lg:w-1/2 space-y-5 py-10 lg:p-10">
          <p className="text-center lg:text-start text-3xl lg:text-6xl font-semibold text-primary">
            Choose Experts <br /> to Complete Your <br />{" "}
            <span className="text-[#F78F1E]">Work</span> Done
          </p>

          <p className="text-center lg:text-start lg:text-xl text-mediumGray">
            Explore{" "}
            <span className="text-primary font-medium">
              Notension All Care Service
            </span>{" "}
            to find top-rated professionals in your area. Compare reviews, check
            availability, and book services with confidence -all in one place.
          </p>
        </div>

        <div className="lg:w-1/2 flex justify-center">
          <div>
            <Image
              src="/images/all-care-services/all-care-service-banner.jpg"
              alt="all-care-service-banner.jpg"
              width={600}
              height={600}
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
