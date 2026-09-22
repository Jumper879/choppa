"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDateTime, formatNaira } from "@/lib/format";
import { Order, OrderStatus } from "@/lib/types";

const NEXT_STATUS: Partial<Record<OrderStatus, { status: OrderStatus; label: string }>> = {
  placed: { status: "accepted", label: "Accept order" },
  accepted: { status: "preparing", label: "Start preparing" },
  preparing: { status: "out_for_delivery", label: "Send for delivery" },
  out_for_delivery: { status: "delivered", label: "Mark delivered" },
};

const STATUS_TONE: Record<OrderStatus, "green" | "gold" | "red" | "neutral"> = {
  placed: "gold",
  accepted: "gold",
  preparing: "gold",
  out_for_delivery: "red",
  delivered: "green",
  cancelled: "neutral",
};

type Tab = "active" | "history";

export default function SellerOrdersPage() {
  const { restaurant, ordersForRestaurant, updateOrderStatus } = useStore();
  const [tab, setTab] = useState<Tab>("active");

  const orders = restaurant ? ordersForRestaurant(restaurant.id) : [];
  const sorted = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const active = sorted.filter((o) => !["delivered", "cancelled"].includes(o.status));
  const history = sorted.filter((o) => ["delivered", "cancelled"].includes(o.status));
  const shown = tab === "active" ? active : history;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-choppa-ink">Orders</h1>
          <p className="mt-1 text-sm text-choppa-ink-soft">Manage incoming and past orders</p>
        </div>
        <div className="flex rounded-full bg-black/5 p-1">
          <button
            onClick={() => setTab("active")}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              tab === "active" ? "bg-white text-choppa-ink shadow-sm" : "text-choppa-ink-soft"
            }`}
          >
            Active ({active.length})
          </button>
          <button
            onClick={() => setTab("history")}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              tab === "history" ? "bg-white text-choppa-ink shadow-sm" : "text-choppa-ink-soft"
            }`}
          >
            History
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {shown.map((order: Order) => {
          const next = NEXT_STATUS[order.status];
          return (
            <Card key={order.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-mono text-xs text-choppa-ink-soft">#{order.id.slice(-5)}</p>
                  <Badge tone={STATUS_TONE[order.status]}>{order.status.replace(/_/g, " ")}</Badge>
                </div>
                <p className="mt-1 text-sm font-medium text-choppa-ink">
                  {order.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}
                </p>
                <p className="mt-1 text-xs text-choppa-ink-soft">
                  {formatDateTime(order.createdAt)} &middot; {order.address}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <p className="font-display text-base font-semibold text-choppa-ink">{formatNaira(order.subtotal)}</p>
                {next && (
                  <Button size="sm" onClick={() => updateOrderStatus(order.id, next.status)}>
                    {next.label}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
        {shown.length === 0 && (
          <p className="py-12 text-center text-sm text-choppa-ink-soft">
            {tab === "active" ? "No active orders right now." : "No past orders yet."}
          </p>
        )}
      </div>
    </div>
  );
}
