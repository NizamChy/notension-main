"use client";

import { useState, type ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import type { z } from "zod";
import { useAdmin } from "@/components/Admin/AdminShell";
import { Button, Card, ErrorBox, Field, Input, Notice, PageHeader, RoleBadge } from "@/components/Admin/ui";
import { adminApi } from "@/components/Admin/api";
import { errorText, passwordForm } from "@/components/Admin/forms";
import { useZodForm } from "@/lib/forms/useZodForm";
import { isDemoAccountPhone } from "@notension/shared";

const EMPTY = { current: "", next: "", confirm: "" };

export default function AccountPage() {
  const { me } = useAdmin();
  const form = useZodForm(passwordForm, { defaultValues: EMPTY });
  const errors = form.formState.errors;
  const [notice, setNotice] = useState<ReactNode>(null);
  const change = useMutation({
    mutationFn: ({ current, next }: z.infer<typeof passwordForm>) =>
      adminApi("/password", { method: "POST", body: { current, next } }),
    onSuccess: (res) => {
      setNotice(`${res.message}. You've been signed out on your other devices.`);
      form.reset(EMPTY);
    },
  });

  const submit = form.handleSubmit((values) => {
    setNotice(null);
    change.mutate(values);
  });

  return (
    <>
      <PageHeader title="Account" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 font-semibold text-gray-900">You</h2>
          <p className="text-sm text-gray-900">{me.name || "No name"}</p>
          <p className="text-sm text-gray-500">{me.phone}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {me.roles.map((r, i) => (
              <RoleBadge key={i} role={r} />
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="mb-3 font-semibold text-gray-900">Change password</h2>
          {isDemoAccountPhone(me.phone) ? (
            <Notice tone="warning">This is a public demo account. Its password stays the demo password and can&apos;t be changed.</Notice>
          ) : (
          <form onSubmit={submit} className="space-y-3">
            <ErrorBox error={change.error} />
            <Notice>{notice}</Notice>
            <input type="hidden" autoComplete="username" value={me.phone || ""} readOnly />
            <Field label="Current password" error={errorText(errors, "current")}>
              {(a) => <Input {...a} type="password" autoComplete="current-password" {...form.register("current")} required />}
            </Field>
            <Field label="New password" hint="At least 8 characters." error={errorText(errors, "next")}>
              {(a) => <Input {...a} type="password" autoComplete="new-password" {...form.register("next")} required />}
            </Field>
            <Field label="Confirm new password" error={errorText(errors, "confirm")}>
              {(a) => <Input {...a} type="password" autoComplete="new-password" {...form.register("confirm")} required />}
            </Field>
            <Button type="submit" loading={change.isPending}>
              Change password
            </Button>
          </form>
          )}
        </Card>
      </div>
    </>
  );
}
