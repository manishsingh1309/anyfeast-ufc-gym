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
  <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-brand-200 bg-brand-50/40 py-16 dark:border-slate-700 dark:bg-slate-800/40">
    {icon && (
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-500 dark:bg-brand-600/15 dark:text-brand-400 shadow-brand-sm">
        {icon}
      </div>
    )}
    <div className="flex flex-col items-center gap-1">
      <p className="text-sm font-bold text-gray-800 dark:text-slate-200">{title}</p>
      {description && (
        <p className="max-w-xs text-center text-xs text-gray-400 dark:text-slate-500 leading-relaxed">
          {description}
        </p>
      )}
    </div>
    {action && <div className="mt-1">{action}</div>}
  </div>
);
