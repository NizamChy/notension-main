// Demo routes for the ALL_CARE backend. See src/demo/README.md for the contract.
//
// UI notes that shape this data:
// - ServiceCard picks each service icon by list position from SERVICES in
//   src/utils/constant.js (services-1.png ... services-45.png), so ALL_SERVICES
//   is ordered to match those pictures and must never exceed 45 entries.
// - Banner and provider images are built as `${SERVICE_BANNER_IMAGES}/<file>`
//   and `${SERVICE_PROVIDER_IMAGES}/<file>`; the demo rewrite drops the
//   "service_banner" / "service_provider" segment, so file names here are
//   paths under public/demo/.
// - Provider distance is in metres (the card divides by 1000).

import {
  EXPLORE_ALL_CARE_SERVICE,
  EXPLORE_CARE_PROVIDER,
} from "@/api-endpoints/api-endpoint";
import { demoResponse } from "../demoAdapter";
import { DEMO_LOCATIONS } from "../demoLocations";

const [DHAKA, CHITTAGONG] = DEMO_LOCATIONS;

const BANNER = (name) => `all-care/banners/${name}.svg`;
const PROVIDER_BANNER = (key) => `all-care/providers/${key}.svg`;
const PROVIDER_LOGO = (key) => `all-care/logos/${key}.svg`;

// ---------------------------------------------------------------------------
// Services (order matches public/images/all-care-services/services/*.png)
// ---------------------------------------------------------------------------

// [id, English name, Bangla name, category banner]
const SERVICE_ROWS = [
  ["6a2c10000000000000000001", "Banking & Loan Assistance", "ব্যাংকিং ও লোন সহায়তা", "cat-professional"],
  ["6a2c10000000000000000002", "Courier & Parcel Delivery", "কুরিয়ার ও পার্সেল ডেলিভারি", "cat-transport"],
  ["6a2c10000000000000000003", "Legal Advice & Documentation", "আইনি পরামর্শ ও দলিল", "cat-professional"],
  ["6a2c10000000000000000004", "Photocopy & Printing", "ফটোকপি ও প্রিন্টিং", "cat-professional"],
  ["6a2c10000000000000000005", "Electrician", "ইলেকট্রিশিয়ান", "cat-home-repair"],
  ["6a2c10000000000000000006", "Plumber", "প্লাম্বার", "cat-home-repair"],
  ["6a2c10000000000000000007", "Gas Stove & Kitchen Hood Repair", "গ্যাস চুলা ও কিচেন হুড মেরামত", "cat-home-repair"],
  ["6a2c10000000000000000008", "Fridge & Washing Machine Repair", "ফ্রিজ ও ওয়াশিং মেশিন মেরামত", "cat-appliance"],
  ["6a2c10000000000000000009", "TV & Home Electronics Repair", "টিভি ও ইলেকট্রনিক্স মেরামত", "cat-appliance"],
  ["6a2c1000000000000000000a", "AC Servicing & Repair", "এসি সার্ভিসিং ও মেরামত", "cat-appliance"],
  ["6a2c1000000000000000000b", "Mobile Phone Repair", "মোবাইল ফোন মেরামত", "cat-tech"],
  ["6a2c1000000000000000000c", "Computer & Laptop Repair", "কম্পিউটার ও ল্যাপটপ মেরামত", "cat-tech"],
  ["6a2c1000000000000000000d", "Internet & Wi-Fi Setup", "ইন্টারনেট ও ওয়াই-ফাই সংযোগ", "cat-tech"],
  ["6a2c1000000000000000000e", "Car & Bike Repair", "গাড়ি ও বাইক মেরামত", "cat-transport"],
  ["6a2c1000000000000000000f", "House Shifting", "বাসা বদল", "cat-transport"],
  ["6a2c10000000000000000010", "CCTV & Security System", "সিসিটিভি ও নিরাপত্তা ব্যবস্থা", "cat-tech"],
  ["6a2c10000000000000000011", "School Admission Help", "স্কুল ভর্তি সহায়তা", "cat-education"],
  ["6a2c10000000000000000012", "Madrasa & Quran Teacher", "মাদ্রাসা ও কুরআন শিক্ষক", "cat-education"],
  ["6a2c10000000000000000013", "Coaching Centre", "কোচিং সেন্টার", "cat-education"],
  ["6a2c10000000000000000014", "Spoken English & IELTS", "স্পোকেন ইংলিশ ও আইইএলটিএস", "cat-education"],
  ["6a2c10000000000000000015", "Higher Study Consultancy", "উচ্চশিক্ষা পরামর্শ", "cat-education"],
  ["6a2c10000000000000000016", "Computer Training", "কম্পিউটার প্রশিক্ষণ", "cat-education"],
  ["6a2c10000000000000000017", "Driving School", "ড্রাইভিং স্কুল", "cat-transport"],
  ["6a2c10000000000000000018", "Tailoring & Fashion Design", "দর্জি ও ফ্যাশন ডিজাইন", "cat-events"],
  ["6a2c10000000000000000019", "Handyman", "হ্যান্ডিম্যান", "cat-home-repair"],
  ["6a2c1000000000000000001a", "Home Cleaning", "বাসা পরিষ্কার", "cat-cleaning"],
  ["6a2c1000000000000000001b", "Pest Control", "পেস্ট কন্ট্রোল", "cat-cleaning"],
  ["6a2c1000000000000000001c", "Pickup & Truck Rental", "পিকআপ ও ট্রাক ভাড়া", "cat-transport"],
  ["6a2c1000000000000000001d", "Catering & Event Management", "ক্যাটারিং ও ইভেন্ট ম্যানেজমেন্ট", "cat-events"],
  ["6a2c1000000000000000001e", "Community Centre & Venue Booking", "কমিউনিটি সেন্টার বুকিং", "cat-events"],
  ["6a2c1000000000000000001f", "Gym & Fitness Trainer", "জিম ও ফিটনেস ট্রেইনার", "cat-events"],
  ["6a2c10000000000000000020", "Digital Marketing", "ডিজিটাল মার্কেটিং", "cat-professional"],
  ["6a2c10000000000000000021", "Printing Press & Signboard", "প্রিন্টিং প্রেস ও সাইনবোর্ড", "cat-professional"],
  ["6a2c10000000000000000022", "Building Construction", "ভবন নির্মাণ", "cat-construction"],
  ["6a2c10000000000000000023", "Interior Design", "ইন্টেরিয়র ডিজাইন", "cat-construction"],
  ["6a2c10000000000000000024", "Tiles & Marble Fitting", "টাইলস ও মার্বেল ফিটিং", "cat-construction"],
  ["6a2c10000000000000000025", "Mason & Brick Work", "রাজমিস্ত্রি", "cat-construction"],
  ["6a2c10000000000000000026", "Glass & Thai Aluminium", "গ্লাস ও থাই অ্যালুমিনিয়াম", "cat-construction"],
  ["6a2c10000000000000000027", "Welding & Grill Work", "ওয়েল্ডিং ও গ্রিল", "cat-construction"],
  ["6a2c10000000000000000028", "Carpenter & Furniture", "কাঠমিস্ত্রি ও ফার্নিচার", "cat-construction"],
  ["6a2c10000000000000000029", "House Painting", "বাসা রং করা", "cat-construction"],
  ["6a2c1000000000000000002a", "Building Materials & Crane Rental", "নির্মাণ সামগ্রী ও ক্রেন ভাড়া", "cat-construction"],
  ["6a2c1000000000000000002b", "Floor Polishing & Mosaic", "ফ্লোর পলিশ ও মোজাইক", "cat-construction"],
  ["6a2c1000000000000000002c", "Lift & Generator Servicing", "লিফট ও জেনারেটর সার্ভিসিং", "cat-appliance"],
  ["6a2c1000000000000000002d", "Water Filter & Purifier", "পানির ফিল্টার ও পিউরিফায়ার", "cat-appliance"],
];

// Second slide shown on a service page, by category.
const CATEGORY_PROMO = {
  "cat-home-repair": "home-electric",
  "cat-appliance": "home-ac",
  "cat-tech": "home-gadget",
  "cat-cleaning": "home-cleaning",
  "cat-transport": "home-shifting",
  "cat-education": "home-tutor",
  "cat-construction": "home-build",
  "cat-events": "home-events",
  "cat-professional": "home-gadget",
};

export const ALL_SERVICES = SERVICE_ROWS.map(
  ([_id, nameEn, nameBn, category], index) => ({
    _id,
    service_name_eng: nameEn,
    service_name_bn: nameBn,
    serial_no: index + 1,
    service_banner_app: BANNER(category),
    status: "active",
    district_ids: [DHAKA.districtId, CHITTAGONG.districtId],
    sliderInfo: {
      _id: `6a2c2${_id.slice(5)}`,
      service_id: _id,
      service_slider: [BANNER(category), BANNER(CATEGORY_PROMO[category])],
    },
  }),
);

const S = Object.fromEntries(
  ALL_SERVICES.map((s) => [s.serial_no, s._id]),
);

// ---------------------------------------------------------------------------
// Home page sliders (careSlider[0].first_slider ... seventh_slider)
// ---------------------------------------------------------------------------

const slide = (id, name) => ({ _id: id, file_name: BANNER(name) });

export const CARE_SLIDERS = [
  {
    _id: "6a2c30000000000000000001",
    district_id: DHAKA.districtId,
    first_slider: [
      slide("6a2c31000000000000000001", "home-electric"),
      slide("6a2c31000000000000000002", "home-ac"),
      slide("6a2c31000000000000000003", "home-cleaning"),
      slide("6a2c31000000000000000004", "home-gadget"),
    ],
    second_slider: [
      slide("6a2c31000000000000000005", "cat-home-repair"),
      slide("6a2c31000000000000000006", "cat-appliance"),
      slide("6a2c31000000000000000007", "cat-tech"),
    ],
    third_slider: [
      slide("6a2c31000000000000000008", "home-tutor"),
      slide("6a2c31000000000000000009", "cat-education"),
      slide("6a2c3100000000000000000a", "home-shifting"),
    ],
    fourth_slider: [
      slide("6a2c3100000000000000000b", "home-fitness"),
      slide("6a2c3100000000000000000c", "home-events"),
      slide("6a2c3100000000000000000d", "cat-events"),
    ],
    fifth_slider: [
      slide("6a2c3100000000000000000e", "home-cleaning"),
      slide("6a2c3100000000000000000f", "cat-cleaning"),
      slide("6a2c31000000000000000010", "cat-transport"),
    ],
    sixth_slider: [
      slide("6a2c31000000000000000011", "home-build"),
      slide("6a2c31000000000000000012", "cat-construction"),
      slide("6a2c31000000000000000013", "cat-professional"),
    ],
    seventh_slider: [
      slide("6a2c31000000000000000014", "home-water"),
      slide("6a2c31000000000000000015", "home-ac"),
      slide("6a2c31000000000000000016", "home-electric"),
    ],
  },
  {
    _id: "6a2c30000000000000000002",
    district_id: CHITTAGONG.districtId,
    first_slider: [
      slide("6a2c32000000000000000001", "home-ac"),
      slide("6a2c32000000000000000002", "home-cleaning"),
      slide("6a2c32000000000000000003", "home-shifting"),
    ],
    second_slider: [
      slide("6a2c32000000000000000004", "cat-home-repair"),
      slide("6a2c32000000000000000005", "cat-tech"),
    ],
    third_slider: [
      slide("6a2c32000000000000000006", "home-tutor"),
      slide("6a2c32000000000000000007", "cat-education"),
    ],
    fourth_slider: [],
    fifth_slider: [
      slide("6a2c32000000000000000008", "cat-cleaning"),
      slide("6a2c32000000000000000009", "cat-transport"),
    ],
    sixth_slider: [],
    seventh_slider: [slide("6a2c3200000000000000000a", "home-electric")],
  },
];

// ---------------------------------------------------------------------------
// Providers
// ---------------------------------------------------------------------------

const provider = ({
  id,
  key,
  name,
  district,
  address,
  lat,
  lng,
  person,
  phone,
  altPhone,
  services,
  rating,
  reviews,
  years,
  details,
}) => ({
  _id: id,
  provider_name: name,
  district_id: district.districtId,
  district_name: district.districtName,
  address,
  latitude: lat,
  longitude: lng,
  location: { type: "Point", coordinates: [lng, lat] },
  contact_person_name: person,
  contact_no: phone,
  alternative_contact_no: altPhone,
  service_ids: services.map((n) => S[n]),
  rating,
  total_reviews: reviews,
  experience_years: years,
  service_hours: "9:00 AM - 10:00 PM, 7 days a week",
  provider_banner_app: PROVIDER_BANNER(key),
  provider_logo: PROVIDER_LOGO(key),
  service_details: details.join("\n"),
  status: "active",
});

export const DHAKA_PROVIDERS = [
  provider({
    id: "6a2c40000000000000000001",
    key: "powerfix",
    name: "PowerFix Electric & Plumbing",
    district: DHAKA,
    address: "House 12, Road 45, Gulshan 2, Dhaka 1212",
    lat: 23.7945,
    lng: 90.4143,
    person: "Md. Rafiqul Islam",
    phone: "01700-000001",
    altPhone: "01800-000001",
    services: [5, 6, 7, 25],
    rating: 4.8,
    reviews: 312,
    years: 9,
    details: [
      "Licensed electricians and plumbers for flats and offices in Gulshan, Banani and Baridhara.",
      "",
      "Price list (BDT):",
      "- Visit & inspection: 300",
      "- Switch / socket replacement: 150 per point",
      "- Ceiling fan installation: 500",
      "- Full flat wiring check: 1,500",
      "- Water line leak repair: from 600",
      "- Commode / basin fitting: 1,200",
      "- Gas stove burner service: 700",
      "",
      "Parts are billed at market price with receipt. 30-day service warranty.",
    ],
  }),
  provider({
    id: "6a2c40000000000000000002",
    key: "coolbreeze",
    name: "CoolBreeze AC & Appliance Care",
    district: DHAKA,
    address: "Plot 7, Pragati Sarani, Middle Badda, Dhaka 1212",
    lat: 23.7806,
    lng: 90.4261,
    person: "Shahidul Haque",
    phone: "01700-000002",
    altPhone: "01800-000002",
    services: [8, 9, 10, 44],
    rating: 4.7,
    reviews: 486,
    years: 11,
    details: [
      "AC, fridge, washing machine, TV, lift and generator servicing at your home.",
      "",
      "Price list (BDT):",
      "- AC jet wash (1-2 ton): 800",
      "- AC gas refill: from 2,500",
      "- AC installation: 2,000",
      "- Fridge gas charge: 2,200",
      "- Washing machine repair: from 900",
      "- LED TV panel check: 500",
      "- Generator servicing: from 3,500",
      "",
      "Same-day visits inside Dhaka North for bookings before 2 PM.",
    ],
  }),
  provider({
    id: "6a2c40000000000000000003",
    key: "gadgetdoctor",
    name: "GadgetDoctor Repair Centre",
    district: DHAKA,
    address: "Level 3, Banani Super Market, Road 11, Banani, Dhaka 1213",
    lat: 23.7937,
    lng: 90.4024,
    person: "Tanvir Ahmed",
    phone: "01700-000003",
    altPhone: "01800-000003",
    services: [11, 12, 13, 16],
    rating: 4.6,
    reviews: 274,
    years: 6,
    details: [
      "Phone, laptop, router and CCTV repair with pickup and drop.",
      "",
      "Price list (BDT):",
      "- Phone screen replacement: from 1,800",
      "- Phone battery replacement: from 1,200",
      "- Laptop servicing & cleaning: 1,000",
      "- Windows / software setup: 600",
      "- Wi-Fi router setup: 500",
      "- CCTV (4 camera) installation: 12,500 with DVR",
      "",
      "Free diagnosis. 3-month warranty on replaced parts.",
    ],
  }),
  provider({
    id: "6a2c40000000000000000004",
    key: "sparkle",
    name: "Sparkle Home Cleaning",
    district: DHAKA,
    address: "House 5, Road 8, Baridhara DOHS, Dhaka 1206",
    lat: 23.81,
    lng: 90.4205,
    person: "Nasima Akter",
    phone: "01700-000004",
    altPhone: "01800-000004",
    services: [26, 27],
    rating: 4.9,
    reviews: 538,
    years: 7,
    details: [
      "Trained, background-checked cleaning crew with their own machines.",
      "",
      "Price list (BDT):",
      "- Full flat deep cleaning (1,200 sq ft): 4,500",
      "- Kitchen deep cleaning: 1,800",
      "- Bathroom cleaning: 800 each",
      "- Sofa shampoo: 300 per seat",
      "- Cockroach & ant control: 2,000",
      "- Termite treatment: from 5,000",
      "",
      "Odourless, child-safe pest control chemicals.",
    ],
  }),
  provider({
    id: "6a2c40000000000000000005",
    key: "easyshift",
    name: "EasyShift Movers",
    district: DHAKA,
    address: "142 Tejgaon Industrial Area, Dhaka 1208",
    lat: 23.7639,
    lng: 90.3985,
    person: "Kamal Hossain",
    phone: "01700-000005",
    altPhone: "01800-000005",
    services: [2, 15, 28],
    rating: 4.5,
    reviews: 198,
    years: 8,
    details: [
      "House and office shifting, covered vans, pickups and parcel delivery.",
      "",
      "Price list (BDT):",
      "- 1-bedroom flat shifting (inside Dhaka): 6,000",
      "- 3-bedroom flat shifting: from 14,000",
      "- 7 ft covered van (per trip): 2,500",
      "- 14 ft truck (per trip): 5,500",
      "- Same-day parcel delivery inside Dhaka: 120",
      "",
      "Packing material, labour and furniture fitting included in shifting packages.",
    ],
  }),
  provider({
    id: "6a2c40000000000000000006",
    key: "autocare",
    name: "AutoCare Garage & Driving School",
    district: DHAKA,
    address: "Bir Uttam AK Khandakar Road, Mohakhali, Dhaka 1212",
    lat: 23.7781,
    lng: 90.4005,
    person: "Abdul Mannan",
    phone: "01700-000006",
    altPhone: "01800-000006",
    services: [14, 23],
    rating: 4.4,
    reviews: 167,
    years: 14,
    details: [
      "Car and motorbike servicing, plus BRTA licence driving courses.",
      "",
      "Price list (BDT):",
      "- Car full servicing: from 3,500",
      "- Engine oil change (car): 2,200 with oil",
      "- Bike servicing: 800",
      "- Driving course (20 classes, manual): 9,000",
      "- Driving course (20 classes, auto): 11,000",
      "",
      "Free pickup within 5 km for car servicing.",
    ],
  }),
  provider({
    id: "6a2c40000000000000000007",
    key: "brightpath",
    name: "BrightPath Tutors & Admission Care",
    district: DHAKA,
    address: "House 27, Road 7A, Dhanmondi, Dhaka 1209",
    lat: 23.7461,
    lng: 90.3742,
    person: "Farzana Rahman",
    phone: "01700-000007",
    altPhone: "01800-000007",
    services: [17, 18, 19, 20, 21, 22],
    rating: 4.8,
    reviews: 421,
    years: 10,
    details: [
      "Home tutors, coaching batches, English courses and study abroad guidance.",
      "",
      "Price list (BDT):",
      "- Home tutor (class 1-8, 3 days/week): 5,000 per month",
      "- SSC / HSC coaching batch: 3,500 per month",
      "- Quran teacher at home: 3,000 per month",
      "- Spoken English (2 months): 6,500",
      "- IELTS full course: 12,000",
      "- School admission test preparation: 4,000",
      "- Basic computer & MS Office course: 5,500",
      "",
      "Free counselling session for higher study in the UK, Canada and Malaysia.",
    ],
  }),
  provider({
    id: "6a2c40000000000000000008",
    key: "silkthread",
    name: "Silk Thread Tailors",
    district: DHAKA,
    address: "Shop 21, Rapa Plaza, Road 27, Dhanmondi, Dhaka 1209",
    lat: 23.7515,
    lng: 90.3708,
    person: "Rokeya Begum",
    phone: "01700-000008",
    altPhone: "01800-000008",
    services: [24],
    rating: 4.6,
    reviews: 143,
    years: 12,
    details: [
      "Ladies' and gents' tailoring with home measurement service.",
      "",
      "Price list (BDT):",
      "- Salwar kameez stitching: 900",
      "- Blouse stitching: 600",
      "- Panjabi stitching: 1,000",
      "- Suit (2 piece): 6,500",
      "- Alteration: from 150",
      "",
      "Delivery in 5-7 days; express delivery in 48 hours for 50% extra.",
    ],
  }),
  provider({
    id: "6a2c40000000000000000009",
    key: "utshob",
    name: "Utshob Events & Catering",
    district: DHAKA,
    address: "Section 10, Block C, Mirpur, Dhaka 1216",
    lat: 23.8069,
    lng: 90.3687,
    person: "Jahangir Alam",
    phone: "01700-000009",
    altPhone: "01800-000009",
    services: [29, 30],
    rating: 4.7,
    reviews: 236,
    years: 15,
    details: [
      "Wedding, birthday, aqiqah and corporate event catering with venue booking.",
      "",
      "Price list (BDT):",
      "- Kacchi biryani package: 450 per guest",
      "- Mixed Bangali menu: 550 per guest",
      "- Birthday decoration: from 8,000",
      "- Community centre (300 guests): from 60,000",
      "",
      "Minimum order 50 guests. Book at least 7 days ahead.",
    ],
  }),
  provider({
    id: "6a2c4000000000000000000a",
    key: "fitlife",
    name: "FitLife Gym & Personal Training",
    district: DHAKA,
    address: "House 18, Sector 7, Uttara, Dhaka 1230",
    lat: 23.8697,
    lng: 90.3925,
    person: "Sajid Chowdhury",
    phone: "01700-000010",
    altPhone: "01800-000010",
    services: [31],
    rating: 4.5,
    reviews: 119,
    years: 5,
    details: [
      "Separate ladies' hours, certified trainers and home training plans.",
      "",
      "Price list (BDT):",
      "- Monthly gym membership: 3,000",
      "- 3-month membership: 8,000",
      "- Personal trainer at home (12 sessions): 12,000",
      "- Diet consultation: 1,500",
    ],
  }),
  provider({
    id: "6a2c4000000000000000000b",
    key: "nirman",
    name: "Nirman Builders & Interiors",
    district: DHAKA,
    address: "Block D, Road 5, Bashundhara R/A, Dhaka 1229",
    lat: 23.8193,
    lng: 90.4326,
    person: "Engr. Mahmudul Hasan",
    phone: "01700-000011",
    altPhone: "01800-000011",
    services: [34, 35, 36, 37, 42, 43],
    rating: 4.6,
    reviews: 158,
    years: 13,
    details: [
      "Design, construction and finishing for houses, flats and shops.",
      "",
      "Price list (BDT):",
      "- Site visit & estimate: free inside Dhaka",
      "- Building construction: from 2,800 per sq ft",
      "- Flat interior design: from 450 per sq ft",
      "- Tiles fitting (labour): 45 per sq ft",
      "- Mason work: 1,200 per day per mason",
      "- Floor polishing: 25 per sq ft",
      "- Cement, rod and brick supply at market rate",
    ],
  }),
  provider({
    id: "6a2c4000000000000000000c",
    key: "steelglass",
    name: "Rampura Steel, Glass & Wood Works",
    district: DHAKA,
    address: "DIT Road, West Rampura, Dhaka 1219",
    lat: 23.7612,
    lng: 90.4209,
    person: "Md. Alamgir Kabir",
    phone: "01700-000012",
    altPhone: "01800-000012",
    services: [38, 39, 40, 41],
    rating: 4.3,
    reviews: 97,
    years: 16,
    details: [
      "Thai aluminium windows, grills, wooden furniture and house painting.",
      "",
      "Price list (BDT):",
      "- Thai aluminium window: 550 per sq ft",
      "- Window grill: 180 per sq ft",
      "- Wooden door (semi-segun): from 14,000",
      "- Furniture repair: from 800",
      "- Interior painting (labour + paint): 22 per sq ft",
    ],
  }),
  provider({
    id: "6a2c4000000000000000000d",
    key: "printpoint",
    name: "PrintPoint Digital Studio",
    district: DHAKA,
    address: "Shop 4, Dilkusha C/A, Motijheel, Dhaka 1000",
    lat: 23.7266,
    lng: 90.4196,
    person: "Arif Mahmud",
    phone: "01700-000013",
    altPhone: "01800-000013",
    services: [4, 32, 33],
    rating: 4.4,
    reviews: 205,
    years: 9,
    details: [
      "Printing, signboards and social media marketing for small businesses.",
      "",
      "Price list (BDT):",
      "- Photocopy: 2 per page",
      "- Colour print (A4): 15 per page",
      "- Visiting cards (500 pcs): 700",
      "- PVC signboard: 180 per sq ft",
      "- Facebook page management: 8,000 per month",
    ],
  }),
  provider({
    id: "6a2c4000000000000000000e",
    key: "helpdesk",
    name: "Shohoj Legal & Finance Desk",
    district: DHAKA,
    address: "Room 509, 9 Motijheel C/A, Dhaka 1000",
    lat: 23.733,
    lng: 90.4172,
    person: "Adv. Shirin Sultana",
    phone: "01700-000014",
    altPhone: "01800-000014",
    services: [1, 3],
    rating: 4.7,
    reviews: 88,
    years: 18,
    details: [
      "Help with bank loans, land documents, affidavits and tenancy agreements.",
      "",
      "Price list (BDT):",
      "- Lawyer consultation (30 min): 1,000",
      "- Rental agreement drafting: 2,500",
      "- Affidavit & notary: 1,500",
      "- Home / SME loan file preparation: 3,000",
    ],
  }),
  provider({
    id: "6a2c4000000000000000000f",
    key: "puredrop",
    name: "PureDrop Water Filter Service",
    district: DHAKA,
    address: "Road 3, Section 2, Mirpur, Dhaka 1216",
    lat: 23.8223,
    lng: 90.3654,
    person: "Habibur Rahman",
    phone: "01700-000015",
    altPhone: "01800-000015",
    services: [45],
    rating: 4.5,
    reviews: 132,
    years: 6,
    details: [
      "RO water purifier installation, filter change and tank cleaning.",
      "",
      "Price list (BDT):",
      "- RO purifier installation: 1,000",
      "- Filter set change: from 2,400",
      "- Water tank cleaning: 1,500",
    ],
  }),
];

export const CHITTAGONG_PROVIDERS = [
  provider({
    id: "6a2c50000000000000000001",
    key: "portcity",
    name: "Port City Electric & Cooling",
    district: CHITTAGONG,
    address: "Sheikh Mujib Road, Agrabad C/A, Chittagong 4100",
    lat: 22.3249,
    lng: 91.8141,
    person: "Mohammad Yusuf",
    phone: "01700-000021",
    altPhone: "01800-000021",
    services: [5, 6, 8, 10],
    rating: 4.6,
    reviews: 174,
    years: 10,
    details: [
      "Electricians, plumbers and AC technicians across Chittagong city.",
      "",
      "Price list (BDT):",
      "- Visit & inspection: 300",
      "- AC jet wash: 800",
      "- Fridge repair: from 900",
      "- Plumbing repair: from 500",
    ],
  }),
  provider({
    id: "6a2c50000000000000000002",
    key: "agrabadclean",
    name: "Agrabad Clean Care",
    district: CHITTAGONG,
    address: "Badamtali Road, Agrabad, Chittagong 4100",
    lat: 22.3298,
    lng: 91.8058,
    person: "Rubina Yasmin",
    phone: "01700-000022",
    altPhone: "01800-000022",
    services: [26, 27],
    rating: 4.7,
    reviews: 96,
    years: 5,
    details: [
      "Home deep cleaning and pest control.",
      "",
      "Price list (BDT):",
      "- Full flat deep cleaning: from 4,000",
      "- Cockroach control: 1,800",
    ],
  }),
  provider({
    id: "6a2c50000000000000000003",
    key: "ctgmovers",
    name: "Chattogram Movers",
    district: CHITTAGONG,
    address: "Port Connecting Road, Halishahar, Chittagong 4216",
    lat: 22.329,
    lng: 91.779,
    person: "Nurul Amin",
    phone: "01700-000023",
    altPhone: "01800-000023",
    services: [15, 28],
    rating: 4.4,
    reviews: 71,
    years: 7,
    details: [
      "House shifting and pickup rental inside Chittagong city.",
      "",
      "Price list (BDT):",
      "- 2-bedroom flat shifting: from 8,000",
      "- Pickup (per trip): 2,200",
    ],
  }),
  provider({
    id: "6a2c50000000000000000004",
    key: "gectech",
    name: "GEC Tech Repair",
    district: CHITTAGONG,
    address: "Central Plaza, GEC Circle, Chittagong 4000",
    lat: 22.359,
    lng: 91.8217,
    person: "Imran Hossain",
    phone: "01700-000024",
    altPhone: "01800-000024",
    services: [11, 12, 13, 16],
    rating: 4.5,
    reviews: 128,
    years: 6,
    details: [
      "Mobile, laptop, internet and CCTV services.",
      "",
      "Price list (BDT):",
      "- Phone screen replacement: from 1,700",
      "- Laptop servicing: 900",
      "- CCTV (4 camera) installation: 12,000",
    ],
  }),
  provider({
    id: "6a2c50000000000000000005",
    key: "halishahartutors",
    name: "Halishahar Tutor Point",
    district: CHITTAGONG,
    address: "Block H, Halishahar Housing Estate, Chittagong 4216",
    lat: 22.3342,
    lng: 91.7862,
    person: "Sumaiya Islam",
    phone: "01700-000025",
    altPhone: "01800-000025",
    services: [19, 20, 21],
    rating: 4.6,
    reviews: 64,
    years: 8,
    details: [
      "Coaching batches, spoken English and study abroad guidance.",
      "",
      "Price list (BDT):",
      "- SSC / HSC coaching: 3,000 per month",
      "- Spoken English (2 months): 6,000",
      "- IELTS course: 11,000",
    ],
  }),
];

export const ALL_CARE_PROVIDERS = [...DHAKA_PROVIDERS, ...CHITTAGONG_PROVIDERS];

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------

const DEMO_DISTRICTS = [DHAKA.districtId, CHITTAGONG.districtId];
const NEAREST_RADIUS_M = 12000;
const PAGE_SIZE = 20;

const toRad = (deg) => (deg * Math.PI) / 180;
const distanceMeters = (lat1, lng1, lat2, lng2) => {
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(a)));
};

const toNumber = (value) => {
  const n = Number(value);
  return value === "" || value == null || Number.isNaN(n) ? null : n;
};

const exploreAllService = ({ query }) => {
  const districtId = query.district_id;
  const known = DEMO_DISTRICTS.includes(districtId);

  return {
    success: true,
    message: known ? "Services found" : "No service found in this area",
    result: {
      servicesType: known
        ? ALL_SERVICES.filter((s) => s.district_ids.includes(districtId))
        : [],
      sliderByDistrict: CARE_SLIDERS.filter(
        (s) => s.district_id === districtId,
      ),
    },
  };
};

const exploreCareProvider = ({ body }) => {
  const { district_id: districtId, service_id: serviceId } = body;
  const page = Math.max(1, toNumber(body.page) || 1);
  const lat = toNumber(body.latitude);
  const lng = toNumber(body.longitude);

  if (!serviceId) {
    return demoResponse(400, {
      success: false,
      message: "service_id is required",
    });
  }

  const hasLocation = lat != null && lng != null;
  const matches = ALL_CARE_PROVIDERS.filter(
    (p) => p.district_id === districtId && p.service_ids.includes(serviceId),
  ).map((p) =>
    hasLocation
      ? { ...p, distance: distanceMeters(lat, lng, p.latitude, p.longitude) }
      : { ...p },
  );

  const careProviderByDistrict = [...matches].sort(
    (a, b) => b.rating - a.rating || b.total_reviews - a.total_reviews,
  );

  const nearestCareProvider = hasLocation
    ? matches
        .filter((p) => p.distance <= NEAREST_RADIUS_M)
        .sort((a, b) => a.distance - b.distance)
    : matches;

  const paginate = (list) =>
    list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return {
    success: true,
    message: matches.length ? "Care providers found" : "No care provider found",
    result: {
      careProviderByDistrict: paginate(careProviderByDistrict),
      nearestCareProvider: paginate(nearestCareProvider),
      totalCareProvider: matches.length,
      page,
    },
  };
};

export const routes = [
  {
    service: "ALL_CARE",
    method: "GET",
    path: EXPLORE_ALL_CARE_SERVICE,
    handler: exploreAllService,
  },
  {
    service: "ALL_CARE",
    method: "POST",
    path: EXPLORE_CARE_PROVIDER,
    handler: exploreCareProvider,
  },
];
