/**
 * TrainerDashboard.tsx
 *
 * Main overview for trainers.
 * Shows: member KPIs (onboarded, active, expiring, renewals),
 * license progress, recent members table, and quick actions.
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  UserPlus,
  Users,
  Clock,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Tag,
} from "lucide-react";
import { getLicenseBundle } from "../../services/gymService";
import { getMembersByGym } from "../../services/memberService";
import { useGym } from "../../context/GymContext";
import { useAuth } from "../../context/AuthContext";
import { Header } from "../../layouts/Header";
import { StatCard } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Spinner } from "../../components/ui/Spinner";
import { Badge } from "../../components/ui/Badge";
import { PageMotion } from "../../components/PageMotion";
import type { LicenseBundle, Member, SubscriptionTier } from "../../types";

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

function daysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

export const TrainerDashboard: React.FC = () => {
  const { selectedGym } = useGym();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [licenseBundle, setLicenseBundle] = useState<LicenseBundle | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedGym) return;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [bundle, gymMembers] = await Promise.all([
          getLicenseBundle(selectedGym.id),
          getMembersByGym(selectedGym.id),
        ]);
        setLicenseBundle(bundle);
        setMembers(gymMembers as Member[]);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load data.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [selectedGym]);

  if (isLoading) return <Spinner fullPage label="Loading dashboard…" />;

  const activeMembers = members.filter((m) => m.status === "active").length;
  const expiringSoon  = members.filter((m) => m.status === "expiring_soon").length;
  const totalRenewals = members.reduce((s, m) => s + m.renewalCount, 0);
  const licAvail      = licenseBundle ? licenseBundle.totalLicenses - licenseBundle.usedLicenses : 0;
  const licPct        = licenseBundle ? Math.round((licenseBundle.usedLicenses / licenseBundle.totalLicenses) * 100) : 0;

  const recentMembers = [...members]
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, 6);

  return (
    <PageMotion>
      <div className="flex flex-col bg-gray-50 dark:bg-slate-950 min-h-full">
        <Header
          title={selectedGym?.name ?? "Dashboard"}
          subtitle={`Welcome back, ${user?.name}`}
          actions={
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                leftIcon={<Tag className="h-3.5 w-3.5" />}
                onClick={() => navigate("/trainer/coupons")}
              >
                Coupons
              </Button>
              <Button
                size="sm"
                leftIcon={<UserPlus className="h-3.5 w-3.5" />}
                onClick={() => navigate("/trainer/onboard")}
              >
                Onboard Member
              </Button>
            </div>
          }
        />

        <div className="p-6 space-y-6">
          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          {expiringSoon > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-700/50 dark:bg-amber-900/10"
            >
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <p className="text-sm text-amber-800 dark:text-amber-300">
                <span className="font-semibold">{expiringSoon} member{expiringSoon > 1 ? "s" : ""}</span>{" "}
                expiring soon — reach out now.
              </p>
              <button
                onClick={() => navigate("/trainer/members")}
                className="ml-auto text-xs font-semibold text-amber-700 hover:underline dark:text-amber-400"
              >
                View →
              </button>
            </motion.div>
          )}

          {/* KPI Cards */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            <motion.div variants={fadeUp}>
              <StatCard
                label="Members Onboarded"
                value={members.length}
                icon={<Users className="h-5 w-5" />}
                colorClass="bg-brand-50 text-brand-600 dark:bg-brand-600/15 dark:text-brand-400"
                trend="Total in your gym"
                trendUp
              />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatCard
                label="Active Members"
                value={activeMembers}
                icon={<CheckCircle2 className="h-5 w-5" />}
                colorClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                progressValue={members.length ? Math.round((activeMembers / members.length) * 100) : 0}
                progressColor="bg-emerald-500"
              />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatCard
                label="Expiring Soon"
                value={expiringSoon}
                icon={<Clock className="h-5 w-5" />}
                colorClass={expiringSoon > 0 ? "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" : "bg-gray-50 text-gray-500 dark:bg-slate-800 dark:text-slate-400"}
                trend={expiringSoon > 0 ? "Needs follow-up" : "All good!"}
                trendUp={expiringSoon === 0}
              />
            </motion.div>
            <motion.div variants={fadeUp}>
              <StatCard
                label="Total Renewals"
                value={totalRenewals}
                icon={<RefreshCw className="h-5 w-5" />}
                colorClass="bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400"
                trend="Across all members"
                trendUp
              />
            </motion.div>
          </motion.div>

          {/* License Progress */}
          {licenseBundle && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-slate-200">License Usage</h3>
                  <p className="text-xs text-gray-400 dark:text-slate-500">Expires: {licenseBundle.expiresAt}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900 dark:text-slate-100">
                    {licenseBundle.usedLicenses}{" "}
                    <span className="font-normal text-gray-400">/ {licenseBundle.totalLicenses}</span>
                  </p>
                  <p className="text-[11px] text-gray-400 dark:text-slate-500">{licAvail} remaining</p>
                </div>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-slate-700">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    licPct >= 90 ? "bg-red-500" : licPct >= 70 ? "bg-amber-500" : "bg-brand-500"
                  }`}
                  style={{ width: `${licPct}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-gray-400 dark:text-slate-500">
                <span>Used: {licPct}%</span>
                <span className={licAvail <= 5 ? "font-semibold text-red-500 dark:text-red-400" : ""}>
                  {licAvail <= 5 ? "⚠ Low licenses" : `${licAvail} available`}
                </span>
              </div>
            </motion.div>
          )}

          {/* Recent Members */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-slate-200">Recent Members</h3>
              <button
                onClick={() => navigate("/trainer/members")}
                className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
              >
                View all →
              </button>
            </div>

            {recentMembers.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12">
                <Users className="h-10 w-10 text-gray-300 dark:text-slate-600" />
                <p className="text-sm text-gray-400 dark:text-slate-500">
                  No members yet. Start by onboarding your first member.
                </p>
                <Button size="sm" onClick={() => navigate("/trainer/onboard")}>
                  Onboard Member
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-50 dark:border-slate-700">
                      {["Member","Phone","Plan","Start Date","End Date","Status","Days Left"].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-slate-500 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-slate-700/60">
                    {recentMembers.map((m) => {
                      const days = daysUntil(m.endDate);
                      const urgent = days >= 0 && days <= 7;
                      return (
                        <tr
                          key={m.id}
                          className={`transition-colors hover:bg-gray-50 dark:hover:bg-slate-700/30 ${urgent ? "bg-amber-50/30 dark:bg-amber-900/5" : ""}`}
                        >
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700 dark:bg-brand-600/20 dark:text-brand-400">
                                {m.name.charAt(0)}
                              </div>
                              <span className="font-medium text-gray-900 dark:text-slate-100">{m.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-gray-500 dark:text-slate-400">{m.phone}</td>
                          <td className="px-5 py-3.5">
                            <Badge variant={m.subscriptionTier as SubscriptionTier}>{m.subscriptionTier}</Badge>
                          </td>
                          <td className="px-5 py-3.5 text-gray-500 dark:text-slate-400 whitespace-nowrap">{m.startDate}</td>
                          <td className="px-5 py-3.5 text-gray-500 dark:text-slate-400 whitespace-nowrap">{m.endDate}</td>
                          <td className="px-5 py-3.5">
                            <Badge variant={m.status === "expiring_soon" ? "expiring" : (m.status as "active" | "expired")}>
                              {m.status === "expiring_soon" ? "Expiring" : m.status}
                            </Badge>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`font-semibold ${days < 0 ? "text-red-500 dark:text-red-400" : urgent ? "text-amber-600 dark:text-amber-400" : "text-gray-700 dark:text-slate-300"}`}>
                              {days < 0 ? "Expired" : `${days}d`}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </PageMotion>
  );
};
