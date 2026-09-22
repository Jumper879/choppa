"use client";

import { FormEvent, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { TextField, TextAreaField } from "@/components/ui/Field";
import { MenuItem } from "@/lib/types";

const EMOJI_OPTIONS = ["🍚", "🍲", "🥘", "🍢", "🍖", "🍗", "🌯", "🥡", "🥟", "🐟", "🦐", "🥧", "🍰", "🍩", "🥭", "🥒", "🍹", "🍟"];

export function MenuItemModal({
  open,
  onClose,
  onSave,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (item: Omit<MenuItem, "id" | "restaurantId">) => void;
  initial?: MenuItem | null;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(initial?.price ?? 2000);
  const [category, setCategory] = useState(initial?.category ?? "Mains");
  const [emoji, setEmoji] = useState(initial?.emoji ?? EMOJI_OPTIONS[0]);
  const [available, setAvailable] = useState(initial?.available ?? true);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || price <= 0) return;
    onSave({ name, description, price, category, emoji, available, popular: initial?.popular });
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} labelledBy="menu-item-title">
      <h2 id="menu-item-title" className="font-display text-lg font-semibold text-choppa-ink">
        {initial ? "Edit menu item" : "Add menu item"}
      </h2>
      <form className="mt-4 space-y-4" onSubmit={submit}>
        <div>
          <p className="mb-1.5 text-sm font-medium text-choppa-ink">Icon</p>
          <div className="flex flex-wrap gap-1.5">
            {EMOJI_OPTIONS.map((e) => (
              <button
                type="button"
                key={e}
                onClick={() => setEmoji(e)}
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg transition-colors ${
                  emoji === e ? "bg-choppa-red/15 ring-2 ring-choppa-red" : "bg-black/5 hover:bg-black/10"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
        <TextField id="itemName" label="Item name" value={name} onChange={(e) => setName(e.target.value)} required />
        <TextAreaField
          id="itemDescription"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-3">
          <TextField
            id="itemPrice"
            label="Price (₦)"
            type="number"
            min={100}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
          />
          <TextField
            id="itemCategory"
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <label className="flex items-center gap-2 text-sm font-medium text-choppa-ink">
          <input
            type="checkbox"
            checked={available}
            onChange={(e) => setAvailable(e.target.checked)}
            className="h-4 w-4 rounded accent-choppa-red"
          />
          Available for orders
        </label>
        <div className="mt-2 flex gap-3">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            {initial ? "Save changes" : "Add item"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
