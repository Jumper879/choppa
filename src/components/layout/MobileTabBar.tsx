"use client";

import Link from "next/link";
import { MoreHorizontal } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: number;
}

export function MobileTabBar({
  items,
  isActive,
  onMore,
}: {
  items: NavItem[];
  isActive: (href: string) => boolean;
  onMore: () => void;
}) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t border-black/5 bg-white pb-[env(safe-area-inset-bottom)] lg:hidden">
      {items.map((item) => {
        const active = isActive(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="relative flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium"
          >
            <span
              className={`relative flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                active ? "bg-choppa-red text-white shadow-pop" : "text-choppa-ink-soft"
              }`}
            >
              <Icon size={18} />
              {!!item.badge && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-choppa-green px-1 text-[9px] font-bold text-white">
                  {item.badge}
                </span>
              )}
            </span>
            <span className={active ? "text-choppa-red" : "text-choppa-ink-soft"}>{item.label}</span>
          </Link>
        );
      })}
      <button
        onClick={onMore}
        className="flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-choppa-ink-soft"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full">
          <MoreHorizontal size={18} />
        </span>
        More
      </button>
    </nav>
  );
}
