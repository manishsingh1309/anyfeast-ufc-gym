/**
 * Skeleton.tsx — Animated loading skeleton placeholders.
 */

import React from "react";
import clsx from "clsx";

interface SkeletonProps {
  className?: string;
  rounded?: "sm" | "md" | "lg" | "full";
  height?: string;
  width?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  rounded = "md",
  height,
  width,
}) => {
  const roundedMap = {
    sm: "rounded",
    md: "rounded-lg",
    lg: "rounded-xl",
    full: "rounded-full",
  };

  return (
    <div
      className={clsx(
        "animate-pulse bg-gray-200 dark:bg-slate-700",
        roundedMap[rounded],
        className
      )}
      style={{ height, width }}
    />
  );
};

// ─── Preset Skeletons ─────────────────────────────────────────────────────────

export const StatCardSkeleton: React.FC = () => (
  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
    <div className="flex items-start justify-between">
      <div className="flex flex-col gap-2 flex-1">
        <Skeleton height="10px" width="70px" rounded="sm" />
        <Skeleton height="28px" width="90px" />
        <Skeleton height="10px" width="110px" rounded="sm" />
      </div>
      <Skeleton height="40px" width="40px" rounded="lg" />
    </div>
  </div>
);

export const TableRowSkeleton: React.FC<{ cols?: number }> = ({ cols = 5 }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-6 py-4">
        <Skeleton height="12px" width={i === 0 ? "120px" : "70px"} rounded="sm" />
      </td>
    ))}
  </tr>
);

export const CardSkeleton: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 space-y-3">
    <Skeleton height="14px" width="140px" />
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} height="10px" width={i === lines - 1 ? "60%" : "100%"} rounded="sm" />
    ))}
  </div>
);
