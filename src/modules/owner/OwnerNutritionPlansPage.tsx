import React, { useEffect, useState } from "react";
import { Cpu, Plus, Upload } from "lucide-react";
import { Header } from "../../layouts/Header";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import { Spinner } from "../../components/ui/Spinner";
import { getAllNutritionPlans, addNutritionPlan } from "../../services/memberService";
import { useToast } from "../../context/ToastContext";
import type { NutritionPlan, GoalType, SubscriptionTier } from "../../types";

const GOAL_VARIANT: Record<GoalType, "active" | "premium" | "neutral"> = {
  weight_loss: "active",
  muscle_gain: "premium",
  maintenance: "neutral",
};

const GOAL_LABELS: Record<GoalType, string> = {
  weight_loss: "Weight Loss",
  muscle_gain: "Muscle Gain",
  maintenance: "Maintenance",
};

const TIER_FOR_GOAL: Record<GoalType, SubscriptionTier> = {
  weight_loss: "standard",
  muscle_gain: "premium",
  maintenance: "basic",
};

const TIER_COLOR: Record<SubscriptionTier, string> = {
  basic: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  standard: "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  premium: "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

export const OwnerNutritionPlansPage: React.FC = () => {
  const { toast } = useToast();
  const [plans, setPlans] = useState<NutritionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: "", goalType: "weight_loss" as GoalType, duration: "", version: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAllNutritionPlans().then((p) => { setPlans(p as NutritionPlan[]); setLoading(false); });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.duration.trim() || !form.version.trim()) return;
    setSaving(true);
    const newPlan = await addNutritionPlan({ ...form, gymId: "gym_001" });
    setPlans((prev) => [...prev, newPlan as NutritionPlan]);
    setSaving(false);
    setModalOpen(false);
    setForm({ title: "", goalType: "weight_loss", duration: "", version: "" });
    toast.success("Nutrition plan added successfully!");
  };

  if (loading) return <Spinner fullPage label="Loading nutrition plans…" />;

  return (
    <div className="flex flex-col bg-gray-50 dark:bg-slate-950 min-h-full">
      <Header
        title="Nutrition Plans"
        subtitle={`${plans.length} plans uploaded across all gyms`}
        actions={
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            <Plus className="h-4 w-4" />
            Upload Plan
          </button>
        }
      />

      <div className="p-6">
        {/* Auto-assignment info */}
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 dark:border-indigo-900/40 dark:bg-indigo-900/10">
          <Cpu className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
          <div>
            <p className="text-sm font-semibold text-indigo-800 dark:text-indigo-300">Auto-assignment is active</p>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-0.5">
              Members receive a nutrition plan instantly when onboarded — no trainer action needed.
              <span className="mx-1 font-medium">Basic → Maintenance</span>·
              <span className="mx-1 font-medium">Standard → Weight Loss</span>·
              <span className="mx-1 font-medium">Premium → Muscle Gain</span>
            </p>
          </div>
        </div>
        {plans.length === 0 ? (
          <Card padding="md">
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Upload className="h-10 w-10 text-gray-300 dark:text-slate-600" />
              <p className="text-sm text-gray-400 dark:text-slate-500">No nutrition plans yet. Upload your first plan.</p>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((p) => (
              <Card key={p.id} padding="md" hover>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <p className="font-semibold text-sm text-gray-800 dark:text-slate-200 leading-snug">{p.title}</p>
                  <Badge variant={GOAL_VARIANT[p.goalType]}>{GOAL_LABELS[p.goalType]}</Badge>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${TIER_COLOR[TIER_FOR_GOAL[p.goalType]]}`}>
                    {TIER_FOR_GOAL[p.goalType]} tier
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                    <Cpu className="h-2.5 w-2.5" />Auto-assigned
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 dark:text-slate-400">Duration: <span className="font-medium text-gray-700 dark:text-slate-300">{p.duration}</span></p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Version: <span className="font-medium text-gray-700 dark:text-slate-300">v{p.version}</span></p>
                  <p className="text-xs text-gray-400 dark:text-slate-500">Assigned to <span className="font-semibold text-indigo-600 dark:text-indigo-400">{p.assignedCount ?? 0}</span> members</p>
                </div>
                <p className="mt-3 text-[11px] text-gray-400 dark:text-slate-500 border-t border-gray-100 dark:border-slate-700 pt-2">
                  Uploaded: {new Date(p.uploadedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Upload Nutrition Plan"
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setModalOpen(false)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:text-slate-300">
              Cancel
            </button>
            <button
              onClick={handleSubmit as unknown as React.MouseEventHandler}
              disabled={saving}
              form="plan-form"
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              <Upload className="h-4 w-4" />
              {saving ? "Saving…" : "Upload Plan"}
            </button>
          </div>
        }
      >
        <form id="plan-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-slate-300">Plan Name *</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. 12-Week Fat Loss Plan"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-slate-300">Goal Type *</label>
            <select
              value={form.goalType}
              onChange={(e) => setForm({ ...form, goalType: e.target.value as GoalType })}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="weight_loss">Weight Loss</option>
              <option value="muscle_gain">Muscle Gain</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-slate-300">Duration *</label>
              <input
                required
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                placeholder="e.g. 12 weeks"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-slate-300">Version *</label>
              <input
                required
                value={form.version}
                onChange={(e) => setForm({ ...form, version: e.target.value })}
                placeholder="e.g. 2.0"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500"
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
