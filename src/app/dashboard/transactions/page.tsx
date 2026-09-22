"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TopUpModal } from "@/components/dashboard/TopUpModal";
import { formatDateTime, formatNaira } from "@/lib/format";
import { TransactionType } from "@/lib/types";
import { Plus, Wallet } from "lucide-react";

const TYPE_LABEL: Record<TransactionType, string> = {
  topup: "Wallet top-up",
  order: "Order payment",
  commission: "Commission",
  referral_bonus: "Referral bonus",
  payout: "Payout",
  sale: "Sale",
};

const FILTERS: ("all" | TransactionType)[] = ["all", "topup", "order", "referral_bonus"];

export default function TransactionsPage() {
  const { session, userProfile, transactionsFor } = useStore();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [topUpOpen, setTopUpOpen] = useState(false);

  const transactions = useMemo(
    () => (session ? transactionsFor(session.email) : []),
    [session, transactionsFor]
  );
  const filtered = useMemo(
    () => (filter === "all" ? transactions : transactions.filter((t) => t.type === filter)),
    [transactions, filter]
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-choppa-ink">Transactions</h1>
          <p className="mt-1 text-sm text-choppa-ink-soft">Every top-up, order and bonus in one place</p>
        </div>
        <Button onClick={() => setTopUpOpen(true)}>
          <Plus size={16} /> Top up wallet
        </Button>
      </div>

      <Card className="flex items-center gap-4 bg-choppa-green text-choppa-cream">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15">
          <Wallet size={20} />
        </span>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-choppa-cream/70">Available balance</p>
          <p className="font-display text-2xl font-bold">{formatNaira(userProfile?.balance ?? 0)}</p>
        </div>
      </Card>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold capitalize transition-colors ${
              filter === f
                ? "border-choppa-red bg-choppa-red text-white"
                : "border-black/10 bg-white text-choppa-ink-soft hover:border-choppa-red/40"
            }`}
          >
            {f === "all" ? "All" : TYPE_LABEL[f]}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader title="History" />
        <div className="-mx-5 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-choppa-ink-soft">
                <th className="px-5 pb-3 font-medium">Description</th>
                <th className="px-5 pb-3 font-medium">Type</th>
                <th className="px-5 pb-3 font-medium">Date</th>
                <th className="px-5 pb-3 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filtered.map((t) => (
                <tr key={t.id}>
                  <td className="px-5 py-3 font-medium text-choppa-ink">{t.description}</td>
                  <td className="px-5 py-3">
                    <Badge tone={t.type === "referral_bonus" ? "purple" : t.type === "topup" ? "green" : "neutral"}>
                      {TYPE_LABEL[t.type]}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-choppa-ink-soft">{formatDateTime(t.createdAt)}</td>
                  <td
                    className={`px-5 py-3 text-right font-semibold ${
                      t.amount < 0 ? "text-choppa-ink" : "text-emerald-600"
                    }`}
                  >
                    {t.amount < 0 ? "-" : "+"}
                    {formatNaira(Math.abs(t.amount))}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-choppa-ink-soft">
                    No transactions in this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <TopUpModal open={topUpOpen} onClose={() => setTopUpOpen(false)} />
    </div>
  );
}
