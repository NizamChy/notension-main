// Demo routes for the fashion & lifestyle backend (FASHION_BASE_URL).
// See src/demo/README.md for the contract. Data lives in ./fashion/data.js.
//
// The fashion components call the global axios with absolute URLs; demo mode
// swaps axios.defaults.adapter (src/demo/installDemoMode.js), so the same
// demoAdapter answers them under service "FASHION".

import {
  ALL_TYPE,
  ALL_BRAND,
  ALL_CATEGORY,
  KIDS_PRODUCT,
  MENS_PRODUCT,
  CREATE_ORDER,
  WOMENS_PRODUCT,
  ALL_SUB_CATEGORY,
  ALL_TYPE_BY_STORE,
  SINGLE_STORE_INFO,
  KIDS_PRODUCT_BY_TYPE,
  ALL_ORDER_BY_CUSTOMER,
  ALL_CATEGORY_BY_STORE,
  ALL_SUB_CATEGORY_BY_STORE,
} from "@/api-endpoints/api-endpoint";
import { demoResponse } from "../demoAdapter";
import {
  MEN_TYPE_ID,
  WOMEN_TYPE_ID,
  KIDS_TYPE_ID,
} from "@/components/FashionLifestyle/utils/constants";
import {
  fashionTypes,
  fashionBrands,
  fashionStores,
  fashionProducts,
  fashionCategories,
  fashionSeedOrders,
  fashionSubCategories,
} from "./fashion/data";

export {
  fashionTypes,
  fashionBrands,
  fashionStores,
  fashionProducts,
  fashionCategories,
  fashionSeedOrders,
  fashionSubCategories,
};

const ok = (data) => ({ success: true, message: "Success", data });

const productsOfType = (typeId) =>
  fashionProducts.filter((p) => p.type_info._id === typeId);

const storeProducts = (storeId) =>
  fashionProducts.filter((p) => p.store_info._id === storeId);

const unique = (values) => [...new Set(values)];

// Id of a store/entity link document (24 hex chars, stable per pair).
const linkId = (entityId, storeId) =>
  `${entityId.slice(0, 8)}${entityId.slice(-8)}${storeId.slice(-8)}`;

const isSet = (value) => value !== undefined && value !== null && value !== "";

// PUT /product-info-by-type/:typeId with any of
// { store_id, category_info, sub_category_info, is_popular, search_text }.
const filterProductsByType = ({ params, body }) => {
  const {
    store_id: storeId,
    category_info: categoryId,
    sub_category_info: subCategoryId,
    is_popular: isPopular,
    search_text: searchText,
  } = body || {};

  let products = productsOfType(params.typeId);
  if (isSet(storeId)) {
    products = products.filter((p) => p.store_info._id === storeId);
  }
  if (isSet(categoryId)) {
    products = products.filter((p) => p.category_info._id === categoryId);
  }
  if (isSet(subCategoryId)) {
    products = products.filter((p) => p.sub_category_info._id === subCategoryId);
  }
  if (isPopular === true || isPopular === "true") {
    products = products.filter((p) => p.is_popular);
  }
  if (isSet(searchText)) {
    const needle = String(searchText).trim().toLowerCase();
    products = products.filter((p) =>
      [
        p.product_title_eng,
        p.category_info.category_name,
        p.sub_category_info.sub_category_name,
        p.brand_info.brand_name,
      ].some((field) => field.toLowerCase().includes(needle)),
    );
  }
  return ok(products);
};

const typesByStore = ({ params }) => {
  const products = storeProducts(params.storeId);
  const typeIds = unique(products.map((p) => p.type_info._id));
  return ok(
    fashionTypes
      .filter((t) => typeIds.includes(t._id))
      .map((t) => ({
        _id: linkId(t._id, params.storeId),
        store_info: params.storeId,
        type_info: { _id: t._id, type_name: t.type_name, type_img: t.type_img },
      })),
  );
};

const categoriesByStore = ({ params }) => {
  const products = storeProducts(params.storeId);
  const categoryIds = unique(products.map((p) => p.category_info._id));
  return ok(
    fashionCategories
      .filter((c) => categoryIds.includes(c._id))
      .map((c) => ({
        _id: linkId(c._id, params.storeId),
        store_info: params.storeId,
        type_info: c.type_info,
        category_info: {
          _id: c._id,
          category_name: c.category_name,
          banner: c.banner,
          type_info: c.type_info,
        },
      })),
  );
};

const subCategoriesByStore = ({ params }) => {
  const products = storeProducts(params.storeId);
  const subIds = unique(products.map((p) => p.sub_category_info._id));
  return ok(
    fashionSubCategories
      .filter((s) => subIds.includes(s._id))
      .map((s) => ({
        _id: linkId(s._id, params.storeId),
        store_info: params.storeId,
        type_info: s.type_info,
        category_info: s.category_info._id,
        sub_category_info: {
          _id: s._id,
          sub_category_name: s.sub_category_name,
          banner_type_1: s.banner_type_1,
          banner_type_2: s.banner_type_2,
        },
      })),
  );
};

// ---------------------------------------------------------------- orders --

const createdOrders = [];
let orderSeq = 0;

const newOrderId = () => {
  orderSeq += 1;
  const stamp = Date.now().toString(16).padStart(12, "0").slice(-12);
  return `f0${stamp}${orderSeq.toString(16).padStart(10, "0")}`;
};

const orderNumber = (date) => {
  const ymd = date.toISOString().slice(0, 10).replace(/-/g, "");
  return `FSN-${ymd}-${String(100300 + createdOrders.length + 1)}`;
};

const toNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const createOrder = ({ body }) => {
  const items = Array.isArray(body?.orderItems) ? body.orderItems : [];
  if (items.length === 0) {
    return demoResponse(400, {
      success: false,
      message: "Order must contain at least one item",
    });
  }

  const now = new Date();
  const orderItems = items.map((item) => {
    const product = fashionProducts.find((p) => p._id === item?._id);
    const image = item?.ordered_img || product?.web_image || null;
    return {
      ...item,
      quantity: toNumber(item?.quantity) || 1,
      sale_price: toNumber(item?.sale_price ?? product?.sale_price),
      app_image: image,
      web_image: product?.web_image || image,
    };
  });
  const subTotal = orderItems.reduce(
    (sum, item) => sum + item.sale_price * item.quantity,
    0,
  );
  const deliveryCharge = toNumber(body?.deliveryCharge);
  const lessAmount = toNumber(body?.less_amount);

  const order = {
    ...body,
    _id: newOrderId(),
    order_id: orderNumber(now),
    orderItems,
    subTotal,
    deliveryCharge,
    less_amount: lessAmount,
    vatAmount: toNumber(body?.vatAmount),
    totalAmount: subTotal + deliveryCharge - lessAmount,
    order_status: "Pending",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
  createdOrders.unshift(order);

  return {
    success: true,
    message: "Order placed successfully",
    data: order,
    result: order,
  };
};

const ordersByCustomer = ({ body }) => {
  const customerId = body?.customer_id;
  const customId = body?.custom_customer_id;
  if (!isSet(customerId) && !isSet(customId)) {
    return { success: true, message: "Success", result: [] };
  }

  const mine = createdOrders.filter(
    (o) =>
      (isSet(customerId) && o.customer_id === customerId) ||
      (isSet(customId) && o.custom_customer_id === customId),
  );
  const history = fashionSeedOrders.map((o) => ({
    ...o,
    customer_id: customerId,
    custom_customer_id: customId,
  }));

  return { success: true, message: "Success", result: [...mine, ...history] };
};

// ---------------------------------------------------------------- routes --

export const routes = [
  { service: "FASHION", method: "GET", path: ALL_TYPE, handler: () => ok(fashionTypes) },
  { service: "FASHION", method: "GET", path: ALL_BRAND, handler: () => ok(fashionBrands) },
  { service: "FASHION", method: "GET", path: ALL_CATEGORY, handler: () => ok(fashionCategories) },
  { service: "FASHION", method: "GET", path: ALL_SUB_CATEGORY, handler: () => ok(fashionSubCategories) },
  { service: "FASHION", method: "GET", path: MENS_PRODUCT, handler: () => ok(productsOfType(MEN_TYPE_ID)) },
  { service: "FASHION", method: "GET", path: WOMENS_PRODUCT, handler: () => ok(productsOfType(WOMEN_TYPE_ID)) },
  { service: "FASHION", method: "GET", path: KIDS_PRODUCT, handler: () => ok(productsOfType(KIDS_TYPE_ID)) },
  {
    service: "FASHION",
    method: "PUT",
    path: `${KIDS_PRODUCT_BY_TYPE}/:typeId`,
    handler: filterProductsByType,
  },
  {
    service: "FASHION",
    method: "GET",
    path: `${SINGLE_STORE_INFO}/:storeId`,
    handler: ({ params }) => {
      const store = fashionStores.find((s) => s._id === params.storeId);
      if (!store) {
        return demoResponse(404, { success: false, message: "Store not found", data: null });
      }
      return ok(store);
    },
  },
  { service: "FASHION", method: "GET", path: `${ALL_TYPE_BY_STORE}/:storeId`, handler: typesByStore },
  { service: "FASHION", method: "GET", path: `${ALL_CATEGORY_BY_STORE}/:storeId`, handler: categoriesByStore },
  { service: "FASHION", method: "GET", path: `${ALL_SUB_CATEGORY_BY_STORE}/:storeId`, handler: subCategoriesByStore },
  { service: "FASHION", method: "POST", path: CREATE_ORDER, handler: createOrder },
  { service: "FASHION", method: "POST", path: ALL_ORDER_BY_CUSTOMER, handler: ordersByCustomer },
];
