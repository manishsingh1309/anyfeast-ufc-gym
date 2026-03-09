/**
 * OwnerGymsPage.tsx
 *
 * Lists all gyms owned by this owner with per-gym license stats,
 * trainer count, and drill-down details panel (slide-in from right).
 */

import React, { useEffect, useState } from "react";
import {
  Building2,
  ChevronRight,
  MapPin,
  Users,
  X,
} from "lucide-react";
import { Header } from "../../layouts/Header";
import { Spinner } from "../../components/ui/Spinner";
import {
  getOwnerGyms,
  getOwnerLicenses,
  getTrainersByGym,
} from "../../services/gymService";
import type { Gym, LicenseBundle, Trainer } from "../../types";

// ─── Gym Detail Panel ────────────────────────────────────────────────────────

interface GymDetailPanelProps {
  gym: Gym;
  bundle: LicenseBundle | undefined;
  onClose: () => void;
}

const GymDetailPanel: React.FC<GymDetailPanelProps> = ({
  gym,
  bundle,
  onClose,
}) => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getTrainersByGym(gym.id)
      .then(setTrainers)
      .finally(() => setIsLoading(false));
  }, [gym.id]);

  const used = bundle?.usedLicenses ?? 0;
  const total = bundle?.totalLicenses ?? 0;
  const pct = total > 0 ? Math.round((used / total) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="flex-1 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <aside className="w-full max-w-sm bg-white shadow-2xl flex flex-col overflow-y-auto">
        {/* Panel header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4 z-10">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              {gym.name}
            </h2>
            {gym.location && (
              <p className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                <MapPin className="h-3 w-3" />
                {gym.location}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-6 p-6">
          {/* License stats */}
          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Licenses
            </h3>
            {bundle ? (
              <>
                <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                  {[
                    { label: "Total", value: total },
                    { label: "Used", value: used },
                    { label: "Free", value: total - used },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="rounded-xl bg-gray-50 py-2.5"
                    >
                      <p className="text-xl font-bold text-gray-900">
                        {value}
                      </p>
                      <p className="text-xs text-gray-400">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full ${
                      pct >= 90
                        ? "bg-red-500"
                        : pct >= 70
                          ? "bg-amber-500"
                          : "bg-brand-500"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="mt-1.5 text-xs text-gray-400">
                  {pct}% utilization · Expires {bundle.expiresAt}
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-400">No license bundle.</p>
            )}
          </section>

          {/* Trainers */}
          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Trainers ({trainers.length})
            </h3>
            {isLoading ? (
              <div className="flex justify-center py-6">
                <Spinner size="sm" />
              </div>
            ) : trainers.length === 0 ? (
              <p className="text-sm text-gray-400">No trainers assigned.</p>
            ) : (
              <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200 overflow-hidden">
                {trainers.map((t) => (
                  <li
                    key={t.id}
                    className="flex items-center gap-3 px-4 py-3 bg-white"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">
                      {t.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {t.name}
                      </p>
                      <p className="text-xs text-gray-400">{t.phone}</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {t.membersOnboarded} members
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </aside>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export const OwnerGymsPage: React.FC = () => {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [licenses, setLicenses] = useState<LicenseBundle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [ownerGyms, bundles] = await Promise.all([
          getOwnerGyms(),
          getOwnerLicenses(),
        ]);
        setGyms(ownerGyms);
        setLicenses(bundles);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load gyms.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  if (isLoading) return <Spinner fullPage label="Loading gyms…" />;

  return (
    <>
      <div className="flex flex-col">
        <Header
          title="My Gyms"
          subtitle={`${gyms.length} gym${gyms.length !== 1 ? "s" : ""} in your network`}
        />

        <div className="flex-1 p-6">
          {error && (
            <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {gyms.map((gym) => {
              const bundle = licenses.find((l) => l.gymId === gym.id);
              const used = bundle?.usedLicenses ?? 0;
              const total = bundle?.totalLicenses ?? 0;
              const pct = total > 0 ? Math.round((used / total) * 100) : 0;

              return (
                <div
                  key={gym.id}
                  className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedGym(gym)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50">
                        <Building2 className="h-6 w-6 text-brand-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {gym.name}
                        </p>
                        {gym.location && (
                          <p className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                            <MapPin className="h-3 w-3" />
                            {gym.location}
                          </p>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-300 shrink-0 mt-0.5" />
                  </div>

                  {/* Quick stats */}
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="rounded-lg bg-gray-50 py-2">
                      <p className="text-base font-bold text-gray-900">
                        {total}
                      </p>
                      <p className="text-xs text-gray-400">Licenses</p>
                    </div>
                    <div className="rounded-lg bg-gray-50 py-2">
                      <p className="text-base font-bold text-gray-900">
                        {total - used}
                      </p>
                      <p className="text-xs text-gray-400">Available</p>
                    </div>
                  </div>

                  {/* Mini progress bar */}
                  {bundle && (
                    <div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full ${
                            pct >= 90
                              ? "bg-red-500"
                              : pct >= 70
                                ? "bg-amber-500"
                                : "bg-brand-500"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="mt-1 flex items-center justify-between text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {used} members
                        </span>
                        <span>{pct}% full</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selectedGym && (
        <GymDetailPanel
          gym={selectedGym}
          bundle={licenses.find((l) => l.gymId === selectedGym.id)}
          onClose={() => setSelectedGym(null)}
        />
      )}
    </>
  );
};
