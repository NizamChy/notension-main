"use client";

import React from "react";
import CenterDistrictListing from "../Layout/CenterDistrictListing";

const DiagnosticCenter = () => {
  return (
    <CenterDistrictListing
      centerType="Diagnostic Centre"
      heroHref="/medical-services/diagnostic/nearest-diagnostic-center"
      heroImage="/images/medical-services/find-near-diagnostic-center.jpg"
      heroAlt="Find nearest diagnostic center"
    />
  );
};

export default DiagnosticCenter;
