/**
 * DonutChart.tsx — SVG donut/ring chart for activation rate.
 */

import React from "react";

interface DonutChartProps {
  value: number; // 0–100 percentage
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  label?: string;
  sublabel?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  value,
  size = 96,
  strokeWidth = 10,
  color = "#6366f1",
  trackColor = "#e5e7eb",
  label,
  sublabel,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(100, Math.max(0, value)) / 100);

  return (
    <div className="relative inline-flex flex-col items-center justify-center">
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div
        className="absolute flex flex-col items-center"
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
      >
        {label && (
          <span className="text-base font-bold text-gray-800 dark:text-slate-100">
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
