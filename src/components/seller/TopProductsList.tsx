import { ProductStat } from "@/lib/analytics";
import { formatNaira } from "@/lib/format";

export function TopProductsList({ products }: { products: ProductStat[] }) {
  const max = Math.max(...products.map((p) => p.revenue), 1);
  return (
    <ul className="space-y-4">
      {products.map((p, idx) => (
        <li key={p.name} className="flex items-center gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-choppa-peach-light text-xs font-bold text-choppa-red">
            {idx + 1}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-medium text-choppa-ink">
                {p.emoji} {p.name}
              </p>
              <p className="shrink-0 text-sm font-semibold text-choppa-ink">{formatNaira(p.revenue)}</p>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-black/5">
              <div
                className="h-full rounded-full bg-choppa-red"
                style={{ width: `${Math.max(6, (p.revenue / max) * 100)}%` }}
              />
            </div>
          </div>
        </li>
      ))}
      {products.length === 0 && <p className="text-sm text-choppa-ink-soft">No sales yet.</p>}
    </ul>
  );
}
