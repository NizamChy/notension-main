"use client";
import React from "react";
import { useSelector } from "react-redux";
import MedicineItems from "../MedicineItems/MedicineItems";
import ItemCardSkeleton from "../MedicineItems/ItemCardSkeleton";

const DealOfTheDay = () => {
  const { dealOfTheDay, isLoading } = useSelector(
    (state) => state.itemsByStore
  );

  return (
    <div>
      {dealOfTheDay.length > 0 && (
        <p className="text-lg md:text-2xl lg:text-3xl font-medium pb-2 md:pb-4">
          Deal of The Day
        </p>
      )}

      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2 md:gap-5 justify-center items-center w-full my-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <ItemCardSkeleton key={index} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2 md:gap-5 justify-center items-center">
        {dealOfTheDay.map((item) => (
          <MedicineItems key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default DealOfTheDay;
