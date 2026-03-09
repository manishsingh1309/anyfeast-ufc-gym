/**
 * OwnerLayout.tsx
 *
 * Shell wrapper for all /owner/* routes.
 * Manages sidebar collapse state and applies dark mode to the root container.
 */

import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Sidebar } from "./Sidebar";
import { NAV_ITEMS } from "./navConfig";

export const OwnerLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-950">
      <Sidebar
        navItems={NAV_ITEMS.owner}
        userName={user?.name ?? "Owner"}
        userRole={user?.role}
        onLogout={logout}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((c) => !c)}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

