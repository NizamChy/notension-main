"use client";

import Image from "next/image";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDoctor } from "@/hooks/fetch-data/useDoctor";
import { HEALTH_CARE_IMAGES } from "@/api-endpoints/api-endpoint";
import Loader from "@/components/common/Loader";

const FirstDoctorCategory = () => {
  const images = [
    "/images/medical-services/doc-cat1-img1.jpg",
    "/images/medical-services/doc-cat1-img2.jpg",
    "/images/medical-services/doc-cat1-img3.jpg",
    "/images/medical-services/doc-cat1-img4.jpg",
    "/images/medical-services/doc-cat1-img5.jpg",
    "/images/medical-services/doc-cat1-img6.jpg",
    "/images/medical-services/doc-cat1-img7.jpg",
    "/images/medical-services/doc-cat1-img8.jpg",
    "/images/medical-services/doc-cat1-img9.jpg",
    "/images/medical-services/doc-cat1-img10.jpg",
    "/images/medical-services/doc-cat1-img11.jpg",
    "/images/medical-services/doc-cat1-img12.jpg",
  ];

  const { exploreFindDoctor } = useDoctor();

  const { allDeptInfo, isLoading } = useSelector((state) => state.doctorInfo);

  useEffect(() => {
    exploreFindDoctor();
  }, []);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex justify-center p-4 lg:p-20 bg-[#F3F7FB]">
          <div>
            <p className="md:text-2xl font-semibold pb-5 text-deepGray">
              বিভাগ অনুযায়ী ডাক্তার খুঁজুন
            </p>

            <div className="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2 md:gap-5 justify-center items-center">
              {allDeptInfo.slice(0, 12).map((image) => (
                <div key={image?._id} className="lg:m-3">
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
            <div key={index} className="lg:m-3">
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
      )}
    </>
  );
};

export default FirstDoctorCategory;
