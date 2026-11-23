import { useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { placeOrder as postOrder } from "@/lib/api/medicine";
import { queryKeys } from "@/lib/api/queryKeys";
import { useSessionStore } from "@/stores/sessionStore";
import { useModuleCart } from "@/stores/useModuleCart";
import { logout } from "@/stores/logout";
import notify, { errorMessage } from "@/utils/notify";
import { orderTotals } from "@/utils/price";

/** Places a medicine order (same flow as usePlaceGroceryOrder). */
export function usePlaceMedicineOrder() {
  const [progressing, setProgressing] = useState(false);
  const orderInFlight = useRef(false);
  const router = useRouter();
  const params = useParams<{ store?: string; storeId?: string; customStoreId?: string }>();
  const qc = useQueryClient();
  const userInfo = useSessionStore((s) => s.userInfo);
  const { storeInfo, total, clear: clearCart } = useModuleCart("medicine");
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
          const id = typeof userInfo._id === "string" ? userInfo._id : "";
          void qc.invalidateQueries({ queryKey: queryKeys.medicine.orders(id) });
          router.push(`/medicine/${params?.store}/${params?.storeId}/${params?.customStoreId}`);
        } else {
          notify.error("We couldn't place your order. Please try again.");
        }
      })
      .catch((error: { response?: { status?: number } }) => {
        // An expired session logs the user out so the checkout shows the
        // login form again (the old medicine hook showed a generic error).
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
