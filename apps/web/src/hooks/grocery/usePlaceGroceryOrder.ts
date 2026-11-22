import { useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
// @ts-expect-error js-cookie ships no types in this repo; only remove() is used
import Cookies from "js-cookie";
import { placeOrder as postOrder } from "@/lib/api/grocery";
import { queryKeys } from "@/lib/api/queryKeys";
import { handleCartAction } from "@/redux/cartReducer";
import { useSessionStore } from "@/stores/sessionStore";
import { useModuleCart } from "@/stores/useModuleCart";
import { logout } from "@/stores/logout";
import notify, { errorMessage } from "@/utils/notify";
import { orderTotals } from "@/utils/price";

export function usePlaceGroceryOrder() {
  const [progressing, setProgressing] = useState(false);
  const orderInFlight = useRef(false);
  const router = useRouter();
  const params = useParams<{ store?: string; storeId?: string; customStoreId?: string }>();
  const dispatch = useDispatch();
  const qc = useQueryClient();
  const userInfo = useSessionStore((s) => s.userInfo);
  const { storeInfo, total, clear: clearCart } = useModuleCart("grocery");
  const { shippingCharge, discount, grandTotal } = orderTotals(storeInfo, total);

  const placeOrder = (itemOrderObj: unknown) => {
    // Ignore repeat clicks while an order request is still in flight.
    if (orderInFlight.current) return;
    orderInFlight.current = true;
    setProgressing(true);

    postOrder(itemOrderObj)
      .then((res) => {
        if (res.success) {
          notify.success("Order placed successfully");
          clearCart();
          // Keeps persist:root from holding an already-ordered cart if the previous build is rolled back; remove in PR 9.
          dispatch(handleCartAction({ type: "CLEAR_CART_GROCERY" }));
          const id = typeof userInfo._id === "string" ? userInfo._id : "";
          void qc.invalidateQueries({ queryKey: queryKeys.grocery.orders(id) });
          router.push(`/grocery/${params?.store}/${params?.storeId}/${params?.customStoreId}`);
        } else {
          notify.error("We couldn't place your order. Please try again.");
        }
      })
      .catch((error: { response?: { status?: number } }) => {
        // The new API needs a live session: an expired one logs the user out
        // here so the checkout shows the login form again.
        if (error?.response?.status === 401) {
          Cookies.remove("user_info");
          logout();
          notify.error("Your session has expired. Please log in again to place your order.");
          return;
        }
        notify.error(errorMessage(error, "We couldn't place your order. Please try again."));
      })
      .finally(() => {
        orderInFlight.current = false;
        setProgressing(false);
      });
  };

  return { progressing, placeOrder, shippingCharge, discount, grandTotal };
}
