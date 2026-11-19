import React from "react";
import EyeCareCenter from "@/components/MedicalServices/EyeCareCenter/EyeCareCenter";
import { MedicalPageHeader } from "@/components/MedicalServices/Layout/MedicalLayout";

const page = () => {
  return (
    <>
      <MedicalPageHeader
        title="Find an eye care centre"
        subtitle="Eye specialists and clinics for vision tests and treatment."
        back="/medical-services"
        backLabel="Medical services"
      />
      <EyeCareCenter />
    </>
  );
};

export default page;
