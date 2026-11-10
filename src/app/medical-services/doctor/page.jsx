import React from "react";
import DoctorHome from "@/components/MedicalServices/DoctorSection/DoctorHome/DoctorHome";
import { MedicalPageHeader } from "@/components/MedicalServices/Layout/MedicalLayout";

const page = () => {
  return (
    <>
      <MedicalPageHeader title="Find Doctor" />
      <DoctorHome />
    </>
  );
};

export default page;
