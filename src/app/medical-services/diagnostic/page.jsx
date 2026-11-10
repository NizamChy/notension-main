import React from "react";
import DiagnosticCenter from "@/components/MedicalServices/DiagnosticCenter/DiagnosticCenter";
import { MedicalPageHeader } from "@/components/MedicalServices/Layout/MedicalLayout";

const page = () => {
  return (
    <>
      <MedicalPageHeader title="Find Diagnostic Center" />
      <DiagnosticCenter />
    </>
  );
};

export default page;
