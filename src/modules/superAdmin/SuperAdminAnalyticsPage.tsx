/**
 * SuperAdminAnalyticsPage.tsx
 *
 * Platform-wide analytics: activation rate, renewal rate, revenue trend,
 * gym leaderboard, trainer leaderboard.
 */

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  RadialBarChart, RadialBar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
} from "recharts";
import { TrendingUp, Activity, DollarSign, Users } from "lucide-react";
import {
  getPlatformStats,
  getPlatformMonthlyData,
  getAllPlatformGyms,
  getAllPlatformTrainers,
} from "../../services/superAdminService";
import { Header } from "../../layouts/Header";
import { PageMotion } from "../../components/PageMotion";
import { Spinner } from "../../components/ui/Spinner";
import type {
  PlatformStats,
  PlatformMonthlyPoint,
  PlatformGym,
  PlatformTrainer,
} from "../../types";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

const COLORS = ["#FF6A00", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

const radialData = (activationRate: number, renewalRate: number) => [
  { name: "Activation Rate", value: activationRate, fill: "#FF6A00" },
  { name: "Renewal Rate", value: renewalRate, fill: "#10b981" },
];

export const SuperAdminAnalyticsPage: React.FC = () => {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [monthly, setMonthly] = useState<PlatformMonthlyPoint[]>([]);
  const [gyms, setGyms] = useState<PlatformGym[]>([]);
  const [trainers, setTrainers] = useState<PlatformTrainer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getPlatformStats(),
      getPlatformMonthlyData(),
      getAllPlatformGyms(),
      getAllPlatformTrainers(),
    ]).then(([s, m, g, t]) => {
      setStats(s);
      setMonthly(m);
      setGyms(g.filter((gm) => gm.status === "active").sort((a, b) => b.activeMembers - a.activeMembers).slice(0, 8));
      setTrainers(t.filter((tr) => tr.status === "active").sort((a, b) => b.membersOnboarded - a.membersOnboarded).slice(0, 8));
      setLoading(false);
    });
  }, []);

  if (loading) return <Spinner fullPage label="Loading analytics…" />;

  const activationRate = stats
    ? Math.round((stats.activeSubscriptions / stats.totalMembers) * 100)
    : 0;
  const renewalRate = 68; // mock static

  const activationTrend = monthly.map((m) => ({
    month: m.month,
    "Activation Rate": m.activations > 0 ? Math.round((m.activations / m.subscriptions) * 100) : 0,
    "Subscriptions": m.subscriptions,
  }));

  const gymBarData = gyms.map((g) => ({
    name: g.name.length > 18 ? g.name.slice(0, 18) + "…" : g.name,
    Members: g.activeMembers,
    Licenses: g.licensesPurchased,
  }));

  return (
    <PageMotion>
      <div className="flex flex-col min-h-full bg-gray-50 dark:bg-slate-950">
        <Header
          title="Platform Analytics"
          subtitle="End-to-end insights across all gyms and subscriptions"
        />

        <div className="p-6 space-y-6">
          {/* KPI summary row */}
          <motion.div
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            {[
              { label: "Activation Rate", value: `${activationRate}%`, icon: <Activity className="h-5 w-5" />, colorClass: "bg-brand-50 text-brand-600 dark:bg-brand-600/15 dark:text-brand-400", sub: "Active / Total Members" },
              { label: "Renewal Rate", value: `${renewalRate}%`, icon: <TrendingUp className="h-5 w-5" />, colorClass: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400", sub: "Based on 90-day window" },
              { label: "Total Members", value: stats?.totalMembers.toLocaleString(), icon: <Users className="h-5 w-5" />, colorClass: "bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400", sub: "All gyms combined" },
              { label: "MRR", value: `₹${((stats?.monthlyRecurringRevenue ?? 0) / 1000).toFixed(1)}k`, icon: <DollarSign className="h-5 w-5" />, colorClass: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400", sub: `${stats?.subscriptionGrowthRate}% MoM growth` },
            ].map((card) => (
              <motion.div key={card.label} variants={fadeUp}>
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                  <div className={`mb-3 inline-flex rounded-xl p-2.5 ${card.colorClass}`}>{card.icon}</div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">{card.value}</p>
                  <p className="text-xs font-medium text-gray-700 dark:text-slate-300">{card.label}</p>
                  <p className="text-[11px] text-gray-400 dark:text-slate-500">{card.sub}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Rate gauges + Revenue trend */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {/* Radial rate gauges */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <h3 className="mb-2 text-sm font-semibold text-gray-800 dark:text-slate-200">Rate Overview</h3>
              <ResponsiveContainer width="100%" height={200}>
                <RadialBarChart
                  cx="50%" cy="50%"
                  innerRadius="30%"
                  outerRadius="80%"
                  data={radialData(activationRate, renewalRate)}
                  startAngle={90}
                  endAngle={-270}
                >
                  <RadialBar dataKey="value" label={{ position: "insideStart", fill: "#fff", fontSize: 10 }} background={{ fill: "#f1f5f9" }} />
                  <Legend
                    iconSize={10}
                    formatter={(value) => <span className="text-xs text-gray-600 dark:text-slate-400">{value}</span>}
                  />
                  <Tooltip formatter={(v) => [`${v}%`]} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="mt-2 grid grid-cols-2 gap-2 text-center">
                <div className="rounded-lg bg-brand-50 py-2 dark:bg-brand-600/10">
                  <p className="text-lg font-bold text-brand-700 dark:text-brand-400">{activationRate}%</p>
                  <p className="text-[10px] text-brand-500 dark:text-brand-500">Activation</p>
                </div>
                <div className="rounded-lg bg-emerald-50 py-2 dark:bg-emerald-900/20">
                  <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{renewalRate}%</p>
                  <p className="text-[10px] text-emerald-500 dark:text-emerald-500">Renewal</p>
                </div>
              </div>
            </motion.div>

            {/* Revenue + Activation Trend */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-slate-200">Activation Rate Trend</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={activationTrend} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-slate-700" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} unit="%" domain={[50, 100]} />
                  <Tooltip formatter={(v, name) => [name === "Activation Rate" ? `${Number(v)}%` : v, String(name)]} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="Activation Rate" stroke="#FF6A00" strokeWidth={2.5} dot={{ r: 3, fill: "#FF6A00" }} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Revenue Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-slate-200">Monthly Revenue vs Subscriptions</h3>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={monthly} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="subGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6A00" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#FF6A00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-slate-700" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area yAxisId="left" type="monotone" dataKey="revenue" name="Revenue (₹)" stroke="#f59e0b" fill="url(#revGrad)" strokeWidth={2} dot={false} />
                <Area yAxisId="right" type="monotone" dataKey="subscriptions" name="Subscriptions" stroke="#FF6A00" fill="url(#subGrad2)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Gym Leaderboard */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-slate-200">Gym Leaderboard (by Active Members)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={gymBarData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-slate-700" />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={100} />
                  <Tooltip />
                  <Bar dataKey="Members" fill="#FF6A00" radius={[0, 4, 4, 0]}>
                    {gymBarData.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Trainer Leaderboard */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <h3 className="mb-4 text-sm font-semibold text-gray-800 dark:text-slate-200">Trainer Leaderboard (by Onboarded)</h3>
              <div className="space-y-3">
                {trainers.map((t, idx) => (
                  <div key={t.id} className="flex items-center gap-3">
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${idx < 3 ? "bg-brand-600 text-white dark:bg-brand-500" : "bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-slate-400"}`}>
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="truncate text-xs font-medium text-gray-800 dark:text-slate-100">{t.name}</p>
                        <p className="text-xs font-semibold text-brand-600 dark:text-brand-400 ml-2">{t.membersOnboarded}</p>
                      </div>
                      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-slate-700">
                        <div
                          className="absolute inset-y-0 left-0 rounded-full bg-brand-500"
                          style={{ width: `${Math.round((t.membersOnboarded / (trainers[0]?.membersOnboarded || 1)) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageMotion>
  );
};
