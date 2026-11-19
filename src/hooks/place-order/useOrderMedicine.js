import { getApiClient } from "@/lib/apiClient";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  MEDICINE_ORDER_INFO,
  MEDICINE_PLACE_ORDER,
} from "@/api-endpoints/api-endpoint";
import { MEDICINE_URL } from "@/api-endpoints/env";
import { useDispatch, useSelector } from "react-redux";
import { handleCartAction } from "@/redux/cartReducer";
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

  const userInfo = useSelector((state) => state.user.userInfo);

  const { medicineStoreInfo, totalAmountMedicine } = useSelector(
    (state) => state.cart
  );

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
              type: "CLEAR_CART_MEDICINE",
            })
          );

          router.push(
            `/medicine/${params?.store}/${params?.storeId}/${params?.customStoreId}`
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
