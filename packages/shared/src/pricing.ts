import { z } from "zod";

// Safe number: missing / non-numeric values count as 0 instead of turning a
// whole total into NaN.
export const toNumber = (value: unknown): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

export type CartLine = { sale_price?: unknown; quantity?: unknown };

export const lineTotal = (item: CartLine | null | undefined): number =>
  toNumber(item?.sale_price) * toNumber(item?.quantity);

const round2 = (n: number) => Math.round(n * 100) / 100;

// The pricing rules a store carries. Field names (including the
// `min_purchage_amount` spelling) follow the existing API.
const money = z.coerce.number().nonnegative().catch(0);

export const storePricingSchema = z.object({
  min_purchage_amount: money,
  min_delivery_charge: money,
  max_delivery_charge: money,
  less: money,
  // "Percent" (also when missing); any other value is a flat amount.
  less_type: z.string().optional().catch(undefined),
  maximum_less: money,
  minimum_order_for_less: money,
});

export type StorePricing = z.infer<typeof storePricingSchema>;

export type OrderTotals = {
  shippingCharge: number;
  discount: number;
  grandTotal: number;
};

// Delivery charge, discount and grand total for a store order:
// - delivery is min_delivery_charge once the subtotal reaches
//   min_purchage_amount, otherwise max_delivery_charge;
// - the discount (less / less_type) applies from minimum_order_for_less, a
//   percentage is capped at maximum_less, and it never exceeds the subtotal.
// The web app shows these numbers; the API must compute the same ones.
export const orderTotals = (store: unknown, subTotal: unknown): OrderTotals => {
  const rules = storePricingSchema.parse(store ?? {});
  const total = toNumber(subTotal);

  const shippingCharge =
    total >= rules.min_purchage_amount
      ? rules.min_delivery_charge
      : rules.max_delivery_charge;

  let discount = 0;
  if (rules.less > 0 && rules.maximum_less > 0 && total >= rules.minimum_order_for_less) {
    discount =
      (rules.less_type || "Percent") === "Percent"
        ? Math.min((rules.less / 100) * total, rules.maximum_less)
        : rules.less;
  }
  discount = round2(Math.min(discount, total));

  return {
    shippingCharge,
    discount,
    grandTotal: round2(total + shippingCharge - discount),
  };
};
