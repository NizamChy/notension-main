"use client";

import React from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { HEALTH_CARE_IMAGES } from "@/api-endpoints/api-endpoint";

const FourthDoctorCategory = () => {
  const images = [
    "/images/medical-services/doc-cat4-img1.jpg",
    "/images/medical-services/doc-cat4-img2.jpg",
    "/images/medical-services/doc-cat4-img3.jpg",
    "/images/medical-services/doc-cat4-img4.jpg",
    "/images/medical-services/doc-cat4-img5.jpg",
    "/images/medical-services/doc-cat4-img6.jpg",
    "/images/medical-services/doc-cat4-img7.jpg",
    "/images/medical-services/doc-cat4-img8.jpg",
    "/images/medical-services/doc-cat4-img9.jpg",
  ];

  const allDeptInfo = useSelector((state) => state.doctorInfo.allDeptInfo);

  return (
    <div className="flex justify-center p-4 lg:p-20 bg-[#F2FCE4]">
      <div>
        <p className="md:text-2xl font-semibold pb-5 text-deepGray">
          বিভাগ অনুযায়ী ডাক্তার খুঁজুন
        </p>

        <div className="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2 md:gap-5 justify-center items-center">
          {allDeptInfo.slice(20, 29).map((image) => (
            <div key={image?._id} className="lg:m-5">
              <Image
                src={`${HEALTH_CARE_IMAGES}/${image?.banner_1}`}
                alt={`${image?.dept_name}`}
                width={300}
                height={300}
                className="rounded-md shadow-lg"
              />
            </div>
          ))}
        </div>

        {/* <div className="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2 md:gap-5 justify-center items-center">
          {images.map((image, index) => (
            <div key={index} className="lg:m-5">
              <Image
                src={image}
                alt={`Doctor category ${index + 1}`}
                width={300}
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

export default FourthDoctorCategory;
