import OrderDetailsMobile from "@/components/OrdersSection/OrderDetailsMobile";
import React from "react";
import { use } from "react";

const page = async ({ params }) => {
  const { id } = await params;
  const orderId = id || null;

  return (
    <>
      <OrderDetailsMobile orderId={orderId} />
    </>
  );
};

export default page;
