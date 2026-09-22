"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast-context";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { formatDate, formatNaira } from "@/lib/format";
import { Copy, Share2, Users2, Wallet, UserPlus } from "lucide-react";

export default function ReferralsPage() {
  const { session, userProfile, referralsFor } = useStore();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const referrals = session ? referralsFor(session.email) : [];
  const totalEarned = referrals.reduce((s, r) => s + r.commissionEarned, 0);
  const active = referrals.filter((r) => r.status === "active").length;
  const code = userProfile?.referralCode ?? "";
  const link = `choppa.app/join?ref=${code}`;

  function copyCode() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(link).catch(() => {});
    }
    setCopied(true);
    toast("Referral link copied", "success");
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-choppa-ink">Referrals &amp; commissions</h1>
        <p className="mt-1 text-sm text-choppa-ink-soft">
          Earn &#8358;1,500 every time a friend joins Choppa with your code.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total earned" value={formatNaira(totalEarned)} icon={<Wallet size={18} />} highlight />
        <StatCard label="Friends referred" value={String(referrals.length)} icon={<Users2 size={18} />} />
        <StatCard label="Active referrals" value={String(active)} icon={<UserPlus size={18} />} />
      </div>

      <Card className="bg-choppa-green text-choppa-cream">
        <p className="text-xs font-medium uppercase tracking-wide text-choppa-cream/70">Your referral code</p>
        <p className="mt-1 font-display text-3xl font-bold tracking-wide">{code}</p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <div className="flex-1 truncate rounded-full bg-white/10 px-4 py-2.5 text-sm">{link}</div>
          <Button variant="secondary" className="bg-white text-choppa-green hover:bg-white/90" onClick={copyCode}>
            {copied ? "Copied!" : <><Copy size={15} /> Copy link</>}
          </Button>
          <Button
            variant="secondary"
            className="border border-white/30 bg-transparent text-choppa-cream hover:bg-white/10"
            onClick={() => toast("Share sheet would open here", "default")}
          >
            <Share2 size={15} /> Share
          </Button>
        </div>
      </Card>

      <Card>
        <CardHeader title="Referred friends" subtitle={`${referrals.length} people joined with your code`} />
        <ul className="divide-y divide-black/5">
          {referrals.map((r) => (
            <li key={r.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <Avatar name={r.referredName} color="choppa-purple" size={40} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-choppa-ink">{r.referredName}</p>
                <p className="text-xs text-choppa-ink-soft">Joined {formatDate(r.createdAt)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-emerald-600">
                  {r.commissionEarned > 0 ? `+${formatNaira(r.commissionEarned)}` : "—"}
                </p>
                <Badge tone={r.status === "active" ? "green" : "gold"}>
                  {r.status === "active" ? "Active" : "Pending first order"}
                </Badge>
              </div>
            </li>
          ))}
          {referrals.length === 0 && (
            <p className="py-6 text-center text-sm text-choppa-ink-soft">
              You haven&apos;t referred anyone yet. Share your code to start earning.
            </p>
          )}
        </ul>
      </Card>
    </div>
  );
}
