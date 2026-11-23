// What the signed-in staff member may do, from GET /me roles. Mirrors the
// API's access rules (apps/api/src/modules/admin/access.ts) so the panel only
// shows what will work; the API still checks everything.
import type { Me, Module, Role } from "./types";

export const PLATFORM_ROLES: Role[] = ["super_admin", "admin", "support", "finance", "content_manager"];
export const STORE_ROLES: Role[] = ["merchant_owner", "merchant_manager", "merchant_staff"];
export const SERVICE_ROLES: Role[] = ["rider", "doctor", "service_provider"];
const MERCHANT_EDIT: Role[] = ["merchant_owner", "merchant_manager"];

export type PermStore = { id: string; name: string | null; module: Module | null; roles: Set<Role> };

// "full" = prices and stock; "stock" = stock and availability only; null = read only
export type ItemEditMode = "full" | "stock" | null;

export function permsOf(me: Me | undefined) {
  const roles = me?.roles || [];
  const global = new Set(roles.filter((r) => !r.storeId).map((r) => r.role));
  const stores = new Map<string, PermStore>(); // storeId -> { name, module, roles: Set }
  for (const r of roles) {
    if (!r.storeId) continue;
    if (!stores.has(r.storeId)) stores.set(r.storeId, { id: r.storeId, name: r.storeName, module: r.module, roles: new Set() });
    stores.get(r.storeId)!.roles.add(r.role);
  }
  const isSuper = global.has("super_admin");
  const hasGlobal = (list: Role[]) => isSuper || list.some((r) => global.has(r));
  const atStore = (storeId: string, list: Role[]) => list.some((r) => stores.get(storeId)?.roles.has(r));
  const canStore = (storeId: string, globalRoles: Role[], storeRoles: Role[]) => hasGlobal(globalRoles) || atStore(storeId, storeRoles);
  const isAdmin = hasGlobal(["admin"]);
  const isMerchant = stores.size > 0;
  // Service roles: their own panels (super_admin doesn't count here).
  const isRider = global.has("rider");
  const isDoctor = global.has("doctor");
  const isProvider = global.has("service_provider");
  const seesDashboard = isMerchant || PLATFORM_ROLES.some((r) => global.has(r));

  return {
    userId: me?.id,
    isSuper,
    isAdmin,
    isMerchant,
    global,
    stores,
    hasGlobal,

    // Navigation
    seeOrders: hasGlobal(["admin", "support", "finance"]) || isMerchant,
    seeStores: hasGlobal(["admin", "support", "finance", "content_manager"]) || isMerchant,
    seeAllStores: hasGlobal(["admin", "support", "finance", "content_manager"]),
    seeProducts: hasGlobal(["admin", "content_manager", "support"]),
    seeUsers: hasGlobal(["admin", "support"]),
    seeDashboard: seesDashboard,
    isRider,
    isDoctor,
    isProvider,
    // Where "/admin" leads: the dashboard, or a service panel for people
    // who only hold a service role.
    home: seesDashboard
      ? "/admin"
      : isRider
        ? "/admin/deliveries"
        : isDoctor
          ? "/admin/doctor/appointments"
          : isProvider
            ? "/admin/my-service"
            : "/admin",

    // Actions
    canCreateStore: isAdmin,
    editProducts: hasGlobal(["admin", "content_manager"]),
    canBlock: isAdmin,
    editStore: (storeId: string) => isAdmin || atStore(storeId, MERCHANT_EDIT),
    seeItems: (storeId: string) => canStore(storeId, ["admin", "support", "content_manager"], STORE_ROLES),
    // "full" = prices and stock; "stock" = stock and availability only; null = read only
    itemEdit: (storeId: string): ItemEditMode =>
      canStore(storeId, ["admin"], MERCHANT_EDIT) ? "full" : atStore(storeId, ["merchant_staff"]) ? "stock" : null,
    moveOrder: (storeId: string) => canStore(storeId, ["admin", "support"], STORE_ROLES),
    assignRider: (storeId: string) => canStore(storeId, ["admin", "support"], MERCHANT_EDIT),
    // Linking doctor / provider profiles to accounts (Users & roles).
    linkProfiles: isAdmin,
    // Which roles this person may grant or remove (see canManageRole in the API).
    manageRole: (role: Role, storeId?: string | null) => {
      if (isSuper) return true;
      if (PLATFORM_ROLES.includes(role)) return false;
      if (global.has("admin")) return true;
      return !!storeId && (role === "merchant_manager" || role === "merchant_staff") && atStore(storeId, ["merchant_owner"]);
    },
  };
}

export type Perms = ReturnType<typeof permsOf>;

// Roles this person can hand out from the Users page.
export function grantableRoles(perms: Perms): Role[] {
  const all = [...PLATFORM_ROLES, ...STORE_ROLES, ...SERVICE_ROLES];
  if (perms.isSuper) return all;
  if (perms.global.has("admin")) return [...STORE_ROLES, ...SERVICE_ROLES];
  return [];
}
