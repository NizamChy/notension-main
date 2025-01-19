import React from "react";
import axios from "axios";
import {
  GROCERY_ORDER_INFO,
  GROCERY_PLACE_ORDER,
} from "@/api-endpoints/api-endpoint";
import { toast } from "react-toastify";
import { GROCERY_URL } from "@/api-endpoints/secret";
import { useDispatch, useSelector } from "react-redux";
import { handleCartAction } from "@/redux/cartReducer";
import { useParams, useRouter } from "next/navigation";
import { handleUserReducer } from "@/redux/userReducer";

axios.defaults.withCredentials = true;

const Axios = axios.create({
  baseURL: GROCERY_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const useOrderGrocery = () => {
  const [progressing, setProgressing] = React.useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const params = useParams();

  const userInfo = useSelector((state) => state.user.userInfo);

  const placeOrder = (itemOrderObj) => {
    setProgressing(true);

    Axios.post(GROCERY_PLACE_ORDER, itemOrderObj)
      .then((res) => {
        if (res.data.success) {
          toast.success("Order has been placed!");
          dispatch(
            handleCartAction({
              type: "CLEAR_CART_GROCERY",
            })
          );

          router.push(`/grocery/${params?.store}`);
        } else {
          toast.error("Failed to place order.");
        }

        setProgressing(false);
      })
      .catch((error) => {
        setProgressing(false);
        // console.log("error:", error);

        toast.error("Failed to place order.");
        // console.log("result =", error?.response?.data?.errors);
        // const errorMsg = formatServerError(error?.response?.data?.errors);
      });
  };

  const getOrderInfo = () => {
    //console.log('URL', URL);
    setProgressing(true);
    Axios.get(GROCERY_ORDER_INFO, {
      params: {
        customerId: userInfo?._id,
        custom_customerId: userInfo?.custom_id,
      },
    })
      .then((response) => {
        // console.log("response?.data?.result", response?.data?.result);
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
    progressing,
    setProgressing,
    placeOrder,
    getOrderInfo,
  };
};
