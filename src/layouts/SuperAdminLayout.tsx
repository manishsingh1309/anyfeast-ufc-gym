/**
 * SuperAdminLayout.tsx
 *
 * Shell wrapper for all /admin/* routes.
 * Super admin has no gym selection step — full platform access.
 */

import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Sidebar } from "./Sidebar";
import { NAV_ITEMS } from "./navConfig";

export const SuperAdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC] dark:bg-[#0F172A]">
      <Sidebar
        navItems={NAV_ITEMS.super_admin}
        userName={user?.name ?? "Admin"}
        userRole={user?.role}
        gymName="AnyFeast Platform"
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
