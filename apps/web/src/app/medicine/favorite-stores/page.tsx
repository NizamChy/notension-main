import React from "react";
import Navbar from "@/components/shared/Navbar/Navbar";
import Footer from "@/components/shared/Footer/Footer";
import FavoriteStores from "@/components/StoreModule/FavoriteStores";

const page = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-content pt-16 lg:pt-[72px]">
        <FavoriteStores moduleName="medicine" isFavoriteRoute={true} />
      </div>
      <Footer />
    </>
  );
};

export default page;
