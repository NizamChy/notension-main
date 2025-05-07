"use client";

import Image from "next/image";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import MedicineItems from "../MedicineItems/MedicineItems";
import LoginModalDetails from "@/components/LoginSection/LoginModalDetails";
import CommonModal from "@/components/shared/CommonModal/CommonModal";

const FavoriteItem = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { userInfo } = useSelector((state) => state.user);
  const favouriteMedicineItems = useSelector(
    (state) => state.userChoice.favouriteMedicineItems
  );

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (!userInfo?._id) {
      openModal();
    }
  }, []);

  return (
    <>
      {userInfo?._id && (
        <div className="mx-auto px-4 lg:px-24 py-6 mt-12 md:mt-20">
          <h1 className="text-lg md:text-xl lg:text-2xl font-semibold lg:font-bold mb-2 md:mb-6 text-deepGray">
            Favourite Medicine
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2 md:gap-5 justify-center items-center">
            {favouriteMedicineItems?.map((item) => (
              <div key={item?.productId}>
                <MedicineItems item={item} isFavorite={true} />
              </div>
            ))}
          </div>

          {favouriteMedicineItems?.length < 1 && (
            <>
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
            </>
          )}
        </div>
      )}

      {isModalOpen && (
        <>
          <CommonModal isOpen={isModalOpen} onClose={closeModal}>
            <LoginModalDetails onClose={closeModal} type="private-route" />
          </CommonModal>
        </>
      )}
    </>
  );
};

export default FavoriteItem;
