import React from "react";
import ConsultationCenter from "@/components/MedicalServices/DoctorSection/ConsultationCenter/ConsultationCenter";
import { MedicalPageHeader } from "@/components/MedicalServices/Layout/MedicalLayout";

const page = () => {
  return (
    <>
      <MedicalPageHeader
        title="Find a doctor by consultation centre"
        subtitle="Choose a chamber to see the doctors who sit there."
        back="/medical-services/doctor"
        backLabel="Find a doctor"
      />
      <ConsultationCenter />
    </>
  );
};

export default page;
