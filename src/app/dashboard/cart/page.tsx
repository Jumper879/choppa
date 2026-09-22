"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast-context";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TextAreaField } from "@/components/ui/Field";
import { EmojiBadge } from "@/components/ui/Avatar";
import { TopUpModal } from "@/components/dashboard/TopUpModal";
import { formatNaira } from "@/lib/format";

export default function CartPage() {
  const cart = useCart();
  const { db, userProfile, placeOrder } = useStore();
  const { toast } = useToast();
  const router = useRouter();

  const restaurant = db.restaurants.find((r) => r.id === cart.restaurantId);
  const deliveryFee = restaurant?.deliveryFee ?? 0;
  const total = cart.subtotal + (cart.lines.length ? deliveryFee : 0);

  const [address, setAddress] = useState(userProfile?.address ?? "");
  const [placing, setPlacing] = useState(false);
  const [topUpOpen, setTopUpOpen] = useState(false);

  function handlePlaceOrder() {
    if (!restaurant) return;
    if (!address.trim()) {
      toast("Add a delivery address to continue", "error");
      return;
    }
    setPlacing(true);
    const result = placeOrder({
      restaurantId: restaurant.id,
      items: cart.lines.map((l) => ({ menuItemId: l.menuItemId, name: l.name, price: l.price, qty: l.qty, emoji: l.emoji })),
      address,
    });
    setPlacing(false);
    if (!result.ok) {
      toast(result.error, "error");
      if (result.error.toLowerCase().includes("balance")) setTopUpOpen(true);
      return;
    }
    cart.clear();
    toast("Order placed! Choppa is on it 🚀", "success");
    router.push("/dashboard/orders");
  }

  if (cart.lines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <ShoppingBag size={40} className="text-choppa-ink-soft" />
        <p className="mt-3 font-display text-lg font-semibold text-choppa-ink">Your cart is empty</p>
        <p className="mt-1 text-sm text-choppa-ink-soft">Add items from a restaurant to see them here.</p>
        <Link href="/dashboard/restaurants">
          <Button className="mt-4">Browse restaurants</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <div>
          <h1 className="font-display text-2xl font-bold text-choppa-ink">Your cart</h1>
          <p className="mt-1 text-sm text-choppa-ink-soft">Ordering from {restaurant?.name}</p>
        </div>

        <Card>
          <ul className="divide-y divide-black/5">
            {cart.lines.map((line) => (
              <li key={line.menuItemId} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <EmojiBadge emoji={line.emoji} size={48} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-choppa-ink">{line.name}</p>
                  <p className="text-xs text-choppa-ink-soft">{formatNaira(line.price)} each</p>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-choppa-red/10 px-1.5 py-1">
                  <button
                    onClick={() => cart.setQty(line.menuItemId, line.qty - 1)}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-choppa-red shadow-sm"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="w-4 text-center text-sm font-bold text-choppa-red">{line.qty}</span>
                  <button
                    onClick={() => cart.setQty(line.menuItemId, line.qty + 1)}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-choppa-red shadow-sm"
                    aria-label="Increase quantity"
                  >
                    <Plus size={13} />
                  </button>
                </div>
                <p className="w-20 shrink-0 text-right text-sm font-semibold text-choppa-ink">
                  {formatNaira(line.price * line.qty)}
                </p>
                <button
                  onClick={() => cart.removeItem(line.menuItemId)}
                  className="text-choppa-ink-soft hover:text-red-600"
                  aria-label="Remove item"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Delivery address" />
          <TextAreaField
            id="address"
            label=""
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Where should Choppa deliver this order?"
          />
        </Card>
      </div>

      <div>
        <Card className="sticky top-20">
          <CardHeader title="Order summary" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-choppa-ink-soft">
              <span>Subtotal</span>
              <span className="font-medium text-choppa-ink">{formatNaira(cart.subtotal)}</span>
            </div>
            <div className="flex justify-between text-choppa-ink-soft">
              <span>Delivery fee</span>
              <span className="font-medium text-choppa-ink">{formatNaira(deliveryFee)}</span>
            </div>
            <div className="my-2 h-px bg-black/5" />
            <div className="flex justify-between text-base font-bold text-choppa-ink">
              <span>Total</span>
              <span>{formatNaira(total)}</span>
            </div>
          </div>
          <p className="mt-3 text-xs text-choppa-ink-soft">
            Wallet balance: <span className="font-semibold text-choppa-ink">{formatNaira(userProfile?.balance ?? 0)}</span>
          </p>
          <Button className="mt-4 w-full" size="lg" onClick={handlePlaceOrder} disabled={placing}>
            {placing ? "Placing order…" : `Place order • ${formatNaira(total)}`}
          </Button>
          <button
            onClick={() => cart.clear()}
            className="mt-2 w-full text-center text-xs font-semibold text-choppa-ink-soft hover:text-red-600"
          >
            Clear cart
          </button>
        </Card>
      </div>

      <TopUpModal open={topUpOpen} onClose={() => setTopUpOpen(false)} />
    </div>
  );
}
