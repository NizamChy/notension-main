import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import type { Auth } from "./auth/auth";
import { sessionLoader, type AuthEnv } from "./auth/middleware";
import type { Db } from "./db/client";
import { adminRoutes } from "./modules/admin/routes";
import { customerRoutes } from "./modules/customer/customer";
import { medicineRoutes } from "./modules/medicine";
import { groceryRoutes } from "./modules/store/grocery";
import { groceryOrderRoutes } from "./modules/store/grocery-orders";

export type AppOptions = {
  auth: Auth;
  corsOrigins?: string[];
  log?: boolean;
  smsEnabled?: boolean;
  demoLogin?: boolean;
};

export function createApp(db: Db, opts: AppOptions) {
  const app = new Hono<AuthEnv>();
  if (opts.log) app.use(logger());
  app.use("*", cors({ origin: opts.corsOrigins ?? [], credentials: true }));

  app.get("/health", (c) => c.json({ ok: true }));
  // Better Auth's own endpoints (sign-in, session, sign-out, ...).
  app.on(["GET", "POST"], "/api/auth/*", (c) => opts.auth.auth.handler(c.req.raw));

  app.use("*", sessionLoader(opts.auth));
  app.route("/", adminRoutes(db, opts.auth));
  app.route("/", groceryRoutes(db));
  app.route("/", groceryOrderRoutes(db));
  app.route("/", medicineRoutes(db));
  app.route(
    "/",
    customerRoutes(db, opts.auth, { demoLogin: opts.demoLogin ?? false, smsEnabled: opts.smsEnabled ?? false }),
  );

  app.notFound((c) => c.json({ success: false, message: "Not found" }, 404));
  app.onError((err, c) => {
    console.error(err);
    return c.json({ success: false, message: "Something went wrong" }, 500);
  });
  return app;
}

export type App = ReturnType<typeof createApp>;
