import { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-black/[0.04] bg-white p-5 shadow-card ${className}`}
      {...props}
    />
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h3 className="font-display text-base font-semibold text-choppa-ink">{title}</h3>
        {subtitle && <p className="mt-0.5 text-sm text-choppa-ink-soft">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
