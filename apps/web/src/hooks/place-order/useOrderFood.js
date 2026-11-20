import { getApiClient } from "@/lib/apiClient";
import { useRef, useState } from "react";
import notify from "@/utils/notify";
import {
  FOOD_ORDER_INFO,
  FOOD_PLACE_ORDER,
} from "@/api-endpoints/api-endpoint";
import { FOOD_URL } from "@/api-endpoints/env";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { handleCartAction } from "@/redux/cartReducer";
import { handleUserReducer } from "@/redux/userReducer";
import { orderTotals } from "@/utils/price";

const Axios = getApiClient(FOOD_URL);

export const useOrderFood = () => {
  const [progressing, setProgressing] = useState(false);
  const orderInFlight = useRef(false);

  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const userInfo = useSelector((state) => state.user.userInfo);

  const { foodStoreInfo, totalAmountFood } = useSelector((state) => state.cart);

  const totalPrice = totalAmountFood;

  const { shippingCharge, discount, grandTotal } = orderTotals(
    foodStoreInfo,
    totalPrice,
  );

  const placeOrder = (itemOrderObj) => {
    // Ignore repeat clicks while an order request is still in flight.
    if (orderInFlight.current) return;
    orderInFlight.current = true;
    setProgressing(true);

    Axios.post(FOOD_PLACE_ORDER, itemOrderObj)
      .finally(() => {
        orderInFlight.current = false;
      })
      .then((res) => {
        if (res.data.success) {
          notify.success("Order placed successfully");

          dispatch(
            handleCartAction({
              type: "CLEAR_CART_FOOD",
            })
          );

          router.push(
            `/food/store/${params?.store}/${params?.storeId}/${params?.customStoreId}`
          );
        } else {
          notify.error("We couldn't place your order. Please try again.");
        }
        setProgressing(false);
      })
      .catch((error) => {
        setProgressing(false);
        notify.error("We couldn't place your order. Please try again.");
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
        setProgressing(false);
      });

  };

  return {
    discount,
    grandTotal,
    progressing,
    shippingCharge,
    setProgressing,
    getOrderInfo,
    placeOrder,
  };
};
