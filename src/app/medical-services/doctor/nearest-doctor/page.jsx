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
      <MedicalPageHeader
        title="Doctors near you"
        subtitle="Specialists with chambers closest to your current location."
        back="/medical-services/doctor"
        backLabel="Find a doctor"
      />

      <MedicalPageBody>
        <NearestDoctorSlider wide />

        <NearestDoctor />
      </MedicalPageBody>
    </>
  );
};

export default page;
