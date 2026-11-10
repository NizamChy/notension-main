import React from "react";
import NearestDoctor from "@/components/MedicalServices/DoctorSection/NearestDoctor/NearestDoctor";
import NearestDoctorSlider from "@/components/MedicalServices/DoctorSection/NearestDoctor/NearestDoctorSlider";
import {
  MedicalPageBody,
  MedicalPageHeader,
} from "@/components/MedicalServices/Layout/MedicalLayout";

const page = () => {
  return (
    <>
      <MedicalPageHeader title="Nearest Doctor Info" />

      <MedicalPageBody>
        <NearestDoctorSlider className="max-w-3xl mx-auto" />

        <NearestDoctor />
      </MedicalPageBody>
    </>
  );
};

export default page;
