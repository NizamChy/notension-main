import React, { useEffect, useState } from "react";
import CommonModal from "@/components/shared/CommonModal/CommonModal";
import { useFavouriteItem } from "@/hooks/fetch-data/favorite-item";
import Image from "next/image";
import { MEDICINE_ITEMS_IMAGES } from "@/api-endpoints/api-endpoint";
import { TbCurrencyTaka } from "react-icons/tb";
import useMedicineItems from "@/hooks/fetch-data/useMedicineItems";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import ItemDetailsSkeleton from "./ItemDetailsSkeleton";

const FavoriteItemsDetailsModal = ({ isOpen, onClose, item }) => {
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const [isFavoriteAdded, setIsFavoriteAdded] = useState(null);

  const { addToCart, getCurrentQty, incrementQty, decrementQty } =
    useMedicineItems();

  const {
    getMedicineProductDetails,
    itemDetails,
    message,
    visible,
    addToFavouriteItems,
    isAddedToFavouriteItems,
    removeFromfavoriteItems,
  } = useFavouriteItem();

  let merchantType = 1;
  let isExists = null;

  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();

    addToCart(itemDetails);
  };

  const handleAddToFavorite = (event) => {
    event.preventDefault();
    event.stopPropagation();

    addToFavouriteItems(itemDetails, merchantType);
  };

  const handleRemoveFromFavorite = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const favouriteInfo = {
      productId: itemDetails?.medStoreProductInfo,
      item_title_eng: itemDetails?.item_title_eng,
      item_title_beng: itemDetails?.item_title_beng,
      pack_size: itemDetails?.pack_size,
      app_image: itemDetails?.app_image,
    };

    removeFromfavoriteItems(favouriteInfo, merchantType);
  };

  const handleIncrement = (e, itemId) => {
    e.preventDefault();
    e.stopPropagation();

    incrementQty(itemId);
  };

  const handleDecrement = (e, itemId) => {
    e.preventDefault();
    e.stopPropagation();

    decrementQty(itemId);
  };

  useEffect(() => {
    getMedicineProductDetails(item?.productId);
  }, [item]);

  useEffect(() => {
    const itemQty = getCurrentQty(itemDetails);
    setCurrentQuantity(itemQty);
  }, [itemDetails, incrementQty, decrementQty]);

  useEffect(() => {
    isExists = isAddedToFavouriteItems(
      itemDetails?.medStoreProductInfo,
      merchantType
    );

    setIsFavoriteAdded(isExists);
  }, [itemDetails, handleAddToFavorite, handleRemoveFromFavorite]);

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-screen-md m-4"
    >
      {visible ? (
        <div className="min-h-[30vh] flex justify-center items-center">
          <ItemDetailsSkeleton />
        </div>
      ) : (
        <>
          {!message ? (
            <div className="space-y-3">
              <h2 className="text-xl font-bold mb-4 text-secondary">
                Product Details
              </h2>

              <div className="md:flex">
                <div className=" md:w-1/3">
                  <Image
                    src={
                      itemDetails?.app_image
                        ? `${MEDICINE_ITEMS_IMAGES}/${itemDetails.app_image}`
                        : "/png/dummyImage.png"
                    }
                    alt={itemDetails?.item_title_eng || "Product image"}
                    width={500}
                    height={500}
                    className="w-full md:w-64"
                  />
                </div>

                <div className="space-y-1 md:w-2/3 p-4 relative">
                  <div className="flex justify-between">
                    <h5 className="text-sm md:text-xl font-semibold text-deepGray line-clamp-2 overflow-hidden">
                      {itemDetails?.item_title_eng}
                    </h5>

                    {itemDetails?.less > 0 && (
                      <p className="absolute -top-4 right-0 text-sm text-white bg-primaryMedicine px-4 py-0.5 rounded-tl-lg rounded-br-lg">
                        {itemDetails?.less}% off
                      </p>
                    )}

                    <p className="text-sm text-mediumGray">
                      {itemDetails?.strength}
                    </p>
                  </div>
                  <p className="text-base text-secondaryMedicine">
                    {itemDetails?.generic_name}
                  </p>
                  <p className="text-base text-secondary">
                    {itemDetails?.company_name}
                  </p>
                  <p className="text-base text-deepGray font-medium">
                    {itemDetails?.pack_size}
                  </p>

                  <div className="flex gap-5">
                    <p className="text-sm md:text-lg font-medium flex items-center text-primaryMedicine">
                      <TbCurrencyTaka className="md:text-2xl" />
                      {itemDetails?.sale_price}
                    </p>

                    {itemDetails?.sale_price < itemDetails?.max_retail_price ? (
                      <>
                        <p className="text-sm md:text-base flex items-center text-lightGray line-through">
                          <TbCurrencyTaka className="md:text-lg" />
                          {itemDetails?.max_retail_price}
                        </p>
                      </>
                    ) : null}
                  </div>

                  <div className="flex w-full justify-center gap-5 items-center pt-2">
                    <div className="w-1/2">
                      {currentQuantity === 0 ? (
                        <button
                          onClick={handleAddToCart}
                          className="w-full py-2 px-4 bg-primaryMedicine text-white font-medium rounded-lg text-sm hover:bg-secondaryMedicine focus:outline-none focus:ring-4 focus:ring-green-300 transition-colors duration-200"
                        >
                          Add to cart
                        </button>
                      ) : (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                          }}
                          className="w-full bg-primaryMedicine rounded-lg flex items-center justify-between"
                        >
                          <button
                            onClick={(e) => handleDecrement(e, itemDetails._id)}
                            className="py-1 px-4 text-white font-medium rounded-lg text-xl hover:bg-secondaryMedicine focus:outline-none transition-colors duration-200"
                          >
                            -
                          </button>
                          <span className="font-medium text-lg text-white">
                            {currentQuantity}
                          </span>
                          <button
                            onClick={(e) => handleIncrement(e, itemDetails._id)}
                            className="py-1 px-4 text-white font-medium rounded-lg text-xl hover:bg-secondaryMedicine focus:outline-none transition-colors duration-200"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="w-1/2">
                      {!isFavoriteAdded && (
                        <button onClick={handleAddToFavorite} className="">
                          <MdOutlineFavoriteBorder className="size-7 p-1 text-xl text-primaryMedicine rounded-full" />
                        </button>
                      )}

                      {isFavoriteAdded && (
                        <button onClick={handleRemoveFromFavorite} className="">
                          <FaHeart className="size-7 p-1 text-xl text-primaryMedicine rounded-full" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="min-h-[30vh] text-center flex justify-center items-center text-xl font-medium">
              {message}
            </p>
          )}
        </>
      )}
    </CommonModal>
  );
};

export default FavoriteItemsDetailsModal;
