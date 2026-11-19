// Safe price helpers: missing / non-numeric values count as 0 instead of
// turning the whole total into NaN.
export const toNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

export const lineTotal = (item) =>
  toNumber(item?.sale_price) * toNumber(item?.quantity);

const round2 = (n) => Math.round(n * 100) / 100;

// Delivery charge, discount and grand total for a store order, from the
// store's rules:
// - delivery is min_delivery_charge once the subtotal reaches
//   min_purchage_amount, otherwise max_delivery_charge;
// - the discount (less / less_type) applies from minimum_order_for_less, a
//   percentage is capped at maximum_less, and it never exceeds the subtotal.
// Used by the cart drawer, the checkout pages and the order payloads, so they
// always agree.
export const orderTotals = (store, subTotal) => {
  const total = toNumber(subTotal);
  const shippingCharge =
    total >= toNumber(store?.min_purchage_amount)
      ? toNumber(store?.min_delivery_charge)
      : toNumber(store?.max_delivery_charge);

  const less = toNumber(store?.less);
  const maxLess = toNumber(store?.maximum_less);
  let discount = 0;
  if (less > 0 && maxLess > 0 && total >= toNumber(store?.minimum_order_for_less)) {
    discount =
      (store?.less_type || "Percent") === "Percent"
        ? Math.min((less / 100) * total, maxLess)
        : less;
  }
  discount = round2(Math.min(discount, total));

  return {
    shippingCharge,
    discount,
    grandTotal: round2(total + shippingCharge - discount),
  };
};
