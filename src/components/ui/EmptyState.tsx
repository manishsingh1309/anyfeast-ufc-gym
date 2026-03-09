/**
 * EmptyState.tsx — Centered empty-state placeholder.
 */

import React from "react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-200 bg-white py-16 dark:border-slate-700 dark:bg-slate-800/50">
    {icon && (
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-slate-700 dark:text-slate-500">
        {icon}
      </div>
    )}
    <p className="text-sm font-medium text-gray-700 dark:text-slate-300">{title}</p>
    {description && (
      <p className="max-w-xs text-center text-xs text-gray-400 dark:text-slate-500">
        {description}
      </p>
    )}
    {action && <div className="mt-2">{action}</div>}
  </div>
);
