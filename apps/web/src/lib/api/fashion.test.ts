import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getApiClient } from "@/lib/apiClient";
import { FASHION_BASE_URL } from "@/api-endpoints/env";
import { fashionProducts, fashionStores } from "@/demo/modules/fashion";
import { MEN_TYPE_ID } from "@/components/FashionLifestyle/utils/constants";
import { resetWarnedEndpoints } from "./validate";
import { queryKeys } from "./queryKeys";
import {
  filterProducts,
  findProduct,
  getBrands,
  getCategories,
  getOrders,
  getStore,
  getStoreCategories,
  getStoreSubCategories,
  getStoreTypes,
  getSubCategories,
  getTypes,
  placeOrder,
  type FashionProduct,
} from "./fashion";

const products = fashionProducts as FashionProduct[];
const store = (fashionStores as { _id: string }[])[0];

beforeEach(() => {
  const ls = new Map([["notension-sample-data", "on"]]);
  vi.stubGlobal("window", {
    localStorage: {
      getItem: (k: string) => ls.get(k) ?? null,
      setItem: (k: string, v: string) => void ls.set(k, v),
      removeItem: (k: string) => void ls.delete(k),
    },
  });
  resetWarnedEndpoints();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

// The order body the checkout builds for one store: a sparse cart line (no
// brand, colour or photo, no location), as for a one-size item.
const orderBody = (p: FashionProduct) => ({
  customer_id: "6650f1000000000000000001",
  custom_customer_id: "C1",
  customerInfo: {
    customer_name: "Test",
    customer_address: "Dhaka",
    contact_no: "01700000000",
    alternative_contact_no: "01700000000",
    latitude: undefined,
    longitude: undefined,
  },
  merchant_id: p.store_info._id,
  custom_merchant_id: p.store_info.custom_merchant_id,
  merchantInfo: {
    shop_name: p.store_info.shop_name,
    shop_address: p.store_info.shop_address,
    contact_no: p.store_info.contact_no || "N/A",
    alternative_contact_no: p.store_info.alternative_contact_no || "N/A",
  },
  orderItems: [
    {
      _id: p._id,
      type_info: p.type_info._id,
      brand_info: "",
      product_title_eng: p.product_title_eng,
      product_title_beng: p.product_title_beng,
      product_size: p.sizes.split(",")[0] || null,
      product_color: "",
      purchase_price: p.sale_price,
      max_retail_price: p.max_retail_price,
      sale_price: p.sale_price,
      unit_symbol: "pcs",
      max_allowed: p.max_allowed,
      quantity: 1,
      delivered_qty: 0,
      inc_qty: 1,
      ordered_img: undefined,
    },
  ],
  subTotal: p.sale_price,
  less_amount: 0,
  vatAmount: 0,
  deliveryCharge: 0,
  totalAmount: p.sale_price,
  shortNote: "",
  paymet_method: "Cash on Delivery",
});

describe("fashion API on the demo adapter", () => {
  it("every demo fashion answer matches the contract", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    expect((await getTypes()).length).toBeGreaterThan(0);
    await getCategories();
    await getSubCategories();
    expect((await getBrands()).length).toBeGreaterThan(0);
    expect((await filterProducts(MEN_TYPE_ID)).length).toBeGreaterThan(0);
    await filterProducts(MEN_TYPE_ID, { is_popular: true });

    expect((await getStore(store._id))._id).toBe(store._id);
    expect((await getStoreTypes(store._id)).length).toBeGreaterThan(0);
    await getStoreCategories(store._id);
    await getStoreSubCategories(store._id);

    const placed = await placeOrder(orderBody(products[0]));
    expect(placed.merchant_id).toBe(products[0].store_info._id);
    const orders = await getOrders({ customerId: "6650f1000000000000000001", customId: "C1" });
    expect(orders.some((o) => o._id === placed._id)).toBe(true);

    expect(warn.mock.calls.map((c) => String(c[0]))).toEqual([]);
  });

  it("finds a product of any type by id, and null for an unknown id", async () => {
    const last = products[products.length - 1];
    expect((await findProduct(last._id))?._id).toBe(last._id);
    expect(await findProduct("ffffffffffffffffffffffff")).toBeNull();
  });

  it("sends today's filter body", async () => {
    const put = vi
      .spyOn(getApiClient(FASHION_BASE_URL), "put")
      .mockResolvedValue({ data: { success: true, message: "OK", data: [] }, headers: {} });
    await filterProducts("t1", { store_id: "s1", category_info: "c1", sub_category_info: null });
    expect(put.mock.calls[0]).toEqual([
      "/api/v1/kids-product/product-info-by-type/t1",
      { store_id: "s1", category_info: "c1", sub_category_info: null },
    ]);
  });

  it("has fashion query keys", () => {
    expect(queryKeys.fashion.product("p")).toEqual(["fashion", "product", "p"]);
  });
});
