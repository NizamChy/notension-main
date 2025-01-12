"use client";

import { useDispatch, useSelector } from "react-redux";
import { handleCartAction } from "@/redux/cartReducer";
import Image from "next/image";
import { TbCurrencyTaka } from "react-icons/tb";
import { FaHeart } from "react-icons/fa";
import { FOOD_ITEMS_IMAGES } from "@/api-endpoints/api-endpoint";

const FoodItems = ({ item }) => {
  const dispatch = useDispatch();

  const foodItems = useSelector((state) => state.cart.foodItems);

  const visitedFoodStore = useSelector(
    (state) => state.dashboard.visitedFoodStore
  );

  const foodStoreInfo = useSelector((state) => state.cart.foodStoreInfo);

  const cartItem = foodItems?.find((cartItem) => cartItem?._id === item?._id);

  const currentQuantity = cartItem ? cartItem.quantity : 0;

  const addProduct = (product) => {
    dispatch(
      handleCartAction({
        type: "ADD_TO_CART_FOOD",
        data: product,
      })
    );
  };

  const saveStoreAndProductInfo = (product) => {
    dispatch(
      handleCartAction({
        type: "SAVE_FOOD_STORE_INFO",
        data: visitedFoodStore,
      })
    );

    addProduct(product);
  };

  const emptyCartItems = (product) => {
    dispatch(
      handleCartAction({
        type: "CLEAR_CART_FOOD",
      })
    );
    saveStoreAndProductInfo(product);
  };

  const handleAddToCart = () => {
    let product = {
      _id: item?._id,
      productCategory: item?.productCategory,
      product_title_eng: item?.product_title_eng || "",
      product_title_beng: item?.product_title_beng || "",
      pack_size: item?.pack_size || "",
      max_retail_price: item?.max_retail_price || 0,
      sale_price: item?.sale_price || 0,
      unit_symbol: item?.unit_symbol || "",
      max_allowed: item?.max_allowed || 0,
      quantity: 1,
      delivered_qty: 0,
      inc_qty: 1,
      app_image: item?.app_image,
    };

    if (foodItems.length > 0) {
      if (foodStoreInfo?._id && foodStoreInfo?._id !== visitedFoodStore?._id) {
        emptyCartItems(product);
      } else {
        addProduct(product);
      }
    } else {
      saveStoreAndProductInfo(product);
    }
  };

  return (
    <>
      <div className="flex justify-center lg:mb-8">
        <div className="group w-full max-w-56 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
          <div className="relative overflow-hidden rounded-t-lg">
            <Image
              src={
                item?.app_image
                  ? `${FOOD_ITEMS_IMAGES}/${item?.app_image}`
                  : "/png/dummyImage.png"
              }
              alt={item?.product_title_eng || "Product image"}
              width={400}
              height={400}
              className="w-full h-52 object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
            />
            {/* <FaHeart className="absolute size-7 p-1 text-xl text-gray-200 hover:text-primaryFood top-4 right-3 md:right-4 rounded-full" /> */}
          </div>

          <div className="px-3 pb-3 pt-1">
            <div className="h-12">
              <h5 className="text-sm md:text-base font-semibold text-gray-900 line-clamp-2 overflow-hidden">
                {item?.product_title_eng}
              </h5>
            </div>

            <p className="text-sm text-mediumGray">{item?.pack_size}</p>

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
                  className="w-full py-2 px-4 bg-primaryFood text-white font-medium rounded-lg text-sm hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 transition-colors duration-200"
                >
                  Add to cart
                </button>
              ) : (
                <div className="w-full bg-primaryFood rounded-lg flex items-center justify-between">
                  <button
                    onClick={() =>
                      dispatch(
                        handleCartAction({
                          type: "DECREMENT_QUANTITY_FOOD",
                          data: { _id: item._id },
                        })
                      )
                    }
                    className="py-1 px-4 text-white font-medium rounded-lg text-xl hover:bg-red-600 focus:outline-none transition-colors duration-200"
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
                          type: "INCREMENT_QUANTITY_FOOD",
                          data: { _id: item._id },
                        })
                      )
                    }
                    className="py-1 px-4 text-white font-medium rounded-lg text-xl hover:bg-red-600 focus:outline-none transition-colors duration-200"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FoodItems;
