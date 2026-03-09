import React, { useEffect, useState } from "react";
import {
  Activity, Apple, CheckCircle, Cpu, Download, Flame,
  Sparkles, X, Zap,
} from "lucide-react";
import { Header } from "../../layouts/Header";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Spinner } from "../../components/ui/Spinner";
import { useAuth } from "../../context/AuthContext";
import { getMemberById, getNutritionPlanById } from "../../services/memberService";
import type { GoalType, Member, NutritionPlan } from "../../types";

// ─── Generator Engine (self-contained, no member picker needed) ────────────────

type DietType = "vegetarian" | "non_vegetarian" | "vegan" | "keto";
type ActivityLevel = "sedentary" | "moderate" | "active" | "intense";

interface GenForm {
  goal: GoalType | "body_recomp";
  diet: DietType;
  activity: ActivityLevel;
  mealsPerDay: number;
  age: string;
  weightKg: string;
  healthNotes: string;
}

interface GenResult {
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

function generate(form: GenForm, name: string): GenResult {
  const w = parseFloat(form.weightKg) || 70;
  const a = parseInt(form.age) || 25;
  const bmr = 10 * w + 6.25 * 170 - 5 * a + 5;
  const mult = { sedentary: 1.2, moderate: 1.375, active: 1.55, intense: 1.725 }[form.activity];
  const tdee = Math.round(bmr * mult);

  let cal = tdee, pR = 0.25, cR = 0.5, fR = 0.25, dur = "8 weeks", title = "";
  if (form.goal === "weight_loss")  { cal = Math.round(tdee * 0.8);  pR = 0.35; cR = 0.35; fR = 0.30; dur = "10 weeks"; title = `${name}'s Fat Loss Plan`; }
  else if (form.goal === "muscle_gain") { cal = Math.round(tdee * 1.15); pR = 0.35; cR = 0.45; fR = 0.20; dur = "12 weeks"; title = `${name}'s Muscle Builder`; }
  else if (form.goal === "body_recomp") { pR = 0.40; cR = 0.35; fR = 0.25; dur = "16 weeks"; title = `${name}'s Recomp Plan`; }
  else { title = `${name}'s Maintenance Plan`; dur = "Ongoing"; }

  if (form.diet === "keto")  { cR = 0.05; fR = 0.70; pR = 0.25; }
  if (form.diet === "vegan") { pR = Math.max(pR - 0.05, 0.20); cR += 0.05; }

  const protein = Math.round((cal * pR) / 4);
  const carbs   = Math.round((cal * cR) / 4);
  const fat      = Math.round((cal * fR) / 9);

  const bfOpts: Record<DietType, string[]> = {
    vegetarian:     ["Oats with banana & chia seeds", "Besan chilla with mint chutney", "Paneer bhurji with multigrain toast"],
    non_vegetarian: ["Egg white omelette with veggies", "Boiled eggs + whole wheat toast", "Scrambled eggs with avocado"],
    vegan:          ["Smoothie bowl with nuts & seeds", "Overnight oats with almond milk"],
    keto:           ["Bulletproof coffee + scrambled eggs", "Avocado with cheese & eggs"],
  };
  const lunchOpts: Record<DietType, string[]> = {
    vegetarian:     ["Dal, brown rice & sabzi", "Rajma with jeera rice", "Palak paneer with roti"],
    non_vegetarian: ["Grilled chicken + quinoa & broccoli", "Fish curry with brown rice"],
    vegan:          ["Chickpea curry with brown rice", "Tofu stir fry with quinoa"],
    keto:           ["Grilled paneer with leafy greens", "Chicken salad with olive oil dressing"],
  };
  const dinnerOpts: Record<DietType, string[]> = {
    vegetarian:     ["Moong dal soup with 2 rotis", "Vegetable khichdi"],
    non_vegetarian: ["Baked salmon with steamed veggies", "Grilled chicken + salad"],
    vegan:          ["Vegetable tofu soup", "Chickpea salad"],
    keto:           ["Grilled chicken + sautéed spinach", "Mutton keema with veggies"],
  };
  const snackOpts: Record<DietType, string[]> = {
    vegetarian:     ["Almonds + 1 banana", "Greek yoghurt with seeds"],
    non_vegetarian: ["2 boiled eggs + nuts", "Whey shake + fruits"],
    vegan:          ["Almond butter + berries", "Edamame + hummus"],
    keto:           ["Walnuts + cheese slice", "Avocado + seeds"],
  };
  const r = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  const allMeals = [
    { name: "Breakfast",          time: "7:00 – 8:00 AM", foods: [r(bfOpts[form.diet])] },
    { name: "Mid-Morning Snack",  time: "10:30 AM",       foods: [r(snackOpts[form.diet])] },
    { name: "Lunch",              time: "1:00 – 2:00 PM", foods: [r(lunchOpts[form.diet])] },
    { name: "Pre-Workout Snack",  time: "4:30 PM",        foods: ["Banana + protein shake / 2 boiled eggs"] },
    { name: "Dinner",             time: "7:30 – 8:30 PM", foods: [r(dinnerOpts[form.diet])] },
    { name: "Before Bed",         time: "10:00 PM",       foods: ["Casein shake / 1 cup warm milk / 5 almonds"] },
  ];
  const meals = allMeals.slice(0, form.mealsPerDay);

  const tips: string[] = [];
  if (form.goal === "weight_loss")  tips.push("Maintain a 300–500 kcal deficit daily", "Prioritise protein to preserve muscle mass");
  if (form.goal === "muscle_gain")  tips.push("Eat within 45 mins after training", "Aim for 1.6–2.2g protein per kg body weight");
  if (form.goal === "maintenance")  tips.push("Follow the 80/20 rule — consistent beats perfect");
  if (form.goal === "body_recomp")  tips.push("Eat more on training days, less on rest days");
  if (form.diet === "vegan")        tips.push("Combine rice + dal for complete amino acid profiles");
  if (form.diet === "keto")         tips.push("Keep net carbs under 20–30g/day", "Supplement electrolytes daily");
  if (form.activity === "intense")  tips.push("Take a deload week every 4th week");
  const notes = form.healthNotes.toLowerCase();
  if (notes.includes("diab"))                           tips.push("Favour low-GI carbs, monitor blood sugar regularly");
  if (notes.includes("hypertension") || notes.includes(" bp")) tips.push("Limit sodium — avoid processed foods");

  const hydration = { intense: "4–5 L/day", active: "3–4 L/day", moderate: "2.5–3 L/day", sedentary: "2–2.5 L/day" }[form.activity];
  return { title, calories: cal, protein, carbs, fat, meals, tips, duration: dur, hydration };
}

const STEP_LABELS = ["Your Preferences", "Diet & Activity", "Your Custom Plan"];

// ─── Generator Modal ───────────────────────────────────────────────────────────

interface GenModalProps {
  memberName: string;
  defaultGoal?: GoalType;
  onClose: () => void;
}

const GenModal: React.FC<GenModalProps> = ({ memberName, defaultGoal, onClose }) => {
  const [step, setStep] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<GenResult | null>(null);
  const [form, setForm] = useState<GenForm>({
    goal: defaultGoal ?? "weight_loss",
    diet: "vegetarian",
    activity: "moderate",
    mealsPerDay: 4,
    age: "",
    weightKg: "",
    healthNotes: "",
  });
  const set = <K extends keyof GenForm>(k: K, v: GenForm[K]) => setForm((p) => ({ ...p, [k]: v }));

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 1500));
    setResult(generate(form, memberName));
    setGenerating(false);
    setStep(2);
  };

  const chip = (active: boolean) =>
    `cursor-pointer rounded-xl border px-3 py-2 text-xs font-semibold transition-all select-none ${
      active
        ? "border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-400 dark:bg-brand-600/15 dark:text-brand-400"
        : "border-gray-200 text-gray-600 hover:border-brand-300 hover:bg-brand-50/40 dark:border-slate-700 dark:text-slate-400"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="flex h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-purple-600">
              <Sparkles className="h-4 w-4 text-white" />
            </span>
            <div>
              <h2 className="font-bold text-gray-800 dark:text-slate-100 leading-none">Generate My Plan</h2>
              <p className="text-[11px] text-gray-400 dark:text-slate-500">Personalised just for you</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Step indicators */}
        {!generating && (
          <div className="flex shrink-0 items-center px-6 pt-3 pb-2">
            {STEP_LABELS.map((label, i) => (
              <React.Fragment key={label}>
                <button onClick={() => (i < step && step !== 2) ? setStep(i) : undefined}
                  className={`flex flex-col items-center gap-0.5 ${i < step && step !== 2 ? "cursor-pointer" : "cursor-default"}`}>
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    i < step ? "bg-emerald-500 text-white" : i === step ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-400 dark:bg-slate-700"
                  }`}>{i < step ? "✓" : i + 1}</div>
                  <span className={`text-[10px] font-semibold whitespace-nowrap ${
                    i === step ? "text-brand-600 dark:text-brand-400" : i < step ? "text-emerald-600 dark:text-emerald-400" : "text-gray-300 dark:text-slate-600"
                  }`}>{label}</span>
                </button>
                {i < 2 && <div className={`flex-1 h-px mx-2 mb-3 mt-3 ${i < step ? "bg-emerald-400" : "bg-gray-200 dark:bg-slate-700"}`} />}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">

          {/* Step 0 — Goal & body stats */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-700 dark:text-slate-300">Your Fitness Goal</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["weight_loss", "muscle_gain", "maintenance", "body_recomp"] as const).map((g) => (
                    <button key={g} onClick={() => set("goal", g)} className={chip(form.goal === g)}>
                      {g === "weight_loss" ? "🔥 Lose Weight" : g === "muscle_gain" ? "💪 Build Muscle" : g === "maintenance" ? "⚖️ Maintenance" : "🔄 Body Recomp"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-slate-300">Your Age</label>
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

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-slate-300">Health Notes <span className="text-gray-400 font-normal">(optional)</span></label>
                <textarea value={form.healthNotes} onChange={(e) => set("healthNotes", e.target.value)} rows={2}
                  placeholder="e.g. diabetes, hypertension, lactose intolerant, bad knee…"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500" />
              </div>
            </div>
          )}

          {/* Step 1 — Diet & Activity */}
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
                    { val: "sedentary" as ActivityLevel, label: "Sedentary",    desc: "Little to no exercise" },
                    { val: "moderate"  as ActivityLevel, label: "Moderate",     desc: "3–5 days/week light exercise" },
                    { val: "active"    as ActivityLevel, label: "Active",       desc: "5–6 days/week moderate training" },
                    { val: "intense"   as ActivityLevel, label: "Very Active",  desc: "Daily intense training" },
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
                      <div className={`h-4 w-4 rounded-full border-2 ${form.activity === val ? "border-brand-500 bg-brand-500" : "border-gray-300 dark:border-slate-600"}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-700 dark:text-slate-300">
                  Meals per day — <span className="text-brand-600 dark:text-brand-400 font-bold">{form.mealsPerDay} meals</span>
                </label>
                <input type="range" min={3} max={6} step={1} value={form.mealsPerDay}
                  onChange={(e) => set("mealsPerDay", parseInt(e.target.value))} className="w-full accent-brand-600" />
                <div className="mt-1 flex justify-between text-[10px] text-gray-400 dark:text-slate-500">
                  <span>3</span><span>4</span><span>5</span><span>6</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — Result */}
          {step === 2 && result && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 p-4 text-white">
                <p className="text-[11px] font-semibold opacity-70 uppercase tracking-wide mb-0.5">Your Custom Plan</p>
                <p className="text-base font-bold">{result.title}</p>
                <p className="text-xs opacity-70 mt-1">Duration: {result.duration} · 💧 {result.hydration}</p>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { icon: <Flame className="h-3.5 w-3.5 text-orange-500" />, label: "Calories", val: `${result.calories}`, bg: "bg-orange-50 dark:bg-orange-900/20" },
                  { icon: <Zap   className="h-3.5 w-3.5 text-brand-500" />, label: "Protein",  val: `${result.protein}g`, bg: "bg-brand-50 dark:bg-brand-600/10" },
                  { icon: <Apple className="h-3.5 w-3.5 text-green-500" />,  label: "Carbs",    val: `${result.carbs}g`,   bg: "bg-green-50 dark:bg-green-900/20" },
                  { icon: <Activity className="h-3.5 w-3.5 text-amber-500" />, label: "Fat",    val: `${result.fat}g`,     bg: "bg-amber-50 dark:bg-amber-900/20" },
                ].map((m) => (
                  <div key={m.label} className={`flex flex-col items-center gap-0.5 rounded-xl p-2.5 ${m.bg}`}>
                    {m.icon}
                    <p className="text-xs font-bold text-gray-800 dark:text-slate-100">{m.val}</p>
                    <p className="text-[9px] text-gray-500 dark:text-slate-400">{m.label}</p>
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
                        <span className="text-[10px] text-gray-400">{meal.time}</span>
                      </div>
                      {meal.foods.map((f, fi) => <p key={fi} className="text-xs text-gray-600 dark:text-slate-400">• {f}</p>)}
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

          {/* Loader */}
          {generating && (
            <div className="flex flex-col items-center justify-center gap-4 py-20">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-brand-100 border-t-brand-500 animate-spin dark:border-slate-700 dark:border-t-brand-400" />
                <Sparkles className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-brand-500 animate-pulse" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-800 dark:text-slate-200">Building your personalised plan…</p>
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">Calculating macros, meals & tips</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-gray-100 px-6 py-4 dark:border-slate-700">
          {step === 0 && !generating && (
            <button onClick={() => setStep(1)}
              className="w-full rounded-xl bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition-colors">
              Next: Diet & Activity →
            </button>
          )}
          {step === 1 && !generating && (
            <div className="flex gap-3">
              <button onClick={() => setStep(0)} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-slate-700 dark:text-slate-400">← Back</button>
              <button onClick={handleGenerate}
                className="flex flex-[2] items-center justify-center gap-2 rounded-xl bg-brand-gradient py-2.5 text-sm font-semibold text-white hover:shadow-brand shadow-brand-sm">
                <Sparkles className="h-4 w-4" /> Generate My Plan
              </button>
            </div>
          )}
          {step === 2 && !generating && (
            <div className="flex gap-3">
              <button onClick={() => { setResult(null); setStep(1); }} className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-slate-700 dark:text-slate-400">← Redo</button>
              <button onClick={onClose}
                className="flex flex-[2] items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600">
                <Download className="h-4 w-4" /> Save My Plan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────

const GOAL_LABELS: Record<string, string> = {
  weight_loss: "Weight Loss",
  muscle_gain: "Muscle Gain",
  maintenance: "Maintenance",
};
const GOAL_VARIANT: Record<string, "active" | "premium" | "neutral"> = {
  weight_loss: "active",
  muscle_gain: "premium",
  maintenance: "neutral",
};

export const MemberNutritionPage: React.FC = () => {
  const { user } = useAuth();
  const [member, setMember]     = useState<Member | null>(null);
  const [plan, setPlan]         = useState<NutritionPlan | null>(null);
  const [loading, setLoading]   = useState(true);
  const [genOpen, setGenOpen]   = useState(false);

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

  if (loading) return <Spinner fullPage label="Loading your nutrition plan…" />;

  return (
    <div className="flex flex-col min-h-full bg-gray-50 dark:bg-slate-950">
      <Header
        title="My Nutrition Plan"
        subtitle="Auto-assigned plan + personalised generator"
        actions={
          <button onClick={() => setGenOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-brand-gradient px-4 py-2 text-sm font-semibold text-white shadow-brand-sm hover:shadow-brand transition-all">
            <Sparkles className="h-4 w-4" /> Generate My Plan
          </button>
        }
      />

      <div className="p-6 space-y-5 max-w-2xl">

        {/* Info banner */}
        <div className="flex items-start gap-3 rounded-xl border border-brand-100 bg-brand-50 px-4 py-3 dark:border-brand-600/20 dark:bg-brand-600/10">
          <Cpu className="mt-0.5 h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" />
          <div>
            <p className="text-sm font-semibold text-brand-700 dark:text-brand-300">Your plan is auto-assigned based on your subscription tier</p>
            <p className="text-xs text-brand-600 dark:text-brand-400 mt-0.5">
              Use <span className="font-semibold">Generate My Plan</span> for a fully personalised plan based on your diet preferences, body stats, and fitness goals.
            </p>
          </div>
        </div>

        {/* Assigned plan */}
        {plan ? (
          <Card padding="none">
            <div className="p-5">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-slate-200 mb-1.5">{plan.title}</p>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge variant={GOAL_VARIANT[plan.goalType]}>{GOAL_LABELS[plan.goalType]}</Badge>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                      <Cpu className="h-2.5 w-2.5" />Auto-assigned
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="rounded-lg bg-gray-50 px-3 py-2 dark:bg-slate-800">
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 uppercase font-semibold">Duration</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-slate-200 mt-0.5">{plan.duration}</p>
                </div>
                <div className="rounded-lg bg-gray-50 px-3 py-2 dark:bg-slate-800">
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 uppercase font-semibold">Version</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-slate-200 mt-0.5">v{plan.version}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 dark:bg-emerald-900/20">
                <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">This plan was assigned to you when you joined. Follow it for best results.</p>
              </div>
            </div>
          </Card>
        ) : (
          <Card padding="md">
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <p className="text-sm text-gray-400 dark:text-slate-500">No nutrition plan assigned yet.</p>
              <p className="text-xs text-gray-400 dark:text-slate-500">Contact your trainer or generate a custom plan.</p>
            </div>
          </Card>
        )}

        {/* Generate prompt card */}
        <div className="rounded-2xl border border-dashed border-brand-300 bg-gradient-to-br from-brand-50 to-orange-50 p-5 dark:border-brand-600/30 dark:from-brand-600/10 dark:to-orange-900/10">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 shadow-md">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-800 dark:text-slate-200">Want a more personalised plan?</p>
              <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 leading-relaxed">
                Tell us your diet preference (veg, keto, vegan…), fitness goal, activity level and body stats — we'll generate a detailed daily meal schedule with calorie & macro targets and expert tips tailored just for you.
              </p>
              <button onClick={() => setGenOpen(true)}
                className="mt-3 flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700 transition-colors shadow">
                <Sparkles className="h-3.5 w-3.5" /> Generate My Custom Plan →
              </button>
            </div>
          </div>
        </div>
      </div>

      {genOpen && (
        <GenModal
          memberName={member?.name ?? user?.name ?? "Me"}
          defaultGoal={member?.goalType as GoalType | undefined}
          onClose={() => setGenOpen(false)}
        />
      )}
    </div>
  );
};
