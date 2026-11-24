"use client";

// Doctor panel: my public profile (the fields a doctor may change).
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { admin } from "@notension/shared";
import { adminApi } from "@/components/Admin/api";
import { apiChecked, asNumber, asText, errorText } from "@/components/Admin/forms";
import { ProfileError, useDoctorProfile } from "@/components/Admin/DoctorPanel";
import type { DoctorProfile } from "@/components/Admin/types";
import { Button, Card, Field, Input, Loading, PageHeader } from "@/components/Admin/ui";
import { useZodForm } from "@/lib/forms/useZodForm";
import { notify } from "@/utils/notify";

const FIELDS = ["speciality", "designation", "qualifications", "experienceYears", "consultationFee", "followUpFee"] as const;
const NUMBERS: readonly string[] = ["experienceYears", "consultationFee", "followUpFee"];

// Each field checked by the API's own schema (admin.doctorProfileFields)
// on the value it gets. Inputs hold strings.
const api = admin.doctorProfileFields.shape;
const profileSchema = z.object(
  Object.fromEntries(FIELDS.map((k) => [k, apiChecked(api[k], NUMBERS.includes(k) ? asNumber : asText)])) as Record<
    (typeof FIELDS)[number],
    z.ZodString
  >,
);
type ProfileValues = z.infer<typeof profileSchema>;

function ProfileForm({ doc, onSaved }: { doc: DoctorProfile; onSaved: () => Promise<unknown> }) {
  const [initial] = useState(() => Object.fromEntries(FIELDS.map((k) => [k, String(doc[k] ?? "")])) as ProfileValues);
  const form = useZodForm(profileSchema, { defaultValues: initial });
  const errors = form.formState.errors;
  const save = useMutation({
    mutationFn: (values: ProfileValues) => {
      const body = Object.fromEntries(FIELDS.map((k) => [k, NUMBERS.includes(k) ? Number(values[k] || 0) : values[k].trim()]));
      return adminApi("/doctor/profile", { method: "PATCH", body });
    },
    onSuccess: async (res) => {
      notify.success(res.message ?? "Done");
      await onSaved();
    },
    onError: (err) => notify.error(err.message),
  });
  const busy = save.isPending;
  const submit = form.handleSubmit((values) => save.mutate(values));

  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
      <Field label="Speciality" error={errorText(errors, "speciality")}>
        {(a) => <Input {...a} {...form.register("speciality")} maxLength={200} />}
      </Field>
      <Field label="Designation" error={errorText(errors, "designation")}>
        {(a) => <Input {...a} {...form.register("designation")} maxLength={200} />}
      </Field>
      <Field label="Qualifications" className="sm:col-span-2" error={errorText(errors, "qualifications")}>
        {(a) => <Input {...a} {...form.register("qualifications")} maxLength={500} placeholder="MBBS, FCPS (Medicine)" />}
      </Field>
      <Field label="Years of experience" error={errorText(errors, "experienceYears")}>
        {(a) => <Input {...a} type="number" min="0" max="80" inputMode="numeric" {...form.register("experienceYears")} />}
      </Field>
      <div className="hidden sm:block" />
      <Field label="Consultation fee (৳)" hint="Shown on your profile. Each chamber has its own fee too." error={errorText(errors, "consultationFee")}>
        {(a) => <Input {...a} type="number" min="0" inputMode="numeric" {...form.register("consultationFee")} />}
      </Field>
      <Field label="Follow-up fee (৳)" error={errorText(errors, "followUpFee")}>
        {(a) => <Input {...a} type="number" min="0" inputMode="numeric" {...form.register("followUpFee")} />}
      </Field>
      <div className="sm:col-span-2">
        <Button type="submit" loading={busy} className="min-h-11 w-full sm:w-auto">
          Save profile
        </Button>
      </div>
    </form>
  );
}

export default function DoctorProfilePage() {
  const queryClient = useQueryClient();
  const profile = useDoctorProfile();
  // Read only in the last branch below, once the profile has loaded.
  const doc = profile.data as DoctorProfile;

  return (
    <>
      <PageHeader title="Profile" subtitle="What patients see about you." />
      {profile.isPending ? (
        <Loading />
      ) : profile.error ? (
        <ProfileError error={profile.error} onRetry={() => profile.refetch()} />
      ) : (
        <>
          <Card className="mb-4">
            <p className="text-lg font-semibold text-gray-900">{doc.name}</p>
            <p className="text-sm text-gray-600">{doc.departmentName}</p>
            {doc.bmdcRegNo ? <p className="text-xs text-gray-500">BMDC reg. {doc.bmdcRegNo}</p> : null}
            <p className="mt-2 text-xs text-gray-500">Name, department and registration are changed by a NoTension admin.</p>
          </Card>
          <Card>
            <ProfileForm
              key={doc.id}
              doc={doc}
              onSaved={() => queryClient.invalidateQueries({ queryKey: ["admin", "doctor-profile"] })}
            />
          </Card>
        </>
      )}
    </>
  );
}
