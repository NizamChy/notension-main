import React from "react";
import Navbar from "@/components/shared/Navbar/Navbar";
import Footer from "@/components/shared/Footer/Footer";
import FavoriteConsultationCenter from "@/components/MedicalServices/DoctorSection/FavoriteConsultationCenter/FavoriteConsultationCenter";

const page = () => {
  return (
    <>
      <Navbar />
      <FavoriteConsultationCenter />
      <Footer />
    </>
  );
};

export default page;
