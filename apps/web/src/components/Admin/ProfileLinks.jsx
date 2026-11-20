"use client";

// Users & roles: link a doctor profile or an All Care provider listing to a
// user holding the doctor / service_provider role (admins only).
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAdmin } from "./AdminShell";
import { adminApi } from "./api";
import { Button, Input } from "./ui";
import { notify } from "@/utils/notify";

const KINDS = {
  doctor: {
    role: "doctor",
    title: "Doctor profile",
    path: "/doctors",
    none: "No doctor profile linked.",
    find: "Find doctor by name or speciality",
    single: true,
    sub: (d) => [d.speciality || d.designation, d.departmentName, d.districtName].filter(Boolean).join(" · "),
  },
  provider: {
    role: "service_provider",
    title: "All Care listing",
    path: "/care-providers",
    none: "No listing linked.",
    find: "Find provider by name or phone",
    single: false,
    sub: (p) => [p.phone, p.districtName].filter(Boolean).join(" · "),
  },
};

function LinkBox({ user, kind }) {
  const k = KINDS[kind];
  const queryClient = useQueryClient();
  const [q, setQ] = useState("");
  const [search, setSearch] = useState(null);
  const [busy, setBusy] = useState(null);

  const linked = useQuery({
    queryKey: ["admin", "profile-links", kind, user.id],
    queryFn: () => adminApi(k.path, { query: { userId: user.id } }).then((r) => r.result),
  });
  const found = useQuery({
    queryKey: ["admin", "profile-search", kind, search],
    queryFn: () => adminApi(k.path, { query: { q: search } }).then((r) => r.result),
    enabled: search !== null,
  });

  const setLink = async (id, userId) => {
    setBusy(id);
    try {
      const res = await adminApi(`${k.path}/${id}/user`, { method: "PATCH", body: { userId } });
      notify.success(res.message);
      await queryClient.invalidateQueries({ queryKey: ["admin", "profile-links"] });
      await queryClient.invalidateQueries({ queryKey: ["admin", "profile-search"] });
      if (userId) setSearch(null);
    } catch (err) {
      notify.error(err.message);
    }
    setBusy(null);
  };

  const mine = linked.data || [];
  const canAdd = !k.single || mine.length === 0;

  return (
    <div className="rounded-lg border border-gray-200 p-2.5">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{k.title}</p>
      {linked.isPending ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : mine.length ? (
        <ul className="mt-1 space-y-1">
          {mine.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="min-w-0">
                <span className="font-medium text-gray-900">{p.name}</span>
                <span className="block text-xs text-gray-500">{k.sub(p)}</span>
              </span>
              <Button size="sm" variant="secondary" loading={busy === p.id} onClick={() => setLink(p.id, null)}>
                Unlink
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-0.5 text-sm text-gray-500">{k.none}</p>
      )}

      {canAdd ? (
        <form
          className="mt-2 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setSearch(q.trim());
          }}
        >
          <Input placeholder={k.find} value={q} onChange={(e) => setQ(e.target.value)} />
          <Button type="submit" variant="secondary" size="sm">
            Find
          </Button>
        </form>
      ) : null}
      {canAdd && search !== null ? (
        found.isPending ? (
          <p className="mt-2 text-sm text-gray-500">Searching…</p>
        ) : found.data?.length ? (
          <ul className="mt-2 max-h-64 divide-y divide-gray-100 overflow-y-auto rounded border border-gray-100">
            {found.data.map((p) => {
              const other = p.userId && p.userId !== user.id;
              return (
                <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 px-2 py-1.5 text-sm">
                  <span className="min-w-0">
                    <span className="font-medium text-gray-900">{p.name}</span>
                    <span className="block text-xs text-gray-500">
                      {k.sub(p)}
                      {other ? ` · linked to ${p.userName || p.userPhone}` : ""}
                    </span>
                  </span>
                  {p.userId === user.id ? (
                    <span className="text-xs text-gray-500">Linked</span>
                  ) : (
                    <Button size="sm" disabled={!!other} loading={busy === p.id} onClick={() => setLink(p.id, user.id)}>
                      Link
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-gray-500">{found.error ? found.error.message : "Nothing found."}</p>
        )
      ) : null}
    </div>
  );
}

export default function ProfileLinks({ user }) {
  const { perms } = useAdmin();
  if (!perms.linkProfiles) return null;
  const has = (role) => user.roles.some((r) => r.role === role);
  const boxes = Object.keys(KINDS).filter((kind) => has(KINDS[kind].role));
  if (!boxes.length) return null;
  return (
    <div className="mt-2 grid gap-2 md:grid-cols-2">
      {boxes.map((kind) => (
        <LinkBox key={kind} user={user} kind={kind} />
      ))}
    </div>
  );
}
