import React from "react";
import Navbar from "@/components/shared/Navbar/Navbar";
import Footer from "@/components/shared/Footer/Footer";
import MedicalService from "@/components/MedicalServices/MedicalService/MedicalService";

const page = () => {
  return (
    <>
      <Navbar />
      <MedicalService />
      <Footer />
    </>
  );
};

export default page;
