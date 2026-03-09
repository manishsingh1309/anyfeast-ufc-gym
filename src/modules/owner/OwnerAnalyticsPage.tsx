import React, { useEffect, useState } from "react";
import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react";
import { Header } from "../../layouts/Header";
import { Card, StatCard } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Spinner } from "../../components/ui/Spinner";
import { RechartsAreaChart } from "../../components/dashboard/RechartsAreaChart";
import { PageMotion } from "../../components/PageMotion";
import { getAnalyticsSummary, getMonthlyData, getTrainerLeaderboard } from "../../services/analyticsService";
import type { AnalyticsSummary, MonthlyDataPoint, TrainerLeaderboardEntry } from "../../types";

const AVATAR_COLORS = [
  "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400",
  "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
  "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400",
  "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
  "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
];

export const OwnerAnalyticsPage: React.FC = () => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [monthly, setMonthly] = useState<MonthlyDataPoint[]>([]);
  const [leaderboard, setLeaderboard] = useState<TrainerLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAnalyticsSummary(), getMonthlyData(), getTrainerLeaderboard()]).then(
      ([s, m, l]) => {
        setSummary(s as AnalyticsSummary);
        setMonthly(m as MonthlyDataPoint[]);
        setLeaderboard(l as TrainerLeaderboardEntry[]);
        setLoading(false);
      }
    );
  }, []);

  if (loading) return <Spinner fullPage label="Loading analytics…" />;

  return (
    <PageMotion>
    <div className="flex flex-col bg-gray-50 dark:bg-slate-950 min-h-full">
      <Header title="Analytics" subtitle="Platform performance overview" />
      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            label="Activation Rate"
            value={`${summary!.activationRate}%`}
            icon={<BarChart3 className="h-5 w-5" />}
            trend="↑ vs last month"
            trendUp
            progressValue={summary!.activationRate}
            progressColor="bg-indigo-500"
          />
          <StatCard
            label="Renewal Rate"
            value={`${summary!.renewalRate}%`}
            icon={<TrendingUp className="h-5 w-5" />}
            trend="↑ vs last month"
            trendUp
            progressValue={summary!.renewalRate}
            progressColor="bg-emerald-500"
          />
          <StatCard
            label="Avg Members / Trainer"
            value={summary!.avgMembersPerTrainer.toFixed(1)}
            icon={<Users className="h-5 w-5" />}
          />
          <StatCard
            label="Total Revenue"
            value={`₹${(summary!.totalRevenue / 100000).toFixed(1)}L`}
            icon={<DollarSign className="h-5 w-5" />}
            trend="↑ this quarter"
            trendUp
          />
        </div>

        {/* Trend Chart */}
        <Card padding="md">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-slate-200 mb-4">Activations &amp; Renewals Trend</h2>
          <RechartsAreaChart data={monthly.map((d) => ({ label: d.month, activations: d.activations, renewals: d.renewals }))} height={220} />
        </Card>

        {/* Trainer Leaderboard */}
        <Card padding="none">
          <div className="border-b border-gray-100 px-6 py-4 dark:border-slate-700">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-slate-100">Trainer Leaderboard</h2>
            <p className="text-xs text-gray-400 dark:text-slate-500">Ranked by members onboarded</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-700">
                  {["Rank", "Trainer", "Onboarded", "Active", "Renewals", "Commission"].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-700/60">
                {leaderboard.map((entry, i) => (
                  <tr key={entry.trainerId} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        i === 0 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
                        : i === 1 ? "bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300"
                        : i === 2 ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                        : "text-gray-400 dark:text-slate-500"
                      }`}>{i + 1}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                          {entry.trainerName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800 dark:text-slate-200">{entry.trainerName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 font-semibold text-gray-800 dark:text-slate-200">{entry.membersOnboarded}</td>
                    <td className="px-6 py-3.5"><Badge variant="active">{entry.activeMembers}</Badge></td>
                    <td className="px-6 py-3.5 text-gray-600 dark:text-slate-400">{entry.renewals}</td>
                    <td className="px-6 py-3.5 font-medium text-emerald-700 dark:text-emerald-400">
                      ₹{entry.commissionEarned.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
    </PageMotion>
  );
};

