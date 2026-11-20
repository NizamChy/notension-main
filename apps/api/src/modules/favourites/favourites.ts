// Favourite stores, items and list entries (centres, doctors) on the paths the
// web app uses (FAVORITE_STORE_*, FAVORITE_PRODUCT_*, *_FAVOURITE, FAVORITE_INFO).
//
// Each kind has four endpoints, as in the old backend:
//   add     replace the user's list for that merchantType with this entry
//   push    append the entry (an existing one with the same id moves to the end)
//   remove  drop it; answers with what is left in that merchantType's list
//   info    GET or POST, the entries of one merchantType, or all of them
// add/push answer with an array holding only the new entry: the app appends
// `result` to its own list. The owner is always the signed-in user.
import { favourites as contract } from "@notension/shared";
import { and, asc, count, eq } from "drizzle-orm";
import { Hono, type Context } from "hono";
import { requireUser, type AuthEnv } from "../../auth/middleware";
import type { Db } from "../../db/client";
import { favourites } from "../../db/schema";

const P = "/api/v1/customer";

type Row = typeof favourites.$inferSelect;

const fail = (c: Context, status: 400 | 409, message: string) => c.json({ success: false as const, message }, status);

// Fields the app sends that are not part of the entry.
const NOT_STORED = new Set(["_id", "customerInfo", "custom_customer_id", "merchantType"]);

const toEntry = (kind: contract.Kind, r: Row): contract.Entry => ({
  _id: r.id,
  ...r.data,
  [contract.KINDS[kind].idField]: r.refId,
  merchantType: r.merchantType,
});

async function readBody(c: Context): Promise<Record<string, unknown>> {
  const body = await c.req.json().catch(() => null);
  return body && typeof body === "object" && !Array.isArray(body) ? (body as Record<string, unknown>) : {};
}

function favouriteRoutes(db: Db, kind: contract.Kind, paths: { add: string; push: string; remove: string; info: string }) {
  const { idField } = contract.KINDS[kind];
  const inputSchema = contract.entryInput(kind);

  const listOf = (userId: string, merchantType?: number) =>
    db
      .select()
      .from(favourites)
      .where(
        and(
          eq(favourites.userId, userId),
          eq(favourites.kind, kind),
          merchantType === undefined ? undefined : eq(favourites.merchantType, merchantType),
        ),
      )
      .orderBy(asc(favourites.seq));

  const parse = async (c: Context) => {
    const parsed = inputSchema.safeParse(await readBody(c));
    if (!parsed.success) return { error: `${idField} and merchantType are required` } as const;
    const { merchantType, [idField]: refId, ...rest } = parsed.data as Record<string, unknown> & {
      merchantType: number;
    };
    const data = Object.fromEntries(Object.entries(rest).filter(([k]) => !NOT_STORED.has(k)));
    if (JSON.stringify(data).length > contract.MAX_ENTRY_BYTES) return { error: "Favourite details are too long" } as const;
    return { merchantType, refId: refId as string, data } as const;
  };

  const save = (replace: boolean) => async (c: Context<AuthEnv>) => {
    const input = await parse(c);
    if ("error" in input) return fail(c, 400, input.error!);
    const userId = c.get("user")!.id;
    const sameList = and(
      eq(favourites.userId, userId),
      eq(favourites.kind, kind),
      eq(favourites.merchantType, input.merchantType),
    );

    const saved = await db.transaction(async (tx) => {
      if (replace) await tx.delete(favourites).where(sameList);
      else await tx.delete(favourites).where(and(sameList, eq(favourites.refId, input.refId)));
      const [{ n }] = (await tx.select({ n: count() }).from(favourites).where(sameList)) as [{ n: number }];
      if (n >= contract.MAX_PER_LIST) return null;
      const [row] = await tx
        .insert(favourites)
        .values({ userId, kind, merchantType: input.merchantType, refId: input.refId, data: input.data })
        .returning();
      return row!;
    });
    if (!saved) return fail(c, 409, `You can keep at most ${contract.MAX_PER_LIST} favourites here`);
    return c.json({ success: true as const, message: "Added to favourites", result: [toEntry(kind, saved)] });
  };

  const remove = async (c: Context<AuthEnv>) => {
    const input = await parse(c);
    if ("error" in input) return fail(c, 400, input.error!);
    const userId = c.get("user")!.id;
    await db
      .delete(favourites)
      .where(
        and(
          eq(favourites.userId, userId),
          eq(favourites.kind, kind),
          eq(favourites.merchantType, input.merchantType),
          eq(favourites.refId, input.refId),
        ),
      );
    const rows = await listOf(userId, input.merchantType);
    return c.json({
      success: true as const,
      message: "Removed from favourites",
      result: rows.map((r) => toEntry(kind, r)),
    });
  };

  const info = async (c: Context<AuthEnv>) => {
    const source = { ...c.req.query(), ...(c.req.method === "POST" ? await readBody(c) : {}) };
    const parsed = contract.infoInput.safeParse(source);
    if (!parsed.success) return fail(c, 400, "Invalid merchantType");
    const rows = await listOf(c.get("user")!.id, parsed.data.merchantType);
    // Without a merchantType: grouped by merchantType, oldest first in each.
    if (parsed.data.merchantType === undefined) rows.sort((a, b) => a.merchantType - b.merchantType || a.seq - b.seq);
    return c.json({ success: true as const, result: rows.map((r) => toEntry(kind, r)) });
  };

  return new Hono<AuthEnv>()
    .post(`${P}/${paths.add}`, requireUser, save(true))
    .post(`${P}/${paths.push}`, requireUser, save(false))
    .post(`${P}/${paths.remove}`, requireUser, remove)
    .get(`${P}/${paths.info}`, requireUser, info)
    .post(`${P}/${paths.info}`, requireUser, info);
}

export const favouritesRoutes = (db: Db) =>
  new Hono<AuthEnv>()
    .route(
      "/",
      favouriteRoutes(db, "store", {
        add: "add-favourite-store",
        push: "push-store",
        remove: "remove-store",
        info: "get-favourite-store-info",
      }),
    )
    .route(
      "/",
      favouriteRoutes(db, "item", {
        add: "add-favourite-item",
        push: "push-item",
        remove: "remove-item",
        info: "get-favourite-item-info",
      }),
    )
    .route(
      "/",
      favouriteRoutes(db, "list", {
        add: "add-to-favourite-list",
        push: "push-to-favourite-list",
        remove: "remove-from-favourite-list",
        info: "get-favourite-list",
      }),
    );
