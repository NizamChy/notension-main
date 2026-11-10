// Demo data for the GROCERY backend. Image fields hold a path under
// public/demo/ (see src/demo/README.md): every grocery image URL is built as
// `${IMAGE_URL}/<folder>/<file>`, and the rewrite drops <folder>.
import { DEMO_LOCATIONS } from "../../demoLocations";

const [DHAKA, CHITTAGONG] = DEMO_LOCATIONS;

// Deterministic 24-char hex ids: "6650" + 4-char tag + 16-digit counter.
const oid = (tag, n) => `6650${tag}${n.toString(16).padStart(16, "0")}`;

// Custom type ids the UI hard-codes (src/components/StoreModule/storeModules.js).
export const GROCERY_CUSTOM_TYPES = {
  specialOffer: "64f5a306baa57a4707524d6e",
  dealOfTheDay: "6525306cf79d9e77f12a2a63",
  popularItem: "64f5b63a256e0838327efaef",
};

// ---------------------------------------------------------------- stores

const storeDefaults = {
  is_active: true,
  is_banned: false,
  is_closed: false,
  show_product_price: true,
  delivery_notice: "",
  min_purchage_amount: 500,
  min_delivery_charge: 30,
  max_delivery_charge: 60,
  less: 0,
  less_type: "Percent",
  maximum_less: 0,
  minimum_order_for_less: 0,
  merchant_type: 0,
  opening_time: "08:00 AM",
  closing_time: "11:00 PM",
};

const store = (info) => ({
  ...storeDefaults,
  ...info,
  location: {
    type: "Point",
    coordinates: [info.shop_longitude, info.shop_latitude],
  },
});

export const DEMO_GROCERY_STORES = [
  store({
    _id: "6650a00100000000000000a1",
    custom_store_id: "GS260001",
    shop_name: "Gulshan Fresh Mart",
    shop_address: "House 12, Road 90, Gulshan 2, Dhaka 1212",
    contact_no: "01711000101",
    alternative_contact_no: "01911000101",
    districtId: DHAKA.districtId,
    district_name: DHAKA.districtName,
    district_area_name: "Gulshan",
    shop_latitude: 23.7948,
    shop_longitude: 90.4143,
    shop_banner_app: "grocery/store-gulshan-fresh-mart.svg",
    shop_banner_web: "grocery/store-gulshan-fresh-mart.svg",
    delivery_notice: "Free delivery over ৳1000",
    min_purchage_amount: 1000,
    min_delivery_charge: 0,
    max_delivery_charge: 50,
    less: 5,
    maximum_less: 100,
    minimum_order_for_less: 1500,
  }),
  store({
    _id: "6650a00100000000000000a2",
    custom_store_id: "GS260002",
    shop_name: "Banani Daily Bazar",
    shop_address: "Plot 45, Road 11, Banani, Dhaka 1213",
    contact_no: "01711000202",
    alternative_contact_no: "01811000202",
    districtId: DHAKA.districtId,
    district_name: DHAKA.districtName,
    district_area_name: "Banani",
    shop_latitude: 23.7937,
    shop_longitude: 90.4043,
    shop_banner_app: "grocery/store-banani-daily-bazar.svg",
    shop_banner_web: "grocery/store-banani-daily-bazar.svg",
  }),
  store({
    _id: "6650a00100000000000000a3",
    custom_store_id: "GS260003",
    shop_name: "Dhanmondi Super Shop",
    shop_address: "Satmasjid Road, Dhanmondi 9/A, Dhaka 1209",
    contact_no: "01711000303",
    alternative_contact_no: "01611000303",
    districtId: DHAKA.districtId,
    district_name: DHAKA.districtName,
    district_area_name: "Dhanmondi",
    shop_latitude: 23.7461,
    shop_longitude: 90.3742,
    shop_banner_app: "grocery/store-dhanmondi-super-shop.svg",
    shop_banner_web: "grocery/store-dhanmondi-super-shop.svg",
    delivery_notice: "Delivery in 60 min",
    less: 50,
    less_type: "Flat",
    maximum_less: 50,
    minimum_order_for_less: 2000,
  }),
  store({
    _id: "6650a00100000000000000a4",
    custom_store_id: "GS260004",
    shop_name: "Mohakhali Krishi Bazar",
    shop_address: "Mohakhali Bus Terminal Road, Dhaka 1212",
    contact_no: "01711000404",
    alternative_contact_no: "",
    districtId: DHAKA.districtId,
    district_name: DHAKA.districtName,
    district_area_name: "Mohakhali",
    shop_latitude: 23.7781,
    shop_longitude: 90.3975,
    shop_banner_app: "grocery/store-mohakhali-krishi-bazar.svg",
    shop_banner_web: "grocery/store-mohakhali-krishi-bazar.svg",
    is_closed: true,
  }),
  store({
    _id: "6650a00100000000000000b1",
    custom_store_id: "GS260011",
    shop_name: "Agrabad Family Store",
    shop_address: "Agrabad Commercial Area, Chittagong 4100",
    contact_no: "01811000505",
    alternative_contact_no: "01711000505",
    districtId: CHITTAGONG.districtId,
    district_name: CHITTAGONG.districtName,
    district_area_name: "Agrabad",
    shop_latitude: 22.3252,
    shop_longitude: 91.8112,
    shop_banner_app: "grocery/store-agrabad-family-store.svg",
    shop_banner_web: "grocery/store-agrabad-family-store.svg",
  }),
  store({
    _id: "6650a00100000000000000b2",
    custom_store_id: "GS260012",
    shop_name: "GEC Circle Grocers",
    shop_address: "CDA Avenue, GEC Circle, Chittagong 4000",
    contact_no: "01811000606",
    alternative_contact_no: "",
    districtId: CHITTAGONG.districtId,
    district_name: CHITTAGONG.districtName,
    district_area_name: "GEC Circle",
    shop_latitude: 22.3593,
    shop_longitude: 91.8213,
    shop_banner_app: "grocery/store-gec-circle-grocers.svg",
    shop_banner_web: "grocery/store-gec-circle-grocers.svg",
    delivery_notice: "Free delivery over ৳800",
    min_purchage_amount: 800,
    min_delivery_charge: 0,
    max_delivery_charge: 40,
  }),
];

// ------------------------------------------------------ types & subtypes

// [typeId, name, [[subtypeId, name, image], ...]]
const TYPE_TREE = [
  ["6650b00100000000000000c1", "Rice & Grains", [
    ["6650c00100000000000000d1", "Rice", "grocery/sub-rice.svg"],
    ["6650c00100000000000000d2", "Flour & Atta", "grocery/sub-flour.svg"],
    ["6650c00100000000000000d3", "Lentils", "grocery/sub-lentils.svg"],
  ]],
  ["6650b00100000000000000c2", "Cooking Oil & Ghee", [
    ["6650c00100000000000000d4", "Soybean Oil", "grocery/sub-soybean-oil.svg"],
    ["6650c00100000000000000d5", "Mustard Oil & Ghee", "grocery/sub-mustard-oil.svg"],
  ]],
  ["6650b00100000000000000c3", "Vegetables", [
    ["6650c00100000000000000d6", "Fresh Vegetables", "grocery/sub-fresh-vegetables.svg"],
    ["6650c00100000000000000d7", "Onion, Potato & Garlic", "grocery/sub-onion-potato.svg"],
  ]],
  ["6650b00100000000000000c4", "Fruits", [
    ["6650c00100000000000000d8", "Seasonal Fruits", "grocery/sub-seasonal-fruits.svg"],
    ["6650c00100000000000000d9", "Imported Fruits", "grocery/sub-imported-fruits.svg"],
  ]],
  ["6650b00100000000000000c5", "Dairy & Eggs", [
    ["6650c00100000000000000da", "Milk", "grocery/sub-milk.svg"],
    ["6650c00100000000000000db", "Eggs", "grocery/sub-eggs.svg"],
  ]],
  ["6650b00100000000000000c6", "Snacks", [
    ["6650c00100000000000000dc", "Biscuits", "grocery/sub-biscuits.svg"],
    ["6650c00100000000000000dd", "Chips & Chanachur", "grocery/sub-chips.svg"],
    ["6650c00100000000000000de", "Noodles", "grocery/sub-noodles.svg"],
  ]],
  ["6650b00100000000000000c7", "Beverages", [
    ["6650c00100000000000000df", "Tea & Coffee", "grocery/sub-tea-coffee.svg"],
    ["6650c00100000000000000e0", "Soft Drinks & Juice", "grocery/sub-drinks.svg"],
  ]],
  ["6650b00100000000000000c8", "Household", [
    ["6650c00100000000000000e1", "Laundry", "grocery/sub-laundry.svg"],
    ["6650c00100000000000000e2", "Cleaning", "grocery/sub-cleaning.svg"],
  ]],
];

export const DEMO_GROCERY_TYPES = [
  ...TYPE_TREE.map(([id, name], index) => ({
    _id: id,
    type_name: name,
    custom_type_id: `GT${String(index + 1).padStart(4, "0")}`,
    statusType: "General",
  })),
  { _id: GROCERY_CUSTOM_TYPES.specialOffer, type_name: "Special Offer", custom_type_id: "GCT0001", statusType: "Custom" },
  { _id: GROCERY_CUSTOM_TYPES.dealOfTheDay, type_name: "Deal of The Day", custom_type_id: "GCT0002", statusType: "Custom" },
  { _id: GROCERY_CUSTOM_TYPES.popularItem, type_name: "Popular Items", custom_type_id: "GCT0003", statusType: "Custom" },
];

export const DEMO_GROCERY_SUBTYPES = TYPE_TREE.flatMap(([typeId, , subs]) =>
  subs.map(([id, name, image], index) => ({
    _id: id,
    typeInfo: typeId,
    sub_type_name: name,
    custom_sub_type_id: `GST${id.slice(-2).toUpperCase()}${index}`,
    banner_type_1: image,
  })),
);

// ---------------------------------------------------------------- products

const SUB = Object.fromEntries(
  DEMO_GROCERY_SUBTYPES.map((s) => [s.sub_type_name, s]),
);
const { specialOffer: SO, dealOfTheDay: DD, popularItem: PI } =
  GROCERY_CUSTOM_TYPES;

// [slug, english, bengali, pack, unit, mrp, sale, subtype, customTypes, extra]
const PRODUCT_ROWS = [
  ["chinigura-rice", "Chinigura Aromatic Rice", "চিনিগুড়া চাল", "1 kg", "kg", 160, 150, "Rice", [PI]],
  ["miniket-rice", "Miniket Rice", "মিনিকেট চাল", "5 kg", "kg", 400, 375, "Rice", [SO]],
  ["nazirshail-rice", "Nazirshail Rice", "নাজিরশাইল চাল", "5 kg", "kg", 420, 420, "Rice", []],
  ["atta", "Whole Wheat Atta", "লাল আটা", "2 kg", "kg", 130, 120, "Flour & Atta", [DD]],
  ["maida", "Maida (All-purpose Flour)", "ময়দা", "1 kg", "kg", 75, 75, "Flour & Atta", []],
  ["masoor-dal", "Deshi Masoor Dal", "দেশি মসুর ডাল", "1 kg", "kg", 150, 140, "Lentils", [DD, PI]],
  ["moong-dal", "Moong Dal", "মুগ ডাল", "1 kg", "kg", 170, 170, "Lentils", []],
  ["soybean-oil-5l", "Fortified Soybean Oil", "সয়াবিন তেল", "5 L", "ltr", 875, 850, "Soybean Oil", [SO, PI]],
  ["soybean-oil-2l", "Soybean Oil (Bottle)", "সয়াবিন তেল (বোতল)", "2 L", "ltr", 350, 350, "Soybean Oil", []],
  ["mustard-oil", "Pure Mustard Oil", "খাঁটি সরিষার তেল", "1 L", "ltr", 320, 300, "Mustard Oil & Ghee", [SO]],
  ["ghee", "Cow Ghee", "গাওয়া ঘি", "400 g", "g", 750, 750, "Mustard Oil & Ghee", []],
  ["tomato", "Tomato", "টমেটো", "500 g", "g", 60, 60, "Fresh Vegetables", []],
  ["green-chilli", "Green Chilli", "কাঁচা মরিচ", "250 g", "g", 30, 30, "Fresh Vegetables", []],
  ["cauliflower", "Cauliflower", "ফুলকপি", "1 pc", "pcs", 50, 45, "Fresh Vegetables", [DD]],
  ["eggplant", "Eggplant (Begun)", "বেগুন", "500 g", "g", 45, 45, "Fresh Vegetables", []],
  ["potato", "Diamond Potato", "ডায়মন্ড আলু", "1 kg", "kg", 50, 45, "Onion, Potato & Garlic", [DD, PI]],
  ["onion", "Deshi Onion", "দেশি পেঁয়াজ", "1 kg", "kg", 90, 85, "Onion, Potato & Garlic", [PI]],
  ["garlic", "Chinese Garlic", "চায়না রসুন", "500 g", "g", 120, 120, "Onion, Potato & Garlic", []],
  ["banana", "Sagor Banana", "সাগর কলা", "12 pcs", "pcs", 120, 120, "Seasonal Fruits", []],
  ["mango", "Himsagar Mango", "হিমসাগর আম", "1 kg", "kg", 140, 130, "Seasonal Fruits", [SO]],
  ["guava", "Thai Guava", "থাই পেয়ারা", "1 kg", "kg", 110, 110, "Seasonal Fruits", []],
  ["green-apple", "Green Apple", "সবুজ আপেল", "1 kg", "kg", 320, 320, "Imported Fruits", []],
  ["malta", "Malta (Orange)", "মাল্টা", "1 kg", "kg", 280, 260, "Imported Fruits", [DD]],
  ["milk", "Pasteurised Full Cream Milk", "পাস্তুরিত দুধ", "1 L", "ltr", 100, 100, "Milk", [PI]],
  ["uht-milk", "UHT Milk", "ইউএইচটি দুধ", "500 ml", "ml", 55, 55, "Milk", []],
  ["brown-eggs", "Farm Brown Eggs", "লাল ডিম", "12 pcs", "pcs", 165, 155, "Eggs", [DD]],
  ["duck-eggs", "Duck Eggs", "হাঁসের ডিম", "4 pcs", "pcs", 90, 90, "Eggs", [], { is_available: false, stock_qty: 0 }],
  ["biscuits", "Energy Plus Biscuits", "এনার্জি প্লাস বিস্কুট", "240 g", "g", 40, 40, "Biscuits", []],
  ["butter-cookies", "Butter Cookies Tin", "বাটার কুকিজ", "340 g", "g", 450, 420, "Biscuits", [SO]],
  ["chanachur", "Classic Chanachur", "চানাচুর", "350 g", "g", 90, 85, "Chips & Chanachur", [PI]],
  ["chips", "BBQ Potato Chips", "বারবিকিউ চিপস", "40 g", "g", 25, 25, "Chips & Chanachur", []],
  ["noodles", "Masala Instant Noodles (8 pack)", "মশলা নুডলস", "8 x 62 g", "pcs", 160, 150, "Noodles", [SO]],
  ["tea", "Premium Black Tea", "প্রিমিয়াম চা পাতা", "400 g", "g", 260, 260, "Tea & Coffee", [PI]],
  ["coffee", "Instant Coffee Jar", "ইনস্ট্যান্ট কফি", "50 g", "g", 330, 310, "Tea & Coffee", []],
  ["cola", "Cola Soft Drink", "কোলা", "1.25 L", "ltr", 85, 85, "Soft Drinks & Juice", []],
  ["mango-juice", "Mango Juice", "ম্যাঙ্গো জুস", "1 L", "ltr", 120, 110, "Soft Drinks & Juice", [DD]],
  ["detergent", "Washing Powder", "ডিটারজেন্ট পাউডার", "1 kg", "kg", 160, 150, "Laundry", []],
  ["dishwash", "Dishwashing Liquid", "ডিশওয়াশ লিকুইড", "500 ml", "ml", 130, 130, "Cleaning", []],
  ["toilet-cleaner", "Toilet Cleaner", "টয়লেট ক্লিনার", "750 ml", "ml", 205, 190, "Cleaning", [SO]],
  ["floor-cleaner", "Floor Cleaner", "ফ্লোর ক্লিনার", "500 ml", "ml", 210, 210, "Cleaning", []],
];

export const DEMO_GROCERY_PRODUCTS = PRODUCT_ROWS.map(
  ([slug, eng, beng, pack, unit, mrp, sale, subName, customTypes, extra], i) => {
    const subtype = SUB[subName];
    return {
      _id: oid("d001", i + 1),
      slug,
      product_title_eng: eng,
      product_title_beng: beng,
      pack_size: pack,
      unit_symbol: unit,
      max_retail_price: mrp,
      sale_price: sale,
      purchase_price: Math.round(sale * 0.88),
      productType: subtype.typeInfo,
      productSubtype: subtype._id,
      customType: customTypes,
      app_image: `grocery/${slug}.svg`,
      is_available: true,
      stock_qty: 50,
      ...extra,
    };
  },
);

// ------------------------------------------------------- store listings

// Which products each store carries (indexes into DEMO_GROCERY_PRODUCTS).
const ALL = DEMO_GROCERY_PRODUCTS.map((_, i) => i);
const STORE_RANGE = {
  GS260001: ALL,
  GS260002: ALL.filter((i) => i % 3 !== 2),
  GS260003: ALL.filter((i) => i % 4 !== 1),
  GS260004: ALL.filter((i) => i % 2 === 0),
  GS260011: [0, 1, 3, 5, 7, 9, 12, 15, 16, 19, 23, 25, 29, 32, 35, 36],
  GS260012: [1, 2, 5, 7, 8, 15, 16, 18, 22, 25, 27, 31, 34, 38],
};

const percentOff = (mrp, sale) =>
  sale < mrp ? Math.round(((mrp - sale) / mrp) * 100) : 0;

export const DEMO_GROCERY_ITEMS = DEMO_GROCERY_STORES.flatMap((shop, s) =>
  (STORE_RANGE[shop.custom_store_id] || []).map((p) => {
    const product = DEMO_GROCERY_PRODUCTS[p];
    const { _id: productId, slug, ...rest } = product;
    return {
      ...rest,
      _id: oid(`e0${s.toString(16).padStart(2, "0")}`, p + 1),
      productInfoTable: productId,
      groceryStoreId: shop._id,
      custom_store_id: shop.custom_store_id,
      less: percentOff(product.max_retail_price, product.sale_price),
      less_type: "Percent",
      max_allowed: 10,
      slug,
    };
  }),
);

// ------------------------------------------------------------- sliders

const slide = (n, file) => ({ _id: oid("f001", n), file_name: `grocery/${file}` });

export const DEMO_GROCERY_SLIDER = [
  {
    first_slider: [
      slide(1, "slider-fresh-vegetables.svg"),
      slide(2, "slider-monthly-bazar.svg"),
      slide(3, "slider-free-delivery.svg"),
    ],
    second_slider: [slide(4, "slider-fruits-festival.svg")],
    third_slider: [slide(5, "slider-household-deals.svg")],
    fourth_slider: [
      slide(6, "slider-special-offer.svg"),
      slide(7, "slider-monthly-bazar.svg"),
    ],
  },
];

// ------------------------------------------------------ order history

// A delivered order every logged-in demo customer sees in "Order History".
export const DEMO_GROCERY_PAST_ORDERS = (() => {
  const shop = DEMO_GROCERY_STORES[0];
  const lines = [0, 7, 15, 24].map((p) => {
    const item = DEMO_GROCERY_ITEMS.find(
      (i) =>
        i.groceryStoreId === shop._id &&
        i.productInfoTable === DEMO_GROCERY_PRODUCTS[p]._id,
    );
    return {
      _id: item._id,
      productInfoTable: item.productInfoTable,
      product_title_eng: item.product_title_eng,
      product_title_beng: item.product_title_beng,
      pack_size: item.pack_size,
      purchase_price: item.purchase_price,
      max_retail_price: item.max_retail_price,
      sale_price: item.sale_price,
      unit_symbol: item.unit_symbol,
      max_allowed: item.max_allowed,
      quantity: p === 15 ? 3 : 1,
      delivered_qty: p === 15 ? 3 : 1,
      inc_qty: 1,
      app_image: item.app_image,
    };
  });
  const subTotal = lines.reduce((t, l) => t + l.sale_price * l.quantity, 0);
  return [
    {
      _id: oid("f101", 1),
      order_id: "GRO-20261028-1042",
      order_status: "Delivered",
      merchant_id: shop._id,
      custom_merchant_id: shop.custom_store_id,
      merchantInfo: {
        shop_name: shop.shop_name,
        shop_address: shop.shop_address,
        contact_no: shop.contact_no,
        alternative_contact_no: shop.alternative_contact_no,
      },
      order_list_image: [],
      orderItems: lines,
      subTotal,
      less_amount: 0,
      vatAmount: 0,
      deliveryCharge: 50,
      totalAmount: subTotal + 50,
      paymet_method: "Cash on Delivery",
      shortNote: "",
      customer_rating: 0,
      customer_review: "",
      createdAt: "2026-10-28T10:42:00.000Z",
      updatedAt: "2026-10-28T13:05:00.000Z",
    },
  ];
})();
