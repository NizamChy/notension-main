import React from "react";
import toast from "react-hot-toast";
import { FaShop } from "react-icons/fa6";
import { lineTotal } from "@/utils/price";
import { FASHION_IMAGE_URL } from "@/api-endpoints/env";
import {
  formatTaka,
  PriceRow,
  PrimaryButton,
} from "@/components/shared/CartUI/CartUI";
import {
  SummaryCard,
  SummaryItem,
} from "@/components/shared/Checkout/CheckoutUI";

// Order summary grouped by shop. Each shop becomes its own order.
const OrderSummary = ({
  items,
  subtotal,
  deliveryCharge,
  total,
  removeFromCart,
  formId,
  isSubmitting,
}) => {
  const handleRemoveItem = (productId, selectedSize, selectedImage) => {
    removeFromCart(productId, selectedSize, selectedImage);
    toast.dismiss();
    toast.success("Item removed from bag");
  };

  const groupedItems = items.reduce((groups, item) => {
    const storeId = item?.store_info?._id;
    if (!groups[storeId]) {
      groups[storeId] = { shop_name: item?.store_info?.shop_name, items: [] };
    }
    groups[storeId].items.push(item);
    return groups;
  }, {});
  const stores = Object.values(groupedItems);

  const itemCount = items.reduce((sum, item) => sum + (item?.quantity || 0), 0);

  return (
    <SummaryCard
      meta={`${itemCount} item${itemCount === 1 ? "" : "s"}`}
      footer={
        <>
          <PrimaryButton type="submit" form={formId} disabled={isSubmitting}>
            {isSubmitting ? "Placing order…" : `Place order · ${formatTaka(total)}`}
          </PrimaryButton>
          {stores.length > 1 && (
            <p className="mt-3 text-center text-xs text-gray-500">
              Your bag has items from {stores.length} shops, so we&apos;ll place{" "}
              {stores.length} separate orders.
            </p>
          )}
        </>
      }
    >
      <div className="max-h-[360px] space-y-5 overflow-y-auto pr-1">
        {stores.map((store, idx) => {
          const storeSubtotal = store.items.reduce(
            (sum, item) => sum + lineTotal(item),
            0
          );
          return (
            <div key={store?.shop_name || idx}>
              <p className="mb-3 flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                <span className="flex min-w-0 items-center gap-1.5">
                  <FaShop className="shrink-0 text-sm" />
                  <span className="truncate">{store?.shop_name || "Shop"}</span>
                </span>
                {stores.length > 1 && (
                  <span className="tabular-nums normal-case tracking-normal">
                    {formatTaka(storeSubtotal)}
                  </span>
                )}
              </p>
              <ul className="divide-y divide-gray-100">
                {store.items.map((item, index) => (
                  <SummaryItem
                    key={`${item?._id}-${item?.selectedSize}-${index}`}
                    image={
                      item?.web_image
                        ? `${FASHION_IMAGE_URL}/${item.web_image}`
                        : null
                    }
                    title={item?.product_title_eng}
                    meta={[
                      item?.selectedSize && `Size ${item.selectedSize}`,
                      `${formatTaka(item?.sale_price)} each`,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                    quantity={item?.quantity}
                    total={formatTaka(lineTotal(item))}
                    onRemove={() =>
                      handleRemoveItem(
                        item?._id,
                        item?.selectedSize,
                        item?.selectedImage
                      )
                    }
                  />
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
        <PriceRow label="Subtotal" value={formatTaka(subtotal)} />
        <PriceRow
          label="Delivery charge"
          value={deliveryCharge > 0 ? formatTaka(deliveryCharge) : "Free"}
        />
        <PriceRow label="Total" value={formatTaka(total)} strong />
      </div>
    </SummaryCard>
  );
};

export default OrderSummary;
