/**
 * OwnerDashboard.tsx
 *
 * Gym owner overview — license KPIs, trainer leaderboard, member roster.
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Crown,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { getOwnerLicenseStats } from "../../services/gymService";
import {
  getTrainerLeaderboard,
  getMonthlyData,
} from "../../services/analyticsService";
import { getAllMembers } from "../../services/memberService";
import { useAuth } from "../../context/AuthContext";
import { Header } from "../../layouts/Header";
import { StatCard, Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Spinner } from "../../components/ui/Spinner";
import { Badge } from "../../components/ui/Badge";
import { RechartsAreaChart } from "../../components/dashboard/RechartsAreaChart";
import { RechartsBarChart } from "../../components/dashboard/RechartsBarChart";
import { RechartsDonut } from "../../components/dashboard/RechartsDonut";
import { PageMotion } from "../../components/PageMotion";
import type { Member, TrainerLeaderboardEntry, MonthlyDataPoint } from "../../types";

interface LicenseStats {
  totalPurchased: number;
  totalUsed: number;
  totalAvailable: number;
}

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

export const OwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<LicenseStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<TrainerLeaderboardEntry[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [licStats, board, allMembers, monthly] = await Promise.all([
        getOwnerLicenseStats(),
        getTrainerLeaderboard(),
        getAllMembers(),
        getMonthlyData(),
      ]);
      setStats(licStats);
      setLeaderboard(board);
      setMembers(allMembers);
      setMonthlyData(monthly);
      setIsLoading(false);
    };
    load();
  }, []);

  if (isLoading) return <Spinner fullPage label="Loading dashboard…" />;

  const activationPct = stats
    ? Math.round((stats.totalUsed / stats.totalPurchased) * 100)
    : 0;

  const activeMembers = members.filter((m) => m.status === "active").length;
  const expiringSoon = members.filter((m) => m.status === "expiring_soon").length;
  const expired = members.filter((m) => m.status === "expired").length;

  const today = new Date();
  const recentMembers = [...members]
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, 8);

  const barData = monthlyData.map((d) => ({
    label: d.month,
    value: d.activations,
  }));

  const trendData = monthlyData.map((d) => ({
    label: d.month,
    activations: d.activations,
    renewals: d.renewals,
  }));

  const statusBadgeVariant = (s: string) => {
    if (s === "active") return "active" as const;
    if (s === "expiring_soon") return "expiring" as const;
    return "expired" as const;
  };

  const tierVariant = (t: string) =>
    (t === "premium" ? "premium" : t === "standard" ? "standard" : "basic") as
      | "premium"
      | "standard"
      | "basic";

  return (
    <PageMotion>
    <div className="flex flex-col bg-gray-50 dark:bg-slate-950 min-h-full">
      <Header
        title="Overview"
        subtitle={`Welcome back, ${user?.name} · ${today.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}`}
        actions={
          <Button
            size="sm"
            leftIcon={<ShoppingCart className="h-3.5 w-3.5" />}
            onClick={() => navigate("/owner/licenses")}
          >
            Buy Licenses
          </Button>
        }
      />

      <div className="p-6 space-y-6">
        {/* ── Expiry Alert ─────────────────────────────── */}
        {expiringSoon > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-700/50 dark:bg-amber-900/10"
          >
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-sm text-amber-800 dark:text-amber-300">
              <span className="font-semibold">{expiringSoon} member{expiringSoon > 1 ? "s" : ""}</span>{" "}
              {expiringSoon > 1 ? "are" : "is"} expiring soon — consider renewal outreach.
            </p>
          </motion.div>
        )}

        {/* ── KPI Cards ───────────────────────────────────────────────── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <motion.div variants={fadeUp}>
            <StatCard
              label="Total Licenses"
              value={stats?.totalPurchased ?? 0}
              icon={<Package className="h-5 w-5" />}
              colorClass="bg-brand-50 text-brand-600 dark:bg-brand-600/15 dark:text-brand-400"
              trend="Across all gyms"
              trendUp
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <StatCard
              label="Redeemed"
              value={stats?.totalUsed ?? 0}
              icon={<Users className="h-5 w-5" />}
              colorClass="bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400"
              progressValue={activationPct}
              progressColor="bg-violet-500"
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <StatCard
              label="Remaining"
              value={stats?.totalAvailable ?? 0}
              icon={<Activity className="h-5 w-5" />}
              colorClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
              trend={`${expiringSoon} members expiring soon`}
              trendUp={expiringSoon === 0}
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <StatCard
              label="Activation Rate"
              value={`${activationPct}%`}
              icon={<TrendingUp className="h-5 w-5" />}
              colorClass="bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
              progressValue={activationPct}
              progressColor={activationPct >= 70 ? "bg-emerald-500" : "bg-amber-500"}
            />
          </motion.div>
        </motion.div>

        {/* ── Charts Row ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Trend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-2"
          >
            <Card padding="md" className="h-full">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                    Activations &amp; Renewals Trend
                  </h2>
                  <p className="text-xs text-gray-400 dark:text-slate-500">
                    Monthly license activations vs renewals
                  </p>
                </div>
                <BarChart3 className="h-4 w-4 text-gray-300 dark:text-slate-600" />
              </div>
              <RechartsAreaChart data={trendData} height={200} />
            </Card>
          </motion.div>

          {/* Member Health */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
          >
            <Card padding="md" className="h-full">
              <h2 className="mb-4 text-sm font-semibold text-gray-900 dark:text-slate-100">
                Member Health
              </h2>
              <div className="flex justify-center mb-5">
                <RechartsDonut
                  value={members.length ? Math.round((activeMembers / members.length) * 100) : 0}
                  size={110}
                  color="#10b981"
                  label={`${activeMembers}`}
                  sublabel="Active"
                />
              </div>
              <div className="space-y-3">
                {[
                  { label: "Active", value: activeMembers, total: members.length, color: "bg-emerald-500" },
                  { label: "Expiring Soon", value: expiringSoon, total: members.length, color: "bg-amber-500" },
                  { label: "Expired", value: expired, total: members.length, color: "bg-red-400" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-gray-600 dark:text-slate-400">{item.label}</span>
                      <span className="font-semibold text-gray-900 dark:text-slate-100">
                        {item.value}
                        <span className="font-normal text-gray-400 dark:text-slate-500">
                          /{item.total}
                        </span>
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-slate-700">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.total ? (item.value / item.total) * 100 : 0}%` }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
                        className={`h-full rounded-full ${item.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 border-t border-gray-100 pt-4 dark:border-slate-700">
                <p className="text-xs text-gray-400 dark:text-slate-500 mb-1">Total Members</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                  {members.length}
                </p>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* ── Monthly Activations Bar ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
        >
          <Card padding="md">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-slate-100">Monthly Activations</h2>
              <p className="text-xs text-gray-400 dark:text-slate-500">New license activations per month</p>
            </div>
            <RechartsBarChart data={barData} height={160} />
          </Card>
        </motion.div>

        {/* ── Trainer Leaderboard ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32 }}
        >
        <Card padding="none">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-700">
            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                Trainer Performance
              </h2>
              <p className="text-xs text-gray-400 dark:text-slate-500">
                Ranked by members onboarded
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/owner/trainers")}
            >
              View all
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-700">
                  {["Rank", "Trainer", "Onboarded", "Active", "Renewals", "Commission"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-slate-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-700/60">
                {leaderboard.map((t, i) => (
                  <tr
                    key={t.trainerId}
                    className="group transition-colors hover:bg-gray-50 dark:hover:bg-slate-700/30"
                  >
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                          i === 0
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
                            : i === 1
                            ? "bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300"
                            : i === 2
                            ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                            : "text-gray-400 dark:text-slate-500"
                        }`}
                      >
                        {i === 0 ? <Crown className="h-3 w-3" /> : i + 1}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700 dark:bg-brand-600/20 dark:text-brand-400">
                          {t.trainerName.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-800 dark:text-slate-200">
                          {t.trainerName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 font-semibold text-gray-800 dark:text-slate-200">
                      {t.membersOnboarded}
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge variant="active">{t.activeMembers}</Badge>
                    </td>
                    <td className="px-6 py-3.5 text-gray-600 dark:text-slate-400">
                      {t.renewals}
                    </td>
                    <td className="px-6 py-3.5 font-medium text-emerald-700 dark:text-emerald-400">
                      ₹{t.commissionEarned.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        </motion.div>

        {/* ── Member Roster ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
        >
        <Card padding="none">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-700">
            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                Recent Members
              </h2>
              <p className="text-xs text-gray-400 dark:text-slate-500">
                Latest onboarded members across all gyms
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/owner/members")}
            >
              View all
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-700">
                  {["Member", "Tier", "Start Date", "End Date", "Status"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-slate-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-700/60">
                {recentMembers.map((m) => (
                  <tr
                    key={m.id}
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-slate-700/30"
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600 dark:bg-slate-700 dark:text-slate-300">
                          {m.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-slate-200">
                            {m.name}
                          </p>
                          <p className="text-[11px] text-gray-400 dark:text-slate-500">
                            {m.phone}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge variant={tierVariant(m.subscriptionTier)}>
                        {m.subscriptionTier}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5 text-gray-500 dark:text-slate-400">
                      {new Date(m.startDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-3.5 text-gray-500 dark:text-slate-400">
                      {new Date(m.endDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge variant={statusBadgeVariant(m.status)}>
                        {m.status.replace("_", " ")}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        </motion.div>
      </div>
    </div>
    </PageMotion>
  );
};
