// Accounts and access control.
//
// `user`, `session`, `account` and `verification` follow Better Auth's core
// schema (plus its phone-number plugin fields), so Better Auth can be wired
// in without a schema change.
//
// Roles are assignments, not a column on the user: one person can be a
// customer and also manage a store, or be a doctor at two centres. A role is
// either global (store_id null: super_admin, admin, support, ...) or scoped to
// one store (merchant_owner, merchant_manager, merchant_staff).
import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { objectId } from "../ids";
import { stores } from "./catalog";

const id = () => text("id").primaryKey().$defaultFn(objectId);
const createdAt = () => timestamp("created_at", { withTimezone: true }).notNull().defaultNow();
const updatedAt = () =>
  timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date());

export const user = pgTable("user", {
  id: id(),
  name: text("name").notNull(),
  email: text("email").unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  phoneNumber: text("phone_number").unique(),
  phoneNumberVerified: boolean("phone_number_verified").notNull().default(false),
  // Banned users keep their data but can't sign in.
  banned: boolean("banned").notNull().default(false),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const session = pgTable(
  "session",
  {
    id: id(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("session_user_idx").on(t.userId)],
);

export const account = pgTable(
  "account",
  {
    id: id(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    scope: text("scope"),
    password: text("password"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("account_user_idx").on(t.userId)],
);

export const verification = pgTable("verification", {
  id: id(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

// ------------------------------------------------------------------ roles

export const ROLES = [
  // Platform staff (global)
  "super_admin", // everything, including managing admins
  "admin", // runs the platform: stores, catalog, users, orders
  "support", // customer care: read orders/users, update order status, refunds requests
  "finance", // payouts, commissions, settlements, reports
  "content_manager", // banners, sliders, categories, marketing pages
  // Merchants (scoped to a store)
  "merchant_owner", // owns the store: staff, pricing, payouts
  "merchant_manager", // runs the store day to day: items, stock, orders
  "merchant_staff", // packs orders, updates stock
  // Service side
  "rider", // delivery: assigned orders, status updates
  "doctor", // own profile, chambers, schedule, appointments
  "service_provider", // all-care provider: own listing and bookings
  // Everyone who signs up
  "customer",
] as const;

export type Role = (typeof ROLES)[number];

export const STORE_ROLES = ["merchant_owner", "merchant_manager", "merchant_staff"] as const satisfies readonly Role[];

export const roleEnum = pgEnum("role", ROLES);

export const userRole = pgTable(
  "user_role",
  {
    id: id(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: roleEnum("role").notNull(),
    // Set for store-scoped roles, null for global ones.
    storeId: text("store_id").references(() => stores.id, { onDelete: "cascade" }),
    grantedBy: text("granted_by").references(() => user.id, { onDelete: "set null" }),
    createdAt: createdAt(),
  },
  (t) => [
    // NULLS NOT DISTINCT: a global role can be granted only once per user.
    unique("user_role_unique").on(t.userId, t.role, t.storeId).nullsNotDistinct(),
    index("user_role_store_idx").on(t.storeId),
    // Store roles need a store; global roles must not have one.
    check(
      "user_role_scope",
      sql`(${t.role} IN ('merchant_owner','merchant_manager','merchant_staff')) = (${t.storeId} IS NOT NULL)`,
    ),
  ],
);
