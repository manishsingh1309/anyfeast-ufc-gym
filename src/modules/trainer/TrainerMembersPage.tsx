import React, { useEffect, useMemo, useState } from "react";
import { Search, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../layouts/Header";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Spinner } from "../../components/ui/Spinner";
import { getMembersByGym } from "../../services/memberService";
import { useGym } from "../../context/GymContext";
import type { Member, MemberStatus, SubscriptionTier } from "../../types";

const STATUS_TABS: { label: string; value: MemberStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Expiring Soon", value: "expiring_soon" },
  { label: "Expired", value: "expired" },
];

function daysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

export const TrainerMembersPage: React.FC = () => {
  const { selectedGym } = useGym();
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<MemberStatus | "all">("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!selectedGym) { setLoading(false); return; }
    getMembersByGym(selectedGym.id).then((m) => {
      setMembers(m as Member[]);
      setLoading(false);
    });
  }, [selectedGym]);

  const counts = useMemo(() => ({
    all: members.length,
    active: members.filter((m) => m.status === "active").length,
    expiring_soon: members.filter((m) => m.status === "expiring_soon").length,
    expired: members.filter((m) => m.status === "expired").length,
  }), [members]);

  const shown = useMemo(() => {
    let list = tab === "all" ? members : members.filter((m) => m.status === tab);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((m) => m.name.toLowerCase().includes(q) || m.phone.includes(q));
    }
    return list;
  }, [members, tab, query]);

  if (loading) return <Spinner fullPage label="Loading members…" />;

  if (!selectedGym) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <p className="text-gray-400 text-sm">No gym selected.</p>
      <Button onClick={() => navigate("/gym-selection")}>Select Gym</Button>
    </div>
  );

  return (
    <div className="flex flex-col bg-gray-50 dark:bg-slate-950 min-h-full">
      <Header
        title="My Members"
        subtitle={`${selectedGym.name} · ${members.length} members`}
        actions={
          <Button size="sm" onClick={() => navigate("/trainer/onboard")}>
            <UserPlus className="mr-1 h-4 w-4" />Onboard
          </Button>
        }
      />
      <div className="p-6 space-y-5">
        {counts.expiring_soon > 0 && (
          <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
            ⚠ {counts.expiring_soon} member{counts.expiring_soon > 1 ? "s" : ""} expiring soon — follow up now.
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or phone…"
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {STATUS_TABS.map((t) => (
              <button
                key={t.value}
                onClick={() => setTab(t.value)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                  tab === t.value
                    ? "bg-indigo-600 text-white dark:bg-indigo-500"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-400"
                }`}
              >
                {t.label} <span className="opacity-70">({counts[t.value]})</span>
              </button>
            ))}
          </div>
        </div>

        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-700">
                  {["Member", "Phone", "Plan", "Status", "Renewals", "Days Left"].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-slate-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-700/60">
                {shown.map((m) => {
                  const days = daysUntil(m.endDate);
                  const urgent = days >= 0 && days <= 7;
                  return (
                    <tr key={m.id} className={`transition-colors hover:bg-gray-50 dark:hover:bg-slate-700/30 ${urgent ? "bg-amber-50/50 dark:bg-amber-900/10" : ""}`}>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400">
                            {m.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-800 dark:text-slate-200">{m.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-gray-500 dark:text-slate-400">{m.phone}</td>
                      <td className="px-6 py-3.5">
                        <Badge variant={m.subscriptionTier as SubscriptionTier}>{m.subscriptionTier}</Badge>
                      </td>
                      <td className="px-6 py-3.5">
                        <Badge variant={m.status === "expiring_soon" ? "expiring" : (m.status as "active" | "expired")}>{m.status.replace("_", " ")}</Badge>
                      </td>
                      <td className="px-6 py-3.5 text-gray-600 dark:text-slate-400">{m.renewalCount}</td>
                      <td className="px-6 py-3.5">
                        <span className={`font-medium ${days < 0 ? "text-red-500 dark:text-red-400" : urgent ? "text-amber-600 dark:text-amber-400" : "text-gray-700 dark:text-slate-300"}`}>
                          {days < 0 ? "Expired" : `${days}d`}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {shown.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-3 py-14">
                <UserPlus className="h-8 w-8 text-gray-300 dark:text-slate-600" />
                <p className="text-sm text-gray-400 dark:text-slate-500">No members match your filters.</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
