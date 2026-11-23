"use client";

import React, { type ReactNode } from "react";
import type { Chamber } from "@/lib/api/healthCare";
import DoctorCarousel from "./DoctorCarousel";

type Props = {
  popularDoctors: Chamber[];
  startValue?: number;
  endValue?: number;
  title?: ReactNode;
  subtitle?: ReactNode;
};

const VisitedPopularDoctorSlider = ({
  popularDoctors,
  startValue = 0,
  endValue = 5,
  title,
  subtitle,
}: Props) => {
  if (!(popularDoctors?.length > startValue)) return null;

  return (
    <DoctorCarousel
      doctors={popularDoctors.slice(startValue, endValue)}
      isVisited={true}
      title={title}
      subtitle={subtitle}
    />
  );
};

export default VisitedPopularDoctorSlider;
