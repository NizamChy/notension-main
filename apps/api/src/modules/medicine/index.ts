// Everything the web app's MEDICINE service calls.
import { Hono } from "hono";
import type { AuthEnv } from "../../auth/middleware";
import type { Db } from "../../db/client";
import { medicineCatalogRoutes } from "./medicine";
import { medicineOrderRoutes } from "./medicine-orders";

export const medicineRoutes = (db: Db) =>
  new Hono<AuthEnv>().route("/", medicineCatalogRoutes(db)).route("/", medicineOrderRoutes(db));
