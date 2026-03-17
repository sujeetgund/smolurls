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

import { type ClickEventResponse } from "@/lib/types";

interface ClicksChartProps {
  events: ClickEventResponse[];
}

function groupEventsByDay(events: ClickEventResponse[]) {
  const grouped = new Map<string, number>();

  for (const event of events) {
    const day = new Date(event.clicked_at).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });

    grouped.set(day, (grouped.get(day) ?? 0) + 1);
  }

  return Array.from(grouped.entries()).map(([day, clicks]) => ({
    day,
    clicks,
  }));
}

export function ClicksChart({ events }: ClicksChartProps) {
  const chartData = groupEventsByDay(events);

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ left: 4, right: 8, top: 8, bottom: 4 }}
        >
          <defs>
            <linearGradient id="smolurls-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            horizontal={false}
            strokeDasharray="3 3"
            stroke="#2b2b3d"
            vertical
          />

          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
          />
          <YAxis
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#13131a",
              borderColor: "#1e1e2e",
              borderRadius: "0.5rem",
              color: "#f3f4f6",
            }}
            labelStyle={{ color: "#c4b5fd" }}
            formatter={(value) => [`${value} clicks`, "Clicks"]}
          />

          <Area
            type="monotone"
            dataKey="clicks"
            stroke="#8b5cf6"
            strokeWidth={2}
            fill="url(#smolurls-area)"
            activeDot={{
              r: 4,
              fill: "#8b5cf6",
              stroke: "#c4b5fd",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
