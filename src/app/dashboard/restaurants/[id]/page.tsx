"use client";

import { use, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, Clock, MapPin, Plus, Minus, ShoppingCart } from "lucide-react";
import { useStore } from "@/lib/store";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/lib/toast-context";
import { EmojiBadge } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { formatNaira } from "@/lib/format";

export default function RestaurantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { db, menuForRestaurant } = useStore();
  const cart = useCart();
  const { toast } = useToast();

  const restaurant = db.restaurants.find((r) => r.id === id);
  const menu = menuForRestaurant(id);
  const [category, setCategory] = useState<string>("All");

  const categories = useMemo(() => ["All", ...Array.from(new Set(menu.map((m) => m.category)))], [menu]);
  const filteredMenu = category === "All" ? menu : menu.filter((m) => m.category === category);

  if (!restaurant) {
    return (
      <div className="py-16 text-center">
        <p className="font-medium text-choppa-ink">Restaurant not found.</p>
        <Link href="/dashboard/restaurants" className="mt-2 inline-block text-sm font-semibold text-choppa-red">
          Back to restaurants
        </Link>
      </div>
    );
  }

  function handleAdd(item: (typeof menu)[number]) {
    if (!restaurant) return;
    const result = cart.addItem(item, restaurant);
    if (!result.ok) {
      toast(`Your cart has items from ${result.blocked}. Clear cart to order from ${restaurant.name}.`, "error");
      return;
    }
    toast(`Added ${item.name} to cart`, "success");
  }

  return (
    <div className="space-y-6 pb-24">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm font-semibold text-choppa-ink-soft hover:text-choppa-ink"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="flex flex-col gap-4 rounded-2xl border border-black/[0.04] bg-white p-5 shadow-card sm:flex-row sm:items-center">
        <EmojiBadge emoji={restaurant.coverEmoji} accent={restaurant.accent} size={72} />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-xl font-bold text-choppa-ink">{restaurant.name}</h1>
            <Badge tone={restaurant.isOpen ? "green" : "neutral"}>
              {restaurant.isOpen ? "Open now" : "Closed"}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-choppa-ink-soft">{restaurant.tagline}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-choppa-ink-soft">
            <span className="flex items-center gap-1 text-amber-600">
              <Star size={13} fill="currentColor" /> {restaurant.rating || "New"} ({restaurant.ratingCount})
            </span>
            <span className="flex items-center gap-1">
              <Clock size={13} /> {restaurant.etaMins} min
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={13} /> {restaurant.distanceKm} km &middot; {restaurant.address}
            </span>
            <span>Delivery fee {formatNaira(restaurant.deliveryFee)}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              category === c
                ? "border-choppa-red bg-choppa-red text-white"
                : "border-black/10 bg-white text-choppa-ink-soft hover:border-choppa-red/40"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 xl:grid-cols-4">
        {filteredMenu.map((item) => {
          const line = cart.lines.find((l) => l.menuItemId === item.id);
          const accentBg: Record<string, string> = {
            red: "bg-choppa-red/10",
            green: "bg-choppa-green/10",
            gold: "bg-choppa-gold/15",
            purple: "bg-choppa-purple/10",
          };
          return (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl border border-black/[0.04] bg-white shadow-card"
            >
              <div className={`relative flex aspect-square items-center justify-center text-5xl ${accentBg[restaurant.accent]}`}>
                {item.emoji}
                {item.popular && (
                  <span className="absolute left-2 top-2">
                    <Badge tone="gold">Popular</Badge>
                  </span>
                )}
                {!line && (
                  <button
                    onClick={() => handleAdd(item)}
                    disabled={!item.available}
                    className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-choppa-red text-white shadow-pop disabled:opacity-40"
                    aria-label={`Add ${item.name}`}
                  >
                    <Plus size={16} />
                  </button>
                )}
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-semibold text-choppa-ink">{item.name}</p>
                <p className="mt-0.5 line-clamp-1 text-xs text-choppa-ink-soft">{item.description}</p>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-choppa-red">{formatNaira(item.price)}</span>
                  {line && (
                    <div className="flex items-center gap-1.5 rounded-full bg-choppa-red/10 px-1 py-1">
                      <button
                        onClick={() => cart.setQty(item.id, line.qty - 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-choppa-red shadow-sm"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-3 text-center text-xs font-bold text-choppa-red">{line.qty}</span>
                      <button
                        onClick={() => handleAdd(item)}
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-choppa-red shadow-sm"
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {cart.count > 0 && (
        <div className="fixed inset-x-0 bottom-4 z-30 flex justify-center px-4">
          <Link
            href="/dashboard/cart"
            className="flex w-full max-w-md items-center justify-between rounded-full bg-choppa-red px-5 py-3.5 text-white shadow-pop"
          >
            <span className="flex items-center gap-2 text-sm font-semibold">
              <ShoppingCart size={17} /> View cart &middot; {cart.count} item{cart.count > 1 ? "s" : ""}
            </span>
            <span className="font-display font-bold">{formatNaira(cart.subtotal)}</span>
          </Link>
        </div>
      )}
    </div>
  );
}
