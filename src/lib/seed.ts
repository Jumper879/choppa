import { Account, DB, MenuItem, Order, Referral, Restaurant, Transaction } from "./types";

const DEMO_HASH =
  "5f428fee6949cc349268ef16c7e10c74a672ea7f3df530c4ad671d969d2db878"; // "choppa123"

const now = () => new Date().toISOString();
const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString();

const restaurants: Restaurant[] = [
  {
    id: "r1",
    ownerEmail: "mamaputs@choppa.app",
    name: "Mama Put's Kitchen",
    cuisine: "Nigerian",
    tagline: "Home-style soups & swallow, made fresh daily",
    address: "14 Allen Avenue, Ikeja, Lagos",
    distanceKm: 1.2,
    etaMins: 22,
    rating: 4.8,
    ratingCount: 612,
    deliveryFee: 600,
    coverEmoji: "🍲",
    accent: "red",
    isOpen: true,
  },
  {
    id: "r2",
    ownerEmail: "seed-grillchill@choppa.app",
    name: "Grill & Chill BBQ",
    cuisine: "Grill & BBQ",
    tagline: "Smoky suya, ribs and grilled chicken",
    address: "8 Admiralty Way, Lekki Phase 1, Lagos",
    distanceKm: 2.4,
    etaMins: 28,
    rating: 4.6,
    ratingCount: 389,
    deliveryFee: 800,
    coverEmoji: "🍖",
    accent: "green",
    isOpen: true,
  },
  {
    id: "r3",
    ownerEmail: "seed-lagosfried@choppa.app",
    name: "Lagos Fried Chicken",
    cuisine: "Fast Food",
    tagline: "Crispy chicken, chips & shawarma",
    address: "22 Opebi Road, Ikeja, Lagos",
    distanceKm: 0.8,
    etaMins: 18,
    rating: 4.5,
    ratingCount: 1024,
    deliveryFee: 500,
    coverEmoji: "🍗",
    accent: "gold",
    isOpen: true,
  },
  {
    id: "r4",
    ownerEmail: "seed-goldendragon@choppa.app",
    name: "Golden Dragon",
    cuisine: "Chinese",
    tagline: "Wok-fried noodles, rice & dumplings",
    address: "5 Adeola Odeku, Victoria Island, Lagos",
    distanceKm: 3.6,
    etaMins: 32,
    rating: 4.4,
    ratingCount: 256,
    deliveryFee: 900,
    coverEmoji: "🥡",
    accent: "purple",
    isOpen: true,
  },
  {
    id: "r5",
    ownerEmail: "seed-oceanbasket@choppa.app",
    name: "Ocean Basket Seafood",
    cuisine: "Seafood",
    tagline: "Grilled fish, prawns & seafood platters",
    address: "3 Bishop Aboyade Cole St, Victoria Island, Lagos",
    distanceKm: 4.1,
    etaMins: 35,
    rating: 4.7,
    ratingCount: 178,
    deliveryFee: 1000,
    coverEmoji: "🦐",
    accent: "red",
    isOpen: true,
  },
  {
    id: "r6",
    ownerEmail: "seed-sweetcrumbs@choppa.app",
    name: "Sweet Crumbs Bakery",
    cuisine: "Pastries & Bakery",
    tagline: "Meat pies, doughnuts, cakes & pastries",
    address: "17 Toyin Street, Ikeja, Lagos",
    distanceKm: 1.6,
    etaMins: 15,
    rating: 4.9,
    ratingCount: 843,
    deliveryFee: 500,
    coverEmoji: "🥐",
    accent: "gold",
    isOpen: true,
  },
  {
    id: "r7",
    ownerEmail: "seed-freshsqueeze@choppa.app",
    name: "Fresh Squeeze Bar",
    cuisine: "Smoothies & Drinks",
    tagline: "Cold-pressed juices & smoothie bowls",
    address: "9 Karimu Kotun St, Victoria Island, Lagos",
    distanceKm: 2.9,
    etaMins: 20,
    rating: 4.6,
    ratingCount: 301,
    deliveryFee: 700,
    coverEmoji: "🥤",
    accent: "green",
    isOpen: false,
  },
];

const menuItems: MenuItem[] = [
  // Mama Put's Kitchen
  { id: "m1", restaurantId: "r1", name: "Jollof Rice & Chicken", description: "Smoky party jollof with grilled chicken", price: 3500, category: "Rice", emoji: "🍚", available: true, popular: true },
  { id: "m2", restaurantId: "r1", name: "Egusi Soup & Pounded Yam", description: "Melon seed soup with assorted meat", price: 4500, category: "Soups & Swallow", emoji: "🍲", available: true, popular: true },
  { id: "m3", restaurantId: "r1", name: "Efo Riro & Semo", description: "Spinach stew with fish and beef", price: 4200, category: "Soups & Swallow", emoji: "🥘", available: true },
  { id: "m4", restaurantId: "r1", name: "Peppered Snail Platter", description: "Grilled snails in pepper sauce", price: 6000, category: "Extras", emoji: "🐌", available: true },
  { id: "m5", restaurantId: "r1", name: "Chapman", description: "Classic Nigerian fruit cocktail", price: 1500, category: "Drinks", emoji: "🍹", available: true },
  // Grill & Chill
  { id: "m6", restaurantId: "r2", name: "Beef Suya Platter", description: "Spicy skewered beef with onions", price: 4000, category: "Grill", emoji: "🍢", available: true, popular: true },
  { id: "m7", restaurantId: "r2", name: "BBQ Ribs Full Rack", description: "Slow-smoked ribs, house BBQ sauce", price: 8500, category: "Grill", emoji: "🍖", available: true, popular: true },
  { id: "m8", restaurantId: "r2", name: "Grilled Chicken Half", description: "Char-grilled chicken with chips", price: 5200, category: "Grill", emoji: "🍗", available: true },
  { id: "m9", restaurantId: "r2", name: "Zobo Drink", description: "Chilled hibiscus zobo, ginger-spiced", price: 1200, category: "Drinks", emoji: "🥤", available: true },
  // Lagos Fried Chicken
  { id: "m10", restaurantId: "r3", name: "Crispy Chicken Bucket", description: "8 pcs crispy fried chicken", price: 6500, category: "Chicken", emoji: "🍗", available: true, popular: true },
  { id: "m11", restaurantId: "r3", name: "Chicken Shawarma", description: "Loaded shawarma wrap with fries", price: 3200, category: "Wraps", emoji: "🌯", available: true, popular: true },
  { id: "m12", restaurantId: "r3", name: "Loaded Chips", description: "Chips topped with chicken bits & sauce", price: 2800, category: "Sides", emoji: "🍟", available: true },
  // Golden Dragon
  { id: "m13", restaurantId: "r4", name: "Beef Fried Rice", description: "Wok-fried rice with beef strips", price: 4800, category: "Rice", emoji: "🍚", available: true, popular: true },
  { id: "m14", restaurantId: "r4", name: "Chicken Chow Mein", description: "Stir-fried noodles with vegetables", price: 4600, category: "Noodles", emoji: "🥡", available: true },
  { id: "m15", restaurantId: "r4", name: "Prawn Dumplings", description: "Steamed dumplings, chilli oil", price: 3600, category: "Starters", emoji: "🥟", available: true },
  // Ocean Basket
  { id: "m16", restaurantId: "r5", name: "Grilled Catfish Platter", description: "Whole grilled catfish, pepper sauce", price: 7500, category: "Seafood", emoji: "🐟", available: true, popular: true },
  { id: "m17", restaurantId: "r5", name: "Prawn & Rice", description: "Garlic prawns over jollof rice", price: 8200, category: "Seafood", emoji: "🦐", available: true },
  // Sweet Crumbs
  { id: "m18", restaurantId: "r6", name: "Meat Pie (3pcs)", description: "Flaky pastry, seasoned minced beef", price: 1800, category: "Pastries", emoji: "🥧", available: true, popular: true },
  { id: "m19", restaurantId: "r6", name: "Red Velvet Slice", description: "Cream cheese frosted red velvet", price: 2200, category: "Cakes", emoji: "🍰", available: true },
  { id: "m20", restaurantId: "r6", name: "Doughnut Box (6pcs)", description: "Assorted glazed doughnuts", price: 2500, category: "Pastries", emoji: "🍩", available: true },
  // Fresh Squeeze
  { id: "m21", restaurantId: "r7", name: "Mango Tango Smoothie", description: "Mango, pineapple & orange blend", price: 2200, category: "Smoothies", emoji: "🥭", available: true },
  { id: "m22", restaurantId: "r7", name: "Green Detox Juice", description: "Cucumber, spinach, apple, lime", price: 2400, category: "Juices", emoji: "🥒", available: true },
];

const accounts: Account[] = [
  {
    email: "ada@choppa.app",
    passwordHash: DEMO_HASH,
    user: {
      kind: "user",
      name: "Ada Obi",
      phone: "0803 555 0142",
      address: "12 Bourdillon Road, Ikoyi, Lagos",
      avatarColor: "choppa-red",
      balance: 24500,
      referralCode: "ADA-4F2K",
      createdAt: daysAgo(96),
    },
  },
  {
    email: "mamaputs@choppa.app",
    passwordHash: DEMO_HASH,
    seller: {
      kind: "seller",
      restaurantId: "r1",
      ownerName: "Ngozi Adeyemi",
      phone: "0805 222 8891",
      balance: 186400,
      createdAt: daysAgo(210),
    },
  },
];

function buildOrders(sellerHistory: Order[]): Order[] {
  const items = [
    { menuItemId: "m1", name: "Jollof Rice & Chicken", price: 3500, qty: 2, emoji: "🍚" },
  ];
  const mk = (
    id: string,
    restaurantId: string,
    restaurantName: string,
    daysBack: number,
    status: Order["status"],
    orderItems = items
  ): Order => {
    const subtotal = orderItems.reduce((s, it) => s + it.price * it.qty, 0);
    const deliveryFee = restaurants.find((r) => r.id === restaurantId)?.deliveryFee ?? 600;
    return {
      id,
      userEmail: "ada@choppa.app",
      restaurantId,
      restaurantName,
      items: orderItems,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      status,
      address: "12 Bourdillon Road, Ikoyi, Lagos",
      createdAt: daysAgo(daysBack),
      updatedAt: daysAgo(daysBack),
    };
  };
  return [
    mk("o1", "r1", "Mama Put's Kitchen", 1, "out_for_delivery"),
    mk("o2", "r3", "Lagos Fried Chicken", 3, "delivered", [
      { menuItemId: "m10", name: "Crispy Chicken Bucket", price: 6500, qty: 1, emoji: "🍗" },
    ]),
    mk("o3", "r6", "Sweet Crumbs Bakery", 6, "delivered", [
      { menuItemId: "m18", name: "Meat Pie (3pcs)", price: 1800, qty: 2, emoji: "🥧" },
    ]),
    mk("o4", "r2", "Grill & Chill BBQ", 14, "delivered", [
      { menuItemId: "m6", name: "Beef Suya Platter", price: 4000, qty: 1, emoji: "🍢" },
    ]),
    mk("o5", "r1", "Mama Put's Kitchen", 30, "cancelled"),
    ...sellerHistory,
  ];
}

const SAMPLE_CUSTOMERS = [
  "tunde@choppa.app",
  "chioma@choppa.app",
  "bola@choppa.app",
  "kemi@choppa.app",
  "seed-customer1@choppa.app",
  "seed-customer2@choppa.app",
  "seed-customer3@choppa.app",
];

const R1_ITEMS = [
  { menuItemId: "m1", name: "Jollof Rice & Chicken", price: 3500, emoji: "🍚" },
  { menuItemId: "m2", name: "Egusi Soup & Pounded Yam", price: 4500, emoji: "🍲" },
  { menuItemId: "m3", name: "Efo Riro & Semo", price: 4200, emoji: "🥘" },
  { menuItemId: "m4", name: "Peppered Snail Platter", price: 6000, emoji: "🐌" },
  { menuItemId: "m5", name: "Chapman", price: 1500, emoji: "🍹" },
];

function buildSellerHistory(): Order[] {
  const orders: Order[] = [];
  for (let i = 0; i < 34; i++) {
    const daysBack = Math.floor(Math.random() * 29) + 2;
    const itemCount = 1 + Math.floor(Math.random() * 2);
    const picked: Order["items"] = [];
    for (let j = 0; j < itemCount; j++) {
      const base = R1_ITEMS[Math.floor(Math.random() * R1_ITEMS.length)];
      const existing = picked.find((p) => p.menuItemId === base.menuItemId);
      if (existing) existing.qty += 1;
      else picked.push({ ...base, qty: 1 + Math.floor(Math.random() * 2) });
    }
    const subtotal = picked.reduce((s, it) => s + it.price * it.qty, 0);
    const status: Order["status"] = Math.random() < 0.08 ? "cancelled" : "delivered";
    const ts = daysAgo(daysBack);
    orders.push({
      id: `o${100 + i}`,
      userEmail: SAMPLE_CUSTOMERS[i % SAMPLE_CUSTOMERS.length],
      restaurantId: "r1",
      restaurantName: "Mama Put's Kitchen",
      items: picked,
      subtotal,
      deliveryFee: 600,
      total: subtotal + 600,
      status,
      address: "Lagos, Nigeria",
      createdAt: ts,
      updatedAt: ts,
    });
  }
  return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

function buildTransactions(sellerHistory: Order[]): Transaction[] {
  const historySales: Transaction[] = sellerHistory
    .filter((o) => o.status === "delivered")
    .map((o) => ({
      id: `t${o.id}`,
      ownerEmail: "mamaputs@choppa.app",
      role: "seller" as const,
      type: "sale" as const,
      amount: o.subtotal,
      description: `Order ${o.id} — ${o.items.map((i) => i.name).join(", ")}`,
      status: "completed" as const,
      createdAt: o.createdAt,
    }));
  return [
    ...historySales,
    { id: "t1", ownerEmail: "ada@choppa.app", role: "user", type: "topup", amount: 20000, description: "Wallet top-up via card", status: "completed", createdAt: daysAgo(45) },
    { id: "t2", ownerEmail: "ada@choppa.app", role: "user", type: "order", amount: -7600, description: "Order at Mama Put's Kitchen", status: "completed", createdAt: daysAgo(1) },
    { id: "t3", ownerEmail: "ada@choppa.app", role: "user", type: "order", amount: -7000, description: "Order at Lagos Fried Chicken", status: "completed", createdAt: daysAgo(3) },
    { id: "t4", ownerEmail: "ada@choppa.app", role: "user", type: "referral_bonus", amount: 1500, description: "Referral bonus — Tunde J. joined", status: "completed", createdAt: daysAgo(10) },
    { id: "t5", ownerEmail: "ada@choppa.app", role: "user", type: "order", amount: -4100, description: "Order at Sweet Crumbs Bakery", status: "completed", createdAt: daysAgo(6) },
    { id: "t6", ownerEmail: "ada@choppa.app", role: "user", type: "referral_bonus", amount: 1500, description: "Referral bonus — Chioma E. joined", status: "completed", createdAt: daysAgo(22) },
    { id: "t7", ownerEmail: "ada@choppa.app", role: "user", type: "order", amount: -4600, description: "Order at Grill & Chill BBQ", status: "completed", createdAt: daysAgo(14) },
    { id: "t8", ownerEmail: "ada@choppa.app", role: "user", type: "topup", amount: 10000, description: "Wallet top-up via transfer", status: "completed", createdAt: daysAgo(60) },
    { id: "t9", ownerEmail: "mamaputs@choppa.app", role: "seller", type: "sale", amount: 7600, description: "Order #o1 — 2x Jollof Rice & Chicken", status: "pending", createdAt: daysAgo(1) },
    { id: "t10", ownerEmail: "mamaputs@choppa.app", role: "seller", type: "payout", amount: -50000, description: "Payout to GTBank •••• 4021", status: "completed", createdAt: daysAgo(7) },
    { id: "t11", ownerEmail: "mamaputs@choppa.app", role: "seller", type: "sale", amount: 12500, description: "Order #o0 — Weekend bulk order", status: "completed", createdAt: daysAgo(4) },
    { id: "t12", ownerEmail: "mamaputs@choppa.app", role: "seller", type: "sale", amount: 9200, description: "Order — Egusi Soup combo x2", status: "completed", createdAt: daysAgo(9) },
  ];
}

function buildReferrals(): Referral[] {
  return [
    { id: "rf1", referrerEmail: "ada@choppa.app", referredEmail: "tunde@choppa.app", referredName: "Tunde Johnson", commissionEarned: 1500, createdAt: daysAgo(10), status: "active" },
    { id: "rf2", referrerEmail: "ada@choppa.app", referredEmail: "chioma@choppa.app", referredName: "Chioma Eze", commissionEarned: 1500, createdAt: daysAgo(22), status: "active" },
    { id: "rf3", referrerEmail: "ada@choppa.app", referredEmail: "bola@choppa.app", referredName: "Bola Akinwale", commissionEarned: 0, createdAt: daysAgo(2), status: "pending" },
  ];
}

export function buildSeedDB(): DB {
  const sellerHistory = buildSellerHistory();
  return {
    accounts,
    restaurants,
    menuItems,
    orders: buildOrders(sellerHistory),
    transactions: buildTransactions(sellerHistory),
    referrals: buildReferrals(),
  };
}

export const DEMO_USER_EMAIL = "ada@choppa.app";
export const DEMO_SELLER_EMAIL = "mamaputs@choppa.app";
export const DEMO_PASSWORD = "choppa123";
export const seedNow = now;
