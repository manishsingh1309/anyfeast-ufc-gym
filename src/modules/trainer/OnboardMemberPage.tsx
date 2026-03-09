/**
 * OnboardMemberPage.tsx — 4-step member onboarding flow.
 */

import React, { useState } from "react";
import { CheckCircle2, Cpu, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../layouts/Header";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { validateCoupon, activateMembership, getAutoAssignedPlan } from "../../services/memberService";
import { useGym } from "../../context/GymContext";
import { useToast } from "../../context/ToastContext";
import type { Member, NutritionPlan } from "../../types";

type Step = 1 | 2 | 3 | 4;
interface CouponInfo { code: string; gymName: string; tier: string; }

export const OnboardMemberPage: React.FC = () => {
  const { selectedGym } = useGym();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>(1);
  const [couponCode, setCouponCode] = useState("");
  const [couponInfo, setCouponInfo] = useState<CouponInfo | null>(null);
  const [memberName, setMemberName] = useState("");
  const [memberPhone, setMemberPhone] = useState("");
  const [activated, setActivated] = useState<Member | null>(null);
  const [assignedPlan, setAssignedPlan] = useState<NutritionPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleValidate = async () => {
    if (!couponCode.trim()) return;
    setLoading(true); setError(null);
    try {
      const result = await validateCoupon(couponCode.trim().toUpperCase());
      if (!result.valid) { setError("Invalid or expired coupon code."); return; }
      setCouponInfo({
        code: couponCode.trim().toUpperCase(),
        gymName: result.gymName ?? selectedGym?.name ?? "Your Gym",
        tier: result.tier ?? "Standard",
      });
      setStep(2);
    } catch { setError("Failed to validate coupon."); }
    finally { setLoading(false); }
  };

  const handleActivate = async () => {
    if (!memberName.trim() || memberPhone.trim().length < 10) return;
    setLoading(true); setError(null);
    try {
      const result = await activateMembership({
        couponCode: couponInfo!.code,
        name: memberName.trim(),
        phone: memberPhone.trim(),
      });
      setActivated(result);
      toast.success(`Membership activated for ${memberName.trim()}!`);
      // Fetch the auto-assigned plan to display on success screen
      if (result.gymId && result.subscriptionTier) {
        getAutoAssignedPlan(result.gymId, result.subscriptionTier).then(setAssignedPlan);
      }
      setStep(4);
    } catch { setError("Activation failed. Please try again."); }
    finally { setLoading(false); }
  };

  const reset = () => {
    setCouponCode(""); setCouponInfo(null); setMemberName("");
    setMemberPhone(""); setActivated(null); setAssignedPlan(null); setError(null); setStep(1);
  };

  const stepLabels = ["Enter Coupon", "Confirm", "Member Details", "Success"];

  return (
    <div>
      <Header title="Onboard Member" subtitle="Activate a gym membership via coupon" />
      <div className="p-6 max-w-lg mx-auto">
        {/* Step indicators */}
        <div className="flex items-center gap-2 mb-8">
          {stepLabels.map((label, i) => (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center gap-1">
                <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${step > i + 1 ? "bg-green-500 text-white" : step === i + 1 ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-400"}`}>
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span className={`text-[10px] font-medium hidden sm:block ${step === i + 1 ? "text-indigo-600" : "text-gray-400"}`}>{label}</span>
              </div>
              {i < 3 && <div className={`flex-1 h-0.5 mb-4 ${step > i + 1 ? "bg-green-400" : "bg-gray-200"}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-800">Enter Coupon Code</h2>
              <Input label="Coupon Code" placeholder="e.g. FIT-AB12"
                value={couponCode} onChange={(e) => { setCouponCode(e.target.value); setError(null); }} />
              {error && <p className="text-xs text-red-600">{error}</p>}
              <p className="text-xs text-gray-400">Try: FIT-AB12 · FIT-TEST · FIT-DEMO · FIT-NEW1</p>
              <Button className="w-full" onClick={handleValidate} disabled={loading || !couponCode.trim()}>
                {loading ? "Validating…" : "Validate Coupon"}
              </Button>
            </div>
          )}

          {step === 2 && couponInfo && (
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-800">Confirm Coupon Details</h2>
              <div className="rounded-xl bg-indigo-50 p-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Coupon</span><span className="font-mono font-bold text-indigo-700">{couponInfo.code}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Gym</span><span className="font-medium text-gray-800">{couponInfo.gymName}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Tier</span><span className="font-medium text-gray-800">{couponInfo.tier}</span></div>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                <Button className="flex-1" onClick={() => setStep(3)}>Looks Good →</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-800">Member Details</h2>
              <Input label="Full Name" placeholder="Rahul Sharma"
                value={memberName} onChange={(e) => setMemberName(e.target.value)} />
              <Input label="Phone Number" placeholder="9876543210"
                value={memberPhone} onChange={(e) => setMemberPhone(e.target.value)} />
              {error && <p className="text-xs text-red-600">{error}</p>}
              <div className="flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setStep(2)}>Back</Button>
                <Button className="flex-1" onClick={handleActivate}
                  disabled={loading || !memberName.trim() || memberPhone.trim().length < 10}>
                  {loading ? "Activating…" : "Activate Membership"}
                </Button>
              </div>
            </div>
          )}

          {step === 4 && activated && (
            <div className="flex flex-col items-center gap-4 text-center py-2">
              <CheckCircle2 className="h-14 w-14 text-green-500" />
              <h2 className="text-lg font-bold text-gray-800">Membership Activated!</h2>
              <div className="w-full rounded-xl bg-green-50 p-4 space-y-2 text-left">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Member</span><span className="font-medium text-gray-800">{activated.name}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Gym</span><span className="font-medium text-gray-800">{activated.gymId}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Start</span><span className="font-medium text-gray-800">{activated.startDate}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">End</span><span className="font-medium text-gray-800">{activated.endDate}</span></div>
              </div>

              {/* Auto-assigned nutrition plan */}
              {assignedPlan && (
                <div className="w-full rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <Cpu className="h-4 w-4 text-indigo-600" />
                    <p className="text-xs font-semibold text-indigo-800">Nutrition Plan Auto-Assigned</p>
                  </div>
                  <p className="text-sm font-bold text-indigo-900">{assignedPlan.title}</p>
                  <p className="text-xs text-indigo-600 mt-0.5">
                    {assignedPlan.goalType.replace("_", " ")} · {assignedPlan.duration} · v{assignedPlan.version}
                  </p>
                  <p className="text-[11px] text-indigo-500 mt-1">Based on their <strong>{activated.subscriptionTier}</strong> subscription tier</p>
                </div>
              )}

              <div className="flex gap-3 w-full">
                <Button variant="secondary" className="flex-1" onClick={() => navigate("/trainer/members")}>
                  <UserPlus className="mr-1 h-4 w-4" />View Members
                </Button>
                <Button className="flex-1" onClick={reset}>Onboard Another</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
