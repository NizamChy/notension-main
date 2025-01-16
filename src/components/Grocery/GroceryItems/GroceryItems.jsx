"use client";

import Image from "next/image";
import { TbCurrencyTaka } from "react-icons/tb";
import { FaHeart } from "react-icons/fa";
import { GROCERY_ITEMS_IMAGES } from "@/api-endpoints/api-endpoint";
import { useFavouriteItem } from "@/hooks/fetch-data/favorite-item";
import { useEffect, useState } from "react";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import GroceryItemDetailsModal from "./GroceryItemDetailsModal";
import GroceryFavoriteItemsDetailsModal from "./GroceryFavoriteItemsDetailsModal";
import useGroceryItems from "@/hooks/fetch-data/useGroceryItems";

const GroceryItems = ({ item, isFavorite = false }) => {
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const [isFavoriteAdded, setIsFavoriteAdded] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const { addToCart, getCurrentQty, incrementQty, decrementQty } =
    useGroceryItems();

  const {
    addToFavouriteItems,
    isAddedToFavouriteItems,
    removeFromfavoriteItems,
  } = useFavouriteItem();

  let merchantType = 0;
  let isExists = null;

  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();

    addToCart(item);
  };

  const handleAddToFavorite = (event) => {
    event.preventDefault();
    event.stopPropagation();

    addToFavouriteItems(item, merchantType);
  };

  const handleRemoveFromFavorite = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const favouriteInfo = {
      productId: item?.productInfoTable,
      product_title_eng: item?.product_title_eng,
      product_title_beng: item?.product_title_beng,
      pack_size: item?.pack_size,
      app_image: item?.app_image,
    };

    if (isFavorite) {
      removeFromfavoriteItems(item, merchantType);
    } else {
      removeFromfavoriteItems(favouriteInfo, merchantType);
    }
  };

  const handleProductClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setSelectedItem(item);
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
    const itemQty = getCurrentQty(item);
    setCurrentQuantity(itemQty);
  }, [item, incrementQty, decrementQty]);

  useEffect(() => {
    isExists = isAddedToFavouriteItems(item?.productInfoTable, merchantType);

    setIsFavoriteAdded(isExists);
  }, [item, handleAddToFavorite, handleRemoveFromFavorite]);

  return (
    <>
      <div className="flex justify-center lg:mb-8">
        <div
          onClick={handleProductClick}
          className="group w-full max-w-52 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
        >
          <div className="relative overflow-hidden rounded-t-lg">
            <Image
              src={
                item?.app_image
                  ? `${GROCERY_ITEMS_IMAGES}/${item.app_image}`
                  : "/png/dummyImage.png"
              }
              alt={item?.product_title_eng || "Product image"}
              width={400}
              height={400}
              className="w-full h-52 object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
            />

            {item?.less > 0 && (
              <p className="absolute top-0 left-0 text-white text-sm bg-primaryGrocery px-3 rounded-tl-lg rounded-br-lg">
                {item?.less}% off
              </p>
            )}

            {!isFavoriteAdded && !isFavorite && (
              <button
                onClick={handleAddToFavorite}
                className="absolute top-4 right-3 md:right-4"
              >
                <MdOutlineFavoriteBorder className="size-7 p-1 text-xl text-primaryGrocery rounded-full" />
              </button>
            )}

            {isFavoriteAdded && (
              <button
                onClick={handleRemoveFromFavorite}
                className="absolute top-4 right-3 md:right-4"
              >
                <FaHeart className="size-7 p-1 text-xl text-primaryGrocery rounded-full" />
              </button>
            )}

            {isFavorite && (
              <button
                onClick={handleRemoveFromFavorite}
                className="absolute top-4 right-3 md:right-4"
              >
                <FaHeart className="size-7 p-1 text-xl text-primaryGrocery rounded-full" />
              </button>
            )}
          </div>

          <div className="px-3 pb-3 pt-2">
            <div className="h-10 md:h-12">
              <h5 className="text-sm md:text-base font-semibold text-deepGray line-clamp-2 overflow-hidden">
                {item?.product_title_eng}
              </h5>
            </div>

            <p className="text-sm text-mediumGray truncate">
              {item?.pack_size}
            </p>

            <div className="flex gap-3 items-center pb-3">
              {item?.sale_price && (
                <p className="text-sm md:text-lg font-medium flex items-center text-primaryGrocery">
                  <TbCurrencyTaka className="md:text-2xl" />
                  {item?.sale_price}
                </p>
              )}

              {item?.sale_price < item?.max_retail_price ? (
                <>
                  <p className="text-sm md:text-base flex items-center text-lightGray line-through">
                    <TbCurrencyTaka className="md:text-lg" />
                    {item?.max_retail_price}
                  </p>
                </>
              ) : null}
            </div>

            {!isFavorite && (
              <div>
                {currentQuantity === 0 ? (
                  <button
                    onClick={handleAddToCart}
                    className="w-full py-2 px-4 bg-primary text-white font-medium rounded-lg text-sm hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors duration-200"
                  >
                    Add to cart
                  </button>
                ) : (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                    className="w-full bg-primary rounded-lg flex items-center justify-between"
                  >
                    <button
                      onClick={(e) => handleDecrement(e, item._id)}
                      className="py-1 px-4 text-white font-medium rounded-lg text-xl hover:bg-blue-600 focus:outline-none transition-colors duration-200"
                    >
                      -
                    </button>
                    <span className="font-medium text-lg text-white">
                      {currentQuantity}
                    </span>
                    <button
                      onClick={(e) => handleIncrement(e, item._id)}
                      className="py-1 px-4 text-white font-medium rounded-lg text-xl hover:bg-blue-600 focus:outline-none transition-colors duration-200"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedItem && !isFavorite && (
        <GroceryItemDetailsModal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          item={selectedItem}
        />
      )}

      {selectedItem && isFavorite && (
        <GroceryFavoriteItemsDetailsModal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          item={selectedItem}
        />
      )}
    </>
  );
};

export default GroceryItems;
