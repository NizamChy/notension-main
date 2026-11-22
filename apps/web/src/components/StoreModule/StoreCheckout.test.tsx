// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { PAYMENT_DATA } from "@/components/shared/Checkout/paymentOptions";
import { useCartStore } from "@/stores/cartStore";
import { useSessionStore } from "@/stores/sessionStore";
import StoreCheckout from "./StoreCheckout";

const placeOrder = vi.fn();
vi.mock("@/hooks/grocery/usePlaceGroceryOrder", () => ({
  usePlaceGroceryOrder: () => ({ progressing: false, placeOrder }),
}));
vi.mock("next/navigation", () => ({
  useParams: () => ({ store: "demo", storeId: "store-1", customStoreId: "GS1" }),
  useRouter: () => ({ push: vi.fn() }),
}));

beforeEach(() => {
  placeOrder.mockReset();
  useSessionStore.getState().login({ _id: "cust-1", custom_id: "C1", customer_name: "Test" });
  useCartStore.getState().clear("grocery");
  useCartStore.getState().saveStoreInfo("grocery", { _id: "store-1", shop_name: "Test Store" });
  useCartStore.getState().add("grocery", {
    _id: "item-1",
    product_title_eng: "Rice",
    sale_price: 100,
    max_retail_price: 100,
  });
});

afterEach(() => {
  cleanup();
  useCartStore.getState().clear("grocery");
  useSessionStore.getState().clearAccount();
});

const sentOrder = () => {
  const form = placeOrder.mock.calls[0][0] as FormData;
  return JSON.parse(String(form.get("orderObj")));
};

test("checkout blocks a 501-character note and submits a valid form", async () => {
  render(<StoreCheckout moduleName="grocery" />);
  const note = screen.getByLabelText(/Anything the store should know/);
  const place = screen.getByRole("button", { name: /Place order/ });

  fireEvent.change(note, { target: { value: "x".repeat(501) } });
  fireEvent.click(place);
  await waitFor(() =>
    expect(screen.getByText("Keep the note under 500 characters")).toBeTruthy(),
  );
  expect(placeOrder).not.toHaveBeenCalled();

  fireEvent.change(note, { target: { value: "Call before delivery" } });
  fireEvent.click(place);
  await waitFor(() => expect(placeOrder).toHaveBeenCalledTimes(1));

  const order = sentOrder();
  expect(order.shortNote).toBe("Call before delivery");
  expect(order.paymet_method).toBe(PAYMENT_DATA[0].label);
  // The store comes from the URL, not Redux.
  expect(order.merchant_id).toBe("store-1");
  expect(order.custom_merchant_id).toBe("GS1");
  expect(order.orderItems).toHaveLength(1);
});
