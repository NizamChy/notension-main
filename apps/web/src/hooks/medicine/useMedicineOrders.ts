import { useQuery } from "@tanstack/react-query";
import { getOrders, type MedicineOrder } from "@/lib/api/medicine";
import { queryKeys } from "@/lib/api/queryKeys";
import { useSessionStore } from "@/stores/sessionStore";

const none: MedicineOrder[] = [];

/** The logged-in customer's medicine orders (see useGroceryOrders). */
export function useMedicineOrders(): {
  orders: MedicineOrder[];
  isLoading: boolean;
  isLoggedIn: boolean;
} {
  const isLoggedin = useSessionStore((s) => s.isLoggedin);
  const userInfo = useSessionStore((s) => s.userInfo);
  const id = typeof userInfo._id === "string" ? userInfo._id : "";
  const customId = typeof userInfo.custom_id === "string" ? userInfo.custom_id : undefined;
  const query = useQuery({
    queryKey: queryKeys.medicine.orders(id),
    queryFn: () => getOrders({ _id: id, custom_id: customId }),
    enabled: isLoggedin && !!id,
  });
  return { orders: query.data ?? none, isLoading: query.isLoading, isLoggedIn: !!id };
}
