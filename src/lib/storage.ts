import { DB, Session } from "./types";
import { buildSeedDB } from "./seed";

const DB_KEY = "choppa_db_v1";
const SESSION_KEY = "choppa_session_v1";
const CART_KEY_PREFIX = "choppa_cart_v1::";

export function loadDB(): DB {
  if (typeof window === "undefined") return buildSeedDB();
  const raw = window.localStorage.getItem(DB_KEY);
  if (!raw) {
    const seeded = buildSeedDB();
    window.localStorage.setItem(DB_KEY, JSON.stringify(seeded));
    return seeded;
  }
  try {
    return JSON.parse(raw) as DB;
  } catch {
    const seeded = buildSeedDB();
    window.localStorage.setItem(DB_KEY, JSON.stringify(seeded));
    return seeded;
  }
}

export function saveDB(db: DB) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DB_KEY, JSON.stringify(db));
  window.dispatchEvent(new CustomEvent("choppa:db-changed"));
}

export function loadSession(): Session | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function saveSession(session: Session | null) {
  if (typeof window === "undefined") return;
  if (session) {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    window.localStorage.removeItem(SESSION_KEY);
  }
  window.dispatchEvent(new CustomEvent("choppa:session-changed"));
}

export function cartKey(email: string) {
  return `${CART_KEY_PREFIX}${email}`;
}

export function genId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function resetDemoData() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(DB_KEY);
  window.localStorage.removeItem(SESSION_KEY);
  Object.keys(window.localStorage)
    .filter((k) => k.startsWith(CART_KEY_PREFIX))
    .forEach((k) => window.localStorage.removeItem(k));
}
