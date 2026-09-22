"use client";

import { useMemo } from "react";
import { useStore } from "@/lib/store";
import { Card, CardHeader } from "@/components/ui/Card";
import { SalesTrendChart } from "@/components/seller/SalesTrendChart";
import { StatusDonut } from "@/components/seller/StatusDonut";
import { TopProductsList } from "@/components/seller/TopProductsList";
import { ordersByStatus, revenueByCategory, salesTrend, topProducts } from "@/lib/analytics";
import { formatNaira } from "@/lib/format";

export default function SellerAnalyticsPage() {
  const { restaurant, ordersForRestaurant, menuForRestaurant } = useStore();
  const orders = useMemo(
    () => (restaurant ? ordersForRestaurant(restaurant.id) : []),
    [restaurant, ordersForRestaurant]
  );
  const menu = useMemo(
    () => (restaurant ? menuForRestaurant(restaurant.id) : []),
    [restaurant, menuForRestaurant]
  );

  const trend = useMemo(() => salesTrend(orders, 30), [orders]);
  const products = useMemo(() => topProducts(orders, 6), [orders]);
  const statuses = useMemo(() => ordersByStatus(orders), [orders]);
  const categories = useMemo(() => revenueByCategory(orders, menu), [orders, menu]);
  const maxCategory = Math.max(...categories.map((c) => c.revenue), 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-choppa-ink">Analytics</h1>
        <p className="mt-1 text-sm text-choppa-ink-soft">Deeper insight into how {restaurant?.name} is performing</p>
      </div>

      <Card>
        <CardHeader title="Sales trend" subtitle="Last 30 days" />
        <SalesTrendChart data={trend} />
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Orders by status" subtitle={`${orders.length} orders total`} />
          <StatusDonut data={statuses} />
        </Card>

        <Card>
          <CardHeader title="Revenue by category" />
          <ul className="space-y-4">
            {categories.map((c) => (
              <li key={c.category}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-choppa-ink">{c.category}</span>
                  <span className="font-semibold text-choppa-ink">{formatNaira(c.revenue)}</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-black/5">
                  <div
                    className="h-full rounded-full bg-choppa-green-mid"
                    style={{ width: `${Math.max(6, (c.revenue / maxCategory) * 100)}%` }}
                  />
                </div>
              </li>
            ))}
            {categories.length === 0 && <p className="text-sm text-choppa-ink-soft">No sales data yet.</p>}
          </ul>
        </Card>
      </div>

      <Card>
        <CardHeader title="Best selling items" subtitle="By revenue, all time" />
        <TopProductsList products={products} />
      </Card>
    </div>
  );
}
