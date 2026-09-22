"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  Store,
  Receipt,
  Wallet,
  Users,
  Settings,
  ShoppingCart,
  UtensilsCrossed,
  BarChart3,
  Banknote,
  LogOut,
  Bell,
  Menu,
  X,
  ArrowLeftRight,
  ChevronDown,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { useCart } from "@/lib/cart-context";
import { ChoppaMark } from "@/components/brand/ChoppaMark";
import { Avatar } from "@/components/ui/Avatar";
import { Role } from "@/lib/types";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: number;
}

export function DashboardShell({
  role,
  children,
}: {
  role: Role;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { account, userProfile, sellerProfile, restaurant, logout, hasRole, switchRole } = useStore();
  const { count } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const userNav: NavItem[] = [
    { href: "/dashboard", label: "Overview", icon: LayoutGrid },
    { href: "/dashboard/restaurants", label: "Restaurants", icon: Store },
    { href: "/dashboard/cart", label: "Cart", icon: ShoppingCart, badge: count },
    { href: "/dashboard/orders", label: "Orders", icon: Receipt },
    { href: "/dashboard/transactions", label: "Transactions", icon: Wallet },
    { href: "/dashboard/referrals", label: "Referrals", icon: Users },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  const sellerNav: NavItem[] = [
    { href: "/seller", label: "Overview", icon: LayoutGrid },
    { href: "/seller/orders", label: "Orders", icon: Receipt },
    { href: "/seller/menu", label: "Menu", icon: UtensilsCrossed },
    { href: "/seller/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/seller/payouts", label: "Payouts", icon: Banknote },
    { href: "/seller/settings", label: "Settings", icon: Settings },
  ];

  const nav = role === "user" ? userNav : sellerNav;
  const displayName = role === "user" ? userProfile?.name ?? "Guest" : sellerProfile?.ownerName ?? "Guest";
  const subLabel = role === "user" ? account?.email : restaurant?.name;
  const avatarColor = role === "user" ? userProfile?.avatarColor : "choppa-green-mid";
  const otherRole: Role = role === "user" ? "seller" : "user";

  function isActive(href: string) {
    if (href === "/dashboard" || href === "/seller") return pathname === href;
    return pathname.startsWith(href);
  }

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <Link href={role === "user" ? "/dashboard" : "/seller"} className="flex items-center gap-2.5 px-1">
        <ChoppaMark size={32} className="text-choppa-red" />
        <span className="font-display text-lg font-bold text-choppa-ink">Choppa</span>
        {role === "seller" && (
          <span className="ml-auto rounded-full bg-choppa-green/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-choppa-green">
            Seller
          </span>
        )}
      </Link>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {nav.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-choppa-red text-white shadow-pop"
                  : "text-choppa-ink-soft hover:bg-choppa-peach-light hover:text-choppa-ink"
              }`}
            >
              <Icon size={18} className={active ? "text-white" : "text-choppa-ink-soft group-hover:text-choppa-red"} />
              {item.label}
              {!!item.badge && (
                <span
                  className={`ml-auto rounded-full px-2 py-0.5 text-xs font-bold ${
                    active ? "bg-white/20 text-white" : "bg-choppa-red text-white"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {hasRole(otherRole) && (
        <button
          onClick={() => {
            switchRole();
            router.push(otherRole === "seller" ? "/seller" : "/dashboard");
          }}
          className="mb-2 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-choppa-green hover:bg-choppa-green/10"
        >
          <ArrowLeftRight size={18} />
          Switch to {otherRole === "seller" ? "seller" : "customer"}
        </button>
      )}

      <div className="rounded-2xl bg-choppa-peach-light p-4">
        <p className="font-display text-sm font-semibold text-choppa-ink">
          {role === "user" ? "Refer & earn ₦1,500" : "Grow with Choppa Ads"}
        </p>
        <p className="mt-1 text-xs text-choppa-ink-soft">
          {role === "user"
            ? "Invite friends and earn when they order."
            : "Boost your restaurant to more customers."}
        </p>
        <Link
          href={role === "user" ? "/dashboard/referrals" : "/seller/analytics"}
          className="mt-2 inline-block text-xs font-bold text-choppa-red hover:underline"
        >
          Learn more &rarr;
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-choppa-cream">
      <aside className="hidden w-64 shrink-0 border-r border-black/5 bg-white p-5 lg:flex">
        {SidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div className="absolute inset-0 bg-choppa-ink/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-white p-5 shadow-2xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1.5 hover:bg-black/5"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
            {SidebarContent}
          </div>
        </div>
      )}

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-black/5 bg-choppa-cream/90 px-4 py-3 backdrop-blur sm:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-full p-2 hover:bg-black/5 lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-lg font-semibold text-choppa-ink">
              {role === "user" ? `Hey, ${userProfile?.name?.split(" ")[0] ?? "there"} 👋` : restaurant?.name ?? "Your restaurant"}
            </p>
            <p className="truncate text-xs text-choppa-ink-soft">
              {role === "user" ? "What are you craving today?" : "Here's how your restaurant is doing"}
            </p>
          </div>

          <button className="relative rounded-full p-2 hover:bg-black/5" aria-label="Notifications">
            <Bell size={19} className="text-choppa-ink-soft" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-choppa-red" />
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-black/5 bg-white py-1 pl-1 pr-2.5 hover:border-black/10"
            >
              <Avatar name={displayName} color={avatarColor} size={32} />
              <span className="hidden max-w-28 truncate text-sm font-semibold text-choppa-ink sm:inline">
                {displayName}
              </span>
              <ChevronDown size={14} className="text-choppa-ink-soft" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-black/5 bg-white p-2 shadow-card">
                  <div className="px-3 py-2">
                    <p className="truncate text-sm font-semibold text-choppa-ink">{displayName}</p>
                    <p className="truncate text-xs text-choppa-ink-soft">{subLabel}</p>
                  </div>
                  <div className="my-1 h-px bg-black/5" />
                  <Link
                    href={role === "user" ? "/dashboard/settings" : "/seller/settings"}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-choppa-ink hover:bg-choppa-peach-light"
                  >
                    <Settings size={16} /> Settings
                  </Link>
                  {hasRole(otherRole) && (
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        switchRole();
                        router.push(otherRole === "seller" ? "/seller" : "/dashboard");
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-choppa-ink hover:bg-choppa-peach-light"
                    >
                      <ArrowLeftRight size={16} /> Switch to {otherRole}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                      router.push("/login");
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} /> Log out
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        <main className="min-w-0 flex-1 overflow-x-hidden px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
