/**
 * licensePoolService.ts
 *
 * License pool management API calls.
 * A "License Pool" is a named bundle of licenses with a subscription tier,
 * quantity, and expiry — more granular than a flat LicenseBundle.
 */

import { delay } from "../utils/delay";

// ─── Types ─────────────────────────────────────────────────────────────────────

export type LicensePoolStatus = "active" | "expiring_soon" | "expired" | "depleted";
export type SubscriptionTierPool = "basic" | "standard" | "premium" | "enterprise";

export interface LicensePool {
  id: string;
  gymId: string;
  name: string;
  subscriptionTier: SubscriptionTierPool;
  totalQuantity: number;
  redeemedCount: number;
  expiryDate: string;
  purchasedAt: string;
  status: LicensePoolStatus;
  pricePerLicense: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_POOLS: LicensePool[] = [
  {
    id: "pool_001",
    gymId: "gym_001",
    name: "Q1 2026 Standard Pool",
    subscriptionTier: "standard",
    totalQuantity: 50,
    redeemedCount: 38,
    expiryDate: "2026-06-30",
    purchasedAt: "2026-01-01",
    status: "active",
    pricePerLicense: 1299,
  },
  {
    id: "pool_002",
    gymId: "gym_001",
    name: "Premium Sports Package",
    subscriptionTier: "premium",
    totalQuantity: 25,
    redeemedCount: 21,
    expiryDate: "2026-04-30",
    purchasedAt: "2026-01-15",
    status: "expiring_soon",
    pricePerLicense: 2499,
  },
  {
    id: "pool_003",
    gymId: "gym_001",
    name: "Basic Starter Pack",
    subscriptionTier: "basic",
    totalQuantity: 30,
    redeemedCount: 8,
    expiryDate: "2026-12-31",
    purchasedAt: "2026-02-01",
    status: "active",
    pricePerLicense: 799,
  },
  {
    id: "pool_004",
    gymId: "gym_002",
    name: "Q1 2026 Standard Pool",
    subscriptionTier: "standard",
    totalQuantity: 30,
    redeemedCount: 18,
    expiryDate: "2026-06-30",
    purchasedAt: "2026-02-01",
    status: "active",
    pricePerLicense: 1299,
  },
  {
    id: "pool_005",
    gymId: "gym_002",
    name: "Enterprise Bulk Pack",
    subscriptionTier: "enterprise",
    totalQuantity: 20,
    redeemedCount: 5,
    expiryDate: "2026-12-31",
    purchasedAt: "2026-03-01",
    status: "active",
    pricePerLicense: 3999,
  },
  {
    id: "pool_006",
    gymId: "gym_001",
    name: "Dec 2025 Expired Batch",
    subscriptionTier: "basic",
    totalQuantity: 15,
    redeemedCount: 15,
    expiryDate: "2025-12-31",
    purchasedAt: "2025-10-01",
    status: "depleted",
    pricePerLicense: 699,
  },
];

// Helper: compute status based on dates + redemption
function computeStatus(pool: LicensePool): LicensePoolStatus {
  const now = new Date();
  const expiry = new Date(pool.expiryDate);
  const daysLeft = Math.ceil((expiry.getTime() - now.getTime()) / 86400000);

  if (pool.redeemedCount >= pool.totalQuantity) return "depleted";
  if (daysLeft < 0) return "expired";
  if (daysLeft <= 30) return "expiring_soon";
  return "active";
}

// ─── Service Methods ──────────────────────────────────────────────────────────

/**
 * Get all license pools for a gym.
 * In production: GET /api/gyms/:gymId/license-pools
 */
export const getLicensePoolsByGym = async (gymId: string): Promise<LicensePool[]> => {
  await delay(700);
  return MOCK_POOLS.filter((p) => p.gymId === gymId).map((p) => ({
    ...p,
    status: computeStatus(p),
  }));
};

/**
 * Get all license pools across all gyms (owner view).
 * In production: GET /api/owner/license-pools
 */
export const getAllLicensePools = async (): Promise<LicensePool[]> => {
  await delay(700);
  return MOCK_POOLS.map((p) => ({ ...p, status: computeStatus(p) }));
};

/**
 * Get a single license pool by ID.
 * In production: GET /api/license-pools/:id
 */
export const getLicensePoolById = async (
  poolId: string
): Promise<LicensePool | null> => {
  await delay(300);
  const pool = MOCK_POOLS.find((p) => p.id === poolId);
  if (!pool) return null;
  return { ...pool, status: computeStatus(pool) };
};

/**
 * Create a new license pool (mock).
 * In production: POST /api/gyms/:gymId/license-pools
 */
export const createLicensePool = async (data: {
  gymId: string;
  name: string;
  subscriptionTier: SubscriptionTierPool;
  quantity: number;
  expiryDate: string;
  pricePerLicense: number;
}): Promise<LicensePool> => {
  await delay(1000);
  const newPool: LicensePool = {
    id: `pool_new_${Date.now()}`,
    gymId: data.gymId,
    name: data.name,
    subscriptionTier: data.subscriptionTier,
    totalQuantity: data.quantity,
    redeemedCount: 0,
    expiryDate: data.expiryDate,
    purchasedAt: new Date().toISOString().split("T")[0],
    status: "active",
    pricePerLicense: data.pricePerLicense,
  };
  MOCK_POOLS.push(newPool);
  return newPool;
};

/**
 * Aggregate pool stats across all gyms for the owner dashboard.
 */
export const getPoolStats = async (): Promise<{
  totalPools: number;
  totalLicenses: number;
  totalRedeemed: number;
  expiringPools: number;
  totalRevenue: number;
}> => {
  await delay(500);
  const allPools = MOCK_POOLS;
  return {
    totalPools: allPools.length,
    totalLicenses: allPools.reduce((s, p) => s + p.totalQuantity, 0),
    totalRedeemed: allPools.reduce((s, p) => s + p.redeemedCount, 0),
    expiringPools: allPools.filter(
      (p) => computeStatus(p) === "expiring_soon"
    ).length,
    totalRevenue: allPools.reduce(
      (s, p) => s + p.redeemedCount * p.pricePerLicense,
      0
    ),
  };
};
