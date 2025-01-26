import React from "react";
import DiagnosticCenter from "@/components/MedicalServices/DiagnosticCenter/DiagnosticCenter";

const page = () => {
  return (
    <>
      <p className="text-center mt-2 md:mt-0 py-3 lg:text-xl text-primaryFood bg-[#FFF1EA]">
        Find Diagnostic Center
      </p>

      <DiagnosticCenter />
    </>
  );
};

export default page;
