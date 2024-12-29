"use client";
import Loader from "@/components/common/Loader";
import React from "react";

const loading = () => {
  return (
    <div className="min-h-[100vh] flex justify-center items-center">
      <Loader />
    </div>
  );
};

export default loading;
