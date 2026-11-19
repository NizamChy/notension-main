"use client";

import React from "react";
import NearestCenterListing from "../../Layout/NearestCenterListing";

const NearestConsultationCenter = () => (
  <NearestCenterListing
    centerType="Consultation Center"
    title="Consultation centres near you"
    back="/medical-services/doctor/consultation-center"
    backLabel="All consultation centres"
  />
);

export default NearestConsultationCenter;
