"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast-context";
import { formatNaira } from "@/lib/format";

export function PayoutModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { sellerProfile, requestPayout } = useStore();
  const { toast } = useToast();
  const [amount, setAmount] = useState(10000);
  const [bank, setBank] = useState("GTBank •••• 4021");

  const balance = sellerProfile?.balance ?? 0;

  function submit() {
    if (amount <= 0 || amount > balance) {
      toast("Enter an amount within your available balance", "error");
      return;
    }
    requestPayout(amount, bank);
    toast(`Payout of ${formatNaira(amount)} requested`, "success");
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} labelledBy="payout-title">
      <h2 id="payout-title" className="font-display text-lg font-semibold text-choppa-ink">
        Request payout
      </h2>
      <p className="mt-1 text-sm text-choppa-ink-soft">
        Available balance: <span className="font-semibold text-choppa-ink">{formatNaira(balance)}</span>
      </p>
      <div className="mt-4 space-y-4">
        <TextField
          id="payoutAmount"
          label="Amount"
          type="number"
          min={1000}
          max={balance}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <TextField id="payoutBank" label="Payout account" value={bank} onChange={(e) => setBank(e.target.value)} />
      </div>
      <div className="mt-6 flex gap-3">
        <Button variant="outline" className="flex-1" onClick={onClose}>
          Cancel
        </Button>
        <Button className="flex-1" onClick={submit}>
          Request payout
        </Button>
      </div>
    </Modal>
  );
}
