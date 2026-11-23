"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "./api";
import type { Me, SetupWho } from "./types";
import { Button, ErrorBox, Field, Input, Loading, type ErrorLike } from "./ui";

export default function SetupForm() {
  const token = useSearchParams().get("token") || "";
  const router = useRouter();
  const queryClient = useQueryClient();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<ErrorLike>(null);
  const [busy, setBusy] = useState(false);

  const who = useQuery({
    queryKey: ["admin-setup", token],
    queryFn: () => adminApi<SetupWho>("/setup", { query: { token } }).then((r) => r.result),
    enabled: !!token,
    retry: false,
    // The link is used up once the password is set; don't re-check it.
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  if (!token || who.error) {
    return (
      <div className="space-y-4 text-center text-sm text-gray-600">
        <ErrorBox error={who.error?.message || "This link is missing its token."} />
        <p>Setup links work once and expire after 7 days. Ask the person who added you for a new link.</p>
        <Link href="/admin/login" className="font-medium text-primary hover:underline">
          Already have a password? Log in
        </Link>
      </div>
    );
  }
  if (who.isPending) return <Loading label="Checking your link…" />;

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) return setError("Use at least 8 characters.");
    if (password !== confirm) return setError("The two passwords don't match.");
    setBusy(true);
    try {
      const res = await adminApi<Me>("/setup", { method: "POST", body: { token, password } });
      queryClient.setQueryData(["admin", "me"], res.result);
      router.replace("/admin");
    } catch (err) {
      setError(err as Error);
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">
        Welcome{who.data?.name ? `, ${who.data.name}` : ""}! You&apos;ll log in with{" "}
        <span className="font-semibold">{who.data?.phone}</span> and the password you choose now.
      </p>
      <ErrorBox error={error} />
      {/* Lets password managers save the phone number with the password. */}
      <input type="hidden" autoComplete="username" value={who.data?.phone || ""} readOnly />
      <Field label="New password" hint="At least 8 characters.">
        <Input type="password" autoComplete="new-password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required />
      </Field>
      <Field label="Confirm password">
        <Input type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
      </Field>
      <Button type="submit" className="w-full" loading={busy}>
        Set password and continue
      </Button>
    </form>
  );
}
