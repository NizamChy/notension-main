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
import { DEMO_LOCATIONS, isDemoDistrict } from "../demoLocations";

// Fixed 24-char lowercase hex ids: "66f00d" + 2-char kind + counter.
const hexId = (kind, n) => `66f00d${kind}${n.toString(16).padStart(16, "0")}`;

const DHAKA = DEMO_LOCATIONS.find((l) => l.key === "dhaka");
const CHITTAGONG = DEMO_LOCATIONS.find((l) => l.key === "chittagong");

const CREATED_AT = "2026-01-15T09:00:00.000Z";

// ---------------------------------------------------------------------------
// Store categories (the food landing page reads shopCategory[0..7])
// ---------------------------------------------------------------------------

const STORE_CATEGORY_ROWS = [
  // [key, name]
  ["biryani", "Biryani & Bangla"],
  ["fastfood", "Burgers & Fast Food"],
  ["pizza", "Pizza"],
  ["chinese", "Chinese & Thai"],
  ["cafe", "Cafe & Coffee"],
  ["bakery", "Bakery & Desserts"],
  ["street", "Street Food"],
  ["restaurant", "All Restaurants"],
];

export const DEMO_FOOD_STORE_CATEGORIES = STORE_CATEGORY_ROWS.map(
  ([key, name], index) => ({
    _id: hexId("10", index + 1),
    key,
    store_category_name: name,
    banner: `food/cat-${key}.webp`,
    regularDistance: 10000, // metres, sent back as max_distance
    serial_no: index + 1,
    is_active: true,
    createdAt: CREATED_AT,
  }),
);

const storeCategoryId = (key) =>
  DEMO_FOOD_STORE_CATEGORIES.find((c) => c.key === key)._id;

// ---------------------------------------------------------------------------
// Product categories (menu sections inside a store)
// ---------------------------------------------------------------------------

const PRODUCT_CATEGORY_ROWS = [
  // [key, name]
  ["biryani", "Biryani & Rice"],
  ["curry", "Bangla Curry"],
  ["mezban", "Mezbani Special"],
  ["burger", "Burgers"],
  ["sides", "Fries & Sides"],
  ["street", "Street Snacks"],
  ["pizza", "Pizza"],
  ["pasta", "Pasta"],
  ["chinese", "Chinese"],
  ["thai", "Thai & Soups"],
  ["coffee", "Coffee"],
  ["cakes", "Cakes & Pastries"],
  ["sweets", "Bangla Sweets"],
  ["drinks", "Drinks & Shakes"],
];

export const DEMO_FOOD_PRODUCT_CATEGORIES = PRODUCT_CATEGORY_ROWS.map(
  ([key, name], index) => ({
    _id: hexId("30", index + 1),
    key,
    category_name: name,
    banner_type_1: `food/pcat-${key}.webp`,
    is_active: true,
  }),
);

const productCategoryByKey = (key) =>
  DEMO_FOOD_PRODUCT_CATEGORIES.find((c) => c.key === key);

// ---------------------------------------------------------------------------
// Stores
// ---------------------------------------------------------------------------

const STORE_ROWS = [
  {
    key: "kacchi",
    custom_store_id: "FS-1001",
    shop_name: "Kacchi Ghor",
    shop_address: "House 12, Road 35, Gulshan 1, Dhaka 1212",
    district_area_name: "Gulshan",
    location: DHAKA,
    lat: 23.7806,
    lng: 90.4166,
    contact_no: "01711-100101",
    alternative_contact_no: "01811-100101",
    categories: ["biryani", "bakery", "restaurant"],
    delivery_time: "30-40 min",
    rating: 4.7,
    min_purchage_amount: 800,
    max_delivery_charge: 60,
    min_delivery_charge: 30,
    less: 10,
    less_type: "Percent",
    maximum_less: 100,
    minimum_order_for_less: 500,
    delivery_notice: "10% off above ৳500",
  },
  {
    key: "burger",
    custom_store_id: "FS-1002",
    shop_name: "Burger Junction",
    shop_address: "Road 11, Block E, Banani, Dhaka 1213",
    district_area_name: "Banani",
    location: DHAKA,
    lat: 23.7937,
    lng: 90.4066,
    contact_no: "01711-100202",
    alternative_contact_no: "01911-100202",
    categories: ["fastfood", "street", "restaurant"],
    delivery_time: "25-35 min",
    rating: 4.5,
    min_purchage_amount: 600,
    max_delivery_charge: 50,
    min_delivery_charge: 0,
    less: 0,
    less_type: "Percent",
    maximum_less: 0,
    minimum_order_for_less: 0,
    delivery_notice: "Free delivery above ৳600",
  },
  {
    key: "pizza",
    custom_store_id: "FS-1003",
    shop_name: "Napoli Slice",
    shop_address: "Road 27 (Old), Dhanmondi, Dhaka 1209",
    district_area_name: "Dhanmondi",
    location: DHAKA,
    lat: 23.7561,
    lng: 90.374,
    contact_no: "01711-100303",
    alternative_contact_no: "01611-100303",
    categories: ["pizza", "fastfood", "restaurant"],
    delivery_time: "40-50 min",
    rating: 4.6,
    min_purchage_amount: 1000,
    max_delivery_charge: 80,
    min_delivery_charge: 40,
    less: 100,
    less_type: "Flat",
    maximum_less: 100,
    minimum_order_for_less: 1200,
    delivery_notice: "",
  },
  {
    key: "chinese",
    custom_store_id: "FS-1004",
    shop_name: "Golden Dragon",
    shop_address: "Plot 5, Gulshan Avenue, Gulshan 2, Dhaka 1212",
    district_area_name: "Gulshan",
    location: DHAKA,
    lat: 23.7947,
    lng: 90.4144,
    contact_no: "01711-100404",
    alternative_contact_no: "01711-100405",
    categories: ["chinese", "restaurant"],
    delivery_time: "35-45 min",
    rating: 4.4,
    min_purchage_amount: 1000,
    max_delivery_charge: 70,
    min_delivery_charge: 40,
    less: 0,
    less_type: "Percent",
    maximum_less: 0,
    minimum_order_for_less: 0,
    delivery_notice: "",
  },
  {
    key: "cafe",
    custom_store_id: "FS-1005",
    shop_name: "Brew & Bake",
    shop_address: "Road 90, Gulshan 2 North, Dhaka 1212",
    district_area_name: "Gulshan",
    location: DHAKA,
    lat: 23.8,
    lng: 90.42,
    contact_no: "01711-100505",
    alternative_contact_no: "01511-100505",
    categories: ["cafe", "bakery"],
    delivery_time: "20-30 min",
    rating: 4.8,
    min_purchage_amount: 500,
    max_delivery_charge: 50,
    min_delivery_charge: 20,
    less: 15,
    less_type: "Percent",
    maximum_less: 150,
    minimum_order_for_less: 700,
    delivery_notice: "15% off above ৳700",
  },
  {
    key: "mezban",
    custom_store_id: "FS-2001",
    shop_name: "Mezban Bari",
    shop_address: "CDA Avenue, GEC Circle, Chattogram 4000",
    district_area_name: "GEC Circle",
    location: CHITTAGONG,
    lat: 22.359,
    lng: 91.8216,
    contact_no: "01711-200101",
    alternative_contact_no: "01811-200101",
    categories: ["biryani", "restaurant"],
    delivery_time: "35-45 min",
    rating: 4.6,
    min_purchage_amount: 700,
    max_delivery_charge: 60,
    min_delivery_charge: 30,
    less: 0,
    less_type: "Percent",
    maximum_less: 0,
    minimum_order_for_less: 0,
    delivery_notice: "Mezbani every Friday",
  },
  {
    key: "seabreeze",
    custom_store_id: "FS-2002",
    shop_name: "Sea Breeze Cafe",
    shop_address: "Sheikh Mujib Road, Agrabad C/A, Chattogram 4100",
    district_area_name: "Agrabad",
    location: CHITTAGONG,
    lat: 22.329,
    lng: 91.81,
    contact_no: "01711-200202",
    alternative_contact_no: "01911-200202",
    categories: ["cafe", "fastfood"],
    delivery_time: "25-35 min",
    rating: 4.2,
    min_purchage_amount: 500,
    max_delivery_charge: 50,
    min_delivery_charge: 30,
    less: 0,
    less_type: "Percent",
    maximum_less: 0,
    minimum_order_for_less: 0,
    delivery_notice: "",
    is_closed: true,
  },
];

export const DEMO_FOOD_STORES = STORE_ROWS.map((row, index) => {
  const { key, location, lat, lng, categories, ...rest } = row;
  return {
    _id: hexId("20", index + 1),
    key,
    ...rest,
    shop_banner_app: `food/store-${key}.webp`,
    shop_banner_web: `food/store-${key}.webp`,
    // Monogram, not the cover photo: a photo crop doesn't read as a logo.
    shop_logo: `food/logo-${key}.svg`,
    district_id: location.districtId,
    district_name: location.districtName,
    shop_latitude: lat,
    shop_longitude: lng,
    location: { type: "Point", coordinates: [lng, lat] },
    StoreCategory: categories.map(storeCategoryId),
    opening_time: "10:00 AM",
    closing_time: "11:00 PM",
    is_active: true,
    is_banned: false,
    is_closed: Boolean(row.is_closed),
    vat_percent: 0,
    createdAt: CREATED_AT,
  };
});

const storeByKey = (key) => DEMO_FOOD_STORES.find((s) => s.key === key);

// ---------------------------------------------------------------------------
// Menu items
// ---------------------------------------------------------------------------

const ITEM_ROWS = [
  // [key, store, category, title, bengali title, pack size, MRP, sale price, popular]
  // Kacchi Ghor (Dhaka)
  ["kacchi", "kacchi", "biryani", "Mutton Kacchi Biryani", "মাটন কাচ্চি বিরিয়ানি", "1 plate", 420, 380, true],
  ["chicken-biryani", "kacchi", "biryani", "Chicken Biryani", "চিকেন বিরিয়ানি", "1 plate", 280, 260, true],
  ["tehari", "kacchi", "biryani", "Beef Tehari", "বিফ তেহারি", "1 plate", 220, 220, true],
  ["morog-polao", "kacchi", "biryani", "Morog Polao", "মোরগ পোলাও", "1 plate", 300, 300, false],
  ["rezala", "kacchi", "curry", "Beef Rezala", "বিফ রেজালা", "1 bowl", 260, 260, false],
  ["borhani", "kacchi", "drinks", "Borhani", "বোরহানি", "500 ml", 80, 80, true],
  ["mishti-doi", "kacchi", "sweets", "Mishti Doi", "মিষ্টি দই", "1 pot (500 g)", 120, 120, false],
  ["firni", "kacchi", "sweets", "Shahi Firni", "শাহী ফিরনি", "1 bowl", 90, 90, false],
  // Burger Junction (Dhaka)
  ["chicken-burger", "burger", "burger", "Classic Chicken Burger", "ক্লাসিক চিকেন বার্গার", "1 pc", 280, 250, true],
  ["beef-burger", "burger", "burger", "Beef Cheese Burger", "বিফ চিজ বার্গার", "1 pc", 380, 380, true],
  ["fish-burger", "burger", "burger", "Crispy Fish Burger", "ক্রিস্পি ফিশ বার্গার", "1 pc", 320, 320, false],
  ["fries", "burger", "sides", "French Fries", "ফ্রেঞ্চ ফ্রাই", "Regular", 150, 150, false],
  ["wings", "burger", "sides", "Chicken Wings", "চিকেন উইংস", "6 pcs", 320, 290, true],
  ["fuchka", "burger", "street", "Fuchka", "ফুচকা", "8 pcs", 120, 120, true],
  ["chotpoti", "burger", "street", "Chotpoti", "চটপটি", "1 bowl", 120, 120, false],
  ["singara", "burger", "street", "Singara", "সিঙ্গারা", "4 pcs", 60, 60, false],
  ["cold-coffee-bj", "burger", "drinks", "Cold Coffee", "কোল্ড কফি", "400 ml", 220, 220, false],
  // Napoli Slice (Dhaka)
  ["margherita", "pizza", "pizza", "Margherita Pizza", "মার্গারিটা পিৎজা", '10"', 650, 590, true],
  ["pepperoni", "pizza", "pizza", "Beef Pepperoni Pizza", "বিফ পেপারনি পিৎজা", '10"', 850, 850, true],
  ["bbq-pizza", "pizza", "pizza", "BBQ Chicken Pizza", "বিবিকিউ চিকেন পিৎজা", '10"', 890, 890, false],
  ["kalabhuna-pizza", "pizza", "pizza", "Kala Bhuna Pizza", "কালা ভুনা পিৎজা", '10"', 950, 899, true],
  ["alfredo", "pizza", "pasta", "Chicken Alfredo Pasta", "চিকেন আলফ্রেডো পাস্তা", "1 plate", 480, 480, false],
  ["garlic-bread", "pizza", "sides", "Garlic Bread", "গার্লিক ব্রেড", "4 pcs", 180, 180, false],
  ["lemonade", "pizza", "drinks", "Mint Lemonade", "মিন্ট লেমনেড", "400 ml", 150, 150, false],
  // Golden Dragon (Dhaka)
  ["chowmein", "chinese", "chinese", "Chicken Chowmein", "চিকেন চাওমিন", "1 plate", 320, 320, true],
  ["fried-rice", "chinese", "chinese", "Egg Fried Rice", "এগ ফ্রাইড রাইস", "1 plate", 260, 260, false],
  ["chili-onion", "chinese", "chinese", "Chicken Chili Onion", "চিকেন চিলি অনিয়ন", "1 plate", 420, 380, true],
  ["beef-chili", "chinese", "chinese", "Beef Chili Dry", "বিফ চিলি ড্রাই", "1 plate", 480, 480, false],
  ["thai-soup", "chinese", "thai", "Thai Clear Soup", "থাই ক্লিয়ার স্যুপ", "1:3", 380, 380, true],
  ["tom-yum", "chinese", "thai", "Tom Yum Soup", "টম ইয়াম স্যুপ", "1:3", 450, 450, false],
  ["green-curry", "chinese", "thai", "Thai Green Curry Chicken", "থাই গ্রিন কারি চিকেন", "1 bowl", 520, 520, false],
  // Brew & Bake (Dhaka)
  ["cappuccino", "cafe", "coffee", "Cappuccino", "ক্যাপুচিনো", "12 oz", 280, 280, true],
  ["cold-coffee", "cafe", "coffee", "Cold Coffee", "কোল্ড কফি", "16 oz", 250, 250, true],
  ["latte", "cafe", "coffee", "Cafe Latte", "ক্যাফে লাতে", "12 oz", 290, 290, false],
  ["red-velvet", "cafe", "cakes", "Red Velvet Pastry", "রেড ভেলভেট পেস্ট্রি", "1 slice", 220, 220, false],
  ["fudge-cake", "cafe", "cakes", "Chocolate Fudge Cake", "চকলেট ফাজ কেক", "1 lb", 950, 850, true],
  ["rasmalai", "cafe", "sweets", "Rasmalai", "রসমালাই", "4 pcs", 200, 200, false],
  ["mango-smoothie", "cafe", "drinks", "Mango Smoothie", "ম্যাঙ্গো স্মুদি", "400 ml", 260, 260, false],
  // Mezban Bari (Chittagong)
  ["mezbani-beef", "mezban", "mezban", "Mezbani Beef", "মেজবানি গরুর মাংস", "1 bowl", 350, 350, true],
  ["kala-bhuna", "mezban", "mezban", "Kala Bhuna with Rice", "কালা ভুনা ও ভাত", "1 plate", 380, 360, true],
  ["akhni", "mezban", "biryani", "Chittagong Akhni Biryani", "চাটগাঁইয়া আখনি", "1 plate", 260, 260, false],
  ["nalli-nihari", "mezban", "curry", "Nalli Nihari", "নলা নিহারি", "1 bowl", 320, 320, false],
  ["mishti-doi-ctg", "mezban", "sweets", "Mishti Doi", "মিষ্টি দই", "1 pot (500 g)", 100, 100, false],
  // Sea Breeze Cafe (Chittagong, closed)
  ["americano", "seabreeze", "coffee", "Americano", "আমেরিকানো", "12 oz", 200, 200, true],
  ["sb-burger", "seabreeze", "burger", "Chicken Burger", "চিকেন বার্গার", "1 pc", 240, 240, false],
];

export const DEMO_FOOD_ITEMS = ITEM_ROWS.map(
  ([key, storeKey, catKey, title, bengali, pack, mrp, sale, popular], index) => {
    const store = storeByKey(storeKey);
    const discount = mrp - sale;
    return {
      _id: hexId("40", index + 1),
      custom_product_id: `FI-${String(index + 1).padStart(4, "0")}`,
      storeId: store._id,
      custom_store_id: store.custom_store_id,
      productCategory: productCategoryByKey(catKey)._id,
      product_title_eng: title,
      product_title_beng: bengali,
      pack_size: pack,
      max_retail_price: mrp,
      sale_price: sale,
      less: discount > 0 ? discount : 0,
      less_type: "Flat",
      unit_symbol: "",
      max_allowed: 10,
      app_image: `food/item-${key}.webp`,
      web_image: `food/item-${key}.webp`,
      is_popular: popular,
      is_available: true,
      is_active: true,
      createdAt: CREATED_AT,
    };
  },
);

// ---------------------------------------------------------------------------
// Landing page sliders (per district)
// ---------------------------------------------------------------------------

const slide = (n, file) => ({ _id: hexId("50", n), file_name: `food/${file}` });

const DEMO_FOOD_SLIDERS = {
  [DHAKA.districtId]: {
    _id: hexId("51", 1),
    district_id: DHAKA.districtId,
    first_slider: [slide(1, "slider-kacchi.webp"), slide(2, "slider-pizza.webp")],
    second_slider: [slide(3, "slider-burger.webp"), slide(4, "slider-cafe.webp")],
    third_slider: [slide(5, "slider-chinese.webp"), slide(6, "slider-delivery.webp")],
    fourth_slider: [slide(7, "slider-street.webp"), slide(8, "slider-kacchi.webp")],
  },
  [CHITTAGONG.districtId]: {
    _id: hexId("51", 2),
    district_id: CHITTAGONG.districtId,
    first_slider: [slide(9, "slider-mezban.webp")],
    second_slider: [slide(10, "slider-delivery.webp")],
    third_slider: [slide(11, "slider-mezban.webp")],
    fourth_slider: [slide(12, "slider-delivery.webp")],
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ok = (result, message = "Success") => ({
  success: true,
  status: 200,
  message,
  result,
});

const toNum = (value) => {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : null;
};

// Great-circle distance in metres.
const distanceMetres = (lat1, lng1, lat2, lng2) => {
  const rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(lat2 - lat1);
  const dLng = rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) ** 2;
  return Math.round(6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const publicStore = (store) => {
  const { key: _key, ...rest } = store;
  return rest;
};

const inCategory = (store, categoryId) =>
  !categoryId || store.StoreCategory.includes(categoryId);

// ---------------------------------------------------------------------------
// Orders (kept in memory for the page session)
// ---------------------------------------------------------------------------

const placedOrders = [];
let orderCounter = 0;

const datePart = (date) =>
  `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(
    date.getDate(),
  ).padStart(2, "0")}`;

const merchantInfoOf = (store) => ({
  shop_name: store.shop_name,
  shop_address: store.shop_address,
  contact_no: store.contact_no,
  alternative_contact_no: store.alternative_contact_no,
});

const orderLine = (itemKey, quantity) => {
  const item = DEMO_FOOD_ITEMS.find(
    (i) => i.app_image === `food/item-${itemKey}.webp`,
  );
  return {
    _id: item._id,
    productCategory: item.productCategory,
    product_title_eng: item.product_title_eng,
    product_title_beng: item.product_title_beng,
    pack_size: item.pack_size,
    max_retail_price: item.max_retail_price,
    sale_price: item.sale_price,
    unit_symbol: item.unit_symbol,
    max_allowed: item.max_allowed,
    quantity,
    delivered_qty: quantity,
    inc_qty: 1,
    app_image: item.app_image,
  };
};

// Two past orders shown in every signed-in customer's history.
const pastOrdersFor = (customerId, customCustomerId) => {
  const history = [
    {
      n: 1,
      storeKey: "kacchi",
      lines: [orderLine("kacchi", 2), orderLine("borhani", 2)],
      deliveryCharge: 30,
      less_amount: 0,
      status: "Delivered",
      payment: "Cash on Delivery",
      createdAt: "2026-11-02T13:20:00.000Z",
    },
    {
      n: 2,
      storeKey: "pizza",
      lines: [orderLine("margherita", 1), orderLine("garlic-bread", 1)],
      deliveryCharge: 80,
      less_amount: 0,
      status: "Delivered",
      payment: "bKash",
      createdAt: "2026-10-24T18:45:00.000Z",
    },
  ];

  return history.map((h) => {
    const store = storeByKey(h.storeKey);
    const subTotal = h.lines.reduce((s, l) => s + l.sale_price * l.quantity, 0);
    return {
      _id: hexId("61", h.n),
      order_id: `FOOD-${h.createdAt.slice(0, 10).replace(/-/g, "")}-${1000 + h.n}`,
      customer_id: customerId,
      custom_customer_id: customCustomerId || "",
      merchant_id: store._id,
      custom_merchant_id: store.custom_store_id,
      merchantInfo: merchantInfoOf(store),
      orderItems: h.lines,
      subTotal,
      less_amount: h.less_amount,
      vatAmount: 0,
      deliveryCharge: h.deliveryCharge,
      totalAmount: subTotal + h.deliveryCharge - h.less_amount,
      paymet_method: h.payment,
      shortNote: "",
      order_status: h.status,
      customer_rating: 0,
      customer_review: "",
      createdAt: h.createdAt,
      updatedAt: h.createdAt,
    };
  });
};

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
