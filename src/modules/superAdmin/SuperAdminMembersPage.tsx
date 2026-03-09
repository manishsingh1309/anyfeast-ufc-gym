/**
 * SuperAdminMembersPage.tsx
 *
 * All members across the entire platform — Super Admin view.
 */

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, UserPlus, X } from "lucide-react";
import { getAllMembers } from "../../services/memberService";
import { getAllPlatformGyms, getAllPlatformTrainers } from "../../services/superAdminService";
import { Header } from "../../layouts/Header";
import { PageMotion } from "../../components/PageMotion";
import { Badge } from "../../components/ui/Badge";
import { Spinner } from "../../components/ui/Spinner";
import type { Member, MemberStatus, SubscriptionTier } from "../../types";

const tierColors: Record<SubscriptionTier, string> = {
  basic: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
  standard: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  premium: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
};

const statusBadge = (s: MemberStatus) => {
  if (s === "active") return "active" as const;
  if (s === "expiring_soon") return "expiring" as const;
  return "expired" as const;
};

// Gym/trainer name lookup helpers
const gymNameMap: Record<string, string> = {};
const trainerNameMap: Record<string, string> = {};

export const SuperAdminMembersPage: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | MemberStatus>("all");
  const [tierFilter, setTierFilter] = useState<"all" | SubscriptionTier>("all");

  useEffect(() => {
    Promise.all([getAllMembers(), getAllPlatformGyms(), getAllPlatformTrainers()]).then(
      ([mems, gyms, trainers]) => {
        gyms.forEach((g) => { gymNameMap[g.id] = g.name; });
        trainers.forEach((t) => { trainerNameMap[t.id] = t.name; });
        setMembers(mems);
        setLoading(false);
      }
    );
  }, []);

  const filtered = members.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.phone.includes(search) ||
      (gymNameMap[m.gymId] ?? "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || m.status === statusFilter;
    const matchTier = tierFilter === "all" || m.subscriptionTier === tierFilter;
    return matchSearch && matchStatus && matchTier;
  });

  const stats = {
    active: members.filter((m) => m.status === "active").length,
    expiring: members.filter((m) => m.status === "expiring_soon").length,
    expired: members.filter((m) => m.status === "expired").length,
  };

  if (loading) return <Spinner fullPage label="Loading members…" />;

  return (
    <PageMotion>
      <div className="flex flex-col min-h-full bg-gray-50 dark:bg-slate-950">
        <Header
          title="All Members"
          subtitle={`${members.length} total members · ${stats.active} active`}
        />

        <div className="p-6 space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Active", value: stats.active, color: "text-emerald-600 dark:text-emerald-400" },
              { label: "Expiring Soon", value: stats.expiring, color: "text-amber-600 dark:text-amber-400" },
              { label: "Expired", value: stats.expired, color: "text-red-500 dark:text-red-400" },
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
                placeholder="Search by name, phone, gym…"
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="flex rounded-lg border border-gray-200 bg-white overflow-hidden dark:border-slate-700 dark:bg-slate-800">
              {(["all", "active", "expiring_soon", "expired"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-2 text-xs font-medium transition-colors ${
                    statusFilter === s
                      ? "bg-brand-600 text-white"
                      : "text-gray-600 hover:bg-gray-50 dark:text-slate-400 dark:hover:bg-slate-700"
                  }`}
                >
                  {s === "all" ? "All" : s === "expiring_soon" ? "Expiring" : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex rounded-lg border border-gray-200 bg-white overflow-hidden dark:border-slate-700 dark:bg-slate-800">
              {(["all", "basic", "standard", "premium"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTierFilter(t)}
                  className={`px-3 py-2 text-xs font-medium capitalize transition-colors ${
                    tierFilter === t
                      ? "bg-brand-600 text-white"
                      : "text-gray-600 hover:bg-gray-50 dark:text-slate-400 dark:hover:bg-slate-700"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <span className="text-xs text-gray-400 dark:text-slate-500">
              {filtered.length} of {members.length}
            </span>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-slate-700">
                    {["Member", "Phone", "Gym", "Trainer", "Tier", "Start Date", "End Date", "Renewals", "Status"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-slate-500 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-slate-700/60">
                  <AnimatePresence>
                    {filtered.map((m, idx) => (
                      <motion.tr
                        key={m.id}
                        layout
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: idx * 0.02 }}
                        className={`hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors ${m.status === "expiring_soon" ? "bg-amber-50/50 dark:bg-amber-900/5" : ""}`}
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700 dark:bg-brand-600/20 dark:text-brand-400">
                              {m.name.charAt(0)}
                            </div>
                            <span className="font-medium text-gray-900 dark:text-slate-100">{m.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-mono text-xs text-gray-500 dark:text-slate-400">{m.phone}</td>
                        <td className="px-5 py-3.5 text-gray-500 dark:text-slate-400 max-w-[140px] truncate">{gymNameMap[m.gymId] ?? m.gymId}</td>
                        <td className="px-5 py-3.5 text-gray-500 dark:text-slate-400">{trainerNameMap[m.trainerId] ?? m.trainerId}</td>
                        <td className="px-5 py-3.5">
                          <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${tierColors[m.subscriptionTier]}`}>
                            {m.subscriptionTier}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-gray-500 dark:text-slate-400 whitespace-nowrap">{m.startDate}</td>
                        <td className="px-5 py-3.5 text-gray-500 dark:text-slate-400 whitespace-nowrap">{m.endDate}</td>
                        <td className="px-5 py-3.5 text-center text-gray-600 dark:text-slate-400">{m.renewalCount}</td>
                        <td className="px-5 py-3.5">
                          <Badge variant={statusBadge(m.status)}>
                            {m.status === "expiring_soon" ? "Expiring" : m.status}
                          </Badge>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>

              {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-3 py-16">
                  <UserPlus className="h-10 w-10 text-gray-300 dark:text-slate-600" />
                  <p className="text-sm text-gray-400 dark:text-slate-500">No members match your filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageMotion>
  );
};
