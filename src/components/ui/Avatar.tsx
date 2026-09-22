import { initials } from "@/lib/format";

const colorMap: Record<string, string> = {
  "choppa-red": "bg-choppa-red",
  "choppa-green-mid": "bg-choppa-green-mid",
  "choppa-gold": "bg-choppa-gold",
  "choppa-purple": "bg-choppa-purple",
};

export function Avatar({
  name,
  color = "choppa-red",
  size = 40,
}: {
  name: string;
  color?: string;
  size?: number;
}) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-display font-semibold text-white ${
        colorMap[color] ?? "bg-choppa-red"
      }`}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials(name)}
    </div>
  );
}

export function EmojiBadge({
  emoji,
  size = 44,
  accent = "red",
}: {
  emoji: string;
  size?: number;
  accent?: "red" | "green" | "gold" | "purple";
}) {
  const bg: Record<string, string> = {
    red: "bg-choppa-red/10",
    green: "bg-choppa-green/10",
    gold: "bg-choppa-gold/15",
    purple: "bg-choppa-purple/10",
  };
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-2xl ${bg[accent]}`}
      style={{ width: size, height: size, fontSize: size * 0.5 }}
    >
      {emoji}
    </div>
  );
}
