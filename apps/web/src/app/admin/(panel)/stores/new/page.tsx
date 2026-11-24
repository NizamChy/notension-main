"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { admin } from "@notension/shared";
import { useAdmin } from "@/components/Admin/AdminShell";
import { adminApi, MODULES, titleCase } from "@/components/Admin/api";
import { errorText } from "@/components/Admin/forms";
import {
  ADMIN_FIELDS,
  fromForm,
  StoreFields,
  storeFormSchema,
  toForm,
  useKnownDistricts,
  type StoreField,
  type StoreForm,
} from "@/components/Admin/StoreFields";
import type { Store } from "@/components/Admin/types";
import { Button, ButtonLink, Card, ErrorBox, Field, Input, Notice, PageHeader, Select, SetupLinkBox } from "@/components/Admin/ui";
import { useZodForm } from "@/lib/forms/useZodForm";

const FIELDS: StoreField[] = [
  ...ADMIN_FIELDS.filter((f) => f.key !== "isBanned"),
  { key: "phone", label: "Store phone", kind: "text" },
];
const NEW_STORE: Partial<Store> = { isActive: true, showPrice: true };
// The fields plus the module and the owner's phone (the API checks the phone).
const schema = storeFormSchema(FIELDS, undefined, { module: admin.moduleName, ownerPhone: z.string() });

export default function NewStorePage() {
  const { perms } = useAdmin();
  const queryClient = useQueryClient();
  const form = useZodForm(schema, { defaultValues: { ...toForm(FIELDS, NEW_STORE), module: "grocery", ownerPhone: "" } });
  const districts = useKnownDistricts(perms.canCreateStore);
  const create = useMutation({
    mutationFn: (body: Record<string, string | number | boolean | null>) =>
      adminApi("/stores", { method: "POST", body, result: admin.createdStore }).then((r) => r.result),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin"] }),
  });
  const created = create.data;
  const ownerPhone = String(form.watch("ownerPhone") ?? "");

  if (!perms.canCreateStore) return <ErrorBox error="Only admins can add stores." />;

  const submit = form.handleSubmit((values: StoreForm) => {
    const body: Record<string, string | number | boolean | null> = { module: values.module as string };
    for (const f of FIELDS) {
      if (f.kind !== "bool" && values[f.key] === "") continue;
      body[f.key] = fromForm(f, values[f.key]);
    }
    if (ownerPhone.trim()) body.ownerPhone = ownerPhone.trim();
    create.mutate(body);
  });

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
          <ErrorBox error={create.error} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Module">
              <Select {...form.register("module")}>
                {MODULES.map((m) => (
                  <option key={m} value={m}>
                    {titleCase(m)}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Owner's mobile number (optional)" hint="They become the store owner and get a setup link." error={errorText(form.formState.errors, "ownerPhone")}>
              {(a) => <Input {...a} type="tel" placeholder="01XXXXXXXXX" {...form.register("ownerPhone")} />}
            </Field>
          </div>
          <StoreFields fields={FIELDS} form={form} districts={districts.data} />
          <p className="text-xs text-gray-500">
            Name, address, district, latitude and longitude are required. Prices, hours and delivery rules can be set on the store page
            afterwards.{" "}
            <a href="https://www.google.com/maps" target="_blank" rel="noreferrer" className="text-primary underline">
              Google Maps
            </a>{" "}
            shows latitude and longitude when you right-click a place.
          </p>
          <Button type="submit" loading={create.isPending}>
            Add store
          </Button>
        </form>
      </Card>
    </>
  );
}
