/**
 * GymSelectionPage.tsx
 *
 * Shown to trainers who belong to multiple gyms.
 * After selection, persists gym in GymContext and navigates to dashboard.
 *
 * Zero API calls needed here — the gyms list comes from auth user object.
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useGym } from "../../context/GymContext";
import type { Gym } from "../../types";
import { Building2, ChevronRight, MapPin } from "lucide-react";

export const GymSelectionPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { selectGym } = useGym();
  const navigate = useNavigate();

  const handleSelect = (gym: Gym) => {
    selectGym(gym);
    navigate("/trainer/dashboard", { replace: true });
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 via-white to-accent-50/30 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 shadow-lg">
            <Building2 className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Select a Gym</h1>
          <p className="mt-1.5 text-sm text-gray-500">
            Hey {user.name}, you're linked to {user.gyms.length} gyms.
            <br />
            Choose the one you're working at today.
          </p>
        </div>

        {/* Gym Cards */}
        <div className="flex flex-col gap-3">
          {user.gyms.map((gym) => (
            <button
              key={gym.id}
              onClick={() => handleSelect(gym)}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-all hover:border-brand-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-400"
            >
              <div className="flex items-center gap-4">
                {/* Gym avatar */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-50">
                  <Building2 className="h-5 w-5 text-brand-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{gym.name}</p>
                  {gym.location && (
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
                      <MapPin className="h-3 w-3" />
                      {gym.location}
                    </p>
                  )}
                </div>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-gray-400" />
            </button>
          ))}
        </div>

        {/* Sign out */}
        <div className="mt-8 text-center">
          <button
            onClick={logout}
            className="text-sm text-gray-400 hover:text-gray-600 hover:underline"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};
