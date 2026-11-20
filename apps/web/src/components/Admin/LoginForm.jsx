"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { adminApi } from "./api";
import { Button, ErrorBox, Field, Input } from "./ui";

export default function LoginForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await adminApi("/login", { method: "POST", body: { phone: phone.trim(), password } });
      queryClient.setQueryData(["admin", "me"], res.result);
      router.replace("/admin");
    } catch (err) {
      setError(err);
      setBusy(false);
    }
  };

  return (
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
      <Button type="submit" className="w-full" loading={busy}>
        Log in
      </Button>
    </form>
  );
}
