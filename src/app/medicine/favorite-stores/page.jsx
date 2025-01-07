import FavoriteShop from "@/components/Medicine/FavoriteSection/FavoriteShop";
import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";
import React from "react";

const page = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-content pt-20">
        <FavoriteShop />
      </div>
      <Footer />
    </>
  );
};

export default page;
