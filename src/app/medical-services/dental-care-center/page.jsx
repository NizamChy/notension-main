import React from "react";
import DentalCareCenter from "@/components/MedicalServices/DentalCareCenter/DentalCareCenter";
import { MedicalPageHeader } from "@/components/MedicalServices/Layout/MedicalLayout";

const page = () => {
  return (
    <>
      <MedicalPageHeader
        title="Find a dental care centre"
        subtitle="Dentists and dental clinics for check-ups, cleaning and treatment."
        back="/medical-services"
        backLabel="Medical services"
      />
      <DentalCareCenter />
    </>
  );
};

export default page;
