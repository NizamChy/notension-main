"use client";

import React from "react";
import { useFindDoctor } from "@/hooks/healthCare/useDoctors";
import DoctorCommonSlider from "../DoctorCommonSlider/DoctorCommonSlider";

const DoctorSlider = () => {
  const { findDoctorBanner } = useFindDoctor();
  // The last two banners are the shortcut tiles (DoctorNav).
  const slider =
    findDoctorBanner.length > 2 ? findDoctorBanner.slice(0, findDoctorBanner.length - 2) : [];

  return (
    <>
      <DoctorCommonSlider slider={slider} />
    </>
  );
};

export default DoctorSlider;
