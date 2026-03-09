/**
 * Spinner.tsx — Full-page or inline loading indicator.
 */

import React from "react";
import { Loader2 } from "lucide-react";
import clsx from "clsx";

interface SpinnerProps {
  /** When true, centers the spinner in the full viewport */
  fullPage?: boolean;
  size?: "sm" | "md" | "lg";
  label?: string;
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-10 w-10",
};

export const Spinner: React.FC<SpinnerProps> = ({
  fullPage = false,
  size = "md",
  label = "Loading…",
}) => {
  const icon = (
    <Loader2
      className={clsx("animate-spin text-indigo-600", sizeMap[size])}
      aria-hidden="true"
    />
  );

  if (fullPage) {
    return (
      <div
        role="status"
        aria-label={label}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-white"
      >
        {icon}
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    );
  }

  return (
    <span role="status" aria-label={label}>
      {icon}
    </span>
  );
};
