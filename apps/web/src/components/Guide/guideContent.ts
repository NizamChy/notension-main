// The NoTension project guide: every module, role and workflow, end to end.
// Each piece of text is { en, bn }; Guide.tsx shows the chosen language.
// Keep it in step with the code: order statuses come from
// apps/api/src/db/schema/commerce.ts, rider moves from
// apps/api/src/modules/admin/service-panels.ts, permissions from
// apps/web/src/components/Admin/perms.ts.

export type GuideLang = "en" | "bn";
export type GuideText = Record<GuideLang, string>;

export type GuideBlock =
  | { type: "h" | "p"; text: GuideText }
  | { type: "list" | "flow"; items: GuideText[] }
  | { type: "steps"; items: { title: GuideText; text: GuideText }[] }
  | { type: "table"; head: GuideText[]; rows: GuideText[][] }
  | { type: "note"; tone: "info" | "warn"; text: GuideText }
  | { type: "links"; items: { href: string; label: GuideText }[] }
  | { type: "faq"; items: { q: GuideText; a: GuideText }[] };

export type GuideSection = { id: string; title: GuideText; blocks: GuideBlock[] };

const t = (en: string, bn: string): GuideText => ({ en, bn });

export const GUIDE_UI = {
  title: t("NoTension project guide", "NoTension প্রজেক্ট গাইড"),
  subtitle: t(
    "How the whole platform works, end to end: every module, every role, and every step from the website to the customer's door.",
    "পুরো প্ল্যাটফর্ম কীভাবে চলে, শুরু থেকে শেষ পর্যন্ত: প্রতিটি মডিউল, প্রতিটি রোল, আর ওয়েবসাইট থেকে কাস্টমারের দরজা পর্যন্ত প্রতিটি ধাপ।",
  ),
  contents: t("Contents", "সূচিপত্র"),
  language: t("Language", "ভাষা"),
  updated: t("Matches the live system as of November 2026.", "নভেম্বর ২০২৬ পর্যন্ত লাইভ সিস্টেমের সাথে মিল রেখে লেখা।"),
  backToTop: t("Back to top", "উপরে ফিরে যান"),
};

export const GUIDE_SECTIONS: GuideSection[] = [
  // ------------------------------------------------------------------ 1
  {
    id: "overview",
    title: t("1. What NoTension is", "১. NoTension কী"),
    blocks: [
      {
        type: "p",
        text: t(
          "NoTension is a multi-service marketplace for Bangladesh. One website (and app) brings together shopping, food, health care and home services. Customers pick their location once and see the stores, doctors and providers near them.",
          "NoTension বাংলাদেশের জন্য একটি মাল্টি-সার্ভিস মার্কেটপ্লেস। একটি ওয়েবসাইট (এবং অ্যাপ) এ শপিং, খাবার, স্বাস্থ্যসেবা আর হোম সার্ভিস একসাথে পাওয়া যায়। কাস্টমার একবার লোকেশন বেছে নিলেই কাছের দোকান, ডাক্তার আর সার্ভিস প্রোভাইডার দেখতে পান।",
        ),
      },
      {
        type: "table",
        head: [t("Module", "মডিউল"), t("What customers do", "কাস্টমার কী করেন"), t("Who serves them", "কে সার্ভিস দেয়")],
        rows: [
          [t("Grocery", "গ্রোসারি"), t("Order daily groceries from nearby stores", "কাছের দোকান থেকে নিত্যপ্রয়োজনীয় বাজার অর্ডার"), t("Grocery store team + rider", "গ্রোসারি স্টোর টিম + রাইডার")],
          [t("Medicine", "মেডিসিন"), t("Order medicines and health products from pharmacies", "ফার্মেসি থেকে ওষুধ ও হেলথ প্রোডাক্ট অর্ডার"), t("Pharmacy team + rider", "ফার্মেসি টিম + রাইডার")],
          [t("Food", "ফুড"), t("Order meals from restaurants, with variations and add-ons", "রেস্টুরেন্ট থেকে খাবার অর্ডার, ভ্যারিয়েশন ও অ্যাড-অন সহ"), t("Restaurant team + rider", "রেস্টুরেন্ট টিম + রাইডার")],
          [t("Fashion & Lifestyle", "ফ্যাশন ও লাইফস্টাইল"), t("Buy clothes and accessories for men, women and kids", "ছেলে, মেয়ে ও বাচ্চাদের পোশাক ও এক্সেসরিজ কেনা"), t("Fashion shop team + rider", "ফ্যাশন শপ টিম + রাইডার")],
          [t("Health care", "হেলথ কেয়ার"), t("Find doctors, hospitals, diagnostic, eye and dental centres; book a doctor's serial", "ডাক্তার, হাসপাতাল, ডায়াগনস্টিক, চক্ষু ও ডেন্টাল সেন্টার খোঁজা; ডাক্তারের সিরিয়াল বুক করা"), t("Doctor (doctor panel)", "ডাক্তার (ডক্টর প্যানেল)")],
          [t("All Care", "অল কেয়ার"), t("Find home services: electrician, plumber, tutor, movers and more", "হোম সার্ভিস খোঁজা: ইলেকট্রিশিয়ান, প্লাম্বার, টিউটর, মুভার্স ইত্যাদি"), t("Service provider (provider panel)", "সার্ভিস প্রোভাইডার (প্রোভাইডার প্যানেল)")],
        ],
      },
      {
        type: "p",
        text: t(
          "Behind the website there is one admin panel at /admin. Everyone who works on the platform signs in there, and each person only sees what their role allows.",
          "ওয়েবসাইটের পেছনে /admin এ একটি অ্যাডমিন প্যানেল আছে। প্ল্যাটফর্মে যারা কাজ করেন সবাই সেখানে লগইন করেন, আর প্রত্যেকে শুধু নিজের রোল অনুযায়ী যা অনুমতি আছে তাই দেখেন।",
        ),
      },
    ],
  },

  // ------------------------------------------------------------------ 2
  {
    id: "system",
    title: t("2. How the system is built", "২. সিস্টেম কীভাবে তৈরি"),
    blocks: [
      {
        type: "flow",
        items: [
          t("Customer's browser", "কাস্টমারের ব্রাউজার"),
          t("Website (Next.js, Vercel)", "ওয়েবসাইট (Next.js, Vercel)"),
          t("API (Hono, Vercel)", "API (Hono, Vercel)"),
          t("Database (Postgres, Neon)", "ডাটাবেস (Postgres, Neon)"),
        ],
      },
      {
        type: "list",
        items: [
          t(
            "Website: the storefront for customers and the admin panel for staff, in one Next.js app (apps/web).",
            "ওয়েবসাইট: কাস্টমারদের স্টোরফ্রন্ট আর স্টাফদের অ্যাডমিন প্যানেল, একটি Next.js অ্যাপে (apps/web)।",
          ),
          t(
            "API: one server (apps/api) for every module. It checks who is signed in and what their role allows, and it calculates prices itself so nobody can change a price from the browser.",
            "API: সব মডিউলের জন্য একটি সার্ভার (apps/api)। কে লগইন করেছে আর তার রোলে কী অনুমতি আছে তা যাচাই করে, এবং দাম নিজেই হিসাব করে, তাই ব্রাউজার থেকে কেউ দাম বদলাতে পারে না।",
          ),
          t(
            "Database: Postgres with PostGIS (for distance to stores), hosted on Neon in Singapore.",
            "ডাটাবেস: PostGIS সহ Postgres (দোকানের দূরত্ব হিসাবের জন্য), সিঙ্গাপুরে Neon এ হোস্ট করা।",
          ),
          t(
            "Sign-in: customers use their phone number and a one-time code (OTP). Staff use phone number and password.",
            "লগইন: কাস্টমার ফোন নম্বর আর ওয়ান-টাইম কোড (OTP) দিয়ে লগইন করেন। স্টাফরা ফোন নম্বর আর পাসওয়ার্ড দিয়ে।",
          ),
          t(
            "Deploy: every merge into the main branch on GitHub deploys both the website and the API automatically.",
            "ডিপ্লয়: GitHub এর main ব্রাঞ্চে প্রতিটি merge এ ওয়েবসাইট আর API দুটোই অটোমেটিক ডিপ্লয় হয়।",
          ),
        ],
      },
      {
        type: "note",
        tone: "info",
        text: t(
          "If the API can't be reached, the website switches to demo data on its own and shows a banner, so customers can still browse. It switches back when the server is up again.",
          "API তে পৌঁছানো না গেলে ওয়েবসাইট নিজে থেকেই ডেমো ডাটায় চলে যায় এবং একটি ব্যানার দেখায়, যাতে কাস্টমার তবুও ব্রাউজ করতে পারেন। সার্ভার চালু হলে আবার আসল ডাটায় ফিরে আসে।",
        ),
      },
    ],
  },

  // ------------------------------------------------------------------ 3
  {
    id: "roles",
    title: t("3. Roles: who does what", "৩. রোল: কে কী করে"),
    blocks: [
      {
        type: "p",
        text: t(
          "There are three groups of roles. Platform roles run NoTension itself. Store roles belong to one store only. Service roles get their own small panel.",
          "রোল তিন ধরনের। প্ল্যাটফর্ম রোল পুরো NoTension চালায়। স্টোর রোল শুধু একটি নির্দিষ্ট দোকানের জন্য। সার্ভিস রোলের নিজস্ব ছোট প্যানেল আছে।",
        ),
      },
      {
        type: "table",
        head: [t("Role", "রোল"), t("Group", "ধরন"), t("What they can do", "কী করতে পারেন")],
        rows: [
          [t("Super admin", "সুপার অ্যাডমিন"), t("Platform", "প্ল্যাটফর্ম"), t("Everything. Only a super admin can give or remove platform roles (admin, support, finance, content manager), take backups, restore them and reset the data.", "সবকিছু। শুধু সুপার অ্যাডমিন প্ল্যাটফর্ম রোল (অ্যাডমিন, সাপোর্ট, ফাইন্যান্স, কন্টেন্ট ম্যানেজার) দিতে বা সরাতে পারেন, ব্যাকআপ নিতে, রিস্টোর করতে আর ডাটা রিসেট করতে পারেন।")],
          [t("Admin", "অ্যাডমিন"), t("Platform", "প্ল্যাটফর্ম"), t("Runs daily operations: creates stores, edits products, moves orders, assigns riders, blocks users, gives store and service roles, links doctor and provider profiles to accounts.", "প্রতিদিনের কাজ চালান: দোকান তৈরি, প্রোডাক্ট এডিট, অর্ডার এগিয়ে নেওয়া, রাইডার অ্যাসাইন, ইউজার ব্লক, স্টোর ও সার্ভিস রোল দেওয়া, ডাক্তার ও প্রোভাইডার প্রোফাইল অ্যাকাউন্টের সাথে লিংক করা।")],
          [t("Support", "সাপোর্ট"), t("Platform", "প্ল্যাটফর্ম"), t("Helps customers: sees users, stores and orders, moves orders along and assigns riders.", "কাস্টমারদের সাহায্য করেন: ইউজার, দোকান ও অর্ডার দেখেন, অর্ডার এগিয়ে নেন এবং রাইডার অ্যাসাইন করেন।")],
          [t("Finance", "ফাইন্যান্স"), t("Platform", "প্ল্যাটফর্ম"), t("Reads orders, revenue and stores. Cannot change anything.", "অর্ডার, আয় ও দোকানের তথ্য দেখেন। কিছু বদলাতে পারেন না।")],
          [t("Content manager", "কন্টেন্ট ম্যানেজার"), t("Platform", "প্ল্যাটফর্ম"), t("Keeps the product catalogue right: names, photos, categories.", "প্রোডাক্ট ক্যাটালগ ঠিক রাখেন: নাম, ছবি, ক্যাটাগরি।")],
          [t("Merchant owner", "মার্চেন্ট ওনার"), t("Store", "স্টোর"), t("Owns one store: store settings, opening hours, items, prices, stock, orders, riders, and adds or removes the store's managers and staff.", "একটি দোকানের মালিক: দোকানের সেটিংস, খোলার সময়, আইটেম, দাম, স্টক, অর্ডার, রাইডার, এবং দোকানের ম্যানেজার ও স্টাফ যোগ বা বাদ দেওয়া।")],
          [t("Merchant manager", "মার্চেন্ট ম্যানেজার"), t("Store", "স্টোর"), t("Runs the store day to day: settings, items, prices, stock, orders and riders.", "প্রতিদিন দোকান চালান: সেটিংস, আইটেম, দাম, স্টক, অর্ডার ও রাইডার।")],
          [t("Merchant staff", "মার্চেন্ট স্টাফ"), t("Store", "স্টোর"), t("Works the floor: updates stock and availability, moves orders along. Cannot change prices.", "দোকানের ভেতরের কাজ: স্টক ও অ্যাভেইলেবিলিটি আপডেট, অর্ডার এগিয়ে নেওয়া। দাম বদলাতে পারেন না।")],
          [t("Rider", "রাইডার"), t("Service", "সার্ভিস"), t("Sees the deliveries assigned to them, marks them On the way and Delivered, collects cash for cash-on-delivery orders.", "নিজের অ্যাসাইন হওয়া ডেলিভারি দেখেন, On the way ও Delivered মার্ক করেন, ক্যাশ অন ডেলিভারি অর্ডারের টাকা নেন।")],
          [t("Doctor", "ডাক্তার"), t("Service", "সার্ভিস"), t("Sees appointments at their chambers, marks them completed, no-show or cancelled, opens or closes booking per chamber, edits their profile.", "নিজের চেম্বারের অ্যাপয়েন্টমেন্ট দেখেন, completed, no-show বা cancelled মার্ক করেন, প্রতি চেম্বারে বুকিং চালু বা বন্ধ করেন, প্রোফাইল এডিট করেন।")],
          [t("Service provider", "সার্ভিস প্রোভাইডার"), t("Service", "সার্ভিস"), t("Keeps their All Care listing up to date and switches it live or hidden.", "নিজের অল কেয়ার লিস্টিং আপডেট রাখেন এবং লাইভ বা হাইড করেন।")],
          [t("Customer", "কাস্টমার"), t("Website", "ওয়েবসাইট"), t("Shops, orders, books doctors, saves favourites. Never sees the admin panel.", "কেনাকাটা, অর্ডার, ডাক্তার বুকিং, ফেভারিট সেভ করেন। অ্যাডমিন প্যানেল দেখেন না।")],
        ],
      },
      {
        type: "note",
        tone: "warn",
        text: t(
          "One person can hold several roles, for example merchant owner of two stores. The admin panel shows the menu for all of them together. The API checks every action again, so hiding a button is never the only protection.",
          "একজন একাধিক রোল রাখতে পারেন, যেমন দুইটি দোকানের মার্চেন্ট ওনার। অ্যাডমিন প্যানেল সব রোলের মেনু একসাথে দেখায়। API প্রতিটি কাজ আবার যাচাই করে, তাই শুধু বাটন লুকানোই একমাত্র সুরক্ষা নয়।",
        ),
      },
    ],
  },

  // ------------------------------------------------------------------ 4
  {
    id: "customer",
    title: t("4. Customer journey: website to doorstep", "৪. কাস্টমারের যাত্রা: ওয়েবসাইট থেকে দরজা পর্যন্ত"),
    blocks: [
      {
        type: "steps",
        items: [
          {
            title: t("Set the location", "লোকেশন সেট করা"),
            text: t(
              "The customer picks a district and drops a pin on the map (or lets the browser find them). Store lists, doctors and providers are sorted by distance from this point.",
              "কাস্টমার জেলা বেছে নিয়ে ম্যাপে পিন দেন (অথবা ব্রাউজারকে লোকেশন খুঁজতে দেন)। দোকান, ডাক্তার ও প্রোভাইডারের তালিকা এই জায়গা থেকে দূরত্ব অনুযায়ী সাজানো হয়।",
            ),
          },
          {
            title: t("Choose a module and a store", "মডিউল ও দোকান বেছে নেওয়া"),
            text: t(
              "From the home page they open Grocery, Medicine, Food or Fashion, then a store. They can search, filter by category and save favourites.",
              "হোম পেজ থেকে গ্রোসারি, মেডিসিন, ফুড বা ফ্যাশন খুলে একটি দোকানে যান। সার্চ, ক্যাটাগরি ফিল্টার আর ফেভারিট সেভ করতে পারেন।",
            ),
          },
          {
            title: t("Fill the cart", "কার্টে যোগ করা"),
            text: t(
              "A cart holds items from one store. Adding an item from another store asks before clearing the old cart. The cart is saved in the browser.",
              "একটি কার্টে একটি দোকানের আইটেমই থাকে। অন্য দোকানের আইটেম যোগ করলে পুরোনো কার্ট খালি করার আগে জিজ্ঞেস করে। কার্ট ব্রাউজারে সেভ থাকে।",
            ),
          },
          {
            title: t("Log in", "লগইন"),
            text: t(
              "At checkout the customer logs in with their phone number and a one-time code. New customers add their name once. (Until an SMS provider is connected, the code is shown on screen.)",
              "চেকআউটে কাস্টমার ফোন নম্বর ও ওয়ান-টাইম কোড দিয়ে লগইন করেন। নতুন কাস্টমার একবার নাম দেন। (SMS প্রোভাইডার যুক্ত না হওয়া পর্যন্ত কোডটি স্ক্রিনে দেখানো হয়।)",
            ),
          },
          {
            title: t("Checkout", "চেকআউট"),
            text: t(
              "They confirm the delivery name, address, phone, an extra phone and the map pin, add a note, and choose a payment method: Cash on Delivery, card, bKash, mCash or Nagad.",
              "ডেলিভারির নাম, ঠিকানা, ফোন, বিকল্প ফোন ও ম্যাপ পিন নিশ্চিত করেন, নোট যোগ করেন এবং পেমেন্ট মেথড বেছে নেন: ক্যাশ অন ডেলিভারি, কার্ড, বিকাশ, এমক্যাশ বা নগদ।",
            ),
          },
          {
            title: t("Order placed", "অর্ডার দেওয়া হলো"),
            text: t(
              "The API recalculates every price, discount and delivery charge from the store's current prices, saves the order as Pending and gives it a code such as GRO-20261120-2001.",
              "API দোকানের বর্তমান দাম থেকে প্রতিটি দাম, ডিসকাউন্ট ও ডেলিভারি চার্জ আবার হিসাব করে, অর্ডারটি Pending হিসেবে সেভ করে এবং GRO-20261120-2001 এর মতো একটি কোড দেয়।",
            ),
          },
          {
            title: t("Track and receive", "ট্র্যাক করা ও হাতে পাওয়া"),
            text: t(
              "The customer follows the status under My orders. The rider brings the order, collects cash if needed, and marks it Delivered. The customer can then rate and review it.",
              "কাস্টমার My orders এ স্ট্যাটাস দেখেন। রাইডার অর্ডার পৌঁছে দেন, দরকার হলে ক্যাশ নেন এবং Delivered মার্ক করেন। এরপর কাস্টমার রেটিং ও রিভিউ দিতে পারেন।",
            ),
          },
        ],
      },
      {
        type: "note",
        tone: "info",
        text: t(
          "Card, bKash, mCash and Nagad are recorded with the order today; no online payment gateway is connected yet, so payment is settled on delivery.",
          "কার্ড, বিকাশ, এমক্যাশ ও নগদ এখন অর্ডারের সাথে রেকর্ড হয়; এখনো কোনো অনলাইন পেমেন্ট গেটওয়ে যুক্ত নেই, তাই পেমেন্ট ডেলিভারির সময় নিষ্পত্তি হয়।",
        ),
      },
    ],
  },

  // ------------------------------------------------------------------ 5
  {
    id: "orders",
    title: t("5. Order lifecycle", "৫. অর্ডারের ধাপসমূহ"),
    blocks: [
      {
        type: "flow",
        items: [t("Pending", "Pending (অপেক্ষমাণ)"), t("Accepted", "Accepted (গ্রহণ)"), t("Processing", "Processing (প্রস্তুত হচ্ছে)"), t("On the way", "On the way (পথে)"), t("Delivered", "Delivered (পৌঁছেছে)")],
      },
      {
        type: "p",
        text: t(
          "An order moves one step at a time, only forward. Until it is delivered it can be Cancelled. Delivered and Cancelled are final.",
          "অর্ডার একবারে এক ধাপ করে, শুধু সামনের দিকে এগোয়। ডেলিভারির আগ পর্যন্ত এটি Cancelled করা যায়। Delivered ও Cancelled চূড়ান্ত।",
        ),
      },
      {
        type: "table",
        head: [t("Step", "ধাপ"), t("Who does it", "কে করেন"), t("What it means", "অর্থ")],
        rows: [
          [t("Pending → Accepted", "Pending → Accepted"), t("Store team, admin or support", "স্টোর টিম, অ্যাডমিন বা সাপোর্ট"), t("The store has seen the order and will fill it.", "দোকান অর্ডার দেখেছে এবং প্রস্তুত করবে।")],
          [t("Accepted → Processing", "Accepted → Processing"), t("Store team, admin or support", "স্টোর টিম, অ্যাডমিন বা সাপোর্ট"), t("Items are being picked and packed. Assign a rider now.", "আইটেম বাছাই ও প্যাক করা হচ্ছে। এখনই রাইডার অ্যাসাইন করুন।")],
          [t("Processing → On the way", "Processing → On the way"), t("The assigned rider (or store team / admin)", "অ্যাসাইন করা রাইডার (অথবা স্টোর টিম / অ্যাডমিন)"), t("The rider has picked the order up.", "রাইডার অর্ডার তুলে নিয়েছেন।")],
          [t("On the way → Delivered", "On the way → Delivered"), t("The assigned rider (or store team / admin)", "অ্যাসাইন করা রাইডার (অথবা স্টোর টিম / অ্যাডমিন)"), t("The customer has the order; cash is collected.", "কাস্টমার অর্ডার পেয়েছেন; ক্যাশ নেওয়া হয়েছে।")],
          [t("Any open step → Cancelled", "যেকোনো খোলা ধাপ → Cancelled"), t("Store team, admin or support", "স্টোর টিম, অ্যাডমিন বা সাপোর্ট"), t("Out of stock, customer unreachable or customer request.", "স্টক নেই, কাস্টমারকে পাওয়া যায়নি বা কাস্টমারের অনুরোধ।")],
        ],
      },
      {
        type: "note",
        tone: "warn",
        text: t(
          "The order total is fixed when the order is placed: subtotal − discount + VAT + delivery charge. Changing a price later does not change orders already placed.",
          "অর্ডার দেওয়ার সময়েই মোট টাকা স্থির হয়: সাবটোটাল − ডিসকাউন্ট + ভ্যাট + ডেলিভারি চার্জ। পরে দাম বদলালে আগের অর্ডারে কোনো পরিবর্তন হয় না।",
        ),
      },
    ],
  },

  // ------------------------------------------------------------------ 6
  {
    id: "stores",
    title: t("6. Stores: onboarding and daily work", "৬. দোকান: যুক্ত করা ও প্রতিদিনের কাজ"),
    blocks: [
      { type: "h", text: t("Bringing a new store on board", "নতুন দোকান যুক্ত করা") },
      {
        type: "steps",
        items: [
          { title: t("Admin adds the store", "অ্যাডমিন দোকান যোগ করেন"), text: t("Admin → Stores → Add store: choose the module, enter the store name and, optionally, the owner's mobile number.", "অ্যাডমিন → Stores → Add store: মডিউল বেছে নিন, দোকানের নাম দিন এবং চাইলে ওনারের মোবাইল নম্বর দিন।") },
          { title: t("The owner gets access", "ওনার অ্যাক্সেস পান"), text: t("The owner's number becomes the Merchant owner of that store and gets a one-time setup link to choose a password. Send the link to them privately.", "ওনারের নম্বরটি ঐ দোকানের Merchant owner হয় এবং পাসওয়ার্ড সেট করার জন্য একটি ওয়ান-টাইম সেটআপ লিংক পায়। লিংকটি গোপনে ওনারকে পাঠান।") },
          { title: t("Fill in the store details", "দোকানের তথ্য পূরণ"), text: t("On the store page: address, area, district, map coordinates, phones, opening and closing time, minimum order, delivery charge range, store discount and banners. Tick Active to list it for customers.", "দোকানের পেজে: ঠিকানা, এলাকা, জেলা, ম্যাপ কোঅর্ডিনেট, ফোন, খোলা ও বন্ধের সময়, মিনিমাম অর্ডার, ডেলিভারি চার্জের সীমা, দোকানের ডিসকাউন্ট ও ব্যানার। কাস্টমারদের দেখাতে Active টিক দিন।") },
          { title: t("Owner adds the team", "ওনার টিম যোগ করেন"), text: t("In the Store team box on the store page, the owner adds managers and staff by phone number. Each new person gets their own setup link.", "দোকানের পেজের Store team বক্সে ওনার ফোন নম্বর দিয়ে ম্যানেজার ও স্টাফ যোগ করেন। প্রত্যেক নতুন ব্যক্তি নিজের সেটআপ লিংক পান।") },
          { title: t("Set up items", "আইটেম সেট করা"), text: t("Store → Items: pick products from the shared catalogue, set price, discount and stock, and switch each item available or not.", "Store → Items: কমন ক্যাটালগ থেকে প্রোডাক্ট বেছে নিন, দাম, ডিসকাউন্ট ও স্টক সেট করুন, এবং প্রতিটি আইটেম available কিনা ঠিক করুন।") },
          { title: t("Go live", "লাইভ করা"), text: t("Once the store is Active and not marked Closed right now, customers near it see it and can order.", "দোকান Active থাকলে এবং Closed right now মার্ক করা না থাকলে কাছের কাস্টমাররা দেখতে ও অর্ডার করতে পারেন।") },
        ],
      },
      { type: "h", text: t("A store's day", "দোকানের একটি দিন") },
      {
        type: "list",
        items: [
          t("Open Orders, filter by Pending and accept new orders quickly.", "Orders খুলে Pending ফিল্টার করুন এবং নতুন অর্ডার দ্রুত গ্রহণ করুন।"),
          t("Pack accepted orders, move them to Processing and assign a rider.", "গৃহীত অর্ডার প্যাক করে Processing এ নিন এবং রাইডার অ্যাসাইন করুন।"),
          t("Keep stock and availability right so customers can't order what you don't have.", "স্টক ও অ্যাভেইলেবিলিটি ঠিক রাখুন যাতে কাস্টমার এমন কিছু অর্ডার করতে না পারেন যা নেই।"),
          t("Cancel an order only with a reason, and call the customer first when you can.", "শুধু কারণ থাকলে অর্ডার বাতিল করুন, আর সম্ভব হলে আগে কাস্টমারকে ফোন করুন।"),
          t("Tick Closed right now when you stop taking orders (holiday, rush), and untick it when you are back.", "অর্ডার নেওয়া বন্ধ রাখলে (ছুটি, ভিড়) Closed right now টিক দিন, আবার চালু হলে টিক তুলে দিন।"),
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 7
  {
    id: "delivery",
    title: t("7. Delivery and riders", "৭. ডেলিভারি ও রাইডার"),
    blocks: [
      {
        type: "steps",
        items: [
          { title: t("Assign", "অ্যাসাইন"), text: t("On the order page, the store owner or manager (or admin / support) picks a rider. The list shows how many open deliveries each rider already has.", "অর্ডার পেজে দোকানের ওনার বা ম্যানেজার (অথবা অ্যাডমিন / সাপোর্ট) একজন রাইডার বেছে নেন। তালিকায় দেখা যায় প্রতিটি রাইডারের হাতে কয়টি ডেলিভারি আছে।") },
          { title: t("Pick up", "পিক আপ"), text: t("The rider opens Deliveries in the admin panel, sees the store's address (Pick up from) and the customer's address (Deliver to), and taps On the way after pickup.", "রাইডার অ্যাডমিন প্যানেলে Deliveries খোলেন, দোকানের ঠিকানা (Pick up from) ও কাস্টমারের ঠিকানা (Deliver to) দেখেন, এবং পিকআপের পর On the way চাপেন।") },
          { title: t("Deliver and collect", "ডেলিভারি ও টাকা সংগ্রহ"), text: t("For Cash on Delivery the panel shows the cash to collect. After handing over, the rider taps Delivered.", "ক্যাশ অন ডেলিভারির জন্য প্যানেলে কত টাকা নিতে হবে দেখায়। হাতে দেওয়ার পর রাইডার Delivered চাপেন।") },
          { title: t("History", "হিস্টোরি"), text: t("Finished deliveries move to the history view.", "শেষ হওয়া ডেলিভারি হিস্টোরি ভিউতে চলে যায়।") },
        ],
      },
      {
        type: "note",
        tone: "info",
        text: t(
          "A rider only sees and changes orders assigned to them, and only in the order Processing → On the way → Delivered.",
          "রাইডার শুধু নিজের অ্যাসাইন করা অর্ডার দেখেন ও বদলাতে পারেন, এবং শুধু Processing → On the way → Delivered ক্রমে।",
        ),
      },
    ],
  },

  // ------------------------------------------------------------------ 8
  {
    id: "health",
    title: t("8. Health care: doctors and appointments", "৮. হেলথ কেয়ার: ডাক্তার ও অ্যাপয়েন্টমেন্ট"),
    blocks: [
      {
        type: "steps",
        items: [
          { title: t("Find", "খোঁজা"), text: t("The customer searches doctors by department, centre or name, or opens hospitals, diagnostic, eye and dental centres near them.", "কাস্টমার বিভাগ, সেন্টার বা নাম দিয়ে ডাক্তার খোঁজেন, অথবা কাছের হাসপাতাল, ডায়াগনস্টিক, চক্ষু ও ডেন্টাল সেন্টার দেখেন।") },
          { title: t("Book a serial", "সিরিয়াল বুক করা"), text: t("They choose the doctor's chamber, a date and a time slot, and the patient (themselves or a family member). They get a serial number for that chamber, date and slot. Status: Booked.", "ডাক্তারের চেম্বার, তারিখ, সময় ও রোগী (নিজে বা পরিবারের সদস্য) বেছে নেন। ঐ চেম্বার, তারিখ ও সময়ের জন্য একটি সিরিয়াল নম্বর পান। স্ট্যাটাস: Booked।") },
          { title: t("Doctor's day", "ডাক্তারের দিন"), text: t("The doctor opens Appointments, sees today's serials and marks each patient Completed (Visited), No-show or Cancelled.", "ডাক্তার Appointments খুলে আজকের সিরিয়াল দেখেন এবং প্রতিটি রোগীকে Completed (Visited), No-show বা Cancelled মার্ক করেন।") },
          { title: t("Chambers and profile", "চেম্বার ও প্রোফাইল"), text: t("Under Chambers the doctor can close booking when they can't sit. Under Profile they keep what patients see up to date.", "Chambers এ ডাক্তার বসতে না পারলে বুকিং বন্ধ করতে পারেন। Profile এ রোগীরা যা দেখেন তা আপডেট রাখেন।") },
        ],
      },
      {
        type: "flow",
        items: [t("Booked", "Booked (বুকড)"), t("Visited / No-show / Cancelled", "Visited / No-show / Cancelled")],
      },
      {
        type: "note",
        tone: "info",
        text: t(
          "An admin links a doctor profile to a login under Users & roles, and gives that login the Doctor role.",
          "অ্যাডমিন Users & roles থেকে একটি ডাক্তার প্রোফাইল একটি লগইনের সাথে লিংক করেন এবং ঐ লগইনকে Doctor রোল দেন।",
        ),
      },
    ],
  },

  // ------------------------------------------------------------------ 9
  {
    id: "allcare",
    title: t("9. All Care home services", "৯. অল কেয়ার হোম সার্ভিস"),
    blocks: [
      {
        type: "steps",
        items: [
          { title: t("Browse", "ব্রাউজ"), text: t("The customer opens All Care, picks a service (electrician, tutor, movers…) and sees providers near them.", "কাস্টমার অল কেয়ার খুলে একটি সার্ভিস (ইলেকট্রিশিয়ান, টিউটর, মুভার্স…) বেছে নেন এবং কাছের প্রোভাইডার দেখেন।") },
          { title: t("Contact", "যোগাযোগ"), text: t("On the provider's page they call, message on WhatsApp or send a request. Price and time are agreed directly with the provider.", "প্রোভাইডারের পেজ থেকে কল, হোয়াটসঅ্যাপ মেসেজ বা রিকোয়েস্ট পাঠান। দাম ও সময় সরাসরি প্রোভাইডারের সাথে ঠিক হয়।") },
          { title: t("Provider keeps the listing right", "প্রোভাইডার লিস্টিং ঠিক রাখেন"), text: t("In My service the provider edits the contact person, phone numbers, address, service hours, details and years of experience, and switches the listing live or hidden.", "My service এ প্রোভাইডার কন্টাক্ট পারসন, ফোন নম্বর, ঠিকানা, সার্ভিসের সময়, বিবরণ ও অভিজ্ঞতার বছর এডিট করেন, এবং লিস্টিং লাইভ বা হাইড করেন।") },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 10
  {
    id: "modules",
    title: t("10. Notes for each shop module", "১০. প্রতিটি শপ মডিউলের নোট"),
    blocks: [
      {
        type: "table",
        head: [t("Module", "মডিউল"), t("Things to know", "যা জানা দরকার")],
        rows: [
          [t("Grocery", "গ্রোসারি"), t("Items come from the shared catalogue; each store sets its own price, discount and stock.", "আইটেম কমন ক্যাটালগ থেকে আসে; প্রতিটি দোকান নিজের দাম, ডিসকাউন্ট ও স্টক ঠিক করে।")],
          [t("Medicine", "মেডিসিন"), t("Some medicines show a \"Prescription required\" label. The pharmacy should check the prescription before handing them over.", "কিছু ওষুধে \"Prescription required\" লেবেল থাকে। ফার্মেসি হাতে দেওয়ার আগে প্রেসক্রিপশন দেখে নেবে।")],
          [t("Food", "ফুড"), t("Menu items can have variations (size) and add-ons, each with its own price. Restaurants should keep opening hours exact.", "মেনু আইটেমে ভ্যারিয়েশন (সাইজ) ও অ্যাড-অন থাকতে পারে, প্রতিটির আলাদা দাম। রেস্টুরেন্টের খোলার সময় সঠিক রাখা জরুরি।")],
          [t("Fashion & Lifestyle", "ফ্যাশন ও লাইফস্টাইল"), t("Products have variants (size, colour) with their own photos. Shops are grouped by Men, Women and Kids.", "প্রোডাক্টের ভ্যারিয়েন্ট (সাইজ, রং) আর আলাদা ছবি থাকে। শপ Men, Women ও Kids অনুযায়ী সাজানো।")],
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 11
  {
    id: "platform",
    title: t("11. Running the platform (admin panel)", "১১. প্ল্যাটফর্ম চালানো (অ্যাডমিন প্যানেল)"),
    blocks: [
      {
        type: "table",
        head: [t("Page", "পেজ"), t("Who sees it", "কে দেখেন"), t("Use it to", "কী কাজে লাগে")],
        rows: [
          [t("Dashboard", "ড্যাশবোর্ড"), t("Platform roles, store teams", "প্ল্যাটফর্ম রোল, স্টোর টিম"), t("See orders and revenue in the last 24 hours, open orders and users.", "গত ২৪ ঘণ্টার অর্ডার ও আয়, খোলা অর্ডার আর ইউজার সংখ্যা দেখা।")],
          [t("Orders", "অর্ডার"), t("Admin, support, finance, store teams", "অ্যাডমিন, সাপোর্ট, ফাইন্যান্স, স্টোর টিম"), t("Find orders, open one, move its status, assign a rider.", "অর্ডার খোঁজা, খোলা, স্ট্যাটাস বদলানো, রাইডার অ্যাসাইন করা।")],
          [t("Stores", "দোকান"), t("Platform roles, store teams (own store)", "প্ল্যাটফর্ম রোল, স্টোর টিম (নিজের দোকান)"), t("Add stores, edit settings and hours, manage items.", "দোকান যোগ, সেটিংস ও সময় এডিট, আইটেম ম্যানেজ।")],
          [t("Products", "প্রোডাক্ট"), t("Admin, content manager, support", "অ্যাডমিন, কন্টেন্ট ম্যানেজার, সাপোর্ট"), t("Keep the shared catalogue that stores pick from.", "কমন ক্যাটালগ ঠিক রাখা যেখান থেকে দোকানগুলো আইটেম নেয়।")],
          [t("Users & roles", "ইউজার ও রোল"), t("Admin, support", "অ্যাডমিন, সাপোর্ট"), t("Find anyone by name or phone, give or remove roles, block accounts, link doctor and provider profiles.", "নাম বা ফোন দিয়ে যে কাউকে খোঁজা, রোল দেওয়া বা সরানো, অ্যাকাউন্ট ব্লক, ডাক্তার ও প্রোভাইডার প্রোফাইল লিংক।")],
          [t("Data", "ডাটা"), t("Super admin", "সুপার অ্যাডমিন"), t("Download a backup, restore one, or reset to the default demo data.", "ব্যাকআপ ডাউনলোড, রিস্টোর, অথবা ডিফল্ট ডেমো ডাটায় রিসেট।")],
          [t("Account", "অ্যাকাউন্ট"), t("Everyone", "সবাই"), t("Change your password.", "নিজের পাসওয়ার্ড বদলানো।")],
          [t("Guide", "গাইড"), t("Everyone", "সবাই"), t("This page.", "এই পেজটি।")],
        ],
      },
      { type: "h", text: t("Staff accounts", "স্টাফ অ্যাকাউন্ট") },
      {
        type: "list",
        items: [
          t("Staff sign in at /admin/login with phone number and password.", "স্টাফরা /admin/login এ ফোন নম্বর ও পাসওয়ার্ড দিয়ে লগইন করেন।"),
          t("A new staff member gets a one-time setup link to choose their password.", "নতুন স্টাফ পাসওয়ার্ড সেট করার জন্য একটি ওয়ান-টাইম সেটআপ লিংক পান।"),
          t("The real super admin's phone numbers are set on the server (SUPER_ADMIN_PHONES). Those accounts survive restore and reset.", "আসল সুপার অ্যাডমিনের ফোন নম্বর সার্ভারে সেট করা থাকে (SUPER_ADMIN_PHONES)। ঐ অ্যাকাউন্টগুলো রিস্টোর ও রিসেটের পরেও থেকে যায়।"),
          t("Take a backup from Data before any big change.", "যেকোনো বড় পরিবর্তনের আগে Data থেকে ব্যাকআপ নিন।"),
        ],
      },
      { type: "h", text: t("Panel settings", "প্যানেল সেটিংস") },
      {
        type: "list",
        items: [
          t("Light / dark mode: the moon or sun button in the sidebar (or the top bar on phones). The choice is saved in the browser.", "লাইট / ডার্ক মোড: সাইডবারের (ফোনে উপরের বারের) চাঁদ বা সূর্য বাটন। পছন্দটি ব্রাউজারে সেভ থাকে।"),
          t("Home page: the link in the sidebar or the home icon in the top bar opens the customer website.", "হোম পেজ: সাইডবারের লিংক বা উপরের বারের হোম আইকন কাস্টমার ওয়েবসাইট খোলে।"),
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 12
  {
    id: "daily",
    title: t("12. Daily checklist by role", "১২. রোল অনুযায়ী প্রতিদিনের চেকলিস্ট"),
    blocks: [
      {
        type: "table",
        head: [t("Role", "রোল"), t("Every day", "প্রতিদিন")],
        rows: [
          [t("Admin / support", "অ্যাডমিন / সাপোর্ট"), t("Watch Pending orders older than 15 minutes, call stores that haven't accepted, help customers with stuck orders, check new stores' items.", "১৫ মিনিটের বেশি পুরোনো Pending অর্ডার দেখুন, যে দোকান গ্রহণ করেনি তাদের ফোন করুন, আটকে থাকা অর্ডারে কাস্টমারকে সাহায্য করুন, নতুন দোকানের আইটেম চেক করুন।")],
          [t("Finance", "ফাইন্যান্স"), t("Match delivered cash orders with cash handed in by riders; check revenue per store.", "ডেলিভারড ক্যাশ অর্ডার রাইডারদের জমা দেওয়া টাকার সাথে মেলান; দোকান অনুযায়ী আয় দেখুন।")],
          [t("Content manager", "কন্টেন্ট ম্যানেজার"), t("Fix wrong names, photos and categories; add products stores ask for.", "ভুল নাম, ছবি ও ক্যাটাগরি ঠিক করুন; দোকানগুলো যেসব প্রোডাক্ট চায় তা যোগ করুন।")],
          [t("Store team", "স্টোর টিম"), t("Accept orders fast, keep stock right, assign riders, close the store on time.", "দ্রুত অর্ডার গ্রহণ করুন, স্টক ঠিক রাখুন, রাইডার অ্যাসাইন করুন, সময়মতো দোকান বন্ধ করুন।")],
          [t("Rider", "রাইডার"), t("Check Deliveries, mark On the way at pickup and Delivered at the door, hand in cash.", "Deliveries দেখুন, পিকআপে On the way এবং দরজায় Delivered মার্ক করুন, ক্যাশ জমা দিন।")],
          [t("Doctor", "ডাক্তার"), t("Check today's serials, mark each patient, close booking for days off.", "আজকের সিরিয়াল দেখুন, প্রতিটি রোগী মার্ক করুন, ছুটির দিনে বুকিং বন্ধ করুন।")],
          [t("Service provider", "সার্ভিস প্রোভাইডার"), t("Keep phone numbers right; hide the listing when unavailable.", "ফোন নম্বর সঠিক রাখুন; ব্যস্ত থাকলে লিস্টিং হাইড করুন।")],
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 13
  {
    id: "demo",
    title: t("13. Demo accounts and testing", "১৩. ডেমো অ্যাকাউন্ট ও টেস্টিং"),
    blocks: [
      {
        type: "list",
        items: [
          t("Every role has a demo login: phone 01700000001 to 01700000014, password Demo@1234. The full list is on the Demo accounts page.", "প্রতিটি রোলের একটি ডেমো লগইন আছে: ফোন 01700000001 থেকে 01700000014, পাসওয়ার্ড Demo@1234। পুরো তালিকা Demo accounts পেজে।"),
          t("Customers can use \"Log in as Demo User\" in the login popup; no code needed.", "কাস্টমাররা লগইন পপআপে \"Log in as Demo User\" ব্যবহার করতে পারেন; কোনো কোড লাগে না।"),
          t("Demo passwords can't be changed and are reset on every deploy.", "ডেমো পাসওয়ার্ড বদলানো যায় না এবং প্রতিটি ডিপ্লয়ে রিসেট হয়।"),
          t("Try a full order: log in as Demo User, order from the demo grocery store, then accept it as the grocery owner (01700000006), assign the demo rider, and deliver it as the rider (01700000012).", "একটি পুরো অর্ডার চেষ্টা করুন: Demo User হিসেবে লগইন করে ডেমো গ্রোসারি থেকে অর্ডার দিন, তারপর গ্রোসারি ওনার (01700000006) হিসেবে গ্রহণ করুন, ডেমো রাইডার অ্যাসাইন করুন, এবং রাইডার (01700000012) হিসেবে ডেলিভার করুন।"),
        ],
      },
      {
        type: "links",
        items: [
          { label: t("Demo accounts", "ডেমো অ্যাকাউন্ট"), href: "/demo-accounts" },
          { label: t("Staff login", "স্টাফ লগইন"), href: "/admin/login" },
        ],
      },
    ],
  },

  // ------------------------------------------------------------------ 14
  {
    id: "faq",
    title: t("14. Common questions", "১৪. সাধারণ প্রশ্ন"),
    blocks: [
      {
        type: "faq",
        items: [
          {
            q: t("A customer says the store is missing.", "কাস্টমার বলছেন দোকান দেখা যাচ্ছে না।"),
            a: t("Check their location pin and district first; stores are shown by distance. Then check that the store is active and open now.", "আগে তার লোকেশন পিন ও জেলা চেক করুন; দোকান দূরত্ব অনুযায়ী দেখানো হয়। তারপর দেখুন দোকানটি active ও এখন খোলা কিনা।"),
          },
          {
            q: t("I can't move an order to the status I want.", "অর্ডার আমার পছন্দের স্ট্যাটাসে নিতে পারছি না।"),
            a: t("Orders only move one step forward. Delivered and Cancelled orders can't change.", "অর্ডার শুধু এক ধাপ সামনে এগোয়। Delivered ও Cancelled অর্ডার আর বদলানো যায় না।"),
          },
          {
            q: t("A staff member forgot their password.", "একজন স্টাফ পাসওয়ার্ড ভুলে গেছেন।"),
            a: t("An admin can make a fresh setup link from Users & roles (a store owner can do it from the Store team box). Any older link stops working.", "অ্যাডমিন Users & roles থেকে নতুন সেটআপ লিংক তৈরি করতে পারেন (দোকানের ওনার Store team বক্স থেকে)। আগের লিংক আর কাজ করে না।"),
          },
          {
            q: t("The website shows a demo banner.", "ওয়েবসাইটে ডেমো ব্যানার দেখাচ্ছে।"),
            a: t("The API is unreachable right now, or someone turned on Demo mode from the home page switch. Orders placed in demo mode are not saved on the server.", "এই মুহূর্তে API তে পৌঁছানো যাচ্ছে না, অথবা কেউ হোম পেজের সুইচ থেকে Demo mode চালু করেছেন। ডেমো মোডে দেওয়া অর্ডার সার্ভারে সেভ হয় না।"),
          },
          {
            q: t("How do I switch the guide's language?", "গাইডের ভাষা কীভাবে বদলাব?"),
            a: t("Use the English / বাংলা switch at the top. English is the default and your choice is remembered.", "উপরের English / বাংলা সুইচ ব্যবহার করুন। ডিফল্ট ইংরেজি, আর আপনার পছন্দ মনে রাখা হয়।"),
          },
        ],
      },
    ],
  },
];
