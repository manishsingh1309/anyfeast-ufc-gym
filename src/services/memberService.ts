/**
 * memberService.ts
 *
 * Member onboarding, member roster, nutrition plan, and coupon validation APIs.
 * All calls are mocked with realistic data — swap for real fetch() when backend is ready.
 */

import { delay } from "../utils/delay";
import type { GoalType, Member, NutritionPlan, SubscriptionTier } from "../types";

// ─── Auto-Assignment Rules ────────────────────────────────────────────────────
// The system automatically assigns a nutrition plan to every new member
// the moment they are onboarded, based purely on their subscription tier.

export const TIER_TO_GOAL: Record<SubscriptionTier, GoalType> = {
  basic: "maintenance",
  standard: "weight_loss",
  premium: "muscle_gain",
};

// Gym-level plan map: gymId → goalType → planId
// Keeps the lookup O(1) without importing the plans array elsewhere.
export const GYM_PLAN_MAP: Record<string, Record<GoalType, string>> = {
  gym_001: { maintenance: "np_003", weight_loss: "np_001", muscle_gain: "np_002" },
  gym_002: { maintenance: "np_006", weight_loss: "np_004", muscle_gain: "np_005" },
};

// ─── Mock Members ─────────────────────────────────────────────────────────────

export const MOCK_MEMBERS: Member[] = [
  // gym_001 — trainer tr_001 (Arjun Mehta)
  {
    id: "mem_001", name: "Ravi Kumar", phone: "9876501111",
    gymId: "gym_001", trainerId: "tr_001", subscriptionTier: "standard",
    startDate: "2026-01-10", endDate: "2026-04-10", status: "active",
    renewalCount: 0, couponCode: "FIT-AB12",
    nutritionPlanId: "np_001", goalType: "weight_loss",
  },
  {
    id: "mem_002", name: "Anjali Singh", phone: "9876502222",
    gymId: "gym_001", trainerId: "tr_001", subscriptionTier: "premium",
    startDate: "2026-01-15", endDate: "2026-03-12", status: "expiring_soon",
    renewalCount: 1, couponCode: "FIT-CD34",
    nutritionPlanId: "np_002", goalType: "muscle_gain",
  },
  {
    id: "mem_003", name: "Vikram Patel", phone: "9876503333",
    gymId: "gym_001", trainerId: "tr_001", subscriptionTier: "basic",
    startDate: "2025-11-01", endDate: "2026-01-01", status: "expired",
    renewalCount: 2, couponCode: "FIT-EF56",
    nutritionPlanId: "np_003", goalType: "maintenance",
  },
  {
    id: "mem_011", name: "Rohit Gupta", phone: "9876511111",
    gymId: "gym_001", trainerId: "tr_001", subscriptionTier: "premium",
    startDate: "2026-02-01", endDate: "2026-07-01", status: "active",
    renewalCount: 0, couponCode: "FIT-UV12",
    nutritionPlanId: "np_002", goalType: "muscle_gain",
  },
  // gym_001 — trainer tr_002 (Priya Nair)
  {
    id: "mem_004", name: "Meera Nair", phone: "9876504444",
    gymId: "gym_001", trainerId: "tr_002", subscriptionTier: "standard",
    startDate: "2026-02-01", endDate: "2026-05-01", status: "active",
    renewalCount: 0, couponCode: "FIT-GH78",
    nutritionPlanId: "np_001", goalType: "weight_loss",
  },
  {
    id: "mem_005", name: "Karan Shah", phone: "9876505555",
    gymId: "gym_001", trainerId: "tr_002", subscriptionTier: "premium",
    startDate: "2026-01-20", endDate: "2026-03-14", status: "expiring_soon",
    renewalCount: 0, couponCode: "FIT-IJ90",
    nutritionPlanId: "np_002", goalType: "muscle_gain",
  },
  {
    id: "mem_012", name: "Prerna Joshi", phone: "9876512222",
    gymId: "gym_001", trainerId: "tr_002", subscriptionTier: "standard",
    startDate: "2026-01-15", endDate: "2026-04-15", status: "active",
    renewalCount: 1, couponCode: "FIT-WX34",
    nutritionPlanId: "np_001", goalType: "weight_loss",
  },
  // gym_002 — trainer tr_003 (Rahul Verma)
  {
    id: "mem_006", name: "Deepika Rao", phone: "9876506666",
    gymId: "gym_002", trainerId: "tr_003", subscriptionTier: "standard",
    startDate: "2026-01-05", endDate: "2026-04-05", status: "active",
    renewalCount: 1, couponCode: "FIT-KL12",
    nutritionPlanId: "np_004", goalType: "weight_loss",
  },
  {
    id: "mem_007", name: "Suresh Iyer", phone: "9876507777",
    gymId: "gym_002", trainerId: "tr_003", subscriptionTier: "basic",
    startDate: "2026-02-10", endDate: "2026-05-10", status: "active",
    renewalCount: 0, couponCode: "FIT-MN34",
    nutritionPlanId: "np_006", goalType: "maintenance",
  },
  {
    id: "mem_008", name: "Pooja Desai", phone: "9876508888",
    gymId: "gym_002", trainerId: "tr_003", subscriptionTier: "premium",
    startDate: "2025-12-01", endDate: "2026-02-01", status: "expired",
    renewalCount: 3, couponCode: "FIT-OP56",
    nutritionPlanId: "np_005", goalType: "muscle_gain",
  },
  {
    id: "mem_009", name: "Arun Kapoor", phone: "9876509999",
    gymId: "gym_002", trainerId: "tr_003", subscriptionTier: "standard",
    startDate: "2026-02-15", endDate: "2026-05-15", status: "active",
    renewalCount: 0, couponCode: "FIT-QR78",
    nutritionPlanId: "np_004", goalType: "weight_loss",
  },
  // gym_002 — trainer tr_004 (Sneha Das)
  {
    id: "mem_010", name: "Sonal Mehta", phone: "9876510000",
    gymId: "gym_002", trainerId: "tr_004", subscriptionTier: "basic",
    startDate: "2026-03-01", endDate: "2026-03-18", status: "expiring_soon",
    renewalCount: 0, couponCode: "FIT-ST90",
    nutritionPlanId: "np_006", goalType: "maintenance",
  },
  {
    id: "mem_013", name: "Neeraj Tiwari", phone: "9876513333",
    gymId: "gym_002", trainerId: "tr_004", subscriptionTier: "standard",
    startDate: "2026-02-05", endDate: "2026-05-05", status: "active",
    renewalCount: 0, couponCode: "FIT-YZ12",
    nutritionPlanId: "np_004", goalType: "weight_loss",
  },
];

// ─── Mock Nutrition Plans ─────────────────────────────────────────────────────

const MOCK_NUTRITION_PLANS: NutritionPlan[] = [
  {
    id: "np_001", gymId: "gym_001", title: "Summer Fat Loss Plan",
    goalType: "weight_loss", duration: "8 weeks", version: "v2.1",
    uploadedAt: "2026-01-10", assignedCount: 3, // mem_001, mem_004, mem_012
  },
  {
    id: "np_002", gymId: "gym_001", title: "Muscle Builder Pro",
    goalType: "muscle_gain", duration: "12 weeks", version: "v1.0",
    uploadedAt: "2026-01-20", assignedCount: 3, // mem_002, mem_011, mem_005
  },
  {
    id: "np_003", gymId: "gym_001", title: "Balanced Lifestyle Plan",
    goalType: "maintenance", duration: "Ongoing", version: "v1.2",
    uploadedAt: "2026-02-01", assignedCount: 1, // mem_003
  },
  {
    id: "np_004", gymId: "gym_002", title: "Weight Loss Kickstarter",
    goalType: "weight_loss", duration: "6 weeks", version: "v1.0",
    uploadedAt: "2026-01-15", assignedCount: 3, // mem_006, mem_009, mem_013
  },
  {
    id: "np_005", gymId: "gym_002", title: "Powerlifting Foundation",
    goalType: "muscle_gain", duration: "16 weeks", version: "v3.0",
    uploadedAt: "2026-02-05", assignedCount: 1, // mem_008
  },
  {
    id: "np_006", gymId: "gym_002", title: "Recovery & Maintenance",
    goalType: "maintenance", duration: "Ongoing", version: "v1.0",
    uploadedAt: "2026-02-20", assignedCount: 2, // mem_007, mem_010
  },
];

// ─── Service Methods ──────────────────────────────────────────────────────────

export const getMembersByGym = async (gymId: string): Promise<Member[]> => {
  await delay(600);
  return MOCK_MEMBERS.filter((m) => m.gymId === gymId);
};

export const getMembersByTrainer = async (trainerId: string): Promise<Member[]> => {
  await delay(600);
  return MOCK_MEMBERS.filter((m) => m.trainerId === trainerId);
};

export const getAllMembers = async (): Promise<Member[]> => {
  await delay(700);
  return MOCK_MEMBERS;
};

export const getNutritionPlansByGym = async (gymId: string): Promise<NutritionPlan[]> => {
  await delay(500);
  return MOCK_NUTRITION_PLANS.filter((p) => p.gymId === gymId);
};

export const getAllNutritionPlans = async (): Promise<NutritionPlan[]> => {
  await delay(600);
  return MOCK_NUTRITION_PLANS;
};

/**
 * Returns the nutrition plan that will be (or was) auto-assigned to a member
 * with the given subscription tier inside a specific gym.
 * Returns null if no matching plan is configured for that gym.
 */
export const getAutoAssignedPlan = async (
  gymId: string,
  tier: SubscriptionTier
): Promise<NutritionPlan | null> => {
  await delay(300);
  const goalType = TIER_TO_GOAL[tier];
  const planId = GYM_PLAN_MAP[gymId]?.[goalType];
  if (!planId) return null;
  return MOCK_NUTRITION_PLANS.find((p) => p.id === planId) ?? null;
};

/**
 * Returns all members assigned to a specific nutrition plan.
 */
export const getMembersByPlan = async (planId: string): Promise<Member[]> => {
  await delay(400);
  return MOCK_MEMBERS.filter((m) => m.nutritionPlanId === planId);
};

export const addNutritionPlan = async (
  plan: Omit<NutritionPlan, "id" | "uploadedAt" | "assignedCount">
): Promise<NutritionPlan> => {
  await delay(900);
  const newPlan: NutritionPlan = {
    ...plan,
    id: `np_new_${Date.now()}`,
    uploadedAt: new Date().toISOString().split("T")[0],
    assignedCount: 0,
  };
  MOCK_NUTRITION_PLANS.push(newPlan);
  return newPlan;
};

/**
 * Validate a coupon code entered by a prospective member.
 * In production: POST /api/coupons/validate
 */
export const validateCoupon = async (
  code: string
): Promise<{ valid: boolean; tier?: string; gymName?: string }> => {
  await delay(1000);
  const validCodes = ["FIT-AB12", "FIT-TEST", "FIT-DEMO", "FIT-NEW1"];
  const valid = validCodes.some((c) => c.toUpperCase() === code.toUpperCase());
  if (valid) {
    return { valid: true, tier: "Standard (3 months)", gymName: "FitZone Koramangala" };
  }
  return { valid: false };
};

/**
 * Activate a membership using a validated coupon code.
 * In production: POST /api/members/activate
 */
export const activateMembership = async (data: {
  couponCode: string;
  name: string;
  phone: string;
  email?: string;
}): Promise<Member> => {
  await delay(1200);
  const endDate = new Date(Date.now() + 90 * 86_400_000)
    .toISOString()
    .split("T")[0];
  const gymId = "gym_001";
  const subscriptionTier: SubscriptionTier = "standard";
  // Auto-assign nutrition plan based on tier — no manual action needed
  const goalType = TIER_TO_GOAL[subscriptionTier];
  const nutritionPlanId = GYM_PLAN_MAP[gymId]?.[goalType];
  const newMember: Member = {
    id: `mem_new_${Date.now()}`,
    name: data.name,
    phone: data.phone,
    email: data.email,
    gymId,
    trainerId: "tr_001",
    subscriptionTier,
    startDate: new Date().toISOString().split("T")[0],
    endDate,
    status: "active",
    renewalCount: 0,
    couponCode: data.couponCode,
    nutritionPlanId,
    goalType,
  };
  MOCK_MEMBERS.push(newMember);
  // Increment the plan's assignedCount in memory
  const plan = MOCK_NUTRITION_PLANS.find((p) => p.id === nutritionPlanId);
  if (plan) plan.assignedCount = (plan.assignedCount ?? 0) + 1;
  return newMember;
};

/** Get a single member by ID */
export const getMemberById = async (memberId: string): Promise<Member | null> => {
  await delay(300);
  return MOCK_MEMBERS.find((m) => m.id === memberId) ?? null;
};

/** Get the nutrition plan for a member's assigned planId */
export const getNutritionPlanById = async (planId: string) => {
  await delay(200);
  return MOCK_NUTRITION_PLANS.find((p) => p.id === planId) ?? null;
};
