/**
 * superAdminService.ts
 *
 * Platform-wide analytics and management APIs for the Super Admin role.
 * All data is mocked. Swap fetch() calls when backend is ready.
 */

import { delay } from "../utils/delay";
import type {
  PlatformGym,
  PlatformStats,
  PlatformTrainer,
  PlatformMonthlyPoint,
} from "../types";

// ─── Mock Platform Gyms ───────────────────────────────────────────────────────

export const MOCK_PLATFORM_GYMS: PlatformGym[] = [
  {
    id: "gym_001",
    name: "FitZone Koramangala",
    location: "Bangalore, IN",
    owner: "Priya Mehta",
    ownerEmail: "priya@fitzone.in",
    totalTrainers: 4,
    activeMembers: 54,
    totalMembers: 67,
    licensesPurchased: 100,
    licensesUsed: 67,
    status: "active",
    joinedAt: "2026-01-01",
    plan: "growth",
  },
  {
    id: "gym_002",
    name: "FitZone Indiranagar",
    location: "Bangalore, IN",
    owner: "Priya Mehta",
    ownerEmail: "priya@fitzone.in",
    totalTrainers: 3,
    activeMembers: 28,
    totalMembers: 35,
    licensesPurchased: 50,
    licensesUsed: 35,
    status: "active",
    joinedAt: "2026-01-15",
    plan: "starter",
  },
  {
    id: "gym_003",
    name: "IronCore Mumbai Central",
    location: "Mumbai, IN",
    owner: "Rohan Kapoor",
    ownerEmail: "rohan@ironcore.in",
    totalTrainers: 7,
    activeMembers: 120,
    totalMembers: 148,
    licensesPurchased: 200,
    licensesUsed: 148,
    status: "active",
    joinedAt: "2025-11-10",
    plan: "enterprise",
  },
  {
    id: "gym_004",
    name: "Pulse Fitness Delhi",
    location: "Delhi, IN",
    owner: "Anjali Sharma",
    ownerEmail: "anjali@pulsefitness.in",
    totalTrainers: 5,
    activeMembers: 63,
    totalMembers: 80,
    licensesPurchased: 100,
    licensesUsed: 80,
    status: "active",
    joinedAt: "2025-12-01",
    plan: "growth",
  },
  {
    id: "gym_005",
    name: "SweatBox Hyderabad",
    location: "Hyderabad, IN",
    owner: "Vikram Singh",
    ownerEmail: "vikram@sweatbox.in",
    totalTrainers: 2,
    activeMembers: 18,
    totalMembers: 22,
    licensesPurchased: 30,
    licensesUsed: 22,
    status: "active",
    joinedAt: "2026-02-01",
    plan: "starter",
  },
  {
    id: "gym_006",
    name: "AthleteEdge Chennai",
    location: "Chennai, IN",
    owner: "Kavitha Rajan",
    ownerEmail: "kavitha@athleteedge.in",
    totalTrainers: 3,
    activeMembers: 0,
    totalMembers: 15,
    licensesPurchased: 20,
    licensesUsed: 15,
    status: "disabled",
    joinedAt: "2025-10-15",
    plan: "starter",
  },
  {
    id: "gym_007",
    name: "MaxRep Pune",
    location: "Pune, IN",
    owner: "Siddharth Rane",
    ownerEmail: "sid@maxrep.in",
    totalTrainers: 6,
    activeMembers: 89,
    totalMembers: 112,
    licensesPurchased: 150,
    licensesUsed: 112,
    status: "active",
    joinedAt: "2025-09-01",
    plan: "enterprise",
  },
  {
    id: "gym_008",
    name: "LiftHouse Kochi",
    location: "Kochi, IN",
    owner: "Nisha Pillai",
    ownerEmail: "nisha@lifthouse.in",
    totalTrainers: 2,
    activeMembers: 14,
    totalMembers: 18,
    licensesPurchased: 25,
    licensesUsed: 18,
    status: "pending",
    joinedAt: "2026-02-20",
    plan: "starter",
  },
];

// ─── Mock Platform Trainers ───────────────────────────────────────────────────

const MOCK_PLATFORM_TRAINERS: PlatformTrainer[] = [
  { id: "tr_001", name: "Arjun Mehta", gymName: "FitZone Koramangala", gymId: "gym_001", membersOnboarded: 12, activeMembers: 10, renewals: 3, joinedAt: "2026-01-15", status: "active" },
  { id: "tr_002", name: "Priya Nair", gymName: "FitZone Koramangala", gymId: "gym_001", membersOnboarded: 8, activeMembers: 6, renewals: 1, joinedAt: "2026-02-01", status: "active" },
  { id: "tr_003", name: "Rahul Verma", gymName: "FitZone Indiranagar", gymId: "gym_002", membersOnboarded: 15, activeMembers: 12, renewals: 5, joinedAt: "2026-01-20", status: "active" },
  { id: "tr_004", name: "Sneha Das", gymName: "FitZone Indiranagar", gymId: "gym_002", membersOnboarded: 3, activeMembers: 2, renewals: 0, joinedAt: "2026-03-01", status: "active" },
  { id: "tr_005", name: "Karan Bhatt", gymName: "IronCore Mumbai Central", gymId: "gym_003", membersOnboarded: 32, activeMembers: 28, renewals: 12, joinedAt: "2025-11-10", status: "active" },
  { id: "tr_006", name: "Meera Joshi", gymName: "IronCore Mumbai Central", gymId: "gym_003", membersOnboarded: 25, activeMembers: 22, renewals: 9, joinedAt: "2025-11-15", status: "active" },
  { id: "tr_007", name: "Saurav Ghosh", gymName: "Pulse Fitness Delhi", gymId: "gym_004", membersOnboarded: 18, activeMembers: 16, renewals: 7, joinedAt: "2025-12-01", status: "active" },
  { id: "tr_008", name: "Tanvi Shah", gymName: "Pulse Fitness Delhi", gymId: "gym_004", membersOnboarded: 14, activeMembers: 11, renewals: 4, joinedAt: "2025-12-10", status: "active" },
  { id: "tr_009", name: "Aditya Kumar", gymName: "SweatBox Hyderabad", gymId: "gym_005", membersOnboarded: 9, activeMembers: 7, renewals: 2, joinedAt: "2026-02-05", status: "active" },
  { id: "tr_010", name: "Ritu Malhotra", gymName: "MaxRep Pune", gymId: "gym_007", membersOnboarded: 28, activeMembers: 24, renewals: 10, joinedAt: "2025-09-01", status: "active" },
  { id: "tr_011", name: "Nikhil Pandey", gymName: "MaxRep Pune", gymId: "gym_007", membersOnboarded: 22, activeMembers: 18, renewals: 8, joinedAt: "2025-09-15", status: "active" },
  { id: "tr_012", name: "Pooja Bose", gymName: "AthleteEdge Chennai", gymId: "gym_006", membersOnboarded: 10, activeMembers: 0, renewals: 0, joinedAt: "2025-10-15", status: "inactive" },
];

// ─── Mock Monthly Growth Data ─────────────────────────────────────────────────

const MOCK_MONTHLY: PlatformMonthlyPoint[] = [
  { month: "Sep", gyms: 3, subscriptions: 120, activations: 95,  revenue: 48000  },
  { month: "Oct", gyms: 4, subscriptions: 145, activations: 118, revenue: 58000  },
  { month: "Nov", gyms: 4, subscriptions: 162, activations: 140, revenue: 64800  },
  { month: "Dec", gyms: 5, subscriptions: 188, activations: 155, revenue: 75200  },
  { month: "Jan", gyms: 6, subscriptions: 231, activations: 206, revenue: 92400  },
  { month: "Feb", gyms: 7, subscriptions: 268, activations: 241, revenue: 107200 },
  { month: "Mar", gyms: 8, subscriptions: 317, activations: 285, revenue: 126800 },
];

// ─── Service Methods ──────────────────────────────────────────────────────────

export const getPlatformStats = async (): Promise<PlatformStats> => {
  await delay(700);
  return {
    totalGyms: MOCK_PLATFORM_GYMS.filter((g) => g.status !== "disabled").length,
    totalTrainers: MOCK_PLATFORM_TRAINERS.filter((t) => t.status === "active").length,
    totalMembers: MOCK_PLATFORM_GYMS.reduce((s, g) => s + g.totalMembers, 0),
    activeSubscriptions: MOCK_PLATFORM_GYMS.reduce((s, g) => s + g.activeMembers, 0),
    totalLicensesSold: MOCK_PLATFORM_GYMS.reduce((s, g) => s + g.licensesPurchased, 0),
    monthlyRecurringRevenue: 126800,
    gymGrowthRate: 14.3,
    subscriptionGrowthRate: 18.3,
  };
};

export const getAllPlatformGyms = async (): Promise<PlatformGym[]> => {
  await delay(600);
  return MOCK_PLATFORM_GYMS;
};

export const getAllPlatformTrainers = async (): Promise<PlatformTrainer[]> => {
  await delay(600);
  return MOCK_PLATFORM_TRAINERS;
};

export const getPlatformMonthlyData = async (): Promise<PlatformMonthlyPoint[]> => {
  await delay(500);
  return MOCK_MONTHLY;
};

export const disableGym = async (gymId: string): Promise<void> => {
  await delay(800);
  const gym = MOCK_PLATFORM_GYMS.find((g) => g.id === gymId);
  if (gym) gym.status = "disabled";
};

export const enableGym = async (gymId: string): Promise<void> => {
  await delay(800);
  const gym = MOCK_PLATFORM_GYMS.find((g) => g.id === gymId);
  if (gym) gym.status = "active";
};

export const addGym = async (data: Partial<PlatformGym>): Promise<PlatformGym> => {
  await delay(1200);
  const newGym: PlatformGym = {
    id: `gym_${Date.now()}`,
    name: data.name ?? "New Gym",
    location: data.location ?? "Unknown",
    owner: data.owner ?? "Unassigned",
    ownerEmail: data.ownerEmail ?? "",
    totalTrainers: 0,
    activeMembers: 0,
    totalMembers: 0,
    licensesPurchased: 0,
    licensesUsed: 0,
    status: "pending",
    joinedAt: new Date().toISOString().split("T")[0],
    plan: data.plan ?? "starter",
  };
  MOCK_PLATFORM_GYMS.push(newGym);
  return newGym;
};
