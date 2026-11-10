import React from "react";
import DentalCareCenter from "@/components/MedicalServices/DentalCareCenter/DentalCareCenter";
import { MedicalPageHeader } from "@/components/MedicalServices/Layout/MedicalLayout";

const page = () => {
  return (
    <>
      <MedicalPageHeader title="Find Dental Care Center" />
      <DentalCareCenter />
    </>
  );
};

export default page;
