export type Role = "user" | "seller";

export interface UserProfile {
  kind: "user";
  name: string;
  phone?: string;
  address?: string;
  avatarColor: string;
  balance: number;
  referralCode: string;
  referredBy?: string;
  createdAt: string;
}

export interface SellerProfile {
  kind: "seller";
  restaurantId: string;
  ownerName: string;
  phone?: string;
  balance: number;
  createdAt: string;
}

export interface Account {
  email: string;
  passwordHash: string;
  user?: UserProfile;
  seller?: SellerProfile;
}

export interface Session {
  email: string;
  role: Role;
}

export type Cuisine =
  | "Nigerian"
  | "Fast Food"
  | "Grill & BBQ"
  | "Chinese"
  | "Seafood"
  | "Pastries & Bakery"
  | "Smoothies & Drinks";

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  emoji: string;
  available: boolean;
  popular?: boolean;
}

export interface Restaurant {
  id: string;
  ownerEmail: string;
  name: string;
  cuisine: Cuisine;
  tagline: string;
  address: string;
  distanceKm: number;
  etaMins: number;
  rating: number;
  ratingCount: number;
  deliveryFee: number;
  coverEmoji: string;
  accent: "red" | "green" | "gold" | "purple";
  isOpen: boolean;
}

export type OrderStatus =
  | "placed"
  | "accepted"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  qty: number;
  emoji: string;
}

export interface Order {
  id: string;
  userEmail: string;
  restaurantId: string;
  restaurantName: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export type TransactionType =
  | "topup"
  | "order"
  | "commission"
  | "referral_bonus"
  | "payout"
  | "sale";

export interface Transaction {
  id: string;
  ownerEmail: string;
  role: Role;
  type: TransactionType;
  amount: number;
  description: string;
  status: "completed" | "pending";
  createdAt: string;
}

export interface Referral {
  id: string;
  referrerEmail: string;
  referredEmail: string;
  referredName: string;
  commissionEarned: number;
  createdAt: string;
  status: "active" | "pending";
}

export interface DB {
  accounts: Account[];
  restaurants: Restaurant[];
  menuItems: MenuItem[];
  orders: Order[];
  transactions: Transaction[];
  referrals: Referral[];
}
