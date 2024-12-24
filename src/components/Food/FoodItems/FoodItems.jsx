"use client";

import { useDispatch, useSelector } from "react-redux";
import { handleCartAction } from "@/redux/cartReducer";
import Image from "next/image";
import { TbCurrencyTaka } from "react-icons/tb";
import { FaHeart } from "react-icons/fa";
import { FOOD_ITEMS_IMAGES } from "@/api-endpoints/api-endpoint";

const FoodItems = ({ item }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const cartItem = cartItems.find((cartItem) => cartItem._id === item._id);
  const currentQuantity = cartItem ? cartItem.quantity : 0;

  // const handleAddToCart = () => {
  //   dispatch(
  //     handleCartAction({
  //       type: "ADD_TO_CART",
  //       data: item,
  //     })
  //   );
  // };

  const handleAddToCart = () => {
    console.log(item);

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
    dispatch(
      handleCartAction({
        type: "ADD_TO_CART",
        data: product,
      })
    );

    // dispatch(
    //   handleCartReducer({
    //     type: "SAVE_FOOD_STORE_INFO",
    //     data: visitedFoodStore,
    //   })
    // );
  };

  return (
    <>
      <div className="flex justify-center lg:mb-8">
        <div
          // className="group w-full max-w-sm  bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"

          className="group w-60 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
          style={{ maxWidth: "240px" }}
        >
          {/* <div className="relative p-3">
            <Image
              src={`${FOOD_ITEMS_IMAGES}/${item?.app_image}`}
              alt="food image"
              width={300}
              height={300}
              className="rounded-lg w-full object-cover"
            />

            <FaHeart className="absolute size-7 p-1 text-xl text-white hover:text-primary top-6 right-6 border border-white hover:border-primary rounded-full" />
          </div> */}

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
            <FaHeart className="absolute size-7 p-1 text-xl text-gray-200 hover:text-blue-500 top-4 right-3 md:right-4 rounded-full" />
          </div>

          <div className="px-3 pb-3 pt-1">
            <div className="h-12 lg:h-14">
              <h5 className="text-sm md:text-base font-semibold text-gray-900 line-clamp-2 overflow-hidden">
                {item?.product_title_eng}
              </h5>
            </div>

            <p className="text-sm md:text-lg font-medium pb-3 flex items-center text-primary">
              <TbCurrencyTaka className="md:text-2xl" />
              {item?.sale_price}
            </p>

            <div>
              {currentQuantity === 0 ? (
                <button
                  onClick={handleAddToCart}
                  className="w-full py-2 px-4 bg-primary text-white font-medium rounded-lg text-sm hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 transition-colors duration-200"
                >
                  Add to cart
                </button>
              ) : (
                <div className="w-full bg-primary rounded-lg flex items-center justify-between">
                  <button
                    onClick={() =>
                      dispatch(
                        handleCartAction({
                          type: "DECREMENT_QUANTITY",
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
                          type: "INCREMENT_QUANTITY",
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
