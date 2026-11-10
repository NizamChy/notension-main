export const MEN_TYPE_ID = "6880c239098c458993b32675";
export const WOMEN_TYPE_ID = "6880c244098c458993b32677";
export const KIDS_TYPE_ID = "6880c24c098c458993b32679";

// Carousel banners are local files only (no third-party image hosts).
// `image` is a flat SVG in public/demo/fashion/; `liveImage` is an optional
// local photo used instead when demo mode is off.
export const FASHION_CAROUSEL_SLIDES = [
  {
    id: 1,
    title: "Exclusive Panjabi Collection",
    subtitle: "Complete Your Look",
    cta: "View All",
    href: `/fashion-lifestyle/type/men_${MEN_TYPE_ID}`,
    image: "carousel-panjabi.svg",
    liveImage: "/images/home/fashion-lifestyle-banner.jpeg",
  },
  {
    id: 2,
    title: "Premium Quality Shirts",
    subtitle: "Get your own style",
    cta: "Shop Now",
    href: `/fashion-lifestyle/type/men_${MEN_TYPE_ID}`,
    image: "carousel-shirts.svg",
  },
  {
    id: 3,
    title: "Kids Wear",
    subtitle: "Find your favourites",
    cta: "Discover",
    href: `/fashion-lifestyle/type/kids_${KIDS_TYPE_ID}`,
    image: "carousel-kids.svg",
  },
  {
    id: 4,
    title: "Summer Collection",
    subtitle: "New Arrivals",
    cta: "Shop Now",
    href: `/fashion-lifestyle/type/women_${WOMEN_TYPE_ID}`,
    image: "carousel-summer.svg",
  },
  {
    id: 5,
    title: "Casual Weekend Style",
    subtitle: "Comfort Meets Fashion",
    cta: "Browse Collection",
    href: `/fashion-lifestyle/type/women_${WOMEN_TYPE_ID}`,
    image: "carousel-casual.svg",
  },
];

export const FILTER_OPTIONS = {
  sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  colors: [
    "Red",
    "Blue",
    "Green",
    "Black",
    "White",
    "Yellow",
    "Pink",
    "Purple",
  ],
  brands: ["Nike", "Adidas", "Zara", "H&M", "Levi's", "Gucci", "Prada"],
  fits: ["Slim", "Regular", "Oversized", "Relaxed", "Skinny"],
  fabrics: ["Cotton", "Polyester", "Silk", "Wool", "Denim", "Linen"],
  embelishments: ["Embroidery", "Sequins", "Beads", "Print", "Patch"],
  sleeveLengths: ["Short", "Long", "3/4", "Sleeveless", "Cap"],
  segments: ["Men", "Women", "Kids", "Eid-Ul-Adha Collection"],
};

export const PAYMENT_DATA = [
  {
    id: "cash_on_delivery",
    label: "Cash on Delivery",
    icon: "/images/logo/cod-logo.png",
  },
  {
    id: "credit-debit-card",
    label: "Credit/Debit Card",
    icon: "/images/logo/credit-debit-logo.png",
  },
  { id: "bkash", label: "bKash", icon: "/images/logo/bkash-logo.png" },
  { id: "mcash", label: "mCash", icon: "/images/logo/mcash-logo.webp" },
  { id: "nagad", label: "Nagad", icon: "/images/logo/nagad-logo.webp" },
];
