/**
 * Logo.tsx — AnyFeast brand logo.
 *
 * Serves the SVG from /public/anyfeast-logo.svg (vector, infinitely scalable).
 * variant="full"  → icon + "AnyFeast" wordmark
 * variant="icon"  → only the red square icon (viewBox cropped)
 */

import React from "react";
import clsx from "clsx";

interface LogoProps {
  variant?: "full" | "icon";
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = "full",
  className,
}) => {
  if (variant === "icon") {
    // Crop to just the red square (left 160px of the 520-wide viewBox)
    return (
      <img
        src="/anyfeast-logo.svg"
        alt="AnyFeast"
        className={clsx("object-contain", className)}
        style={{ objectPosition: "left center", maxWidth: "none" }}
        draggable={false}
      />
    );
  }

  return (
    <img
      src="/anyfeast-logo.svg"
      alt="AnyFeast Gym"
      className={clsx("object-contain", className)}
      draggable={false}
    />
  );
};
