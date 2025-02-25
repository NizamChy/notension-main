import React from "react";
import Image from "next/image";

const ServicesArea = ({
  gridClassName = "grid grid-cols-2 xl:grid-cols-4 gap-2 md:gap-5 justify-center items-center",
  imageWidth = 600,
  imageHeight = 300,
  bgClassName = "bg-[#F3F7FB]",
}) => {
  const images = [
    "/images/all-care-services/banking-services-1.jpg",
    "/images/all-care-services/banking-services-2.jpg",
  ];

  return (
    <div className="py-20">
      <div
        className={`flex justify-center p-4 lg:p-20 ${bgClassName} rounded-md`}
      >
        <div>
          <p className="md:text-2xl font-semibold pb-5 text-[#0C3F8E] text-center">
            Your Trusted Partner for Every Service
          </p>

          <div className={gridClassName}>
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="lg:m-3 cursor-pointer">
                <Image
                  className="rounded-md shadow-lg"
                  src="/images/all-care-services/banking-services-2.jpg"
                  alt="Services Area"
                  width={imageWidth}
                  height={imageHeight}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesArea;
