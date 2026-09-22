"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DayPoint } from "@/lib/analytics";
import { formatNaira } from "@/lib/format";

export function SalesTrendChart({ data }: { data: DayPoint[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="choppaSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E8531A" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#E8531A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#20201810" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#6b6255", fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={48}
            tick={{ fill: "#6b6255", fontSize: 12 }}
            tickFormatter={(v) => `₦${Math.round(v / 1000)}k`}
          />
          <Tooltip
            cursor={{ stroke: "#e8531a", strokeWidth: 1, strokeDasharray: "3 3" }}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid rgba(32,28,20,0.08)",
              boxShadow: "0 8px 24px -12px rgba(32,28,20,0.25)",
              fontSize: 12,
            }}
            formatter={(value) => [formatNaira(Number(value ?? 0)), "Sales"]}
          />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="#E8531A"
            strokeWidth={2}
            fill="url(#choppaSales)"
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
