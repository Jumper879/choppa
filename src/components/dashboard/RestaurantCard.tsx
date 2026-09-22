import Link from "next/link";
import { Star, Clock, MapPin } from "lucide-react";
import { Restaurant } from "@/lib/types";
import { EmojiBadge } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";

export function RestaurantCard({ restaurant, compact = false }: { restaurant: Restaurant; compact?: boolean }) {
  return (
    <Link
      href={`/dashboard/restaurants/${restaurant.id}`}
      className={`group flex shrink-0 flex-col rounded-2xl border border-black/[0.04] bg-white p-4 shadow-card transition-transform hover:-translate-y-0.5 ${
        compact ? "w-60" : "w-full"
      }`}
    >
      <div className="flex items-start justify-between">
        <EmojiBadge emoji={restaurant.coverEmoji} accent={restaurant.accent} size={52} />
        {!restaurant.isOpen && <Badge tone="neutral">Closed</Badge>}
        {restaurant.isOpen && <Badge tone="green">Open</Badge>}
      </div>
      <h3 className="mt-3 font-display text-base font-semibold text-choppa-ink group-hover:text-choppa-red">
        {restaurant.name}
      </h3>
      <p className="mt-0.5 line-clamp-1 text-xs text-choppa-ink-soft">{restaurant.tagline}</p>
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-choppa-ink-soft">
        <span className="flex items-center gap-1 text-amber-600">
          <Star size={13} fill="currentColor" /> {restaurant.rating || "New"}
          {restaurant.ratingCount > 0 && <span className="text-choppa-ink-soft">({restaurant.ratingCount})</span>}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={13} /> {restaurant.etaMins} min
        </span>
        <span className="flex items-center gap-1">
          <MapPin size={13} /> {restaurant.distanceKm} km
        </span>
      </div>
    </Link>
  );
}
