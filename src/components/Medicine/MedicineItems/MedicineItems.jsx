"use client";

import Image from "next/image";
import { TbCurrencyTaka } from "react-icons/tb";
import { FaHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { handleCartAction } from "@/redux/cartReducer";
import { MEDICINE_ITEMS_IMAGES } from "@/api-endpoints/api-endpoint";

const MedicineItems = ({ item }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const cartItem = cartItems.find((cartItem) => cartItem._id === item._id);
  const currentQuantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
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
    dispatch(
      handleCartAction({
        type: "ADD_TO_CART",
        data: product,
      })
    );
  };

  return (
    <>
      <div className="flex justify-center lg:mb-8">
        <div
          className="w-60 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
          style={{ maxWidth: "240px" }}
        >
          <div className="relative p-3">
            <Image
              src={
                item?.app_image
                  ? `${MEDICINE_ITEMS_IMAGES}/${item.app_image}`
                  : "/png/dummyImage.png"
              }
              alt={item?.item_title_eng || "Product image"}
              width={200}
              height={150}
              className="rounded-lg object-contain w-full h-36 transform transition duration-500 hover:scale-110"
            />
            <FaHeart className="absolute size-7 p-1 text-xl text-gray-200 hover:text-primary top-4 right-3 md:right-4 rounded-full" />
          </div>

          <div className="px-3 pb-3">
            <div className="h-12 lg:h-14">
              <h5 className="text-sm md:text-base font-semibold text-deepGray line-clamp-2 overflow-hidden">
                {item?.item_title_eng}
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
                  className="w-full py-2 px-4 bg-primary text-white font-medium rounded-lg text-sm hover:bg-secondary focus:outline-none focus:ring-4 focus:ring-green-300 transition-colors duration-200"
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
                    className="py-1 px-4 text-white font-medium rounded-lg text-xl hover:bg-secondary focus:outline-none transition-colors duration-200"
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
                    className="py-1 px-4 text-white font-medium rounded-lg text-xl hover:bg-secondary focus:outline-none transition-colors duration-200"
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

export default MedicineItems;
