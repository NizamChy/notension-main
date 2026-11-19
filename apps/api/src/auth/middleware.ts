// Session and role checks for Hono routes.
//
//   app.use(sessionLoader(auth))                 // every request: c.var.user or null
//   app.get("/x", requireUser, handler)          // 401 without a session
//   app.get("/y", requireRole(db, ["admin"]), h) // 403 without the role
//   requireRole(db, ["merchant_manager"], { store: (c) => c.req.param("storeId") })
//
// super_admin passes every role check.
import { and, eq, isNull, or } from "drizzle-orm";
import type { Context, MiddlewareHandler } from "hono";
import { createMiddleware } from "hono/factory";
import type { Db } from "../db/client";
import { userRole, type Role } from "../db/schema";
import type { Auth } from "./auth";

type Session = NonNullable<Awaited<ReturnType<Auth["auth"]["api"]["getSession"]>>>;

export type AuthVars = {
  user: Session["user"] | null;
  session: Session["session"] | null;
};

export type AuthEnv = { Variables: AuthVars };

export const sessionLoader = ({ auth }: Auth): MiddlewareHandler<AuthEnv> =>
  createMiddleware<AuthEnv>(async (c, next) => {
    const found = await auth.api.getSession({ headers: c.req.raw.headers });
    c.set("user", found?.user ?? null);
    c.set("session", found?.session ?? null);
    await next();
  });

const unauthorized = (c: Context) => c.json({ success: false, message: "Please log in first" }, 401);

export const requireUser = createMiddleware<AuthEnv>(async (c, next) => {
  if (!c.get("user")) return unauthorized(c);
  await next();
});

export async function userRoles(db: Db, userId: string) {
  return db.select({ role: userRole.role, storeId: userRole.storeId }).from(userRole).where(eq(userRole.userId, userId));
}

export async function hasRole(db: Db, userId: string, roles: readonly Role[], storeId?: string | null) {
  const held = await db
    .select({ role: userRole.role })
    .from(userRole)
    .where(
      and(
        eq(userRole.userId, userId),
        or(
          eq(userRole.role, "super_admin"),
          and(
            or(...roles.map((r) => eq(userRole.role, r))),
            // Global roles (store_id null) count everywhere; store roles only
            // for their own store.
            storeId ? or(isNull(userRole.storeId), eq(userRole.storeId, storeId)) : undefined,
          ),
        ),
      ),
    )
    .limit(1);
  return held.length > 0;
}

export const requireRole = (
  db: Db,
  roles: readonly Role[],
  opts: { store?: (c: Context<AuthEnv>) => string | undefined | null } = {},
) =>
  createMiddleware<AuthEnv>(async (c, next) => {
    const current = c.get("user");
    if (!current) return unauthorized(c);
    if (!(await hasRole(db, current.id, roles, opts.store?.(c)))) {
      return c.json({ success: false, message: "You don't have access to this" }, 403);
    }
    await next();
  });
