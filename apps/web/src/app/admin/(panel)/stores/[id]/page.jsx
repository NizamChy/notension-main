"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAdmin } from "@/components/Admin/AdminShell";
import { adminApi, roleLabel, taka, titleCase } from "@/components/Admin/api";
import { STORE_ROLES } from "@/components/Admin/perms";
import { ADMIN_FIELDS, changedFields, MERCHANT_FIELDS, StoreFields, toForm, useKnownDistricts } from "@/components/Admin/StoreFields";
import {
  Badge,
  Button,
  ButtonLink,
  Card,
  ConfirmButton,
  Empty,
  ErrorBox,
  Field,
  Input,
  Loading,
  Notice,
  PageHeader,
  Select,
  SetupLinkBox,
} from "@/components/Admin/ui";

function SettingsForm({ store, isAdmin, notice, setNotice }) {
  const queryClient = useQueryClient();
  const fields = isAdmin ? [...ADMIN_FIELDS, ...MERCHANT_FIELDS] : MERCHANT_FIELDS;
  const [form, setForm] = useState(() => toForm(fields, store));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const districts = useKnownDistricts(isAdmin);
  const changes = changedFields(fields, form, store);
  const dirty = Object.keys(changes).length > 0;

  const save = async (e) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    if (!dirty) return;
    setBusy(true);
    try {
      const res = await adminApi(`/stores/${store.id}`, { method: "PATCH", body: changes });
      setNotice(res.message);
      await queryClient.invalidateQueries({ queryKey: ["admin", "store", store.id] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stores"] });
    } catch (err) {
      setError(err);
    }
    setBusy(false);
  };

  return (
    <form onSubmit={save}>
      <ErrorBox error={error} />
      <Notice>{notice}</Notice>
      {isAdmin ? (
        <>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Store (admin only)</h3>
          <StoreFields
            fields={ADMIN_FIELDS}
            form={form}
            setForm={setForm}
            districts={districts.data}
            current={{ id: store.districtId, name: store.districtName || store.districtId }}
          />
          <h3 className="mt-6 mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Day-to-day settings</h3>
        </>
      ) : null}
      <StoreFields fields={MERCHANT_FIELDS} form={form} setForm={setForm} />
      <div className="mt-5 flex items-center gap-3">
        <Button type="submit" loading={busy} disabled={!dirty}>
          Save changes
        </Button>
        {dirty ? (
          <>
            <span className="text-xs text-gray-500">{Object.keys(changes).length} unsaved change(s)</span>
            <Button variant="ghost" size="sm" onClick={() => setForm(toForm(fields, store))}>
              Undo
            </Button>
          </>
        ) : null}
      </div>
    </form>
  );
}

function ReadOnlySettings({ store }) {
  const rows = [
    ["Address", [store.address, store.areaName, store.districtName].filter(Boolean).join(", ")],
    ["Phone", [store.phone, store.altPhone].filter(Boolean).join(", ") || "—"],
    ["Hours", store.opensAt || store.closesAt ? `${store.opensAt || "?"} – ${store.closesAt || "?"}` : "—"],
    ["Minimum order", taka(store.minOrder)],
    ["Delivery charge", `${taka(store.minDeliveryCharge)} – ${taka(store.maxDeliveryCharge)}`],
    ["Discount", store.discount ? (store.discountType === "percent" ? `${store.discount}%` : taka(store.discount)) : "None"],
    ["Delivery notice", store.deliveryNotice || "—"],
  ];
  return (
    <dl className="divide-y divide-gray-100 text-sm">
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between gap-4 py-2">
          <dt className="text-gray-500">{k}</dt>
          <dd className="text-right text-gray-900">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function StaffSection({ store }) {
  const { perms } = useAdmin();
  const queryClient = useQueryClient();
  const addable = STORE_ROLES.filter((r) => perms.manageRole(r, store.id));
  const [form, setForm] = useState({ phone: "", name: "", role: addable.includes("merchant_staff") ? "merchant_staff" : addable[0] || "" });
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [link, setLink] = useState(null);

  const run = async (key, fn) => {
    setBusy(key);
    setError(null);
    setNotice(null);
    try {
      await fn();
    } catch (err) {
      setError(err);
    }
    setBusy(null);
  };

  const add = (e) => {
    e.preventDefault();
    run("add", async () => {
      const res = await adminApi("/roles", {
        method: "POST",
        body: { phone: form.phone.trim(), name: form.name.trim() || undefined, role: form.role, storeId: store.id },
      });
      setNotice(res.message);
      setLink(res.result.setupLink);
      setForm((f) => ({ ...f, phone: "", name: "" }));
      await queryClient.invalidateQueries({ queryKey: ["admin", "store", store.id] });
    });
  };

  const remove = (s) =>
    run(`rm-${s.id}`, async () => {
      const res = await adminApi(`/roles/${s.id}`, { method: "DELETE" });
      setNotice(res.message);
      await queryClient.invalidateQueries({ queryKey: ["admin", "store", store.id] });
    });

  const newLink = (s) =>
    run(`link-${s.id}`, async () => {
      const res = await adminApi(`/users/${s.userId}/setup-link`, { method: "POST" });
      setLink(res.result.setupLink);
      setNotice(`New setup link for ${s.name || s.phone}. Any older link stops working.`);
    });

  return (
    <Card>
      <h2 className="mb-3 font-semibold text-gray-900">Store team</h2>
      <ErrorBox error={error} />
      <Notice>{notice}</Notice>
      <SetupLinkBox link={link} onClose={() => setLink(null)} />
      {store.staff.length ? (
        <ul className="divide-y divide-gray-100">
          {store.staff.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900">{s.name || "No name"}</p>
                <p className="text-xs text-gray-500">{s.phone}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="blue">{roleLabel(s.role)}</Badge>
                {perms.manageRole(s.role, store.id) && s.userId !== perms.userId ? (
                  <>
                    <Button variant="ghost" size="sm" loading={busy === `link-${s.id}`} onClick={() => newLink(s)}>
                      New setup link
                    </Button>
                    <ConfirmButton
                      label="Remove"
                      question={`Remove ${roleLabel(s.role).toLowerCase()} role?`}
                      confirmLabel="Remove"
                      loading={busy === `rm-${s.id}`}
                      onConfirm={() => remove(s)}
                    />
                  </>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <Empty>No one is assigned to this store yet.</Empty>
      )}

      {addable.length ? (
        <form onSubmit={add} className="mt-4 border-t border-gray-200 pt-4">
          <p className="mb-2 text-sm font-medium text-gray-700">Add someone to this store</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <Field label="Mobile number">
              <Input type="tel" placeholder="01XXXXXXXXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            </Field>
            <Field label="Name (optional)">
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Role">
              <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                {addable.map((r) => (
                  <option key={r} value={r}>
                    {roleLabel(r)}
                  </option>
                ))}
              </Select>
            </Field>
            <div className="flex items-end">
              <Button type="submit" loading={busy === "add"} className="w-full sm:w-auto">
                Add and get setup link
              </Button>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            New people get a setup link to choose their password. If they already have a password, they just log in.
          </p>
        </form>
      ) : null}
    </Card>
  );
}

export default function StoreDetailPage() {
  const { id } = useParams();
  const { perms } = useAdmin();
  const [notice, setNotice] = useState(null);
  const store = useQuery({
    queryKey: ["admin", "store", id],
    queryFn: () => adminApi(`/stores/${id}`).then((r) => r.result),
  });

  if (store.isPending) return <Loading />;
  if (store.error) return <ErrorBox error={store.error} onRetry={() => store.refetch()} />;
  const s = store.data;
  const canEdit = perms.editStore(s.id);

  return (
    <>
      <PageHeader
        back={perms.seeAllStores || perms.stores.size > 1 ? { href: "/admin/stores", label: "Stores" } : undefined}
        title={s.name}
        subtitle={`${s.code} · ${titleCase(s.module)}${s.districtName ? ` · ${s.districtName}` : ""}`}
        actions={
          <>
            {perms.seeItems(s.id) ? <ButtonLink href={`/admin/stores/${s.id}/items`}>Items</ButtonLink> : null}
            {perms.seeOrders ? (
              <ButtonLink variant="secondary" href={`/admin/orders?storeId=${s.id}`}>
                Orders
              </ButtonLink>
            ) : null}
          </>
        }
      />
      <div className="mb-4 flex flex-wrap gap-1.5">
        {s.isBanned ? <Badge tone="red">Banned</Badge> : null}
        {!s.isActive ? <Badge>Inactive</Badge> : null}
        {s.isClosed ? <Badge tone="amber">Closed now</Badge> : <Badge tone="green">Taking orders</Badge>}
        {!s.showPrice ? <Badge>Prices hidden</Badge> : null}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
        <Card>
          <h2 className="mb-4 font-semibold text-gray-900">Settings</h2>
          {canEdit ? (
            // Remounts after a save so the form starts from the saved values; the
            // "saved" message lives here so it survives that.
            <SettingsForm key={store.dataUpdatedAt} store={s} isAdmin={perms.isAdmin} notice={notice} setNotice={setNotice} />
          ) : (
            <ReadOnlySettings store={s} />
          )}
        </Card>
        <StaffSection store={s} />
      </div>
    </>
  );
}
