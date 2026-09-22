import Link from "next/link";
import { ChevronDown, MapPin } from "lucide-react";

export function DeliverToBar({ address }: { address?: string }) {
  return (
    <Link
      href="/dashboard/settings"
      className="flex w-full items-center gap-3 rounded-2xl border border-black/[0.04] bg-white px-4 py-3 text-left shadow-card"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-choppa-red/10 text-choppa-red">
        <MapPin size={16} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-semibold uppercase tracking-wide text-choppa-red">
          Deliver to
        </span>
        <span className="block truncate text-sm font-semibold text-choppa-ink">
          {address || "Add a delivery address"}
        </span>
      </span>
      <ChevronDown size={16} className="shrink-0 text-choppa-ink-soft" />
    </Link>
  );
}
