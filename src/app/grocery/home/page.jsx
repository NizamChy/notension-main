import React from "react";
import FindStoreHero from "@/components/StoreModule/FindStoreHero";
import FavoriteShop from "@/components/Grocery/FavoriteSection/FavoriteShop";
import GrocerySection from "@/components/Grocery/GrocerySection/GrocerySection";

// Hero, saved stores, then the stores near the delivery location, so the
// page is useful without another click.
const page = () => {
  return (
    <>
      <div className="mx-auto w-full max-w-[1312px] px-4 sm:px-6 lg:px-8">
        <FindStoreHero moduleName="grocery" />
      </div>

      <FavoriteShop isFavoriteRoute={false} />
      <GrocerySection />
    </>
  );
};

export default page;
