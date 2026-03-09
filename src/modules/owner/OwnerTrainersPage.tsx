import React, { useEffect, useMemo, useState } from "react";
import { Header } from "../../layouts/Header";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Spinner } from "../../components/ui/Spinner";
import { getAllTrainers, getOwnerGyms } from "../../services/gymService";
import { getTrainerLeaderboard } from "../../services/analyticsService";
import type { Gym, Trainer, TrainerLeaderboardEntry } from "../../types";

const AVATAR_COLORS = [
  "bg-brand-100 text-brand-700 dark:bg-brand-600/20 dark:text-brand-400",
  "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
  "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400",
  "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
  "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
];

export const OwnerTrainersPage: React.FC = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [leaderboard, setLeaderboard] = useState<TrainerLeaderboardEntry[]>([]);
  const [gymFilter, setGymFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllTrainers(), getOwnerGyms(), getTrainerLeaderboard()]).then(
      ([t, g, lb]) => {
        setTrainers(t as Trainer[]);
        setGyms(g as Gym[]);
        setLeaderboard(lb as TrainerLeaderboardEntry[]);
        setLoading(false);
      }
    );
  }, []);

  const shown = useMemo(
    () => gymFilter === "all" ? trainers : trainers.filter((t) => t.gymId === gymFilter),
    [trainers, gymFilter]
  );

  const gymName = (id: string) => gyms.find((g) => g.id === id)?.name ?? id;

  const lbMap = useMemo(() => {
    const m: Record<string, TrainerLeaderboardEntry> = {};
    leaderboard.forEach((l) => { m[l.trainerId] = l; });
    return m;
  }, [leaderboard]);

  if (loading) return <Spinner fullPage label="Loading trainers…" />;

  return (
    <div className="flex flex-col bg-gray-50 dark:bg-slate-950 min-h-full">
      <Header title="Trainers" subtitle={`${trainers.length} trainers across all gyms`} />
      <div className="p-6 space-y-5">
        {/* Gym filter */}
        <div className="flex flex-wrap gap-2">
          {["all", ...gyms.map((g) => g.id)].map((id) => (
            <button
              key={id}
              onClick={() => setGymFilter(id)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                gymFilter === id
                  ? "bg-brand-600 text-white dark:bg-brand-500"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-400"
              }`}
            >
              {id === "all" ? "All Gyms" : gymName(id)}
            </button>
          ))}
        </div>

        {/* Leaderboard table */}
        <Card padding="none">
          <div className="border-b border-gray-100 px-6 py-4 dark:border-slate-700">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-slate-100">Performance Leaderboard</h2>
            <p className="text-xs text-gray-400 dark:text-slate-500">Ranked by members onboarded</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-700">
                  {["Rank", "Trainer", "Gym", "Onboarded", "Active", "Renewals", "Commission"].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-slate-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-700/60">
                {shown.map((t, i) => {
                  const lb = lbMap[t.id];
                  return (
                    <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-3.5">
                        <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                          i === 0 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
                          : i === 1 ? "bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300"
                          : i === 2 ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                          : "text-gray-400 dark:text-slate-500"
                        }`}>{i + 1}</span>
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                            {t.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 dark:text-slate-200">{t.name}</p>
                            <p className="text-[11px] text-gray-400 dark:text-slate-500">{t.email ?? t.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3.5"><Badge variant="neutral">{gymName(t.gymId)}</Badge></td>
                      <td className="px-6 py-3.5 font-semibold text-gray-800 dark:text-slate-200">
                        {lb?.membersOnboarded ?? t.membersOnboarded}
                      </td>
                      <td className="px-6 py-3.5"><Badge variant="active">{lb?.activeMembers ?? "—"}</Badge></td>
                      <td className="px-6 py-3.5 text-gray-600 dark:text-slate-400">{lb?.renewals ?? "—"}</td>
                      <td className="px-6 py-3.5 font-medium text-emerald-700 dark:text-emerald-400">
                        {lb ? `₹${lb.commissionEarned.toLocaleString("en-IN")}` : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};
