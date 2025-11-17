import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { FASHION_BASE_URL } from "@/api-endpoints/secret";
import { ALL_ORDER_BY_CUSTOMER } from "@/api-endpoints/api-endpoint";

const fetchOrderByCustomer = async (customerId, customId) => {
  const response = await axios.post(
    `${FASHION_BASE_URL}${ALL_ORDER_BY_CUSTOMER}`,
    {
      customer_id: customerId,
      custom_customer_id: customId,
    }
  );

  return response?.data?.result;
};

export const useProductOrder = () => {
  const useAllOrderByCustomer = (customerId, customId) => {
    return useQuery({
      queryKey: ["allOrderByCustomer", customerId, customId],
      queryFn: () => fetchOrderByCustomer(customerId, customId),
      enabled: !!customerId && !!customId,
    });
  };

  return {
    useAllOrderByCustomer,
  };
};
