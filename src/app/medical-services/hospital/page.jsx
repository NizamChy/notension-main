import React from "react";
import HospitalSection from "@/components/MedicalServices/HospitalSection/HospitalSection";
import { MedicalPageHeader } from "@/components/MedicalServices/Layout/MedicalLayout";

const page = () => {
  return (
    <>
      <MedicalPageHeader title="Find Hospital" />
      <HospitalSection />
    </>
  );
};

export default page;
