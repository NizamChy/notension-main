import {
  LuApple,
  LuBaby,
  LuBadgePercent,
  LuBandage,
  LuBeef,
  LuCarrot,
  LuCookie,
  LuCroissant,
  LuCupSoda,
  LuDroplet,
  LuFish,
  LuFlame,
  LuFlower2,
  LuHeartPulse,
  LuLeaf,
  LuMilk,
  LuPill,
  LuPillBottle,
  LuShoppingBasket,
  LuSparkles,
  LuSprayCan,
  LuStethoscope,
  LuWheat,
  LuZap,
} from "react-icons/lu";

// Sidebar icon for a grocery / medicine category, picked from its name so the
// picture always matches the label (the backend sends no usable icon).
// Rules are checked in order; the first match wins. Class strings are written
// out in full so Tailwind keeps them. No bg-yellow-*: globals.css forces dark
// text on those in dark mode.
const RULES = [
  // Custom (promo) categories
  [/offer|discount/, LuBadgePercent, "bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400"],
  [/deal/, LuZap, "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400"],
  [/popular|best ?sell|trending/, LuFlame, "bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400"],

  // Grocery
  [/rice|grain|flour|atta|lentil|\bdal\b/, LuWheat, "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"],
  [/oil|ghee/, LuDroplet, "bg-amber-50 text-yellow-600 dark:bg-amber-500/15 dark:text-yellow-400"],
  [/vegetable/, LuCarrot, "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400"],
  [/fruit/, LuApple, "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400"],
  [/dairy|milk|egg/, LuMilk, "bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400"],
  [/meat|chicken|beef|mutton/, LuBeef, "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-400"],
  [/fish|seafood/, LuFish, "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400"],
  [/bakery|bread|cake/, LuCroissant, "bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400"],
  [/snack|biscuit|chips|chanachur|noodle/, LuCookie, "bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400"],
  [/beverage|drink|juice|tea|coffee/, LuCupSoda, "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400"],
  [/household|clean|laundry|detergent/, LuSprayCan, "bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400"],

  // Medicine
  [/chronic|heart|diabet|pressure/, LuHeartPulse, "bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400"],
  [/child|kid|pediatric/, LuPillBottle, "bg-teal-50 text-teal-600 dark:bg-teal-500/15 dark:text-teal-400"],
  [/vitamin|supplement|herbal/, LuLeaf, "bg-lime-50 text-lime-700 dark:bg-lime-500/15 dark:text-lime-400"],
  [/first aid|eye|ear|wound/, LuBandage, "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400"],
  [/device|equipment|monitor/, LuStethoscope, "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400"],
  [/women|feminine|mother/, LuFlower2, "bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-500/15 dark:text-fuchsia-400"],
  [/baby|infant/, LuBaby, "bg-pink-50 text-pink-600 dark:bg-pink-500/15 dark:text-pink-400"],
  [/personal care|beauty|skin|hygiene|cosmetic/, LuSparkles, "bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400"],
  [/medicine|pharma|tablet|drug/, LuPill, "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"],
];

const FALLBACK = {
  Icon: LuShoppingBasket,
  tone: "bg-gray-100 text-gray-500",
};

export const getCategoryIcon = (name = "") => {
  const key = name.toLowerCase();
  const rule = RULES.find(([pattern]) => pattern.test(key));
  return rule ? { Icon: rule[1], tone: rule[2] } : FALLBACK;
};
