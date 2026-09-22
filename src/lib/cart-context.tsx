"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { MenuItem, Restaurant } from "./types";
import { cartKey } from "./storage";
import { useStore } from "./store";

export interface CartLine {
  menuItemId: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  price: number;
  emoji: string;
  qty: number;
}

interface CartValue {
  lines: CartLine[];
  restaurantId: string | null;
  addItem: (item: MenuItem, restaurant: Restaurant) => { ok: boolean; blocked?: string };
  removeItem: (menuItemId: string) => void;
  setQty: (menuItemId: string, qty: number) => void;
  clear: () => void;
  subtotal: number;
  count: number;
}

const CartContext = createContext<CartValue | null>(null);

function readCart(email: string | null): CartLine[] {
  if (!email || typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(cartKey(email));
  return raw ? (JSON.parse(raw) as CartLine[]) : [];
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { session } = useStore();
  // Remounting per email (instead of an effect) gives each user a fresh
  // lazy-loaded cart without reading localStorage during the shared render pass.
  return (
    <CartProviderInner key={session?.email ?? "anon"} email={session?.email ?? null}>
      {children}
    </CartProviderInner>
  );
}

function CartProviderInner({
  email,
  children,
}: {
  email: string | null;
  children: React.ReactNode;
}) {
  const [lines, setLines] = useState<CartLine[]>(() => readCart(email));

  useEffect(() => {
    if (!email) return;
    window.localStorage.setItem(cartKey(email), JSON.stringify(lines));
  }, [lines, email]);

  const addItem = useCallback(
    (item: MenuItem, restaurant: Restaurant): { ok: boolean; blocked?: string } => {
      let blocked: string | undefined;
      setLines((prev) => {
        if (prev.length > 0 && prev[0].restaurantId !== restaurant.id) {
          blocked = prev[0].restaurantName;
          return prev;
        }
        const idx = prev.findIndex((l) => l.menuItemId === item.id);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 };
          return copy;
        }
        return [
          ...prev,
          {
            menuItemId: item.id,
            restaurantId: restaurant.id,
            restaurantName: restaurant.name,
            name: item.name,
            price: item.price,
            emoji: item.emoji,
            qty: 1,
          },
        ];
      });
      return blocked ? { ok: false, blocked } : { ok: true };
    },
    []
  );

  const removeItem = useCallback((menuItemId: string) => {
    setLines((prev) => prev.filter((l) => l.menuItemId !== menuItemId));
  }, []);

  const setQty = useCallback((menuItemId: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.menuItemId !== menuItemId)
        : prev.map((l) => (l.menuItemId === menuItemId ? { ...l, qty } : l))
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const subtotal = useMemo(() => lines.reduce((s, l) => s + l.price * l.qty, 0), [lines]);
  const count = useMemo(() => lines.reduce((s, l) => s + l.qty, 0), [lines]);
  const restaurantId = lines[0]?.restaurantId ?? null;

  return (
    <CartContext.Provider value={{ lines, restaurantId, addItem, removeItem, setQty, clear, subtotal, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
