"use client";

import Image from "next/image";
import { TbCurrencyTaka } from "react-icons/tb";
import { FaHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { handleCartAction } from "@/redux/cartReducer";
import { MEDICINE_ITEMS_IMAGES } from "@/api-endpoints/api-endpoint";
import { useFavouriteItem } from "@/hooks/fetch-data/favorite-item";
import { useEffect, useState } from "react";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import FavoriteItemsDetailsModal from "./FavoriteItemsDetailsModal";

const MedicineItems = ({ item, isFavorite = false }) => {
  const [isFavoriteAdded, setIsFavoriteAdded] = useState(null);

  const [selectedItem, setSelectedItem] = useState(null);

  const dispatch = useDispatch();

  const {
    addToFavouriteItems,
    isAddedToFavouriteItems,
    removeFromfavoriteItems,
  } = useFavouriteItem();

  let merchantType = 1;
  let isExists = null;

  const medicineItems = useSelector((state) => state.cart.medicineItems);

  const visitedMedicineStore = useSelector(
    (state) => state.dashboard.visitedMedicineStore
  );

  const medicineStoreInfo = useSelector(
    (state) => state.cart.medicineStoreInfo
  );

  const cartItem = medicineItems?.find(
    (cartItem) => cartItem?._id === item?._id
  );

  const currentQuantity = cartItem ? cartItem.quantity : 0;

  const addProduct = (product) => {
    dispatch(
      handleCartAction({
        type: "ADD_TO_CART_MEDICINE",
        data: product,
      })
    );
  };

  const saveStoreAndProductInfo = (product) => {
    addProduct(product);
    dispatch(
      handleCartAction({
        type: "SAVE_MEDICINE_STORE_INFO",
        data: visitedMedicineStore,
      })
    );
  };

  const emptyCartItems = (product) => {
    dispatch(
      handleCartAction({
        type: "CLEAR_CART_MEDICINE",
      })
    );
    saveStoreAndProductInfo(product);
  };

  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();

    let product = {
      _id: item?._id,
      medStoreProductInfo: item?.medStoreProductInfo,
      item_title_eng: item?.item_title_eng || "",
      item_title_beng: item?.item_title_beng || "",
      pack_size: item?.pack_size || "",
      purchase_price: item?.purchase_price || 0,
      max_retail_price: item?.max_retail_price || 0,
      sale_price: item?.sale_price || 0,
      unit_symbol: item?.unit_symbol || "",
      max_allowed: item?.max_allowed || 0,
      quantity: 1,
      delivered_qty: 0,
      inc_qty: 1,
      app_image: item?.app_image,
    };

    if (medicineItems.length > 0) {
      if (
        medicineStoreInfo?._id &&
        medicineStoreInfo?._id !== visitedMedicineStore?._id
      ) {
        emptyCartItems(product);
      } else {
        addProduct(product);
      }
    } else {
      saveStoreAndProductInfo(product);
    }
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

    console.log("click");

    setSelectedItem(item);
  };

  useEffect(() => {
    isExists = isAddedToFavouriteItems(item?.medStoreProductInfo, merchantType);

    setIsFavoriteAdded(isExists);
  }, [item, handleAddToFavorite, handleRemoveFromFavorite]);

  return (
    <>
      <div className="flex justify-center lg:mb-8">
        <div
          onClick={handleProductClick}
          className="group w-60 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
          style={{ maxWidth: "240px" }}
        >
          <div className="relative overflow-hidden rounded-t-lg">
            <Image
              src={
                item?.app_image
                  ? `${MEDICINE_ITEMS_IMAGES}/${item.app_image}`
                  : "/png/dummyImage.png"
              }
              alt={item?.item_title_eng || "Product image"}
              width={400}
              height={400}
              className="w-full h-52 object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
            />
            {/* <FaHeart
              onClick={handleAddToFavorite}
              className="absolute size-7 p-1 text-xl text-gray-200 hover:text-primaryMedicine top-4 right-3 md:right-4 rounded-full"
            /> */}

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

          <div className="px-3 pb-3 pt-1">
            <div className="h-12 lg:h-14">
              <h5 className="text-sm md:text-base font-semibold text-deepGray line-clamp-2 overflow-hidden">
                {item?.item_title_eng}
              </h5>
            </div>

            {item?.sale_price && (
              <p className="text-sm md:text-lg font-medium pb-3 flex items-center text-primaryMedicine">
                <TbCurrencyTaka className="md:text-2xl" />
                {item?.sale_price}
              </p>
            )}

            {!isFavorite && (
              <div>
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
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        dispatch(
                          handleCartAction({
                            type: "DECREMENT_QUANTITY_MEDICINE",
                            data: { _id: item._id },
                          })
                        );
                      }}
                      className="py-1 px-4 text-white font-medium rounded-lg text-xl hover:bg-secondaryMedicine focus:outline-none transition-colors duration-200"
                    >
                      -
                    </button>
                    <span className="font-medium text-lg text-white">
                      {currentQuantity}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        dispatch(
                          handleCartAction({
                            type: "INCREMENT_QUANTITY_MEDICINE",
                            data: { _id: item._id },
                          })
                        );
                      }}
                      className="py-1 px-4 text-white font-medium rounded-lg text-xl hover:bg-secondaryMedicine focus:outline-none transition-colors duration-200"
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

      {selectedItem && (
        <FavoriteItemsDetailsModal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          item={selectedItem}
        />
      )}
    </>
  );
};

export default MedicineItems;
