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
  active:   "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  expiring: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  expired:  "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  unused:   "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  used:     "bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-slate-400",
  basic:    "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  standard: "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  premium:  "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  neutral:  "bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300",
  success:  "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  warning:  "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  danger:   "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
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
      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize",
      variantMap[variant],
      className
    )}
  >
    {children}
  </span>
);
