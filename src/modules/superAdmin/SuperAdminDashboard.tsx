/**
 * SuperAdminDashboard.tsx
 *
 * Platform-wide overview for AnyFeast Super Admin.
 * Shows: KPI cards, gym/subscription growth charts, gyms table, trainer activity table.
 */

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  Building2,
  Users,
  Activity,
  ArrowUpRight,
  DollarSign,
  CheckCircle2,
  Clock,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useNavigate } from "react-router-dom";
import {
  getPlatformStats,
  getAllPlatformGyms,
  getAllPlatformTrainers,
  getPlatformMonthlyData,
} from "../../services/superAdminService";
import { Header } from "../../layouts/Header";
import { PageMotion } from "../../components/PageMotion";
import { Badge } from "../../components/ui/Badge";
import { Spinner } from "../../components/ui/Spinner";
import type {
  PlatformStats,
  PlatformGym,
  PlatformTrainer,
  PlatformMonthlyPoint,
} from "../../types";

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

const PLAN_COLORS: Record<string, string> = {
  starter: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
  growth: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  enterprise: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
};

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  colorClass: string;
  prefix?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label, value, icon, trend, trendUp, colorClass, prefix,
}) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
    <div className="flex items-start justify-between">
      <div className={`rounded-xl p-2.5 ${colorClass}`}>{icon}</div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-medium ${trendUp ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}>
          <ArrowUpRight className={`h-3 w-3 ${!trendUp ? "rotate-180" : ""}`} />
          {trend}
        </div>
      )}
    </div>
    <div className="mt-4">
      <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
        {prefix}{typeof value === "number" ? value.toLocaleString() : value}
      </p>
      <p className="mt-0.5 text-xs text-gray-500 dark:text-slate-400">{label}</p>
    </div>
  </div>
);

export const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [gyms, setGyms] = useState<PlatformGym[]>([]);
  const [trainers, setTrainers] = useState<PlatformTrainer[]>([]);
  const [monthly, setMonthly] = useState<PlatformMonthlyPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getPlatformStats(),
      getAllPlatformGyms(),
      getAllPlatformTrainers(),
      getPlatformMonthlyData(),
    ]).then(([s, g, t, m]) => {
      setStats(s);
      setGyms(g.slice(0, 6));
      setTrainers(t.slice(0, 8));
      setMonthly(m);
      setLoading(false);
    });
  }, []);

  if (loading) return <Spinner fullPage label="Loading platform data…" />;

  const activeRate = stats
    ? Math.round((stats.activeSubscriptions / stats.totalMembers) * 100)
    : 0;

  const gymStatusBadge = (status: PlatformGym["status"]) => {
    if (status === "active") return "active" as const;
    if (status === "disabled") return "expired" as const;
    return "expiring" as const;
  };

  return (
    <PageMotion>
      <div className="flex flex-col min-h-full bg-gray-50 dark:bg-slate-950">
        <Header
          title="Platform Overview"
          subtitle="AnyFeast Super Admin · Real-time platform health"
        />

        <div className="p-6 space-y-6">
          {/* ── KPI Cards ─────────────────────────────────── */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            <motion.div variants={fadeUp}>
              <StatCard
                label="Total Active Gyms"
                value={stats?.totalGyms ?? 0}
                icon={<Building2 className="h-5 w-5" />}
                colorClass="bg-brand-50 text-brand-600 dark:bg-brand-600/15 dark:text-brand-400"
                trend={`${stats?.gymGrowthRate}% MoM`}
                trendUp
              />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatCard
                label="Total Trainers"
                value={stats?.totalTrainers ?? 0}
                icon={<Users className="h-5 w-5" />}
                colorClass="bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400"
              />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatCard
                label="Total Members"
                value={stats?.totalMembers ?? 0}
                icon={<Activity className="h-5 w-5" />}
                colorClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                trend={`${activeRate}% activation rate`}
                trendUp
              />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatCard
                label="Monthly Revenue"
                value={(stats?.monthlyRecurringRevenue ?? 0).toLocaleString("en-IN")}
                prefix="₹"
                icon={<DollarSign className="h-5 w-5" />}
                colorClass="bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                trend={`${stats?.subscriptionGrowthRate}% MoM`}
                trendUp
              />
            </motion.div>
          </motion.div>

          {/* ── Charts ────────────────────────────────────── */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Gym & Subscription Growth */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-slate-200">
                Platform Growth
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={monthly} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gymsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF6A00" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#FF6A00" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="subsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-slate-700" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "var(--tw-bg-opacity,1) hsl(222,47%,11%)", border: "1px solid #334155", borderRadius: 8, fontSize: 12 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Area type="monotone" dataKey="gyms" name="Gyms" stroke="#FF6A00" fill="url(#gymsGrad)" strokeWidth={2} dot={false} />
                  <Area type="monotone" dataKey="subscriptions" name="Subscriptions" stroke="#10b981" fill="url(#subsGrad)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Monthly Revenue Bar */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-slate-200">
                Monthly Revenue (₹)
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthly} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-slate-700" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={(v) => [`₹${Number(v).toLocaleString("en-IN")}`, "Revenue"]}
                    contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, fontSize: 12 }}
                  />
                  <Bar dataKey="revenue" name="Revenue" fill="#FF6A00" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* ── Gyms Table ────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100">Gyms</h3>
              <button
                onClick={() => navigate("/admin/gyms")}
                className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
              >
                View all →
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50 dark:border-slate-700">
                    {["Gym Name", "Location", "Owner", "Trainers", "Members", "Licenses", "Plan", "Status"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-slate-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-slate-700/60">
                  {gyms.map((g) => (
                    <tr key={g.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-slate-100">{g.name}</td>
                      <td className="px-5 py-3.5 text-gray-500 dark:text-slate-400">{g.location}</td>
                      <td className="px-5 py-3.5 text-gray-600 dark:text-slate-400">{g.owner}</td>
                      <td className="px-5 py-3.5 text-gray-600 dark:text-slate-400">{g.totalTrainers}</td>
                      <td className="px-5 py-3.5 text-gray-600 dark:text-slate-400">{g.activeMembers}/{g.totalMembers}</td>
                      <td className="px-5 py-3.5 text-gray-600 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                          <span>{g.licensesUsed}/{g.licensesPurchased}</span>
                          <div className="relative h-1.5 w-16 overflow-hidden rounded-full bg-gray-200 dark:bg-slate-700">
                            <div
                              className="absolute inset-y-0 left-0 rounded-full bg-brand-500"
                              style={{ width: `${Math.min(100, (g.licensesUsed / g.licensesPurchased) * 100)}%` }}
                            />
                          </div>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* ── Trainer Activity Table ────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100">Trainer Activity</h3>
              <button
                onClick={() => navigate("/admin/trainers")}
                className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
              >
                View all →
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50 dark:border-slate-700">
                    {["Trainer", "Gym", "Onboarded", "Active", "Renewals", "Status"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-slate-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-slate-700/60">
                  {trainers.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700 dark:bg-brand-600/20 dark:text-brand-400">
                            {t.name.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-900 dark:text-slate-100">{t.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 dark:text-slate-400">{t.gymName}</td>
                      <td className="px-5 py-3.5 font-semibold text-gray-800 dark:text-slate-200">{t.membersOnboarded}</td>
                      <td className="px-5 py-3.5 text-emerald-600 dark:text-emerald-400 font-medium">{t.activeMembers}</td>
                      <td className="px-5 py-3.5 text-gray-600 dark:text-slate-400">{t.renewals}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          {t.status === "active" ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          ) : (
                            <Clock className="h-3.5 w-3.5 text-gray-400" />
                          )}
                          <span className={`text-xs font-medium ${t.status === "active" ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400"}`}>
                            {t.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </PageMotion>
  );
};
