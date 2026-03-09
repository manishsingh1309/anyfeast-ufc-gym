/**
 * ProtectedRoute.tsx
 *
 * Guards routes by:
 *   1. Requiring authentication
 *   2. Requiring a specific role (optional)
 *   3. Handling the bootstrap loading state (prevents flash of login page on refresh)
 *
 * Usage:
 *   <ProtectedRoute allowedRoles={["trainer"]}>
 *     <TrainerDashboard />
 *   </ProtectedRoute>
 */

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "./ui/Spinner";
import type { UserRole } from "../types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, isBootstrapping, user } = useAuth();
  const location = useLocation();

  // Wait for session bootstrap before making any routing decisions.
  // Without this, a valid refresh would flash the login page for 500ms.
  if (isBootstrapping) {
    return <Spinner fullPage label="Restoring session…" />;
  }

  // Not logged in → redirect to login, preserving intended destination
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role check — redirect to their own dashboard if they try to access wrong area
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    const fallback =
      user.role === "super_admin"
        ? "/admin"
        : user.role === "owner"
        ? "/owner"
        : user.role === "member"
        ? "/member"
        : "/trainer";
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
};
