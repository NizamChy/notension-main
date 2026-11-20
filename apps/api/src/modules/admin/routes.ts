// Admin + merchant panel API: /api/v1/admin/*. Every route needs a staff
// session (see access.ts for who may do what); merchants only ever see their
// own stores.
import { zValidator } from "@hono/zod-validator";
import { and, asc, count, desc, eq, getTableColumns, gte, ilike, inArray, ne, or, sql, sum, type SQL } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import type { Auth } from "../../auth/auth";
import { normalizeBdPhone } from "../../auth/sms";
import type { Db } from "../../db/client";
import {
  customers,
  districts,
  orderItems,
  orders,
  ORDER_STATUSES,
  products,
  productSubtypes,
  productTypes,
  ROLES,
  session,
  storeItems,
  stores,
  STORE_ROLES,
  user,
  userRole,
  type Role,
} from "../../db/schema";
import {
  canManageRole,
  canStore,
  forbidden,
  hasGlobal,
  isStaff,
  loadAccess,
  MERCHANT_ALL,
  MERCHANT_EDIT,
  visibleStores,
  type AdminEnv,
} from "./access";
import { checkSetupToken, consumeSetupToken, createSetupLink, ensureUser, grantRole, hasPassword, searchPattern, setPassword } from "./staff";

const P = "/api/v1/admin";
const MODULES = ["grocery", "medicine", "food", "fashion"] as const;
const page = z.coerce.number().int().min(1).catch(1).default(1);
const PAGE = 25;

const password = z.string().min(8, "Use at least 8 characters").max(128);

const withCookies = (c: { header: (k: string, v: string, o?: { append?: boolean }) => void }, headers?: Headers) => {
  for (const cookie of headers?.getSetCookie?.() ?? []) c.header("Set-Cookie", cookie, { append: true });
};

// ------------------------------------------------------------- serializers

const { location: _location, ...storeCols } = getTableColumns(stores);

const orderSummary = {
  id: orders.id,
  code: orders.code,
  module: orders.module,
  status: orders.status,
  total: orders.total,
  subtotal: orders.subtotal,
  deliveryCharge: orders.deliveryCharge,
  vat: orders.vat,
  discount: orders.discount,
  paymentMethod: orders.paymentMethod,
  note: orders.note,
  delivery: orders.delivery,
  createdAt: orders.createdAt,
  updatedAt: orders.updatedAt,
  storeId: orders.storeId,
  storeName: stores.name,
  customerId: orders.customerId,
  customerName: user.name,
  customerPhone: user.phoneNumber,
};

// Order status can only move forward; anything not delivered can be cancelled.
const NEXT_STATUS: Record<string, string[]> = {
  Pending: ["Accepted", "Cancelled"],
  Accepted: ["Processing", "Cancelled"],
  Processing: ["On the way", "Cancelled"],
  "On the way": ["Delivered", "Cancelled"],
  Delivered: [],
  Cancelled: [],
};

async function meResult(db: Db, userId: string) {
  const [u] = await db
    .select({ id: user.id, name: user.name, phone: user.phoneNumber })
    .from(user)
    .where(eq(user.id, userId));
  const roles = await db
    .select({ role: userRole.role, storeId: userRole.storeId, storeName: stores.name, module: stores.module })
    .from(userRole)
    .leftJoin(stores, eq(stores.id, userRole.storeId))
    .where(and(eq(userRole.userId, userId), ne(userRole.role, "customer")));
  return { ...u, roles };
}

export const adminRoutes = (db: Db, authSetup: Auth) => {
  const { auth } = authSetup;

  const app = new Hono<AdminEnv>();

  // ------------------------------------------------------ sign-in (public)

  app.post(
    `${P}/login`,
    zValidator("json", z.object({ phone: z.string(), password: z.string().min(1).max(128) })),
    async (c) => {
      const body = c.req.valid("json");
      const phone = normalizeBdPhone(body.phone);
      const fail = () => c.json({ success: false, message: "Wrong phone number or password" }, 401);
      if (!phone) return fail();
      const [u] = await db.select({ id: user.id, banned: user.banned }).from(user).where(eq(user.phoneNumber, phone));
      if (!u) return fail();
      if (u.banned) return c.json({ success: false, message: "This account is blocked" }, 403);
      if (!isStaff(await loadAccess(db, u.id))) return fail();
      try {
        const { headers } = await auth.api.signInPhoneNumber({
          body: { phoneNumber: phone, password: body.password },
          headers: c.req.raw.headers,
          returnHeaders: true,
        });
        withCookies(c, headers);
      } catch {
        return fail();
      }
      return c.json({ success: true, result: await meResult(db, u.id) });
    },
  );

  // Who a setup link is for (so the page can greet them).
  app.get(`${P}/setup`, async (c) => {
    const userId = await checkSetupToken(db, c.req.query("token") ?? "");
    if (!userId) return c.json({ success: false, message: "This link has expired or was already used" }, 400);
    const [u] = await db.select({ name: user.name, phone: user.phoneNumber }).from(user).where(eq(user.id, userId));
    return c.json({ success: true, result: u });
  });

  app.post(`${P}/setup`, zValidator("json", z.object({ token: z.string(), password })), async (c) => {
    const body = c.req.valid("json");
    const userId = await checkSetupToken(db, body.token);
    if (!userId) return c.json({ success: false, message: "This link has expired or was already used" }, 400);
    await setPassword(db, authSetup, userId, body.password);
    await consumeSetupToken(db, userId);
    const [u] = await db.select({ phone: user.phoneNumber }).from(user).where(eq(user.id, userId));
    const { headers } = await auth.api.signInPhoneNumber({
      body: { phoneNumber: u!.phone!, password: body.password },
      headers: c.req.raw.headers,
      returnHeaders: true,
    });
    withCookies(c, headers);
    return c.json({ success: true, result: await meResult(db, userId) });
  });

  // ---------------------------------------------------- staff-only from here

  app.use(`${P}/*`, async (c, next) => {
    const current = c.get("user");
    if (!current) return c.json({ success: false, message: "Please log in first" }, 401);
    const access = await loadAccess(db, current.id);
    if (!isStaff(access)) return forbidden(c);
    c.set("access", access);
    await next();
  });

  app.get(`${P}/me`, async (c) => c.json({ success: true, result: await meResult(db, c.get("access").userId) }));

  app.post(`${P}/logout`, async (c) => {
    const { headers } = await auth.api.signOut({ headers: c.req.raw.headers, returnHeaders: true });
    withCookies(c, headers);
    return c.json({ success: true });
  });

  app.post(
    `${P}/password`,
    zValidator("json", z.object({ current: z.string().min(1), next: password })),
    async (c) => {
      const a = c.get("access");
      const body = c.req.valid("json");
      const [u] = await db.select({ phone: user.phoneNumber }).from(user).where(eq(user.id, a.userId));
      try {
        await auth.api.signInPhoneNumber({ body: { phoneNumber: u!.phone!, password: body.current } });
      } catch {
        return c.json({ success: false, message: "Current password is wrong" }, 400);
      }
      await setPassword(db, authSetup, a.userId, body.next); // also ends all sessions
      const { headers } = await auth.api.signInPhoneNumber({
        body: { phoneNumber: u!.phone!, password: body.next },
        headers: c.req.raw.headers,
        returnHeaders: true,
      });
      withCookies(c, headers);
      return c.json({ success: true, message: "Password changed" });
    },
  );

  // ------------------------------------------------------------- dashboard

  app.get(`${P}/stats`, async (c) => {
    const a = c.get("access");
    const scope = visibleStores(a, ["admin", "support", "finance", "content_manager"]);
    const storeFilter = scope ? (scope.length ? inArray(orders.storeId, scope) : sql`false`) : undefined;
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const byStatus = await db
      .select({ status: orders.status, n: count(), total: sum(orders.total) })
      .from(orders)
      .where(storeFilter)
      .groupBy(orders.status);
    const [today] = await db
      .select({ n: count(), total: sum(orders.total) })
      .from(orders)
      .where(and(storeFilter, gte(orders.createdAt, since), ne(orders.status, "Cancelled")));
    const byModule = await db
      .select({ module: orders.module, n: count(), total: sum(orders.total) })
      .from(orders)
      .where(and(storeFilter, ne(orders.status, "Cancelled")))
      .groupBy(orders.module);

    const result: Record<string, unknown> = {
      ordersByStatus: byStatus.map((r) => ({ ...r, total: Number(r.total ?? 0) })),
      ordersByModule: byModule.map((r) => ({ ...r, total: Number(r.total ?? 0) })),
      last24h: { orders: today?.n ?? 0, revenue: Number(today?.total ?? 0) },
    };
    if (!scope) {
      const [users] = await db.select({ n: count() }).from(user);
      const [storeCount] = await db.select({ n: count() }).from(stores);
      result.users = users?.n ?? 0;
      result.stores = storeCount?.n ?? 0;
    } else {
      result.stores = scope.length;
    }
    return c.json({ success: true, result });
  });

  // ---------------------------------------------------------------- stores

  app.get(`${P}/districts`, async (c) => {
    const rows = await db.select({ id: districts.id, name: districts.name, nameBn: districts.nameBn }).from(districts).orderBy(asc(districts.name));
    return c.json({ success: true, result: rows });
  });

  app.get(
    `${P}/stores`,
    zValidator("query", z.object({ module: z.enum(MODULES).optional(), q: z.string().optional(), page })),
    async (c) => {
      const a = c.get("access");
      const q = c.req.valid("query");
      const scope = visibleStores(a, ["admin", "support", "finance", "content_manager"]);
      if (scope && !scope.length) return c.json({ success: true, result: [], total: 0 });
      const where = and(
        scope ? inArray(stores.id, scope) : undefined,
        q.module ? eq(stores.module, q.module) : undefined,
        q.q ? or(ilike(stores.name, searchPattern(q.q)), ilike(stores.code, searchPattern(q.q))) : undefined,
      );
      const [total] = await db.select({ n: count() }).from(stores).where(where);
      const rows = await db
        .select({ ...storeCols, districtName: districts.name })
        .from(stores)
        .leftJoin(districts, eq(districts.id, stores.districtId))
        .where(where)
        .orderBy(asc(stores.module), asc(stores.name))
        .limit(PAGE)
        .offset((q.page - 1) * PAGE);
      return c.json({ success: true, result: rows, total: total?.n ?? 0, pageSize: PAGE });
    },
  );

  app.get(`${P}/stores/:id`, async (c) => {
    const id = c.req.param("id");
    if (!canStore(c.get("access"), id, ["admin", "support", "finance", "content_manager"], MERCHANT_ALL)) return forbidden(c);
    const [row] = await db
      .select({ ...storeCols, districtName: districts.name })
      .from(stores)
      .leftJoin(districts, eq(districts.id, stores.districtId))
      .where(eq(stores.id, id));
    if (!row) return c.json({ success: false, message: "Store not found" }, 404);
    const staff = await db
      .select({ id: userRole.id, role: userRole.role, userId: user.id, name: user.name, phone: user.phoneNumber })
      .from(userRole)
      .innerJoin(user, eq(user.id, userRole.userId))
      .where(eq(userRole.storeId, id));
    return c.json({ success: true, result: { ...row, staff } });
  });

  const money = z.coerce.number().min(0).max(1_000_000);
  // Hours are stored the way the customer pages show them ("08:00 AM").
  // Accepts that form or 24-hour "20:30".
  const time = z
    .string()
    .trim()
    .transform((s, ctx) => {
      const m = s.match(/^(\d{1,2}):(\d{2})(?:\s*([AaPp])[Mm])?$/);
      let h = m ? Number(m[1]) : NaN;
      const min = m ? Number(m[2]) : NaN;
      const ampm = m?.[3]?.toUpperCase();
      if (!m || min > 59 || (ampm ? h < 1 || h > 12 : h > 23)) {
        ctx.addIssue({ code: "custom", message: "Use a time like 09:00 AM or 21:30" });
        return z.NEVER;
      }
      if (ampm) h = (h % 12) + (ampm === "P" ? 12 : 0);
      const h12 = h % 12 || 12;
      return `${String(h12).padStart(2, "0")}:${String(min).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
    })
    .nullable();
  // Fields merchants may change on their own store.
  const merchantStoreFields = z.object({
    isClosed: z.boolean(),
    deliveryNotice: z.string().max(300),
    opensAt: time,
    closesAt: time,
    phone: z.string().max(20),
    altPhone: z.string().max(20),
    minOrder: money,
    minDeliveryCharge: money,
    maxDeliveryCharge: money,
    discount: money,
    discountType: z.enum(["percent", "flat"]),
    maxDiscount: money,
    minOrderForDiscount: money,
    bannerApp: z.string().max(300).nullable(),
    bannerWeb: z.string().max(300).nullable(),
  });
  const adminStoreFields = merchantStoreFields.extend({
    name: z.string().trim().min(2).max(120),
    address: z.string().trim().min(3).max(300),
    areaName: z.string().max(120).nullable(),
    districtId: z.string().min(1),
    latitude: z.coerce.number().min(-90).max(90),
    longitude: z.coerce.number().min(-180).max(180),
    isActive: z.boolean(),
    isBanned: z.boolean(),
    showPrice: z.boolean(),
  });

  app.patch(`${P}/stores/:id`, async (c) => {
    const a = c.get("access");
    const id = c.req.param("id");
    const isAdmin = hasGlobal(a, ["admin"]);
    if (!isAdmin && !canStore(a, id, [], MERCHANT_EDIT)) return forbidden(c);
    const parsed = (isAdmin ? adminStoreFields : merchantStoreFields).partial().strict().safeParse(await c.req.json());
    if (!parsed.success) return c.json({ success: false, message: parsed.error.issues[0]?.message ?? "Invalid data" }, 400);
    const [row] = await db.update(stores).set(parsed.data).where(eq(stores.id, id)).returning({ id: stores.id });
    if (!row) return c.json({ success: false, message: "Store not found" }, 404);
    return c.json({ success: true, message: "Store saved" });
  });

  const PREFIX: Record<(typeof MODULES)[number], string> = { grocery: "GS", medicine: "MS", food: "FS", fashion: "FA" };

  app.post(
    `${P}/stores`,
    zValidator("json", adminStoreFields.partial().required({ name: true, address: true, districtId: true, latitude: true, longitude: true }).extend({ module: z.enum(MODULES), ownerPhone: z.string().optional() })),
    async (c) => {
      const a = c.get("access");
      if (!hasGlobal(a, ["admin"])) return forbidden(c);
      const { module, ownerPhone, ...fields } = c.req.valid("json");
      const owner = ownerPhone ? normalizeBdPhone(ownerPhone) : null;
      if (ownerPhone && !owner) return c.json({ success: false, message: "Owner phone is not a valid number" }, 400);
      const code = `${PREFIX[module]}${String(Date.now()).slice(-6)}${Math.floor(Math.random() * 10)}`;
      const [created] = await db
        .insert(stores)
        .values({ module, code, phone: "", altPhone: "", deliveryNotice: "", ...fields })
        .returning({ id: stores.id, code: stores.code });
      let setupLink: string | null = null;
      if (owner) {
        const u = await ensureUser(db, owner, "Store owner");
        await grantRole(db, u.id, "merchant_owner", created!.id, a.userId);
        if (!(await hasPassword(db, u.id))) setupLink = await createSetupLink(db, u.id, webUrlOf(c));
      }
      return c.json({ success: true, result: { ...created, setupLink } });
    },
  );

  // ----------------------------------------------------------- store items

  app.get(
    `${P}/stores/:id/items`,
    zValidator("query", z.object({ q: z.string().optional(), page })),
    async (c) => {
      const id = c.req.param("id");
      if (!canStore(c.get("access"), id, ["admin", "support", "content_manager"], MERCHANT_ALL)) return forbidden(c);
      const q = c.req.valid("query");
      const where = and(
        eq(storeItems.storeId, id),
        q.q ? or(ilike(products.titleEn, searchPattern(q.q)), ilike(products.titleBn, searchPattern(q.q))) : undefined,
      );
      const [total] = await db
        .select({ n: count() })
        .from(storeItems)
        .innerJoin(products, eq(products.id, storeItems.productId))
        .where(where);
      const rows = await db
        .select({
          id: storeItems.id,
          productId: products.id,
          titleEn: products.titleEn,
          titleBn: products.titleBn,
          packSize: products.packSize,
          unit: products.unit,
          image: products.image,
          salePrice: storeItems.salePrice,
          purchasePrice: storeItems.purchasePrice,
          mrp: storeItems.mrp,
          stockQty: storeItems.stockQty,
          isAvailable: storeItems.isAvailable,
          maxPerOrder: storeItems.maxPerOrder,
          discount: storeItems.discount,
          discountType: storeItems.discountType,
        })
        .from(storeItems)
        .innerJoin(products, eq(products.id, storeItems.productId))
        .where(where)
        .orderBy(asc(storeItems.position), asc(products.titleEn))
        .limit(PAGE)
        .offset((q.page - 1) * PAGE);
      return c.json({ success: true, result: rows, total: total?.n ?? 0, pageSize: PAGE });
    },
  );

  const stockFields = z.object({ stockQty: z.coerce.number().int().min(0).max(1_000_000), isAvailable: z.boolean() });
  const priceFields = stockFields.extend({
    salePrice: money,
    purchasePrice: money,
    mrp: money,
    maxPerOrder: z.coerce.number().int().min(0).max(10_000),
    discount: money,
    discountType: z.enum(["percent", "flat"]),
  });

  app.patch(`${P}/items/:id`, async (c) => {
    const a = c.get("access");
    const [item] = await db.select({ storeId: storeItems.storeId }).from(storeItems).where(eq(storeItems.id, c.req.param("id")));
    if (!item) return c.json({ success: false, message: "Item not found" }, 404);
    const full = canStore(a, item.storeId, ["admin"], MERCHANT_EDIT);
    if (!full && !canStore(a, item.storeId, [], ["merchant_staff"])) return forbidden(c);
    const parsed = (full ? priceFields : stockFields).partial().strict().safeParse(await c.req.json());
    if (!parsed.success) return c.json({ success: false, message: parsed.error.issues[0]?.message ?? "Invalid data" }, 400);
    await db.update(storeItems).set(parsed.data).where(eq(storeItems.id, c.req.param("id")));
    return c.json({ success: true, message: "Item saved" });
  });

  app.post(
    `${P}/stores/:id/items`,
    zValidator("json", priceFields.partial().extend({ productId: z.string().min(1) })),
    async (c) => {
      const a = c.get("access");
      const storeId = c.req.param("id");
      if (!canStore(a, storeId, ["admin"], MERCHANT_EDIT)) return forbidden(c);
      const body = c.req.valid("json");
      const [store] = await db.select({ module: stores.module }).from(stores).where(eq(stores.id, storeId));
      const [product] = await db.select().from(products).where(eq(products.id, body.productId));
      if (!store || !product) return c.json({ success: false, message: "Store or product not found" }, 404);
      if (store.module !== product.module) return c.json({ success: false, message: "Product is from another module" }, 400);
      const created = await db
        .insert(storeItems)
        .values({
          storeId,
          productId: product.id,
          salePrice: body.salePrice ?? product.mrp,
          purchasePrice: body.purchasePrice ?? 0,
          mrp: body.mrp ?? product.mrp,
          stockQty: body.stockQty ?? 0,
          isAvailable: body.isAvailable ?? true,
          maxPerOrder: body.maxPerOrder ?? 0,
          discount: body.discount ?? 0,
          discountType: body.discountType ?? "percent",
          customTypeIds: [],
          position: 10_000,
        })
        .onConflictDoNothing()
        .returning({ id: storeItems.id });
      if (!created.length) return c.json({ success: false, message: "This product is already in the store" }, 409);
      return c.json({ success: true, result: created[0] });
    },
  );

  // -------------------------------------------------------------- catalogue

  app.get(
    `${P}/products`,
    zValidator("query", z.object({ module: z.enum(MODULES).optional(), q: z.string().optional(), page })),
    async (c) => {
      const a = c.get("access");
      if (!hasGlobal(a, ["admin", "content_manager", "support"]) && a.stores.size === 0) return forbidden(c);
      const q = c.req.valid("query");
      const where = and(
        q.module ? eq(products.module, q.module) : undefined,
        q.q ? or(ilike(products.titleEn, searchPattern(q.q)), ilike(products.titleBn, searchPattern(q.q))) : undefined,
      );
      const [total] = await db.select({ n: count() }).from(products).where(where);
      const rows = await db
        .select({
          ...getTableColumns(products),
          typeName: productTypes.name,
          subtypeName: productSubtypes.name,
        })
        .from(products)
        .leftJoin(productTypes, eq(productTypes.id, products.typeId))
        .leftJoin(productSubtypes, eq(productSubtypes.id, products.subtypeId))
        .where(where)
        .orderBy(asc(products.titleEn))
        .limit(PAGE)
        .offset((q.page - 1) * PAGE);
      return c.json({ success: true, result: rows, total: total?.n ?? 0, pageSize: PAGE });
    },
  );

  app.get(`${P}/product-types`, zValidator("query", z.object({ module: z.enum(MODULES) })), async (c) => {
    const { module } = c.req.valid("query");
    const types = await db.select().from(productTypes).where(eq(productTypes.module, module)).orderBy(asc(productTypes.position));
    const subtypes = types.length
      ? await db.select().from(productSubtypes).where(inArray(productSubtypes.typeId, types.map((t) => t.id))).orderBy(asc(productSubtypes.position))
      : [];
    return c.json({ success: true, result: types.map((t) => ({ ...t, subtypes: subtypes.filter((s) => s.typeId === t.id) })) });
  });

  const productFields = z.object({
    titleEn: z.string().trim().min(2).max(200),
    titleBn: z.string().trim().max(200).nullable(),
    packSize: z.string().max(50).nullable(),
    unit: z.string().max(20).nullable(),
    mrp: money,
    image: z.string().max(300).nullable(),
    typeId: z.string().min(1),
    subtypeId: z.string().nullable(),
  });

  const slugify = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80) || "item";

  app.post(`${P}/products`, zValidator("json", productFields.extend({ module: z.enum(MODULES) })), async (c) => {
    if (!hasGlobal(c.get("access"), ["admin", "content_manager"])) return forbidden(c);
    const body = c.req.valid("json");
    const slug = `${slugify(body.titleEn)}-${Date.now().toString(36)}`;
    const [created] = await db.insert(products).values({ ...body, slug, attrs: {} }).returning({ id: products.id });
    return c.json({ success: true, result: created });
  });

  app.patch(`${P}/products/:id`, async (c) => {
    if (!hasGlobal(c.get("access"), ["admin", "content_manager"])) return forbidden(c);
    const parsed = productFields.partial().strict().safeParse(await c.req.json());
    if (!parsed.success) return c.json({ success: false, message: parsed.error.issues[0]?.message ?? "Invalid data" }, 400);
    const [row] = await db.update(products).set(parsed.data).where(eq(products.id, c.req.param("id"))).returning({ id: products.id });
    if (!row) return c.json({ success: false, message: "Product not found" }, 404);
    return c.json({ success: true, message: "Product saved" });
  });

  // ---------------------------------------------------------------- orders

  const ORDER_VIEW = ["admin", "support", "finance"] as const satisfies readonly Role[];

  app.get(
    `${P}/orders`,
    zValidator(
      "query",
      z.object({
        module: z.enum(MODULES).optional(),
        status: z.enum(ORDER_STATUSES).optional(),
        storeId: z.string().optional(),
        q: z.string().optional(),
        page,
      }),
    ),
    async (c) => {
      const a = c.get("access");
      const q = c.req.valid("query");
      const scope = visibleStores(a, ORDER_VIEW);
      if (scope && !scope.length) return c.json({ success: true, result: [], total: 0, pageSize: PAGE });
      const conds: (SQL | undefined)[] = [
        scope ? inArray(orders.storeId, scope) : undefined,
        q.module ? eq(orders.module, q.module) : undefined,
        q.status ? eq(orders.status, q.status) : undefined,
        q.storeId ? eq(orders.storeId, q.storeId) : undefined,
        q.q
          ? or(ilike(orders.code, searchPattern(q.q)), ilike(user.phoneNumber, searchPattern(q.q)), ilike(user.name, searchPattern(q.q)))
          : undefined,
      ];
      const where = and(...conds);
      const [total] = await db
        .select({ n: count() })
        .from(orders)
        .innerJoin(user, eq(user.id, orders.customerId))
        .where(where);
      const rows = await db
        .select(orderSummary)
        .from(orders)
        .innerJoin(stores, eq(stores.id, orders.storeId))
        .innerJoin(user, eq(user.id, orders.customerId))
        .where(where)
        .orderBy(desc(orders.createdAt))
        .limit(PAGE)
        .offset((q.page - 1) * PAGE);
      return c.json({ success: true, result: rows, total: total?.n ?? 0, pageSize: PAGE });
    },
  );

  app.get(`${P}/orders/:id`, async (c) => {
    const [row] = await db
      .select(orderSummary)
      .from(orders)
      .innerJoin(stores, eq(stores.id, orders.storeId))
      .innerJoin(user, eq(user.id, orders.customerId))
      .where(eq(orders.id, c.req.param("id")));
    if (!row) return c.json({ success: false, message: "Order not found" }, 404);
    if (!canStore(c.get("access"), row.storeId, ORDER_VIEW, MERCHANT_ALL)) return forbidden(c);
    const lines = await db.select().from(orderItems).where(eq(orderItems.orderId, row.id)).orderBy(asc(orderItems.position));
    const [cust] = await db.select({ code: customers.code }).from(customers).where(eq(customers.userId, row.customerId));
    return c.json({
      success: true,
      result: { ...row, customerCode: cust?.code ?? "", items: lines, nextStatuses: NEXT_STATUS[row.status] ?? [] },
    });
  });

  app.patch(
    `${P}/orders/:id/status`,
    zValidator("json", z.object({ status: z.enum(ORDER_STATUSES) })),
    async (c) => {
      const a = c.get("access");
      const { status } = c.req.valid("json");
      const [row] = await db.select({ storeId: orders.storeId, status: orders.status }).from(orders).where(eq(orders.id, c.req.param("id")));
      if (!row) return c.json({ success: false, message: "Order not found" }, 404);
      if (!canStore(a, row.storeId, ["admin", "support"], MERCHANT_ALL)) return forbidden(c);
      if (!(NEXT_STATUS[row.status] ?? []).includes(status)) {
        return c.json({ success: false, message: `An order that is ${row.status} can't become ${status}` }, 409);
      }
      await db.update(orders).set({ status }).where(eq(orders.id, c.req.param("id")));
      return c.json({ success: true, message: `Order is now ${status}` });
    },
  );

  // ------------------------------------------------------- users and roles

  app.get(
    `${P}/users`,
    zValidator("query", z.object({ q: z.string().optional(), role: z.enum(ROLES).optional(), page })),
    async (c) => {
      const a = c.get("access");
      if (!hasGlobal(a, ["admin", "support"])) return forbidden(c);
      const q = c.req.valid("query");
      const where = and(
        q.q ? or(ilike(user.name, searchPattern(q.q)), ilike(user.phoneNumber, searchPattern(q.q))) : undefined,
        q.role ? sql`exists (select 1 from ${userRole} where ${userRole.userId} = ${user.id} and ${userRole.role} = ${q.role})` : undefined,
      );
      const [total] = await db.select({ n: count() }).from(user).where(where);
      const rows = await db
        .select({ id: user.id, name: user.name, phone: user.phoneNumber, banned: user.banned, createdAt: user.createdAt, code: customers.code })
        .from(user)
        .leftJoin(customers, eq(customers.userId, user.id))
        .where(where)
        .orderBy(desc(user.createdAt))
        .limit(PAGE)
        .offset((q.page - 1) * PAGE);
      const roles = rows.length
        ? await db
            .select({ id: userRole.id, userId: userRole.userId, role: userRole.role, storeId: userRole.storeId, storeName: stores.name })
            .from(userRole)
            .leftJoin(stores, eq(stores.id, userRole.storeId))
            .where(inArray(userRole.userId, rows.map((r) => r.id)))
        : [];
      return c.json({
        success: true,
        result: rows.map((r) => ({ ...r, roles: roles.filter((x) => x.userId === r.id) })),
        total: total?.n ?? 0,
        pageSize: PAGE,
      });
    },
  );

  // Adds a role to a phone number (creating the account if needed). Returns
  // a setup link when the person has no password yet.
  app.post(
    `${P}/roles`,
    zValidator(
      "json",
      z.object({ phone: z.string(), name: z.string().trim().max(100).optional(), role: z.enum(ROLES), storeId: z.string().nullable().optional() }),
    ),
    async (c) => {
      const a = c.get("access");
      const body = c.req.valid("json");
      const phone = normalizeBdPhone(body.phone);
      if (!phone) return c.json({ success: false, message: "Enter a valid mobile number (01XXXXXXXXX)" }, 400);
      if (body.role === "customer") return c.json({ success: false, message: "Everyone is a customer already" }, 400);
      const storeScoped = (STORE_ROLES as readonly Role[]).includes(body.role);
      const storeId = storeScoped ? (body.storeId ?? null) : null;
      if (storeScoped && !storeId) return c.json({ success: false, message: "Choose the store for this role" }, 400);
      if (!canManageRole(a, body.role, storeId)) return forbidden(c);
      if (storeId) {
        const [s] = await db.select({ id: stores.id }).from(stores).where(eq(stores.id, storeId));
        if (!s) return c.json({ success: false, message: "Store not found" }, 404);
      }
      const u = await ensureUser(db, phone, body.name || "");
      if (body.name && !u.name) await db.update(user).set({ name: body.name }).where(eq(user.id, u.id));
      const added = await grantRole(db, u.id, body.role, storeId, a.userId);
      const setupLink = (await hasPassword(db, u.id)) ? null : await createSetupLink(db, u.id, webUrlOf(c));
      return c.json({ success: true, message: added ? "Role added" : "They already have this role", result: { userId: u.id, setupLink } });
    },
  );

  app.delete(`${P}/roles/:id`, async (c) => {
    const a = c.get("access");
    const [row] = await db.select().from(userRole).where(eq(userRole.id, c.req.param("id")));
    if (!row || row.role === "customer") return c.json({ success: false, message: "Role not found" }, 404);
    if (!canManageRole(a, row.role, row.storeId)) return forbidden(c);
    if (row.role === "super_admin") {
      const [others] = await db.select({ n: count() }).from(userRole).where(eq(userRole.role, "super_admin"));
      if ((others?.n ?? 0) <= 1) return c.json({ success: false, message: "The last super admin can't be removed" }, 409);
    }
    await db.delete(userRole).where(eq(userRole.id, row.id));
    await db.delete(session).where(eq(session.userId, row.userId)); // rights change on next sign-in
    return c.json({ success: true, message: "Role removed" });
  });

  app.post(`${P}/users/:id/setup-link`, async (c) => {
    const a = c.get("access");
    const id = c.req.param("id");
    const roles = await db.select().from(userRole).where(and(eq(userRole.userId, id), ne(userRole.role, "customer")));
    if (!roles.length) return c.json({ success: false, message: "Only staff accounts have passwords" }, 400);
    if (!roles.every((r) => canManageRole(a, r.role, r.storeId))) return forbidden(c);
    return c.json({ success: true, result: { setupLink: await createSetupLink(db, id, webUrlOf(c)) } });
  });

  app.patch(`${P}/users/:id`, zValidator("json", z.object({ banned: z.boolean() })), async (c) => {
    const a = c.get("access");
    if (!hasGlobal(a, ["admin"])) return forbidden(c);
    const id = c.req.param("id");
    if (id === a.userId) return c.json({ success: false, message: "You can't block yourself" }, 400);
    const target = await loadAccess(db, id);
    if (target.isSuper && !a.isSuper) return forbidden(c);
    await db.update(user).set({ banned: c.req.valid("json").banned }).where(eq(user.id, id));
    if (c.req.valid("json").banned) await db.delete(session).where(eq(session.userId, id));
    return c.json({ success: true, message: "Saved" });
  });

  return app;
};

// Links point at the web app the request came from (the admin pages).
function webUrlOf(c: { req: { header: (k: string) => string | undefined } }) {
  const origin = c.req.header("origin");
  if (origin && /^https?:\/\//.test(origin)) return origin.replace(/\/+$/, "");
  return process.env.WEB_URL ?? "http://localhost:3000";
}
