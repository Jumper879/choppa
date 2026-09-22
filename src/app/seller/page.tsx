"use client";

import { useMemo } from "react";
import Link from "next/link";
import { DollarSign, Receipt, TrendingUp, Wallet } from "lucide-react";
import { useStore } from "@/lib/store";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { SalesTrendChart } from "@/components/seller/SalesTrendChart";
import { TopProductsList } from "@/components/seller/TopProductsList";
import { salesTrend, topProducts } from "@/lib/analytics";
import { formatNaira, relativeTime } from "@/lib/format";
import { OrderStatus } from "@/lib/types";

const STATUS_TONE: Record<OrderStatus, "green" | "gold" | "red" | "neutral"> = {
  placed: "gold",
  accepted: "gold",
  preparing: "gold",
  out_for_delivery: "red",
  delivered: "green",
  cancelled: "neutral",
};

export default function SellerOverviewPage() {
  const { restaurant, sellerProfile, ordersForRestaurant } = useStore();
  const orders = useMemo(
    () => (restaurant ? ordersForRestaurant(restaurant.id) : []),
    [restaurant, ordersForRestaurant]
  );

  const completed = orders.filter((o) => o.status !== "cancelled");
  const totalSales = completed.reduce((s, o) => s + o.subtotal, 0);
  const avgOrderValue = completed.length ? Math.round(totalSales / completed.length) : 0;

  const trend = useMemo(() => salesTrend(orders, 14), [orders]);
  const products = useMemo(() => topProducts(orders, 5), [orders]);
  const last7 = trend.slice(-7).reduce((s, d) => s + d.sales, 0);
  const prior7 = trend.slice(0, 7).reduce((s, d) => s + d.sales, 0);
  const growth = prior7 > 0 ? Math.round(((last7 - prior7) / prior7) * 100) : 0;

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total sales" value={formatNaira(totalSales)} icon={<DollarSign size={18} />} highlight />
        <StatCard label="Total orders" value={String(completed.length)} icon={<Receipt size={18} />} />
        <StatCard label="Avg. order value" value={formatNaira(avgOrderValue)} icon={<TrendingUp size={18} />} />
        <StatCard label="Wallet balance" value={formatNaira(sellerProfile?.balance ?? 0)} icon={<Wallet size={18} />} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Sales trend"
            subtitle="Last 14 days"
            action={
              <Badge tone={growth >= 0 ? "green" : "danger"}>
                {growth >= 0 ? "▲" : "▼"} {Math.abs(growth)}% vs prior week
              </Badge>
            }
          />
          <SalesTrendChart data={trend} />
        </Card>

        <Card>
          <CardHeader title="Top products" subtitle="By revenue" />
          <TopProductsList products={products} />
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Recent orders"
          action={
            <Link href="/seller/orders" className="text-xs font-semibold text-choppa-red hover:underline">
              View all
            </Link>
          }
        />
        <div className="-mx-5 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-choppa-ink-soft">
                <th className="px-5 pb-3 font-medium">Order</th>
                <th className="px-5 pb-3 font-medium">Items</th>
                <th className="px-5 pb-3 font-medium">Status</th>
                <th className="px-5 pb-3 font-medium">When</th>
                <th className="px-5 pb-3 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {recentOrders.map((o) => (
                <tr key={o.id}>
                  <td className="px-5 py-3 font-mono text-xs text-choppa-ink-soft">#{o.id.slice(-5)}</td>
                  <td className="px-5 py-3 text-choppa-ink">
                    {o.items.map((i) => i.name).join(", ")}
                  </td>
                  <td className="px-5 py-3">
                    <Badge tone={STATUS_TONE[o.status]}>{o.status.replace(/_/g, " ")}</Badge>
                  </td>
                  <td className="px-5 py-3 text-choppa-ink-soft">{relativeTime(o.createdAt)}</td>
                  <td className="px-5 py-3 text-right font-semibold text-choppa-ink">{formatNaira(o.subtotal)}</td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-choppa-ink-soft">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
