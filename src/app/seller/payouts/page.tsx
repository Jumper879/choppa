"use client";

import { useState } from "react";
import { Banknote, Wallet } from "lucide-react";
import { useStore } from "@/lib/store";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PayoutModal } from "@/components/seller/PayoutModal";
import { formatDateTime, formatNaira } from "@/lib/format";

export default function SellerPayoutsPage() {
  const { session, sellerProfile, transactionsFor } = useStore();
  const [open, setOpen] = useState(false);
  const transactions = session ? transactionsFor(session.email) : [];
  const sales = transactions.filter((t) => t.type === "sale").reduce((s, t) => s + t.amount, 0);
  const paidOut = Math.abs(
    transactions.filter((t) => t.type === "payout").reduce((s, t) => s + t.amount, 0)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-choppa-ink">Payouts</h1>
          <p className="mt-1 text-sm text-choppa-ink-soft">Withdraw your Choppa earnings to your bank</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Banknote size={16} /> Request payout
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="bg-choppa-green text-choppa-cream">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
            <Wallet size={18} />
          </span>
          <p className="mt-3 text-xs font-medium uppercase tracking-wide text-choppa-cream/70">
            Available balance
          </p>
          <p className="font-display text-2xl font-bold">{formatNaira(sellerProfile?.balance ?? 0)}</p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-choppa-ink-soft">Total sales</p>
          <p className="mt-1 font-display text-2xl font-semibold text-choppa-ink">{formatNaira(sales)}</p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-choppa-ink-soft">Total paid out</p>
          <p className="mt-1 font-display text-2xl font-semibold text-choppa-ink">{formatNaira(paidOut)}</p>
        </Card>
      </div>

      <Card>
        <CardHeader title="Transaction history" />
        <div className="-mx-5 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-choppa-ink-soft">
                <th className="px-5 pb-3 font-medium">Description</th>
                <th className="px-5 pb-3 font-medium">Status</th>
                <th className="px-5 pb-3 font-medium">Date</th>
                <th className="px-5 pb-3 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td className="px-5 py-3 font-medium text-choppa-ink">{t.description}</td>
                  <td className="px-5 py-3">
                    <Badge tone={t.status === "completed" ? "green" : "gold"}>{t.status}</Badge>
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
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-choppa-ink-soft">
                    No transactions yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <PayoutModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
