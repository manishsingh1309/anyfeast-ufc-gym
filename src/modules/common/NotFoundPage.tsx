/**
 * NotFoundPage.tsx — 404 fallback.
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const home =
    user?.role === "owner"
      ? "/owner/dashboard"
      : user?.role === "trainer"
        ? "/trainer/dashboard"
        : "/login";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-50 px-4 text-center">
      <div>
        <p className="text-6xl font-black text-indigo-200">404</p>
        <h1 className="mt-2 text-xl font-bold text-gray-800">
          Page not found
        </h1>
        <p className="mt-1.5 text-sm text-gray-500">
          The page you're looking for doesn't exist or has moved.
        </p>
      </div>
      <Button onClick={() => navigate(home)}>Go to Dashboard</Button>
    </div>
  );
};
