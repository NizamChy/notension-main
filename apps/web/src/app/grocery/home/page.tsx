import React from "react";
import FindStoreHero from "@/components/StoreModule/FindStoreHero";
import FavoriteStores from "@/components/StoreModule/FavoriteStores";
import StoreListSection from "@/components/StoreModule/StoreListSection";

// Hero, saved stores, then the stores near the delivery location, so the
// page is useful without another click.
const page = () => {
  return (
    <>
      <div className="mx-auto w-full max-w-[1312px] px-4 sm:px-6 lg:px-8">
        <FindStoreHero moduleName="grocery" />
      </div>

      <FavoriteStores moduleName="grocery" isFavoriteRoute={false} />
      <StoreListSection moduleName="grocery" />
    </>
  );
};

export default page;
