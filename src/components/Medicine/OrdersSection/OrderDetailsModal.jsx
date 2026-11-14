import React from "react";
import { MEDICINE_ITEMS_IMAGES } from "@/api-endpoints/api-endpoint";
import CommonModal from "@/components/shared/CommonModal/CommonModal";
import { OrderDetails } from "@/components/Grocery/OrdersSection/OrderUI";

const OrderDetailsModal = ({ isOpen, onClose, order }) => {
  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      className="m-4 max-w-2xl rounded-2xl"
    >
      <div className="max-h-[80vh] overflow-y-auto overscroll-contain pr-1">
        <OrderDetails order={order} imageBase={MEDICINE_ITEMS_IMAGES} />
      </div>
    </CommonModal>
  );
};

export default OrderDetailsModal;
