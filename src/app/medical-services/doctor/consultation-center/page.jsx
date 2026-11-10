import React from "react";
import ConsultationCenter from "@/components/MedicalServices/DoctorSection/ConsultationCenter/ConsultationCenter";
import { MedicalPageHeader } from "@/components/MedicalServices/Layout/MedicalLayout";

const page = () => {
  return (
    <>
      <MedicalPageHeader title="Find Doctor By Consultation Center" />
      <ConsultationCenter />
    </>
  );
};

export default page;
