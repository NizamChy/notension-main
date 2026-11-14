// Demo fixtures for the MEDICINE backend. Pure data (no imports) so the
// image generator can read it too. Image fields hold paths under
// public/demo/ (the /demo-images rewrite drops the first segment).

const oid = (tag, n) => `${tag}${n.toString(16).padStart(24 - tag.length, "0")}`;

// Custom type IDs the UI matches against (src/components/StoreModule/storeModules.js).
export const MEDICINE_CUSTOM_TYPES = {
  specialOffer: "65128cbd20db0921f13b40b3",
  dealOfTheDay: "64ec724d538280d7999a2d39",
  popularItem: "651284f9330595b483e38d73",
};

const DHAKA = "64f032f6c6635d0242c01e03";
const CHITTAGONG = "64f03388fdd8ffc6aa95bdb9";

// ---------------------------------------------------------------- stores

const store = (n, fields) => ({
  _id: oid("66a1", n),
  is_active: true,
  is_banned: false,
  is_closed: false,
  show_product_price: true,
  less: 0,
  maximum_less: 0,
  less_type: "Percent",
  minimum_order_for_less: 0,
  min_purchage_amount: 500,
  min_delivery_charge: 0,
  max_delivery_charge: 40,
  delivery_notice: "",
  opening_time: "08:00 AM",
  closing_time: "11:00 PM",
  merchant_type: 1,
  ...fields,
  location: { type: "Point", coordinates: [fields.longitude, fields.latitude] },
});

export const DEMO_MEDICINE_STORES = [
  store(1, {
    custom_store_id: "MS100101",
    shop_name: "Gulshan Care Pharmacy",
    shop_address: "House 12, Gulshan Avenue, Gulshan-1, Dhaka 1212",
    contact_no: "01711-204501",
    alternative_contact_no: "01911-204502",
    district_id: DHAKA,
    district_name: "Dhaka",
    district_area_name: "Gulshan",
    latitude: 23.7937,
    longitude: 90.4142,
    shop_banner_app: "medicine/store-gulshan-care.webp",
    shop_banner_web: "medicine/store-gulshan-care.webp",
    delivery_notice: "Free delivery over ৳500",
    less: 5,
    maximum_less: 100,
    minimum_order_for_less: 1000,
  }),
  store(2, {
    custom_store_id: "MS100102",
    shop_name: "Banani Medicine Corner",
    shop_address: "Road 11, Block E, Banani, Dhaka 1213",
    contact_no: "01819-330211",
    alternative_contact_no: "01552-330212",
    district_id: DHAKA,
    district_name: "Dhaka",
    district_area_name: "Banani",
    latitude: 23.794,
    longitude: 90.4043,
    shop_banner_app: "medicine/store-banani-corner.webp",
    shop_banner_web: "medicine/store-banani-corner.webp",
    min_purchage_amount: 800,
    max_delivery_charge: 50,
    min_delivery_charge: 20,
  }),
  store(3, {
    custom_store_id: "MS100103",
    shop_name: "Mohakhali Family Pharma",
    shop_address: "32 Mohakhali C/A, near Amtoli, Dhaka 1212",
    contact_no: "01670-418820",
    alternative_contact_no: "01715-418821",
    district_id: DHAKA,
    district_name: "Dhaka",
    district_area_name: "Mohakhali",
    latitude: 23.7781,
    longitude: 90.4005,
    shop_banner_app: "medicine/store-mohakhali-family.webp",
    shop_banner_web: "medicine/store-mohakhali-family.webp",
    delivery_notice: "24/7 open",
    opening_time: "12:00 AM",
    closing_time: "11:59 PM",
  }),
  store(4, {
    custom_store_id: "MS200101",
    shop_name: "Agrabad Medical Store",
    shop_address: "Sheikh Mujib Road, Agrabad C/A, Chattogram 4100",
    contact_no: "01811-552301",
    alternative_contact_no: "01730-552302",
    district_id: CHITTAGONG,
    district_name: "Chittagong",
    district_area_name: "Agrabad",
    latitude: 22.326,
    longitude: 91.811,
    shop_banner_app: "medicine/store-agrabad-medical.webp",
    shop_banner_web: "medicine/store-agrabad-medical.webp",
    max_delivery_charge: 50,
  }),
  store(5, {
    custom_store_id: "MS200102",
    shop_name: "GEC Lifecare Pharmacy",
    shop_address: "CDA Avenue, GEC Circle, Chattogram 4000",
    contact_no: "01912-660410",
    alternative_contact_no: "01821-660411",
    district_id: CHITTAGONG,
    district_name: "Chittagong",
    district_area_name: "GEC Circle",
    latitude: 22.359,
    longitude: 91.8215,
    shop_banner_app: "medicine/store-gec-lifecare.webp",
    shop_banner_web: "medicine/store-gec-lifecare.webp",
    is_closed: true,
    delivery_notice: "Closed for renovation",
  }),
];

// ------------------------------------------------------- types/subtypes

// Order matters: CategorySidebar shows /images/medicine/type/type{index+1}.webp
// for each type, so the list lines up with those 10 pictures.
export const DEMO_MEDICINE_TYPES = [
  { n: 1, name: "Medicines", statusType: "General" },
  {
    n: 2,
    name: "Special Offer",
    statusType: "Custom",
    id: MEDICINE_CUSTOM_TYPES.specialOffer,
  },
  { n: 3, name: "Chronic Care", statusType: "General" },
  { n: 4, name: "Children's Medicine", statusType: "General" },
  { n: 5, name: "Vitamins & Supplements", statusType: "General" },
  { n: 6, name: "Eye, Ear & First Aid", statusType: "General" },
  { n: 7, name: "Medical Devices", statusType: "General" },
  { n: 8, name: "Women's Health", statusType: "General" },
  { n: 9, name: "Baby Care", statusType: "General" },
  { n: 10, name: "Personal Care", statusType: "General" },
].map((t) => ({
  _id: t.id || oid("66a2", t.n),
  type_name: t.name,
  custom_type_id: `MT${String(t.n).padStart(4, "0")}`,
  statusType: t.statusType,
}));

const typeId = (n) => DEMO_MEDICINE_TYPES[n - 1]._id;

// [n, type n, name, colour]
const SUBTYPE_ROWS = [
  [1, 1, "Pain Relief", "#e0f2fe"],
  [2, 1, "Fever & Cold", "#fee2e2"],
  [3, 1, "Gastric & Acidity", "#fef3c7"],
  [4, 1, "Allergy", "#ede9fe"],
  [5, 3, "Diabetes Care", "#dcfce7"],
  [6, 3, "Heart & Blood Pressure", "#ffe4e6"],
  [7, 4, "Syrups & Suspensions", "#ffedd5"],
  [8, 4, "ORS & Hydration", "#cffafe"],
  [9, 5, "Multivitamins", "#fef9c3"],
  [10, 5, "Calcium & Vitamin D", "#f1f5f9"],
  [11, 6, "Eye & Ear Drops", "#e0e7ff"],
  [12, 6, "Antiseptics", "#d1fae5"],
  [13, 6, "Bandages & Dressings", "#fae8ff"],
  [14, 7, "Glucometers & Strips", "#e0f2fe"],
  [15, 7, "BP Monitors & Thermometers", "#f3f4f6"],
  [16, 8, "Sanitary Care", "#fce7f3"],
  [17, 9, "Diapers & Wipes", "#ecfeff"],
  [18, 9, "Baby Toiletries", "#fef3c7"],
  [19, 10, "Oral Care", "#dbeafe"],
  [20, 10, "Skin Care", "#fff7ed"],
  [21, 10, "Hand Hygiene", "#dcfce7"],
];

export const DEMO_MEDICINE_SUBTYPES = SUBTYPE_ROWS.map(
  ([n, typeN, name, color]) => ({
    _id: oid("66a3", n),
    typeInfo: typeId(typeN),
    sub_type_name: name,
    banner_type_1: `medicine/subtype-${n}.webp`,
    color,
  }),
);

const subtypeId = (n) => DEMO_MEDICINE_SUBTYPES[n - 1]._id;

// ------------------------------------------------------------- products

const { specialOffer: SO, dealOfTheDay: DD, popularItem: PI } =
  MEDICINE_CUSTOM_TYPES;

// [n, subtype n, title, bengali title, generic, company, strength, pack size,
//  unit, MRP, discount %, prescription?, custom types, shape]
const PRODUCT_ROWS = [
  [1, 1, "Napa 500mg", "নাপা ৫০০ মি.গ্রা.", "Paracetamol", "Beximco Pharmaceuticals", "500mg", "10 tablets (1 strip)", "strip", 12, 0, false, [PI], "pill"],
  [2, 1, "Napa Extra", "নাপা এক্সট্রা", "Paracetamol + Caffeine", "Beximco Pharmaceuticals", "500mg+65mg", "10 tablets (1 strip)", "strip", 25, 8, false, [SO], "pill"],
  [3, 1, "Ace Plus", "এইস প্লাস", "Paracetamol + Caffeine", "Square Pharmaceuticals", "500mg+65mg", "10 tablets (1 strip)", "strip", 25, 0, false, [PI], "pill"],
  [4, 1, "Tufnil 200mg", "টাফনিল ২০০", "Tolfenamic Acid", "Eskayef Pharmaceuticals", "200mg", "10 tablets (1 strip)", "strip", 100, 0, true, [], "pill"],
  [5, 2, "Napa Extend 665mg", "নাপা এক্সটেন্ড", "Paracetamol (Extended Release)", "Beximco Pharmaceuticals", "665mg", "10 tablets (1 strip)", "strip", 20, 0, false, [], "pill"],
  [6, 2, "Tusca Plus Syrup", "টুসকা প্লাস সিরাপ", "Herbal Cough Syrup", "Square Pharmaceuticals", "100ml", "100ml bottle", "bottle", 90, 0, false, [PI], "bottle"],
  [7, 2, "Adovas Syrup", "এডোভাস সিরাপ", "Adhatoda vasica (Herbal)", "Square Pharmaceuticals", "100ml", "100ml bottle", "bottle", 85, 0, false, [], "bottle"],
  [8, 2, "Vicks VapoRub", "ভিক্স ভেপোরাব", "Menthol + Camphor + Eucalyptus", "Procter & Gamble", "25ml", "25ml jar", "jar", 160, 0, false, [], "jar"],
  [9, 3, "Seclo 20", "সেক্লো ২০", "Omeprazole", "Square Pharmaceuticals", "20mg", "10 capsules (1 strip)", "strip", 60, 10, false, [SO], "capsule"],
  [10, 3, "Sergel 20", "সারজেল ২০", "Esomeprazole", "Healthcare Pharmaceuticals", "20mg", "10 capsules (1 strip)", "strip", 70, 0, false, [PI], "capsule"],
  [11, 3, "Pantonix 20", "প্যান্টোনিক্স ২০", "Pantoprazole", "Incepta Pharmaceuticals", "20mg", "10 tablets (1 strip)", "strip", 60, 0, false, [], "pill"],
  [12, 3, "Entacyd Plus Suspension", "এন্টাসিড প্লাস", "Aluminium + Magnesium Hydroxide + Simethicone", "Square Pharmaceuticals", "200ml", "200ml bottle", "bottle", 95, 0, false, [], "bottle"],
  [13, 4, "Fexo 120", "ফেক্সো ১২০", "Fexofenadine", "Square Pharmaceuticals", "120mg", "10 tablets (1 strip)", "strip", 90, 10, false, [SO], "pill"],
  [14, 4, "Alatrol 10mg", "এলাট্রল ১০", "Cetirizine", "Square Pharmaceuticals", "10mg", "10 tablets (1 strip)", "strip", 35, 0, false, [PI], "pill"],
  [15, 4, "Monas 10", "মোনাস ১০", "Montelukast", "ACME Laboratories", "10mg", "10 tablets (1 strip)", "strip", 175, 0, true, [], "pill"],
  [16, 4, "Histacin 4mg", "হিস্টাসিন", "Chlorpheniramine Maleate", "Jayson Pharmaceuticals", "4mg", "10 tablets (1 strip)", "strip", 8, 0, false, [], "pill"],
  [17, 5, "Comet 500", "কমেট ৫০০", "Metformin Hydrochloride", "Square Pharmaceuticals", "500mg", "10 tablets (1 strip)", "strip", 50, 0, true, [], "pill"],
  [18, 5, "Secrin 2mg", "সেক্রিন ২", "Glimepiride", "Square Pharmaceuticals", "2mg", "10 tablets (1 strip)", "strip", 120, 0, true, [], "pill"],
  [19, 6, "Osartil 50", "ওসারটিল ৫০", "Losartan Potassium", "Incepta Pharmaceuticals", "50mg", "10 tablets (1 strip)", "strip", 100, 0, true, [], "pill"],
  [20, 6, "Ecosprin 75", "ইকোস্প্রিন ৭৫", "Aspirin (Low Dose)", "ACI Limited", "75mg", "28 tablets (1 strip)", "strip", 22, 0, false, [], "pill"],
  [21, 7, "Napa Syrup", "নাপা সিরাপ", "Paracetamol", "Beximco Pharmaceuticals", "120mg/5ml", "60ml bottle", "bottle", 35, 0, false, [PI], "bottle"],
  [22, 7, "Ace Syrup", "এইস সিরাপ", "Paracetamol", "Square Pharmaceuticals", "120mg/5ml", "100ml bottle", "bottle", 45, 0, false, [], "bottle"],
  [23, 8, "Orsaline-N", "ওরস্যালাইন-এন", "Oral Rehydration Salts", "SMC Enterprise", "10.25g", "20 sachets (1 box)", "box", 120, 0, false, [PI], "box"],
  [24, 8, "Baby Zinc Syrup", "বেবি জিংক সিরাপ", "Zinc Sulphate", "Square Pharmaceuticals", "10mg/5ml", "100ml bottle", "bottle", 50, 0, false, [], "bottle"],
  [25, 9, "Filwel Gold", "ফিলওয়েল গোল্ড", "Multivitamin & Multimineral", "Square Pharmaceuticals", "A-Z", "30 tablets (1 bottle)", "bottle", 330, 12, false, [DD], "jar"],
  [26, 9, "Ceevit 250mg", "সিভিট ২৫০", "Vitamin C (Chewable)", "Square Pharmaceuticals", "250mg", "10 tablets (1 strip)", "strip", 30, 10, false, [DD], "pill"],
  [27, 10, "Ostocal D", "অসটোক্যাল ডি", "Calcium Carbonate + Vitamin D3", "Radiant Pharmaceuticals", "500mg+200IU", "15 tablets (1 strip)", "strip", 150, 8, false, [SO], "pill"],
  [28, 10, "Calbo-D", "ক্যালবো-ডি", "Calcium Carbonate + Vitamin D3", "Square Pharmaceuticals", "500mg+200IU", "30 tablets (1 bottle)", "bottle", 300, 0, false, [], "jar"],
  [29, 11, "Lubricant Eye Drops", "লুব্রিকেন্ট আই ড্রপ", "Carboxymethylcellulose 0.5%", "Aristopharma", "0.5%", "10ml dropper", "pcs", 140, 0, false, [], "dropper"],
  [30, 11, "Wax Clear Ear Drops", "ওয়াক্স ক্লিয়ার ইয়ার ড্রপ", "Docusate Sodium", "Opsonin Pharma", "0.5%", "10ml dropper", "pcs", 110, 0, false, [], "dropper"],
  [31, 12, "Savlon Antiseptic Liquid", "স্যাভলন অ্যান্টিসেপটিক", "Chlorhexidine + Cetrimide", "ACI Limited", "112ml", "112ml bottle", "bottle", 75, 7, false, [SO], "bottle"],
  [32, 12, "Dettol Antiseptic Liquid", "ডেটল অ্যান্টিসেপটিক", "Chloroxylenol", "Reckitt Benckiser", "100ml", "100ml bottle", "bottle", 110, 0, false, [], "bottle"],
  [33, 12, "Povisep 5% Solution", "পোভিসেপ ৫%", "Povidone-Iodine", "Jayson Pharmaceuticals", "5%", "100ml bottle", "bottle", 90, 0, false, [], "bottle"],
  [34, 13, "Hansaplast Strips", "হ্যান্সাপ্লাস্ট", "Adhesive Bandage", "Beiersdorf", "Regular", "10 strips (1 pack)", "pack", 40, 0, false, [PI], "plaster"],
  [35, 13, "Absorbent Cotton Wool", "তুলা", "Absorbent Cotton", "Jayson Pharmaceuticals", "50g", "50g roll", "pcs", 45, 0, false, [], "box"],
  [36, 13, "Crepe Bandage 4 inch", "ক্রেপ ব্যান্ডেজ", "Elastic Crepe Bandage", "Medisure", "4 inch", "1 roll", "pcs", 95, 0, false, [], "plaster"],
  [37, 14, "Accu-Chek Instant Glucometer", "অ্যাকু-চেক ইনস্ট্যান্ট", "Blood Glucose Meter", "Roche Diabetes Care", "Kit", "Meter + 10 strips", "pcs", 2450, 0, false, [], "device"],
  [38, 14, "Accu-Chek Instant Test Strips", "অ্যাকু-চেক টেস্ট স্ট্রিপ", "Glucose Test Strips", "Roche Diabetes Care", "50 strips", "50 strips (1 box)", "box", 1650, 6, false, [SO], "box"],
  [39, 15, "Omron HEM-7120 BP Monitor", "ওমরন বিপি মেশিন", "Automatic Blood Pressure Monitor", "Omron Healthcare", "Upper arm", "1 device", "pcs", 4250, 10, false, [DD], "device"],
  [40, 15, "Digital Thermometer", "ডিজিটাল থার্মোমিটার", "Clinical Digital Thermometer", "Microlife", "Oral/Axillary", "1 piece", "pcs", 280, 15, false, [DD], "device"],
  [41, 16, "Senora Confidence Belt", "সেনোরা কনফিডেন্স", "Sanitary Napkin (Belt)", "Square Toiletries", "Regular", "15 pads (1 pack)", "pack", 140, 0, false, [], "box"],
  [42, 16, "Freedom Heavy Flow Wings", "ফ্রিডম হেভি ফ্লো", "Sanitary Napkin (Wings)", "ACI Limited", "Heavy flow", "16 pads (1 pack)", "pack", 160, 0, false, [], "box"],
  [43, 17, "Supermom Baby Diaper M", "সুপারমম ডায়াপার (M)", "Baby Diaper (Belt)", "Square Toiletries", "M (6-11kg)", "40 pieces (1 pack)", "pack", 1150, 8, false, [SO], "box"],
  [44, 17, "Supermom Baby Wipes", "সুপারমম বেবি ওয়াইপস", "Baby Wet Wipes", "Square Toiletries", "Fragrance free", "72 wipes (1 pack)", "pack", 220, 0, false, [], "box"],
  [45, 18, "Meril Baby Lotion", "মেরিল বেবি লোশন", "Baby Lotion", "Square Toiletries", "100ml", "100ml bottle", "bottle", 165, 10, false, [DD], "bottle"],
  [46, 18, "Meril Baby Soap", "মেরিল বেবি সোপ", "Baby Soap", "Square Toiletries", "75g", "75g bar", "pcs", 60, 0, false, [], "box"],
  [47, 18, "Meril Baby Powder", "মেরিল বেবি পাউডার", "Baby Talcum Powder", "Square Toiletries", "100g", "100g bottle", "bottle", 115, 0, false, [], "bottle"],
  [48, 19, "Sensodyne Fresh Mint", "সেনসোডাইন ফ্রেশ মিন্ট", "Potassium Nitrate Toothpaste", "Haleon", "70g", "70g tube", "tube", 260, 5, false, [SO], "tube"],
  [49, 19, "Mediplus DS Toothpaste", "মেডিপ্লাস ডিএস", "Fluoride Toothpaste", "Square Toiletries", "140g", "140g tube", "tube", 125, 0, false, [], "tube"],
  [50, 20, "Vaseline Intensive Care Lotion", "ভ্যাসলিন লোশন", "Body Lotion", "Unilever", "100ml", "100ml bottle", "bottle", 220, 0, false, [], "bottle"],
  [51, 21, "Hexisol Hand Rub", "হেক্সিসল হ্যান্ড রাব", "Chlorhexidine + Ethanol", "ACI Limited", "250ml", "250ml bottle", "bottle", 150, 10, false, [DD], "bottle"],
  [52, 21, "Dettol Hand Wash", "ডেটল হ্যান্ড ওয়াশ", "Antibacterial Hand Wash", "Reckitt Benckiser", "200ml", "200ml pump bottle", "bottle", 150, 0, false, [], "bottle"],
];

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const DEMO_MEDICINE_PRODUCTS = PRODUCT_ROWS.map(
  ([n, subN, title, titleBn, generic, company, strength, pack, unit, mrp, less, rx, customTypes, shape]) => {
    const sub = DEMO_MEDICINE_SUBTYPES[subN - 1];
    return {
      _id: oid("66a4", n),
      item_title_eng: title,
      item_title_beng: titleBn,
      product_title_beng: titleBn,
      generic_name: generic,
      company_name: company,
      strength,
      pack_size: pack,
      unit_symbol: unit,
      max_retail_price: mrp,
      less,
      less_type: "Percent",
      sale_price: less > 0 ? Math.round(mrp * (1 - less / 100)) : mrp,
      prescription_required: rx,
      productType: sub.typeInfo,
      productSubtype: subtypeId(subN),
      customType: customTypes,
      app_image: `medicine/${slugify(title)}.webp`,
      web_image: `medicine/${slugify(title)}.webp`,
      shape,
      color: sub.color,
    };
  },
);

// Products each store does NOT stock (by product number). Store 1 stocks all.
const NOT_STOCKED = {
  1: [],
  2: [4, 8, 18, 30, 36, 44, 50],
  3: [7, 11, 16, 20, 28, 33, 37, 42, 47, 49],
  4: [4, 7, 8, 11, 16, 18, 20, 24, 28, 30, 33, 36, 37, 42, 44, 47, 49, 50, 52],
  5: [2, 4, 6, 7, 8, 11, 12, 15, 16, 18, 20, 22, 24, 26, 28, 30, 32, 33, 36, 37, 39, 42, 44, 46, 47, 49, 50, 52],
};
// Products that are listed but currently out of stock.
const OUT_OF_STOCK = { 1: [44], 2: [19], 3: [38], 4: [40], 5: [] };

// One item per (store, product): the shape the item endpoints return.
export const DEMO_MEDICINE_ITEMS = DEMO_MEDICINE_STORES.flatMap((s, si) => {
  const storeNo = si + 1;
  return DEMO_MEDICINE_PRODUCTS.filter(
    (_, pi) => !NOT_STOCKED[storeNo].includes(pi + 1),
  ).map((p) => {
    const productNo = parseInt(p._id.slice(4), 16);
    const available = !OUT_OF_STOCK[storeNo].includes(productNo);
    const { _id, shape, color, ...rest } = p;
    return {
      ...rest,
      _id: oid(`66a5${storeNo.toString(16).padStart(2, "0")}`, productNo),
      medStoreProductInfo: p._id,
      merchantId: s._id,
      custom_store_id: s.custom_store_id,
      purchase_price: Math.round(p.sale_price * 0.85),
      max_allowed: p.max_retail_price > 1000 ? 3 : 10,
      stock_qty: available ? 25 + ((productNo * 7 + storeNo * 3) % 60) : 0,
      is_available: available,
      is_active: true,
    };
  });
});

// --------------------------------------------------------------- sliders

const slide = (n, file) => ({ _id: oid("66a6", n), file_name: `medicine/${file}` });

export const DEMO_MEDICINE_SLIDER = [
  {
    _id: oid("66a6", 100),
    first_slider: [
      slide(1, "banner-home-delivery.webp"),
      slide(2, "banner-flat-discount.webp"),
      slide(3, "banner-baby-care.webp"),
    ],
    second_slider: [slide(4, "banner-vitamins.webp"), slide(5, "banner-diabetes.webp")],
    third_slider: [slide(6, "banner-first-aid.webp"), slide(7, "banner-prescription.webp")],
    fourth_slider: [slide(8, "banner-special-offer.webp"), slide(9, "banner-deal-of-day.webp")],
  },
];
