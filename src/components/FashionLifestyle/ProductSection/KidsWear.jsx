"use client";

import React from "react";
import { KIDS_TYPE_ID } from "../utils/constants";
import PopularTypeSection from "./PopularTypeSection";

const KidsWear = () => (
  <PopularTypeSection
    typeId={KIDS_TYPE_ID}
    title="Kid's Wear"
    errorText="Failed to load kids products"
  />
);

export default KidsWear;
