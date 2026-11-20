"use client";

// Doctor panel: my public profile (the fields a doctor may change).
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/components/Admin/api";
import { ProfileError, useDoctorProfile } from "@/components/Admin/DoctorPanel";
import { Button, Card, Field, Input, Loading, PageHeader } from "@/components/Admin/ui";
import { notify } from "@/utils/notify";

const FIELDS = ["speciality", "designation", "qualifications", "experienceYears", "consultationFee", "followUpFee"];
const NUMBERS = ["experienceYears", "consultationFee", "followUpFee"];

function ProfileForm({ doc, onSaved }) {
  const [form, setForm] = useState(() => Object.fromEntries(FIELDS.map((k) => [k, doc[k] ?? ""])));
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const body = Object.fromEntries(FIELDS.map((k) => [k, NUMBERS.includes(k) ? Number(form[k] || 0) : String(form[k]).trim()]));
      const res = await adminApi("/doctor/profile", { method: "PATCH", body });
      notify.success(res.message);
      await onSaved();
    } catch (err) {
      notify.error(err.message);
    }
    setBusy(false);
  };

  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
      <Field label="Speciality">
        <Input value={form.speciality} onChange={set("speciality")} maxLength={200} />
      </Field>
      <Field label="Designation">
        <Input value={form.designation} onChange={set("designation")} maxLength={200} />
      </Field>
      <Field label="Qualifications" className="sm:col-span-2">
        <Input value={form.qualifications} onChange={set("qualifications")} maxLength={500} placeholder="MBBS, FCPS (Medicine)" />
      </Field>
      <Field label="Years of experience">
        <Input type="number" min="0" max="80" inputMode="numeric" value={form.experienceYears} onChange={set("experienceYears")} />
      </Field>
      <div className="hidden sm:block" />
      <Field label="Consultation fee (৳)" hint="Shown on your profile. Each chamber has its own fee too.">
        <Input type="number" min="0" inputMode="numeric" value={form.consultationFee} onChange={set("consultationFee")} />
      </Field>
      <Field label="Follow-up fee (৳)">
        <Input type="number" min="0" inputMode="numeric" value={form.followUpFee} onChange={set("followUpFee")} />
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
  const doc = profile.data;

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
