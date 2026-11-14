import React from "react";
import DiagnosticCenter from "@/components/MedicalServices/DiagnosticCenter/DiagnosticCenter";
import { MedicalPageHeader } from "@/components/MedicalServices/Layout/MedicalLayout";

const page = () => {
  return (
    <>
      <MedicalPageHeader
        title="Find a diagnostic centre"
        subtitle="Lab tests, imaging and check-ups at trusted centres near you."
        back="/medical-services"
        backLabel="Medical services"
      />
      <DiagnosticCenter />
    </>
  );
};

export default page;
