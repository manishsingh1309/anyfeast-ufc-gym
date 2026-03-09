/**
 * Sidebar.tsx
 *
 * Collapsible role-aware sidebar with dark mode support.
 * Supports full (w-60) and collapsed (w-16) states.
 */

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { ChevronLeft, ChevronRight, LogOut, Settings } from "lucide-react";
import { Logo } from "../components/ui/Logo";
import type { NavItem } from "./navConfig";

interface SidebarProps {
  navItems: NavItem[];
  userName: string;
  userRole?: string;
  gymName?: string;
  onLogout: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  navItems,
  userName,
  userRole,
  gymName,
  onLogout,
  isCollapsed,
  onToggleCollapse,
}) => {
  const navigate = useNavigate();
  const initials = userName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const settingsPath = userRole === "owner" ? "/owner/settings" : userRole === "member" ? "/member/settings" : userRole === "super_admin" ? "/admin/settings" : "/trainer/settings";

  return (
    <aside
      className={clsx(
        "relative flex h-full shrink-0 flex-col border-r transition-all duration-300",
        "border-gray-200 bg-white",
        "dark:border-slate-700 dark:bg-slate-900",
        isCollapsed ? "w-16" : "w-60"
      )}
    >
      {/* Brand */}
      <div
        className={clsx(
          "flex items-center border-b border-gray-200 dark:border-slate-700",
          isCollapsed ? "justify-center px-3 py-4" : "gap-2 px-5 py-4"
        )}
      >
        {!isCollapsed && (
          <div className="flex flex-col gap-0.5 min-w-0">
            <Logo variant="full" className="h-7 w-auto self-start" />
            {gymName && (
              <p className="truncate text-[11px] text-gray-400 dark:text-slate-500 pl-0.5">
                {gymName}
              </p>
            )}
          </div>
        )}
        {isCollapsed && <Logo variant="icon" className="h-8 w-8" />}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggleCollapse}
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        className={clsx(
          "absolute -right-3 top-16 z-10 flex h-6 w-6 items-center justify-center",
          "rounded-full border border-gray-200 bg-white shadow-sm",
          "text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-700",
          "dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-300"
        )}
      >
        {isCollapsed ? (
          <ChevronRight className="h-3.5 w-3.5" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4">
        {/* Section label */}
        {!isCollapsed && (
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-slate-600">
            Navigation
          </p>
        )}
        <ul className="flex flex-col gap-0.5">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                title={isCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  clsx(
                    "group flex items-center rounded-lg px-2.5 py-2.5 text-sm font-medium transition-all",
                    isCollapsed ? "justify-center" : "gap-3",
                    isActive
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={clsx(
                        "shrink-0 transition-colors",
                        isActive
                          ? "text-indigo-600 dark:text-indigo-400"
                          : "text-gray-500 dark:text-slate-500 group-hover:text-gray-700 dark:group-hover:text-slate-300"
                      )}
                    >
                      {item.icon}
                    </span>
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                    {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
                      <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white dark:bg-indigo-500">
                        {item.badge}
                      </span>
                    )}
                    {isCollapsed && item.badge !== undefined && item.badge > 0 && (
                      <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User footer */}
      <div className="border-t border-gray-200 p-3 dark:border-slate-700">
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => navigate(settingsPath)}
              title={userName}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 text-xs font-bold text-white shadow-sm transition-transform hover:scale-105"
            >
              {initials}
            </button>
            <button
              onClick={onLogout}
              title="Sign out"
              className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-2 dark:border-slate-700/60 dark:bg-slate-800/60">
            {/* Profile row — clickable → settings */}
            <button
              onClick={() => navigate(settingsPath)}
              className="flex w-full items-center gap-2.5 rounded-lg px-1.5 py-1.5 transition-colors hover:bg-white dark:hover:bg-slate-700/60"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 text-sm font-bold text-white shadow-sm">
                {initials}
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-xs font-semibold text-gray-800 dark:text-slate-200">
                  {userName}
                </p>
                <p className="truncate text-[10px] capitalize text-gray-400 dark:text-slate-500">
                  {userRole ?? "Logged in"}
                </p>
              </div>
              <Settings className="h-3.5 w-3.5 shrink-0 text-gray-300 dark:text-slate-600" />
            </button>
            {/* Logout row */}
            <button
              onClick={onLogout}
              className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-500 dark:hover:bg-red-900/20 dark:hover:text-red-400"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

