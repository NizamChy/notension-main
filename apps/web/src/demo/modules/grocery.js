// Demo routes for the GROCERY backend. See src/demo/README.md for the contract.
// Favourite items/stores are sent to USER_URL, so they live in the user module.
import {
  SEARCH_GROCERY_ITEMS,
  GROCERY_ORDER_INFO,
  GROCERY_PLACE_ORDER,
  GROCERY_ITEM_DETAILS,
  SEARCH_GROCERY_STORE,
  EXPLORE_GROCERY_STORE,
  NEAREST_GROCERY_STORE,
  GROCERY_ITEMS_BY_SUBTYPE,
  GROCERY_ITEMS_BY_CUSTOMTYPE,
} from "@/api-endpoints/api-endpoint";
import { demoResponse } from "../demoAdapter";
import { isDemoDistrict } from "../demoLocations";
import {
  DEMO_GROCERY_TYPES,
  DEMO_GROCERY_ITEMS,
  DEMO_GROCERY_STORES,
  DEMO_GROCERY_SLIDER,
  GROCERY_CUSTOM_TYPES,
  DEMO_GROCERY_SUBTYPES,
  DEMO_GROCERY_PAST_ORDERS,
} from "./grocery/data";

export {
  DEMO_GROCERY_TYPES,
  DEMO_GROCERY_ITEMS,
  DEMO_GROCERY_STORES,
  DEMO_GROCERY_SLIDER,
  GROCERY_CUSTOM_TYPES,
  DEMO_GROCERY_SUBTYPES,
  DEMO_GROCERY_PAST_ORDERS,
} from "./grocery/data";
export { DEMO_GROCERY_PRODUCTS } from "./grocery/data";

const PAGE_SIZE = 24; // useGroceryProduct treats < 24 results as the last page

const SERVICE = "GROCERY";

// Orders placed during this page session.
const placedOrders = [];
let orderSeq = 0;

const findStore = (storeId, customStoreId) =>
  DEMO_GROCERY_STORES.find(
    (s) => s._id === storeId || (customStoreId && s.custom_store_id === customStoreId),
  );

const storeItems = (query) => {
  const shop = findStore(query.groceryStoreId, query.custom_store_id);
  return shop
    ? DEMO_GROCERY_ITEMS.filter((i) => i.groceryStoreId === shop._id)
    : [];
};

const paginate = (list, page) => {
  const pageNo = Math.max(parseInt(page, 10) || 1, 1);
  return list.slice((pageNo - 1) * PAGE_SIZE, pageNo * PAGE_SIZE);
};

const toRad = (deg) => (deg * Math.PI) / 180;
const distanceMeters = (lat1, lng1, lat2, lng2) => {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return Math.round(6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const includesText = (value, text) =>
  String(value || "").toLowerCase().includes(text);

// ------------------------------------------------------------- handlers

const nearestStores = ({ body }) => {
  const { districtId, shop_latitude, shop_longitude } = body || {};
  if (!isDemoDistrict(districtId)) return { success: true, result: [] };

  const lat = parseFloat(shop_latitude);
  const lng = parseFloat(shop_longitude);
  const hasPosition = Number.isFinite(lat) && Number.isFinite(lng);

  const result = DEMO_GROCERY_STORES.filter((s) => s.districtId === districtId)
    .map((s) => ({
      ...s,
      distance: hasPosition
        ? distanceMeters(lat, lng, s.shop_latitude, s.shop_longitude)
        : 0,
    }))
    .sort((a, b) => a.distance - b.distance);

  return { success: true, result };
};

const searchStores = ({ query }) => {
  const text = String(query.search || "").trim().toLowerCase();
  if (text.length < 2) return { success: true, result: [] };

  const result = DEMO_GROCERY_STORES.filter(
    (s) =>
      includesText(s.shop_name, text) ||
      includesText(s.shop_address, text) ||
      includesText(s.district_area_name, text),
  );
  return { success: true, result };
};

const exploreStore = ({ query }) => {
  const shop = findStore(query.storeId, query.custom_store_id);
  if (!shop) {
    return {
      success: false,
      message: "Store not found",
      result: { ShopDetails: [] },
    };
  }

  const items = DEMO_GROCERY_ITEMS.filter((i) => i.groceryStoreId === shop._id);
  const carried = (key, id) => items.some((i) => i[key] === id);
  const byCustomType = (id) =>
    items.filter((i) => i.customType.includes(id)).slice(0, PAGE_SIZE);

  const ProductTypeByShop = DEMO_GROCERY_TYPES.filter((t) =>
    t.statusType === "General"
      ? carried("productType", t._id)
      : items.some((i) => i.customType.includes(t._id)),
  ).map((t, index) => ({
    _id: `${shop._id.slice(0, 20)}${(0x100 + index).toString(16).padStart(4, "0")}`,
    storeInfo: shop._id,
    typeInfo: t._id,
    custom_type_id: t.custom_type_id,
    typeName: t.type_name,
    statusType: t.statusType,
  }));

  const ProductSubTypeByShop = DEMO_GROCERY_SUBTYPES.filter((s) =>
    carried("productSubtype", s._id),
  ).map((s, index) => ({
    _id: `${shop._id.slice(0, 20)}${(0x200 + index).toString(16).padStart(4, "0")}`,
    storeInfo: shop._id,
    typeInfo: s.typeInfo,
    sub_type_name: s.sub_type_name,
    subtypeInfo: {
      _id: s._id,
      sub_type_name: s.sub_type_name,
      custom_sub_type_id: s.custom_sub_type_id,
      banner_type_1: s.banner_type_1,
    },
  }));

  return {
    success: true,
    result: {
      storeId: shop._id,
      customstoreId: shop.custom_store_id,
      ShopDetails: [shop],
      ProductTypeByShop,
      ProductSubTypeByShop,
      DashboardSlider: DEMO_GROCERY_SLIDER,
      specialOfferItem: byCustomType(GROCERY_CUSTOM_TYPES.specialOffer),
      dealOfTheDay: byCustomType(GROCERY_CUSTOM_TYPES.dealOfTheDay),
      popularItem: byCustomType(GROCERY_CUSTOM_TYPES.popularItem),
    },
  };
};

const searchItems = ({ query }) => {
  const text = String(query.search || "").trim().toLowerCase();
  if (text.length < 2) return { success: true, result: [] };

  const matches = storeItems(query).filter(
    (i) =>
      includesText(i.product_title_eng, text) ||
      includesText(i.product_title_beng, text),
  );
  return { success: true, result: paginate(matches, query.page) };
};

const itemsBySubtype = ({ query }) => ({
  success: true,
  result: paginate(
    storeItems(query).filter((i) => i.productSubtype === query.productSubtype),
    query.page,
  ),
});

const itemsByCustomType = ({ query }) => ({
  success: true,
  result: paginate(
    storeItems(query).filter((i) => i.customType.includes(query.customType)),
    query.page,
  ),
});

const itemDetails = ({ query }) => {
  const item = storeItems(query).find(
    (i) =>
      i.productInfoTable === query.productInfoTable ||
      i._id === query.productInfoTable,
  );
  if (!item) {
    return { success: false, message: "Item is not available in this store" };
  }
  return { success: true, result: item };
};

const parseOrder = (body) => {
  if (typeof body?.orderObj === "string") {
    try {
      return JSON.parse(body.orderObj);
    } catch {
      return null;
    }
  }
  return body?.orderObj || body || null;
};

const placeOrder = ({ body }) => {
  const order = parseOrder(body);
  if (!order || !(order.orderItems?.length > 0)) {
    return demoResponse(400, { success: false, message: "Cart is empty" });
  }

  orderSeq += 1;
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");
  const saved = {
    ...order,
    _id: `6650f2000000${(Date.now() % 0xffffffff).toString(16).padStart(8, "0")}${orderSeq
      .toString(16)
      .padStart(4, "0")}`,
    order_id: `GRO-${datePart}-${String(2000 + orderSeq)}`,
    order_status: "Pending",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
  placedOrders.unshift(saved);

  return { success: true, message: "Order placed successfully", result: saved };
};

const orderInfo = ({ query }) => {
  if (!query.customerId) return { success: true, result: [] };

  const mine = placedOrders.filter(
    (o) => !o.customer_id || o.customer_id === query.customerId,
  );
  const history = DEMO_GROCERY_PAST_ORDERS.map((o) => ({
    ...o,
    customer_id: query.customerId,
    custom_customer_id: query.custom_customerId,
  }));
  return { success: true, result: [...mine, ...history] };
};

export const routes = [
  { service: SERVICE, method: "POST", path: NEAREST_GROCERY_STORE, handler: nearestStores },
  { service: SERVICE, method: "GET", path: SEARCH_GROCERY_STORE, handler: searchStores },
  { service: SERVICE, method: "GET", path: EXPLORE_GROCERY_STORE, handler: exploreStore },
  { service: SERVICE, method: "GET", path: SEARCH_GROCERY_ITEMS, handler: searchItems },
  { service: SERVICE, method: "GET", path: GROCERY_ITEMS_BY_SUBTYPE, handler: itemsBySubtype },
  { service: SERVICE, method: "GET", path: GROCERY_ITEMS_BY_CUSTOMTYPE, handler: itemsByCustomType },
  { service: SERVICE, method: "GET", path: GROCERY_ITEM_DETAILS, handler: itemDetails },
  { service: SERVICE, method: "POST", path: GROCERY_PLACE_ORDER, handler: placeOrder },
  { service: SERVICE, method: "GET", path: GROCERY_ORDER_INFO, handler: orderInfo },
];
