/**
 * TrainerLayout.tsx
 *
 * Shell wrapper for all /trainer/* routes.
 * Blocks access if no gym selected; manages sidebar collapse state.
 */

import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGym } from "../context/GymContext";
import { Sidebar } from "./Sidebar";
import { NAV_ITEMS } from "./navConfig";

export const TrainerLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { selectedGym } = useGym();
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!selectedGym) {
    return <Navigate to="/gym-selection" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC] dark:bg-[#0F172A]">
      <Sidebar
        navItems={NAV_ITEMS.trainer}
        userName={user?.name ?? "Trainer"}
        userRole={user?.role}
        gymName={selectedGym.name}
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

