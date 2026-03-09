/**
 * BarChart.tsx — Lightweight SVG bar chart used in analytics.
 * No external dependencies — purely SVG/React.
 */

import React from "react";

export interface BarChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarChartDataPoint[];
  height?: number;
  barColor?: string;
  showValues?: boolean;
  className?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  height = 180,
  barColor = "#FF6A00",
  showValues = true,
  className,
}) => {
  if (!data.length) return null;

  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const chartH = height - 32; // leave room for labels
  const barGap = 8;
  const totalBars = data.length;
  const svgWidth = totalBars * 48 + (totalBars - 1) * barGap;

  return (
    <div className={className} style={{ overflowX: "auto" }}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${svgWidth} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ display: "block" }}
      >
        {data.map((d, i) => {
          const barW = 40;
          const x = i * (48 + barGap);
          const barH = Math.max(4, (d.value / maxVal) * chartH);
          const y = chartH - barH;

          return (
            <g key={d.label}>
              {/* Bar */}
              <rect
                x={x + 4}
                y={y}
                width={barW}
                height={barH}
                rx={4}
                fill={d.color ?? barColor}
                opacity={0.9}
              />
              {/* Value label */}
              {showValues && (
                <text
                  x={x + 4 + barW / 2}
                  y={y - 6}
                  textAnchor="middle"
                  fontSize={10}
                  fill="#FF6A00"
                  fontWeight={600}
                >
                  {d.value}
                </text>
              )}
              {/* X label */}
              <text
                x={x + 4 + barW / 2}
                y={height - 6}
                textAnchor="middle"
                fontSize={9}
                fill="#9ca3af"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
