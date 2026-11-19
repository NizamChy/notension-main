"use client";

import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { HiOutlineHeart } from "react-icons/hi2";
import { ITEM_CARDS } from "./itemCards";
import { ITEM_GRID_CLASS } from "./storeModules";
import { EmptyState, PageHeader } from "@/components/shared/UI/UI";
import LoginModalDetails from "@/components/LoginSection/LoginModalDetails";
import CommonModal from "@/components/shared/CommonModal/CommonModal";

const FAVORITES = {
  grocery: {
    stateKey: "favouriteGroceryItems",
    title: "Favourite groceries",
    noun: "groceries",
  },
  medicine: {
    stateKey: "favouriteMedicineItems",
    title: "Favourite medicines",
    noun: "medicines",
  },
};

const FavoriteItems = ({ moduleName }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { stateKey, title, noun } = FAVORITES[moduleName];
  const ItemCard = ITEM_CARDS[moduleName];

  const { userInfo } = useSelector((state) => state.user);
  const favoriteItems = useSelector((state) => state.userChoice[stateKey]);
  const count = favoriteItems?.length || 0;

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
          <PageHeader
            title={title}
            subtitle={
              count > 0
                ? `${count} saved ${count === 1 ? "item" : "items"}`
                : `Save the ${noun} you buy often and find them here.`
            }
          />

          {count > 0 ? (
            <div className={ITEM_GRID_CLASS}>
              {favoriteItems.map((item) => (
                <ItemCard key={item?.productId} item={item} isFavorite={true} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<HiOutlineHeart />}
              title="No favourites yet"
              text="Tap the heart on any product to save it to this list."
              className="min-h-[40vh]"
            />
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
