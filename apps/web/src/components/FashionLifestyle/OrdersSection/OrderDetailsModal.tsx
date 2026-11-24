import React from "react";
import OrderDetailsContent from "./OrderDetailsContent";
import CommonModal from "@/components/shared/CommonModal/CommonModal";
import type { FashionOrder } from "@/lib/api/fashion";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  order: FashionOrder;
};

const OrderDetailsModal = ({ isOpen, onClose, order }: Props) => {
  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      className="m-4 max-w-(--breakpoint-md)"
    >
      <div className="max-h-[80vh] overflow-y-auto pr-1">
        <OrderDetailsContent order={order} />
      </div>
    </CommonModal>
  );
};

export default OrderDetailsModal;
