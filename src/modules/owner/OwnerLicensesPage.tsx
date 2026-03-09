/**
 * OwnerLicensesPage.tsx
 *
 * Shows per-gym license bundles with utilization bars.
 * Owner can purchase additional licenses for any gym via an inline modal.
 */

import React, { useEffect, useState } from "react";
import {
  Building2,
  CheckCircle2,
  Package,
  Plus,
  X,
} from "lucide-react";
import { Header } from "../../layouts/Header";
import { Button } from "../../components/ui/Button";
import { Spinner } from "../../components/ui/Spinner";
import {
  getOwnerGyms,
  getOwnerLicenses,
  purchaseLicenses,
} from "../../services/gymService";
import type { Gym, LicenseBundle } from "../../types";
import { useToast } from "../../context/ToastContext";

// ─── Purchase Modal ───────────────────────────────────────────────────────────

interface PurchaseModalProps {
  gym: Gym;
  onClose: () => void;
  onSuccess: (bundle: LicenseBundle) => void;
}

const PACK_OPTIONS = [10, 25, 50, 100];

const PurchaseModal: React.FC<PurchaseModalProps> = ({
  gym,
  onClose,
  onSuccess,
}) => {
  const [selected, setSelected] = useState<number>(25);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [done, setDone] = useState(false);

  const handlePurchase = async () => {
    setIsPurchasing(true);
    try {
      const bundle = await purchaseLicenses(gym.id, selected);
      setDone(true);
      setTimeout(() => {
        onSuccess(bundle);
        onClose();
      }, 1200);
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Purchase Licenses
            </h2>
            <p className="text-xs text-gray-400">{gym.name}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {done ? (
          <div className="flex flex-col items-center gap-3 py-12 px-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <p className="font-semibold text-gray-800">Purchase Successful!</p>
            <p className="text-sm text-gray-500">
              {selected} licenses added to {gym.name}.
            </p>
          </div>
        ) : (
          <>
            <div className="px-6 py-5 flex flex-col gap-4">
              <p className="text-sm text-gray-600">
                Select the number of licenses to add:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {PACK_OPTIONS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setSelected(n)}
                    className={[
                      "rounded-xl border-2 py-3 text-sm font-bold transition-all",
                      selected === n
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                        : "border-gray-200 text-gray-700 hover:border-indigo-300",
                    ].join(" ")}
                  >
                    {n} licenses
                  </button>
                ))}
              </div>
              <div className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
                <p>
                  Estimated cost:{" "}
                  <span className="font-bold text-gray-900">
                    ₹{(selected * 299).toLocaleString("en-IN")}
                  </span>
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Valid until 31 Dec 2026
                </p>
              </div>
            </div>

            <div className="flex gap-3 border-t border-gray-100 px-6 py-4">
              <Button
                variant="secondary"
                fullWidth
                onClick={onClose}
                disabled={isPurchasing}
              >
                Cancel
              </Button>
              <Button fullWidth isLoading={isPurchasing} onClick={handlePurchase}>
                Confirm Purchase
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export const OwnerLicensesPage: React.FC = () => {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [licenses, setLicenses] = useState<LicenseBundle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchasingGym, setPurchasingGym] = useState<Gym | null>(null);
  const { toast } = useToast();

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
      setError(err instanceof Error ? err.message : "Failed to load licenses.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handlePurchaseSuccess = (updated: LicenseBundle) => {
    setLicenses((prev) =>
      prev.map((l) => (l.gymId === updated.gymId ? updated : l))
    );
    const gym = gyms.find((g) => g.id === updated.gymId);
    toast.success(`Licenses added to ${gym?.name ?? "gym"} successfully!`);
  };

  if (isLoading) return <Spinner fullPage label="Loading licenses…" />;

  return (
    <>
      <div className="flex flex-col">
        <Header
          title="License Management"
          subtitle="Purchase and track gym membership licenses"
          actions={
            <Button
              size="sm"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => gyms[0] && setPurchasingGym(gyms[0])}
            >
              Buy Licenses
            </Button>
          }
        />

        <div className="flex-1 p-6">
          {error && (
            <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-5">
            {gyms.map((gym) => {
              const bundle = licenses.find((l) => l.gymId === gym.id);
              const used = bundle?.usedLicenses ?? 0;
              const total = bundle?.totalLicenses ?? 0;
              const pct = total > 0 ? Math.round((used / total) * 100) : 0;

              return (
                <div
                  key={gym.id}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  {/* Gym header row */}
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                        <Building2 className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {gym.name}
                        </p>
                        {gym.location && (
                          <p className="text-xs text-gray-400">{gym.location}</p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<Plus className="h-3.5 w-3.5" />}
                      onClick={() => setPurchasingGym(gym)}
                    >
                      Add
                    </Button>
                  </div>

                  {bundle ? (
                    <>
                      {/* Stats row */}
                      <div className="mb-3 grid grid-cols-3 gap-3 text-center">
                        {[
                          { label: "Total", value: total },
                          { label: "Used", value: used },
                          { label: "Available", value: total - used },
                        ].map(({ label, value }) => (
                          <div
                            key={label}
                            className="rounded-lg bg-gray-50 py-2"
                          >
                            <p className="text-lg font-bold text-gray-900">
                              {value}
                            </p>
                            <p className="text-xs text-gray-400">{label}</p>
                          </div>
                        ))}
                      </div>

                      {/* Progress bar */}
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            pct >= 90
                              ? "bg-red-500"
                              : pct >= 70
                                ? "bg-amber-500"
                                : "bg-indigo-500"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                        <span>{pct}% utilization</span>
                        <span>Expires {bundle.expiresAt}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-3 text-xs text-amber-700">
                      <Package className="h-4 w-4 shrink-0" />
                      No license bundle found. Purchase to get started.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {purchasingGym && (
        <PurchaseModal
          gym={purchasingGym}
          onClose={() => setPurchasingGym(null)}
          onSuccess={handlePurchaseSuccess}
        />
      )}
    </>
  );
};
