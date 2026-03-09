/**
 * RechartsAreaChart.tsx — Recharts-powered area chart for trends.
 */

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export interface TrendDataPoint {
  label: string;
  activations: number;
  renewals: number;
}

interface RechartsAreaChartProps {
  data: TrendDataPoint[];
  height?: number;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-xl dark:border-slate-700 dark:bg-slate-800">
        <p className="mb-2 text-xs font-semibold text-gray-500 dark:text-slate-400">
          {label}
        </p>
        {payload.map((p) => (
          <p key={p.name} className="text-xs font-medium" style={{ color: p.color }}>
            {p.name}: <span className="font-bold">{p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const RechartsAreaChart: React.FC<RechartsAreaChartProps> = ({
  data,
  height = 220,
}) => {
  const chartData = data.map((d) => ({
    name: d.label,
    Activations: d.activations,
    Renewals: d.renewals,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorAct" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FF6A00" stopOpacity={0.18} />
            <stop offset="95%" stopColor="#FF6A00" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorRen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.18} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" strokeOpacity={0.6} />
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
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 11, color: "#6b7280", paddingTop: 12 }}
        />
        <Area
          type="monotone"
          dataKey="Activations"
          stroke="#FF6A00"
          strokeWidth={2}
          fill="url(#colorAct)"
          dot={{ r: 3, fill: "#FF6A00", strokeWidth: 0 }}
          activeDot={{ r: 5, strokeWidth: 0 }}
        />
        <Area
          type="monotone"
          dataKey="Renewals"
          stroke="#10b981"
          strokeWidth={2}
          fill="url(#colorRen)"
          dot={{ r: 3, fill: "#10b981", strokeWidth: 0 }}
          activeDot={{ r: 5, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
