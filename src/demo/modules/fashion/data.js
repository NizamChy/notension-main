// Demo data for the fashion & lifestyle backend (FASHION_BASE_URL).
//
// Field names and nesting follow what src/components/FashionLifestyle reads:
// - categories carry `type_info` as a plain id
// - subcategories carry `type_info` as an id and `category_info` populated
// - products carry type/category/sub-category/brand/store info populated
// - `sizes` and `colors` are comma-separated strings (the UI splits them)
//
// Image fields hold paths under public/demo/ ("fashion/<file>.svg"). The SVGs
// in public/demo/fashion/ were generated from `fashionImageSpecs` (one entry
// per file: garment shape, colour and label); add a spec when adding images.
//
// The fashion backend is not district-based, so nothing here is filtered by
// location.

import {
  MEN_TYPE_ID,
  WOMEN_TYPE_ID,
  KIDS_TYPE_ID,
} from "@/components/FashionLifestyle/utils/constants";

// 24-char lowercase hex ids: "66f" + 5-char group + 16-digit sequence.
const makeId = (group, n) => `66f${group}${String(n).padStart(16, "0")}`;

const slug = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const img = (name) => `fashion/${name}.svg`;

const CREATED_AT = "2026-09-01T10:00:00.000Z";

// Every generated image: { file, shape, color, label, wide? }.
export const fashionImageSpecs = [];
const addImage = (spec) => {
  if (!fashionImageSpecs.some((s) => s.file === spec.file)) {
    fashionImageSpecs.push(spec);
  }
};

// ---------------------------------------------------------------- types --

const TYPE_DEFS = [
  { key: "men", id: MEN_TYPE_ID, name: "Men's Fashion", shape: "panjabi", color: "Navy" },
  { key: "women", id: WOMEN_TYPE_ID, name: "Women's Fashion", shape: "saree", color: "Maroon" },
  { key: "kids", id: KIDS_TYPE_ID, name: "Kids' Fashion", shape: "frock", color: "Pink" },
];

export const fashionTypes = TYPE_DEFS.map((t, i) => {
  const file = img(`type-${t.key}`);
  addImage({ file, shape: t.shape, color: t.color, label: t.name });
  return {
    _id: t.id,
    type_name: t.name,
    type_img: file,
    serial_no: i + 1,
    status: true,
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
  };
});

const typeByKey = Object.fromEntries(
  TYPE_DEFS.map((t) => [t.key, fashionTypes.find((x) => x._id === t.id)]),
);

// ----------------------------------------------------------- categories --

const CATEGORY_DEFS = [
  { key: "m-ethnic", type: "men", name: "Ethnic Wear", shape: "panjabi", color: "Cream" },
  { key: "m-top", type: "men", name: "Topwear", shape: "shirt", color: "Sky Blue" },
  { key: "m-bottom", type: "men", name: "Bottomwear", shape: "jeans", color: "Blue" },
  { key: "m-foot", type: "men", name: "Footwear", shape: "shoe", color: "Brown" },
  { key: "m-acc", type: "men", name: "Accessories", shape: "wallet", color: "Black" },
  { key: "w-ethnic", type: "women", name: "Ethnic Wear", shape: "saree", color: "Red" },
  { key: "w-modest", type: "women", name: "Modest Wear", shape: "hijab", color: "Purple" },
  { key: "w-foot", type: "women", name: "Footwear", shape: "heel", color: "Beige" },
  { key: "w-acc", type: "women", name: "Bags & Jewellery", shape: "bag", color: "Maroon" },
  { key: "k-girls", type: "kids", name: "Girls' Wear", shape: "frock", color: "Pink" },
  { key: "k-boys", type: "kids", name: "Boys' Wear", shape: "tshirt", color: "Blue" },
  { key: "k-foot", type: "kids", name: "Kids Footwear", shape: "shoe", color: "Orange" },
];

export const fashionCategories = CATEGORY_DEFS.map((c, i) => {
  const file = img(`cat-${c.key}`);
  addImage({ file, shape: c.shape, color: c.color, label: c.name });
  return {
    _id: makeId("ca7e0", i + 1),
    category_name: c.name,
    type_info: typeByKey[c.type]._id,
    banner: file,
    serial_no: i + 1,
    status: true,
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
  };
});

const categoryByKey = Object.fromEntries(
  CATEGORY_DEFS.map((c, i) => [c.key, fashionCategories[i]]),
);

// -------------------------------------------------------- subcategories --

const SUBCATEGORY_DEFS = [
  { key: "panjabi", cat: "m-ethnic", name: "Panjabi", shape: "panjabi", color: "White" },
  { key: "koti", cat: "m-ethnic", name: "Koti & Waistcoat", shape: "koti", color: "Mustard" },
  { key: "casual-shirt", cat: "m-top", name: "Casual Shirts", shape: "shirt", color: "Sky Blue" },
  { key: "formal-shirt", cat: "m-top", name: "Formal Shirts", shape: "shirt", color: "White" },
  { key: "tshirt", cat: "m-top", name: "T-Shirts", shape: "tshirt", color: "Black" },
  { key: "polo", cat: "m-top", name: "Polo Shirts", shape: "polo", color: "Green" },
  { key: "jeans", cat: "m-bottom", name: "Jeans", shape: "jeans", color: "Blue" },
  { key: "chinos", cat: "m-bottom", name: "Chinos & Trousers", shape: "jeans", color: "Beige" },
  { key: "m-sandal", cat: "m-foot", name: "Sandals", shape: "sandal", color: "Brown" },
  { key: "sneakers", cat: "m-foot", name: "Sneakers & Loafers", shape: "shoe", color: "White" },
  { key: "wallet", cat: "m-acc", name: "Wallets", shape: "wallet", color: "Brown" },
  { key: "belt", cat: "m-acc", name: "Belts", shape: "belt", color: "Black" },
  { key: "saree", cat: "w-ethnic", name: "Sarees", shape: "saree", color: "Red" },
  { key: "salwar", cat: "w-ethnic", name: "Salwar Kameez", shape: "salwar", color: "Teal" },
  { key: "kurti", cat: "w-ethnic", name: "Kurtis", shape: "kurti", color: "Mustard" },
  { key: "hijab", cat: "w-modest", name: "Hijabs", shape: "hijab", color: "Purple" },
  { key: "abaya", cat: "w-modest", name: "Abayas", shape: "abaya", color: "Black" },
  { key: "heels", cat: "w-foot", name: "Heels & Sandals", shape: "heel", color: "Beige" },
  { key: "handbag", cat: "w-acc", name: "Handbags", shape: "bag", color: "Brown" },
  { key: "jewellery", cat: "w-acc", name: "Jewellery", shape: "jewel", color: "Grey" },
  { key: "frock", cat: "k-girls", name: "Frocks", shape: "frock", color: "Pink" },
  { key: "girls-salwar", cat: "k-girls", name: "Girls' Salwar Sets", shape: "salwar", color: "Peach" },
  { key: "kids-tshirt", cat: "k-boys", name: "Kids T-Shirts", shape: "tshirt", color: "Red" },
  { key: "kids-panjabi", cat: "k-boys", name: "Kids Panjabi", shape: "panjabi", color: "Sky Blue" },
  { key: "kids-pants", cat: "k-boys", name: "Shorts & Pants", shape: "shorts", color: "Navy" },
  { key: "kids-shoes", cat: "k-foot", name: "Kids Shoes", shape: "shoe", color: "Blue" },
];

const SHAPE_BY_SUBCATEGORY = Object.fromEntries(
  SUBCATEGORY_DEFS.map((s) => [s.key, s.shape]),
);

const populatedCategory = (cat) => ({
  _id: cat._id,
  category_name: cat.category_name,
  type_info: cat.type_info,
  banner: cat.banner,
});

export const fashionSubCategories = SUBCATEGORY_DEFS.map((s, i) => {
  const cat = categoryByKey[s.cat];
  const banner1 = img(`sub-${s.key}`);
  addImage({ file: banner1, shape: s.shape, color: s.color, label: s.name });
  return {
    _id: makeId("5ab00", i + 1),
    sub_category_name: s.name,
    type_info: cat.type_info,
    category_info: populatedCategory(cat),
    banner_type_1: banner1,
    banner_type_2: banner1,
    serial_no: i + 1,
    status: true,
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
  };
});

const subCategoryByKey = Object.fromEntries(
  SUBCATEGORY_DEFS.map((s, i) => [s.key, fashionSubCategories[i]]),
);

// --------------------------------------------------------------- brands --

const BRAND_DEFS = [
  { key: "deshi", name: "Deshi Weave" },
  { key: "jamdani", name: "Jamdani House" },
  { key: "urban", name: "Urban Bengal" },
  { key: "nakshi", name: "Nakshi Threads" },
  { key: "padma", name: "Padma Steps" },
  { key: "lotus", name: "Little Lotus" },
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
    key: "dhaka-fashion-house",
    name: "Dhaka Fashion House",
    address: "House 12, Road 11, Gulshan 1, Dhaka 1212",
    contact: "01711-245680",
    alt: "01911-245680",
    color: "Navy",
    shape: "shirt",
    tagline: "Everyday menswear & womenswear",
    popup: null,
  },
  {
    key: "nakshi-boutique",
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
    key: "little-stars-kids",
    name: "Little Stars Kids",
    address: "Agrabad Commercial Area, Chittagong 4100",
    contact: "01612-778899",
    alt: "01712-778899",
    color: "Orange",
    shape: "frock",
    tagline: "Comfortable clothes & shoes for kids",
    popup: null,
  },
];

export const fashionStores = STORE_DEFS.map((s, i) => {
  const web = img(`shop-${s.key}-web`);
  const app = img(`shop-${s.key}-app`);
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
    shop_logo: app,
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

// ------------------------------------------------------------- products --

const DETAIL_IMAGES = [img("detail-fabric"), img("detail-stitching")];
addImage({ file: DETAIL_IMAGES[0], shape: "fabric", color: "Beige", label: "Fabric close-up" });
addImage({ file: DETAIL_IMAGES[1], shape: "stitch", color: "Grey", label: "Fine stitching" });

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
  none: "",
};

const sizeChart = (sizes) => {
  if (!sizes) return "null";
  const rows = sizes
    .split(",")
    .map((s) => `<tr><td>${s}</td><td>Available</td></tr>`)
    .join("");
  return `<table><thead><tr><th>Size</th><th>Stock</th></tr></thead><tbody>${rows}</tbody></table><p>Measurements may vary by 1 to 2 cm.</p>`;
};

// [title, subcategory, brand, store, mrp, sale, sizes, colors, fabric, fit,
//  description, flags]
// flags: p = popular, n = new, b = bestseller, f = featured
const PRODUCT_DEFS = [
  // Men
  ["Embroidered Cotton Panjabi", "panjabi", "deshi", "dhaka-fashion-house", 2450, 1950, "panjabi", ["White", "Navy", "Maroon"], "100% cotton", "Regular", "Soft cotton panjabi with tone-on-tone neck embroidery, ideal for Jummah and family gatherings.", "pb"],
  ["Silk Blend Eid Panjabi", "panjabi", "jamdani", "nakshi-boutique", 4500, 3990, "panjabi", ["Cream", "Maroon"], "Silk blend", "Regular", "Festive silk-blend panjabi with a subtle sheen and hand-finished placket.", "pnf"],
  ["Linen Short Panjabi", "panjabi", "urban", "dhaka-fashion-house", 1850, 1850, "panjabi", ["Olive", "Sky Blue"], "Linen cotton", "Relaxed", "Breathable short-length panjabi that pairs well with jeans or chinos.", ""],
  ["Printed Cotton Koti", "koti", "deshi", "nakshi-boutique", 1650, 1390, "apparel", ["Black", "Mustard"], "Cotton", "Regular", "Block-printed koti to layer over a plain panjabi.", "p"],
  ["Oxford Casual Shirt", "casual-shirt", "urban", "dhaka-fashion-house", 1690, 1490, "apparel", ["Sky Blue", "White"], "Oxford cotton", "Regular", "Button-down Oxford shirt for work days and weekends.", "p"],
  ["Checked Flannel Shirt", "casual-shirt", "urban", "dhaka-fashion-house", 1590, 1590, "apparel", ["Red", "Navy"], "Cotton flannel", "Regular", "Warm brushed-cotton checked shirt for winter evenings.", ""],
  ["Slim Fit Formal Shirt", "formal-shirt", "urban", "dhaka-fashion-house", 1990, 1690, "apparel", ["White", "Sky Blue", "Pink"], "Cotton poplin", "Slim", "Crisp poplin formal shirt with a cutaway collar.", "pb"],
  ["Premium Cotton Crew T-Shirt", "tshirt", "urban", "dhaka-fashion-house", 690, 550, "apparel", ["Black", "White", "Grey"], "Combed cotton", "Regular", "Everyday crew-neck tee in 180 GSM combed cotton.", "pb"],
  ["Dhaka City Graphic T-Shirt", "tshirt", "deshi", "nakshi-boutique", 790, 690, "apparel", ["Navy", "Mustard"], "Cotton", "Regular", "Graphic tee printed with a rickshaw-art Dhaka skyline.", "n"],
  ["Pique Polo Shirt", "polo", "urban", "dhaka-fashion-house", 1190, 990, "apparel", ["Green", "Navy"], "Cotton pique", "Regular", "Classic polo with a ribbed collar and two-button placket.", "p"],
  ["Slim Fit Stretch Jeans", "jeans", "urban", "dhaka-fashion-house", 2490, 2190, "jeans", ["Blue", "Black"], "Stretch denim", "Slim", "Mid-rise stretch jeans that keep their shape all day.", "pb"],
  ["Regular Fit Denim Jeans", "jeans", "deshi", "nakshi-boutique", 2290, 2290, "jeans", ["Indigo"], "Denim", "Regular", "Straight-leg rigid denim with a comfortable regular fit.", ""],
  ["Cotton Chino Trousers", "chinos", "urban", "dhaka-fashion-house", 1890, 1650, "jeans", ["Beige", "Olive"], "Cotton twill", "Slim", "Smart chinos that work for the office and evenings out.", "n"],
  ["Leather Kolhapuri Sandals", "m-sandal", "padma", "nakshi-boutique", 1490, 1290, "menShoes", ["Brown"], "Genuine leather", "Regular", "Handcrafted leather sandals, a natural pick with panjabi.", "p"],
  ["Canvas Casual Sneakers", "sneakers", "padma", "dhaka-fashion-house", 2990, 2490, "menShoes", ["White", "Black"], "Canvas, rubber sole", "Regular", "Lightweight lace-up canvas sneakers with a cushioned insole.", "n"],
  ["Genuine Leather Wallet", "wallet", "deshi", "nakshi-boutique", 990, 890, "none", ["Brown", "Black"], "Genuine leather", "", "Bi-fold wallet with six card slots and a coin pocket.", ""],
  ["Reversible Leather Belt", "belt", "urban", "dhaka-fashion-house", 850, 750, "none", ["Black", "Brown"], "Leather", "", "Two belts in one: black on one side, brown on the other.", ""],

  // Women
  ["Dhakai Jamdani Saree", "saree", "jamdani", "nakshi-boutique", 14500, 12500, "none", ["Red", "Cream"], "Handloom cotton jamdani", "", "Handwoven Dhakai jamdani with a traditional motif border. Comes with blouse piece.", "pf"],
  ["Tangail Cotton Saree", "saree", "jamdani", "nakshi-boutique", 3200, 2800, "none", ["Green", "Mustard"], "Tangail cotton", "", "Light Tangail cotton saree for everyday wear in the heat.", "p"],
  ["Printed Georgette Saree", "saree", "nakshi", "dhaka-fashion-house", 3800, 3290, "none", ["Pink", "Purple"], "Georgette", "", "Flowing floral-print georgette saree for parties and dawats.", "n"],
  ["Embroidered Lawn Three-Piece", "salwar", "nakshi", "nakshi-boutique", 4800, 4200, "women", ["Teal", "Peach"], "Lawn cotton", "Regular", "Stitched salwar kameez with embroidered yoke and a chiffon dupatta.", "pb"],
  ["Unstitched Cotton Three-Piece", "salwar", "deshi", "dhaka-fashion-house", 2450, 2450, "none", ["Maroon", "Beige"], "Cotton", "", "Unstitched kameez, salwar and dupatta fabric set (2.5 + 2.5 + 2.5 yards).", ""],
  ["Block Print Kurti", "kurti", "nakshi", "nakshi-boutique", 1450, 1150, "women", ["Mustard", "Indigo"], "Cotton", "Regular", "Hand block-printed straight kurti with three-quarter sleeves.", "p"],
  ["Rayon A-Line Kurti", "kurti", "nakshi", "dhaka-fashion-house", 1850, 1650, "women", ["Pink", "Sky Blue"], "Rayon", "A-line", "Soft rayon A-line kurti that drapes well with palazzos.", "n"],
  ["Jersey Hijab", "hijab", "nakshi", "dhaka-fashion-house", 450, 390, "none", ["Black", "Beige", "Pink"], "Cotton jersey", "", "Stretchy, breathable jersey hijab that stays in place.", "pb"],
  ["Chiffon Printed Hijab", "hijab", "nakshi", "nakshi-boutique", 650, 550, "none", ["Purple", "Peach"], "Chiffon", "", "Lightweight printed chiffon hijab for special occasions.", ""],
  ["Classic Nida Abaya", "abaya", "nakshi", "nakshi-boutique", 3200, 2800, "abaya", ["Black", "Navy"], "Nida", "Regular", "Flowy nida abaya with lace-trimmed sleeves.", "p"],
  ["Block Heel Sandals", "heels", "padma", "dhaka-fashion-house", 1990, 1690, "womenShoes", ["Beige", "Black"], "Synthetic leather", "Regular", "Comfortable 2-inch block heels with an ankle strap.", ""],
  ["Leather Tote Bag", "handbag", "deshi", "dhaka-fashion-house", 2450, 1990, "none", ["Brown", "Maroon"], "Genuine leather", "", "Roomy tote with a zip pocket, fits a laptop up to 14 inches.", "p"],
  ["Oxidised Jhumka & Necklace Set", "jewellery", "nakshi", "nakshi-boutique", 850, 690, "none", ["Grey"], "Oxidised alloy", "", "Traditional oxidised necklace with matching jhumka earrings.", "n"],

  // Kids
  ["Cotton Party Frock", "frock", "lotus", "little-stars-kids", 1650, 1390, "kids", ["Pink", "Purple"], "Cotton with net layer", "Regular", "Twirl-ready party frock with a soft cotton lining.", "pf"],
  ["Floral Summer Frock", "frock", "lotus", "little-stars-kids", 1150, 950, "kids", ["Yellow", "Sky Blue"], "Cotton", "Regular", "Sleeveless floral frock for hot summer days.", "p"],
  ["Girls' Embroidered Salwar Set", "girls-salwar", "lotus", "little-stars-kids", 1890, 1690, "kids", ["Peach", "Teal"], "Cotton", "Regular", "Three-piece salwar set with light embroidery, perfect for Eid.", "n"],
  ["Kids Cartoon Print T-Shirt", "kids-tshirt", "lotus", "little-stars-kids", 450, 390, "kids", ["Red", "Blue", "Yellow"], "Cotton", "Regular", "Fun cartoon-print tee in soft, skin-friendly cotton.", "pb"],
  ["Kids Striped T-Shirt", "kids-tshirt", "urban", "dhaka-fashion-house", 490, 490, "kids", ["Navy", "Green"], "Cotton", "Regular", "Classic striped tee for school and play.", ""],
  ["Kids Cotton Panjabi", "kids-panjabi", "deshi", "little-stars-kids", 1250, 950, "kids", ["White", "Sky Blue"], "Cotton", "Regular", "Comfortable cotton panjabi for little ones.", "p"],
  ["Kids Eid Panjabi Set", "kids-panjabi", "jamdani", "nakshi-boutique", 1650, 1450, "kids", ["Maroon", "Cream"], "Cotton silk", "Regular", "Panjabi and pajama set with festive embroidery.", "f"],
  ["Kids Denim Shorts", "kids-pants", "lotus", "little-stars-kids", 690, 590, "kids", ["Blue"], "Denim", "Regular", "Soft denim shorts with an elastic waist.", ""],
  ["Kids Jogger Pants", "kids-pants", "lotus", "little-stars-kids", 790, 690, "kids", ["Grey", "Navy"], "Cotton fleece", "Relaxed", "Cosy joggers with ribbed cuffs.", ""],
  ["Kids Velcro Sneakers", "kids-shoes", "padma", "little-stars-kids", 1290, 1090, "kidsShoes", ["Blue", "Pink"], "Mesh, rubber sole", "Regular", "Easy on, easy off sneakers with a non-slip sole.", "p"],
  ["Kids School Shoes", "kids-shoes", "padma", "little-stars-kids", 1490, 1490, "kidsShoes", ["Black"], "Synthetic leather", "Regular", "Durable black school shoes with a padded collar.", ""],
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

export const fashionProducts = PRODUCT_DEFS.map((def, i) => {
  const [
    title,
    subKey,
    brandKey,
    storeKey,
    mrp,
    sale,
    sizeKey,
    colors,
    fabric,
    fit,
    description,
    flags,
  ] = def;

  const sub = subCategoryByKey[subKey];
  const cat = fashionCategories.find((c) => c._id === sub.category_info._id);
  const type = fashionTypes.find((t) => t._id === cat.type_info);
  const shape = SHAPE_BY_SUBCATEGORY[subKey];
  const base = slug(title);

  const webImage = img(base);
  addImage({ file: webImage, shape, color: colors[0], label: title });

  const imagesByColor =
    colors.length > 1
      ? colors.map((color) => {
          const file = img(`${base}-${slug(color)}`);
          addImage({ file, shape, color, label: `${title} - ${color}` });
          return file;
        })
      : [];

  const sizes = SIZES[sizeKey];
  const specRows = [
    ["Fabric", fabric],
    fit ? ["Fit", fit] : null,
    ["Colours", colors.join(", ")],
    ["Care", "Gentle hand wash or dry clean"],
    ["Origin", "Made in Bangladesh"],
  ]
    .filter(Boolean)
    .map(([k, v]) => `<li><strong>${k}:</strong> ${v}</li>`)
    .join("");

  return {
    _id: makeId("9d0c7", i + 1),
    product_code: `FL-${String(1001 + i)}`,
    product_title_eng: title,
    product_title_beng: title,
    type_info: { _id: type._id, type_name: type.type_name },
    category_info: { _id: cat._id, category_name: cat.category_name },
    sub_category_info: { _id: sub._id, sub_category_name: sub.sub_category_name },
    brand_info: { ...brandByKey[brandKey] },
    store_info: populatedStore(storeByKey[storeKey]),
    web_image: webImage,
    app_image: webImage,
    images_by_color: imagesByColor,
    detail_product_image: DETAIL_IMAGES,
    sizes,
    colors: colors.join(","),
    max_retail_price: mrp,
    sale_price: sale,
    purchase_price: Math.round(sale * 0.7),
    unit_symbol: "pcs",
    max_allowed: 5,
    stock_qty: 20 + ((i * 7) % 30),
    is_popular: flags.includes("p"),
    new: flags.includes("n"),
    bestseller: flags.includes("b"),
    featured: flags.includes("f"),
    rating: [4.5, 4.2, 4.8, 4, 4.6, 4.3, 4.7][i % 7],
    reviews: 12 + ((i * 13) % 140),
    description: `<p>${description}</p>`,
    specification: `<ul>${specRows}</ul>`,
    size_chart: sizeChart(sizes),
    status: true,
    createdAt: CREATED_AT,
    updatedAt: CREATED_AT,
  };
});

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
    "dhaka-fashion-house",
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
    "nakshi-boutique",
    [orderItem(productByTitle("Tangail Cotton Saree"), 1, null)],
    "Delivered",
    "2026-10-28T12:15:00.000Z",
    "bKash",
  ),
];
