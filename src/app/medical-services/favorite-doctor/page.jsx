import React from "react";
import Navbar from "@/components/shared/Navbar/Navbar";
import Footer from "@/components/shared/Footer/Footer";
import FavoriteDoctor from "@/components/MedicalServices/DoctorSection/FavoriteDoctor/FavoriteDoctor";

const page = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-content">
        <FavoriteDoctor />
      </div>
      <Footer />
    </>
  );
};

export default page;
