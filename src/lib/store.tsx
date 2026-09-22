"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Account,
  DB,
  MenuItem,
  Order,
  OrderItem,
  OrderStatus,
  Referral,
  Restaurant,
  Role,
  SellerProfile,
  Transaction,
  UserProfile,
} from "./types";
import { loadDB, loadSession, saveDB, saveSession, genId } from "./storage";
import { hashPassword } from "./hash";
import { referralCodeFor } from "./format";

export interface SignupUserPayload {
  email: string;
  password: string;
  name: string;
  phone?: string;
  address?: string;
  referralCode?: string;
}

export interface SignupSellerPayload {
  email: string;
  password: string;
  ownerName: string;
  restaurantName: string;
  cuisine: Restaurant["cuisine"];
  address: string;
  phone?: string;
}

type Result = { ok: true } | { ok: false; error: string };

interface StoreValue {
  ready: boolean;
  db: DB;
  session: { email: string; role: Role } | null;
  account: Account | undefined;
  userProfile: UserProfile | undefined;
  sellerProfile: SellerProfile | undefined;
  restaurant: Restaurant | undefined;
  login: (email: string, password: string, role: Role) => Promise<Result>;
  signupUser: (payload: SignupUserPayload) => Promise<Result>;
  signupSeller: (payload: SignupSellerPayload) => Promise<Result>;
  logout: () => void;
  switchRole: () => void;
  hasRole: (role: Role) => boolean;
  topUpWallet: (amount: number) => void;
  requestPayout: (amount: number, destination: string) => void;
  placeOrder: (args: {
    restaurantId: string;
    items: OrderItem[];
    address: string;
  }) => Result;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  addMenuItem: (item: Omit<MenuItem, "id" | "restaurantId">) => void;
  updateMenuItem: (id: string, patch: Partial<MenuItem>) => void;
  removeMenuItem: (id: string) => void;
  updateUserProfile: (patch: Partial<UserProfile>) => void;
  updateRestaurant: (patch: Partial<Restaurant>) => void;
  ordersForUser: (email: string) => Order[];
  ordersForRestaurant: (restaurantId: string) => Order[];
  transactionsFor: (email: string) => Transaction[];
  referralsFor: (email: string) => Referral[];
  menuForRestaurant: (restaurantId: string) => MenuItem[];
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [db, setDb] = useState<DB>(() => ({
    accounts: [],
    restaurants: [],
    menuItems: [],
    orders: [],
    transactions: [],
    referrals: [],
  }));
  const [session, setSession] = useState<{ email: string; role: Role } | null>(null);

  useEffect(() => {
    // localStorage isn't available during SSR, so hydrate after mount to avoid a mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDb(loadDB());
    setSession(loadSession());
    setReady(true);
  }, []);

  const persist = useCallback((next: DB) => {
    setDb(next);
    saveDB(next);
  }, []);

  const setAndPersistSession = useCallback((next: { email: string; role: Role } | null) => {
    setSession(next);
    saveSession(next);
  }, []);

  const account = useMemo(
    () => (session ? db.accounts.find((a) => a.email === session.email) : undefined),
    [db, session]
  );
  const userProfile = account?.user;
  const sellerProfile = account?.seller;
  const restaurant = useMemo(
    () =>
      sellerProfile
        ? db.restaurants.find((r) => r.id === sellerProfile.restaurantId)
        : undefined,
    [db, sellerProfile]
  );

  const login = useCallback(
    async (email: string, password: string, role: Role): Promise<Result> => {
      const normalizedEmail = email.trim().toLowerCase();
      const found = db.accounts.find((a) => a.email === normalizedEmail);
      if (!found) {
        return { ok: false, error: "No Choppa account found for this email." };
      }
      const hash = await hashPassword(password);
      if (hash !== found.passwordHash) {
        return { ok: false, error: "That password doesn't match our records." };
      }
      if (role === "user" && !found.user) {
        return {
          ok: false,
          error: "This email has no customer account yet. Sign up to order food.",
        };
      }
      if (role === "seller" && !found.seller) {
        return {
          ok: false,
          error: "This email has no seller account yet. Sign up to sell on Choppa.",
        };
      }
      setAndPersistSession({ email: normalizedEmail, role });
      return { ok: true };
    },
    [db, setAndPersistSession]
  );

  const signupUser = useCallback(
    async (payload: SignupUserPayload): Promise<Result> => {
      const email = payload.email.trim().toLowerCase();
      const existing = db.accounts.find((a) => a.email === email);
      if (existing?.user) {
        return { ok: false, error: "A customer account already exists for this email." };
      }
      const hash = await hashPassword(payload.password);
      if (existing && existing.passwordHash !== hash) {
        return {
          ok: false,
          error: "This email is already registered with a different password.",
        };
      }

      const referralCode = referralCodeFor(payload.name);
      const newUser: UserProfile = {
        kind: "user",
        name: payload.name,
        phone: payload.phone,
        address: payload.address,
        avatarColor: ["choppa-red", "choppa-green-mid", "choppa-gold", "choppa-purple"][
          Math.floor(Math.random() * 4)
        ],
        balance: 0,
        referralCode,
        referredBy: payload.referralCode?.trim().toUpperCase() || undefined,
        createdAt: new Date().toISOString(),
      };

      const next: DB = { ...db, accounts: [...db.accounts] };
      let referrerBonus: Transaction | null = null;
      let referralRow: Referral | null = null;

      if (payload.referralCode) {
        const code = payload.referralCode.trim().toUpperCase();
        const referrer = next.accounts.find((a) => a.user?.referralCode === code);
        if (referrer?.user) {
          referrer.user = { ...referrer.user, balance: referrer.user.balance + 1500 };
          referrerBonus = {
            id: genId("t"),
            ownerEmail: referrer.email,
            role: "user",
            type: "referral_bonus",
            amount: 1500,
            description: `Referral bonus — ${payload.name} joined`,
            status: "completed",
            createdAt: new Date().toISOString(),
          };
          referralRow = {
            id: genId("rf"),
            referrerEmail: referrer.email,
            referredEmail: email,
            referredName: payload.name,
            commissionEarned: 1500,
            createdAt: new Date().toISOString(),
            status: "active",
          };
        }
      }

      if (existing) {
        existing.user = newUser;
      } else {
        next.accounts.push({ email, passwordHash: hash, user: newUser });
      }
      if (referrerBonus) next.transactions = [referrerBonus, ...next.transactions];
      if (referralRow) next.referrals = [referralRow, ...next.referrals];

      persist(next);
      setAndPersistSession({ email, role: "user" });
      return { ok: true };
    },
    [db, persist, setAndPersistSession]
  );

  const signupSeller = useCallback(
    async (payload: SignupSellerPayload): Promise<Result> => {
      const email = payload.email.trim().toLowerCase();
      const existing = db.accounts.find((a) => a.email === email);
      if (existing?.seller) {
        return { ok: false, error: "A seller account already exists for this email." };
      }
      const hash = await hashPassword(payload.password);
      if (existing && existing.passwordHash !== hash) {
        return {
          ok: false,
          error: "This email is already registered with a different password.",
        };
      }

      const restaurantId = genId("r");
      const emojiByAccent = ["🍽️", "🍛", "🍲", "🍚"];
      const accents: Restaurant["accent"][] = ["red", "green", "gold", "purple"];
      const newRestaurant: Restaurant = {
        id: restaurantId,
        ownerEmail: email,
        name: payload.restaurantName,
        cuisine: payload.cuisine,
        tagline: "New on Choppa — fresh from the kitchen",
        address: payload.address,
        distanceKm: Math.round((0.5 + Math.random() * 4) * 10) / 10,
        etaMins: 20 + Math.floor(Math.random() * 15),
        rating: 0,
        ratingCount: 0,
        deliveryFee: 600,
        coverEmoji: emojiByAccent[Math.floor(Math.random() * emojiByAccent.length)],
        accent: accents[Math.floor(Math.random() * accents.length)],
        isOpen: true,
      };
      const newSeller: SellerProfile = {
        kind: "seller",
        restaurantId,
        ownerName: payload.ownerName,
        phone: payload.phone,
        balance: 0,
        createdAt: new Date().toISOString(),
      };

      const next: DB = {
        ...db,
        accounts: [...db.accounts],
        restaurants: [...db.restaurants, newRestaurant],
      };
      if (existing) {
        existing.seller = newSeller;
      } else {
        next.accounts.push({ email, passwordHash: hash, seller: newSeller });
      }

      persist(next);
      setAndPersistSession({ email, role: "seller" });
      return { ok: true };
    },
    [db, persist, setAndPersistSession]
  );

  const logout = useCallback(() => setAndPersistSession(null), [setAndPersistSession]);

  const hasRole = useCallback(
    (role: Role) => (role === "user" ? Boolean(account?.user) : Boolean(account?.seller)),
    [account]
  );

  const switchRole = useCallback(() => {
    if (!session || !account) return;
    const nextRole: Role = session.role === "user" ? "seller" : "user";
    if (!hasRole(nextRole)) return;
    setAndPersistSession({ email: session.email, role: nextRole });
  }, [session, account, hasRole, setAndPersistSession]);

  const addTransaction = useCallback(
    (next: DB, tx: Omit<Transaction, "id" | "createdAt" | "status"> & { status?: Transaction["status"] }) => {
      const row: Transaction = {
        id: genId("t"),
        createdAt: new Date().toISOString(),
        status: tx.status ?? "completed",
        ...tx,
      };
      next.transactions = [row, ...next.transactions];
      return row;
    },
    []
  );

  const topUpWallet = useCallback(
    (amount: number) => {
      if (!session || !account?.user) return;
      const next: DB = { ...db, accounts: [...db.accounts] };
      const acc = next.accounts.find((a) => a.email === session.email)!;
      acc.user = { ...acc.user!, balance: acc.user!.balance + amount };
      addTransaction(next, {
        ownerEmail: session.email,
        role: "user",
        type: "topup",
        amount,
        description: "Wallet top-up via card",
      });
      persist(next);
    },
    [session, account, db, persist, addTransaction]
  );

  const requestPayout = useCallback(
    (amount: number, destination: string) => {
      if (!session || !account?.seller) return;
      const next: DB = { ...db, accounts: [...db.accounts] };
      const acc = next.accounts.find((a) => a.email === session.email)!;
      acc.seller = { ...acc.seller!, balance: acc.seller!.balance - amount };
      addTransaction(next, {
        ownerEmail: session.email,
        role: "seller",
        type: "payout",
        amount: -amount,
        description: `Payout to ${destination}`,
        status: "pending",
      });
      persist(next);
    },
    [session, account, db, persist, addTransaction]
  );

  const placeOrder = useCallback(
    (args: { restaurantId: string; items: OrderItem[]; address: string }): Result => {
      if (!session || !account?.user) return { ok: false, error: "Not logged in." };
      const rest = db.restaurants.find((r) => r.id === args.restaurantId);
      if (!rest) return { ok: false, error: "Restaurant not found." };
      const subtotal = args.items.reduce((s, it) => s + it.price * it.qty, 0);
      const total = subtotal + rest.deliveryFee;
      if (account.user.balance < total) {
        return { ok: false, error: "Insufficient wallet balance. Top up to continue." };
      }
      const next: DB = { ...db, accounts: [...db.accounts] };
      const acc = next.accounts.find((a) => a.email === session.email)!;
      acc.user = { ...acc.user!, balance: acc.user!.balance - total };

      const order: Order = {
        id: genId("o"),
        userEmail: session.email,
        restaurantId: rest.id,
        restaurantName: rest.name,
        items: args.items,
        subtotal,
        deliveryFee: rest.deliveryFee,
        total,
        status: "placed",
        address: args.address,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      next.orders = [order, ...next.orders];

      addTransaction(next, {
        ownerEmail: session.email,
        role: "user",
        type: "order",
        amount: -total,
        description: `Order at ${rest.name}`,
      });

      const seller = next.accounts.find((a) => a.seller?.restaurantId === rest.id);
      if (seller?.seller) {
        seller.seller = { ...seller.seller, balance: seller.seller.balance + subtotal };
        addTransaction(next, {
          ownerEmail: seller.email,
          role: "seller",
          type: "sale",
          amount: subtotal,
          description: `New order — ${args.items.map((i) => i.name).join(", ")}`,
          status: "pending",
        });
      }

      persist(next);
      return { ok: true };
    },
    [session, account, db, persist, addTransaction]
  );

  const updateOrderStatus = useCallback(
    (orderId: string, status: OrderStatus) => {
      const next: DB = { ...db, orders: db.orders.map((o) => (o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o)) };
      persist(next);
    },
    [db, persist]
  );

  const addMenuItem = useCallback(
    (item: Omit<MenuItem, "id" | "restaurantId">) => {
      if (!sellerProfile) return;
      const row: MenuItem = { ...item, id: genId("m"), restaurantId: sellerProfile.restaurantId };
      persist({ ...db, menuItems: [...db.menuItems, row] });
    },
    [db, sellerProfile, persist]
  );

  const updateMenuItem = useCallback(
    (id: string, patch: Partial<MenuItem>) => {
      persist({
        ...db,
        menuItems: db.menuItems.map((m) => (m.id === id ? { ...m, ...patch } : m)),
      });
    },
    [db, persist]
  );

  const removeMenuItem = useCallback(
    (id: string) => {
      persist({ ...db, menuItems: db.menuItems.filter((m) => m.id !== id) });
    },
    [db, persist]
  );

  const updateUserProfile = useCallback(
    (patch: Partial<UserProfile>) => {
      if (!session) return;
      const next: DB = { ...db, accounts: [...db.accounts] };
      const acc = next.accounts.find((a) => a.email === session.email)!;
      acc.user = { ...acc.user!, ...patch };
      persist(next);
    },
    [session, db, persist]
  );

  const updateRestaurant = useCallback(
    (patch: Partial<Restaurant>) => {
      if (!restaurant) return;
      persist({
        ...db,
        restaurants: db.restaurants.map((r) => (r.id === restaurant.id ? { ...r, ...patch } : r)),
      });
    },
    [db, restaurant, persist]
  );

  const ordersForUser = useCallback((email: string) => db.orders.filter((o) => o.userEmail === email), [db]);
  const ordersForRestaurant = useCallback(
    (restaurantId: string) => db.orders.filter((o) => o.restaurantId === restaurantId),
    [db]
  );
  const transactionsFor = useCallback(
    (email: string) => db.transactions.filter((t) => t.ownerEmail === email),
    [db]
  );
  const referralsFor = useCallback(
    (email: string) => db.referrals.filter((r) => r.referrerEmail === email),
    [db]
  );
  const menuForRestaurant = useCallback(
    (restaurantId: string) => db.menuItems.filter((m) => m.restaurantId === restaurantId),
    [db]
  );

  const value: StoreValue = {
    ready,
    db,
    session,
    account,
    userProfile,
    sellerProfile,
    restaurant,
    login,
    signupUser,
    signupSeller,
    logout,
    switchRole,
    hasRole,
    topUpWallet,
    requestPayout,
    placeOrder,
    updateOrderStatus,
    addMenuItem,
    updateMenuItem,
    removeMenuItem,
    updateUserProfile,
    updateRestaurant,
    ordersForUser,
    ordersForRestaurant,
    transactionsFor,
    referralsFor,
    menuForRestaurant,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
