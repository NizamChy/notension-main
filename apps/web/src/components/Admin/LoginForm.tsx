"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { z } from "zod";
import { admin, DEMO_ACCOUNTS, DEMO_PASSWORD } from "@notension/shared";
import { adminApi, roleLabel } from "./api";
import { errorText } from "./forms";
import { Button, cx, ErrorBox, Field, Input, Spinner } from "./ui";
import { useZodForm } from "@/lib/forms/useZodForm";

type DemoAccount = (typeof DEMO_ACCOUNTS)[number];
type LoginValues = z.infer<typeof admin.loginInput>;

export default function LoginForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const form = useZodForm(admin.loginInput, { defaultValues: { phone: "", password: "" } });
  const errors = form.formState.errors;
  const [demoBusy, setDemoBusy] = useState<string | null>(null);
  const login = useMutation({
    mutationFn: ({ phone, password }: LoginValues) =>
      adminApi("/login", { method: "POST", body: { phone: phone.trim(), password }, result: admin.me }),
    onSuccess: (res) => {
      queryClient.setQueryData(["admin", "me"], res.result);
      router.replace("/admin");
    },
    onError: () => setDemoBusy(null),
  });
  // Stays busy after success, while the panel loads.
  const busy = login.isPending || login.isSuccess;

  const submit = form.handleSubmit((values) => login.mutate(values));

  // One click: fill the form with a demo account and sign in.
  const demoSignIn = (a: DemoAccount) => {
    form.reset({ phone: a.phone, password: DEMO_PASSWORD });
    setDemoBusy(a.phone);
    login.mutate({ phone: a.phone, password: DEMO_PASSWORD });
  };

  return (
    <>
      <form onSubmit={submit} className="space-y-4">
        <ErrorBox error={login.error} />
        <Field label="Mobile number" error={errorText(errors, "phone")}>
          {(a) => (
            <Input
              {...a}
              type="tel"
              inputMode="tel"
              autoComplete="username"
              placeholder="01XXXXXXXXX"
              {...form.register("phone")}
              required
            />
          )}
        </Field>
        <Field label="Password" error={errorText(errors, "password")}>
          {(a) => <Input {...a} type="password" autoComplete="current-password" {...form.register("password")} required />}
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
            Full list
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
