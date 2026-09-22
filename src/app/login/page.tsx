"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { useToast } from "@/lib/toast-context";
import { Button } from "@/components/ui/Button";
import { TextField, SelectField } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { ChoppaMark } from "@/components/brand/ChoppaMark";
import { Role, Restaurant } from "@/lib/types";

const CUISINES: Restaurant["cuisine"][] = [
  "Nigerian",
  "Fast Food",
  "Grill & BBQ",
  "Chinese",
  "Seafood",
  "Pastries & Bakery",
  "Smoothies & Drinks",
];

type Mode = "login" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const { session, login, signupUser, signupSeller } = useStore();
  const { toast } = useToast();

  const [mode, setMode] = useState<Mode>("login");
  const [role, setRole] = useState<Role>("user");

  useEffect(() => {
    if (session) router.replace(session.role === "seller" ? "/seller" : "/dashboard");
  }, [session, router]);

  // shared login fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // signup fields
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [cuisine, setCuisine] = useState<Restaurant["cuisine"]>("Nigerian");

  function resetSignupExtras() {
    setName("");
    setConfirmPassword("");
    setPhone("");
    setAddress("");
    setReferralCode("");
    setRestaurantName("");
    setCuisine("Nigerian");
  }

  function fillDemo(demoRole: Role) {
    setMode("login");
    setRole(demoRole);
    setEmail(demoRole === "user" ? "ada@choppa.app" : "mamaputs@choppa.app");
    setPassword("choppa123");
    setError("");
  }

  function handleLoginSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Enter your email and password to continue.");
      return;
    }
    setConfirmOpen(true);
  }

  async function confirmLogin() {
    setSubmitting(true);
    const result = await login(email, password, role);
    setSubmitting(false);
    setConfirmOpen(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    toast(`Welcome back! Logged in as ${role === "seller" ? "seller" : "customer"}.`, "success");
    router.push(role === "seller" ? "/seller" : "/dashboard");
  }

  async function handleSignupSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }
    setSubmitting(true);
    const result =
      role === "user"
        ? await signupUser({ email, password, name, phone, address, referralCode })
        : await signupSeller({
            email,
            password,
            ownerName: name,
            restaurantName,
            cuisine,
            address,
            phone,
          });
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    toast("Account created — welcome to Choppa!", "success");
    router.push(role === "seller" ? "/seller" : "/dashboard");
  }

  return (
    <main className="flex min-h-screen">
      <section className="relative hidden w-[42%] flex-col justify-between overflow-hidden bg-choppa-green p-10 text-choppa-cream lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-choppa-green-light/40"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-[-4rem] left-[-4rem] h-72 w-72 rounded-full bg-choppa-red/20"
        />
        <Link href="/" className="relative flex items-center gap-3">
          <ChoppaMark size={40} className="text-choppa-cream" />
          <span className="font-display text-2xl font-bold">Choppa</span>
        </Link>

        <div className="relative">
          <p className="font-display text-4xl font-semibold leading-tight">
            No need to H,
            <br />
            Just Choppa It.
          </p>
          <p className="mt-4 max-w-sm text-choppa-cream/80">
            Hot food, fast delivery. Order from restaurants near you, or open your kitchen
            to thousands of hungry customers.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-white/10 px-3.5 py-2 font-medium">
              ⚡ Fast Delivery
            </span>
            <span className="rounded-full bg-white/10 px-3.5 py-2 font-medium">
              🍲 Tasty Food
            </span>
            <span className="rounded-full bg-white/10 px-3.5 py-2 font-medium">
              🤝 Earn &amp; Refer
            </span>
          </div>
        </div>

        <p className="relative text-xs text-choppa-cream/60">
          &copy; {new Date().getFullYear()} Choppa. Made for chop lovers.
        </p>
      </section>

      <section className="flex w-full flex-1 flex-col items-center justify-center bg-choppa-cream px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <ChoppaMark size={34} className="text-choppa-red" />
            <span className="font-display text-xl font-bold text-choppa-ink">Choppa</span>
          </div>

          <div className="mb-6 flex rounded-full bg-black/5 p-1">
            <button
              type="button"
              onClick={() => setRole("user")}
              className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${
                role === "user" ? "bg-white text-choppa-ink shadow-sm" : "text-choppa-ink-soft"
              }`}
            >
              Order food
            </button>
            <button
              type="button"
              onClick={() => setRole("seller")}
              className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${
                role === "seller" ? "bg-white text-choppa-ink shadow-sm" : "text-choppa-ink-soft"
              }`}
            >
              Sell on Choppa
            </button>
          </div>

          <h1 className="font-display text-2xl font-bold text-choppa-ink">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-1 text-sm text-choppa-ink-soft">
            {role === "user"
              ? mode === "login"
                ? "Log in to order food from restaurants near you."
                : "Sign up to start ordering on Choppa."
              : mode === "login"
              ? "Log in to manage your restaurant on Choppa."
              : "List your restaurant and start selling on Choppa."}
          </p>

          {mode === "login" ? (
            <form className="mt-6 space-y-4" onSubmit={handleLoginSubmit}>
              <TextField
                id="email"
                label="Email address"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                id="password"
                label="Password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && <p className="text-sm font-medium text-red-600">{error}</p>}
              <Button type="submit" className="w-full" size="lg">
                Log in {role === "seller" ? "to seller portal" : ""}
              </Button>
              <button
                type="button"
                onClick={() => fillDemo(role)}
                className="w-full text-center text-xs font-semibold text-choppa-ink-soft underline decoration-dotted underline-offset-4 hover:text-choppa-red"
              >
                Use demo {role} account
              </button>
            </form>
          ) : (
            <form className="mt-6 space-y-4" onSubmit={handleSignupSubmit}>
              <TextField
                id="name"
                label={role === "user" ? "Full name" : "Owner / manager name"}
                placeholder="e.g. Ada Obi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              {role === "seller" && (
                <>
                  <TextField
                    id="restaurantName"
                    label="Restaurant name"
                    placeholder="e.g. Mama Put's Kitchen"
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    required
                  />
                  <SelectField
                    id="cuisine"
                    label="Cuisine type"
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value as Restaurant["cuisine"])}
                  >
                    {CUISINES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </SelectField>
                </>
              )}
              <TextField
                id="signupEmail"
                label="Email address"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                id="address"
                label={role === "user" ? "Delivery address" : "Business address"}
                placeholder="Street, area, city"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
              <TextField
                id="phone"
                label="Phone number"
                type="tel"
                placeholder="0803 000 0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-3">
                <TextField
                  id="signupPassword"
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="At least 6 chars"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <TextField
                  id="confirmPassword"
                  label="Confirm password"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              {role === "user" && (
                <TextField
                  id="referralCode"
                  label="Referral code (optional)"
                  placeholder="e.g. ADA-4F2K"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                />
              )}
              {error && <p className="text-sm font-medium text-red-600">{error}</p>}
              <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                {submitting ? "Creating account…" : "Create account"}
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-choppa-ink-soft">
            {mode === "login" ? "New to Choppa?" : "Already have an account?"}{" "}
            <button
              type="button"
              className="font-semibold text-choppa-red hover:underline"
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setError("");
                resetSignupExtras();
              }}
            >
              {mode === "login" ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
      </section>

      <Modal open={confirmOpen} onClose={() => !submitting && setConfirmOpen(false)} labelledBy="confirm-login-title">
        <h2 id="confirm-login-title" className="font-display text-lg font-semibold text-choppa-ink">
          Did you just log in, {email || "there"}?
        </h2>
        <p className="mt-2 text-sm text-choppa-ink-soft">
          We want to make sure it&apos;s really you signing in to the {role === "seller" ? "seller" : "customer"}{" "}
          portal with <span className="font-semibold text-choppa-ink">{email}</span>.
        </p>
        <div className="mt-6 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setConfirmOpen(false)}
            disabled={submitting}
          >
            No, cancel
          </Button>
          <Button className="flex-1" onClick={confirmLogin} disabled={submitting}>
            {submitting ? "Checking…" : "Yes, it's me"}
          </Button>
        </div>
      </Modal>
    </main>
  );
}
