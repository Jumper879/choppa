"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { OrderTracker } from "@/components/dashboard/OrderTracker";
import { formatDateTime, formatNaira } from "@/lib/format";
import { Order, OrderStatus } from "@/lib/types";
import { ChevronDown, Receipt } from "lucide-react";

const STATUS_TONE: Record<OrderStatus, "green" | "gold" | "red" | "neutral"> = {
  placed: "gold",
  accepted: "gold",
  preparing: "gold",
  out_for_delivery: "red",
  delivered: "green",
  cancelled: "neutral",
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  placed: "Order placed",
  accepted: "Accepted by restaurant",
  preparing: "Preparing your food",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function OrdersPage() {
  const { session, ordersForUser } = useStore();
  const orders = session ? ordersForUser(session.email) : [];
  const [openId, setOpenId] = useState<string | null>(orders[0]?.id ?? null);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-choppa-ink">Your orders</h1>
        <p className="mt-1 text-sm text-choppa-ink-soft">Track deliveries and revisit past orders</p>
      </div>

      {orders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Receipt size={36} className="text-choppa-ink-soft" />
          <p className="mt-3 font-display text-lg font-semibold text-choppa-ink">No orders yet</p>
          <p className="mt-1 text-sm text-choppa-ink-soft">Your delivery history will show up here.</p>
        </div>
      )}

      <div className="space-y-3">
        {orders.map((order: Order) => {
          const open = openId === order.id;
          return (
            <Card key={order.id} className="overflow-hidden">
              <button
                className="flex w-full items-center justify-between gap-3 text-left"
                onClick={() => setOpenId(open ? null : order.id)}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-display text-sm font-semibold text-choppa-ink">
                      {order.restaurantName}
                    </p>
                    <Badge tone={STATUS_TONE[order.status]}>{STATUS_LABEL[order.status]}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-choppa-ink-soft">
                    {formatDateTime(order.createdAt)} &middot; {order.items.length} item
                    {order.items.length > 1 ? "s" : ""} &middot; {formatNaira(order.total)}
                  </p>
                </div>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-choppa-ink-soft transition-transform ${open ? "rotate-180" : ""}`}
                />
              </button>

              {open && (
                <div className="mt-4 border-t border-black/5 pt-4">
                  {order.status !== "cancelled" && (
                    <div className="mb-4">
                      <OrderTracker order={order} />
                    </div>
                  )}
                  <ul className="space-y-2">
                    {order.items.map((item) => (
                      <li key={item.menuItemId} className="flex items-center justify-between text-sm">
                        <span className="text-choppa-ink-soft">
                          {item.emoji} {item.qty}&times; {item.name}
                        </span>
                        <span className="font-medium text-choppa-ink">{formatNaira(item.price * item.qty)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 space-y-1 border-t border-black/5 pt-3 text-sm">
                    <div className="flex justify-between text-choppa-ink-soft">
                      <span>Subtotal</span>
                      <span>{formatNaira(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-choppa-ink-soft">
                      <span>Delivery fee</span>
                      <span>{formatNaira(order.deliveryFee)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-choppa-ink">
                      <span>Total</span>
                      <span>{formatNaira(order.total)}</span>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-choppa-ink-soft">Delivering to {order.address}</p>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
