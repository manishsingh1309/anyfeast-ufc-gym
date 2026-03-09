/**
 * couponService.ts
 *
 * Coupon onboarding API calls — Day 2 implementation.
 * Placeholder structure is established so imports work immediately.
 */

import { delay } from "../utils/delay";
import type { Coupon } from "../types";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_COUPONS: Coupon[] = [
  {
    id: "cpn_001",
    code: "FIT-AB12",
    status: "unused",
    gymId: "gym_001",
    expiresAt: "2026-06-30",
  },
  {
    id: "cpn_002",
    code: "FIT-CD34",
    status: "used",
    gymId: "gym_001",
    assignedTo: "member_001",
    expiresAt: "2026-06-30",
  },
  {
    id: "cpn_003",
    code: "FIT-EF56",
    status: "unused",
    gymId: "gym_002",
    expiresAt: "2026-06-30",
  },
];

// ─── Service Methods ──────────────────────────────────────────────────────────

/**
 * Fetch all coupons for a given gym.
 * In production: GET /api/gyms/:gymId/coupons
 * Day 2: Connect to real backend.
 */
export const getCouponsByGym = async (gymId: string): Promise<Coupon[]> => {
  await delay(700);
  return MOCK_COUPONS.filter((c) => c.gymId === gymId);
};

/**
 * Generate a batch of new coupon codes for a gym.
 * In production: POST /api/gyms/:gymId/coupons/generate
 */
export const generateCoupons = async (
  gymId: string,
  count: number
): Promise<Coupon[]> => {
  await delay(1000);
  // Placeholder — returns mock generated coupons
  return Array.from({ length: count }, (_, i) => ({
    id: `cpn_new_${i}`,
    code: `FIT-${Math.random().toString(36).toUpperCase().slice(2, 6)}`,
    status: "unused" as const,
    gymId,
    expiresAt: "2026-12-31",
  }));
};

/**
 * Assign a coupon to a member (trainer flow).
 * In production: PATCH /api/coupons/:couponId/assign
 */
export const assignCoupon = async (
  couponId: string,
  memberId: string
): Promise<Coupon> => {
  await delay(900);
  const coupon = MOCK_COUPONS.find((c) => c.id === couponId);
  if (!coupon) throw new Error("Coupon not found.");
  if (coupon.status !== "unused") throw new Error("Coupon already used.");

  // Return updated coupon (mock mutation — real backend handles persistence)
  return { ...coupon, status: "used", assignedTo: memberId };
};
