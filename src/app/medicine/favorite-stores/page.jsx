import React from "react";
import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";
import FavoriteShop from "@/components/Medicine/FavoriteSection/FavoriteShop";

const page = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-content pt-20">
        <FavoriteShop isFavoriteRoute={true} />
      </div>
      <Footer />
    </>
  );
};

export default page;
