"use client";

import React from "react";
import { useSelector } from "react-redux";
import GroceryItems from "../GroceryItems/GroceryItems";
import Image from "next/image";

const FavoriteItem = () => {
  const favouriteGroceryItems = useSelector(
    (state) => state.userChoice.favouriteGroceryItems
  );

  return (
    <div className="mx-auto px-4 lg:px-24 py-6 mt-12 md:mt-20">
      {/* {favouriteGroceryItems?.length > 0 && ( */}
      <h1 className="text-lg md:text-xl lg:text-2xl font-semibold lg:font-bold mb-2 md:mb-6 text-deepGray">
        Favourite Grocery Item
      </h1>
      {/* )}  */}

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2 md:gap-5 justify-center items-center">
        {favouriteGroceryItems?.map((item) => (
          <div key={item?.productId}>
            <GroceryItems item={item} isFavorite={true} />
          </div>
        ))}
      </div>

      {favouriteGroceryItems?.length < 1 && (
        <>
          <div className="min-h-[45vh] flex justify-center items-center w-full">
            <div>
              <Image
                src="/images/favorite/wishlist.webp"
                alt="wishlist"
                height={1200}
                width={1200}
                className="object-cover w-40"
              />

              <p className="text-center text-deepGray font-semibold text-xl">
                No wishlist yet!
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FavoriteItem;
