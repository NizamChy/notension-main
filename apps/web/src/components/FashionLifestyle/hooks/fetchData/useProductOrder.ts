import { useQuery } from "@tanstack/react-query";
import { getOrders } from "@/lib/api/fashion";
import { queryKeys } from "@/lib/api/queryKeys";

// The signed-in customer's fashion orders, typed on the shared contract.
const useAllOrderByCustomer = (customerId: string | null | undefined, customId: string | null | undefined) =>
  useQuery({
    queryKey: queryKeys.fashion.orders(customerId ?? "", customId ?? ""),
    queryFn: () => getOrders({ customerId: customerId ?? "", customId: customId ?? "" }),
    enabled: !!customerId && !!customId,
  });

export const useProductOrder = () => ({ useAllOrderByCustomer });
