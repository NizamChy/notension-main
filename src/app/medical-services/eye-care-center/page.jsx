import React from "react";
import EyeCareCenter from "@/components/MedicalServices/EyeCareCenter/EyeCareCenter";
import { MedicalPageHeader } from "@/components/MedicalServices/Layout/MedicalLayout";

const page = () => {
  return (
    <>
      <MedicalPageHeader title="Find Eye Care Center" />
      <EyeCareCenter />
    </>
  );
};

export default page;
