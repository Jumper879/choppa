import { ReactNode } from "react";

type Tone = "red" | "green" | "gold" | "purple" | "neutral" | "success" | "warning" | "danger";

const toneClasses: Record<Tone, string> = {
  red: "bg-choppa-red/10 text-choppa-red-dark",
  green: "bg-choppa-green/10 text-choppa-green",
  gold: "bg-choppa-gold/15 text-[#8a5c12]",
  purple: "bg-choppa-purple/10 text-choppa-purple",
  neutral: "bg-choppa-ink/6 text-choppa-ink-soft",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-red-100 text-red-700",
};

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
