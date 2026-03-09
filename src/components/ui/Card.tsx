/**
 * Card.tsx — Generic surface container used across dashboards.
 * Supports dark mode via Tailwind dark: classes.
 */

import React from "react";
import clsx from "clsx";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

const paddingMap = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-8",
};

export const Card: React.FC<CardProps> = ({
  children,
  className,
  padding = "md",
  hover = false,
}) => (
  <div
    className={clsx(
      "rounded-2xl border border-gray-100 bg-white shadow-card",
      "dark:border-slate-700/60 dark:bg-[#1e2535]",
      hover && "transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5",
      paddingMap[padding],
      className
    )}
  >
    {children}
  </div>
);

// ─── StatCard ─────────────────────────────────────────────────────────────────
// Reusable KPI tile used in dashboards. No business logic inside.

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  colorClass?: string;
  progressValue?: number;
  progressColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  trend,
  trendUp,
  colorClass = "bg-brand-50 text-brand-600 dark:bg-brand-600/15 dark:text-brand-400",
  progressValue,
  progressColor = "bg-brand-gradient",
}) => (
  <Card hover>
    <div className="flex items-start justify-between">
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-slate-500">
          {label}
        </p>
        <p className="text-2xl font-bold text-gray-900 dark:text-slate-100 leading-tight">{value}</p>
        {trend && (
          <p
            className={clsx(
              "text-xs font-semibold",
              trendUp
                ? "text-accent-600 dark:text-accent-400"
                : "text-red-500 dark:text-red-400"
            )}
          >
            {trendUp ? "↑" : "↓"} {trend}
          </p>
        )}
        {progressValue !== undefined && (
          <div className="mt-2 w-full">
            <div className="flex justify-between text-[10px] text-gray-400 dark:text-slate-500 mb-1">
              <span>Utilization</span>
              <span>{progressValue}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-slate-700">
              <div
                className={clsx("h-full rounded-full transition-all duration-700", progressColor)}
                style={{ width: `${Math.min(100, progressValue)}%` }}
              />
            </div>
          </div>
        )}
      </div>
      <div className={clsx("ml-4 shrink-0 rounded-2xl p-3", colorClass)}>{icon}</div>
    </div>
  </Card>
);
