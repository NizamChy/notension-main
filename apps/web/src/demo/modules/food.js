// Demo routes for the FOOD backend. See src/demo/README.md for the contract.
//
// Images: every image field holds a path under public/demo/ (food/*.webp).
// Product category icons (`banner_type_1`) are rendered as
// `${FOOD_SLIDER_TYPE_SUBTYPE_IMAGES}/${file}`, which resolves to
// /demo-images/food-slider-type-subtype-images/food/<file>
// -> public/demo/food/<file>.
import {
  FOOD_ORDER_INFO,
  FOOD_PLACE_ORDER,
  SEARCH_FOOD_STORE,
  EXPLORE_FOOD_STORE,
  NEAREST_FOOD_STORE,
  EXPLORE_FOOD_MODULE,
} from "@/api-endpoints/api-endpoint";
import { demoResponse } from "../demoAdapter";
import { isDemoDistrict } from "../demoLocations";

import {
  hexId,
  DEMO_FOOD_STORE_CATEGORIES,
  DEMO_FOOD_PRODUCT_CATEGORIES,
  DEMO_FOOD_STORES,
  DEMO_FOOD_ITEMS,
  DEMO_FOOD_SLIDERS,
  ok,
  toNum,
  distanceMetres,
  publicStore,
  inCategory,
  datePart,
  merchantInfoOf,
  pastOrdersFor,
} from "./food/data";

// Orders placed in demo mode (kept in memory for the page session).
const placedOrders = [];
let orderCounter = 0;

export { DEMO_FOOD_STORE_CATEGORIES, DEMO_FOOD_PRODUCT_CATEGORIES, DEMO_FOOD_STORES, DEMO_FOOD_ITEMS, DEMO_FOOD_SLIDERS };

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

export const routes = [
  {
    service: "FOOD",
    method: "GET",
    path: EXPLORE_FOOD_MODULE,
    handler: ({ query }) => {
      // Store categories are global configuration; sliders are per district.
      const slider = DEMO_FOOD_SLIDERS[query.district_id];
      return ok({
        shopCategory: DEMO_FOOD_STORE_CATEGORIES.map(({ key: _key, ...c }) => c),
        DashboardSlider: slider ? [slider] : [],
      });
    },
  },
  {
    service: "FOOD",
    method: "POST",
    path: NEAREST_FOOD_STORE,
    handler: ({ body }) => {
      if (!isDemoDistrict(body.district_id)) return ok([]);

      const lat = toNum(body.shop_latitude);
      const lng = toNum(body.shop_longitude);
      const maxDistance = toNum(body.max_distance);
      const hasPoint = lat !== null && lng !== null;

      const stores = DEMO_FOOD_STORES.filter(
        (s) =>
          s.district_id === body.district_id &&
          inCategory(s, body.StoreCategory),
      )
        .map((s) => ({
          ...publicStore(s),
          ...(hasPoint && {
            distance: distanceMetres(lat, lng, s.shop_latitude, s.shop_longitude),
          }),
        }))
        .filter((s) => !hasPoint || !maxDistance || s.distance <= maxDistance)
        .sort((a, b) => (a.distance || 0) - (b.distance || 0));

      return ok(stores);
    },
  },
  {
    service: "FOOD",
    method: "GET",
    path: SEARCH_FOOD_STORE,
    handler: ({ query }) => {
      const text = String(query.search || "").trim().toLowerCase();
      if (!text) return ok([]);

      const stores = DEMO_FOOD_STORES.filter((s) => {
        if (!inCategory(s, query.StoreCategory)) return false;
        const menu = DEMO_FOOD_ITEMS.filter((i) => i.storeId === s._id);
        return (
          s.shop_name.toLowerCase().includes(text) ||
          s.shop_address.toLowerCase().includes(text) ||
          s.district_area_name.toLowerCase().includes(text) ||
          menu.some((i) => i.product_title_eng.toLowerCase().includes(text))
        );
      }).map(publicStore);

      return ok(stores);
    },
  },
  {
    service: "FOOD",
    method: "GET",
    path: EXPLORE_FOOD_STORE,
    handler: ({ query }) => {
      const store = DEMO_FOOD_STORES.find(
        (s) =>
          s._id === query.storeId ||
          (query.custom_store_id && s.custom_store_id === query.custom_store_id),
      );

      if (!store) {
        return ok({
          shopDetails: [],
          allProductCategory: [],
          allProduct: [],
          storeId: query.storeId || "",
          customstoreId: query.custom_store_id || "",
        });
      }

      const allProduct = DEMO_FOOD_ITEMS.filter((i) => i.storeId === store._id);
      const allProductCategory = DEMO_FOOD_PRODUCT_CATEGORIES.filter((c) =>
        allProduct.some((i) => i.productCategory === c._id),
      ).map(({ key: _key, ...categoryInfo }) => ({
        _id: categoryInfo._id,
        categoryName: categoryInfo.category_name,
        categoryInfo,
        totalProduct: allProduct.filter(
          (i) => i.productCategory === categoryInfo._id,
        ).length,
      }));

      return ok({
        shopDetails: [publicStore(store)],
        allProductCategory,
        allProduct,
        storeId: store._id,
        customstoreId: store.custom_store_id,
      });
    },
  },
  {
    service: "FOOD",
    method: "POST",
    path: FOOD_PLACE_ORDER,
    handler: ({ body }) => {
      const store = DEMO_FOOD_STORES.find((s) => s._id === body.merchant_id);
      if (!store) {
        return demoResponse(400, { success: false, message: "Store not found" });
      }
      if (store.is_closed) {
        return demoResponse(400, {
          success: false,
          message: "This store is closed right now",
        });
      }
      if (!Array.isArray(body.orderItems) || body.orderItems.length < 1) {
        return demoResponse(400, { success: false, message: "Cart is empty" });
      }

      orderCounter += 1;
      const now = new Date();
      const order = {
        ...body,
        _id: hexId("60", orderCounter),
        order_id: `FOOD-${datePart(now)}-${2000 + orderCounter}`,
        merchantInfo: body.merchantInfo?.shop_name
          ? body.merchantInfo
          : merchantInfoOf(store),
        order_status: "Pending",
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };
      placedOrders.unshift(order);

      return {
        success: true,
        status: 200,
        message: "Order placed successfully",
        order_id: order.order_id,
        result: order,
      };
    },
  },
  {
    service: "FOOD",
    method: "GET",
    path: FOOD_ORDER_INFO,
    handler: ({ query }) => {
      const { customerId, custom_customerId: customCustomerId } = query;
      if (!customerId) return ok([]);

      const mine = placedOrders.filter((o) => o.customer_id === customerId);
      return ok([...mine, ...pastOrdersFor(customerId, customCustomerId)]);
    },
  },
];
