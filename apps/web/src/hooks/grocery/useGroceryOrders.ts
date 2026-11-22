import { useQuery } from "@tanstack/react-query";
import { getOrders, type Order } from "@/lib/api/grocery";
import { queryKeys } from "@/lib/api/queryKeys";
import { useSessionStore } from "@/stores/sessionStore";

const none: Order[] = [];

/** The logged-in customer's grocery orders. */
export function useGroceryOrders(): { orders: Order[]; isLoading: boolean } {
  const isLoggedin = useSessionStore((s) => s.isLoggedin);
  const userInfo = useSessionStore((s) => s.userInfo);
  const id = typeof userInfo._id === "string" ? userInfo._id : "";
  const customId = typeof userInfo.custom_id === "string" ? userInfo.custom_id : undefined;
  const query = useQuery({
    queryKey: queryKeys.grocery.orders(id),
    queryFn: () => getOrders({ _id: id, custom_id: customId }),
    enabled: isLoggedin && !!id,
  });
  return { orders: query.data ?? none, isLoading: query.isLoading };
}
