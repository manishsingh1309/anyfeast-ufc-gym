/**
 * Input.tsx — Reusable form input with label and error state.
 */

import React from "react";
import clsx from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-gray-700 dark:text-slate-300"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            "w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none",
            "transition-all duration-200 placeholder:text-gray-400",
            "dark:bg-slate-800/60 dark:text-slate-200 dark:placeholder:text-slate-500",
            "focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-600/20",
            error
              ? "border-red-400 focus:border-red-400 focus:ring-red-100"
              : "border-gray-200 dark:border-slate-700",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        {!error && hint && <p className="text-xs text-gray-500">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
