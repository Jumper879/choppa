"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast-context";
import { formatNaira } from "@/lib/format";

const QUICK_AMOUNTS = [2000, 5000, 10000, 20000];

export function TopUpModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { topUpWallet } = useStore();
  const { toast } = useToast();
  const [amount, setAmount] = useState(5000);

  function submit() {
    if (amount <= 0) return;
    topUpWallet(amount);
    toast(`Wallet topped up with ${formatNaira(amount)}`, "success");
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} labelledBy="topup-title">
      <h2 id="topup-title" className="font-display text-lg font-semibold text-choppa-ink">
        Top up wallet
      </h2>
      <p className="mt-1 text-sm text-choppa-ink-soft">
        Add funds to your Choppa wallet to pay for deliveries instantly.
      </p>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {QUICK_AMOUNTS.map((a) => (
          <button
            key={a}
            onClick={() => setAmount(a)}
            className={`rounded-xl border py-2 text-xs font-semibold transition-colors ${
              amount === a
                ? "border-choppa-red bg-choppa-red/10 text-choppa-red"
                : "border-black/10 text-choppa-ink-soft hover:border-choppa-red/40"
            }`}
          >
            {formatNaira(a)}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <TextField
          id="topupAmount"
          label="Amount"
          type="number"
          min={100}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </div>

      <div className="mt-6 flex gap-3">
        <Button variant="outline" className="flex-1" onClick={onClose}>
          Cancel
        </Button>
        <Button className="flex-1" onClick={submit}>
          Add {formatNaira(amount || 0)}
        </Button>
      </div>
    </Modal>
  );
}
