import React, { useEffect, useState } from "react";
import {
  Activity, ArrowRight, Award, Calendar, CalendarCheck, CheckCircle,
  ChevronRight, Clock, CreditCard, Flame, RefreshCw, Shield, Utensils,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../layouts/Header";
import { Card } from "../../components/ui/Card";
import { Spinner } from "../../components/ui/Spinner";
import { useAuth } from "../../context/AuthContext";
import { getMemberById, getNutritionPlanById } from "../../services/memberService";
import type { Member, NutritionPlan } from "../../types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function daysRemaining(endDate: string): number {
  const end = new Date(endDate);
  const now = new Date();
  return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}
function daysTotal(startDate: string, endDate: string): number {
  const s = new Date(startDate), e = new Date(endDate);
  return Math.max(1, Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)));
}
function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

const TIER_CONFIG = {
  basic:    { label: "Basic",    color: "from-blue-400 to-blue-600",  badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300" },
  standard: { label: "Standard", color: "from-brand-400 to-brand-600", badge: "bg-brand-100 text-brand-700 dark:bg-brand-600/20 dark:text-brand-300" },
  premium:  { label: "Premium",  color: "from-purple-500 to-brand-600", badge: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300" },
};
const GOAL_LABELS: Record<string, string> = {
  weight_loss: "Weight Loss",
  muscle_gain: "Muscle Gain",
  maintenance: "Maintenance",
};
const STATUS_CONFIG = {
  active:        { label: "Active",         color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  expiring_soon: { label: "Expiring Soon",  color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  expired:       { label: "Expired",        color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
};

// ─── Component ────────────────────────────────────────────────────────────────

export const MemberDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [member, setMember] = useState<Member | null>(null);
  const [plan, setPlan] = useState<NutritionPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.memberId) { setLoading(false); return; }
    getMemberById(user.memberId).then(async (m) => {
      setMember(m);
      if (m?.nutritionPlanId) {
        const p = await getNutritionPlanById(m.nutritionPlanId);
        setPlan(p);
      }
      setLoading(false);
    });
  }, [user]);

  if (loading) return <Spinner fullPage label="Loading your dashboard…" />;
  if (!member) return (
    <div className="flex flex-col min-h-full bg-gray-50 dark:bg-slate-950">
      <Header title="My Dashboard" />
      <div className="p-6 flex items-center justify-center flex-1">
        <p className="text-sm text-gray-400">Member account not found. Please contact your trainer.</p>
      </div>
    </div>
  );

  const tier = TIER_CONFIG[member.subscriptionTier];
  const status = STATUS_CONFIG[member.status];
  const days = daysRemaining(member.endDate);
  const total = daysTotal(member.startDate, member.endDate);
  const progress = Math.min(100, Math.round(((total - days) / total) * 100));

  return (
    <div className="flex flex-col min-h-full bg-gray-50 dark:bg-slate-950">
      <Header
        title="My Dashboard"
        subtitle={`Welcome back, ${member.name.split(" ")[0]} 👋`}
      />

      <div className="p-6 space-y-5 max-w-4xl">

        {/* Membership card */}
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${tier.color} p-6 text-white shadow-lg`}>
          <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/10" />
          <div className="absolute -right-2 bottom-0 h-24 w-24 rounded-full bg-white/5" />
          <div className="relative flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-widest opacity-80">AnyFeast Gym</p>
              <p className="text-2xl font-bold tracking-tight">{member.name}</p>
              <p className="text-sm opacity-80">{user?.gyms[0]?.name ?? "FitZone"}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-sm">{tier.label}</span>
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${status.color}`}>{status.label}</span>
            </div>
          </div>

          <div className="relative mt-5">
            <div className="mb-1.5 flex items-center justify-between text-xs opacity-80">
              <span>Membership progress</span>
              <span>{days} days remaining</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/20">
              <div className="h-1.5 rounded-full bg-white transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs opacity-70">
              <span>Start: {formatDate(member.startDate)}</span>
              <span>End: {formatDate(member.endDate)}</span>
            </div>
          </div>

          {member.couponCode && (
            <div className="relative mt-4 flex items-center gap-2 rounded-xl bg-white/15 px-3 py-2 backdrop-blur-sm">
              <Shield className="h-4 w-4 shrink-0 opacity-80" />
              <div>
                <p className="text-[10px] opacity-70 font-medium uppercase tracking-wide">Coupon Code</p>
                <p className="text-sm font-bold tracking-widest">{member.couponCode}</p>
              </div>
            </div>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: <Calendar className="h-5 w-5 text-brand-500" />, label: "Days Left", val: days.toString(), bg: "bg-brand-50 dark:bg-brand-600/10" },
            { icon: <RefreshCw className="h-5 w-5 text-emerald-500" />, label: "Renewals", val: member.renewalCount.toString(), bg: "bg-emerald-50 dark:bg-emerald-900/20" },
            { icon: <Award className="h-5 w-5 text-purple-500" />, label: "Tier", val: tier.label, bg: "bg-purple-50 dark:bg-purple-900/20" },
            { icon: <Flame className="h-5 w-5 text-orange-500" />, label: "Goal", val: GOAL_LABELS[member.goalType ?? "maintenance"] ?? "—", bg: "bg-orange-50 dark:bg-orange-900/20" },
          ].map((s) => (
            <div key={s.label} className={`flex flex-col items-center justify-center gap-1 rounded-xl p-3 text-center ${s.bg}`}>
              {s.icon}
              <p className="text-base font-bold text-gray-800 dark:text-slate-100 leading-none mt-1">{s.val}</p>
              <p className="text-[10px] font-medium text-gray-500 dark:text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid gap-3 sm:grid-cols-2">
          <button onClick={() => navigate("/member/membership")}
            className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 text-left hover:border-brand-300 hover:shadow-md transition-all dark:border-slate-700 dark:bg-slate-800 dark:hover:border-brand-600 group">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-600/15">
                <CreditCard className="h-5 w-5 text-brand-600 dark:text-brand-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">My Membership</p>
                <p className="text-xs text-gray-400 dark:text-slate-500">Details & renewal info</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-brand-500 transition-colors" />
          </button>

          <button onClick={() => navigate("/member/nutrition")}
            className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 text-left hover:border-emerald-300 hover:shadow-md transition-all dark:border-slate-700 dark:bg-slate-800 dark:hover:border-emerald-600 group">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/30">
                <Utensils className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">My Nutrition Plan</p>
                <p className="text-xs text-gray-400 dark:text-slate-500">View & generate custom plan</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-emerald-500 transition-colors" />
          </button>
        </div>

        {/* Active plan preview */}
        {plan && (
          <Card padding="none">
            <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex items-center gap-2">
              <Activity className="h-4 w-4 text-brand-500" />
              <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">Your Assigned Nutrition Plan</p>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">{plan.title}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-500 dark:text-slate-400">Goal: <span className="font-medium text-gray-700 dark:text-slate-300">{GOAL_LABELS[plan.goalType]}</span></span>
                  <span className="text-gray-300 dark:text-slate-600">·</span>
                  <span className="text-xs text-gray-500 dark:text-slate-400">Duration: <span className="font-medium text-gray-700 dark:text-slate-300">{plan.duration}</span></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Auto-assigned to your account</span>
                </div>
              </div>
              <button onClick={() => navigate("/member/nutrition")}
                className="flex items-center gap-1 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-100 dark:bg-brand-600/15 dark:text-brand-400 dark:hover:bg-brand-600/25 transition-colors">
                View <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </Card>
        )}

        {/* Status alert */}
        {member.status === "expiring_soon" && (
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800/40 dark:bg-amber-900/10">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Membership expiring soon</p>
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">Your membership expires in {days} days. Contact your trainer at the gym to renew.</p>
            </div>
          </div>
        )}
        {member.status === "expired" && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-800/40 dark:bg-red-900/10">
            <CalendarCheck className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
            <div>
              <p className="text-sm font-semibold text-red-800 dark:text-red-300">Membership expired</p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">Your membership has expired. Visit your gym to renew and regain full access.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
