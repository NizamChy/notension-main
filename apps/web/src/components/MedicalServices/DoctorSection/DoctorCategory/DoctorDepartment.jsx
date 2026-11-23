"use client";

import React from "react";
import { useRouter } from "next/navigation";
import DepartmentGrid from "./DepartmentGrid";
import { useFindDoctor } from "@/hooks/healthCare/useDoctors";

const DoctorDepartment = ({
  sliceStart = 0,
  sliceEnd = 12,
  imageWidth = 300,
  imageHeight = 300,
  imageKey = "banner_1",
  title,
  subtitle,
}) => {
  const router = useRouter();

  const { departments: allDeptInfo, isLoading } = useFindDoctor();

  const handleDeptClick = (e, dept) => {
    e.preventDefault();
    e.stopPropagation();

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
      title={title}
      subtitle={subtitle}
    />
  );
};

export default DoctorDepartment;
