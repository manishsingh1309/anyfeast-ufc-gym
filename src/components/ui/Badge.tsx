/**
 * Badge.tsx — Status / tag badge component.
 */

import React from "react";
import clsx from "clsx";

type BadgeVariant =
  | "active"
  | "expiring"
  | "expired"
  | "unused"
  | "used"
  | "basic"
  | "standard"
  | "premium"
  | "neutral"
  | "success"
  | "warning"
  | "danger";

const variantMap: Record<BadgeVariant, string> = {
  active:   "bg-accent-50 text-accent-600 ring-1 ring-accent-200 dark:bg-accent-500/15 dark:text-accent-400 dark:ring-accent-500/30",
  expiring: "bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:ring-amber-500/30",
  expired:  "bg-red-50 text-red-600 ring-1 ring-red-200 dark:bg-red-900/30 dark:text-red-400 dark:ring-red-500/30",
  unused:   "bg-accent-50 text-accent-600 ring-1 ring-accent-200 dark:bg-accent-500/15 dark:text-accent-400 dark:ring-accent-500/30",
  used:     "bg-gray-100 text-gray-500 ring-1 ring-gray-200 dark:bg-slate-700 dark:text-slate-400 dark:ring-slate-600",
  basic:    "bg-sky-50 text-sky-700 ring-1 ring-sky-200 dark:bg-sky-900/30 dark:text-sky-400 dark:ring-sky-500/30",
  standard: "bg-brand-50 text-brand-700 ring-1 ring-brand-200 dark:bg-brand-600/15 dark:text-brand-400 dark:ring-brand-500/30",
  premium:  "bg-purple-50 text-purple-700 ring-1 ring-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:ring-purple-500/30",
  neutral:  "bg-gray-100 text-gray-600 ring-1 ring-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:ring-slate-600",
  success:  "bg-accent-50 text-accent-600 ring-1 ring-accent-200 dark:bg-accent-500/15 dark:text-accent-400 dark:ring-accent-500/30",
  warning:  "bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:ring-amber-500/30",
  danger:   "bg-red-50 text-red-600 ring-1 ring-red-200 dark:bg-red-900/30 dark:text-red-400 dark:ring-red-500/30",
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "neutral",
  children,
  className,
}) => (
  <span
    className={clsx(
      "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize tracking-wide",
      variantMap[variant],
      className
    )}
  >
    {children}
  </span>
);
