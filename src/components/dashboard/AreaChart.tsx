/**
 * AreaChart.tsx — Lightweight SVG area/line chart.
 */

import React from "react";

export interface AreaChartDataPoint {
  label: string;
  activations: number;
  renewals: number;
}

interface AreaChartProps {
  data: AreaChartDataPoint[];
  height?: number;
  className?: string;
}

function makePath(
  points: { x: number; y: number }[],
  height: number
): { line: string; area: string } {
  if (!points.length) return { line: "", area: "" };
  const line = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
  const area =
    `${line} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;
  return { line, area };
}

export const AreaChart: React.FC<AreaChartProps> = ({
  data,
  height = 180,
  className,
}) => {
  if (!data.length) return null;

  const padding = { top: 16, right: 8, bottom: 32, left: 32 };
  const chartW = 520;
  const chartH = height;
  const innerW = chartW - padding.left - padding.right;
  const innerH = chartH - padding.top - padding.bottom;

  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.activations, d.renewals)),
    1
  );

  const toX = (i: number) =>
    padding.left + (i / (data.length - 1)) * innerW;
  const toY = (v: number) =>
    padding.top + innerH - (v / maxVal) * innerH;

  const actPoints = data.map((d, i) => ({ x: toX(i), y: toY(d.activations) }));
  const renPoints = data.map((d, i) => ({ x: toX(i), y: toY(d.renewals) }));

  const actPaths = makePath(actPoints, chartH - padding.bottom);
  const renPaths = makePath(renPoints, chartH - padding.bottom);

  // Y-axis ticks
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => ({
    y: padding.top + innerH - f * innerH,
    label: Math.round(f * maxVal),
  }));

  return (
    <div className={className} style={{ overflowX: "auto" }}>
      <svg
        viewBox={`0 0 ${chartW} ${chartH}`}
        width="100%"
        height={chartH}
        style={{ display: "block" }}
      >
        <defs>
          <linearGradient id="actGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF6A00" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#FF6A00" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="renGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {yTicks.map((t, i) => (
          <g key={i}>
            <line
              x1={padding.left}
              y1={t.y}
              x2={chartW - padding.right}
              y2={t.y}
              stroke="#e5e7eb"
              strokeWidth={1}
              strokeDasharray="4,4"
            />
            <text x={padding.left - 4} y={t.y + 4} textAnchor="end" fontSize={9} fill="#9ca3af">
              {t.label}
            </text>
          </g>
        ))}

        {/* Area fills */}
        {actPaths.area && <path d={actPaths.area} fill="url(#actGrad)" />}
        {renPaths.area && <path d={renPaths.area} fill="url(#renGrad)" />}

        {/* Lines */}
        {actPaths.line && (
          <path d={actPaths.line} fill="none" stroke="#FF6A00" strokeWidth={2} strokeLinejoin="round" />
        )}
        {renPaths.line && (
          <path d={renPaths.line} fill="none" stroke="#10b981" strokeWidth={2} strokeLinejoin="round" />
        )}

        {/* Data points */}
        {actPoints.map((p, i) => (
          <circle key={`a${i}`} cx={p.x} cy={p.y} r={3} fill="#FF6A00" />
        ))}
        {renPoints.map((p, i) => (
          <circle key={`r${i}`} cx={p.x} cy={p.y} r={3} fill="#10b981" />
        ))}

        {/* X-axis labels */}
        {data.map((d, i) => (
          <text
            key={`xl${i}`}
            x={toX(i)}
            y={chartH - 8}
            textAnchor="middle"
            fontSize={9}
            fill="#9ca3af"
          >
            {d.label}
          </text>
        ))}
      </svg>

      {/* Legend */}
      <div className="mt-2 flex items-center gap-4 px-2">
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="inline-block h-2 w-3 rounded-sm bg-brand-500" />
          Activations
        </span>
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="inline-block h-2 w-3 rounded-sm bg-emerald-500" />
          Renewals
        </span>
      </div>
    </div>
  );
};
