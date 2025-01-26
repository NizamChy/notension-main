"use client";

import React from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import Loader from "@/components/common/Loader";
import { HEALTH_CARE_IMAGES } from "@/api-endpoints/api-endpoint";

const DoctorDepartment = ({
  gridClassName = "grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2 md:gap-5 justify-center items-center",
  sliceStart = 0,
  sliceEnd = 12,
  imageWidth = 300,
  imageHeight = 300,
  imageKey = "banner_1",
  bgClassName = "bg-[#F3F7FB]",
}) => {
  const { allDeptInfo, isLoading } = useSelector((state) => state.doctorInfo);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className={`flex justify-center p-4 lg:p-20 ${bgClassName}`}>
          <div>
            <p className="md:text-2xl font-semibold pb-5 text-[#0C3F8E]">
              বিভাগ অনুযায়ী ডাক্তার খুঁজুন
            </p>

            <div className={gridClassName}>
              {allDeptInfo?.slice(sliceStart, sliceEnd).map((image) => (
                <div key={image?._id} className="lg:m-3">
                  <Image
                    src={`${HEALTH_CARE_IMAGES}/${image?.[imageKey]}`}
                    alt={`${image?.dept_name}`}
                    width={imageWidth}
                    height={imageHeight}
                    className="rounded-md shadow-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DoctorDepartment;
