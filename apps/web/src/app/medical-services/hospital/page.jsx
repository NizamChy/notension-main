import React from "react";
import HospitalSection from "@/components/MedicalServices/HospitalSection/HospitalSection";
import { MedicalPageHeader } from "@/components/MedicalServices/Layout/MedicalLayout";

const page = () => {
  return (
    <>
      <MedicalPageHeader
        title="Find a hospital"
        subtitle="Browse hospitals in your district, or find the one closest to you."
        back="/medical-services"
        backLabel="Medical services"
      />
      <HospitalSection />
    </>
  );
};

export default page;
