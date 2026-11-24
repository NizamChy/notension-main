"use client";

// Order detail: who delivers it. Admin/support and the store's owner or
// manager can assign or remove the rider while the order is open.
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAdmin } from "./AdminShell";
import { adminApi, formatDate } from "./api";
import type { OrderDetail, Rider } from "./types";
import { Button, Card, Select } from "./ui";
import { notify } from "@/utils/notify";
import { admin } from "@notension/shared";

export default function RiderAssign({ order }: { order: OrderDetail }) {
  const { perms } = useAdmin();
  const queryClient = useQueryClient();
  const open = !["Delivered", "Cancelled"].includes(order.status);
  const canAssign = open && perms.assignRider(order.storeId);
  const [choice, setChoice] = useState(order.riderId || "");
  const [busy, setBusy] = useState(false);
  const riders = useQuery({
    queryKey: ["admin", "riders"],
    queryFn: () => adminApi("/riders", { result: admin.rider.array() }).then((r) => r.result),
    enabled: canAssign,
  });

  const save = async (riderId: string | null) => {
    setBusy(true);
    try {
      const res = await adminApi(`/orders/${order.id}/rider`, { method: "PATCH", body: { riderId } });
      notify.success(res.message ?? "Done");
      await queryClient.invalidateQueries({ queryKey: ["admin"] });
    } catch (err) {
      notify.error((err as Error).message);
    }
    setBusy(false);
  };

  const r = order.rider;
  if (!r && !canAssign) return null;

  return (
    <Card>
      <h2 className="mb-2 font-semibold text-gray-900">Rider</h2>
      {r ? (
        <div className="text-sm">
          <p className="font-medium text-gray-900">{r.name || "Rider"}</p>
          {r.phone ? (
            <a href={`tel:${r.phone}`} className="text-primary hover:underline">
              {r.phone}
            </a>
          ) : null}
          {order.assignedAt ? <p className="text-xs text-gray-500">Assigned {formatDate(order.assignedAt)}</p> : null}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No rider yet.</p>
      )}
      {canAssign ? (
        <div className="mt-3 space-y-2">
          <Select value={choice} onChange={(e) => setChoice(e.target.value)} aria-label="Rider">
            <option value="">{riders.isPending ? "Loading riders…" : riders.data?.length ? "Choose a rider" : "No riders yet"}</option>
            {(riders.data || []).map((x) => (
              <option key={x.id} value={x.id}>
                {x.name || x.phone} · {x.phone} · {x.openDeliveries} open
              </option>
            ))}
          </Select>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" loading={busy} disabled={!choice || choice === order.riderId} onClick={() => save(choice)}>
              {r ? "Change rider" : "Assign rider"}
            </Button>
            {r ? (
              <Button size="sm" variant="secondary" disabled={busy} onClick={() => save(null)}>
                Remove rider
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}
    </Card>
  );
}
