"use client";

import Image from "next/image";
import { useDispatch } from "react-redux";
import { useParams } from "next/navigation";
import { TbCurrencyTaka } from "react-icons/tb";
import { useEffect, useRef, useState } from "react";
import FoodItemDetailsModal from "./FoodItemDetailsModal";
import useFoodItems from "@/hooks/fetch-data/useFoodItems";
import { FOOD_ITEMS_IMAGES } from "@/api-endpoints/api-endpoint";
import { handleUserChoiceReducer } from "@/redux/userChoiceReducer";

const FoodItems = ({ item }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const params = useParams();
  const prevUrlRef = useRef(null);
  const dispatch = useDispatch();

  const { addToCart, getCurrentQty, incrementQty, decrementQty } =
    useFoodItems();

  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();

    addToCart(item);
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

  const handleProductClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setSelectedItem(item);

    dispatch(
      handleUserChoiceReducer({
        type: "SAVE_CURRENT_ITEM_DETAILS",
        data: item,
      })
    );
  };

  useEffect(() => {
    const itemQty = getCurrentQty(item);
    setCurrentQuantity(itemQty);
  }, [item, incrementQty, decrementQty]);

  useEffect(() => {
    const basePath = `/food/store/${params?.store}/${params?.storeId}/${params?.customStoreId}`;

    if (selectedItem && item?._id) {
      if (!prevUrlRef.current) {
        prevUrlRef.current = window.location.href;
      }

      const newUrl = `${basePath}/product/${item._id}`;
      if (!window.location.pathname.endsWith(`/${item._id}`)) {
        window.history.pushState({}, "", newUrl);
      }
    } else {
      if (prevUrlRef.current) {
        window.history.pushState({}, "", prevUrlRef.current);
        prevUrlRef.current = null;

        dispatch(
          handleUserChoiceReducer({
            type: "SAVE_CURRENT_ITEM_DETAILS",
            data: {},
          })
        );
      }
    }
  }, [selectedItem, item?._id, params]);

  return (
    <>
      <div className="flex justify-center lg:mb-8">
        <div
          onClick={handleProductClick}
          className="group cursor-pointer w-full max-w-56 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
        >
          <div className="relative overflow-hidden rounded-t-lg">
            {/* Skeleton loader that shows while image is loading */}
            {isImageLoading && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse w-full h-full">
                <div className="h-full flex justify-center items-center">
                  <Image
                    src="/gif/loading.gif"
                    alt="loading.gif"
                    width={60}
                    height={60}
                  />
                </div>
              </div>
            )}

            <Image
              src={
                item?.app_image
                  ? `${FOOD_ITEMS_IMAGES}/${item?.app_image}`
                  : "/png/dummyImage.png"
              }
              alt={item?.product_title_eng || "Product image"}
              width={400}
              height={400}
              className={`w-full md:h-52 object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105 ${
                isImageLoading ? "opacity-0" : "opacity-100"
              }`}
              onLoadingComplete={() => setIsImageLoading(false)}
              onLoad={() => setIsImageLoading(false)}
              onError={() => setIsImageLoading(false)}
            />

            {item?.less > 0 && (
              <p className="absolute flex items-center top-0 left-0 text-white text-sm bg-primaryFood px-3 rounded-tl-lg rounded-br-lg">
                <span>
                  <TbCurrencyTaka className="md:text-lg" />
                </span>
                <span>{item?.less} off</span>
              </p>
            )}
          </div>

          <div className="px-3 pb-3 pt-1">
            <div className="h-8 md:h-12">
              <h5 className="text-xs md:text-base font-semibold text-gray-900 line-clamp-2 overflow-hidden">
                {item?.product_title_eng}
              </h5>
            </div>

            <p className="text-xs md:text-sm text-mediumGray">
              {item?.pack_size}
            </p>

            <div className="flex gap-3 items-center pb-3">
              {item?.sale_price && (
                <p className="text-sm md:text-lg font-medium flex items-center text-primaryFood">
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

            <div>
              {currentQuantity === 0 ? (
                <button
                  onClick={handleAddToCart}
                  className="w-full py-1.5 md:py-2 md:px-4 bg-primaryFood text-white font-medium rounded-lg text-xs md:text-sm hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 transition-colors duration-200"
                >
                  Add to cart
                </button>
              ) : (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  className="w-full bg-primaryFood rounded-lg flex items-center justify-between"
                >
                  <button
                    onClick={(e) => handleDecrement(e, item?._id)}
                    className="md:py-1 px-4 text-white font-medium rounded-lg text-xl hover:bg-red-600 focus:outline-none transition-colors duration-200"
                  >
                    -
                  </button>
                  <span className="font-medium text-lg text-white">
                    {currentQuantity}
                  </span>
                  <button
                    onClick={(e) => handleIncrement(e, item?._id)}
                    className="md:py-1 px-4 text-white font-medium rounded-lg text-xl hover:bg-red-600 focus:outline-none transition-colors duration-200"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedItem && (
        <FoodItemDetailsModal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          item={selectedItem}
        />
      )}
    </>
  );
};

export default FoodItems;
