"use client";

import React from "react";
import DoctorInfoCard, { type DoctorChamber } from "../DoctorCard/DoctorInfoCard";

type Props = {
  doctor: DoctorChamber;
  isVisited?: boolean;
};

// Same card (and click behaviour) as the doctor grids, so sliders and grids
// look identical.
const PopularDoctorSliderCard = ({ doctor, isVisited = false }: Props) => {
  return <DoctorInfoCard doctor={doctor} isVisited={isVisited} />;
};

export default PopularDoctorSliderCard;
