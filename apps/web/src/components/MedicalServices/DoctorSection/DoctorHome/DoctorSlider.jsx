"use client";

import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import DoctorCommonSlider from "../DoctorCommonSlider/DoctorCommonSlider";

const DoctorSlider = () => {
  const [slider, setSlider] = useState([]);
  const { findDoctorBanner } = useSelector((state) => state.doctorInfo);

  useEffect(() => {
    if (findDoctorBanner && findDoctorBanner.length > 2) {
      setSlider(findDoctorBanner.slice(0, findDoctorBanner.length - 2));
    }
  }, [findDoctorBanner]);

  return (
    <>
      <DoctorCommonSlider slider={slider} />
    </>
  );
};

export default DoctorSlider;
