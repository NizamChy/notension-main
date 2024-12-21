"use client";
import React from "react";
import { useSelector } from "react-redux";
import MedicineItems from "../MedicineItems/MedicineItems";
import ItemCardSkeleton from "../MedicineItems/ItemCardSkeleton";

const PopularItem = () => {
  const { popularItem, isLoading } = useSelector((state) => state.itemsByStore);

  return (
    <div>
      {popularItem?.length > 0 && (
        <p className="text-3xl font-medium pb-5">Popular Items</p>
      )}

      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2 md:gap-5 justify-center items-center w-full my-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <ItemCardSkeleton key={index} />
          ))}
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2 md:gap-5 justify-center items-center">
        {popularItem.map((item) => (
          <MedicineItems key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default PopularItem;
