/**
 * Button.tsx — Primary reusable button component.
 *
 * Supports: primary / secondary / ghost variants, loading state, disabled.
 * Never add business logic here — keep it purely presentational.
 */

import React from "react";
import clsx from "clsx";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 disabled:bg-indigo-400",
  secondary:
    "bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500 disabled:opacity-50",
  ghost:
    "bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-300 disabled:opacity-50",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-400",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  fullWidth = false,
  disabled,
  className,
  children,
  ...props
}) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium",
        "transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        (disabled || isLoading) && "cursor-not-allowed",
        className
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      {children}
    </button>
  );
};
