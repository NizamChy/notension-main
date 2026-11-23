"use client";

import React, { type ReactNode } from "react";
import { useFindDoctor } from "@/hooks/healthCare/useDoctors";
import DoctorCarousel from "./DoctorCarousel";

type Props = {
  startValue?: number;
  endValue?: number;
  title?: ReactNode;
  subtitle?: ReactNode;
};

const PopularDoctorSlider = ({
  startValue = 0,
  endValue = 5,
  title,
  subtitle,
}: Props) => {
  const { popularDoctors, isLoading } = useFindDoctor();

  // The page shows a single loader while doctor data loads.
  if (isLoading || !(popularDoctors?.length > startValue)) return null;

  return (
    <DoctorCarousel
      doctors={popularDoctors.slice(startValue, endValue)}
      title={title}
      subtitle={subtitle}
    />
  );
};

export default PopularDoctorSlider;
