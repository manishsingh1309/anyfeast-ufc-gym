/**
 * SuperAdminTrainersPage.tsx
 *
 * All trainers across the platform — filterable, searchable table.
 */

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Users, X, CheckCircle2, Clock } from "lucide-react";
import { getAllPlatformTrainers } from "../../services/superAdminService";
import { Header } from "../../layouts/Header";
import { PageMotion } from "../../components/PageMotion";
import { Spinner } from "../../components/ui/Spinner";
import type { PlatformTrainer } from "../../types";

export const SuperAdminTrainersPage: React.FC = () => {
  const [trainers, setTrainers] = useState<PlatformTrainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  useEffect(() => {
    getAllPlatformTrainers().then((t) => { setTrainers(t); setLoading(false); });
  }, []);

  const filtered = trainers.filter((t) => {
    const matchSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.gymName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalOnboarded = trainers.reduce((s, t) => s + t.membersOnboarded, 0);
  const totalActive = trainers.reduce((s, t) => s + t.activeMembers, 0);
  const totalRenewals = trainers.reduce((s, t) => s + t.renewals, 0);

  if (loading) return <Spinner fullPage label="Loading trainers…" />;

  return (
    <PageMotion>
      <div className="flex flex-col min-h-full bg-gray-50 dark:bg-slate-950">
        <Header
          title="All Trainers"
          subtitle={`${trainers.filter((t) => t.status === "active").length} active trainers across ${new Set(trainers.map((t) => t.gymId)).size} gyms`}
        />

        <div className="p-6 space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { label: "Total Members Onboarded", value: totalOnboarded, color: "text-brand-600 dark:text-brand-400" },
              { label: "Currently Active Members", value: totalActive, color: "text-emerald-600 dark:text-emerald-400" },
              { label: "Total Renewals Facilitated", value: totalRenewals, color: "text-amber-600 dark:text-amber-400" },
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
                placeholder="Search by trainer name or gym…"
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <div className="flex rounded-lg border border-gray-200 bg-white overflow-hidden dark:border-slate-700 dark:bg-slate-800">
              {(["all", "active", "inactive"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-2 text-xs font-medium capitalize transition-colors ${
                    statusFilter === s
                      ? "bg-brand-600 text-white"
                      : "text-gray-600 hover:bg-gray-50 dark:text-slate-400 dark:hover:bg-slate-700"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <span className="text-xs text-gray-400 dark:text-slate-500">
              {filtered.length} of {trainers.length}
            </span>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-slate-700">
                    {["Trainer", "Gym", "Members Onboarded", "Active Members", "Renewals", "Joined", "Status"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-slate-500 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-slate-700/60">
                  <AnimatePresence>
                    {filtered.map((t, idx) => (
                      <motion.tr
                        key={t.id}
                        layout
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: idx * 0.02 }}
                        className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700 dark:bg-brand-600/20 dark:text-brand-400">
                              {t.name.charAt(0)}
                            </div>
                            <span className="font-medium text-gray-900 dark:text-slate-100">{t.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-gray-500 dark:text-slate-400">{t.gymName}</td>
                        <td className="px-5 py-3.5 font-semibold text-gray-800 dark:text-slate-200">{t.membersOnboarded}</td>
                        <td className="px-5 py-3.5 font-semibold text-emerald-600 dark:text-emerald-400">{t.activeMembers}</td>
                        <td className="px-5 py-3.5 text-gray-600 dark:text-slate-400">{t.renewals}</td>
                        <td className="px-5 py-3.5 text-gray-400 dark:text-slate-500 whitespace-nowrap">{t.joinedAt}</td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5">
                            {t.status === "active" ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                            ) : (
                              <Clock className="h-3.5 w-3.5 text-gray-400" />
                            )}
                            <span className={`text-xs font-medium capitalize ${t.status === "active" ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400"}`}>
                              {t.status}
                            </span>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>

              {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-3 py-16">
                  <Users className="h-10 w-10 text-gray-300 dark:text-slate-600" />
                  <p className="text-sm text-gray-400 dark:text-slate-500">No trainers match your search</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageMotion>
  );
};
