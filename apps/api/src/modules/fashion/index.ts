// Fashion & lifestyle (web service FASHION): catalogue reads and orders.
import { Hono } from "hono";
import type { AuthEnv } from "../../auth/middleware";
import type { Db } from "../../db/client";
import { fashionCatalogRoutes } from "./fashion";
import { fashionOrderRoutes } from "./fashion-orders";

export const fashionRoutes = (db: Db) =>
  new Hono<AuthEnv>().route("/", fashionCatalogRoutes(db)).route("/", fashionOrderRoutes(db));
