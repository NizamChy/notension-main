"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { admin } from "@notension/shared";
import { adminApi } from "./api";
import { errorText, setupForm } from "./forms";
import { Button, ErrorBox, Field, Input, Loading } from "./ui";
import { useZodForm } from "@/lib/forms/useZodForm";

export default function SetupForm() {
  const token = useSearchParams().get("token") || "";
  const router = useRouter();
  const queryClient = useQueryClient();
  const form = useZodForm(setupForm, { defaultValues: { password: "", confirm: "" } });
  const errors = form.formState.errors;

  const who = useQuery({
    queryKey: ["admin", "setup", token],
    queryFn: () => adminApi("/setup", { query: { token }, result: admin.setupWho }).then((r) => r.result),
    enabled: !!token,
    retry: false,
    // The link is used up once the password is set; don't re-check it.
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
  const setup = useMutation({
    mutationFn: (password: string) => adminApi("/setup", { method: "POST", body: { token, password }, result: admin.me }),
    onSuccess: (res) => {
      queryClient.setQueryData(["admin", "me"], res.result);
      router.replace("/admin");
    },
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

  const submit = form.handleSubmit(({ password }) => setup.mutate(password));

  return (
    <form onSubmit={submit} className="space-y-4">
      <p className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">
        Welcome{who.data?.name ? `, ${who.data.name}` : ""}! You&apos;ll log in with{" "}
        <span className="font-semibold">{who.data?.phone}</span> and the password you choose now.
      </p>
      <ErrorBox error={setup.error} />
      {/* Lets password managers save the phone number with the password. */}
      <input type="hidden" autoComplete="username" value={who.data?.phone || ""} readOnly />
      <Field label="New password" hint="At least 8 characters." error={errorText(errors, "password")}>
        {(a) => <Input {...a} type="password" autoComplete="new-password" minLength={8} {...form.register("password")} required />}
      </Field>
      <Field label="Confirm password" error={errorText(errors, "confirm")}>
        {(a) => <Input {...a} type="password" autoComplete="new-password" {...form.register("confirm")} required />}
      </Field>
      <Button type="submit" className="w-full" loading={setup.isPending || setup.isSuccess}>
        Set password and continue
      </Button>
    </form>
  );
}
