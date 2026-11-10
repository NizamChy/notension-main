"use client";

import React from "react";
import DoctorInfoCard from "../DoctorCard/DoctorInfoCard";

// Same card (and click behaviour) as the doctor grids, so sliders and grids
// look identical.
const PopularDoctorSliderCard = ({ doctor, isVisited = false }) => {
  return <DoctorInfoCard doctor={doctor} isVisited={isVisited} />;
};

export default PopularDoctorSliderCard;
