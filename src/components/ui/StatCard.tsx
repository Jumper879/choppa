import { ReactNode } from "react";

export function StatCard({
  label,
  value,
  delta,
  deltaTone = "up",
  icon,
  highlight = false,
}: {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: "up" | "down";
  icon?: ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 shadow-card ${
        highlight
          ? "bg-choppa-red text-white"
          : "border border-black/[0.04] bg-white text-choppa-ink"
      }`}
    >
      {highlight && (
        <div
          aria-hidden
          className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10"
        />
      )}
      <div className="relative flex items-center justify-between">
        <span
          className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-base ${
            highlight ? "bg-white/15" : "bg-choppa-peach-light"
          }`}
        >
          {icon}
        </span>
      </div>
      <p
        className={`relative mt-4 text-xs font-medium uppercase tracking-wide ${
          highlight ? "text-white/80" : "text-choppa-ink-soft"
        }`}
      >
        {label}
      </p>
      <p className="relative mt-1 font-display text-2xl font-semibold">{value}</p>
      {delta && (
        <span
          className={`relative mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
            highlight
              ? "bg-white/15 text-white"
              : deltaTone === "up"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {deltaTone === "up" ? "▲" : "▼"} {delta}
        </span>
      )}
    </div>
  );
}
