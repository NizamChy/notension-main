"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useAdmin } from "@/components/Admin/AdminShell";
import { Button, Card, ErrorBox, Field, Input, Notice, PageHeader, RoleBadge, type ErrorLike } from "@/components/Admin/ui";
import { adminApi } from "@/components/Admin/api";
import { isDemoAccountPhone } from "@notension/shared";

export default function AccountPage() {
  const { me } = useAdmin();
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ErrorLike>(null);
  const [notice, setNotice] = useState<ReactNode>(null);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    if (form.next.length < 8) return setError("Use at least 8 characters for the new password.");
    if (form.next !== form.confirm) return setError("The two new passwords don't match.");
    setBusy(true);
    try {
      const res = await adminApi("/password", { method: "POST", body: { current: form.current, next: form.next } });
      setNotice(`${res.message}. You've been signed out on your other devices.`);
      setForm({ current: "", next: "", confirm: "" });
    } catch (err) {
      setError(err as Error);
    }
    setBusy(false);
  };

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
            <ErrorBox error={error} />
            <Notice>{notice}</Notice>
            <input type="hidden" autoComplete="username" value={me.phone || ""} readOnly />
            <Field label="Current password">
              <Input type="password" autoComplete="current-password" value={form.current} onChange={(e) => setForm({ ...form, current: e.target.value })} required />
            </Field>
            <Field label="New password" hint="At least 8 characters.">
              <Input type="password" autoComplete="new-password" value={form.next} onChange={(e) => setForm({ ...form, next: e.target.value })} required />
            </Field>
            <Field label="Confirm new password">
              <Input type="password" autoComplete="new-password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} required />
            </Field>
            <Button type="submit" loading={busy}>
              Change password
            </Button>
          </form>
          )}
        </Card>
      </div>
    </>
  );
}
