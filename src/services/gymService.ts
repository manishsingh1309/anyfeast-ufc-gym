/**
 * gymService.ts
 *
 * Gym-related API calls. Trainers and owners interact with gyms through here.
 */

import { delay } from "../utils/delay";
import type { Gym, LicenseBundle, Trainer } from "../types";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_GYMS: Gym[] = [
  { id: "gym_001", name: "FitZone Koramangala", location: "Bangalore" },
  { id: "gym_002", name: "FitZone Indiranagar", location: "Bangalore" },
  { id: "gym_003", name: "FitZone Whitefield", location: "Bangalore" },
];

const MOCK_TRAINERS: Trainer[] = [
  {
    id: "tr_001",
    name: "Arjun Mehta",
    phone: "9999988888",
    email: "arjun@fitzone.in",
    gymId: "gym_001",
    joinedAt: "2026-01-15",
    membersOnboarded: 12,
  },
  {
    id: "tr_002",
    name: "Priya Nair",
    phone: "9876543210",
    email: "priya@fitzone.in",
    gymId: "gym_001",
    joinedAt: "2026-02-01",
    membersOnboarded: 8,
  },
  {
    id: "tr_003",
    name: "Rahul Verma",
    phone: "9123456789",
    email: "rahul@fitzone.in",
    gymId: "gym_002",
    joinedAt: "2026-01-20",
    membersOnboarded: 15,
  },
  {
    id: "tr_004",
    name: "Sneha Das",
    phone: "9988776655",
    email: "sneha@fitzone.in",
    gymId: "gym_002",
    joinedAt: "2026-03-01",
    membersOnboarded: 3,
  },
];

const MOCK_LICENSES: LicenseBundle[] = [
  {
    id: "lic_001",
    gymId: "gym_001",
    totalLicenses: 100,
    usedLicenses: 67,
    purchasedAt: "2026-01-01",
    expiresAt: "2026-12-31",
  },
  {
    id: "lic_002",
    gymId: "gym_002",
    totalLicenses: 50,
    usedLicenses: 23,
    purchasedAt: "2026-02-01",
    expiresAt: "2026-12-31",
  },
];

// ─── Service Methods ──────────────────────────────────────────────────────────

/**
 * Fetch a gym by ID.
 * In production: GET /api/gyms/:id
 */
export const getGymById = async (gymId: string): Promise<Gym> => {
  await delay(400);
  const gym = MOCK_GYMS.find((g) => g.id === gymId);
  if (!gym) throw new Error(`Gym ${gymId} not found.`);
  return gym;
};

/**
 * Fetch license bundle for a gym.
 * In production: GET /api/gyms/:id/licenses
 */
export const getLicenseBundle = async (
  gymId: string
): Promise<LicenseBundle | null> => {
  await delay(600);
  return MOCK_LICENSES.find((l) => l.gymId === gymId) ?? null;
};

/**
 * Fetch all gyms owned by the current owner.
 * In production: GET /api/owner/gyms
 */
export const getOwnerGyms = async (): Promise<Gym[]> => {
  await delay(700);
  return MOCK_GYMS.slice(0, 2); // mock: owner has first 2 gyms
};

/**
 * Fetch trainers for a specific gym.
 * In production: GET /api/gyms/:id/trainers
 */
export const getTrainersByGym = async (gymId: string): Promise<Trainer[]> => {
  await delay(600);
  return MOCK_TRAINERS.filter((t) => t.gymId === gymId);
};

/**
 * Fetch all trainers across all owner gyms.
 * In production: GET /api/owner/trainers
 */
export const getAllTrainers = async (): Promise<Trainer[]> => {
  await delay(700);
  return MOCK_TRAINERS;
};

/**
 * Fetch all license bundles for the owner's gyms.
 * In production: GET /api/owner/licenses
 */
export const getOwnerLicenses = async (): Promise<LicenseBundle[]> => {
  await delay(700);
  return MOCK_LICENSES;
};

/**
 * Purchase additional licenses for a gym (mock mutation).
 * In production: POST /api/gyms/:id/licenses/purchase
 */
export const purchaseLicenses = async (
  gymId: string,
  count: number
): Promise<LicenseBundle> => {
  await delay(1200);
  const existing = MOCK_LICENSES.find((l) => l.gymId === gymId);
  if (existing) {
    existing.totalLicenses += count;
    return { ...existing };
  }
  const newBundle: LicenseBundle = {
    id: `lic_new_${gymId}`,
    gymId,
    totalLicenses: count,
    usedLicenses: 0,
    purchasedAt: new Date().toISOString().split("T")[0],
    expiresAt: "2026-12-31",
  };
  MOCK_LICENSES.push(newBundle);
  return newBundle;
};

/**
 * Aggregate license stats across all gyms for owner dashboard.
 */
export const getOwnerLicenseStats = async (): Promise<{
  totalPurchased: number;
  totalUsed: number;
  totalAvailable: number;
}> => {
  await delay(800);
  const totalPurchased = MOCK_LICENSES.reduce(
    (sum, l) => sum + l.totalLicenses,
    0
  );
  const totalUsed = MOCK_LICENSES.reduce((sum, l) => sum + l.usedLicenses, 0);
  return {
    totalPurchased,
    totalUsed,
    totalAvailable: totalPurchased - totalUsed,
  };
};
