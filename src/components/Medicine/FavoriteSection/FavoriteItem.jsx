"use client";
import React from "react";
import { useSelector } from "react-redux";
import MedicineItems from "../MedicineItems/MedicineItems";

const FavoriteItem = () => {
  const favouriteMedicineItems = useSelector(
    (state) => state.userChoice.favouriteMedicineItems
  );

  console.log("favouriteMedicineItems", favouriteMedicineItems);

  return (
    <div className="mx-auto px-4 lg:px-24 py-6 mt-20">
      {favouriteMedicineItems?.length > 0 && (
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold mb-6 text-deepGray">
          Favourite Medicine
        </h1>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2 md:gap-5 justify-center items-center">
        {favouriteMedicineItems?.map((item) => (
          <div key={item?.productId}>
            <MedicineItems item={item} isFavorite={true} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoriteItem;
