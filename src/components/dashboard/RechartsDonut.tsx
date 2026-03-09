/**
 * RechartsDonut.tsx — Recharts radial bar / pie chart for utilization.
 */

import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface RechartsDonutProps {
  value: number; // 0–100
  size?: number;
  color?: string;
  label?: string;
  sublabel?: string;
}

export const RechartsDonut: React.FC<RechartsDonutProps> = ({
  value,
  size = 100,
  color = "#FF6A00",
  label,
  sublabel,
}) => {
  const clamped = Math.min(100, Math.max(0, value));
  const data = [
    { name: "Used", value: clamped },
    { name: "Remaining", value: 100 - clamped },
  ];

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={size * 0.32}
            outerRadius={size * 0.46}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            strokeWidth={0}
          >
            <Cell fill={color} />
            <Cell fill="#e5e7eb" />
          </Pie>
          <Tooltip
            formatter={(val) => `${Number(val)}%`}
            contentStyle={{
              borderRadius: 8,
              fontSize: 11,
              padding: "4px 10px",
              border: "1px solid #e5e7eb",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {label && (
          <span className="text-sm font-bold text-gray-800 dark:text-slate-100">
            {label}
          </span>
        )}
        {sublabel && (
          <span className="text-[10px] text-gray-400 dark:text-slate-500">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
};
