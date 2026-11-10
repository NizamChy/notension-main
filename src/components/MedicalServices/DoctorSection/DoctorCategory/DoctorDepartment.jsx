"use client";

import React from "react";
import { useRouter } from "next/navigation";
import DepartmentGrid from "./DepartmentGrid";
import { useDispatch, useSelector } from "react-redux";
import { handleDoctorReducer } from "@/redux/doctorReducer";

const DoctorDepartment = ({
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

  // The page shows a single loader while doctor data loads.
  if (isLoading || !(allDeptInfo?.length > sliceStart)) return null;

  return (
    <DepartmentGrid
      items={allDeptInfo?.slice(sliceStart, sliceEnd)}
      getImage={(dept) => dept?.[imageKey]}
      getName={(dept) => dept?.dept_name}
      onSelect={handleDeptClick}
      imageWidth={imageWidth}
      imageHeight={imageHeight}
      bgClassName={bgClassName}
    />
  );
};

export default DoctorDepartment;
