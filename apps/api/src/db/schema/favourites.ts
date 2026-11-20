// A customer's favourites: stores, items (products) and the "list" (medical
// centres, doctors). The apps keep a snapshot of what they showed (name,
// address, image, ...) with each entry, so it is stored as sent in `data`.
import { bigserial, index, integer, jsonb, pgEnum, pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";
import { objectId } from "../ids";
import { user } from "./auth";

export const FAVOURITE_KINDS = ["store", "item", "list"] as const;
export type FavouriteKind = (typeof FAVOURITE_KINDS)[number];
export const favouriteKindEnum = pgEnum("favourite_kind", FAVOURITE_KINDS);

export const favourites = pgTable(
  "favourite",
  {
    id: text("id").primaryKey().$defaultFn(objectId),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    kind: favouriteKindEnum("kind").notNull(),
    // The app's merchantType: 0 grocery, 1 medicine, 2 food, 3 centre, 4 doctor.
    merchantType: integer("merchant_type").notNull(),
    // storeId / productId / mongodbId, by kind.
    refId: text("ref_id").notNull(),
    data: jsonb("data").$type<Record<string, unknown>>().notNull().default({}),
    // Insertion order (lists are returned oldest first).
    seq: bigserial("seq", { mode: "number" }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    unique("favourite_unique").on(t.userId, t.kind, t.merchantType, t.refId),
    index("favourite_user_kind_idx").on(t.userId, t.kind, t.merchantType),
  ],
);
