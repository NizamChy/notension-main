import axios from "axios";
import { useState } from "react";
import {
  GROCERY_ORDER_INFO,
  GROCERY_PLACE_ORDER,
} from "@/api-endpoints/api-endpoint";

import { GROCERY_URL } from "@/api-endpoints/secret";
import { useDispatch, useSelector } from "react-redux";
import { handleCartAction } from "@/redux/cartReducer";
import { useParams, useRouter } from "next/navigation";
import { handleUserReducer } from "@/redux/userReducer";
import toast from "react-hot-toast";

axios.defaults.withCredentials = true;

const Axios = axios.create({
  baseURL: GROCERY_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const useOrderGrocery = () => {
  const [progressing, setProgressing] = useState(false);

  const [discount, setDiscount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [shippingCharge, setShippingCharge] = useState(0);

  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();

  const userInfo = useSelector((state) => state.user.userInfo);

  const { groceryStoreInfo, totalAmountGrocery } = useSelector(
    (state) => state.cart
  );

  const totalPrice = totalAmountGrocery;

  const less = groceryStoreInfo?.less || 0;
  const maximum_less = groceryStoreInfo?.maximum_less || 0;
  const less_type = groceryStoreInfo?.less_type || "Percent";
  const minOrderAmount = groceryStoreInfo?.min_purchage_amount || 0;
  const deliveryCharge = groceryStoreInfo?.max_delivery_charge || 0;
  const minDeliveryCharge = groceryStoreInfo?.min_delivery_charge || 0;
  const minimum_order_for_less = groceryStoreInfo?.minimum_order_for_less || 0;

  const getGrandTotalGrocery = () => {
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

  //

  const placeOrder = (itemOrderObj) => {
    setProgressing(true);

    Axios.post(GROCERY_PLACE_ORDER, itemOrderObj)
      .then((res) => {
        if (res.data.success) {
          toast.success("Order has been placed!", {
            style: {
              border: "1px solid #FC8F1E",
            },
            iconTheme: {
              primary: "#FC8F1E",
              secondary: "#FFFAEE",
            },
          });

          dispatch(
            handleCartAction({
              type: "CLEAR_CART_GROCERY",
            })
          );

          router.push(
            `/grocery/${params?.store}/${params?.storeId}/${params?.customStoreId}`
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

    Axios.get(GROCERY_ORDER_INFO, {
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
            type: "SAVE_GROCERY_ORDER_INFO",
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
    getGrandTotalGrocery,
    setProgressing,
    getOrderInfo,
    placeOrder,
  };
};
