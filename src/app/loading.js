"use client";
import Loader from "@/components/common/Loader";
import RoundLoader from "@/utils/round-loader";
import SingleRoundLoader from "@/utils/single-round-loader";
import React from "react";

const loading = () => {
  return (
    <div className="min-h-[100vh] flex justify-center items-center">
      {/* <Loader /> */}
      <RoundLoader />
      {/* <SingleRoundLoader /> */}
    </div>
  );
};

export default loading;
