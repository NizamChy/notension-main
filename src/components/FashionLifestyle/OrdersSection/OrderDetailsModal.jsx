import React from "react";
import OrderDetailsContent from "./OrderDetailsContent";
import CommonModal from "@/components/shared/CommonModal/CommonModal";

const OrderDetailsModal = ({ isOpen, onClose, order }) => {
  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      className="m-4 max-w-screen-md"
    >
      <div className="max-h-[80vh] overflow-y-auto pr-1">
        <OrderDetailsContent order={order} />
      </div>
    </CommonModal>
  );
};

export default OrderDetailsModal;
