import React from "react";
import { OrderDetails } from "./OrderUI";
import { GROCERY_ITEMS_IMAGES } from "@/api-endpoints/api-endpoint";
import CommonModal from "@/components/shared/CommonModal/CommonModal";

const OrderDetailsModal = ({ isOpen, onClose, order }) => {
  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      className="m-4 max-w-2xl rounded-2xl"
    >
      <div className="max-h-[80vh] overflow-y-auto overscroll-contain pr-1">
        <OrderDetails order={order} imageBase={GROCERY_ITEMS_IMAGES} />
      </div>
    </CommonModal>
  );
};

export default OrderDetailsModal;
