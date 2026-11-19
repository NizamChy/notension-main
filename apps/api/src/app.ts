import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import type { Db } from "./db/client";
import { groceryRoutes } from "./modules/store/grocery";

export function createApp(db: Db, opts: { corsOrigins?: string[]; log?: boolean } = {}) {
  const app = new Hono();
  if (opts.log) app.use(logger());
  app.use("*", cors({ origin: opts.corsOrigins ?? [], credentials: true }));

  app.get("/health", (c) => c.json({ ok: true }));
  app.route("/", groceryRoutes(db));

  app.notFound((c) => c.json({ success: false, message: "Not found" }, 404));
  app.onError((err, c) => {
    console.error(err);
    return c.json({ success: false, message: "Something went wrong" }, 500);
  });
  return app;
}

export type App = ReturnType<typeof createApp>;
