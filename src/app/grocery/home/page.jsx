import React from "react";
import FindStoreHero from "@/components/StoreModule/FindStoreHero";
import FavoriteShop from "@/components/Grocery/FavoriteSection/FavoriteShop";

const page = () => {
  return (
    <>
      <div className="mx-auto w-full max-w-[1312px] px-4 sm:px-6 lg:px-8">
        <FindStoreHero moduleName="grocery" />
      </div>

      <FavoriteShop isFavoriteRoute={false} />
    </>
  );
};

export default page;
