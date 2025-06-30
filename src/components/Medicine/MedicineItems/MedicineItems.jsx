"use client";

import Image from "next/image";
import { FaHeart } from "react-icons/fa";
import { useParams } from "next/navigation";
import { TbCurrencyTaka } from "react-icons/tb";
import ItemDetailsModal from "./ItemDetailsModal";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import useMedicineItems from "@/hooks/fetch-data/useMedicineItems";
import { handleUserChoiceReducer } from "@/redux/userChoiceReducer";
import { useFavouriteItem } from "@/hooks/fetch-data/favorite-item";
import FavoriteItemsDetailsModal from "./FavoriteItemsDetailsModal";
import { MEDICINE_ITEMS_IMAGES } from "@/api-endpoints/api-endpoint";
import CommonModal from "@/components/shared/CommonModal/CommonModal";
import LoginModalDetails from "@/components/LoginSection/LoginModalDetails";

const MedicineItems = ({ item, isFavorite = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isFavoriteAdded, setIsFavoriteAdded] = useState(null);

  const params = useParams();
  const prevUrlRef = useRef(null);

  const dispatch = useDispatch();

  const { addToCart, getCurrentQty, incrementQty, decrementQty } =
    useMedicineItems();

  const {
    addToFavouriteItems,
    isAddedToFavouriteItems,
    removeFromfavoriteItems,
  } = useFavouriteItem();

  const { userInfo } = useSelector((state) => state.user);

  let merchantType = 1;
  let isExists = null;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();

    addToCart(item);
  };

  const handleAddToFavorite = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!userInfo?._id) {
      return openModal();
    }

    addToFavouriteItems(item, merchantType);
  };

  const handleRemoveFromFavorite = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const favouriteInfo = {
      productId: item?.medStoreProductInfo,
      item_title_eng: item?.item_title_eng,
      item_title_beng: item?.item_title_beng,
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

    dispatch(
      handleUserChoiceReducer({
        type: "SAVE_CURRENT_ITEM_DETAILS",
        data: item,
      })
    );
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
    isExists = isAddedToFavouriteItems(item?.medStoreProductInfo, merchantType);

    setIsFavoriteAdded(isExists);
  }, [item, handleAddToFavorite, handleRemoveFromFavorite]);

  useEffect(() => {
    const basePath = `/medicine/${params?.store}/${params?.storeId}/${params?.customStoreId}`;

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
          className="group cursor-pointer w-full max-w-52 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
        >
          <div className="relative overflow-hidden rounded-t-lg">
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
                  ? `${MEDICINE_ITEMS_IMAGES}/${item.app_image}`
                  : "/png/dummyImage.png"
              }
              alt={item?.item_title_eng || "Product image"}
              width={400}
              height={400}
              // className="w-full md:h-52 object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
              className={`w-full md:h-52 object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105 ${
                isImageLoading ? "opacity-0" : "opacity-100"
              }`}
              onLoadingComplete={() => setIsImageLoading(false)}
              onLoad={() => setIsImageLoading(false)}
              onError={() => setIsImageLoading(false)}
            />

            {item?.less > 0 && (
              <p className="absolute top-0 left-0 text-white text-sm bg-primaryMedicine px-3 rounded-tl-lg rounded-br-lg">
                {item?.less}
                {item?.less_type === "Percent" ? "%" : "৳"} OFF
              </p>
            )}

            {!isFavoriteAdded && !isFavorite && (
              <button
                onClick={handleAddToFavorite}
                className="absolute top-4 right-3 md:right-4"
              >
                <MdOutlineFavoriteBorder className="size-7 p-1 text-xl text-primaryMedicine rounded-full" />
              </button>
            )}

            {isFavoriteAdded && (
              <button
                onClick={handleRemoveFromFavorite}
                className="absolute top-4 right-3 md:right-4"
              >
                <FaHeart className="size-7 p-1 text-xl text-primaryMedicine rounded-full" />
              </button>
            )}

            {isFavorite && (
              <button
                onClick={handleRemoveFromFavorite}
                className="absolute top-4 right-3 md:right-4"
              >
                <FaHeart className="size-7 p-1 text-xl text-primaryMedicine rounded-full" />
              </button>
            )}
          </div>

          <div className="px-2 md:px-3 pb-3 pt-1">
            <div className="md:flex justify-between">
              <div className="h-8 lg:h-14">
                <h5 className="text-xs md:text-base font-semibold text-deepGray line-clamp-2 overflow-hidden">
                  {item?.item_title_eng}
                </h5>
              </div>

              <p className="text-xs text-mediumGray truncate">
                {item?.strength}
              </p>
            </div>

            <div className="flex gap-3 items-center pb-3">
              {item?.sale_price && (
                <p className="text-sm md:text-lg font-medium flex items-center text-primaryMedicine">
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
                    className="w-full py-1.5 md:py-2 md:px-4 bg-primaryMedicine text-white font-medium rounded-lg text-xs md:text-sm hover:bg-secondaryMedicine focus:outline-none focus:ring-4 focus:ring-green-300 transition-colors duration-200"
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
                      onClick={(e) => handleDecrement(e, item._id)}
                      className="md:py-1 px-4 text-white font-medium rounded-lg text-xl hover:bg-secondaryMedicine focus:outline-none transition-colors duration-200"
                    >
                      -
                    </button>
                    <span className="font-medium text-lg text-white">
                      {currentQuantity}
                    </span>
                    <button
                      onClick={(e) => handleIncrement(e, item._id)}
                      className="md:py-1 px-4 text-white font-medium rounded-lg text-xl hover:bg-secondaryMedicine focus:outline-none transition-colors duration-200"
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

      {selectedItem && isFavorite && (
        <FavoriteItemsDetailsModal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          item={selectedItem}
        />
      )}

      {selectedItem && !isFavorite && (
        <ItemDetailsModal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          item={selectedItem}
        />
      )}

      <CommonModal isOpen={isModalOpen} onClose={closeModal}>
        <LoginModalDetails
          onClose={closeModal}
          type="favourite"
          handleAddToFavorite={handleAddToFavorite}
        />
      </CommonModal>
    </>
  );
};

export default MedicineItems;
