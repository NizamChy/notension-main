import { useSessionStore } from "@/stores/sessionStore";
import { getApiClient } from "@/lib/apiClient";
import { useRef, useState } from "react";
import {
  GROCERY_ORDER_INFO,
  GROCERY_PLACE_ORDER,
} from "@/api-endpoints/api-endpoint";
import notify, { errorMessage } from "@/utils/notify";
import Cookies from "js-cookie";
import { GROCERY_URL } from "@/api-endpoints/env";
import { useDispatch } from "react-redux";
import { handleCartAction } from "@/redux/cartReducer";
import { logout } from "@/stores/logout";
import { useModuleCart } from "@/stores/useModuleCart";
import { useParams, useRouter } from "next/navigation";
import { handleUserReducer } from "@/redux/userReducer";
import { orderTotals } from "@/utils/price";

const Axios = getApiClient(GROCERY_URL);

export const useOrderGrocery = () => {
  const [progressing, setProgressing] = useState(false);
  const orderInFlight = useRef(false);


  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();

  const userInfo = useSessionStore((s) => s.userInfo);

  const { storeInfo: groceryStoreInfo, total: totalAmountGrocery, clear: clearCart } =
    useModuleCart("grocery");

  const totalPrice = totalAmountGrocery;


  const { shippingCharge, discount, grandTotal } = orderTotals(
    groceryStoreInfo,
    totalPrice,
  );

  const placeOrder = (itemOrderObj) => {
    // Ignore repeat clicks while an order request is still in flight.
    if (orderInFlight.current) return;
    orderInFlight.current = true;
    setProgressing(true);

    Axios.post(GROCERY_PLACE_ORDER, itemOrderObj)
      .finally(() => {
        orderInFlight.current = false;
      })
      .then((res) => {
        if (res.data.success) {
          notify.success("Order placed successfully");

          clearCart();
          // Keeps persist:root from holding an already-ordered cart if the previous build is rolled back; remove in PR 9.
          dispatch(handleCartAction({ type: "CLEAR_CART_GROCERY" }));

          router.push(
            `/grocery/${params?.store}/${params?.storeId}/${params?.customStoreId}`
          );
        } else {
          notify.error("We couldn't place your order. Please try again.");
        }

        setProgressing(false);
      })
      .catch((error) => {
        setProgressing(false);

        // The new API needs a live session: an expired one logs the user out
        // here so the checkout shows the login form again.
        if (error?.response?.status === 401) {
          Cookies.remove("user_info");
          logout();
          notify.error(
            "Your session has expired. Please log in again to place your order."
          );
          return;
        }
        notify.error(
          errorMessage(error, "We couldn't place your order. Please try again.")
        );
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
