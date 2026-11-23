"use client";

import React, { type MouseEvent, type ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import DepartmentGrid from "./DepartmentGrid";
import type { CenterExplore } from "@/lib/api/healthCare";

// A centre's department row; the name falls back to a flat `dept_name`.
type CenterDept = CenterExplore["departmentsInfoByCenter"][number] & {
  dept_name?: string;
};

type Props = {
  sliceStart?: number;
  sliceEnd?: number;
  imageWidth?: number;
  imageHeight?: number;
  imageKey?: "banner_1" | "banner_2";
  title?: ReactNode;
  subtitle?: ReactNode;
  allDeptInfo: CenterDept[];
};

const VisitedDoctorDepartment = ({
  sliceStart = 0,
  sliceEnd = 12,
  imageWidth = 300,
  imageHeight = 300,
  imageKey = "banner_1",
  title,
  subtitle,
  allDeptInfo,
}: Props) => {
  const router = useRouter();
  // The centre page this grid sits on.
  const centerId = useParams<{ id?: string }>()?.id;

  const handleDeptClick = (e: MouseEvent<HTMLButtonElement>, dept: CenterDept) => {
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
