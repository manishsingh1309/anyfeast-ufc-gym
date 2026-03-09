// ─── Domain Types ─────────────────────────────────────────────────────────────

export type UserRole = "trainer" | "owner" | "member" | "super_admin";

export interface Gym {
  id: string;
  name: string;
  location?: string;
  logoUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: UserRole;
  gyms: Gym[];
  avatarUrl?: string;
  /** For role=member: links to Member record in memberService */
  memberId?: string;
}

// ─── Auth Types ───────────────────────────────────────────────────────────────

export interface OTPRequestPayload {
  contact: string; // phone or email
}

export interface OTPVerifyPayload {
  contact: string;
  otp: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// ─── Coupon Types (placeholder for Day 2) ─────────────────────────────────────

export type CouponStatus = "unused" | "used" | "expired";

export interface Coupon {
  id: string;
  code: string;
  status: CouponStatus;
  gymId: string;
  assignedTo?: string;
  expiresAt: string;
}

// ─── Trainer Types ────────────────────────────────────────────────────────────

export interface Trainer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  gymId: string;
  joinedAt: string;
  /** Number of members onboarded by this trainer */
  membersOnboarded: number;
}

// ─── License Types ────────────────────────────────────────────────────────────

export interface LicenseBundle {
  id: string;
  gymId: string;
  totalLicenses: number;
  usedLicenses: number;
  purchasedAt: string;
  expiresAt: string;
}

// ─── API Utility Types ────────────────────────────────────────────────────────

export interface ApiError {
  message: string;
  code?: string;
}

export type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: ApiError };

// ─── Member Types ─────────────────────────────────────────────────────────────

export type MemberStatus = "active" | "expiring_soon" | "expired";
export type SubscriptionTier = "basic" | "standard" | "premium";

export interface Member {
  id: string;
  name: string;
  phone: string;
  email?: string;
  gymId: string;
  trainerId: string;
  subscriptionTier: SubscriptionTier;
  startDate: string;
  endDate: string;
  status: MemberStatus;
  renewalCount: number;
  couponCode: string;
  /** Auto-assigned nutrition plan ID based on subscription tier */
  nutritionPlanId?: string;
  /** Goal type derived from tier at onboarding */
  goalType?: GoalType;
}

// ─── Nutrition Plan Types ─────────────────────────────────────────────────────

export type GoalType = "weight_loss" | "muscle_gain" | "maintenance";

export interface NutritionPlan {
  id: string;
  gymId: string;
  title: string;
  goalType: GoalType;
  duration: string;
  version: string;
  uploadedAt: string;
  assignedCount?: number;
}

// ─── Analytics Types ──────────────────────────────────────────────────────────

export interface AnalyticsSummary {
  activationRate: number;
  renewalRate: number;
  avgMembersPerTrainer: number;
  totalRevenue: number;
}

export interface MonthlyDataPoint {
  month: string;
  activations: number;
  renewals: number;
}

export interface TrainerLeaderboardEntry {
  trainerId: string;
  trainerName: string;
  membersOnboarded: number;
  activeMembers: number;
  renewals: number;
  commissionEarned: number;
}

// ─── Super Admin Types ────────────────────────────────────────────────────────

export interface PlatformGym {
  id: string;
  name: string;
  location: string;
  owner: string;
  ownerEmail: string;
  totalTrainers: number;
  activeMembers: number;
  totalMembers: number;
  licensesPurchased: number;
  licensesUsed: number;
  status: "active" | "disabled" | "pending";
  joinedAt: string;
  plan: "starter" | "growth" | "enterprise";
}

export interface PlatformStats {
  totalGyms: number;
  totalTrainers: number;
  totalMembers: number;
  activeSubscriptions: number;
  totalLicensesSold: number;
  monthlyRecurringRevenue: number;
  gymGrowthRate: number;
  subscriptionGrowthRate: number;
}

export interface PlatformTrainer {
  id: string;
  name: string;
  gymName: string;
  gymId: string;
  membersOnboarded: number;
  activeMembers: number;
  renewals: number;
  joinedAt: string;
  status: "active" | "inactive";
}

export interface PlatformMonthlyPoint {
  month: string;
  gyms: number;
  subscriptions: number;
  activations: number;
  revenue: number;
}

