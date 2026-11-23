"use client";

// Backup, restore and reset to default (super admins only).
import { useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { HiOutlineArrowDownTray, HiOutlineArrowPath, HiOutlineArrowUpTray } from "react-icons/hi2";
import notify from "@/utils/notify";
import { useAdmin } from "@/components/Admin/AdminShell";
import { ADMIN_API, adminApi, ApiError, formatDate } from "@/components/Admin/api";
import type { DataResult } from "@/components/Admin/types";
import { Button, Card, ErrorBox, inputClass, Notice, PageHeader, Spinner, cx, type ErrorLike } from "@/components/Admin/ui";

type Counts = Record<string, number>;

// A backup file as read from disk: only what this page checks and shows.
type BackupFile = { format?: unknown; createdAt?: string; tables: Record<string, unknown> };

const totalRows = (counts: Counts | undefined) => Object.values(counts || {}).reduce((s, n) => s + n, 0);

// The few tables people recognise, for summaries.
const HIGHLIGHTS = [
  ["user", "users"],
  ["store", "stores"],
  ["product", "products"],
  ["order", "orders"],
  ["appointment", "appointments"],
];

function Counts({ counts }: { counts: Counts | undefined }) {
  return (
    <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700">
      {HIGHLIGHTS.map(([t, label]) => (
        <li key={t}>
          <span className="font-semibold text-gray-900">{counts?.[t] ?? 0}</span> {label}
        </li>
      ))}
      <li className="text-gray-500">{totalRows(counts)} rows in all</li>
    </ul>
  );
}

const Working = ({ children }: { children: ReactNode }) => (
  <p role="status" className="mt-3 flex items-center gap-2 text-sm text-gray-600">
    <Spinner small /> {children}
  </p>
);

export default function DataPage() {
  const { perms } = useAdmin();
  const router = useRouter();
  const queryClient = useQueryClient();

  // After restore / reset: fresh data everywhere, or a new sign-in.
  const afterChange = (signedIn: boolean) => {
    if (signedIn) {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    } else {
      queryClient.removeQueries({ queryKey: ["admin"] });
      notify.info("Please sign in again.");
      router.replace("/admin/login");
    }
  };

  if (!perms.isSuper) {
    return (
      <>
        <PageHeader title="Data" />
        <ErrorBox error="Only super admins can back up or reset the data." />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Data" subtitle="Back up, restore, or put the demo data back." />
      <div className="grid gap-4 lg:grid-cols-2">
        <BackupCard />
        <RestoreCard onDone={afterChange} />
        <ResetCard onDone={afterChange} className="lg:col-span-2" />
        <DemoAccountsCard />
      </div>
    </>
  );
}

// The printable list of demo logins, for handing to testers.
function DemoAccountsCard() {
  return (
    <Card className="lg:col-span-2">
      <h2 className="font-semibold text-gray-900">Demo accounts PDF</h2>
      <p className="mt-1 text-sm text-gray-600">
        Every demo login (customer, staff, store, rider, doctor, service provider) with its phone number and password,
        ready to print or share with testers.
      </p>
      <a
        href="/demo-accounts.pdf"
        download
        className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-800 hover:bg-gray-50"
      >
        <HiOutlineArrowDownTray /> Download PDF
      </a>
    </Card>
  );
}

function BackupCard() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ErrorLike>(null);
  const [done, setDone] = useState<string | null>(null);

  const download = async () => {
    setBusy(true);
    setError(null);
    setDone(null);
    try {
      const res = await fetch(`${ADMIN_API}/backup`, { credentials: "include", cache: "no-store" });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new ApiError(body?.message || "The backup couldn't be made. Please try again.", res.status);
      }
      const blob = await res.blob();
      const name = /filename="([^"]+)"/.exec(res.headers.get("content-disposition") || "")?.[1] || "notension-backup.json";
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setDone(`${name} (${(blob.size / 1024).toFixed(0)} KB) downloaded.`);
      notify.success("Backup downloaded");
    } catch (err) {
      setError(err instanceof ApiError ? err : "Can't reach the server. Check your connection and try again.");
    }
    setBusy(false);
  };

  return (
    <Card>
      <h2 className="font-semibold text-gray-900">Download backup</h2>
      <p className="mt-1 text-sm text-gray-600">
        One JSON file with all the app&apos;s data: users, roles, stores, products, orders, favourites, patients,
        appointments and the rest.
      </p>
      <ul className="mt-2 list-disc space-y-0.5 pl-5 text-sm text-gray-600">
        <li>Includes staff password hashes, except for the demo accounts. Keep the file private.</li>
        <li>Sign-in sessions and one-time links are not included.</li>
      </ul>
      <ErrorBox error={error} />
      <Notice>{done}</Notice>
      <Button className="mt-4 w-full sm:w-auto" onClick={download} loading={busy}>
        {busy ? null : <HiOutlineArrowDownTray className="text-base" />} {busy ? "Preparing backup…" : "Download backup"}
      </Button>
    </Card>
  );
}

type DoneHandler = (signedIn: boolean) => void;

function RestoreCard({ onDone }: { onDone: DoneHandler }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<{ name: string; data: BackupFile; counts: Counts } | null>(null); // { name, data, counts }
  const [error, setError] = useState<ErrorLike>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<DataResult | null>(null);

  const pick = async (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setResult(null);
    setFile(null);
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const data: BackupFile = JSON.parse(await f.text());
      if (data?.format !== "notension-backup" || typeof data.tables !== "object") {
        throw new Error("This is not a NoTension backup file.");
      }
      const counts = Object.fromEntries(Object.entries(data.tables).map(([t, rows]) => [t, Array.isArray(rows) ? rows.length : 0]));
      setFile({ name: f.name, data, counts });
    } catch (err) {
      setError(err instanceof SyntaxError ? "This file is not valid JSON." : (err as Error).message);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const clear = () => {
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const restore = async () => {
    if (!file) return; // unreachable: the restore button only shows with a file picked
    setBusy(true);
    setError(null);
    try {
      const res = await adminApi<DataResult>("/restore", { method: "POST", body: file.data });
      setResult(res.result);
      clear();
      notify.success("Backup restored");
      onDone(res.result.signedIn);
    } catch (err) {
      setError(err as Error);
    }
    setBusy(false);
  };

  return (
    <Card>
      <h2 className="font-semibold text-gray-900">Restore from file</h2>
      <p className="mt-1 text-sm text-gray-600">
        Replaces all current data with a backup file. Protected super admins and the demo accounts keep working, and
        everyone else is signed out.
      </p>
      <ErrorBox error={error} />
      {result ? (
        <Notice>
          Restored in {(result.ms / 1000).toFixed(1)} s.
          <Counts counts={result.counts} />
        </Notice>
      ) : null}

      <label className="mt-4 block">
        <span className="mb-1 block text-sm font-medium text-gray-700">Backup file (.json)</span>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          onChange={pick}
          disabled={busy}
          className={cx(inputClass, "file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-1.5 file:text-sm")}
        />
      </label>

      {file ? (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <p className="font-medium break-all">{file.name}</p>
          <p className="mt-0.5">Made {formatDate(file.data.createdAt) || "at an unknown time"}.</p>
          <Counts counts={file.counts} />
          <p className="mt-3 font-medium">All current data will be replaced by this file. This can&apos;t be undone.</p>
          {busy ? (
            <Working>Restoring… this can take up to a minute. Keep this page open.</Working>
          ) : (
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <Button variant="danger" onClick={restore}>
                <HiOutlineArrowUpTray className="text-base" /> Yes, restore this backup
              </Button>
              <Button variant="secondary" onClick={clear}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      ) : null}
    </Card>
  );
}

function ResetCard({ onDone, className }: { onDone: DoneHandler; className?: string }) {
  const [word, setWord] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ErrorLike>(null);
  const [result, setResult] = useState<DataResult | null>(null);

  const reset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (word !== "RESET") return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const res = await adminApi<DataResult>("/reset", { method: "POST", body: { confirm: word } });
      setResult(res.result);
      setWord("");
      notify.success("Data reset to default");
      onDone(res.result.signedIn);
    } catch (err) {
      setError(err as Error);
    }
    setBusy(false);
  };

  return (
    <Card className={className}>
      <h2 className="font-semibold text-gray-900">Reset to default</h2>
      <p className="mt-1 text-sm text-gray-600">
        Puts the site back the way a fresh deploy leaves it. Download a backup first if you may want today&apos;s data back.
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-900">
          <p className="font-medium">Removed</p>
          <ul className="mt-1 list-disc space-y-0.5 pl-5">
            <li>Every customer and staff account, except those kept</li>
            <li>All orders, favourites, patients and appointments</li>
            <li>Every change to stores, items, prices, products and banners</li>
            <li>Roles given out by admins, setup links, and all sign-ins</li>
          </ul>
        </div>
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-900">
          <p className="font-medium">Kept or put back</p>
          <ul className="mt-1 list-disc space-y-0.5 pl-5">
            <li>The protected super admins (from the server settings), their passwords and super admin role</li>
            <li>The demo data of every module, as on a fresh deploy</li>
            <li>The demo accounts, with the demo password</li>
            <li>Your own sign-in, if your account is kept</li>
          </ul>
        </div>
      </div>
      <ErrorBox error={error} />
      {result ? (
        <Notice>
          Reset done in {(result.ms / 1000).toFixed(1)} s.
          <Counts counts={result.counts} />
        </Notice>
      ) : null}
      <form onSubmit={reset} className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end">
        <label className="block sm:w-64">
          <span className="mb-1 block text-sm font-medium text-gray-700">
            Type <span className="font-mono">RESET</span> to confirm
          </span>
          <input
            className={cx(inputClass, "font-mono")}
            value={word}
            onChange={(e) => setWord(e.target.value)}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            disabled={busy}
          />
        </label>
        <Button type="submit" variant="danger" disabled={word !== "RESET"} loading={busy}>
          {busy ? null : <HiOutlineArrowPath className="text-base" />} {busy ? "Resetting…" : "Reset to default"}
        </Button>
      </form>
      {busy ? <Working>Deleting data and loading the demo data… this can take up to a minute.</Working> : null}
    </Card>
  );
}
