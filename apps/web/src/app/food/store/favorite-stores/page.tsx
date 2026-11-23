import React from "react";
import Footer from "@/components/shared/Footer/Footer";
import FavoriteShop from "@/components/Food/FavoriteSection/FavoriteShop";

const page = () => {
  return (
    <>
      <div className="min-h-content">
        <FavoriteShop isFavoriteRoute={true} />
      </div>
      <Footer />
    </>
  );
};

export default page;
