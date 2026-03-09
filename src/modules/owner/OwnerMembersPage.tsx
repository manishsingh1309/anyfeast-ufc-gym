import React, { useEffect, useMemo, useState } from "react";
import { Search, Users } from "lucide-react";
import { Header } from "../../layouts/Header";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Spinner } from "../../components/ui/Spinner";
import { motion } from "framer-motion";
import { getAllMembers } from "../../services/memberService";
import { getOwnerGyms } from "../../services/gymService";
import type { Gym, Member, MemberStatus } from "../../types";

const STATUS_TABS: { label: string; value: MemberStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Expiring Soon", value: "expiring_soon" },
  { label: "Expired", value: "expired" },
];

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function daysLeft(end: string) {
  return Math.ceil((new Date(end).getTime() - Date.now()) / 86400000);
}

export const OwnerMembersPage: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [tab, setTab] = useState<MemberStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [gymFilter, setGymFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllMembers(), getOwnerGyms()]).then(([m, g]) => {
      setMembers(m);
      setGyms(g as Gym[]);
      setLoading(false);
    });
  }, []);

  const gymName = (id: string) => gyms.find((g) => g.id === id)?.name ?? id;

  const counts = useMemo(() => ({
    all: members.length,
    active: members.filter((m) => m.status === "active").length,
    expiring_soon: members.filter((m) => m.status === "expiring_soon").length,
    expired: members.filter((m) => m.status === "expired").length,
  }), [members]);

  const shown = useMemo(() => {
    let list = tab === "all" ? members : members.filter((m) => m.status === tab);
    if (gymFilter !== "all") list = list.filter((m) => m.gymId === gymFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((m) => m.name.toLowerCase().includes(q) || m.phone.includes(q));
    }
    return list;
  }, [members, tab, gymFilter, query]);

  const statusVariant = (s: MemberStatus) =>
    s === "active" ? "active" : s === "expiring_soon" ? "expiring" : "expired";

  const tierVariant = (t: string) =>
    (t === "premium" ? "premium" : t === "standard" ? "standard" : "basic") as "premium" | "standard" | "basic";

  if (loading) return <Spinner fullPage label="Loading members…" />;

  return (
    <div className="flex flex-col bg-gray-50 dark:bg-slate-950 min-h-full">
      <Header title="Member Roster" subtitle={`${members.length} total members across all gyms`} />

      <div className="p-6 space-y-5">
        {/* ── Summary Cards ───────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {[
            { label: "Total", count: counts.all, color: "bg-brand-50 text-brand-700 dark:bg-brand-600/15 dark:text-brand-400", dot: "bg-brand-500" },
            { label: "Active", count: counts.active, color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", dot: "bg-emerald-500" },
            { label: "Expiring", count: counts.expiring_soon, color: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", dot: "bg-amber-500" },
            { label: "Expired", count: counts.expired, color: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400", dot: "bg-red-400" },
          ].map((item) => (
            <div key={item.label} className={`flex items-center gap-3 rounded-xl p-4 ${item.color}`}>
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${item.dot}`} />
              <div>
                <p className="text-xl font-bold leading-none">{item.count}</p>
                <p className="mt-0.5 text-xs font-medium opacity-80">{item.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── Filters ─────────────────────────────── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Status tabs */}
          <div className="flex flex-wrap gap-1.5">
            {STATUS_TABS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setTab(value)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                  tab === value
                    ? "bg-brand-600 text-white dark:bg-brand-500"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600"
                }`}
              >
                {label}
                {value !== "all" && (
                  <span className="ml-1 opacity-70">{counts[value]}</span>
                )}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {/* Gym filter */}
            <select
              value={gymFilter}
              onChange={(e) => setGymFilter(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 shadow-sm focus:border-brand-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              <option value="all">All Gyms</option>
              {gyms.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>

            {/* Search */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name or phone…"
                className="rounded-lg border border-gray-200 bg-white pl-8 pr-3 py-1.5 text-xs text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-brand-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:placeholder:text-slate-600 w-48"
              />
            </div>
          </div>
        </div>

        {/* ── Table ───────────────────────────────── */}
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-700">
                  {["Member", "Gym", "Tier", "Start Date", "End Date", "Days Left", "Status"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-slate-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-700/60">
                {shown.map((m) => {
                  const left = daysLeft(m.endDate);
                  return (
                    <tr key={m.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-slate-700/30">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600 dark:bg-slate-700 dark:text-slate-300">
                            {m.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 dark:text-slate-200">{m.name}</p>
                            <p className="text-[11px] text-gray-400 dark:text-slate-500">{m.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 dark:text-slate-400 text-xs">
                        {gymName(m.gymId)}
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant={tierVariant(m.subscriptionTier)}>{m.subscriptionTier}</Badge>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 dark:text-slate-400 text-xs">{fmtDate(m.startDate)}</td>
                      <td className="px-5 py-3.5 text-gray-500 dark:text-slate-400 text-xs">{fmtDate(m.endDate)}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs font-semibold ${
                          left <= 0 ? "text-red-500 dark:text-red-400"
                          : left <= 7 ? "text-amber-600 dark:text-amber-400"
                          : "text-gray-600 dark:text-slate-400"
                        }`}>
                          {left <= 0 ? "Expired" : `${left}d`}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant={statusVariant(m.status)}>{m.status.replace("_", " ")}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {shown.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-16">
                <Users className="h-8 w-8 text-gray-200 dark:text-slate-700" />
                <p className="text-sm text-gray-400 dark:text-slate-600">No members found.</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
