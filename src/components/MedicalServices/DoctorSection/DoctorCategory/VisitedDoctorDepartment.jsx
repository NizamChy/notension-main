"use client";

import React from "react";
import { useRouter } from "next/navigation";
import DepartmentGrid from "./DepartmentGrid";
import { useDispatch, useSelector } from "react-redux";
import { handleDoctorReducer } from "@/redux/doctorReducer";

const VisitedDoctorDepartment = ({
  sliceStart = 0,
  sliceEnd = 12,
  imageWidth = 300,
  imageHeight = 300,
  imageKey = "banner_1",
  bgClassName = "bg-[#F3F7FB]",
  allDeptInfo,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { currentCenter } = useSelector((state) => state.doctorInfo);

  const handleDeptClick = (e, dept) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(
      handleDoctorReducer({
        type: "SAVE_CURRENT_DEPT_INFO",
        data: dept?.deptInfo,
      })
    );

    router.push(
      `/medical-services/doctor/dept/${dept?.deptInfo?._id}/center/${currentCenter?._id}`
    );
  };

  if (!(allDeptInfo?.length > sliceStart)) return null;

  return (
    <DepartmentGrid
      items={allDeptInfo?.slice(sliceStart, sliceEnd)}
      getImage={(dept) => dept?.deptInfo?.[imageKey]}
      getName={(dept) => dept?.deptInfo?.dept_name || dept?.dept_name}
      onSelect={handleDeptClick}
      imageWidth={imageWidth}
      imageHeight={imageHeight}
      bgClassName={bgClassName}
    />
  );
};

export default VisitedDoctorDepartment;
