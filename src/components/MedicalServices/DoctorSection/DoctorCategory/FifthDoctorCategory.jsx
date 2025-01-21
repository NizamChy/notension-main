"use client";

import React from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { HEALTH_CARE_IMAGES } from "@/api-endpoints/api-endpoint";

const FifthDoctorCategory = () => {
  const images = [
    "/images/medical-services/doc-cat5-img1.jpg",
    "/images/medical-services/doc-cat5-img2.jpg",
    "/images/medical-services/doc-cat5-img3.jpg",
    "/images/medical-services/doc-cat5-img4.jpg",
  ];

  const allDeptInfo = useSelector((state) => state.doctorInfo.allDeptInfo);

  return (
    <div className="flex justify-center p-4 lg:p-20 bg-[#FFF3FF]">
      <div>
        <p className="md:text-2xl font-semibold pb-5 text-deepGray">
          বিভাগ অনুযায়ী ডাক্তার খুঁজুন
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-5 justify-center items-center">
          {allDeptInfo.slice(29, 33).map((image) => (
            <div key={image?._id} className="lg:m-3">
              <Image
                src={`${HEALTH_CARE_IMAGES}/${image?.banner_2}`}
                alt={`${image?.dept_name}`}
                width={600}
                height={300}
                className="rounded-md shadow-lg"
              />
            </div>
          ))}
        </div>

        {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-5 justify-center items-center">
          {images.map((image, index) => (
            <div key={index} className="lg:m-3">
              <Image
                src={image}
                alt={`Doctor category ${index + 1}`}
                width={600}
                height={300}
                className="rounded-md shadow-lg"
              />
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default FifthDoctorCategory;
