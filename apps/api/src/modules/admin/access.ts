// What the signed-in staff member may do. Loaded once per request.
//
//   super_admin         everything
//   admin               runs the platform (not other admins' roles)
//   support             reads users/stores/orders, updates order status
//   finance             reads orders and reports
//   content_manager     catalogue: products, types, sliders
//   merchant_owner      own store: settings, items, prices, orders, its staff
//   merchant_manager    own store: settings, items, prices, orders
//   merchant_staff      own store: stock/availability, order status
//   rider               own deliveries: assigned orders, On the way / Delivered
//   doctor              own doctor profile, chambers and appointments
//   service_provider    own All Care provider listing(s)
// The service roles are staff (phone + password sign-in) but see nothing of
// stores or other people's work; see service-panels.ts.
import type { Context } from "hono";
import { and, eq, ne } from "drizzle-orm";
import type { AuthEnv } from "../../auth/middleware";
import type { Db } from "../../db/client";
import { userRole, type Role } from "../../db/schema";

export type Access = {
  userId: string;
  isSuper: boolean;
  global: Set<Role>;
  // storeId → roles held there
  stores: Map<string, Set<Role>>;
};

export async function loadAccess(db: Db, userId: string): Promise<Access> {
  const rows = await db
    .select({ role: userRole.role, storeId: userRole.storeId })
    .from(userRole)
    .where(and(eq(userRole.userId, userId), ne(userRole.role, "customer")));
  const access: Access = { userId, isSuper: false, global: new Set(), stores: new Map() };
  for (const r of rows) {
    if (r.storeId) {
      if (!access.stores.has(r.storeId)) access.stores.set(r.storeId, new Set());
      access.stores.get(r.storeId)!.add(r.role);
    } else {
      access.global.add(r.role);
    }
  }
  access.isSuper = access.global.has("super_admin");
  return access;
}

export const isStaff = (a: Access) => a.global.size > 0 || a.stores.size > 0;

// A global role among `roles` (super_admin always counts).
export const hasGlobal = (a: Access, roles: readonly Role[]) => a.isSuper || roles.some((r) => a.global.has(r));

// Allowed for this store: a matching global role, or a matching role at the store.
export const canStore = (a: Access, storeId: string, globalRoles: readonly Role[], storeRoles: readonly Role[]) =>
  hasGlobal(a, globalRoles) || storeRoles.some((r) => a.stores.get(storeId)?.has(r));

// Stores this user may see when they have no platform-wide view (null = all).
export const visibleStores = (a: Access, globalRoles: readonly Role[]) =>
  hasGlobal(a, globalRoles) ? null : [...a.stores.keys()];

export const MERCHANT_ALL = ["merchant_owner", "merchant_manager", "merchant_staff"] as const satisfies readonly Role[];
export const MERCHANT_EDIT = ["merchant_owner", "merchant_manager"] as const satisfies readonly Role[];

export const PLATFORM_ROLES = ["super_admin", "admin", "support", "finance", "content_manager"] as const satisfies readonly Role[];
export const SERVICE_ROLES = ["rider", "doctor", "service_provider"] as const satisfies readonly Role[];

// Holds this service role itself (super_admin does not count: these panels
// show the person's own work).
export const hasOwnRole = (a: Access, role: (typeof SERVICE_ROLES)[number]) => a.global.has(role);

// Which roles `a` may grant or remove. Platform roles: super_admin only.
// Service roles and store roles: admins. Store staff: that store's owner.
export function canManageRole(a: Access, role: Role, storeId: string | null) {
  if (a.isSuper) return true;
  if ((PLATFORM_ROLES as readonly Role[]).includes(role)) return false;
  if (a.global.has("admin")) return true;
  return (
    !!storeId &&
    (role === "merchant_manager" || role === "merchant_staff") &&
    !!a.stores.get(storeId)?.has("merchant_owner")
  );
}

export type AdminEnv = AuthEnv & { Variables: AuthEnv["Variables"] & { access: Access } };
export type AdminContext = Context<AdminEnv>;

export const forbidden = (c: Context) => c.json({ success: false, message: "You don't have access to this" }, 403);
