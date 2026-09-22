"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast-context";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TextField, TextAreaField } from "@/components/ui/Field";
import { EmojiBadge } from "@/components/ui/Avatar";

export default function SellerSettingsPage() {
  const { session, restaurant, sellerProfile, updateRestaurant, logout } = useStore();
  const { toast } = useToast();
  const router = useRouter();

  const [name, setName] = useState(restaurant?.name ?? "");
  const [tagline, setTagline] = useState(restaurant?.tagline ?? "");
  const [address, setAddress] = useState(restaurant?.address ?? "");
  const [deliveryFee, setDeliveryFee] = useState(restaurant?.deliveryFee ?? 600);
  const [isOpen, setIsOpen] = useState(restaurant?.isOpen ?? true);

  function saveProfile(e: FormEvent) {
    e.preventDefault();
    updateRestaurant({ name, tagline, address, deliveryFee, isOpen });
    toast("Restaurant profile updated", "success");
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-choppa-ink">Restaurant settings</h1>
        <p className="mt-1 text-sm text-choppa-ink-soft">Keep your storefront up to date</p>
      </div>

      <Card>
        <CardHeader title="Storefront" />
        <div className="mb-5 flex items-center gap-4">
          <EmojiBadge emoji={restaurant?.coverEmoji ?? "🍽️"} accent={restaurant?.accent ?? "red"} size={56} />
          <div>
            <p className="font-display text-base font-semibold text-choppa-ink">{restaurant?.name}</p>
            <p className="text-sm text-choppa-ink-soft">{restaurant?.cuisine}</p>
          </div>
        </div>
        <form className="space-y-4" onSubmit={saveProfile}>
          <TextField id="restaurantName" label="Restaurant name" value={name} onChange={(e) => setName(e.target.value)} />
          <TextAreaField id="tagline" label="Tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} />
          <TextField id="address" label="Business address" value={address} onChange={(e) => setAddress(e.target.value)} />
          <TextField
            id="deliveryFee"
            label="Delivery fee (₦)"
            type="number"
            min={0}
            value={deliveryFee}
            onChange={(e) => setDeliveryFee(Number(e.target.value))}
          />
          <label className="flex items-center gap-2 text-sm font-medium text-choppa-ink">
            <input
              type="checkbox"
              checked={isOpen}
              onChange={(e) => setIsOpen(e.target.checked)}
              className="h-4 w-4 rounded accent-choppa-red"
            />
            Restaurant is currently open for orders
          </label>
          <Button type="submit">Save changes</Button>
        </form>
      </Card>

      <Card>
        <CardHeader title="Account" />
        <p className="text-sm text-choppa-ink-soft">
          Manager: <span className="font-medium text-choppa-ink">{sellerProfile?.ownerName}</span>
        </p>
        <p className="mt-1 text-sm text-choppa-ink-soft">
          Login email: <span className="font-medium text-choppa-ink">{session?.email}</span>
        </p>
        <Button
          variant="outline"
          className="mt-4 w-full justify-start text-red-600"
          onClick={() => {
            logout();
            router.push("/login");
          }}
        >
          Log out of Choppa
        </Button>
      </Card>
    </div>
  );
}
