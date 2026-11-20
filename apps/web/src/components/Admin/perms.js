// What the signed-in staff member may do, from GET /me roles. Mirrors the
// API's access rules (apps/api/src/modules/admin/access.ts) so the panel only
// shows what will work; the API still checks everything.
export const PLATFORM_ROLES = ["super_admin", "admin", "support", "finance", "content_manager"];
export const STORE_ROLES = ["merchant_owner", "merchant_manager", "merchant_staff"];
export const SERVICE_ROLES = ["rider", "doctor", "service_provider"];
const MERCHANT_EDIT = ["merchant_owner", "merchant_manager"];

export function permsOf(me) {
  const roles = me?.roles || [];
  const global = new Set(roles.filter((r) => !r.storeId).map((r) => r.role));
  const stores = new Map(); // storeId -> { name, module, roles: Set }
  for (const r of roles) {
    if (!r.storeId) continue;
    if (!stores.has(r.storeId)) stores.set(r.storeId, { id: r.storeId, name: r.storeName, module: r.module, roles: new Set() });
    stores.get(r.storeId).roles.add(r.role);
  }
  const isSuper = global.has("super_admin");
  const hasGlobal = (list) => isSuper || list.some((r) => global.has(r));
  const atStore = (storeId, list) => list.some((r) => stores.get(storeId)?.roles.has(r));
  const canStore = (storeId, globalRoles, storeRoles) => hasGlobal(globalRoles) || atStore(storeId, storeRoles);
  const isAdmin = hasGlobal(["admin"]);
  const isMerchant = stores.size > 0;

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

    // Actions
    canCreateStore: isAdmin,
    editProducts: hasGlobal(["admin", "content_manager"]),
    canBlock: isAdmin,
    editStore: (storeId) => isAdmin || atStore(storeId, MERCHANT_EDIT),
    seeItems: (storeId) => canStore(storeId, ["admin", "support", "content_manager"], STORE_ROLES),
    // "full" = prices and stock; "stock" = stock and availability only; null = read only
    itemEdit: (storeId) =>
      canStore(storeId, ["admin"], MERCHANT_EDIT) ? "full" : atStore(storeId, ["merchant_staff"]) ? "stock" : null,
    moveOrder: (storeId) => canStore(storeId, ["admin", "support"], STORE_ROLES),
    // Which roles this person may grant or remove (see canManageRole in the API).
    manageRole: (role, storeId) => {
      if (isSuper) return true;
      if (PLATFORM_ROLES.includes(role)) return false;
      if (global.has("admin")) return true;
      return !!storeId && (role === "merchant_manager" || role === "merchant_staff") && atStore(storeId, ["merchant_owner"]);
    },
  };
}

// Roles this person can hand out from the Users page.
export function grantableRoles(perms) {
  const all = [...PLATFORM_ROLES, ...STORE_ROLES, ...SERVICE_ROLES];
  if (perms.isSuper) return all;
  if (perms.global.has("admin")) return [...STORE_ROLES, ...SERVICE_ROLES];
  return [];
}
