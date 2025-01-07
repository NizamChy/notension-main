"use client";

import Image from "next/image";
import { TbCurrencyTaka } from "react-icons/tb";
import { FaHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { handleCartAction } from "@/redux/cartReducer";
import { GROCERY_ITEMS_IMAGES } from "@/api-endpoints/api-endpoint";
import { useFavouriteItem } from "@/hooks/fetch-data/favorite-item";
import { useEffect, useState } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { MdFavoriteBorder, MdOutlineFavoriteBorder } from "react-icons/md";

const GroceryItems = ({ item, isFavorite = false }) => {
  const [isFavoriteAdded, setIsFavoriteAdded] = useState(null);

  const dispatch = useDispatch();

  const {
    addToFavouriteItems,
    isAddedToFavouriteItems,
    removeFromfavoriteItems,
  } = useFavouriteItem();

  let merchantType = 0;
  let isExists = null;

  const groceryItems = useSelector((state) => state.cart.groceryItems);
  const visitedGroceryStore = useSelector(
    (state) => state.dashboard.visitedGroceryStore
  );
  const groceryStoreInfo = useSelector((state) => state.cart.groceryStoreInfo);

  const cartItem = groceryItems?.find((cartItem) => cartItem._id === item._id);
  const currentQuantity = cartItem ? cartItem.quantity : 0;

  const addProduct = (product) => {
    dispatch(
      handleCartAction({
        type: "ADD_TO_CART_GROCERY",
        data: product,
      })
    );
  };

  const saveStoreAndProductInfo = (product) => {
    addProduct(product);
    dispatch(
      handleCartAction({
        type: "SAVE_GROCERY_STORE_INFO",
        data: visitedGroceryStore,
      })
    );
  };

  const emptyCartItems = (product) => {
    dispatch(
      handleCartAction({
        type: "CLEAR_CART_GROCERY",
      })
    );
    saveStoreAndProductInfo(product);
  };

  const handleAddToCart = () => {
    let product = {
      _id: item?._id,
      productInfoTable: item?.productInfoTable,
      product_title_eng: item?.product_title_eng || "",
      product_title_beng: item?.product_title_beng || "",
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

    if (groceryItems.length > 0) {
      if (
        groceryStoreInfo?._id &&
        groceryStoreInfo?._id !== visitedGroceryStore?._id
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

  useEffect(() => {
    isExists = isAddedToFavouriteItems(item?.productInfoTable, merchantType);

    setIsFavoriteAdded(isExists);
  }, [item, handleAddToFavorite, handleRemoveFromFavorite]);

  return (
    <>
      <div className="flex justify-center lg:mb-8">
        <div
          className="group w-60 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
          style={{ maxWidth: "240px" }}
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

            {!isFavoriteAdded && !isFavorite && (
              <button
                onClick={handleAddToFavorite}
                className="absolute top-4 right-3 md:right-4"
              >
                {/* <FaHeart className="size-7 p-1 text-xl text-gray-200 hover:text-primaryGrocery rounded-full" /> */}
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

            {/* {isFavorite && (
              <button
                onClick={handleRemoveFromFavorite}
                className="absolute bottom-4 right-2 md:right-2 text-deepGray bg-primaryBg opacity-65 hover:text-primaryGrocery border hover:border-primaryGrocery rounded-full hover:bg-white px-1 flex justify-center items-center "
              >
                <IoTrashOutline className="size-7 p-1 text-xl rounded-full text-primaryGrocery" />
                <span className="text-xs font-medium">Remove</span>
              </button>
            )} */}
          </div>

          <div className="px-3 pb-3">
            <div className="h-12 lg:h-14">
              <h5 className="text-sm md:text-base font-semibold text-gray-900 line-clamp-2 overflow-hidden">
                {item?.product_title_eng}
              </h5>
            </div>

            {item?.sale_price && (
              <p className="text-sm md:text-lg font-medium pb-3 flex items-center text-blue-500">
                <TbCurrencyTaka className="md:text-2xl" />
                {item?.sale_price}
              </p>
            )}

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
                  <div className="w-full bg-primary rounded-lg flex items-center justify-between">
                    <button
                      onClick={() =>
                        dispatch(
                          handleCartAction({
                            type: "DECREMENT_QUANTITY_GROCERY",
                            data: { _id: item._id },
                          })
                        )
                      }
                      className="py-1 px-4 text-white font-medium rounded-lg text-xl hover:bg-blue-600 focus:outline-none transition-colors duration-200"
                    >
                      -
                    </button>
                    <span className="font-medium text-lg text-white">
                      {currentQuantity}
                    </span>
                    <button
                      onClick={() =>
                        dispatch(
                          handleCartAction({
                            type: "INCREMENT_QUANTITY_GROCERY",
                            data: { _id: item._id },
                          })
                        )
                      }
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
    </>
  );
};

export default GroceryItems;
