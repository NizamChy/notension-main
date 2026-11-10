"use client";

import Image from "next/image";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { ITEM_CARDS } from "./itemCards";
import { ITEM_GRID_CLASS, SECTION_TITLE_CLASS } from "./storeModules";
import LoginModalDetails from "@/components/LoginSection/LoginModalDetails";
import CommonModal from "@/components/shared/CommonModal/CommonModal";

const FAVORITES = {
  grocery: {
    stateKey: "favouriteGroceryItems",
    title: "Favourite Grocery Item",
  },
  medicine: { stateKey: "favouriteMedicineItems", title: "Favourite Medicine" },
};

const FavoriteItems = ({ moduleName }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { stateKey, title } = FAVORITES[moduleName];
  const ItemCard = ITEM_CARDS[moduleName];

  const { userInfo } = useSelector((state) => state.user);
  const favoriteItems = useSelector((state) => state.userChoice[stateKey]);

  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    // Ask guests to log in; favourites belong to an account.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!userInfo?._id) setIsModalOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {userInfo?._id && (
        <div>
          <h1 className={SECTION_TITLE_CLASS}>{title}</h1>

          <div className={ITEM_GRID_CLASS}>
            {favoriteItems?.map((item) => (
              <ItemCard key={item?.productId} item={item} isFavorite={true} />
            ))}
          </div>

          {!favoriteItems?.length && (
            <div className="min-h-[45vh] flex justify-center items-center w-full">
              <div>
                <Image
                  src="/images/favorite/no-wishlist.png"
                  alt="wishlist"
                  height={1024}
                  width={1024}
                  className="object-cover w-60"
                />
                <p className="text-center text-deepGray font-semibold text-xl">
                  No wishlist yet!
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <CommonModal isOpen={isModalOpen} onClose={closeModal}>
          <LoginModalDetails onClose={closeModal} type="private-route" />
        </CommonModal>
      )}
    </>
  );
};

export default FavoriteItems;
