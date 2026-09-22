"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { StatusStat } from "@/lib/analytics";

const COLOR_BY_STATUS: Record<string, string> = {
  delivered: "#1E8E5A",
  out_for_delivery: "#E8531A",
  preparing: "#D98A1D",
  accepted: "#D98A1D",
  placed: "#6E4FA3",
  cancelled: "#B7AE9E",
};

export function StatusDonut({ data }: { data: StatusStat[] }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  return (
    <div className="flex items-center gap-4">
      <div className="h-40 w-40 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="label"
              innerRadius={48}
              outerRadius={72}
              paddingAngle={2}
              stroke="#fbf7ef"
              strokeWidth={2}
            >
              {data.map((d) => (
                <Cell key={d.status} fill={COLOR_BY_STATUS[d.status] ?? "#B7AE9E"} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, _name, entry) => [
                `${value} orders`,
                (entry?.payload as StatusStat | undefined)?.label ?? "",
              ]}
              contentStyle={{ borderRadius: 12, border: "1px solid rgba(32,28,20,0.08)", fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="flex-1 space-y-2">
        {data.map((d) => (
          <li key={d.status} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-choppa-ink-soft">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: COLOR_BY_STATUS[d.status] ?? "#B7AE9E" }}
              />
              {d.label}
            </span>
            <span className="font-semibold text-choppa-ink">
              {d.count} <span className="font-normal text-choppa-ink-soft">({total ? Math.round((d.count / total) * 100) : 0}%)</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
