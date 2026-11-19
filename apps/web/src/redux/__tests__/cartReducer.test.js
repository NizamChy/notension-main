import { describe, expect, it } from "vitest";
import reducer, { handleCartAction } from "../cartReducer";

const run = (state, type, data) => reducer(state, handleCartAction({ type, data }));
const init = () => reducer(undefined, { type: "@@init" });
const rice = { _id: "rice", sale_price: 100, max_allowed: 2 };
const salt = { _id: "salt", sale_price: 20 };

describe("cartReducer", () => {
  it("adds an item, then raises its quantity", () => {
    let s = run(init(), "ADD_TO_CART_GROCERY", salt);
    s = run(s, "ADD_TO_CART_GROCERY", salt);
    expect(s.groceryItems).toHaveLength(1);
    expect(s.groceryItems[0].quantity).toBe(2);
    expect(s.totalAmountGrocery).toBe(40);
    expect(s.groceryCartStartAt).toBeGreaterThan(0);
  });

  it("stops at the store's per-order limit", () => {
    let s = init();
    for (let i = 0; i < 4; i++) s = run(s, "ADD_TO_CART_GROCERY", rice);
    s = run(s, "INCREMENT_QUANTITY_GROCERY", rice);
    expect(s.groceryItems[0].quantity).toBe(2);
    expect(s.totalAmountGrocery).toBe(200);
  });

  it("removes a line when decremented from 1", () => {
    let s = run(init(), "ADD_TO_CART_FOOD", salt);
    s = run(s, "DECREMENT_QUANTITY_FOOD", salt);
    expect(s.foodItems).toEqual([]);
    expect(s.totalAmountFood).toBe(0);
  });

  it("keeps the modules separate and clears one", () => {
    let s = run(init(), "ADD_TO_CART_MEDICINE", salt);
    s = run(s, "ADD_TO_CART_GROCERY", rice);
    s = run(s, "CLEAR_CART_MEDICINE");
    expect(s.medicineItems).toEqual([]);
    expect(s.medicineCartStartAt).toBe(0);
    expect(s.groceryItems).toHaveLength(1);
  });

  it("ignores unknown action types", () => {
    const s = init();
    expect(run(s, "NOPE", salt)).toBe(s);
  });
});
