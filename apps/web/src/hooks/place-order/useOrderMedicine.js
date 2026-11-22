import { useSessionStore } from "@/stores/sessionStore";
import { getApiClient } from "@/lib/apiClient";
import { useRef, useState } from "react";
import notify from "@/utils/notify";
import {
  MEDICINE_ORDER_INFO,
  MEDICINE_PLACE_ORDER,
} from "@/api-endpoints/api-endpoint";
import { MEDICINE_URL } from "@/api-endpoints/env";
import { useDispatch } from "react-redux";
import { useModuleCart } from "@/stores/useModuleCart";
import { useParams, useRouter } from "next/navigation";
import { handleUserReducer } from "@/redux/userReducer";
import { orderTotals } from "@/utils/price";

const Axios = getApiClient(MEDICINE_URL);

export const useOrderMedicine = () => {
  const [progressing, setProgressing] = useState(false);
  const orderInFlight = useRef(false);


  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();

  const userInfo = useSessionStore((s) => s.userInfo);

  const { storeInfo: medicineStoreInfo, total: totalAmountMedicine, clear: clearCart } =
    useModuleCart("medicine");

  const totalPrice = totalAmountMedicine;


  const { shippingCharge, discount, grandTotal } = orderTotals(
    medicineStoreInfo,
    totalPrice,
  );

  const placeOrder = (itemOrderObj) => {
    // Ignore repeat clicks while an order request is still in flight.
    if (orderInFlight.current) return;
    orderInFlight.current = true;
    setProgressing(true);

    Axios.post(MEDICINE_PLACE_ORDER, itemOrderObj)
      .finally(() => {
        orderInFlight.current = false;
      })
      .then((res) => {
        if (res.data.success) {
          notify.success("Order placed successfully");

          clearCart();

          router.push(
            `/medicine/${params?.store}/${params?.storeId}/${params?.customStoreId}`
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

    Axios.get(MEDICINE_ORDER_INFO, {
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
            type: "SAVE_MEDICINE_ORDER_INFO",
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
