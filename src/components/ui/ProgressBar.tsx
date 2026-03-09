/**
 * ProgressBar.tsx — Horizontal progress bar with optional label.
 */

import React from "react";
import clsx from "clsx";

interface ProgressBarProps {
  value: number; // 0–100
  colorClass?: string;
  showLabel?: boolean;
  height?: "xs" | "sm" | "md";
  className?: string;
}

const heightMap = { xs: "h-1", sm: "h-1.5", md: "h-2" };

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  colorClass = "bg-brand-500",
  showLabel = false,
  height = "sm",
  className,
}) => {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={clsx("w-full", className)}>
      <div
        className={clsx(
          "w-full overflow-hidden rounded-full bg-gray-100 dark:bg-slate-700",
          heightMap[height]
        )}
      >
        <div
          className={clsx("h-full rounded-full transition-all duration-500", colorClass)}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <p className="mt-1 text-right text-xs text-gray-500 dark:text-slate-400">
          {clamped}%
        </p>
      )}
    </div>
  );
};
