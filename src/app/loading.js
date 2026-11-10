import React from "react";
import RoundLoader from "@/utils/round-loader";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 bg-white flex justify-center items-center">
      <RoundLoader />
    </div>
  );
};

export default Loading;
