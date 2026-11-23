"use client";

// Signed-in part of the admin panel: checks the session (GET /me), sends
// anyone else to /admin/login, and draws the sidebar for the user's roles.
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  HiOutlineArrowRightOnRectangle,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineBars3,
  HiOutlineBookOpen,
  HiOutlineBuildingStorefront,
  HiOutlineCircleStack,
  HiOutlineClipboardDocumentList,
  HiOutlineCube,
  HiOutlineHome,
  HiOutlineUserCircle,
  HiOutlineUsers,
  HiOutlineXMark,
} from "react-icons/hi2";
import ThemeToggle from "@/components/shared/ThemeToggle/ThemeToggle";
import { serviceNav, type NavItem } from "./ServiceNav";
import { adminApi, statusOf } from "./api";
import { permsOf, type Perms } from "./perms";
import type { Me } from "./types";
import { Button, cx, ErrorBox, Loading, RoleBadge } from "./ui";

type AdminContextValue = { me: Me; perms: Perms };

const AdminContext = createContext<AdminContextValue | null>(null);

// Only used below AdminShell, which renders its children (and so the
// provider) once /me has loaded.
export const useAdmin = () => useContext(AdminContext) as AdminContextValue;

export default function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const meQuery = useQuery({
    queryKey: ["admin", "me"],
    queryFn: () => adminApi<Me>("/me").then((r) => r.result),
    retry: false,
    staleTime: 60_000,
  });
  const status = statusOf(meQuery.error);
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
  // Provided only after the loading / error returns below, when `me` is set.
  const ctx = useMemo(() => ({ me: me as Me, perms }), [me, perms]);

  // Riders, doctors and providers land on their own panel.
  useEffect(() => {
    if (me && pathname === "/admin" && perms.home !== "/admin") router.replace(perms.home);
  }, [me, pathname, perms.home, router]);

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
  // Unreachable: a finished query without an error always has data.
  if (!me) return null;

  const storeList = [...perms.stores.values()];
  const nav: NavItem[] = [
    { href: "/admin", label: "Dashboard", icon: HiOutlineHome, show: perms.seeDashboard },
    ...serviceNav(perms),
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
    { href: "/admin/data", label: "Data", icon: HiOutlineCircleStack, show: perms.isSuper },
    { href: "/admin/account", label: "Account", icon: HiOutlineUserCircle, show: true },
    { href: "/admin/guide", label: "Guide", icon: HiOutlineBookOpen, show: true },
  ].filter((n) => n.show);

  const isActive = (n: NavItem) => {
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
        <button type="button" className="rounded-lg p-2.5 text-gray-600 hover:bg-gray-100 lg:hidden" onClick={() => setMenuOpen(false)} aria-label="Close menu">
          <HiOutlineXMark className="text-xl" />
        </button>
      </div>
      <nav className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-2">
        {nav.map((n) => (
          <Link
            key={n.label}
            href={n.href}
            onClick={() => setMenuOpen(false)}
            className={cx(
              "flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium lg:min-h-0",
              isActive(n) ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100",
            )}
          >
            <n.icon className="text-lg" />
            {n.label}
          </Link>
        ))}
      </nav>
      <div className="mx-2 mb-2 flex items-center gap-1 border-t border-gray-200 pt-2">
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="flex min-h-11 flex-1 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 lg:min-h-0"
        >
          <HiOutlineArrowTopRightOnSquare className="text-lg" />
          Home page
        </Link>
        <ThemeToggle />
      </div>
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
          <button type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu" className="-ml-2 rounded-lg p-2.5 text-gray-700 hover:bg-gray-100">
            <HiOutlineBars3 className="text-2xl" />
          </button>
          <span className="flex-1 font-bold text-primary">
            NoTension <span className="font-medium text-gray-500">Admin</span>
          </span>
          <Link
            href="/"
            aria-label="Home page"
            title="Home page"
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            <HiOutlineHome className="text-xl" />
          </Link>
          <ThemeToggle className="-mr-1" />
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
