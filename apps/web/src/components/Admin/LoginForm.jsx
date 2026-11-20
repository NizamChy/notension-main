"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from "@notension/shared";
import { adminApi, roleLabel } from "./api";
import { Button, cx, ErrorBox, Field, Input, Spinner } from "./ui";

export default function LoginForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [demoBusy, setDemoBusy] = useState(null);

  const signIn = async (p, pw) => {
    setError(null);
    setBusy(true);
    try {
      const res = await adminApi("/login", { method: "POST", body: { phone: p.trim(), password: pw } });
      queryClient.setQueryData(["admin", "me"], res.result);
      router.replace("/admin");
      return true;
    } catch (err) {
      setError(err);
      setBusy(false);
      return false;
    }
  };

  const submit = (e) => {
    e.preventDefault();
    signIn(phone, password);
  };

  // One click: fill the form with a demo account and sign in.
  const demoSignIn = async (a) => {
    setPhone(a.phone);
    setPassword(DEMO_PASSWORD);
    setDemoBusy(a.phone);
    if (!(await signIn(a.phone, DEMO_PASSWORD))) setDemoBusy(null);
  };

  return (
    <>
      <form onSubmit={submit} className="space-y-4">
        <ErrorBox error={error} />
        <Field label="Mobile number">
          <Input
            type="tel"
            inputMode="tel"
            autoComplete="username"
            placeholder="01XXXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </Field>
        <Field label="Password">
          <Input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Field>
        <Button type="submit" className="w-full py-2.5" loading={busy && !demoBusy}>
          Log in
        </Button>
      </form>

      <section aria-labelledby="demo-accounts-heading" className="mt-6 border-t border-gray-200 pt-5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <h2 id="demo-accounts-heading" className="text-sm font-semibold text-gray-900">
            Demo accounts
          </h2>
          <Link href="/demo-accounts" className="text-xs font-medium text-primary hover:underline">
            Full list and PDF
          </Link>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Tap a role to sign in. Password for all: <span className="font-mono font-semibold text-gray-800">{DEMO_PASSWORD}</span>
        </p>
        <ul className="mt-3 divide-y divide-gray-100 overflow-hidden rounded-lg border border-gray-200">
          {DEMO_ACCOUNTS.map((a) => (
            <li key={a.phone}>
              <button
                type="button"
                disabled={busy}
                onClick={() => demoSignIn(a)}
                className={cx(
                  "flex min-h-12 w-full items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 disabled:cursor-not-allowed",
                  demoBusy === a.phone ? "bg-primary/5" : "",
                )}
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-gray-900">
                    {roleLabel(a.role)}
                    {a.storeName ? <span className="font-normal text-gray-500"> · {a.storeName}</span> : null}
                  </span>
                  <span className="block font-mono text-xs text-gray-500">{a.phone}</span>
                </span>
                {demoBusy === a.phone ? (
                  <Spinner small />
                ) : (
                  <span className="shrink-0 text-xs font-medium text-primary">Sign in</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
