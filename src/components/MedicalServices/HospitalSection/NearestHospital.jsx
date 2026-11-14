"use client";

import React from "react";
import NearestCenterListing from "../Layout/NearestCenterListing";

const NearestHospital = () => (
  <NearestCenterListing
    centerType="Hospital"
    title="Hospitals near you"
    back="/medical-services/hospital"
    backLabel="All hospitals"
  />
);

export default NearestHospital;
