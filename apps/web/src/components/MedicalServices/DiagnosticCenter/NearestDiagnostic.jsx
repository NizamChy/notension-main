"use client";

import React from "react";
import NearestCenterListing from "../Layout/NearestCenterListing";

const NearestDiagnostic = () => (
  <NearestCenterListing
    centerType="Diagnostic Centre"
    title="Diagnostic centres near you"
    back="/medical-services/diagnostic"
    backLabel="All diagnostic centres"
  />
);

export default NearestDiagnostic;
