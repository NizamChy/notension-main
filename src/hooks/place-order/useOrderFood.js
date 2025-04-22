import axios from "axios";
import { useState } from "react";
import {
  FOOD_ORDER_INFO,
  FOOD_PLACE_ORDER,
} from "@/api-endpoints/api-endpoint";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { FOOD_URL } from "@/api-endpoints/secret";
import { useDispatch, useSelector } from "react-redux";
import { handleCartAction } from "@/redux/cartReducer";
import { handleUserReducer } from "@/redux/userReducer";

axios.defaults.withCredentials = true;

const Axios = axios.create({
  baseURL: FOOD_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const useOrderFood = () => {
  const [progressing, setProgressing] = useState(false);

  const [discount, setDiscount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [shippingCharge, setShippingCharge] = useState(0);

  const router = useRouter();
  const dispatch = useDispatch();

  const userInfo = useSelector((state) => state.user.userInfo);

  const { foodStoreInfo, totalAmountFood } = useSelector((state) => state.cart);

  const totalPrice = totalAmountFood;

  const minOrderAmount = foodStoreInfo?.min_purchage_amount || 0;
  const deliveryCharge = foodStoreInfo?.max_delivery_charge || 0;
  const minDeliveryCharge = foodStoreInfo?.min_delivery_charge || 0;
  const less = foodStoreInfo?.less || 0;
  const less_type = foodStoreInfo?.less_type || "Percent";
  const maximum_less = foodStoreInfo?.maximum_less || 0;
  const minimum_order_for_less = foodStoreInfo?.minimum_order_for_less || 0;

  const getGrandTotalFood = () => {
    let shippingCost = deliveryCharge;
    if (parseFloat(totalPrice) >= parseFloat(minOrderAmount)) {
      shippingCost = minDeliveryCharge;
    }
    let total = 0;
    let Discount = 0;
    if (
      parseFloat(less) > 0 &&
      parseFloat(maximum_less) > 0 &&
      parseFloat(totalPrice) >= parseFloat(minimum_order_for_less)
    ) {
      if (less_type === "Percent") {
        Discount = ((parseFloat(less) / 100) * parseFloat(totalPrice)).toFixed(
          2
        );
        if (parseFloat(Discount) > parseFloat(maximum_less)) {
          Discount = parseFloat(maximum_less).toFixed(2);
        }
      } else {
        Discount = less;
      }
    }
    setShippingCharge(shippingCost);
    setDiscount(Discount);
    total = (
      parseFloat(totalPrice) +
      parseFloat(shippingCost) -
      parseFloat(Discount)
    ).toFixed(2);
    setGrandTotal(total);
  };

  const placeOrder = (itemOrderObj) => {
    setProgressing(true);

    Axios.post(FOOD_PLACE_ORDER, itemOrderObj)
      .then((res) => {
        if (res.data.success) {
          toast.success("Order has been placed!");
          dispatch(
            handleCartAction({
              type: "CLEAR_CART_FOOD",
            })
          );

          router.push(
            `/food/store/${params?.store}/${params?.storeId}/${params?.customStoreId}`
          );
        } else {
          toast.error("Failed to place order.");
        }

        setProgressing(false);
      })
      .catch((error) => {
        setProgressing(false);
        toast.error("Failed to place order.");
      });
  };

  const getOrderInfo = () => {
    setProgressing(true);
    Axios.get(FOOD_ORDER_INFO, {
      params: {
        customerId: userInfo?._id,
        custom_customerId: userInfo?.custom_id,
      },
    })
      .then((response) => {
        setProgressing(false);
        ///saveOrderInfoToReducer(response?.data?.result);
        dispatch(
          handleUserReducer({
            type: "SAVE_FOOD_ORDER_INFO",
            data: response?.data?.result,
          })
        );
      })
      .catch((error) => {
        // console.log("Error : ", error.response);
        setProgressing(false);
      });

    setTimeout(() => {
      if (progressing) {
        setProgressing(false);
      }
    }, 10000);
  };

  return {
    discount,
    grandTotal,
    progressing,
    shippingCharge,
    getGrandTotalFood,
    setProgressing,
    getOrderInfo,
    placeOrder,
  };
};
