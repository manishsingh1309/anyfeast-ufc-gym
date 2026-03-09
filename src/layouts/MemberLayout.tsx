/**
 * MemberLayout.tsx
 * Shell wrapper for all /member/* routes.
 */
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Sidebar } from "./Sidebar";
import { NAV_ITEMS } from "./navConfig";

export const MemberLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-950">
      <Sidebar
        navItems={NAV_ITEMS.member}
        userName={user?.name ?? "Member"}
        userRole={user?.role}
        gymName={user?.gyms[0]?.name ?? "My Gym"}
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
