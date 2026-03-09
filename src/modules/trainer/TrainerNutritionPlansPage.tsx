import React, { useEffect, useMemo, useState } from "react";
import {
  Activity, Apple, ChevronDown, ChevronUp, ClipboardList, Cpu,
  Download, Flame, Sparkles, Users, X, Zap,
} from "lucide-react";
import { Header } from "../../layouts/Header";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Spinner } from "../../components/ui/Spinner";
import { getNutritionPlansByGym, getMembersByGym } from "../../services/memberService";
import { useGym } from "../../context/GymContext";
import { useToast } from "../../context/ToastContext";
import type { GoalType, Member, NutritionPlan, SubscriptionTier } from "../../types";

// ─── Generator Engine Types ────────────────────────────────────────────────────

type DietType = "vegetarian" | "non_vegetarian" | "vegan" | "keto";
type ActivityLevel = "sedentary" | "moderate" | "active" | "intense";

interface GeneratorForm {
  memberId: string;
  goal: GoalType | "body_recomp";
  diet: DietType;
  activity: ActivityLevel;
  mealsPerDay: number;
  age: string;
  weightKg: string;
  healthNotes: string;
}

interface GeneratedPlan {
  title: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meals: { name: string; time: string; foods: string[] }[];
  tips: string[];
  duration: string;
  hydration: string;
}

// ─── Rule-Based Plan Generator ─────────────────────────────────────────────────

function generatePlan(form: GeneratorForm, memberName: string): GeneratedPlan {
  const weight = parseFloat(form.weightKg) || 70;
  const age = parseInt(form.age) || 25;
  const bmr = 10 * weight + 6.25 * 170 - 5 * age + 5;
  const activityMultiplier = { sedentary: 1.2, moderate: 1.375, active: 1.55, intense: 1.725 }[form.activity];
  const tdee = Math.round(bmr * activityMultiplier);

  let calories = tdee;
  let proteinRatio = 0.25, carbRatio = 0.5, fatRatio = 0.25;
  let duration = "8 weeks";
  let title = "";

  if (form.goal === "weight_loss") {
    calories = Math.round(tdee * 0.8);
    proteinRatio = 0.35; carbRatio = 0.35; fatRatio = 0.30;
    duration = "10 weeks"; title = `${memberName}'s Fat Loss Plan`;
  } else if (form.goal === "muscle_gain") {
    calories = Math.round(tdee * 1.15);
    proteinRatio = 0.35; carbRatio = 0.45; fatRatio = 0.20;
    duration = "12 weeks"; title = `${memberName}'s Muscle Builder Plan`;
  } else if (form.goal === "body_recomp") {
    proteinRatio = 0.40; carbRatio = 0.35; fatRatio = 0.25;
    duration = "16 weeks"; title = `${memberName}'s Body Recomp Plan`;
  } else {
    title = `${memberName}'s Maintenance Plan`; duration = "Ongoing";
  }

  if (form.diet === "keto") { carbRatio = 0.05; fatRatio = 0.70; proteinRatio = 0.25; }
  else if (form.diet === "vegan") { proteinRatio = Math.max(proteinRatio - 0.05, 0.20); carbRatio += 0.05; }

  const protein = Math.round((calories * proteinRatio) / 4);
  const carbs = Math.round((calories * carbRatio) / 4);
  const fat = Math.round((calories * fatRatio) / 9);

  const bfMap: Record<DietType, string[]> = {
    vegetarian: ["Oats with banana & chia seeds", "Besan chilla with mint chutney", "Greek yoghurt with berries & flaxseeds", "Paneer bhurji with multigrain toast"],
    non_vegetarian: ["Egg white omelette with vegetables", "Boiled eggs with whole wheat toast", "Chicken keema with roti", "Scrambled eggs with avocado"],
    vegan: ["Smoothie bowl with nuts & seeds", "Overnight oats with almond milk", "Tofu scramble with vegetables"],
    keto: ["Bulletproof coffee + scrambled eggs", "Avocado with bacon & eggs", "Paneer with mixed nuts"],
  };
  const lunchMap: Record<DietType, string[]> = {
    vegetarian: ["Dal, brown rice & sabzi", "Rajma with jeera rice", "Palak paneer with roti & salad", "Mixed veg curry with chapati"],
    non_vegetarian: ["Grilled chicken breast with quinoa & broccoli", "Fish curry with brown rice", "Chicken tikka with salad", "Egg & vegetable stir fry with rice"],
    vegan: ["Chickpea curry with brown rice", "Lentil soup with multigrain bread", "Tofu stir fry with quinoa"],
    keto: ["Grilled paneer with leafy greens", "Chicken salad with olive oil dressing", "Mutton keema with cauliflower rice"],
  };
  const dinnerMap: Record<DietType, string[]> = {
    vegetarian: ["Moong dal soup with 2 rotis", "Vegetable khichdi", "Paneer tikka with salad"],
    non_vegetarian: ["Baked salmon with steamed veggies", "Chicken soup with whole wheat bread", "Grilled fish with salad"],
    vegan: ["Vegetable tofu soup", "Chickpea salad with tahini"],
    keto: ["Grilled chicken with sautéed spinach", "Mutton keema with green veggies"],
  };
  const snackMap: Record<DietType, string[]> = {
    vegetarian: ["Handful of almonds + 1 banana", "Greek yoghurt with seeds"],
    non_vegetarian: ["2 boiled eggs + nuts", "Whey protein shake + fruits"],
    vegan: ["Almond butter + berries", "Edamame + hummus"],
    keto: ["Walnuts + cheese slice", "Avocado + seeds"],
  };
  const rnd = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  const bf = rnd(bfMap[form.diet]);
  const lunch = rnd(lunchMap[form.diet]);
  const dinner = rnd(dinnerMap[form.diet]);
  const snack = rnd(snackMap[form.diet]);

  const allMeals: { name: string; time: string; foods: string[] }[] = [
    { name: "Breakfast", time: "7:00 – 8:00 AM", foods: [bf] },
    { name: "Mid-Morning Snack", time: "10:30 AM", foods: [snack] },
    { name: "Lunch", time: "1:00 – 2:00 PM", foods: [lunch] },
    { name: "Pre-Workout Snack", time: "4:30 PM", foods: ["Banana + protein shake / 2 boiled eggs"] },
    { name: "Dinner", time: "7:30 – 8:30 PM", foods: [dinner] },
    { name: "Before Bed", time: "10:00 PM", foods: ["Casein shake / 1 cup warm milk / 5 almonds"] },
  ];
  const meals = allMeals.slice(0, form.mealsPerDay);

  const tips: string[] = [];
  if (form.goal === "weight_loss") tips.push("Maintain a calorie deficit of 300–500 kcal/day", "Prioritise protein to preserve muscle while losing fat", "Avoid liquid calories — stick to water, black coffee, green tea");
  if (form.goal === "muscle_gain") tips.push("Eat within 45 mins after training for optimal recovery", "Aim for 1.6–2.2g protein per kg body weight", "Progressive overload in training paired with this plan = maximum gains");
  if (form.goal === "maintenance") tips.push("Consistency over perfection — aim for the 80/20 rule", "Adjust calories if weight shifts by ±1 kg/week");
  if (form.goal === "body_recomp") tips.push("Cycle calories — eat more on training days, less on rest days", "High protein is non-negotiable for body recomp success");
  if (form.diet === "vegan") tips.push("Combine rice + dal or corn + beans for complete amino acid profiles");
  if (form.diet === "keto") tips.push("Electrolytes are critical — sodium, potassium, magnesium daily", "Keep carbs under 20–30g net per day to stay in ketosis");
  if (form.activity === "intense") tips.push("Include a deload week every 4th week to prevent overtraining");
  const notes = form.healthNotes.toLowerCase();
  if (notes.includes("diab")) tips.push("Monitor blood sugar regularly — favour low-GI carbs only");
  if (notes.includes("hypertension") || notes.includes(" bp")) tips.push("Limit sodium — avoid processed/packaged foods");

  const hydration = { intense: "4–5 litres/day", active: "3–4 litres/day", moderate: "2.5–3 litres/day", sedentary: "2–2.5 litres/day" }[form.activity];

  return { title, calories, protein, carbs, fat, meals, tips, duration, hydration };
}

const STEP_LABELS = ["Member & Goal", "Diet & Activity", "Your Plan"];

// ─── Generator Modal ───────────────────────────────────────────────────────────

interface GeneratorModalProps {
  members: Member[];
  onClose: () => void;
}

const GeneratorModal: React.FC<GeneratorModalProps> = ({ members, onClose }) => {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<GeneratedPlan | null>(null);
  const [form, setForm] = useState<GeneratorForm>({
    memberId: members[0]?.id ?? "",
    goal: "weight_loss",
    diet: "vegetarian",
    activity: "moderate",
    mealsPerDay: 4,
    age: "",
    weightKg: "",
    healthNotes: "",
  });

  const member = members.find((m) => m.id === form.memberId);
  const set = <K extends keyof GeneratorForm>(k: K, v: GeneratorForm[K]) => setForm((p) => ({ ...p, [k]: v }));

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 1500));
    const plan = generatePlan(form, member?.name ?? "Member");
    setResult(plan);
    toast.success(`Nutrition plan generated for ${member?.name ?? "member"}!`);
    setGenerating(false);
    setStep(2);
  };

  const chip = (active: boolean) =>
    `cursor-pointer rounded-xl border px-3 py-2 text-xs font-semibold transition-all select-none ${
      active
        ? "border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-400 dark:bg-brand-600/15 dark:text-brand-400"
        : "border-gray-200 text-gray-600 hover:border-brand-300 hover:bg-brand-50/40 dark:border-slate-700 dark:text-slate-400 dark:hover:border-brand-600"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="flex h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-slate-700 shrink-0">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-purple-600">
              <Sparkles className="h-4 w-4 text-white" />
            </span>
            <div>
              <h2 className="font-bold text-gray-800 dark:text-slate-100 leading-none">Generate Custom Plan</h2>
              <p className="text-[11px] text-gray-400 dark:text-slate-500">Personalised nutrition based on preferences</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Step indicators */}
        {!generating && (
          <div className="flex items-center px-6 pt-3 pb-2 shrink-0">
            {STEP_LABELS.map((label, i) => (
              <React.Fragment key={label}>
                <button
                  onClick={() => (i < step && step !== 2) ? setStep(i) : undefined}
                  className={`flex flex-col items-center gap-0.5 ${i < step && step !== 2 ? "cursor-pointer" : "cursor-default"}`}
                >
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    i < step ? "bg-emerald-500 text-white" : i === step ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-400 dark:bg-slate-700 dark:text-slate-500"
                  }`}>
                    {i < step ? "✓" : i + 1}
                  </div>
                  <span className={`text-[10px] font-semibold whitespace-nowrap ${
                    i === step ? "text-brand-600 dark:text-brand-400" : i < step ? "text-emerald-600 dark:text-emerald-400" : "text-gray-300 dark:text-slate-600"
                  }`}>{label}</span>
                </button>
                {i < 2 && <div className={`flex-1 h-px mx-2 mb-3 ${i < step ? "bg-emerald-400" : "bg-gray-200 dark:bg-slate-700"}`} />}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">

          {/* Step 0 */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-slate-300">Select Member</label>
                <select value={form.memberId} onChange={(e) => set("memberId", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>{m.name} ({m.subscriptionTier})</option>
                  ))}
                </select>
                {member && (
                  <div className="mt-2 flex items-center gap-2.5 rounded-xl bg-brand-50 px-3 py-2 dark:bg-brand-600/10">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-[11px] font-bold text-white">
                      {member.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-brand-700 dark:text-brand-300">{member.name}</p>
                      <p className="text-[11px] text-brand-500 dark:text-brand-400">{member.phone} · {member.subscriptionTier} plan</p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-700 dark:text-slate-300">Fitness Goal</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["weight_loss", "muscle_gain", "maintenance", "body_recomp"] as const).map((g) => (
                    <button key={g} onClick={() => set("goal", g)} className={chip(form.goal === g)}>
                      {g === "weight_loss" ? "🔥 Weight Loss" : g === "muscle_gain" ? "💪 Muscle Gain" : g === "maintenance" ? "⚖️ Maintenance" : "🔄 Recomp"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-slate-300">Age (years)</label>
                  <input type="number" min={10} max={80} value={form.age} onChange={(e) => set("age", e.target.value)}
                    placeholder="e.g. 25"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-slate-300">Weight (kg)</label>
                  <input type="number" min={30} max={200} value={form.weightKg} onChange={(e) => set("weightKg", e.target.value)}
                    placeholder="e.g. 72"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500" />
                </div>
              </div>
            </div>
          )}

          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-700 dark:text-slate-300">Dietary Preference</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["vegetarian", "non_vegetarian", "vegan", "keto"] as DietType[]).map((d) => (
                    <button key={d} onClick={() => set("diet", d)} className={chip(form.diet === d)}>
                      {d === "vegetarian" ? "🥦 Vegetarian" : d === "non_vegetarian" ? "🍗 Non-Veg" : d === "vegan" ? "🌱 Vegan" : "🥑 Keto"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-700 dark:text-slate-300">Activity Level</label>
                <div className="space-y-2">
                  {([
                    { val: "sedentary" as ActivityLevel, label: "Sedentary", desc: "Little to no exercise" },
                    { val: "moderate" as ActivityLevel, label: "Moderate", desc: "3–5 days/week light exercise" },
                    { val: "active" as ActivityLevel, label: "Active", desc: "5–6 days/week moderate training" },
                    { val: "intense" as ActivityLevel, label: "Very Active", desc: "Daily intense training / physical job" },
                  ]).map(({ val, label, desc }) => (
                    <button key={val} onClick={() => set("activity", val)}
                      className={`flex w-full items-center justify-between rounded-xl border px-4 py-2.5 text-left transition-all ${
                        form.activity === val
                          ? "border-brand-500 bg-brand-50 dark:border-brand-400 dark:bg-brand-600/15"
                          : "border-gray-200 hover:border-brand-300 dark:border-slate-700 dark:hover:border-brand-600"
                      }`}>
                      <div>
                        <p className={`text-xs font-semibold ${form.activity === val ? "text-brand-700 dark:text-brand-400" : "text-gray-700 dark:text-slate-300"}`}>{label}</p>
                        <p className="text-[11px] text-gray-400 dark:text-slate-500">{desc}</p>
                      </div>
                      <div className={`h-4 w-4 rounded-full border-2 transition-colors ${form.activity === val ? "border-brand-500 bg-brand-500" : "border-gray-300 dark:border-slate-600"}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-700 dark:text-slate-300">
                  Meals per day — <span className="text-brand-600 dark:text-brand-400 font-bold">{form.mealsPerDay} meals</span>
                </label>
                <input type="range" min={3} max={6} step={1} value={form.mealsPerDay}
                  onChange={(e) => set("mealsPerDay", parseInt(e.target.value))}
                  className="w-full accent-brand-600" />
                <div className="mt-1 flex justify-between text-[10px] text-gray-400 dark:text-slate-500">
                  <span>3</span><span>4</span><span>5</span><span>6</span>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-slate-300">Health Notes / Conditions <span className="text-gray-400 font-normal">(optional)</span></label>
                <textarea value={form.healthNotes} onChange={(e) => set("healthNotes", e.target.value)} rows={2}
                  placeholder="e.g. diabetes, hypertension, lactose intolerant, knee injury…"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500" />
              </div>
            </div>
          )}

          {/* Step 2 — Result */}
          {step === 2 && result && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 p-4 text-white">
                <p className="text-[11px] font-semibold opacity-70 mb-0.5 uppercase tracking-wide">Generated Plan</p>
                <p className="text-base font-bold leading-snug">{result.title}</p>
                <p className="text-xs opacity-70 mt-1">Duration: {result.duration} · 💧 {result.hydration}/day</p>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { icon: <Flame className="h-3.5 w-3.5 text-orange-500" />, label: "Calories", val: `${result.calories}`, sub: "kcal", bg: "bg-orange-50 dark:bg-orange-900/20" },
                  { icon: <Zap className="h-3.5 w-3.5 text-brand-500" />, label: "Protein", val: `${result.protein}g`, sub: "/day", bg: "bg-brand-50 dark:bg-brand-600/10" },
                  { icon: <Apple className="h-3.5 w-3.5 text-green-500" />, label: "Carbs", val: `${result.carbs}g`, sub: "/day", bg: "bg-green-50 dark:bg-green-900/20" },
                  { icon: <Activity className="h-3.5 w-3.5 text-amber-500" />, label: "Fat", val: `${result.fat}g`, sub: "/day", bg: "bg-amber-50 dark:bg-amber-900/20" },
                ].map((m) => (
                  <div key={m.label} className={`flex flex-col items-center rounded-xl p-2.5 gap-0.5 ${m.bg}`}>
                    {m.icon}
                    <p className="text-xs font-bold text-gray-800 dark:text-slate-100">{m.val}</p>
                    <p className="text-[9px] text-gray-500 dark:text-slate-400 text-center">{m.label}</p>
                  </div>
                ))}
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold text-gray-700 dark:text-slate-300">Daily Meal Schedule</p>
                <div className="space-y-2">
                  {result.meals.map((meal, i) => (
                    <div key={i} className="rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-semibold text-gray-800 dark:text-slate-200">{meal.name}</p>
                        <span className="text-[10px] text-gray-400 dark:text-slate-500">{meal.time}</span>
                      </div>
                      {meal.foods.map((f, fi) => (
                        <p key={fi} className="text-xs text-gray-600 dark:text-slate-400">• {f}</p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {result.tips.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-semibold text-gray-700 dark:text-slate-300">Expert Tips</p>
                  <ul className="space-y-1.5">
                    {result.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-slate-400">
                        <span className="mt-px shrink-0 text-brand-500">✦</span>{tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Generating loader */}
          {generating && (
            <div className="flex flex-col items-center justify-center gap-4 py-20">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-brand-100 border-t-brand-500 animate-spin dark:border-slate-700 dark:border-t-brand-400" />
                <Sparkles className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-brand-500 animate-pulse" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">Building personalised plan…</p>
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">Calculating macros, meals & expert tips</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-gray-100 px-6 py-4 dark:border-slate-700">
          {step === 0 && !generating && (
            <button onClick={() => setStep(1)} disabled={!form.memberId}
              className="w-full rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50 transition-colors dark:bg-brand-500 dark:hover:bg-brand-600">
              Next: Diet & Activity →
            </button>
          )}
          {step === 1 && !generating && (
            <div className="flex gap-3">
              <button onClick={() => setStep(0)} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-slate-700 dark:text-slate-400">← Back</button>
              <button onClick={handleGenerate}
                className="flex flex-[2] items-center justify-center gap-2 rounded-xl bg-brand-gradient py-2.5 text-sm font-semibold text-white hover:shadow-brand shadow-brand-sm transition-all">
                <Sparkles className="h-4 w-4" /> Generate Plan
              </button>
            </div>
          )}
          {step === 2 && !generating && (
            <div className="flex gap-3">
              <button onClick={() => { setResult(null); setStep(1); }}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-slate-700 dark:text-slate-400">← Re-generate</button>
              <button onClick={onClose}
                className="flex flex-[2] items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 transition-colors">
                <Download className="h-4 w-4" /> Save & Share with Member
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Display Constants ─────────────────────────────────────────────────────────

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
const GOAL_TO_TIER: Record<GoalType, SubscriptionTier> = {
  weight_loss: "standard",
  muscle_gain: "premium",
  maintenance: "basic",
};
const TIER_COLOR: Record<SubscriptionTier, string> = {
  basic: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  standard: "bg-brand-50 text-brand-700 dark:bg-brand-600/15 dark:text-brand-400",
  premium: "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

// ─── PlanCard ──────────────────────────────────────────────────────────────────

interface PlanCardProps { plan: NutritionPlan; planMembers: Member[]; }

const PlanCard: React.FC<PlanCardProps> = ({ plan, planMembers }) => {
  const [expanded, setExpanded] = useState(false);
  const tier = GOAL_TO_TIER[plan.goalType];
  return (
    <Card padding="none" hover>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="min-w-0">
            <p className="font-semibold text-sm text-gray-800 dark:text-slate-200 leading-snug mb-1">{plan.title}</p>
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant={GOAL_VARIANT[plan.goalType]}>{GOAL_LABELS[plan.goalType]}</Badge>
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${TIER_COLOR[tier]}`}>{tier} tier</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                <Cpu className="h-2.5 w-2.5" />Auto-assigned
              </span>
            </div>
          </div>
        </div>
        <div className="space-y-1 mb-4">
          <p className="text-xs text-gray-500 dark:text-slate-400">Duration: <span className="font-medium text-gray-700 dark:text-slate-300">{plan.duration}</span></p>
          <p className="text-xs text-gray-500 dark:text-slate-400">Version: <span className="font-medium text-gray-700 dark:text-slate-300">v{plan.version}</span></p>
        </div>
        <button onClick={() => setExpanded((v) => !v)}
          className="flex w-full items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:bg-slate-700/40 dark:text-slate-400 dark:hover:bg-slate-700/70 transition-colors">
          <span className="flex items-center gap-2"><Users className="h-3.5 w-3.5" />{planMembers.length} member{planMembers.length !== 1 ? "s" : ""} on this plan</span>
          {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>
      {expanded && (
        <div className="border-t border-gray-100 dark:border-slate-700">
          {planMembers.length === 0 ? (
            <p className="px-5 py-4 text-xs text-gray-400 dark:text-slate-500">No members assigned yet.</p>
          ) : (
            <ul className="divide-y divide-gray-50 dark:divide-slate-700/50">
              {planMembers.map((m) => (
                <li key={m.id} className="flex items-center justify-between px-5 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[11px] font-bold text-brand-700 dark:bg-brand-600/20 dark:text-brand-400">
                      {m.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-700 dark:text-slate-300">{m.name}</p>
                      <p className="text-[11px] text-gray-400 dark:text-slate-500">{m.phone}</p>
                    </div>
                  </div>
                  <Badge variant={m.subscriptionTier}>{m.subscriptionTier}</Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Card>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────

export const TrainerNutritionPlansPage: React.FC = () => {
  const { selectedGym } = useGym();
  const [plans, setPlans] = useState<NutritionPlan[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatorOpen, setGeneratorOpen] = useState(false);

  useEffect(() => {
    if (!selectedGym) { setLoading(false); return; }
    Promise.all([getNutritionPlansByGym(selectedGym.id), getMembersByGym(selectedGym.id)]).then(
      ([p, m]) => { setPlans(p as NutritionPlan[]); setMembers(m as Member[]); setLoading(false); }
    );
  }, [selectedGym]);

  const membersByPlan = useMemo(() => {
    const map: Record<string, Member[]> = {};
    members.forEach((m) => {
      if (m.nutritionPlanId) {
        if (!map[m.nutritionPlanId]) map[m.nutritionPlanId] = [];
        map[m.nutritionPlanId].push(m);
      }
    });
    return map;
  }, [members]);

  const activeMembers = useMemo(() => members.filter((m) => m.status === "active"), [members]);

  if (loading) return <Spinner fullPage label="Loading nutrition plans…" />;

  return (
    <div className="flex flex-col bg-gray-50 dark:bg-slate-950 min-h-full">
      <Header
        title="Nutrition Plans"
        subtitle={selectedGym ? `${selectedGym.name} · auto-assigned by tier` : undefined}
        actions={
          <button onClick={() => setGeneratorOpen(true)} disabled={activeMembers.length === 0}
            className="flex items-center gap-2 rounded-xl bg-brand-gradient px-4 py-2 text-sm font-semibold text-white shadow-brand-sm hover:shadow-brand disabled:opacity-50 transition-all">
            <Sparkles className="h-4 w-4" /> Generate Custom Plan
          </button>
        }
      />

      <div className="p-6 space-y-5">
        <div className="flex items-start gap-3 rounded-xl border border-brand-100 bg-brand-50 px-4 py-3 dark:border-brand-600/20 dark:bg-brand-600/10">
          <Cpu className="mt-0.5 h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" />
          <div>
            <p className="text-sm font-semibold text-brand-700 dark:text-brand-300">Plans are assigned automatically</p>
            <p className="text-xs text-brand-600 dark:text-brand-400 mt-0.5">
              Every member gets a plan instantly when onboarded based on their tier.
              <span className="mx-1 font-medium">Basic → Maintenance</span>·
              <span className="mx-1 font-medium">Standard → Weight Loss</span>·
              <span className="mx-1 font-medium">Premium → Muscle Gain</span>
              · Use <span className="font-semibold">Generate Custom Plan</span> to create a detailed personalised plan for any member based on their diet preferences, goals, and body stats.
            </p>
          </div>
        </div>

        {/* Prominent Generate CTA */}
        <div className="flex items-center justify-between rounded-2xl border border-dashed border-brand-300 bg-gradient-to-br from-brand-50 to-orange-50 px-5 py-4 dark:border-brand-600/30 dark:from-brand-600/10 dark:to-orange-900/10">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 shadow-md">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800 dark:text-slate-200">Generate a Custom Nutrition Plan</p>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Pick a member, set their diet & goals — get a full daily meal plan with calorie & macro targets instantly.</p>
            </div>
          </div>
          <button
            onClick={() => setGeneratorOpen(true)}
            disabled={activeMembers.length === 0}
            className="ml-4 flex shrink-0 items-center gap-2 rounded-xl bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-brand hover:shadow-brand-lg disabled:opacity-50 transition-all"
          >
            <Sparkles className="h-4 w-4" /> Generate Plan
          </button>
        </div>

        {plans.length === 0 ? (
          <Card padding="md">
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <ClipboardList className="h-10 w-10 text-gray-300 dark:text-slate-600" />
              <p className="text-sm text-gray-400 dark:text-slate-500">No nutrition plans for this gym yet.</p>
              <button onClick={() => setGeneratorOpen(true)} disabled={activeMembers.length === 0}
                className="mt-1 flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700 disabled:opacity-50 transition-colors">
                <Sparkles className="h-3.5 w-3.5" /> Generate First Plan
              </button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((p) => (
              <PlanCard key={p.id} plan={p} planMembers={membersByPlan[p.id] ?? []} />
            ))}
          </div>
        )}
      </div>

      {generatorOpen && (
        <GeneratorModal members={activeMembers} onClose={() => setGeneratorOpen(false)} />
      )}
    </div>
  );
};


