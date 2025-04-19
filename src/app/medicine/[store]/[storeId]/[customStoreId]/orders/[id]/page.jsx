import React from "react";
import OrderDetailsMobile from "@/components/Medicine/OrdersSection/OrderDetailsMobile";

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
