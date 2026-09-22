import { MenuItem, Order } from "./types";

export interface DayPoint {
  date: string;
  label: string;
  sales: number;
  orders: number;
}

export function salesTrend(orders: Order[], days: number): DayPoint[] {
  const points: DayPoint[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const dayOrders = orders.filter(
      (o) => o.createdAt.slice(0, 10) === key && o.status !== "cancelled"
    );
    points.push({
      date: key,
      label: d.toLocaleDateString("en-NG", { weekday: "short" }),
      sales: dayOrders.reduce((s, o) => s + o.subtotal, 0),
      orders: dayOrders.length,
    });
  }
  return points;
}

export interface ProductStat {
  name: string;
  emoji: string;
  revenue: number;
  qty: number;
}

export function topProducts(orders: Order[], limit = 5): ProductStat[] {
  const map = new Map<string, ProductStat>();
  for (const order of orders) {
    if (order.status === "cancelled") continue;
    for (const item of order.items) {
      const existing = map.get(item.menuItemId);
      if (existing) {
        existing.revenue += item.price * item.qty;
        existing.qty += item.qty;
      } else {
        map.set(item.menuItemId, {
          name: item.name,
          emoji: item.emoji,
          revenue: item.price * item.qty,
          qty: item.qty,
        });
      }
    }
  }
  return Array.from(map.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}

export interface StatusStat {
  status: string;
  label: string;
  count: number;
}

export function ordersByStatus(orders: Order[]): StatusStat[] {
  const labels: Record<string, string> = {
    delivered: "Delivered",
    out_for_delivery: "Out for delivery",
    preparing: "Preparing",
    accepted: "Accepted",
    placed: "New",
    cancelled: "Cancelled",
  };
  const counts = new Map<string, number>();
  for (const o of orders) counts.set(o.status, (counts.get(o.status) ?? 0) + 1);
  return Array.from(counts.entries())
    .map(([status, count]) => ({ status, label: labels[status] ?? status, count }))
    .sort((a, b) => b.count - a.count);
}

export interface CategoryStat {
  category: string;
  revenue: number;
}

export function revenueByCategory(orders: Order[], menuItems: MenuItem[]): CategoryStat[] {
  const categoryByItemId = new Map(menuItems.map((m) => [m.id, m.category]));
  const map = new Map<string, number>();
  for (const order of orders) {
    if (order.status === "cancelled") continue;
    for (const item of order.items) {
      const category = categoryByItemId.get(item.menuItemId) ?? "Other";
      map.set(category, (map.get(category) ?? 0) + item.price * item.qty);
    }
  }
  return Array.from(map.entries())
    .map(([category, revenue]) => ({ category, revenue }))
    .sort((a, b) => b.revenue - a.revenue);
}
