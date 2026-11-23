import React from "react";
import Navbar from "@/components/shared/Navbar/Navbar";
import Footer from "@/components/shared/Footer/Footer";
import FavoriteConsultationCenter from "@/components/MedicalServices/DoctorSection/FavoriteConsultationCenter/FavoriteConsultationCenter";

const page = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-content">
        <FavoriteConsultationCenter />
      </div>
      <Footer />
    </>
  );
};

export default page;
