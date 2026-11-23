import CommonModal from "@/components/shared/CommonModal/CommonModal";
import { OrderDetails, type OrderView } from "./OrderUI";

// The desktop order details popup. `imageBase` is the module's item image URL.
const OrderDetailsModal = ({
  isOpen,
  onClose,
  order,
  imageBase,
}: {
  isOpen: boolean;
  onClose: () => void;
  order: OrderView;
  imageBase: string;
}) => {
  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      className="m-4 max-w-2xl rounded-2xl"
    >
      <div className="max-h-[80vh] overflow-y-auto overscroll-contain pr-1">
        <OrderDetails order={order} imageBase={imageBase} />
      </div>
    </CommonModal>
  );
};

export default OrderDetailsModal;
