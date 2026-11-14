"use client";

import React from "react";
import { MEN_TYPE_ID } from "../utils/constants";
import PopularTypeSection from "./PopularTypeSection";

const MensWear = () => (
  <PopularTypeSection
    typeId={MEN_TYPE_ID}
    typeSlug="men"
    title="Men's wear"
    subtitle="Panjabis, shirts and everyday essentials"
    errorText="Failed to load mens products"
  />
);

export default MensWear;
