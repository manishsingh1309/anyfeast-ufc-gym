/**
 * SuperAdminGymsPage.tsx
 *
 * Full gyms management table for Super Admin.
 * Features: search, filter by status/plan, add gym modal, disable/enable actions.
 */

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Plus,
  Search,
  ChevronDown,
  PowerOff,
  Power,
  Eye,
  X,
} from "lucide-react";
import {
  getAllPlatformGyms,
  disableGym,
  enableGym,
  addGym,
} from "../../services/superAdminService";
import { Header } from "../../layouts/Header";
import { PageMotion } from "../../components/PageMotion";
import { Badge } from "../../components/ui/Badge";
import { Spinner } from "../../components/ui/Spinner";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button";
import { useToast } from "../../context/ToastContext";
import type { PlatformGym } from "../../types";

const PLAN_COLORS: Record<string, string> = {
  starter: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
  growth: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  enterprise: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
};

const gymStatusBadge = (status: PlatformGym["status"]) => {
  if (status === "active") return "active" as const;
  if (status === "disabled") return "expired" as const;
  return "expiring" as const;
};

export const SuperAdminGymsPage: React.FC = () => {
  const { toast } = useToast();
  const [gyms, setGyms] = useState<PlatformGym[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | PlatformGym["status"]>("all");
  const [planFilter, setPlanFilter] = useState<"all" | PlatformGym["plan"]>("all");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Add gym form state
  const [newName, setNewName] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newOwner, setNewOwner] = useState("");
  const [newOwnerEmail, setNewOwnerEmail] = useState("");
  const [newPlan, setNewPlan] = useState<PlatformGym["plan"]>("starter");
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    getAllPlatformGyms().then((g) => { setGyms(g); setLoading(false); });
  }, []);

  const filtered = gyms.filter((g) => {
    const matchSearch =
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.location.toLowerCase().includes(search.toLowerCase()) ||
      g.owner.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || g.status === statusFilter;
    const matchPlan = planFilter === "all" || g.plan === planFilter;
    return matchSearch && matchStatus && matchPlan;
  });

  const handleToggleGym = useCallback(async (gym: PlatformGym) => {
    setActionLoading(gym.id);
    try {
      if (gym.status === "active") {
        await disableGym(gym.id);
        setGyms((prev) => prev.map((g) => g.id === gym.id ? { ...g, status: "disabled" } : g));
        toast.success(`${gym.name} has been disabled.`);
      } else {
        await enableGym(gym.id);
        setGyms((prev) => prev.map((g) => g.id === gym.id ? { ...g, status: "active" } : g));
        toast.success(`${gym.name} has been re-enabled.`);
      }
    } catch {
      toast.error("Action failed. Please try again.");
    } finally {
      setActionLoading(null);
    }
  }, [toast]);

  const handleAddGym = async () => {
    if (!newName.trim() || !newOwner.trim()) return;
    setAddLoading(true);
    try {
      const created = await addGym({ name: newName, location: newLocation, owner: newOwner, ownerEmail: newOwnerEmail, plan: newPlan });
      setGyms((prev) => [created, ...prev]);
      toast.success(`${created.name} added to the platform.`);
      setAddModalOpen(false);
      setNewName(""); setNewLocation(""); setNewOwner(""); setNewOwnerEmail("");
    } catch {
      toast.error("Failed to add gym.");
    } finally {
      setAddLoading(false);
    }
  };

  if (loading) return <Spinner fullPage label="Loading gyms…" />;

  const totals = {
    active: gyms.filter((g) => g.status === "active").length,
    disabled: gyms.filter((g) => g.status === "disabled").length,
    licenses: gyms.reduce((s, g) => s + g.licensesPurchased, 0),
  };

  return (
    <PageMotion>
      <div className="flex flex-col min-h-full bg-gray-50 dark:bg-slate-950">
        <Header
          title="All Gyms"
          subtitle={`${totals.active} active gyms · ${totals.licenses.toLocaleString()} total licenses`}
          actions={
            <Button
              size="sm"
              leftIcon={<Plus className="h-3.5 w-3.5" />}
              onClick={() => setAddModalOpen(true)}
            >
              Add Gym
            </Button>
          }
        />

        <div className="p-6 space-y-5">
          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Active Gyms", value: totals.active, color: "text-emerald-600 dark:text-emerald-400" },
              { label: "Disabled", value: totals.disabled, color: "text-red-500 dark:text-red-400" },
              { label: "Total Licenses Sold", value: totals.licenses.toLocaleString(), color: "text-brand-600 dark:text-brand-400" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-slate-500">{s.label}</p>
                <p className={`mt-1 text-2xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search gyms, owners, locations…"
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
                <option value="pending">Pending</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            </div>

            <div className="relative">
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value as typeof planFilter)}
                className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="all">All Plans</option>
                <option value="starter">Starter</option>
                <option value="growth">Growth</option>
                <option value="enterprise">Enterprise</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            </div>

            <span className="text-xs text-gray-400 dark:text-slate-500">
              {filtered.length} of {gyms.length} gyms
            </span>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-slate-700">
                    {["Gym", "Location", "Owner", "Trainers", "Active/Total Members", "License Usage", "Plan", "Status", "Actions"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-slate-500 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-slate-700/60">
                  <AnimatePresence>
                    {filtered.map((g) => (
                      <motion.tr
                        key={g.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-xs font-bold text-brand-700 dark:bg-brand-600/15 dark:text-brand-400">
                              {g.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-slate-100">{g.name}</p>
                              <p className="text-[11px] text-gray-400 dark:text-slate-500">Joined {g.joinedAt}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-gray-500 dark:text-slate-400 whitespace-nowrap">{g.location}</td>
                        <td className="px-5 py-3.5">
                          <p className="text-gray-700 dark:text-slate-300">{g.owner}</p>
                          <p className="text-[11px] text-gray-400 dark:text-slate-500">{g.ownerEmail}</p>
                        </td>
                        <td className="px-5 py-3.5 text-center text-gray-700 dark:text-slate-300">{g.totalTrainers}</td>
                        <td className="px-5 py-3.5 text-gray-700 dark:text-slate-300">
                          <span className="font-medium text-emerald-600 dark:text-emerald-400">{g.activeMembers}</span>
                          <span className="text-gray-400"> / {g.totalMembers}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="relative h-1.5 w-20 overflow-hidden rounded-full bg-gray-200 dark:bg-slate-700">
                              <div
                                className="absolute inset-y-0 left-0 rounded-full bg-brand-500"
                                style={{ width: `${g.licensesPurchased ? Math.min(100, (g.licensesUsed / g.licensesPurchased) * 100) : 0}%` }}
                              />
                            </div>
                            <span className="text-[11px] text-gray-500 dark:text-slate-400">
                              {g.licensesUsed}/{g.licensesPurchased}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${PLAN_COLORS[g.plan]}`}>
                            {g.plan}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge variant={gymStatusBadge(g.status)}>{g.status}</Badge>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1">
                            <button
                              title="View details"
                              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-slate-700 dark:hover:text-slate-300 transition-colors"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleToggleGym(g)}
                              disabled={actionLoading === g.id}
                              title={g.status === "active" ? "Disable gym" : "Enable gym"}
                              className={`rounded-lg p-1.5 transition-colors ${
                                g.status === "active"
                                  ? "text-red-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                                  : "text-emerald-400 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/20"
                              } disabled:opacity-40`}
                            >
                              {actionLoading === g.id ? (
                                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              ) : g.status === "active" ? (
                                <PowerOff className="h-3.5 w-3.5" />
                              ) : (
                                <Power className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>

              {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                  <Building2 className="h-10 w-10 text-gray-300 dark:text-slate-600" />
                  <p className="text-sm text-gray-400 dark:text-slate-500">
                    {search ? `No gyms match "${search}"` : "No gyms found"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Gym Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add New Gym"
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setAddModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddGym} isLoading={addLoading} disabled={!newName.trim() || !newOwner.trim()}>
              Add Gym
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-slate-300">Gym Name *</label>
            <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. IronCore Delhi"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-slate-300">Location</label>
            <input value={newLocation} onChange={(e) => setNewLocation(e.target.value)} placeholder="e.g. New Delhi, IN"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-slate-300">Owner Name *</label>
            <input value={newOwner} onChange={(e) => setNewOwner(e.target.value)} placeholder="e.g. Aakash Sharma"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-slate-300">Owner Email</label>
            <input value={newOwnerEmail} onChange={(e) => setNewOwnerEmail(e.target.value)} placeholder="owner@gym.com" type="email"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-slate-300">Subscription Plan</label>
            <select value={newPlan} onChange={(e) => setNewPlan(e.target.value as typeof newPlan)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <option value="starter">Starter</option>
              <option value="growth">Growth</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
        </div>
      </Modal>
    </PageMotion>
  );
};
