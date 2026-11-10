// Demo routes for the MEDICINE backend. See src/demo/README.md for the contract.
import {
  SEARCH_MEDICINE_STORE,
  EXPLORE_MEDICINE_STORE,
  SEARCH_MEDICINE_ITEMS,
  MEDICINE_ITEMS_BY_SUBTYPE,
  MEDICINE_ITEMS_BY_CUSTOMTYPE,
  MEDICINE_ITEM_DETAILS,
  MEDICINE_PLACE_ORDER,
  MEDICINE_ORDER_INFO,
  NEAREST_MEDICINE_STORE,
  POST_NEAREST_MEDICINE_STORE,
} from "@/api-endpoints/api-endpoint";
import { demoResponse } from "../demoAdapter";
import { isDemoDistrict } from "../demoLocations";
import {
  MEDICINE_CUSTOM_TYPES,
  DEMO_MEDICINE_STORES,
  DEMO_MEDICINE_TYPES,
  DEMO_MEDICINE_SUBTYPES,
  DEMO_MEDICINE_PRODUCTS,
  DEMO_MEDICINE_ITEMS,
  DEMO_MEDICINE_SLIDER,
} from "./medicine/data";

export {
  MEDICINE_CUSTOM_TYPES,
  DEMO_MEDICINE_STORES,
  DEMO_MEDICINE_TYPES,
  DEMO_MEDICINE_SUBTYPES,
  DEMO_MEDICINE_PRODUCTS,
  DEMO_MEDICINE_ITEMS,
  DEMO_MEDICINE_SLIDER,
};

const PAGE_SIZE = 24; // useMedicine treats < 24 results as the last page

const toRad = (deg) => (deg * Math.PI) / 180;
// Distance in metres (ShopInfoCard divides by 1000 to show km).
const distanceMetres = (lat1, lng1, lat2, lng2) => {
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(a)));
};

const findStore = (storeId, customStoreId) =>
  DEMO_MEDICINE_STORES.find(
    (s) => s._id === storeId || (customStoreId && s.custom_store_id === customStoreId),
  );

const storeItems = (storeId, customStoreId) => {
  const s = findStore(storeId, customStoreId);
  return s ? DEMO_MEDICINE_ITEMS.filter((i) => i.merchantId === s._id) : [];
};

const paginate = (list, page) => {
  const p = Math.max(1, parseInt(page, 10) || 1);
  return list.slice((p - 1) * PAGE_SIZE, p * PAGE_SIZE);
};

const ok = (result, extra = {}) => ({ success: true, message: "OK", result, ...extra });

const nearestStores = ({ body, query }) => {
  const input = { ...query, ...body };
  const districtId = input.districtId;
  if (!isDemoDistrict(districtId)) return ok([]);
  const lat = parseFloat(input.shop_latitude ?? input.latitude);
  const lng = parseFloat(input.shop_longitude ?? input.longitude);
  const stores = DEMO_MEDICINE_STORES.filter((s) => s.district_id === districtId)
    .map((s) => ({
      ...s,
      distance:
        Number.isFinite(lat) && Number.isFinite(lng)
          ? distanceMetres(lat, lng, s.latitude, s.longitude)
          : undefined,
    }))
    .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
  return ok(stores);
};

// The explore-store result the dashboard and itemsByStore reducers read.
const exploreStore = ({ query }) => {
  const s = findStore(query.storeId, query.custom_store_id);
  if (!s) {
    return ok({
      ShopDetails: [],
      ProductTypeByShop: [],
      ProductSubTypeByShop: [],
      DashboardSlider: [],
      specialOfferItem: [],
      dealOfTheDay: [],
      popularItem: [],
      storeId: "",
      customstoreId: "",
    });
  }
  const items = storeItems(s._id);
  const byCustomType = (id) => items.filter((i) => i.customType.includes(id));

  const subtypes = DEMO_MEDICINE_SUBTYPES.filter((st) =>
    items.some((i) => i.productSubtype === st._id),
  ).map((st) => ({
    _id: `${st._id.slice(0, 4)}${s._id.slice(-4)}${st._id.slice(8)}`,
    typeInfo: st.typeInfo,
    sub_type_name: st.sub_type_name,
    subtypeInfo: {
      _id: st._id,
      sub_type_name: st.sub_type_name,
      banner_type_1: st.banner_type_1,
    },
  }));

  const types = DEMO_MEDICINE_TYPES.filter((t) =>
    t.statusType === "General"
      ? subtypes.some((st) => st.typeInfo === t._id)
      : byCustomType(t._id).length > 0,
  ).map((t) => ({
    _id: `${t._id.slice(0, 4)}${s._id.slice(-4)}${t._id.slice(8)}`,
    typeInfo: t._id,
    custom_type_id: t.custom_type_id,
    typeName: t.type_name,
    statusType: t.statusType,
  }));

  return ok({
    ShopDetails: [s],
    ProductTypeByShop: types,
    ProductSubTypeByShop: subtypes,
    DashboardSlider: DEMO_MEDICINE_SLIDER,
    specialOfferItem: byCustomType(MEDICINE_CUSTOM_TYPES.specialOffer),
    dealOfTheDay: byCustomType(MEDICINE_CUSTOM_TYPES.dealOfTheDay),
    popularItem: byCustomType(MEDICINE_CUSTOM_TYPES.popularItem),
    storeId: s._id,
    customstoreId: s.custom_store_id,
  });
};

// ---------------------------------------------------------------- orders

const orders = [];
let orderSeq = 2000;

const nextOrderId = () => {
  orderSeq += 1;
  return {
    _id: `66a7${Date.now().toString(16).padStart(12, "0")}${orderSeq.toString(16).padStart(8, "0")}`.slice(0, 24),
    order_id: `MED-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${orderSeq}`,
  };
};

const parseOrder = (body) => {
  if (typeof body?.orderObj === "string") {
    try {
      return JSON.parse(body.orderObj);
    } catch {
      return null;
    }
  }
  return body?.orderObj || body;
};

// One delivered order so a fresh session has some history to show.
const sampleOrder = (customerId, customCustomerId) => {
  const s = DEMO_MEDICINE_STORES[0];
  const pick = (n, qty) => {
    const item = DEMO_MEDICINE_ITEMS.find(
      (i) => i.merchantId === s._id && i.medStoreProductInfo === DEMO_MEDICINE_PRODUCTS[n - 1]._id,
    );
    return { ...item, quantity: qty, delivered_qty: qty, inc_qty: 1 };
  };
  const orderItems = [pick(1, 2), pick(9, 1), pick(31, 1)];
  const subTotal = orderItems.reduce((sum, i) => sum + i.sale_price * i.quantity, 0);
  return {
    _id: "66a700000000000000000001",
    order_id: "MED-20261102-1001",
    customer_id: customerId,
    custom_customer_id: customCustomerId,
    merchant_id: s._id,
    custom_merchant_id: s.custom_store_id,
    merchantInfo: {
      shop_name: s.shop_name,
      shop_address: s.shop_address,
      contact_no: s.contact_no,
      alternative_contact_no: s.alternative_contact_no,
    },
    order_list_image: [],
    orderItems,
    subTotal,
    less_amount: 0,
    vatAmount: 0,
    deliveryCharge: s.max_delivery_charge,
    totalAmount: subTotal + s.max_delivery_charge,
    paymet_method: "Cash on Delivery",
    shortNote: "",
    order_status: "Delivered",
    createdAt: "2026-11-02T10:15:00.000Z",
    updatedAt: "2026-11-02T13:40:00.000Z",
  };
};

const placeOrder = ({ body }) => {
  const order = parseOrder(body);
  if (!order || (!order.orderItems?.length && !order.order_list_image?.length)) {
    return demoResponse(400, { success: false, message: "Order has no items" });
  }
  const now = new Date().toISOString();
  const created = {
    ...order,
    ...nextOrderId(),
    order_status: "Pending",
    createdAt: now,
    updatedAt: now,
  };
  orders.unshift(created);
  return ok(created, { message: "Order placed successfully" });
};

const orderInfo = ({ query }) => {
  const customerId = query.customerId;
  if (!customerId) return ok([]);
  const mine = orders.filter(
    (o) =>
      o.customer_id === customerId ||
      (query.custom_customerId && o.custom_customer_id === query.custom_customerId),
  );
  return ok([...mine, sampleOrder(customerId, query.custom_customerId)]);
};

// ---------------------------------------------------------------- routes

export const routes = [
  {
    service: "MEDICINE",
    method: "POST",
    path: NEAREST_MEDICINE_STORE,
    handler: nearestStores,
  },
  {
    service: "MEDICINE",
    method: "POST",
    path: POST_NEAREST_MEDICINE_STORE,
    handler: nearestStores,
  },
  {
    service: "MEDICINE",
    method: "GET",
    path: SEARCH_MEDICINE_STORE,
    handler: ({ query }) => {
      const text = String(query.search || "").trim().toLowerCase();
      if (text.length < 1) return ok([]);
      return ok(
        DEMO_MEDICINE_STORES.filter((s) =>
          [s.shop_name, s.shop_address, s.district_area_name, s.district_name].some((f) =>
            f?.toLowerCase().includes(text),
          ),
        ),
      );
    },
  },
  {
    service: "MEDICINE",
    method: "GET",
    path: EXPLORE_MEDICINE_STORE,
    handler: exploreStore,
  },
  {
    service: "MEDICINE",
    method: "GET",
    path: SEARCH_MEDICINE_ITEMS,
    handler: ({ query }) => {
      const text = String(query.search || "").trim().toLowerCase();
      if (!text) return ok([]);
      const matches = storeItems(query.merchantId, query.custom_store_id).filter((i) =>
        [i.item_title_eng, i.item_title_beng, i.generic_name, i.company_name].some((f) =>
          f?.toLowerCase().includes(text),
        ),
      );
      return ok(paginate(matches, query.page));
    },
  },
  {
    service: "MEDICINE",
    method: "GET",
    path: MEDICINE_ITEMS_BY_SUBTYPE,
    handler: ({ query }) =>
      ok(
        paginate(
          storeItems(query.merchantId, query.custom_store_id).filter(
            (i) => i.productSubtype === query.productSubtype,
          ),
          query.page,
        ),
      ),
  },
  {
    service: "MEDICINE",
    method: "GET",
    path: MEDICINE_ITEMS_BY_CUSTOMTYPE,
    handler: ({ query }) =>
      ok(
        paginate(
          storeItems(query.merchantId, query.custom_store_id).filter((i) =>
            i.customType.includes(query.customType),
          ),
          query.page,
        ),
      ),
  },
  {
    service: "MEDICINE",
    method: "GET",
    path: MEDICINE_ITEM_DETAILS,
    handler: ({ query }) => {
      const item = storeItems(query.merchantId, query.custom_store_id).find(
        // Product pages link by the store item's _id.
        (i) =>
          i.medStoreProductInfo === query.medStoreProductInfo ||
          i._id === query.medStoreProductInfo,
      );
      return item
        ? ok(item)
        : { success: false, message: "Item not available in this store", result: null };
    },
  },
  {
    service: "MEDICINE",
    method: "POST",
    path: MEDICINE_PLACE_ORDER,
    handler: placeOrder,
  },
  {
    service: "MEDICINE",
    method: "GET",
    path: MEDICINE_ORDER_INFO,
    handler: orderInfo,
  },
];
