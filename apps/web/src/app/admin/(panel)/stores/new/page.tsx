"use client";

import { useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAdmin } from "@/components/Admin/AdminShell";
import { adminApi, MODULES, titleCase } from "@/components/Admin/api";
import { ADMIN_FIELDS, fromForm, StoreFields, toForm, useKnownDistricts, type StoreField } from "@/components/Admin/StoreFields";
import type { CreatedStore, Module, Store } from "@/components/Admin/types";
import { Button, ButtonLink, Card, ErrorBox, Field, Input, Notice, PageHeader, Select, SetupLinkBox, type ErrorLike } from "@/components/Admin/ui";

const FIELDS: StoreField[] = [
  ...ADMIN_FIELDS.filter((f) => f.key !== "isBanned"),
  { key: "phone", label: "Store phone", kind: "text" },
];
const NEW_STORE: Partial<Store> = { isActive: true, showPrice: true };

export default function NewStorePage() {
  const { perms } = useAdmin();
  const queryClient = useQueryClient();
  const [module, setModule] = useState<Module>("grocery");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [form, setForm] = useState(() => toForm(FIELDS, NEW_STORE));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ErrorLike>(null);
  const [created, setCreated] = useState<CreatedStore | null>(null);
  const districts = useKnownDistricts(perms.canCreateStore);

  if (!perms.canCreateStore) return <ErrorBox error="Only admins can add stores." />;

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const body: Record<string, string | number | boolean | null> = { module };
    for (const f of FIELDS) {
      if (f.kind !== "bool" && form[f.key] === "") continue;
      body[f.key] = fromForm(f, form[f.key]);
    }
    if (ownerPhone.trim()) body.ownerPhone = ownerPhone.trim();
    setBusy(true);
    try {
      const res = await adminApi<CreatedStore>("/stores", { method: "POST", body });
      setCreated(res.result);
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    } catch (err) {
      setError(err as Error);
    }
    setBusy(false);
  };

  if (created) {
    return (
      <>
        <PageHeader back={{ href: "/admin/stores", label: "Stores" }} title="Store added" />
        <Card>
          <Notice>
            Store {created.code} was created{ownerPhone.trim() ? " and the owner was added" : ""}.
          </Notice>
          {created.setupLink ? (
            <SetupLinkBox link={created.setupLink} />
          ) : ownerPhone.trim() ? (
            <p className="mb-4 text-sm text-gray-600">The owner already has a password, so they can log in right away.</p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <ButtonLink href={`/admin/stores/${created.id}`}>Open store</ButtonLink>
            <ButtonLink variant="secondary" href={`/admin/stores/${created.id}/items`}>
              Add items
            </ButtonLink>
          </div>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader back={{ href: "/admin/stores", label: "Stores" }} title="Add store" />
      <Card>
        <form onSubmit={submit} className="space-y-4">
          <ErrorBox error={error} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Module">
              <Select value={module} onChange={(e) => setModule(e.target.value as Module)}>
                {MODULES.map((m) => (
                  <option key={m} value={m}>
                    {titleCase(m)}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Owner's mobile number (optional)" hint="They become the store owner and get a setup link.">
              <Input type="tel" placeholder="01XXXXXXXXX" value={ownerPhone} onChange={(e) => setOwnerPhone(e.target.value)} />
            </Field>
          </div>
          <StoreFields fields={FIELDS} form={form} setForm={setForm} districts={districts.data} />
          <p className="text-xs text-gray-500">
            Name, address, district, latitude and longitude are required. Prices, hours and delivery rules can be set on the store page
            afterwards.{" "}
            <a href="https://www.google.com/maps" target="_blank" rel="noreferrer" className="text-primary underline">
              Google Maps
            </a>{" "}
            shows latitude and longitude when you right-click a place.
          </p>
          <Button type="submit" loading={busy}>
            Add store
          </Button>
        </form>
      </Card>
    </>
  );
}
