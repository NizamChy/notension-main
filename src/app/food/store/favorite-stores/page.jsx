import React from "react";
import FavoriteShop from "@/components/Food/FavoriteSection/FavoriteShop";
import Footer from "@/components/shared/Footer/Footer";

const page = () => {
  return (
    <>
      <div className="min-h-content">
        <FavoriteShop />
      </div>
      <Footer />
    </>
  );
};

export default page;
