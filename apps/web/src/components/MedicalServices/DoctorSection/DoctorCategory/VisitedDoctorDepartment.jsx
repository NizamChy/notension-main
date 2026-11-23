"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import DepartmentGrid from "./DepartmentGrid";

const VisitedDoctorDepartment = ({
  sliceStart = 0,
  sliceEnd = 12,
  imageWidth = 300,
  imageHeight = 300,
  imageKey = "banner_1",
  title,
  subtitle,
  allDeptInfo,
}) => {
  const router = useRouter();
  // The centre page this grid sits on.
  const centerId = useParams()?.id;

  const handleDeptClick = (e, dept) => {
    e.preventDefault();
    e.stopPropagation();

    router.push(
      `/medical-services/doctor/dept/${dept?.deptInfo?._id}/center/${centerId}`
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
      title={title}
      subtitle={subtitle}
    />
  );
};

export default VisitedDoctorDepartment;
