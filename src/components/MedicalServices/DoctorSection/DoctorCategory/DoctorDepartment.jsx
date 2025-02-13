"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Loader from "@/components/common/Loader";
import { useDispatch, useSelector } from "react-redux";
import { handleDoctorReducer } from "@/redux/doctorReducer";
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
  const router = useRouter();
  const dispatch = useDispatch();

  const { allDeptInfo, isLoading } = useSelector((state) => state.doctorInfo);

  const handleDeptClick = (e, dept) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(
      handleDoctorReducer({
        type: "SAVE_CURRENT_DEPT_INFO",
        data: dept,
      })
    );

    router.push(`/medical-services/doctor/dept/${dept?._id}`);
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {allDeptInfo.length > sliceStart ? (
            <div
              className={`flex justify-center p-4 lg:p-20 ${bgClassName} rounded-md`}
            >
              <div>
                <p className="md:text-2xl font-semibold pb-5 text-[#0C3F8E]">
                  বিভাগ অনুযায়ী ডাক্তার খুঁজুন
                </p>

                <div className={gridClassName}>
                  {allDeptInfo?.slice(sliceStart, sliceEnd)?.map((dept) => (
                    <div
                      key={dept?._id}
                      onClick={(e) => handleDeptClick(e, dept)}
                      className="lg:m-3 cursor-pointer"
                    >
                      <Image
                        src={`${HEALTH_CARE_IMAGES}/${dept?.[imageKey]}`}
                        alt={`${dept?.dept_name}`}
                        width={imageWidth}
                        height={imageHeight}
                        className="rounded-md shadow-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </>
      )}
    </>
  );
};

export default DoctorDepartment;
