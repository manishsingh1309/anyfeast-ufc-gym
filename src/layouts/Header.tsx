/**
 * Header.tsx (Topbar)
 *
 * Top navigation bar for all dashboard pages.
 * Includes: page title, global search, dark-mode toggle, user avatar.
 * Self-sources user info from AuthContext.
 */

import React, { useState } from "react";
import { Moon, Search, Sun, Bell } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { GlobalSearch } from "../components/GlobalSearch";

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  actions,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white/95 px-6 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/95">
        {/* Left: Title */}
        <div className="flex min-w-0 flex-col">
          <h1 className="truncate text-sm font-semibold text-gray-900 dark:text-slate-100">
            {title}
          </h1>
          {subtitle && (
            <p className="truncate text-[11px] text-gray-400 dark:text-slate-500">
              {subtitle}
            </p>
          )}
        </div>

        {/* Right: controls */}
        <div className="flex items-center gap-2">
          {/* Search trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-400 transition-colors hover:border-indigo-300 hover:text-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Search…</span>
            <kbd className="hidden rounded border border-gray-200 px-1 py-0.5 text-[10px] dark:border-slate-600 sm:inline">
              ⌘K
            </kbd>
          </button>

          {/* Page actions */}
          {actions && (
            <div className="flex items-center gap-2">{actions}</div>
          )}

          {/* Bell */}
          <button className="relative rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-slate-800 dark:hover:text-slate-300">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500" />
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          {/* Avatar */}
          {user && (
            <div
              title={`${user.name} · ${user.role}`}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white dark:bg-indigo-500"
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

