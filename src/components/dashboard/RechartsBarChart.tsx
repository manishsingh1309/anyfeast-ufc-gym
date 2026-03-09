/**
 * RechartsBarChart.tsx — Recharts-powered bar chart.
 */

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export interface BarDataPoint {
  label: string;
  value: number;
}

interface RechartsBarChartProps {
  data: BarDataPoint[];
  height?: number;
  color?: string;
  highlightColor?: string;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-xl dark:border-slate-700 dark:bg-slate-800">
        <p className="text-xs text-gray-500 dark:text-slate-400">{label}</p>
        <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
          {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export const RechartsBarChart: React.FC<RechartsBarChartProps> = ({
  data,
  height = 180,
  color = "#6366f1",
}) => {
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const chartData = data.map((d) => ({ name: d.label, value: d.value }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f1f5f9", radius: 4 }} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.value === maxVal ? color : `${color}80`}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
