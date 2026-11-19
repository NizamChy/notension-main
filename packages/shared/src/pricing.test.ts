import { describe, expect, it } from "vitest";
import { lineTotal, orderTotals, toNumber } from "./pricing";
import { toSlug } from "./slug";

const store = {
  min_purchage_amount: 500,
  min_delivery_charge: 30,
  max_delivery_charge: 60,
  less: 10,
  less_type: "Percent",
  maximum_less: 50,
  minimum_order_for_less: 300,
};

describe("toNumber / lineTotal", () => {
  it("treats junk as 0", () => {
    expect(toNumber("abc")).toBe(0);
    expect(toNumber(undefined)).toBe(0);
    expect(toNumber("12.5")).toBe(12.5);
  });

  it("multiplies price by quantity", () => {
    expect(lineTotal({ sale_price: "120", quantity: 3 })).toBe(360);
    expect(lineTotal(null)).toBe(0);
  });
});

describe("orderTotals", () => {
  it("charges the higher delivery fee below the free-delivery threshold", () => {
    expect(orderTotals(store, 200)).toEqual({ shippingCharge: 60, discount: 0, grandTotal: 260 });
  });

  it("applies a percentage discount", () => {
    expect(orderTotals(store, 400)).toEqual({ shippingCharge: 60, discount: 40, grandTotal: 420 });
  });

  it("caps a percentage discount at maximum_less", () => {
    expect(orderTotals(store, 1000)).toEqual({ shippingCharge: 30, discount: 50, grandTotal: 980 });
  });

  it("never discounts more than the subtotal", () => {
    const flat = { ...store, less: 500, less_type: "Flat", minimum_order_for_less: 0 };
    expect(orderTotals(flat, 100).discount).toBe(100);
  });

  it("handles a missing store", () => {
    expect(orderTotals(undefined, 100)).toEqual({ shippingCharge: 0, discount: 0, grandTotal: 100 });
  });

  it("accepts numbers sent as strings", () => {
    expect(orderTotals({ ...store, less: "10", maximum_less: "50" }, "400").discount).toBe(40);
  });
});

describe("toSlug", () => {
  it("makes URL-safe slugs and keeps Bengali", () => {
    expect(toSlug("Fresh Mart & Co.")).toBe("fresh-mart-co");
    expect(toSlug("  ঢাকা  ফার্মেসি ")).toBe("ঢাকা-ফার্মেসি");
    expect(toSlug("a_b")).toBe("ab");
  });
});
