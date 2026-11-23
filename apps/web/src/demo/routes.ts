import { routes as user } from "./modules/user";
import { routes as food } from "./modules/food";
import { routes as grocery } from "./modules/grocery";
import { routes as allCare } from "./modules/allCare";
import { routes as fashion } from "./modules/fashion";
import { routes as medicine } from "./modules/medicine";
import { routes as healthCare } from "./modules/healthCare";

export const DEMO_ROUTES = [
  ...user,
  ...food,
  ...grocery,
  ...medicine,
  ...healthCare,
  ...allCare,
  ...fashion,
];
