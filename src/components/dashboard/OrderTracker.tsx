import { Check } from "lucide-react";
import { Order, OrderStatus } from "@/lib/types";

const STEPS: { key: OrderStatus; label: string }[] = [
  { key: "placed", label: "Placed" },
  { key: "accepted", label: "Accepted" },
  { key: "preparing", label: "Preparing" },
  { key: "out_for_delivery", label: "On the way" },
  { key: "delivered", label: "Delivered" },
];

export function OrderTracker({ order }: { order: Order }) {
  if (order.status === "cancelled") {
    return (
      <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
        This order was cancelled.
      </div>
    );
  }
  const currentIdx = STEPS.findIndex((s) => s.key === order.status);
  return (
    <div className="flex items-center">
      {STEPS.map((step, idx) => {
        const done = idx <= currentIdx;
        const isLast = idx === STEPS.length - 1;
        return (
          <div key={step.key} className={`flex items-center ${isLast ? "" : "flex-1"}`}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                  done ? "bg-choppa-red text-white" : "bg-black/5 text-choppa-ink-soft"
                }`}
              >
                {done ? <Check size={14} /> : idx + 1}
              </div>
              <span className={`text-[10px] font-medium ${done ? "text-choppa-ink" : "text-choppa-ink-soft"}`}>
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div className={`mx-1 h-0.5 flex-1 rounded ${idx < currentIdx ? "bg-choppa-red" : "bg-black/10"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
