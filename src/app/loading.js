"use client";

import React from "react";
import RoundLoader from "@/utils/round-loader";
// import Loader from "@/components/common/Loader";
// import SingleRoundLoader from "@/utils/single-round-loader";

const loading = () => {
  return (
    <div
      className="fixed inset-0 z-50 bg-white flex justify-center items-center"
      // className="min-h-[100vh] flex justify-center items-center"
    >
      <RoundLoader />
      {/* <Loader /> */}
      {/* <SingleRoundLoader /> */}
    </div>
  );
};

export default loading;
