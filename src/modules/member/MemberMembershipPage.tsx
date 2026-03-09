import React, { useEffect, useState } from "react";
import {
  Award, Calendar, CalendarCheck, CheckCircle, Clock,
  CreditCard, QrCode, RefreshCw, Shield, Tag, XCircle,
} from "lucide-react";
import { Header } from "../../layouts/Header";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Spinner } from "../../components/ui/Spinner";
import { useAuth } from "../../context/AuthContext";
import { getMemberById } from "../../services/memberService";
import type { Member } from "../../types";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}
function daysRemaining(endDate: string) {
  return Math.max(0, Math.ceil((new Date(endDate).getTime() - Date.now()) / 86400000));
}

const TIER_CONFIG = {
  basic:    { label: "Basic",    gradient: "from-blue-400 to-blue-600",     ring: "ring-blue-300" },
  standard: { label: "Standard", gradient: "from-indigo-400 to-indigo-600", ring: "ring-indigo-300" },
  premium:  { label: "Premium",  gradient: "from-purple-500 to-indigo-600", ring: "ring-purple-300" },
};
const TIER_PERKS: Record<string, string[]> = {
  basic:    ["Access to gym floor equipment", "Maintenance nutrition plan", "1 fitness assessment/month"],
  standard: ["Everything in Basic", "Weight loss nutrition plan", "2 trainer sessions/month", "Locker access"],
  premium:  ["Everything in Standard", "Muscle Gain nutrition plan", "Unlimited trainer sessions", "Priority locker + towel service", "Monthly body composition analysis"],
};
const STATUS_ICON = {
  active:        <CheckCircle className="h-4 w-4 text-emerald-500" />,
  expiring_soon: <Clock className="h-4 w-4 text-amber-500" />,
  expired:       <XCircle className="h-4 w-4 text-red-500" />,
};
const STATUS_LABEL = { active: "Active", expiring_soon: "Expiring Soon", expired: "Expired" };
const STATUS_COLOR = {
  active:        "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
  expiring_soon: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
  expired:       "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400",
};

export const MemberMembershipPage: React.FC = () => {
  const { user } = useAuth();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.memberId) { setLoading(false); return; }
    getMemberById(user.memberId).then((m) => { setMember(m); setLoading(false); });
  }, [user]);

  if (loading) return <Spinner fullPage label="Loading membership…" />;
  if (!member) return (
    <div className="flex flex-col min-h-full bg-gray-50 dark:bg-slate-950">
      <Header title="My Membership" />
      <div className="p-6"><p className="text-sm text-gray-400">No membership found.</p></div>
    </div>
  );

  const tier = TIER_CONFIG[member.subscriptionTier];
  const days = daysRemaining(member.endDate);

  return (
    <div className="flex flex-col min-h-full bg-gray-50 dark:bg-slate-950">
      <Header title="My Membership" subtitle="Subscription details & benefits" />

      <div className="p-6 space-y-5 max-w-2xl">

        {/* Digital membership card */}
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${tier.gradient} p-6 text-white shadow-xl ring-2 ${tier.ring}`}>
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="absolute right-4 bottom-4 h-20 w-20 rounded-full bg-white/5" />

          <div className="relative">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <CreditCard className="h-4 w-4" />
                </div>
                <span className="text-sm font-bold tracking-wide">AnyFeast Gym</span>
              </div>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-sm">
                {tier.label} Plan
              </span>
            </div>

            <p className="text-2xl font-bold">{member.name}</p>
            <p className="text-sm opacity-70 mt-0.5">Member ID: {member.id.toUpperCase()}</p>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div>
                <p className="text-[10px] opacity-60 uppercase tracking-wide font-semibold">Start Date</p>
                <p className="text-sm font-semibold mt-0.5">{formatDate(member.startDate)}</p>
              </div>
              <div>
                <p className="text-[10px] opacity-60 uppercase tracking-wide font-semibold">End Date</p>
                <p className="text-sm font-semibold mt-0.5">{formatDate(member.endDate)}</p>
              </div>
              <div>
                <p className="text-[10px] opacity-60 uppercase tracking-wide font-semibold">Days Left</p>
                <p className="text-sm font-semibold mt-0.5">{days} days</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLOR[member.status]}`}>
                {STATUS_ICON[member.status]}
                {STATUS_LABEL[member.status]}
              </div>
              {member.couponCode && (
                <div className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur-sm">
                  <Tag className="h-3 w-3" />
                  {member.couponCode}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: <Calendar className="h-5 w-5 text-indigo-500" />, label: "Days Remaining", val: `${days}`, bg: "bg-indigo-50 dark:bg-indigo-900/20" },
            { icon: <RefreshCw className="h-5 w-5 text-emerald-500" />, label: "Times Renewed", val: `${member.renewalCount}`, bg: "bg-emerald-50 dark:bg-emerald-900/20" },
            { icon: <Award className="h-5 w-5 text-purple-500" />, label: "Tier Level", val: tier.label, bg: "bg-purple-50 dark:bg-purple-900/20" },
          ].map((s) => (
            <div key={s.label} className={`flex flex-col items-center gap-1.5 rounded-xl p-3 text-center ${s.bg}`}>
              {s.icon}
              <p className="text-base font-bold text-gray-800 dark:text-slate-100">{s.val}</p>
              <p className="text-[10px] text-gray-500 dark:text-slate-400 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Plan perks */}
        <Card padding="none">
          <div className="border-b border-gray-100 p-4 flex items-center gap-2 dark:border-slate-700">
            <Shield className="h-4 w-4 text-indigo-500" />
            <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">{tier.label} Plan — Included Benefits</p>
            <Badge variant={member.subscriptionTier}>{member.subscriptionTier}</Badge>
          </div>
          <ul className="p-4 space-y-2.5">
            {TIER_PERKS[member.subscriptionTier].map((perk) => (
              <li key={perk} className="flex items-center gap-2.5 text-sm text-gray-700 dark:text-slate-300">
                <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
                {perk}
              </li>
            ))}
          </ul>
        </Card>

        {/* Subscription details */}
        <Card padding="none">
          <div className="border-b border-gray-100 p-4 dark:border-slate-700">
            <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">Subscription Details</p>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-slate-700/50">
            {[
              { label: "Member Name", val: member.name },
              { label: "Phone", val: member.phone },
              { label: "Gym", val: user?.gyms[0]?.name ?? "—" },
              { label: "Plan", val: `${tier.label} (${member.subscriptionTier})` },
              { label: "Start Date", val: formatDate(member.startDate) },
              { label: "End Date", val: formatDate(member.endDate) },
              { label: "Status", val: STATUS_LABEL[member.status] },
              { label: "Renewals", val: `${member.renewalCount}` },
              ...(member.couponCode ? [{ label: "Coupon Code", val: member.couponCode }] : []),
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between px-4 py-2.5">
                <p className="text-xs text-gray-500 dark:text-slate-400">{row.label}</p>
                <p className="text-xs font-semibold text-gray-800 dark:text-slate-200">{row.val}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* QR placeholder */}
        <Card padding="md">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 dark:border-slate-700">
              <QrCode className="h-8 w-8 text-gray-400 dark:text-slate-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">Digital QR Access</p>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">Show this at the gym entrance for contactless check-in. QR integration available in the full app.</p>
            </div>
          </div>
        </Card>

        {member.status !== "active" && (
          <div className={`rounded-xl border px-4 py-3 flex items-start gap-2.5 ${
            member.status === "expired"
              ? "border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-900/10"
              : "border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-900/10"
          }`}>
            <CalendarCheck className={`mt-0.5 h-4 w-4 shrink-0 ${member.status === "expired" ? "text-red-500" : "text-amber-500"}`} />
            <div>
              <p className={`text-sm font-semibold ${member.status === "expired" ? "text-red-800 dark:text-red-300" : "text-amber-800 dark:text-amber-300"}`}>
                {member.status === "expired" ? "Membership Expired" : `Expiring in ${days} days`}
              </p>
              <p className={`text-xs mt-0.5 ${member.status === "expired" ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400"}`}>
                Visit the gym front desk or contact your trainer to renew your membership.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
