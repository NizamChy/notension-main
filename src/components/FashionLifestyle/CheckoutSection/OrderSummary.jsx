import React from "react";
import toast from "react-hot-toast";
import { FaShop } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { FASHION_IMAGE_URL } from "@/api-endpoints/secret";

const OrderSummary = ({ items, total, removeFromCart }) => {
  const handleRemoveItem = (productId, selectedSize, selectedColor) => {
    removeFromCart(productId, selectedSize, selectedColor);
    toast.dismiss();
    toast.success("Item removed from cart!");
  };

  const groupedItems = items.reduce((groups, item) => {
    const storeId = item?.store_info?._id;
    if (!groups[storeId]) {
      groups[storeId] = {
        shop_name: item?.store_info?.shop_name,
        shop_address: item?.store_info?.shop_address,
        items: [],
      };
    }
    groups[storeId].items.push(item);
    return groups;
  }, {});

  const deliveryChargeByStore = 0;

  const subtotalByStore = (storeItems) =>
    storeItems.reduce((sum, item) => sum + item.sale_price * item.quantity, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>

      {Object.values(groupedItems).map((store, idx) => (
        <div key={idx} className="mb-8">
          <p className="text-xl font-semibold text-primary pb-3 border-b border-gray-200 flex items-center gap-1">
            <span>
              <FaShop className="text-lg" />
            </span>
            <span>{store?.shop_name}</span>
          </p>

          <ul className="divide-y divide-gray-200 mt-4">
            {store?.items?.map((item, index) => (
              <li key={index} className="py-6">
                <div className="flex">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={
                        item.web_image
                          ? `${FASHION_IMAGE_URL}/${item?.web_image}`
                          : "/png/dummyImage.png"
                      }
                      alt={item?.product_title_eng}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-sm md:text-base font-medium text-gray-900">
                        <h3>{item?.product_title_eng}</h3>
                        <div className="flex gap-2 items-center">
                          <p className="ml-4">
                            ৳{item?.sale_price?.toFixed(2)} × {item?.quantity}
                          </p>
                          <button
                            className="border text-gray-500 hover:text-red-500 hover:border-red-500 rounded p-1"
                            onClick={() =>
                              handleRemoveItem(
                                item?._id,
                                item?.selectedSize,
                                item?.selectedColor
                              )
                            }
                          >
                            <RxCross2 />
                          </button>
                        </div>
                      </div>

                      {(item?.selectedColor || item?.selectedSize) && (
                        <p className="mt-1 text-sm text-gray-500">
                          {item?.selectedColor && (
                            <span>{item?.selectedColor}</span>
                          )}
                          {item?.selectedColor && item?.selectedSize && " / "}
                          {item?.selectedSize && (
                            <span>{item?.selectedSize}</span>
                          )}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-1 items-end justify-between mt-2">
                      <p className="text-gray-500 text-sm">
                        Qty {item?.quantity}
                      </p>
                      <p className="text-base font-medium text-gray-900">
                        ৳ {(item?.sale_price * item?.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="border-t border-gray-200 pt-3 mt-3">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Subtotal</p>
              <p>৳ {subtotalByStore(store?.items)?.toFixed(2)}</p>
            </div>

            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <p>Delivery charge</p>
              <p>৳ {deliveryChargeByStore?.toFixed(2)}</p>
            </div>
            <div className="flex justify-between text-lg font-medium text-gray-900 mt-4 pt-4 border-t border-gray-200">
              <p>Total</p>
              <p>
                ৳{" "}
                {(
                  deliveryChargeByStore + subtotalByStore(store?.items)
                )?.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      ))}

      <div className="pt-6 mt-6">
        <div className="flex justify-between text-lg font-medium text-gray-900 mt-4 pt-4 border-t border-gray-200">
          <p>Overall Total</p>
          <p>৳ {total?.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
