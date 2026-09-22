"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast-context";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { Avatar } from "@/components/ui/Avatar";

export default function UserSettingsPage() {
  const { session, account, userProfile, updateUserProfile, logout } = useStore();
  const { toast } = useToast();
  const router = useRouter();

  const [name, setName] = useState(userProfile?.name ?? "");
  const [phone, setPhone] = useState(userProfile?.phone ?? "");
  const [address, setAddress] = useState(userProfile?.address ?? "");
  const [notifOrders, setNotifOrders] = useState(true);
  const [notifPromos, setNotifPromos] = useState(false);

  function saveProfile(e: FormEvent) {
    e.preventDefault();
    updateUserProfile({ name, phone, address });
    toast("Profile updated", "success");
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-choppa-ink">Settings</h1>
        <p className="mt-1 text-sm text-choppa-ink-soft">Manage your profile and preferences</p>
      </div>

      <Card>
        <CardHeader title="Profile" />
        <div className="mb-5 flex items-center gap-4">
          <Avatar name={userProfile?.name ?? "You"} color={userProfile?.avatarColor} size={56} />
          <div>
            <p className="font-display text-base font-semibold text-choppa-ink">{userProfile?.name}</p>
            <p className="text-sm text-choppa-ink-soft">{session?.email}</p>
          </div>
        </div>
        <form className="space-y-4" onSubmit={saveProfile}>
          <TextField id="name" label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField id="email" label="Email address" value={account?.email ?? ""} disabled />
          <TextField id="phone" label="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <TextField
            id="address"
            label="Default delivery address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <Button type="submit">Save changes</Button>
        </form>
      </Card>

      <Card>
        <CardHeader title="Notifications" />
        <div className="space-y-3">
          <ToggleRow
            label="Order updates"
            description="Get notified when your order status changes"
            checked={notifOrders}
            onChange={setNotifOrders}
          />
          <ToggleRow
            label="Promotions & offers"
            description="Occasional deals from restaurants you love"
            checked={notifPromos}
            onChange={setNotifPromos}
          />
        </div>
      </Card>

      <Card>
        <CardHeader title="Account" />
        <Button
          variant="outline"
          className="w-full justify-start text-red-600"
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

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-choppa-ink">{label}</p>
        <p className="text-xs text-choppa-ink-soft">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-choppa-red" : "bg-black/15"
        }`}
        aria-pressed={checked}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}
