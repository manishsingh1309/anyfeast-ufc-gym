/**
 * trainerService.ts
 *
 * Trainer-specific API calls — performance, commission, member assignments.
 * Swap for real fetch() when backend is ready.
 */

import { delay } from "../utils/delay";
import type { Trainer } from "../types";

// ─── Mock Trainer Profiles ────────────────────────────────────────────────────

export interface TrainerProfile extends Trainer {
  email: string;
  specialisation: string;
  certifications: string[];
  rating: number;
  isActive: boolean;
}

const MOCK_TRAINER_PROFILES: TrainerProfile[] = [
  {
    id: "tr_001",
    name: "Arjun Mehta",
    phone: "9999988888",
    email: "arjun@fitzone.in",
    gymId: "gym_001",
    joinedAt: "2026-01-15",
    membersOnboarded: 28,
    specialisation: "Strength & Conditioning",
    certifications: ["ACE Personal Trainer", "NSCA-CPT"],
    rating: 4.9,
    isActive: true,
  },
  {
    id: "tr_002",
    name: "Priya Nair",
    phone: "9876543210",
    email: "priya@fitzone.in",
    gymId: "gym_001",
    joinedAt: "2026-02-01",
    membersOnboarded: 24,
    specialisation: "Weight Loss & Nutrition",
    certifications: ["ISSA-CPT", "Precision Nutrition L1"],
    rating: 4.7,
    isActive: true,
  },
  {
    id: "tr_003",
    name: "Rahul Verma",
    phone: "9123456789",
    email: "rahul@fitzone.in",
    gymId: "gym_002",
    joinedAt: "2026-01-20",
    membersOnboarded: 19,
    specialisation: "CrossFit & HIIT",
    certifications: ["CrossFit L2", "ACSM-CPT"],
    rating: 4.6,
    isActive: true,
  },
  {
    id: "tr_004",
    name: "Sneha Kapoor",
    phone: "9988776655",
    email: "sneha@fitzone.in",
    gymId: "gym_002",
    joinedAt: "2026-03-01",
    membersOnboarded: 15,
    specialisation: "Yoga & Flexibility",
    certifications: ["RYT-200", "NASM-CPT"],
    rating: 4.8,
    isActive: true,
  },
  {
    id: "tr_005",
    name: "Vikrant Yadav",
    phone: "9871234567",
    email: "vikrant@fitzone.in",
    gymId: "gym_001",
    joinedAt: "2026-02-15",
    membersOnboarded: 11,
    specialisation: "Bodybuilding",
    certifications: ["ISSA-CPT"],
    rating: 4.5,
    isActive: false,
  },
];

// ─── Commission Config ─────────────────────────────────────────────────────────

const COMMISSION_PER_MEMBER = 1500; // ₹ per onboarded member
const COMMISSION_RENEWAL_BONUS = 500; // ₹ additional per renewal

// ─── Service Methods ──────────────────────────────────────────────────────────

/**
 * Get a trainer's profile by ID.
 * In production: GET /api/trainers/:id
 */
export const getTrainerProfile = async (
  trainerId: string
): Promise<TrainerProfile | null> => {
  await delay(400);
  return MOCK_TRAINER_PROFILES.find((t) => t.id === trainerId) ?? null;
};

/**
 * Get all trainer profiles (with full details) for a gym.
 * In production: GET /api/gyms/:gymId/trainers?include=profile
 */
export const getTrainerProfilesByGym = async (
  gymId: string
): Promise<TrainerProfile[]> => {
  await delay(600);
  return MOCK_TRAINER_PROFILES.filter((t) => t.gymId === gymId);
};

/**
 * Get all trainer profiles across all gyms.
 * In production: GET /api/owner/trainers?include=profile
 */
export const getAllTrainerProfiles = async (): Promise<TrainerProfile[]> => {
  await delay(700);
  return MOCK_TRAINER_PROFILES;
};

/**
 * Calculate commission earned by a trainer.
 * In production: GET /api/trainers/:id/commission
 */
export const getTrainerCommission = async (
  trainerId: string,
  renewalCount: number
): Promise<number> => {
  await delay(300);
  const profile = MOCK_TRAINER_PROFILES.find((t) => t.id === trainerId);
  if (!profile) return 0;
  return (
    profile.membersOnboarded * COMMISSION_PER_MEMBER +
    renewalCount * COMMISSION_RENEWAL_BONUS
  );
};

/**
 * Update trainer's active status (for owner).
 * In production: PATCH /api/trainers/:id
 */
export const setTrainerActive = async (
  trainerId: string,
  isActive: boolean
): Promise<TrainerProfile> => {
  await delay(600);
  const trainer = MOCK_TRAINER_PROFILES.find((t) => t.id === trainerId);
  if (!trainer) throw new Error(`Trainer ${trainerId} not found.`);
  trainer.isActive = isActive;
  return { ...trainer };
};

/**
 * Invite a new trainer to a gym (mock).
 * In production: POST /api/gyms/:gymId/trainers/invite
 */
export const inviteTrainer = async (data: {
  name: string;
  email: string;
  phone: string;
  gymId: string;
  specialisation: string;
}): Promise<TrainerProfile> => {
  await delay(1200);
  const newTrainer: TrainerProfile = {
    id: `tr_new_${Date.now()}`,
    name: data.name,
    phone: data.phone,
    email: data.email,
    gymId: data.gymId,
    joinedAt: new Date().toISOString().split("T")[0],
    membersOnboarded: 0,
    specialisation: data.specialisation,
    certifications: [],
    rating: 0,
    isActive: true,
  };
  MOCK_TRAINER_PROFILES.push(newTrainer);
  return newTrainer;
};
