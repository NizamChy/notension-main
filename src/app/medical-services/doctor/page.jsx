import React from "react";
import DoctorHome from "@/components/MedicalServices/DoctorSection/DoctorHome/DoctorHome";
import { MedicalPageHeader } from "@/components/MedicalServices/Layout/MedicalLayout";

const page = () => {
  return (
    <>
      <MedicalPageHeader
        title="Find a doctor"
        subtitle="Search by department, location or chamber and book your serial online."
        back="/medical-services"
        backLabel="Medical services"
      />
      <DoctorHome />
    </>
  );
};

export default page;
