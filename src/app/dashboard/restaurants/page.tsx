"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useStore } from "@/lib/store";
import { RestaurantCard } from "@/components/dashboard/RestaurantCard";
import { DeliverToBar } from "@/components/dashboard/DeliverToBar";
import { Cuisine } from "@/lib/types";

const FILTERS: ("All" | Cuisine)[] = [
  "All",
  "Nigerian",
  "Fast Food",
  "Grill & BBQ",
  "Chinese",
  "Seafood",
  "Pastries & Bakery",
  "Smoothies & Drinks",
];

type Sort = "nearest" | "rating" | "fastest";

export default function RestaurantsPage() {
  const { db, userProfile } = useStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [sort, setSort] = useState<Sort>("nearest");

  const results = useMemo(() => {
    let list = db.restaurants.filter((r) => {
      const matchesQuery =
        !query.trim() ||
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.cuisine.toLowerCase().includes(query.toLowerCase());
      const matchesFilter = filter === "All" || r.cuisine === filter;
      return matchesQuery && matchesFilter;
    });
    list = [...list].sort((a, b) => {
      if (sort === "nearest") return a.distanceKm - b.distanceKm;
      if (sort === "rating") return b.rating - a.rating;
      return a.etaMins - b.etaMins;
    });
    return list;
  }, [db.restaurants, query, filter, sort]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-choppa-ink">Restaurants near you</h1>
        <p className="mt-1 text-sm text-choppa-ink-soft">
          {results.length} restaurant{results.length === 1 ? "" : "s"} delivering to your address
        </p>
      </div>

      <DeliverToBar address={userProfile?.address} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-choppa-ink-soft" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search restaurants or cuisine…"
            className="w-full rounded-full border border-black/10 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-choppa-red focus:ring-2 focus:ring-choppa-red/15"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm font-medium text-choppa-ink outline-none focus:border-choppa-red"
        >
          <option value="nearest">Nearest first</option>
          <option value="rating">Top rated</option>
          <option value="fastest">Fastest delivery</option>
        </select>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              filter === f
                ? "border-choppa-red bg-choppa-red text-white"
                : "border-black/10 bg-white text-choppa-ink-soft hover:border-choppa-red/40"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {results.map((r) => (
          <RestaurantCard key={r.id} restaurant={r} />
        ))}
        {results.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-choppa-ink-soft">
            No restaurants match your search.
          </p>
        )}
      </div>
    </div>
  );
}
