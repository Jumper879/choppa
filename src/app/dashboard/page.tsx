"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Wallet, Receipt, Users2, TrendingUp, Plus, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { RestaurantCard } from "@/components/dashboard/RestaurantCard";
import { OrderTracker } from "@/components/dashboard/OrderTracker";
import { TopUpModal } from "@/components/dashboard/TopUpModal";
import { formatNaira, relativeTime } from "@/lib/format";

export default function UserOverviewPage() {
  const { db, session, userProfile, ordersForUser, transactionsFor, referralsFor } = useStore();
  const [topUpOpen, setTopUpOpen] = useState(false);

  const orders = session ? ordersForUser(session.email) : [];
  const transactions = session ? transactionsFor(session.email) : [];
  const referrals = session ? referralsFor(session.email) : [];

  const activeOrder = orders.find((o) => !["delivered", "cancelled"].includes(o.status));
  const totalSpent = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + o.total, 0);
  const commissionsEarned = referrals.reduce((s, r) => s + r.commissionEarned, 0);

  const topRestaurants = useMemo(
    () =>
      [...db.restaurants]
        .filter((r) => r.isOpen)
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, 5),
    [db.restaurants]
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Wallet balance"
          value={formatNaira(userProfile?.balance ?? 0)}
          icon={<Wallet size={18} />}
          highlight
        />
        <StatCard label="Total orders" value={String(orders.length)} icon={<Receipt size={18} />} />
        <StatCard label="Total spent" value={formatNaira(totalSpent)} icon={<TrendingUp size={18} />} />
        <StatCard
          label="Referral earnings"
          value={formatNaira(commissionsEarned)}
          icon={<Users2 size={18} />}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Wallet"
            subtitle="Fund your wallet for instant checkout"
            action={
              <Button size="sm" onClick={() => setTopUpOpen(true)}>
                <Plus size={16} /> Top up
              </Button>
            }
          />
          <div className="flex items-end justify-between rounded-2xl bg-gradient-to-br from-choppa-red to-choppa-red-dark p-5 text-white">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-white/70">Available balance</p>
              <p className="mt-1 font-display text-3xl font-bold">{formatNaira(userProfile?.balance ?? 0)}</p>
            </div>
            <Link
              href="/dashboard/restaurants"
              className="flex items-center gap-1 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold hover:bg-white/25"
            >
              Order now <ArrowRight size={15} />
            </Link>
          </div>

          {activeOrder ? (
            <div className="mt-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-choppa-ink">Active delivery</p>
                <Badge tone="red">{activeOrder.restaurantName}</Badge>
              </div>
              <OrderTracker order={activeOrder} />
              <Link
                href="/dashboard/orders"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-choppa-red hover:underline"
              >
                View order details <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-black/10 p-5 text-center">
              <p className="text-sm font-medium text-choppa-ink">No active deliveries</p>
              <p className="mt-1 text-xs text-choppa-ink-soft">
                Hungry? Find a restaurant near you and place an order.
              </p>
              <Link href="/dashboard/restaurants">
                <Button size="sm" className="mt-3">
                  Browse restaurants
                </Button>
              </Link>
            </div>
          )}
        </Card>

        <Card>
          <CardHeader title="Recent transactions" action={
            <Link href="/dashboard/transactions" className="text-xs font-semibold text-choppa-red hover:underline">
              See all
            </Link>
          } />
          <ul className="space-y-3">
            {transactions.slice(0, 5).map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-choppa-ink">{t.description}</p>
                  <p className="text-xs text-choppa-ink-soft">{relativeTime(t.createdAt)}</p>
                </div>
                <span
                  className={`shrink-0 text-sm font-semibold ${
                    t.amount < 0 ? "text-choppa-ink" : "text-emerald-600"
                  }`}
                >
                  {t.amount < 0 ? "-" : "+"}
                  {formatNaira(Math.abs(t.amount))}
                </span>
              </li>
            ))}
            {transactions.length === 0 && (
              <p className="text-sm text-choppa-ink-soft">No transactions yet.</p>
            )}
          </ul>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Nearest restaurants"
          subtitle="Based on your delivery address"
          action={
            <Link href="/dashboard/restaurants" className="text-xs font-semibold text-choppa-red hover:underline">
              See all
            </Link>
          }
        />
        <div className="flex gap-4 overflow-x-auto pb-1">
          {topRestaurants.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} compact />
          ))}
        </div>
      </Card>

      <TopUpModal open={topUpOpen} onClose={() => setTopUpOpen(false)} />
    </div>
  );
}
