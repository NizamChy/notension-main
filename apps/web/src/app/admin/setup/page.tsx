import type { Metadata } from "next";
import { Suspense } from "react";
import AuthCard from "@/components/Admin/AuthCard";
import SetupForm from "@/components/Admin/SetupForm";
import { Loading } from "@/components/Admin/ui";

export const metadata: Metadata = { title: "Set your password" };

export default function AdminSetupPage() {
  return (
    <AuthCard title="Set your password" subtitle="Choose the password for your NoTension staff account.">
      <Suspense fallback={<Loading />}>
        <SetupForm />
      </Suspense>
    </AuthCard>
  );
}
