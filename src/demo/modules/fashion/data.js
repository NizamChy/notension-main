// Demo data for the fashion & lifestyle backend (FASHION_BASE_URL).
//
// The taxonomy (types, categories, subcategories) is the first 7 types of
// public/data/navItems.json, with the same ids, names and order, so the
// static navbar links and the API-built navItems (generateNavItems) agree.
// Only the images are replaced by demo SVGs.
//
// Field names and nesting follow what src/components/FashionLifestyle reads:
// - categories carry `type_info` as a plain id
// - subcategories carry `type_info` as an id and `category_info` populated
// - products carry type/category/sub-category/brand/store info populated
// - `sizes` and `colors` are comma-separated strings (the UI splits them)
//
// Image fields hold paths under public/demo/ ("fashion/<file>.webp"). The
// photos are freely licensed (see public/demo/CREDITS.md). The older SVG
// placeholders next to them came from `fashionImageSpecs` (shape, colour and
// label per file) and stay so carts saved before the switch still render.
//
// The fashion backend is not district-based, so nothing here is filtered by
// location.

import navItemsJson from "../../../../public/data/navItems.json";

const NAV_TYPES = navItemsJson.slice(0, 7);

// 24-char lowercase hex ids: "66f" + 5-char group + 16-digit sequence.
const makeId = (group, n) => `66f${group}${String(n).padStart(16, "0")}`;

// NFKC turns styled unicode letters (e.g. "Readymade 𝐒𝐚𝐫𝐞𝐞") into plain ones.
const clean = (text) => text.normalize("NFKC").trim();

const slug = (text) =>
  clean(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const img = (name) => `fashion/${name}.webp`;

const CREATED_AT = "2026-09-01T10:00:00.000Z";

// Every generated image: { file, shape, color, label, sub?, wide? }.
export const fashionImageSpecs = [];
const usedFiles = new Set();
const addImage = (spec) => {
  if (!usedFiles.has(spec.file)) {
    usedFiles.add(spec.file);
    fashionImageSpecs.push(spec);
  }
};
// A file name not used yet (product titles can repeat across categories).
const uniqueFile = (base) => {
  let name = base;
  for (let n = 2; usedFiles.has(img(name)); n += 1) name = `${base}-${n}`;
  return img(name);
};

// --------------------------------------------------------------- shapes --

// Garment / item silhouette for an item name (first match wins).
const SHAPE_RULES = [
  [/sock/i, "sock"],
  [/panjabi|sherwani|kabli|fotua/i, "panjabi"],
  [/koti/i, "koti"],
  [/saree/i, "saree"],
  [/hijab|khimar|niqab|scarf/i, "hijab"],
  [/burka|abaya|prayer|gown|nightdress|maternity|jumpsuit|dungaree/i, "abaya"],
  [/kurta|anarkali|three piece|lehenga|dupatta|co-ord|pakistani/i, "salwar"],
  [/dress|frock|skirt|bodycon/i, "frock"],
  [/jean|trouser|pant|denim|capri|pajama|pyjama|lungi/i, "jeans"],
  [/short|brief|underwear|sando/i, "shorts"],
  [/heel/i, "heel"],
  [/sandal|flip|slipper|floater|jutti/i, "sandal"],
  [/shoe|sneaker|boot|loafer|flat|canvas/i, "shoe"],
  [/wallet/i, "wallet"],
  [/bag|clutch|backpack|luggage|trolley|briefcase|pouch/i, "bag"],
  [/sunglass/i, "sunglass"],
  [/watch/i, "watch"],
  [/\bcaps?\b|hat/i, "cap"],
  [/candle/i, "candle"],
  [/lamp|light|chandelier|diya/i, "lamp"],
  [/necklace|earring|\brings?\b|bracelet|bangle|nose pin|tikli|jhapta|jewel|crown|chain/i, "jewel"],
  [/jacket|coat|blazer|suit|hoodie|sweater|sweatshirt|shrug|shawl/i, "shirt"],
  [/t-shirt|tee|top|jersey|polo|tank|thermal|innerwear|bra\b|blouse|petticoat|wear/i, "tshirt"],
  [/shirt/i, "shirt"],
  [/\blip/i, "lipstick"],
  [/brush|comb|tweezer|curler|razor|trimmer|straightener|dryer/i, "brush"],
  [/palette|powder|compact|blush|bronzer|contour|highlighter|eye shadow/i, "palette"],
  [/cream|butter|balm|gel|pack|mask|scrub|wax/i, "jar"],
  [/serum|oil|toner|spray|mist|perfume|ator|wash|cleanser|shampoo|conditioner|lotion|foundation|primer|sanitizer|deodorant|mouthwash|toothpaste|remover|mascara|liner|kajal|concealer|moisturi|sunscreen|color|nail|freshener|diffuser/i, "bottle"],
  [/mirror|frame|clock|wall|art|sticker|shel/i, "frame"],
  [/flower|plant|vase|greenery|planter/i, "plant"],
  [/rug|carpet|\bmats?\b/i, "rug"],
  [/pillow|cushion|sofa|chair|ottoman|pouf|bean|swing|foam/i, "cushion"],
  [/bed|sheet|blanket|quilt|duvet|katha|mattress/i, "bed"],
  [/curtain|net/i, "curtain"],
  [/towel|cloth|runner|napkin|wipe|diaper|tissue|coaster/i, "towel"],
  [/toy|tricycle|slider|rocker|tent|ball|learning|activity|swimming|game/i, "toy"],
];

const shapeFor = (name, fallback) =>
  SHAPE_RULES.find(([re]) => re.test(clean(name)))?.[1] || fallback;

// ---------------------------------------------------------------- sizes --

const SIZES = {
  apparel: "S,M,L,XL,XXL",
  women: "S,M,L,XL",
  panjabi: "38,40,42,44,46",
  jeans: "30,32,34,36,38",
  abaya: "52,54,56,58",
  menShoes: "39,40,41,42,43,44",
  womenShoes: "36,37,38,39,40",
  kids: "2-3Y,4-5Y,6-7Y,8-9Y,10-11Y",
  kidsShoes: "26,28,30,32,34",
  bed: "Single,Double,King",
  luggage: "20 inch,24 inch,28 inch",
  fragrance: "50 ml,100 ml",
  diaper: "NB,S,M,L,XL",
  none: "",
};

const NO_SIZE_SHAPES = ["sock", "hijab", "bag", "wallet", "jewel", "cap", "sunglass", "watch"];
const SHOE_SHAPES = ["shoe", "sandal", "heel"];

const sizesFor = (cfg, subName, shape) => {
  const name = clean(subName);
  if (/diaper/i.test(name)) return SIZES.diaper;
  if (/luggage|trolley/i.test(name)) return SIZES.luggage;
  if (cfg.sizes === "bed") {
    return /sheet|cover|blanket|quilt|duvet|katha|mattress/i.test(name)
      ? SIZES.bed
      : SIZES.none;
  }
  if (NO_SIZE_SHAPES.includes(shape)) return SIZES.none;
  if (SHOE_SHAPES.includes(shape) && !SHOE_SHAPES.includes(cfg.shape)) {
    return cfg.sizes === "kids" ? SIZES.kidsShoes : SIZES.womenShoes;
  }
  if (cfg.sizes === "abaya" && shape !== "abaya") return SIZES.women;
  return SIZES[cfg.sizes] ?? SIZES.none;
};

const sizeChart = (sizes) => {
  if (!sizes) return "null";
  const rows = sizes
    .split(",")
    .map((s) => `<tr><td>${s}</td><td>Available</td></tr>`)
    .join("");
  return `<table><thead><tr><th>Size</th><th>Stock</th></tr></thead><tbody>${rows}</tbody></table><p>Measurements may vary by 1 to 2 cm.</p>`;
};

// --------------------------------------------------------------- brands --

const BRAND_DEFS = [
  { key: "deshi", name: "Deshi Weave" },
  { key: "jamdani", name: "Jamdani House" },
  { key: "urban", name: "Urban Bengal" },
  { key: "nakshi", name: "Nakshi Threads" },
  { key: "padma", name: "Padma Steps" },
  { key: "lotus", name: "Little Lotus" },
  { key: "glow", name: "Glow Naturals" },
  { key: "shuddho", name: "Shuddho Herbals" },
  { key: "ghor", name: "Ghorkonna Home" },
  { key: "safar", name: "Safar Travel Gear" },
  { key: "khela", name: "Khelaghor Toys" },
];

export const fashionBrands = BRAND_DEFS.map((b, i) => ({
  _id: makeId("b4a2d", i + 1),
  brand_name: b.name,
  status: true,
}));

const brandByKey = Object.fromEntries(
  BRAND_DEFS.map((b, i) => [b.key, fashionBrands[i]]),
);

// --------------------------------------------------------------- stores --

const STORE_DEFS = [
  {
    key: "dfh",
    name: "Dhaka Fashion House",
    address: "House 12, Road 11, Gulshan 1, Dhaka 1212",
    contact: "01711-245680",
    alt: "01911-245680",
    color: "Navy",
    shape: "shirt",
    tagline: "Everyday menswear, womenswear, bags & shoes",
    popup: null,
  },
  {
    key: "nb",
    name: "Nakshi Boutique",
    address: "Plot 34, Road 27, Dhanmondi, Dhaka 1209",
    contact: "01819-552013",
    alt: "01552-552013",
    color: "Maroon",
    shape: "saree",
    tagline: "Handloom sarees, panjabi & three-piece",
    popup:
      "Eid rush: orders placed in this shop are delivered within 3 to 5 days. Thank you for your patience!",
  },
  {
    key: "lsk",
    name: "Little Stars Kids",
    address: "Agrabad Commercial Area, Chittagong 4100",
    contact: "01612-778899",
    alt: "01712-778899",
    color: "Orange",
    shape: "frock",
    tagline: "Clothes, shoes, toys & baby care",
    popup: null,
  },
  {
    key: "gcb",
    name: "Glow & Care Beauty",
    address: "Road 11, Block E, Banani, Dhaka 1213",
    contact: "01713-440011",
    alt: "01913-440011",
    color: "Pink",
    shape: "lipstick",
    tagline: "Makeup, skin care, hair care & fragrance",
    popup: null,
  },
  {
    key: "sgh",
    name: "Shokher Ghor Home Decor",
    address: "Section 10, Mirpur, Dhaka 1216",
    contact: "01814-662200",
    alt: "01614-662200",
    color: "Teal",
    shape: "lamp",
    tagline: "Bedding, curtains, lights & home decor",
    popup: null,
  },
];

export const fashionStores = STORE_DEFS.map((s, i) => {
  const web = img(`shop-${slug(s.name)}-web`);
  const app = img(`shop-${slug(s.name)}-app`);
  addImage({ file: web, shape: s.shape, color: s.color, label: s.name, sub: s.tagline, wide: "web" });
  addImage({ file: app, shape: s.shape, color: s.color, label: s.name, sub: s.tagline, wide: "app" });
  return {
    _id: makeId("5703e", i + 1),
    custom_merchant_id: `FMR${String(i + 1).padStart(6, "0")}`,
    shop_name: s.name,
    shop_address: s.address,
    contact_no: s.contact,
    alternative_contact_no: s.alt,
    shop_banner_web: web,
    shop_banner_app: app,
    // Monogram, not the cover photo: a photo crop doesn't read as a logo.
    shop_logo: `fashion/logo-${s.key}.svg`,
    isShowingMsg: Boolean(s.popup),
    popup_message: s.popup || "",
    status: true,
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
  };
});

const storeByKey = Object.fromEntries(
  STORE_DEFS.map((s, i) => [s.key, fashionStores[i]]),
);

// ------------------------------------------------------------- taxonomy --

const TYPE_STYLE = {
  "6880c239098c458993b32675": { shape: "panjabi", color: "Navy" },
  "6880c244098c458993b32677": { shape: "saree", color: "Maroon" },
  "6880c24c098c458993b32679": { shape: "frock", color: "Pink" },
  "6880c255098c458993b3267b": { shape: "lipstick", color: "Red" },
  "6880c25e098c458993b3267d": { shape: "bag", color: "Brown" },
  "6880c277098c458993b32681": { shape: "shoe", color: "Black" },
  "6880c282098c458993b32683": { shape: "lamp", color: "Teal" },
};

// Per category (navItems.json category_id): default shape, colours, price
// range (BDT), size set, material, name qualifiers, stores, brands.
const CATEGORY_CONFIG = {
  // Men
  "689845adb3ca3b7d6ef86cb7": { shape: "tshirt", colors: ["Navy", "White", "Black", "Grey"], price: [590, 3990], sizes: "apparel", material: "Cotton", quals: ["Classic", "Premium", "Everyday", "Slim Fit"], stores: ["dfh", "nb"], brands: ["urban", "deshi"] },
  "68984704b3ca3b7d6ef86cbb": { shape: "panjabi", colors: ["White", "Cream", "Maroon", "Olive"], price: [990, 5500], sizes: "panjabi", material: "Cotton", quals: ["Embroidered", "Handloom", "Festive", "Cotton"], stores: ["nb", "dfh"], brands: ["deshi", "jamdani"] },
  "68984730b3ca3b7d6ef86cbf": { shape: "jeans", colors: ["Blue", "Black", "Beige", "Grey"], price: [450, 2790], sizes: "jeans", material: "Cotton twill", quals: ["Slim Fit", "Regular Fit", "Stretch", "Classic"], stores: ["dfh"], brands: ["urban"] },
  "6898476db3ca3b7d6ef86cc3": { shape: "shorts", colors: ["Grey", "Navy", "White"], price: [290, 1290], sizes: "apparel", material: "Combed cotton", quals: ["Soft", "Breathable", "Everyday"], stores: ["dfh"], brands: ["urban"] },
  // Women
  "6880c3a101737605f43eff4c": { shape: "tshirt", colors: ["Black", "White", "Pink", "Sky Blue"], price: [990, 3490], sizes: "women", material: "Viscose blend", quals: ["Chic", "Classic", "Floral", "Elegant"], stores: ["dfh"], brands: ["urban"] },
  "6880c40e098c458993b326a3": { shape: "tshirt", colors: ["Peach", "Purple", "Yellow", "Blue"], price: [690, 2290], sizes: "women", material: "Cotton", quals: ["Trendy", "Casual", "Printed", "Cool"], stores: ["dfh"], brands: ["urban"] },
  "6880c5f101737605f43eff58": { shape: "salwar", colors: ["Teal", "Peach", "Maroon", "Green"], price: [1890, 6500], sizes: "women", material: "Lawn cotton", quals: ["Embroidered", "Printed", "Designer"], stores: ["nb", "dfh"], brands: ["nakshi", "deshi"] },
  "6880c66801737605f43eff6a": { shape: "salwar", colors: ["Red", "Pink", "Mustard", "Purple"], price: [990, 15500], sizes: "women", material: "Georgette", quals: ["Embroidered", "Designer", "Festive", "Classic"], stores: ["nb"], brands: ["nakshi", "jamdani"] },
  "6880c68b01737605f43eff6d": { shape: "abaya", colors: ["Black", "Navy", "Beige", "Purple"], price: [190, 4500], sizes: "abaya", material: "Nida", quals: ["Classic", "Comfort", "Premium"], stores: ["nb", "dfh"], brands: ["nakshi"] },
  "6880c6b101737605f43eff74": { shape: "tshirt", colors: ["Pink", "Peach", "Black", "White"], price: [350, 1490], sizes: "women", material: "Cotton", quals: ["Soft", "Comfort", "Cotton"], stores: ["dfh"], brands: ["urban"] },
  "6880c6d201737605f43eff77": { shape: "tshirt", colors: ["Black", "Purple", "Teal", "Grey"], price: [790, 2490], sizes: "women", material: "Polyester stretch", quals: ["Active", "Dry-Fit", "Training"], stores: ["dfh"], brands: ["urban"] },
  "6880c6f101737605f43eff7a": { shape: "shirt", colors: ["Brown", "Black", "Beige", "Maroon"], price: [1490, 5990], sizes: "women", material: "Wool blend", quals: ["Warm", "Classic", "Cosy"], stores: ["dfh", "nb"], brands: ["urban", "nakshi"] },
  "6880c71101737605f43eff7d": { shape: "jewel", colors: ["Grey", "Mustard"], price: [290, 2490], sizes: "none", material: "Gold-plated alloy", quals: ["Kundan", "Oxidised", "Pearl", "Traditional"], stores: ["nb"], brands: ["nakshi"] },
  "68a6bcc3a69403fd11905273": { shape: "saree", colors: ["Red", "Green", "Mustard", "Purple"], price: [2490, 18500], sizes: "none", material: "Handloom", quals: ["Handwoven", "Traditional", "Elegant"], stores: ["nb"], brands: ["jamdani", "nakshi"] },
  // Kids World
  "68820ba97f75c082fb074d0b": { shape: "tshirt", colors: ["Blue", "Red", "Navy", "Green"], price: [390, 1990], sizes: "kids", material: "Cotton", quals: ["Boys", "Kids", "Playtime"], stores: ["lsk"], brands: ["lotus"] },
  "68820bd27f75c082fb074d0f": { shape: "frock", colors: ["Pink", "Purple", "Yellow", "Peach"], price: [450, 2490], sizes: "kids", material: "Cotton", quals: ["Girls", "Pretty", "Party"], stores: ["lsk"], brands: ["lotus"] },
  "68820c127f75c082fb074d17": { shape: "shoe", colors: ["Blue", "Black", "Grey"], price: [190, 1890], sizes: "kidsShoes", material: "Synthetic, rubber sole", quals: ["Boys", "Comfy", "Kids"], stores: ["lsk"], brands: ["padma"] },
  "68820c397f75c082fb074d1b": { shape: "shoe", colors: ["Pink", "Purple", "White"], price: [190, 1890], sizes: "kidsShoes", material: "Synthetic, rubber sole", quals: ["Girls", "Sparkle", "Kids"], stores: ["lsk"], brands: ["padma"] },
  "68820c537f75c082fb074d1f": { shape: "box", colors: ["Sky Blue", "Yellow", "Pink"], price: [150, 1890], sizes: "none", material: "Baby safe", quals: ["Baby", "Gentle", "Kids"], stores: ["lsk"], brands: ["lotus"] },
  "68820c737f75c082fb074d23": { shape: "toy", colors: ["Red", "Yellow", "Blue", "Green"], price: [450, 6500], sizes: "none", material: "BPA-free plastic", quals: ["Fun", "Kids", "Junior"], stores: ["lsk"], brands: ["khela"] },
  // Health & Beauty
  "68847ef1479ddf0c0bf2e850": { shape: "lipstick", colors: ["Red", "Pink", "Peach", "Brown"], price: [250, 2490], sizes: "none", material: "Cruelty-free formula", quals: ["Matte", "Long-Wear", "HD", "Glow"], stores: ["gcb"], brands: ["glow"] },
  "68847f36479ddf0c0bf2e854": { shape: "jar", colors: ["Peach", "Green", "Sky Blue", "White"], price: [190, 2290], sizes: "none", material: "Dermatologically tested", quals: ["Aloe", "Vitamin C", "Herbal", "Hydrating"], stores: ["gcb"], brands: ["glow", "shuddho"] },
  "68847f8b479ddf0c0bf2e858": { shape: "bottle", colors: ["Green", "Mustard", "Purple"], price: [220, 3490], sizes: "none", material: "Paraben-free", quals: ["Onion", "Argan", "Herbal", "Keratin"], stores: ["gcb"], brands: ["shuddho", "glow"] },
  "68847fcf479ddf0c0bf2e85c": { shape: "bottle", colors: ["Sky Blue", "White", "Green"], price: [90, 1490], sizes: "none", material: "Everyday care", quals: ["Fresh", "Gentle", "Daily"], stores: ["gcb"], brands: ["shuddho"] },
  "688483576c7fd47dbe4cb0e6": { shape: "bottle", colors: ["Purple", "Mustard", "Navy"], price: [450, 4990], sizes: "fragrance", material: "Long-lasting fragrance", quals: ["Oud", "Rose", "Musk", "Citrus"], stores: ["gcb"], brands: ["glow"] },
  "68d3bb1423d77892f228bdb9": { shape: "jewel", colors: ["Pink", "Black", "Mustard"], price: [90, 690], sizes: "none", material: "Alloy & fabric", quals: ["Pearl", "Velvet", "Classic"], stores: ["gcb", "nb"], brands: ["glow", "nakshi"] },
  // Bag & Accessories
  "68872faa9c2740b1409e8f34": { shape: "bag", colors: ["Brown", "Black", "Maroon", "Beige"], price: [790, 4990], sizes: "none", material: "Vegan leather", quals: ["Classic", "Chic", "Everyday", "Party"], stores: ["dfh", "nb"], brands: ["deshi", "urban"] },
  "6887306e9c2740b1409e8f38": { shape: "bag", colors: ["Black", "Brown", "Navy"], price: [690, 5490], sizes: "none", material: "Genuine leather", quals: ["Leather", "Urban", "Classic"], stores: ["dfh"], brands: ["deshi", "urban"] },
  "688738a5b171aaddf17b2b2c": { shape: "bag", colors: ["Navy", "Black", "Grey"], price: [2490, 14500], sizes: "none", material: "Polycarbonate & nylon", quals: ["Hard Shell", "Travel", "Executive"], stores: ["dfh"], brands: ["safar"] },
  "68873afe30dc5208f46f9b29": { shape: "watch", colors: ["Black", "Brown", "Mustard"], price: [590, 6990], sizes: "none", material: "Metal & glass", quals: ["Classic", "Polarised", "Sport"], stores: ["dfh"], brands: ["urban"] },
  "688743b7b171aaddf17b2b5e": { shape: "cap", colors: ["Navy", "Beige", "Pink"], price: [290, 990], sizes: "none", material: "Cotton twill", quals: ["Summer", "Classic", "Sporty"], stores: ["dfh", "lsk"], brands: ["urban", "lotus"] },
  // Foot wear
  "6887522ca8915c6d019ee2ed": { shape: "shoe", colors: ["Black", "Brown", "White", "Navy"], price: [490, 4990], sizes: "menShoes", material: "Leather & rubber", quals: ["Classic", "Comfort", "Leather", "Lightweight"], stores: ["dfh", "nb"], brands: ["padma"] },
  "68875243a8915c6d019ee2f1": { shape: "sandal", colors: ["Beige", "Black", "Maroon", "Pink"], price: [390, 3990], sizes: "womenShoes", material: "Synthetic leather", quals: ["Comfort", "Embellished", "Classic", "Soft"], stores: ["dfh", "nb"], brands: ["padma"] },
  "688752a2cf4db5cc0c292598": { shape: "shoe", colors: ["Blue", "Black", "Red"], price: [190, 1890], sizes: "kidsShoes", material: "Synthetic, rubber sole", quals: ["Boys", "Junior", "Kids"], stores: ["lsk", "dfh"], brands: ["padma"] },
  "68875e23715b99c0be0ed9d0": { shape: "shoe", colors: ["Pink", "Purple", "White"], price: [190, 1890], sizes: "kidsShoes", material: "Synthetic, rubber sole", quals: ["Girls", "Glitter", "Kids"], stores: ["lsk", "dfh"], brands: ["padma"] },
  // Home Decor
  "688df27a5c7edc6cd6f99215": { shape: "bed", colors: ["Sky Blue", "Cream", "Maroon", "Green"], price: [590, 14500], sizes: "bed", material: "Cotton", quals: ["Cotton", "Printed", "Soft", "Premium"], stores: ["sgh", "nb"], brands: ["ghor", "nakshi"] },
  "688eef605b4740c92041a9ca": { shape: "curtain", colors: ["Beige", "Teal", "Maroon"], price: [450, 3990], sizes: "none", material: "Polyester blend", quals: ["Blackout", "Sheer", "Classic"], stores: ["sgh"], brands: ["ghor"] },
  "688eef8a5b4740c92041a9ce": { shape: "cushion", colors: ["Mustard", "Teal", "Grey", "Brown"], price: [990, 12500], sizes: "none", material: "Cane & fabric", quals: ["Cosy", "Handmade", "Classic"], stores: ["sgh"], brands: ["ghor"] },
  "688ef3e552036370aa78d661": { shape: "frame", colors: ["Brown", "Black", "Mustard"], price: [290, 4990], sizes: "none", material: "Wood & metal", quals: ["Rustic", "Modern", "Handcrafted"], stores: ["sgh"], brands: ["ghor"] },
  "688ef49ce63e3dbcf6ef07fe": { shape: "lamp", colors: ["Mustard", "Brown", "White"], price: [190, 6990], sizes: "none", material: "Bamboo & metal", quals: ["Warm", "Handcrafted", "Decorative"], stores: ["sgh"], brands: ["ghor"] },
  "688ef4c9e63e3dbcf6ef0802": { shape: "bottle", colors: ["Purple", "Green", "Peach"], price: [250, 2490], sizes: "none", material: "Natural fragrance", quals: ["Lavender", "Jasmine", "Sandalwood"], stores: ["sgh", "gcb"], brands: ["ghor", "glow"] },
  "688ef4fce63e3dbcf6ef0806": { shape: "plant", colors: ["Green", "Olive", "Pink"], price: [250, 2990], sizes: "none", material: "Ceramic & silk", quals: ["Lifelike", "Ceramic", "Decorative"], stores: ["sgh"], brands: ["ghor"] },
  "688ef7b7b927b07f6385930f": { shape: "rug", colors: ["Maroon", "Teal", "Beige"], price: [390, 8990], sizes: "none", material: "Jute & cotton", quals: ["Jute", "Handwoven", "Anti-Slip"], stores: ["sgh"], brands: ["ghor"] },
  "688efb9ac5b5439e04fd60dc": { shape: "towel", colors: ["Cream", "Maroon", "Green"], price: [190, 1990], sizes: "none", material: "Cotton & jute", quals: ["Jute", "Embroidered", "Classic"], stores: ["sgh"], brands: ["ghor"] },
  "688efbc2c5b5439e04fd60e0": { shape: "towel", colors: ["Sky Blue", "White", "Grey"], price: [290, 1990], sizes: "none", material: "Waterproof polyester", quals: ["Waterproof", "Modern", "Classic"], stores: ["sgh"], brands: ["ghor"] },
  "688efbffc5b5439e04fd60f0": { shape: "lamp", colors: ["Mustard", "Red", "Green"], price: [150, 1990], sizes: "none", material: "Mixed materials", quals: ["Festive", "Decorative"], stores: ["sgh"], brands: ["ghor"] },
  "688efc221b4839b59f77a3c9": { shape: "box", colors: ["Grey", "Beige", "White"], price: [150, 1990], sizes: "none", material: "Plastic & fabric", quals: ["Foldable", "Multi-Use", "Sturdy"], stores: ["sgh"], brands: ["ghor"] },
};

// Names that read badly as "<qualifier> <subcategory>".
const TITLE_OVERRIDES = {
  Weightloss: "Herbal Slimming Green Tea",
  Chocolates: "Assorted Milk Chocolates Box",
  "Baby Food": "Rice & Lentil Baby Cereal",
  Diapers: "Soft Care Baby Diapers",
  Ties: "Silk Necktie",
  "Hade Cap": "Cotton Baseball Cap",
  Ator: "Oud Attar Roll-On",
  Inner: "Cotton Hijab Inner Cap",
  "Comfy Foam": "Comfy Foam Floor Cushion",
  "Nakshi Katha": "Handstitched Nakshi Kantha Quilt",
  Lungi: "Pabna Check Lungi",
  "Sando Ganji": "Cotton Sando Ganji",
  Fotua: "Kids Cotton Fotua",
  Jhapta: "Bridal Jhapta Hair Ornament",
  Tikli: "Kundan Tikli",
  "Diwali Lights & Diyas": "Clay Diya Set",
  "Eid/Ramadan Decor": "Eid Mubarak Moon Lantern",
  "Christmas Tree & Ornaments": "Christmas Ornament Set",
  "Birthday Decoration": "Birthday Balloon Decoration Kit",
  Swing: "Cane Hanging Swing Chair",
  "Mosquito Nets": "Cotton Mosquito Net (Moshari)",
  "Masks & Protective Gears": "Kids Cotton Face Masks (Pack of 5)",
  "Kids Tricycle": "Kids Tricycle with Basket",
};

// Price ranges (BDT) for small items, overriding the category range.
const PRICE_RULES = [
  [/sock/i, [90, 390]],
  [/wipe|toothpaste|tooth brush|soap|sanitizer|hand wash|bobby|clip|pin|coaster|tissue|face mask|loofah|hairband|headband/i, [90, 590]],
  [/innerwear|underwear|briefs?$|(^| )bra( |$)|sando|petticoat|inner$/i, [190, 890]],
  [/flip|slipper/i, [190, 790]],
];

// Subcategories without demo products.
const SKIP_SUBCATEGORIES = ["Sexual Wellness"];

export const fashionTypes = NAV_TYPES.map((t, i) => {
  const style = TYPE_STYLE[t.type_id] || { shape: "box", color: "Grey" };
  const file = img(`type-${slug(t.type_name)}`);
  addImage({ file, shape: style.shape, color: style.color, label: t.type_name });
  return {
    _id: t.type_id,
    type_name: t.type_name,
    type_img: file,
    serial_no: i + 1,
    status: true,
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
  };
});

export const fashionCategories = [];
export const fashionSubCategories = [];

NAV_TYPES.forEach((t) => {
  t.categories.forEach((c) => {
    const cfg = CATEGORY_CONFIG[c.category_id];
    const banner = img(`cat-${slug(t.type_name)}-${slug(c.name)}`);
    addImage({ file: banner, shape: cfg.shape, color: cfg.colors[0], label: clean(c.name) });
    const category = {
      _id: c.category_id,
      category_name: c.name,
      type_info: t.type_id,
      banner,
      serial_no: fashionCategories.length + 1,
      status: true,
      createdAt: CREATED_AT,
      updatedAt: CREATED_AT,
    };
    fashionCategories.push(category);

    c.subcategories.forEach((s, j) => {
      const file = img(`sub-${slug(t.type_name)}-${slug(c.name)}-${slug(s.name)}`);
      addImage({
        file,
        shape: shapeFor(s.name, cfg.shape),
        color: cfg.colors[(j + 1) % cfg.colors.length],
        label: clean(s.name),
      });
      fashionSubCategories.push({
        _id: s.id,
        sub_category_name: s.name,
        type_info: t.type_id,
        category_info: {
          _id: category._id,
          category_name: category.category_name,
          type_info: category.type_info,
          banner: category.banner,
        },
        banner_type_1: file,
        banner_type_2: file,
        serial_no: fashionSubCategories.length + 1,
        status: true,
        createdAt: CREATED_AT,
        updatedAt: CREATED_AT,
      });
    });
  });
});

const findSub = (categoryId, subName) =>
  fashionSubCategories.find(
    (s) => s.category_info._id === categoryId && s.sub_category_name === subName,
  );

// ------------------------------------------------------------- products --

const DETAIL_IMAGES = [img("detail-fabric"), img("detail-stitching")];
addImage({ file: DETAIL_IMAGES[0], shape: "fabric", color: "Beige", label: "Fabric close-up" });
addImage({ file: DETAIL_IMAGES[1], shape: "stitch", color: "Grey", label: "Fine stitching" });

const CAT = {
  menTop: "689845adb3ca3b7d6ef86cb7",
  menTraditional: "68984704b3ca3b7d6ef86cbb",
  menBottom: "68984730b3ca3b7d6ef86cbf",
  womenThreePieces: "6880c5f101737605f43eff58",
  womenTraditional: "6880c66801737605f43eff6a",
  womenBurka: "6880c68b01737605f43eff6d",
  womenJewellery: "6880c71101737605f43eff7d",
  womenSaree: "68a6bcc3a69403fd11905273",
  boys: "68820ba97f75c082fb074d0b",
  girls: "68820bd27f75c082fb074d0f",
  boyFootwear: "68820c127f75c082fb074d17",
  womenBag: "68872faa9c2740b1409e8f34",
  menBag: "6887306e9c2740b1409e8f38",
  menFootwear: "6887522ca8915c6d019ee2ed",
  womenFootwear: "68875243a8915c6d019ee2f1",
};

// Hand-written products (with colour images):
// [title, categoryId, subcategory name, brand, store, mrp, sale, sizes key,
//  colors, material, fit, description, flags]
// flags: p = popular, n = new, b = bestseller, f = featured
const CURATED_DEFS = [
  // Men
  ["Embroidered Cotton Panjabi", CAT.menTraditional, "Panjabi", "deshi", "dfh", 2450, 1950, "panjabi", ["White", "Navy", "Maroon"], "100% cotton", "Regular", "Soft cotton panjabi with tone-on-tone neck embroidery, ideal for Jummah and family gatherings.", "pb"],
  ["Silk Blend Eid Panjabi", CAT.menTraditional, "Panjabi", "jamdani", "nb", 4500, 3990, "panjabi", ["Cream", "Maroon"], "Silk blend", "Regular", "Festive silk-blend panjabi with a subtle sheen and hand-finished placket.", "pnf"],
  ["Linen Short Panjabi", CAT.menTraditional, "Panjabi", "urban", "dfh", 1850, 1850, "panjabi", ["Olive", "Sky Blue"], "Linen cotton", "Relaxed", "Breathable short-length panjabi that pairs well with jeans or chinos.", ""],
  ["Printed Cotton Koti", CAT.menTraditional, "Koti", "deshi", "nb", 1650, 1390, "apparel", ["Black", "Mustard"], "Cotton", "Regular", "Block-printed koti to layer over a plain panjabi.", "p"],
  ["Oxford Casual Shirt", CAT.menTop, "Casual Shirts", "urban", "dfh", 1690, 1490, "apparel", ["Sky Blue", "White"], "Oxford cotton", "Regular", "Button-down Oxford shirt for work days and weekends.", "p"],
  ["Checked Flannel Shirt", CAT.menTop, "Casual Shirts", "urban", "dfh", 1590, 1590, "apparel", ["Red", "Navy"], "Cotton flannel", "Regular", "Warm brushed-cotton checked shirt for winter evenings.", ""],
  ["Slim Fit Formal Shirt", CAT.menTop, "Formal Shirts", "urban", "dfh", 1990, 1690, "apparel", ["White", "Sky Blue", "Pink"], "Cotton poplin", "Slim", "Crisp poplin formal shirt with a cutaway collar.", "pb"],
  ["Premium Cotton Crew T-Shirt", CAT.menTop, "T-Shirts", "urban", "dfh", 690, 550, "apparel", ["Black", "White", "Grey"], "Combed cotton", "Regular", "Everyday crew-neck tee in 180 GSM combed cotton.", "pb"],
  ["Dhaka City Graphic T-Shirt", CAT.menTop, "T-Shirts", "deshi", "nb", 790, 690, "apparel", ["Navy", "Mustard"], "Cotton", "Regular", "Graphic tee printed with a rickshaw-art Dhaka skyline.", "n"],
  ["Pique Polo Shirt", CAT.menTop, "Polo", "urban", "dfh", 1190, 990, "apparel", ["Green", "Navy"], "Cotton pique", "Regular", "Classic polo with a ribbed collar and two-button placket.", "p"],
  ["Slim Fit Stretch Jeans", CAT.menBottom, "Jeans", "urban", "dfh", 2490, 2190, "jeans", ["Blue", "Black"], "Stretch denim", "Slim", "Mid-rise stretch jeans that keep their shape all day.", "pb"],
  ["Regular Fit Denim Jeans", CAT.menBottom, "Denim", "deshi", "nb", 2290, 2290, "jeans", ["Indigo"], "Denim", "Regular", "Straight-leg rigid denim with a comfortable regular fit.", ""],
  ["Cotton Chino Trousers", CAT.menBottom, "Trousers", "urban", "dfh", 1890, 1650, "jeans", ["Beige", "Olive"], "Cotton twill", "Slim", "Smart chinos that work for the office and evenings out.", "n"],
  ["Leather Kolhapuri Sandals", CAT.menFootwear, "Sandals & Floaters", "padma", "nb", 1490, 1290, "menShoes", ["Brown"], "Genuine leather", "Regular", "Handcrafted leather sandals, a natural pick with panjabi.", "p"],
  ["Canvas Casual Sneakers", CAT.menFootwear, "Canvas", "padma", "dfh", 2990, 2490, "menShoes", ["White", "Black"], "Canvas, rubber sole", "Regular", "Lightweight lace-up canvas sneakers with a cushioned insole.", "n"],
  ["Genuine Leather Wallet", CAT.menBag, "Wallet", "deshi", "nb", 990, 890, "none", ["Brown", "Black"], "Genuine leather", "", "Bi-fold wallet with six card slots and a coin pocket.", ""],

  // Women
  ["Dhakai Jamdani Saree", CAT.womenSaree, "Jamdani Saree", "jamdani", "nb", 14500, 12500, "none", ["Red", "Cream"], "Handloom cotton jamdani", "", "Handwoven Dhakai jamdani with a traditional motif border. Comes with blouse piece.", "pf"],
  ["Tangail Cotton Saree", CAT.womenSaree, "Cotton Saree", "jamdani", "nb", 3200, 2800, "none", ["Green", "Mustard"], "Tangail cotton", "", "Light Tangail cotton saree for everyday wear in the heat.", "p"],
  ["Printed Georgette Saree", CAT.womenSaree, "Party Saree", "nakshi", "dfh", 3800, 3290, "none", ["Pink", "Purple"], "Georgette", "", "Flowing floral-print georgette saree for parties and dawats.", "n"],
  ["Embroidered Lawn Three-Piece", CAT.womenThreePieces, "Boutique Three Pieces", "nakshi", "nb", 4800, 4200, "women", ["Teal", "Peach"], "Lawn cotton", "Regular", "Stitched salwar kameez with embroidered yoke and a chiffon dupatta.", "pb"],
  ["Unstitched Cotton Three-Piece", CAT.womenThreePieces, "Cotton Three Pieces", "deshi", "dfh", 2450, 2450, "none", ["Maroon", "Beige"], "Cotton", "", "Unstitched kameez, salwar and dupatta fabric set (2.5 + 2.5 + 2.5 yards).", ""],
  ["Block Print Kurti", CAT.womenTraditional, "Kurtas", "nakshi", "nb", 1450, 1150, "women", ["Mustard", "Indigo"], "Cotton", "Regular", "Hand block-printed straight kurti with three-quarter sleeves.", "p"],
  ["Rayon A-Line Kurti", CAT.womenTraditional, "Kurtas", "nakshi", "dfh", 1850, 1650, "women", ["Pink", "Sky Blue"], "Rayon", "A-line", "Soft rayon A-line kurti that drapes well with palazzos.", "n"],
  ["Jersey Hijab", CAT.womenBurka, "Hijab", "nakshi", "dfh", 450, 390, "none", ["Black", "Beige", "Pink"], "Cotton jersey", "", "Stretchy, breathable jersey hijab that stays in place.", "pb"],
  ["Chiffon Printed Hijab", CAT.womenBurka, "Hijab", "nakshi", "nb", 650, 550, "none", ["Purple", "Peach"], "Chiffon", "", "Lightweight printed chiffon hijab for special occasions.", ""],
  ["Classic Nida Abaya", CAT.womenBurka, "Regular Burka", "nakshi", "nb", 3200, 2800, "abaya", ["Black", "Navy"], "Nida", "Regular", "Flowy nida abaya with lace-trimmed sleeves.", "p"],
  ["Block Heel Sandals", CAT.womenFootwear, "Heels", "padma", "dfh", 1990, 1690, "womenShoes", ["Beige", "Black"], "Synthetic leather", "Regular", "Comfortable 2-inch block heels with an ankle strap.", ""],
  ["Leather Tote Bag", CAT.womenBag, "Tote Bag", "deshi", "dfh", 2450, 1990, "none", ["Brown", "Maroon"], "Genuine leather", "", "Roomy tote with a zip pocket, fits a laptop up to 14 inches.", "p"],
  ["Oxidised Jhumka & Necklace Set", CAT.womenJewellery, "Necklace Sets", "nakshi", "nb", 850, 690, "none", ["Grey"], "Oxidised alloy", "", "Traditional oxidised necklace with matching jhumka earrings.", "n"],

  // Kids World
  ["Cotton Party Frock", CAT.girls, "Party wear", "lotus", "lsk", 1650, 1390, "kids", ["Pink", "Purple"], "Cotton with net layer", "Regular", "Twirl-ready party frock with a soft cotton lining.", "pf"],
  ["Floral Summer Frock", CAT.girls, "Dresses", "lotus", "lsk", 1150, 950, "kids", ["Yellow", "Sky Blue"], "Cotton", "Regular", "Sleeveless floral frock for hot summer days.", "p"],
  ["Girls' Embroidered Salwar Set", CAT.girls, "Kurta Sets", "lotus", "lsk", 1890, 1690, "kids", ["Peach", "Teal"], "Cotton", "Regular", "Three-piece salwar set with light embroidery, perfect for Eid.", "n"],
  ["Kids Cartoon Print T-Shirt", CAT.boys, "T-Shirts", "lotus", "lsk", 450, 390, "kids", ["Red", "Blue", "Yellow"], "Cotton", "Regular", "Fun cartoon-print tee in soft, skin-friendly cotton.", "pb"],
  ["Kids Striped T-Shirt", CAT.boys, "T-Shirts", "urban", "dfh", 490, 490, "kids", ["Navy", "Green"], "Cotton", "Regular", "Classic striped tee for school and play.", ""],
  ["Kids Cotton Panjabi", CAT.boys, "Panjabi & Pajama", "deshi", "lsk", 1250, 950, "kids", ["White", "Sky Blue"], "Cotton", "Regular", "Comfortable cotton panjabi for little ones.", "p"],
  ["Kids Eid Panjabi Set", CAT.boys, "Panjabi & Pajama", "jamdani", "nb", 1650, 1450, "kids", ["Maroon", "Cream"], "Cotton silk", "Regular", "Panjabi and pajama set with festive embroidery.", "f"],
  ["Kids Denim Shorts", CAT.boys, "Shorts", "lotus", "lsk", 690, 590, "kids", ["Blue"], "Denim", "Regular", "Soft denim shorts with an elastic waist.", ""],
  ["Kids Jogger Pants", CAT.boys, "Track Pants & Pyjamas", "lotus", "lsk", 790, 690, "kids", ["Grey", "Navy"], "Cotton fleece", "Relaxed", "Cosy joggers with ribbed cuffs.", ""],
  ["Kids Velcro Sneakers", CAT.boyFootwear, "Sports Shoes", "padma", "lsk", 1290, 1090, "kidsShoes", ["Blue", "Pink"], "Mesh, rubber sole", "Regular", "Easy on, easy off sneakers with a non-slip sole.", "p"],
  ["Kids School Shoes", CAT.boyFootwear, "School Shoes", "padma", "lsk", 1490, 1490, "kidsShoes", ["Black"], "Synthetic leather", "Regular", "Durable black school shoes with a padded collar.", ""],
];

const populatedStore = (store) => ({
  _id: store._id,
  custom_merchant_id: store.custom_merchant_id,
  shop_name: store.shop_name,
  shop_address: store.shop_address,
  contact_no: store.contact_no,
  alternative_contact_no: store.alternative_contact_no,
  shop_banner_web: store.shop_banner_web,
  shop_banner_app: store.shop_banner_app,
});

const roundPrice = (value) => Math.max(90, Math.round(value / 50) * 50 - 10);

const buildProduct = (n, p) => {
  const sub = p.sub;
  const cat = fashionCategories.find((c) => c._id === sub.category_info._id);
  const type = fashionTypes.find((t) => t._id === cat.type_info);
  const webImage = uniqueFile(slug(p.title));
  addImage({ file: webImage, shape: p.shape, color: p.colors[0], label: p.title });

  const imagesByColor = p.colorImages
    ? p.colors.map((color) => {
        // "fashion/<name>.webp" -> "<name>-<colour>"
        const base = webImage.replace(/^fashion\//, "").replace(/\.\w+$/, "");
        const file = uniqueFile(`${base}-${slug(color)}`);
        addImage({ file, shape: p.shape, color, label: `${p.title} - ${color}` });
        return file;
      })
    : [];

  const specRows = [
    ["Material", p.material],
    p.fit ? ["Fit", p.fit] : null,
    ["Colours", p.colors.join(", ")],
    ["Origin", "Bangladesh"],
  ]
    .filter(Boolean)
    .map(([k, v]) => `<li><strong>${k}:</strong> ${v}</li>`)
    .join("");

  return {
    _id: makeId("9d0c7", n),
    product_code: `FL-${String(1000 + n)}`,
    product_title_eng: p.title,
    product_title_beng: p.title,
    type_info: { _id: type._id, type_name: type.type_name },
    category_info: { _id: cat._id, category_name: cat.category_name },
    sub_category_info: { _id: sub._id, sub_category_name: sub.sub_category_name },
    brand_info: { ...brandByKey[p.brand] },
    store_info: populatedStore(storeByKey[p.store]),
    web_image: webImage,
    app_image: webImage,
    images_by_color: imagesByColor,
    detail_product_image: DETAIL_IMAGES,
    sizes: p.sizes,
    colors: p.colors.join(","),
    max_retail_price: p.mrp,
    sale_price: p.sale,
    purchase_price: Math.round(p.sale * 0.7),
    unit_symbol: "pcs",
    max_allowed: 5,
    stock_qty: 20 + ((n * 7) % 30),
    is_popular: p.flags.includes("p"),
    new: p.flags.includes("n"),
    bestseller: p.flags.includes("b"),
    featured: p.flags.includes("f"),
    rating: [4.5, 4.2, 4.8, 4, 4.6, 4.3, 4.7][n % 7],
    reviews: 12 + ((n * 13) % 140),
    description: `<p>${p.description}</p>`,
    specification: `<ul>${specRows}</ul>`,
    size_chart: sizeChart(p.sizes),
    status: true,
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
  };
};

const productDefs = [];

CURATED_DEFS.forEach((def) => {
  const [title, categoryId, subName, brand, store, mrp, sale, sizeKey, colors, material, fit, description, flags] = def;
  const sub = findSub(categoryId, subName);
  if (!sub) throw new Error(`[demo fashion] unknown subcategory ${subName}`);
  const cfg = CATEGORY_CONFIG[categoryId];
  productDefs.push({
    title, sub, brand, store, mrp, sale, sizes: SIZES[sizeKey], colors,
    material, fit, description, flags,
    shape: shapeFor(title, shapeFor(subName, cfg.shape)),
    colorImages: colors.length > 1,
  });
});

// One generated product for every subcategory that has no curated product.
const coveredSubs = new Set(productDefs.map((p) => p.sub._id));
let g = 0;
NAV_TYPES.forEach((t) => {
  t.categories.forEach((c) => {
    const cfg = CATEGORY_CONFIG[c.category_id];
    c.subcategories.forEach((s, j) => {
      if (coveredSubs.has(s.id) || SKIP_SUBCATEGORIES.includes(clean(s.name))) return;
      g += 1;
      const subName = clean(s.name);
      let qual = cfg.quals[j % cfg.quals.length];
      if (subName.toLowerCase().includes(qual.toLowerCase())) {
        qual = cfg.quals[(j + 1) % cfg.quals.length];
      }
      const title = TITLE_OVERRIDES[subName] || `${qual} ${subName}`;
      const shape = shapeFor(subName, cfg.shape);
      const [min, max] =
        PRICE_RULES.find(([re]) => re.test(subName))?.[1] || cfg.price;
      const mrp = roundPrice(min + (((j * 37 + g * 13) % 20) / 19) * (max - min));
      const sale = g % 3 === 0 ? roundPrice(mrp * 0.85) : mrp;
      const colors = [cfg.colors[j % cfg.colors.length]];
      if (g % 2 === 0) colors.push(cfg.colors[(j + 1) % cfg.colors.length]);
      const brand = cfg.brands[j % cfg.brands.length];
      const flags = `${g % 4 === 0 ? "p" : ""}${g % 5 === 1 ? "n" : ""}${g % 7 === 2 ? "b" : ""}`;
      productDefs.push({
        title,
        sub: findSub(c.category_id, s.name),
        brand,
        store: cfg.stores[j % cfg.stores.length],
        mrp,
        sale: Math.min(sale, mrp),
        sizes: sizesFor(cfg, s.name, shape),
        colors,
        material: cfg.material,
        fit: cfg.sizes !== "none" && !NO_SIZE_SHAPES.includes(shape) ? "Regular" : "",
        description: `${title} by ${brandByKey[brand].brand_name}. ${cfg.material}, quality checked and ready to ship from Dhaka.`,
        flags,
        shape,
        colorImages: false,
      });
    });
  });
});

export const fashionProducts = productDefs.map((p, i) => buildProduct(i + 1, p));

// --------------------------------------------------------------- orders --

// Past orders shown to whoever is logged in (customer ids are filled in by
// the order-by-customer handler). New orders are added in memory.
const orderItem = (product, quantity, size) => ({
  _id: product._id,
  type_info: product.type_info._id,
  brand_info: product.brand_info,
  product_title_eng: product.product_title_eng,
  product_title_beng: product.product_title_beng,
  product_size: size,
  purchase_price: product.sale_price,
  max_retail_price: product.max_retail_price,
  sale_price: product.sale_price,
  unit_symbol: "pcs",
  max_allowed: product.max_allowed,
  quantity,
  delivered_qty: quantity,
  inc_qty: 1,
  ordered_img: product.images_by_color[0] || product.web_image,
  app_image: product.images_by_color[0] || product.web_image,
  web_image: product.web_image,
});

const seedOrder = (n, storeKey, items, status, createdAt, payment) => {
  const store = storeByKey[storeKey];
  const subTotal = items.reduce((s, it) => s + it.sale_price * it.quantity, 0);
  const deliveryCharge = 0;
  return {
    _id: makeId("0d3a1", n),
    order_id: `FSN-20261020-${String(100200 + n)}`,
    customer_id: null,
    custom_customer_id: null,
    customerInfo: {
      customer_name: "Demo Customer",
      customer_address: "House 8, Road 5, Gulshan 2, Dhaka",
      contact_no: "01700-000000",
      alternative_contact_no: "01700-000000",
    },
    merchant_id: store._id,
    custom_merchant_id: store.custom_merchant_id,
    merchantInfo: {
      shop_name: store.shop_name,
      shop_address: store.shop_address,
      contact_no: store.contact_no,
      alternative_contact_no: store.alternative_contact_no,
    },
    orderItems: items,
    subTotal,
    less_amount: 0,
    vatAmount: 0,
    deliveryCharge,
    totalAmount: subTotal + deliveryCharge,
    shortNote: "",
    paymet_method: payment,
    order_status: status,
    createdAt,
    updatedAt: createdAt,
  };
};

const productByTitle = (title) =>
  fashionProducts.find((p) => p.product_title_eng === title);

export const fashionSeedOrders = [
  seedOrder(
    1,
    "dfh",
    [
      orderItem(productByTitle("Premium Cotton Crew T-Shirt"), 2, "L"),
      orderItem(productByTitle("Slim Fit Stretch Jeans"), 1, "32"),
    ],
    "Delivered",
    "2026-10-20T08:30:00.000Z",
    "Cash on Delivery",
  ),
  seedOrder(
    2,
    "nb",
    [orderItem(productByTitle("Tangail Cotton Saree"), 1, null)],
    "Delivered",
    "2026-10-28T12:15:00.000Z",
    "bKash",
  ),
];
