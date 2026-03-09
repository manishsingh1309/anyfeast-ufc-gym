/**
 * PageMotion.tsx — Framer Motion page transition wrapper.
 *
 * Wraps each page with a subtle fade+slide-in animation.
 * Usage: wrap your page's root div with <PageMotion>...</PageMotion>
 */

import React from "react";
import { motion } from "framer-motion";

interface PageMotionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageMotion: React.FC<PageMotionProps> = ({ children, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -6 }}
    transition={{ duration: 0.22, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

/**
 * AnimatedCard — card with subtle hover lift animation.
 */
export const AnimatedCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.28, ease: "easeOut", delay }}
    whileHover={{ y: -2, transition: { duration: 0.15 } }}
    className={className}
  >
    {children}
  </motion.div>
);

/**
 * StaggerContainer — animates children with a stagger delay.
 */
export const StaggerContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <motion.div
    initial="hidden"
    animate="show"
    variants={{
      hidden: {},
      show: { transition: { staggerChildren: 0.07 } },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

/**
 * StaggerItem — individual animated child inside StaggerContainer.
 */
export const StaggerItem: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 14 },
      show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
    }}
    className={className}
  >
    {children}
  </motion.div>
);
