"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast-context";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmojiBadge } from "@/components/ui/Avatar";
import { MenuItemModal } from "@/components/seller/MenuItemModal";
import { formatNaira } from "@/lib/format";
import { MenuItem } from "@/lib/types";

export default function SellerMenuPage() {
  const { restaurant, menuForRestaurant, addMenuItem, updateMenuItem, removeMenuItem } = useStore();
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);

  const items = restaurant ? menuForRestaurant(restaurant.id) : [];
  const grouped = items.reduce<Record<string, MenuItem[]>>((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {});

  function openAdd() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(item: MenuItem) {
    setEditing(item);
    setModalOpen(true);
  }

  function handleSave(payload: Omit<MenuItem, "id" | "restaurantId">) {
    if (editing) {
      updateMenuItem(editing.id, payload);
      toast("Menu item updated", "success");
    } else {
      addMenuItem(payload);
      toast("Menu item added", "success");
    }
  }

  function handleDelete(item: MenuItem) {
    removeMenuItem(item.id);
    toast(`Removed ${item.name}`, "default");
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-choppa-ink">Menu</h1>
          <p className="mt-1 text-sm text-choppa-ink-soft">{items.length} items on your menu</p>
        </div>
        <Button onClick={openAdd}>
          <Plus size={16} /> Add item
        </Button>
      </div>

      {Object.entries(grouped).map(([category, categoryItems]) => (
        <Card key={category}>
          <CardHeader title={category} subtitle={`${categoryItems.length} item${categoryItems.length > 1 ? "s" : ""}`} />
          <ul className="divide-y divide-black/5">
            {categoryItems.map((item) => (
              <li key={item.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <EmojiBadge emoji={item.emoji} accent={restaurant?.accent ?? "red"} size={48} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-choppa-ink">{item.name}</p>
                    {!item.available && <Badge tone="neutral">Unavailable</Badge>}
                    {item.popular && <Badge tone="gold">Popular</Badge>}
                  </div>
                  <p className="truncate text-xs text-choppa-ink-soft">{item.description}</p>
                </div>
                <p className="shrink-0 text-sm font-semibold text-choppa-ink">{formatNaira(item.price)}</p>
                <button
                  onClick={() => updateMenuItem(item.id, { available: !item.available })}
                  className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
                    item.available ? "bg-choppa-red" : "bg-black/15"
                  }`}
                  aria-label="Toggle availability"
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                      item.available ? "translate-x-4" : "translate-x-0.5"
                    }`}
                  />
                </button>
                <button
                  onClick={() => openEdit(item)}
                  className="rounded-full p-2 text-choppa-ink-soft hover:bg-black/5 hover:text-choppa-ink"
                  aria-label="Edit item"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="rounded-full p-2 text-choppa-ink-soft hover:bg-red-50 hover:text-red-600"
                  aria-label="Delete item"
                >
                  <Trash2 size={15} />
                </button>
              </li>
            ))}
          </ul>
        </Card>
      ))}

      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="font-display text-lg font-semibold text-choppa-ink">Your menu is empty</p>
          <p className="mt-1 text-sm text-choppa-ink-soft">Add your first dish to start receiving orders.</p>
          <Button className="mt-4" onClick={openAdd}>
            <Plus size={16} /> Add menu item
          </Button>
        </div>
      )}

      <MenuItemModal
        key={`${modalOpen}-${editing?.id ?? "new"}`}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initial={editing}
      />
    </div>
  );
}
