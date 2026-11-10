// Demo routes for the USER backend (customer login and favourites).
// See src/demo/README.md for the contract.
//
// Login: the frontend makes a random 4-digit OTP itself, sends it in the
// send-otp body and checks the typed value against it. No SMS is sent in demo
// mode, so the send-otp handler shows that OTP in a toast.
//
// ALL_DISTRICTS has no routes: nothing in the app sends requests to it.
import toast from "react-hot-toast";
import {
  USER_REGISTRATION,
  OTP_FOR_REGISTRATION,
  FAVORITE_STORE_ADD,
  FAVORITE_STORE_PUSH,
  FAVORITE_STORE_REMOVE,
  FAVORITE_STORE_INFO,
  FAVORITE_PRODUCT_ADD,
  FAVORITE_PRODUCT_PUSH,
  FAVORITE_PRODUCT_REMOVE,
  FAVORITE_PRODUCT_INFO,
  ADD_TO_FAVOURITE,
  PUSH_TO_FAVOURITE,
  REMOVE_FROM_FAVOURITE,
  FAVORITE_INFO,
} from "@/api-endpoints/api-endpoint";
import { demoResponse } from "../demoAdapter";
import { DEFAULT_DEMO_LOCATION } from "../demoLocations";

const NO_AREA_ID = "303030303030303030303030";

const randomHexId = () =>
  Array.from({ length: 24 }, () =>
    Math.floor(Math.random() * 16).toString(16),
  ).join("");

const isBdMobile = (value) => /^01\d{9}$/.test(String(value || "").trim());

const fail = (message) => demoResponse(400, { success: false, message });

// ---- Users -------------------------------------------------------------

let nextCustomId = 2;

// useUser.js reads location.coordinates as [latitude, longitude].
const users = [
  {
    _id: "65a1d0c0e4b0a1b2c3d4e5f6",
    custom_id: "CUS0000001",
    customer_name: "Demo User",
    customer_address: "House 12, Road 45, Gulshan 2, Dhaka",
    email: "demo.user@example.com",
    contact_no: "01700000000",
    alternative_contact_no: "",
    district_id: DEFAULT_DEMO_LOCATION.districtId,
    district_name_by_location: DEFAULT_DEMO_LOCATION.districtName,
    district_area_id: NO_AREA_ID,
    district_subarea_id: NO_AREA_ID,
    ref_contact: "",
    location: {
      type: "Point",
      coordinates: [
        DEFAULT_DEMO_LOCATION.latitude,
        DEFAULT_DEMO_LOCATION.longitude,
      ],
    },
  },
];

const findUser = ({ _id, contact_no } = {}) =>
  users.find((u) => (_id && u._id === _id) || u.contact_no === contact_no);

const sendOtp = ({ body }) => {
  const contactNo = String(body?.contact_no || "").trim();
  if (!isBdMobile(contactNo)) return fail("Invalid mobile number");

  if (typeof window !== "undefined" && body?.otp) {
    toast(`Demo mode: no SMS is sent. Your OTP is ${body.otp}`, {
      id: "demo-otp",
      icon: "🔑",
      duration: 20000,
    });
  }

  const user = findUser({ contact_no: contactNo });
  return {
    success: true,
    message: "OTP sent",
    user_exist: Boolean(user),
    result: user || null,
  };
};

// The same endpoint logs in, registers, and updates name/address.
// useUser.js sends latitude/longitude swapped (longitude: userLatitude), so
// [body.longitude, body.latitude] is [latitude, longitude].
const register = ({ body }) => {
  const contactNo = String(body?.contact_no || "").trim();
  if (!isBdMobile(contactNo)) return fail("Invalid mobile number");

  const fields = {
    customer_name: body.customer_name || "",
    customer_address: body.customer_address || "",
    email: body.email || "",
    contact_no: contactNo,
    alternative_contact_no: body.alternative_contact_no || "",
    district_id: body.district_id || NO_AREA_ID,
    district_name_by_location: body.district_name_by_location || "",
    district_area_id: body.district_area_id || NO_AREA_ID,
    district_subarea_id: body.district_subarea_id || NO_AREA_ID,
    ref_contact: body.ref_contact || "",
  };
  const coordinates = [Number(body.longitude), Number(body.latitude)];
  if (coordinates.every(Number.isFinite)) {
    fields.location = { type: "Point", coordinates };
  }

  const existing = findUser({ _id: body._id, contact_no: contactNo });
  if (existing) {
    Object.assign(existing, fields);
    return { success: true, message: "Login successful", result: existing };
  }

  const user = {
    _id: randomHexId(),
    custom_id: `CUS${String(nextCustomId++).padStart(7, "0")}`,
    ...fields,
    location: fields.location || {
      type: "Point",
      coordinates: [
        DEFAULT_DEMO_LOCATION.latitude,
        DEFAULT_DEMO_LOCATION.longitude,
      ],
    },
  };
  users.push(user);
  return { success: true, message: "Registration successful", result: user };
};

// ---- Favourites ----------------------------------------------------------
// Kept per customer and merchantType. The reducers append `result` to their
// lists, so add/push answer with an array holding only the new entry.

const favourites = { stores: {}, items: {}, list: {} };

const listFor = (kind, body) => {
  const key = `${body?.customerInfo}:${Number(body?.merchantType)}`;
  if (!favourites[kind][key]) favourites[kind][key] = [];
  return favourites[kind][key];
};

const toEntry = (body) => {
  const { customerInfo, custom_customer_id, ...rest } = body;
  return {
    _id: randomHexId(),
    ...rest,
    merchantType: Number(body.merchantType),
  };
};

const favouriteHandlers = (kind, idField) => {
  const guard = (body) =>
    !body?.customerInfo || !body?.[idField]
      ? fail("customerInfo and " + idField + " are required")
      : null;

  const save = (replace) => ({ body }) => {
    const error = guard(body);
    if (error) return error;

    const list = listFor(kind, body);
    if (replace) list.length = 0;
    const entry = toEntry(body);
    const index = list.findIndex((e) => e[idField] === body[idField]);
    if (index > -1) list.splice(index, 1);
    list.push(entry);
    return { success: true, message: "Added to favourites", result: [entry] };
  };

  const remove = ({ body }) => {
    const error = guard(body);
    if (error) return error;

    const list = listFor(kind, body);
    const index = list.findIndex((e) => e[idField] === body[idField]);
    if (index > -1) list.splice(index, 1);
    return { success: true, message: "Removed from favourites", result: list };
  };

  // Not called by the app today; answers with what add/push stored.
  const info = ({ query, body }) => {
    const source = { ...query, ...body };
    if (!source.customerInfo) return fail("customerInfo is required");
    if (source.merchantType !== undefined && source.merchantType !== "") {
      return { success: true, result: [...listFor(kind, source)] };
    }
    const prefix = `${source.customerInfo}:`;
    const result = Object.entries(favourites[kind])
      .filter(([key]) => key.startsWith(prefix))
      .flatMap(([, entries]) => entries);
    return { success: true, result };
  };

  return { add: save(true), push: save(false), remove, info };
};

const stores = favouriteHandlers("stores", "storeId");
const items = favouriteHandlers("items", "productId");
const list = favouriteHandlers("list", "mongodbId");

const post = (path, handler) => ({ service: "USER", method: "POST", path, handler });
const infoRoutes = (path, handler) => [
  { service: "USER", method: "GET", path, handler },
  post(path, handler),
];

export const routes = [
  post(OTP_FOR_REGISTRATION, sendOtp),
  post(USER_REGISTRATION, register),

  post(FAVORITE_STORE_ADD, stores.add),
  post(FAVORITE_STORE_PUSH, stores.push),
  post(FAVORITE_STORE_REMOVE, stores.remove),
  ...infoRoutes(FAVORITE_STORE_INFO, stores.info),

  post(FAVORITE_PRODUCT_ADD, items.add),
  post(FAVORITE_PRODUCT_PUSH, items.push),
  post(FAVORITE_PRODUCT_REMOVE, items.remove),
  ...infoRoutes(FAVORITE_PRODUCT_INFO, items.info),

  post(ADD_TO_FAVOURITE, list.add),
  post(PUSH_TO_FAVOURITE, list.push),
  post(REMOVE_FROM_FAVOURITE, list.remove),
  ...infoRoutes(FAVORITE_INFO, list.info),
];
