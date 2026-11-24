"use client";

import { useState, type ReactNode } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { admin } from "@notension/shared";
import { useAdmin } from "@/components/Admin/AdminShell";
import { adminApi, formatDate, roleLabel, titleCase } from "@/components/Admin/api";
import { grantableRoles, STORE_ROLES } from "@/components/Admin/perms";
import ProfileLinks from "@/components/Admin/ProfileLinks";
import { errorText, roleName } from "@/components/Admin/forms";
import type { AdminUser, Role } from "@/components/Admin/types";
import { useZodForm } from "@/lib/forms/useZodForm";
import {
  Badge,
  Button,
  Card,
  ConfirmButton,
  Empty,
  ErrorBox,
  Field,
  Input,
  Loading,
  Notice,
  PageHeader,
  Pagination,
  RoleBadge,
  Select,
  SetupLinkBox,
  type ErrorLike,
} from "@/components/Admin/ui";

type StorePickerProps = {
  value: string;
  onChange: (storeId: string) => void;
  "aria-invalid"?: true;
  "aria-describedby"?: string;
};

function StorePicker({ value, onChange, ...aria }: StorePickerProps) {
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const stores = useQuery({
    queryKey: ["admin", "stores", { q: search, page: 1, module: "" }],
    queryFn: () => adminApi("/stores", { query: { q: search, page: 1 }, result: admin.store.array() }),
  });
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder="Find store by name or code"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              setSearch(q.trim());
            }
          }}
        />
        <Button variant="secondary" onClick={() => setSearch(q.trim())}>
          Find
        </Button>
      </div>
      <Select {...aria} value={value} onChange={(e) => onChange(e.target.value)} required aria-label="Store">
        <option value="">{stores.isPending ? "Loading stores…" : `Choose a store (${stores.data?.total ?? 0} found)`}</option>
        {(stores.data?.result || []).map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} · {s.code} · {titleCase(s.module)}
          </option>
        ))}
      </Select>
    </div>
  );
}

// POST /roles, with the API's own checks; a store role needs a store.
const addRoleSchema = z
  .object({ phone: admin.roleInput.shape.phone, name: roleName, role: z.string(), storeId: z.string() })
  .refine((v) => !STORE_ROLES.includes(v.role as Role) || v.storeId !== "", {
    path: ["storeId"],
    message: "Choose the store for this role",
  });

function AddRole({ onAdded }: { onAdded: () => Promise<unknown> }) {
  const { perms } = useAdmin();
  const roles = grantableRoles(perms);
  // role: one of `roles` (the select's options), or "" when there are none.
  const form = useZodForm(addRoleSchema, {
    defaultValues: { phone: "", name: "", role: roles.includes("merchant_owner") ? "merchant_owner" : roles[0] || "", storeId: "" },
  });
  const errors = form.formState.errors;
  const [notice, setNotice] = useState<ReactNode>(null);
  const [link, setLink] = useState<string | null>(null);
  const needsStore = STORE_ROLES.includes(form.watch("role") as Role);
  const addRole = useMutation({
    mutationFn: (body: Record<string, string | null | undefined>) => adminApi("/roles", { method: "POST", body, result: admin.setupLinkResult }),
    onSuccess: async (res) => {
      setNotice(
        res.result.setupLink ? res.message : `${res.message}. They already have a password, so they can log in at /admin/login.`,
      );
      setLink(res.result.setupLink);
      form.reset({ ...form.getValues(), phone: "", name: "" });
      await onAdded();
    },
  });

  if (!roles.length) return null;

  const submit = form.handleSubmit((values) => {
    setNotice(null);
    setLink(null);
    addRole.mutate({
      phone: values.phone.trim(),
      name: values.name.trim() || undefined,
      role: values.role,
      storeId: needsStore ? values.storeId : null,
    });
  });

  return (
    <Card className="mb-4">
      <h2 className="mb-1 font-semibold text-gray-900">Add a staff role</h2>
      <p className="mb-3 text-sm text-gray-500">
        Enter their mobile number. If they&apos;re new, an account is made and you get a setup link to send them.
      </p>
      <ErrorBox error={addRole.error} />
      <Notice>{notice}</Notice>
      <SetupLinkBox link={link} onClose={() => setLink(null)} />
      <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Mobile number" error={errorText(errors, "phone")}>
          {(a) => <Input {...a} type="tel" placeholder="01XXXXXXXXX" {...form.register("phone")} required />}
        </Field>
        <Field label="Name (optional)" error={errorText(errors, "name")}>
          {(a) => <Input {...a} {...form.register("name")} />}
        </Field>
        <Field label="Role" error={errorText(errors, "role")}>
          {(a) => (
          <Select {...a} {...form.register("role")}>
            {roles.map((r) => (
              <option key={r} value={r}>
                {roleLabel(r)}
              </option>
            ))}
          </Select>
          )}
        </Field>
        {needsStore ? (
          <Field label="Store" className="sm:col-span-2" error={errorText(errors, "storeId")}>
            {(a) => (
              <Controller
                control={form.control}
                name="storeId"
                render={({ field }) => <StorePicker {...a} value={field.value} onChange={field.onChange} />}
              />
            )}
          </Field>
        ) : null}
        <div className="flex items-end">
          <Button type="submit" loading={addRole.isPending}>
            Add role
          </Button>
        </div>
      </form>
    </Card>
  );
}

function UserCard({ u, onChanged }: { u: AdminUser; onChanged: () => Promise<unknown> }) {
  const { perms } = useAdmin();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<ErrorLike>(null);
  const [notice, setNotice] = useState<ReactNode>(null);
  const [link, setLink] = useState<string | null>(null);
  const staffRoles = u.roles.filter((r) => r.role !== "customer");
  const isSelf = u.id === perms.userId;
  // Demo accounts keep the demo password; protected super admins are
  // changed only by themselves (the API enforces both).
  const locked = u.isProtected && !isSelf;
  const canLink = !u.isDemo && !locked && staffRoles.length > 0 && staffRoles.every((r) => perms.manageRole(r.role, r.storeId));

  const run = async (key: string, fn: () => Promise<void>) => {
    setBusy(key);
    setError(null);
    setNotice(null);
    try {
      await fn();
    } catch (err) {
      setError(err as Error);
    }
    setBusy(null);
  };

  return (
    <li className="py-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-medium text-gray-900">
            {u.name || "No name"} {isSelf ? <span className="text-xs text-gray-500">(you)</span> : null}
          </p>
          <p className="text-xs text-gray-500">
            {u.phone}
            {u.code ? ` · ${u.code}` : ""} · joined {formatDate(u.createdAt)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {u.isDemo ? <Badge tone="amber">Demo</Badge> : null}
          {u.isProtected ? <Badge tone="purple">Protected</Badge> : null}
          {u.banned ? <Badge tone="red">Blocked</Badge> : null}
          {canLink ? (
            <Button
              size="sm"
              variant="ghost"
              loading={busy === "link"}
              onClick={() =>
                run("link", async () => {
                  const res = await adminApi(`/users/${u.id}/setup-link`, { method: "POST", result: admin.setupLinkResult });
                  setLink(res.result.setupLink);
                })
              }
            >
              New setup link
            </Button>
          ) : null}
          {perms.canBlock && !isSelf && !locked ? (
            u.banned ? (
              <Button
                size="sm"
                variant="secondary"
                loading={busy === "ban"}
                onClick={() =>
                  run("ban", async () => {
                    await adminApi(`/users/${u.id}`, { method: "PATCH", body: { banned: false } });
                    await onChanged();
                  })
                }
              >
                Unblock
              </Button>
            ) : (
              <ConfirmButton
                label="Block"
                question="Block this account? They are signed out everywhere."
                confirmLabel="Block"
                loading={busy === "ban"}
                onConfirm={() =>
                  run("ban", async () => {
                    await adminApi(`/users/${u.id}`, { method: "PATCH", body: { banned: true } });
                    await onChanged();
                  })
                }
              />
            )
          ) : null}
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {u.roles.map((r) =>
          r.role === "customer" ? (
            <Badge key={r.id}>Customer</Badge>
          ) : (
            <span key={r.id} className="inline-flex items-center gap-1">
              <RoleBadge role={r} />
              {perms.manageRole(r.role, r.storeId) && !locked ? (
                <ConfirmButton
                  label="×"
                  question={`Remove ${roleLabel(r.role).toLowerCase()}?`}
                  confirmLabel="Remove"
                  loading={busy === r.id}
                  onConfirm={() =>
                    run(r.id, async () => {
                      const res = await adminApi(`/roles/${r.id}`, { method: "DELETE" });
                      setNotice(res.message);
                      await onChanged();
                    })
                  }
                />
              ) : null}
            </span>
          ),
        )}
      </div>
      <ProfileLinks user={u} />
      <div className="mt-2">
        <ErrorBox error={error} />
        <Notice>{notice}</Notice>
        <SetupLinkBox link={link} onClose={() => setLink(null)} />
      </div>
    </li>
  );
}

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({ q: "", role: "", page: 1 });
  const [search, setSearch] = useState("");

  const users = useQuery({
    queryKey: ["admin", "users", filters],
    queryFn: () => adminApi("/users", { query: filters, result: admin.adminUser.array() }),
    placeholderData: keepPreviousData,
  });
  const reload = () => queryClient.invalidateQueries({ queryKey: ["admin", "users"] });

  return (
    <>
      <PageHeader title="Users & roles" subtitle="Find anyone by name or phone, and manage staff access." />
      <AddRole onAdded={reload} />

      <Card className="mb-4">
        <form
          className="grid gap-2 sm:grid-cols-[1fr_200px_auto]"
          onSubmit={(e) => {
            e.preventDefault();
            setFilters({ ...filters, q: search.trim(), page: 1 });
          }}
        >
          <Input placeholder="Name or phone number" value={search} onChange={(e) => setSearch(e.target.value)} />
          <Select value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value, page: 1 })} aria-label="Role">
            <option value="">Everyone</option>
            {[
              "super_admin",
              "admin",
              "support",
              "finance",
              "content_manager",
              "merchant_owner",
              "merchant_manager",
              "merchant_staff",
              "rider",
              "doctor",
              "service_provider",
              "customer",
            ].map((r) => (
              <option key={r} value={r}>
                {roleLabel(r)}
              </option>
            ))}
          </Select>
          <Button type="submit" variant="secondary">
            Search
          </Button>
        </form>
      </Card>

      <Card>
        <ErrorBox error={users.error} onRetry={() => users.refetch()} />
        {users.isPending ? (
          <Loading />
        ) : users.data?.result.length ? (
          <>
            <ul className="divide-y divide-gray-100">
              {users.data.result.map((u) => (
                <UserCard key={u.id} u={u} onChanged={reload} />
              ))}
            </ul>
            <Pagination page={filters.page} total={users.data.total} pageSize={users.data.pageSize} onPage={(page) => setFilters({ ...filters, page })} />
          </>
        ) : (
          <Empty>No users found.</Empty>
        )}
      </Card>
    </>
  );
}
