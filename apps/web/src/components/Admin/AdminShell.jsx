"use client";

// Signed-in part of the admin panel: checks the session (GET /me), sends
// anyone else to /admin/login, and draws the sidebar for the user's roles.
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  HiOutlineArrowRightOnRectangle,
  HiOutlineBars3,
  HiOutlineBuildingStorefront,
  HiOutlineClipboardDocumentList,
  HiOutlineCube,
  HiOutlineHome,
  HiOutlineUserCircle,
  HiOutlineUsers,
  HiOutlineXMark,
} from "react-icons/hi2";
import { adminApi } from "./api";
import { permsOf } from "./perms";
import { Button, cx, ErrorBox, Loading, RoleBadge } from "./ui";

const AdminContext = createContext(null);

export const useAdmin = () => useContext(AdminContext);

export default function AdminShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const meQuery = useQuery({
    queryKey: ["admin", "me"],
    queryFn: () => adminApi("/me").then((r) => r.result),
    retry: false,
    staleTime: 60_000,
  });
  const status = meQuery.error?.status;
  const signedOut = status === 401 || status === 403;

  useEffect(() => {
    if (signedOut) router.replace("/admin/login");
  }, [signedOut, router]);

  useEffect(() => {
    const onUnauthorized = () => {
      queryClient.removeQueries({ queryKey: ["admin"] });
      router.replace("/admin/login");
    };
    window.addEventListener("admin:unauthorized", onUnauthorized);
    return () => window.removeEventListener("admin:unauthorized", onUnauthorized);
  }, [queryClient, router]);

  const me = meQuery.data;
  const perms = useMemo(() => permsOf(me), [me]);
  const ctx = useMemo(() => ({ me, perms }), [me, perms]);

  if (meQuery.isPending || signedOut) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loading label="Checking your session…" />
      </div>
    );
  }
  if (meQuery.error) {
    return (
      <div className="mx-auto max-w-md p-6">
        <ErrorBox error={meQuery.error} onRetry={() => meQuery.refetch()} />
      </div>
    );
  }

  const storeList = [...perms.stores.values()];
  const nav = [
    { href: "/admin", label: "Dashboard", icon: HiOutlineHome, show: true },
    { href: "/admin/orders", label: "Orders", icon: HiOutlineClipboardDocumentList, show: perms.seeOrders },
    {
      href: !perms.seeAllStores && storeList.length === 1 ? `/admin/stores/${storeList[0].id}` : "/admin/stores",
      label: perms.seeAllStores ? "Stores" : storeList.length === 1 ? "My store" : "My stores",
      icon: HiOutlineBuildingStorefront,
      show: perms.seeStores,
      match: "/admin/stores",
    },
    { href: "/admin/products", label: "Products", icon: HiOutlineCube, show: perms.seeProducts },
    { href: "/admin/users", label: "Users & roles", icon: HiOutlineUsers, show: perms.seeUsers },
    { href: "/admin/account", label: "Account", icon: HiOutlineUserCircle, show: true },
  ].filter((n) => n.show);

  const isActive = (n) => {
    const base = n.match || n.href;
    return base === "/admin" ? pathname === "/admin" : pathname === base || pathname.startsWith(`${base}/`);
  };

  const logout = async () => {
    setLoggingOut(true);
    try {
      await adminApi("/logout", { method: "POST" });
    } catch {
      // Signed out already, or offline: leave the panel either way.
    }
    queryClient.removeQueries({ queryKey: ["admin"] });
    router.replace("/admin/login");
  };

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 py-4">
        <Link href="/admin" className="text-lg font-bold text-primary" onClick={() => setMenuOpen(false)}>
          NoTension <span className="font-medium text-gray-500">Admin</span>
        </Link>
        <button type="button" className="rounded p-1 text-gray-600 lg:hidden" onClick={() => setMenuOpen(false)} aria-label="Close menu">
          <HiOutlineXMark className="text-xl" />
        </button>
      </div>
      <nav className="flex-1 space-y-0.5 px-2">
        {nav.map((n) => (
          <Link
            key={n.label}
            href={n.href}
            onClick={() => setMenuOpen(false)}
            className={cx(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
              isActive(n) ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100",
            )}
          >
            <n.icon className="text-lg" />
            {n.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-gray-200 p-4">
        <p className="truncate text-sm font-semibold text-gray-900">{me.name || "Staff"}</p>
        <p className="text-xs text-gray-500">{me.phone}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {me.roles.map((r, i) => (
            <RoleBadge key={i} role={r} />
          ))}
        </div>
        <Button variant="secondary" className="mt-3 w-full" onClick={logout} loading={loggingOut}>
          <HiOutlineArrowRightOnRectangle className="text-base" /> Log out
        </Button>
      </div>
    </div>
  );

  return (
    <AdminContext.Provider value={ctx}>
      <div className="min-h-screen bg-gray-50">
        {/* Desktop sidebar */}
        <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-gray-200 bg-white lg:block">{sidebar}</aside>

        {/* Phone: top bar + drawer */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 lg:hidden">
          <button type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu" className="rounded p-1 text-gray-700">
            <HiOutlineBars3 className="text-2xl" />
          </button>
          <span className="font-bold text-primary">
            NoTension <span className="font-medium text-gray-500">Admin</span>
          </span>
        </header>
        {menuOpen ? (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button type="button" aria-label="Close menu" className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
            <aside className="absolute inset-y-0 left-0 w-72 max-w-[85%] overflow-y-auto bg-white shadow-xl">{sidebar}</aside>
          </div>
        ) : null}

        <main className="px-4 py-5 md:px-6 lg:ml-64 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </AdminContext.Provider>
  );
}
