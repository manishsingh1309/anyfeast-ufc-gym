/**
 * analyticsService.ts
 *
 * Analytics data for the owner analytics dashboard.
 * All mocked — wire to real API when backend is ready.
 */

import { delay } from "../utils/delay";
import type { AnalyticsSummary, MonthlyDataPoint, TrainerLeaderboardEntry } from "../types";

export const getAnalyticsSummary = async (): Promise<AnalyticsSummary> => {
  await delay(700);
  return {
    activationRate: 78,
    renewalRate: 64,
    avgMembersPerTrainer: 12,
    totalRevenue: 218400,
  };
};

export const getMonthlyData = async (): Promise<MonthlyDataPoint[]> => {
  await delay(600);
  return [
    { month: "Sep", activations: 18, renewals: 6 },
    { month: "Oct", activations: 24, renewals: 10 },
    { month: "Nov", activations: 31, renewals: 14 },
    { month: "Dec", activations: 22, renewals: 18 },
    { month: "Jan", activations: 38, renewals: 22 },
    { month: "Feb", activations: 45, renewals: 28 },
    { month: "Mar", activations: 51, renewals: 34 },
  ];
};

export const getTrainerLeaderboard = async (): Promise<TrainerLeaderboardEntry[]> => {
  await delay(700);
  return [
    {
      trainerId: "tr_001", trainerName: "Arjun Mehta",
      membersOnboarded: 28, activeMembers: 22, renewals: 14, commissionEarned: 42000,
    },
    {
      trainerId: "tr_002", trainerName: "Priya Nair",
      membersOnboarded: 24, activeMembers: 20, renewals: 11, commissionEarned: 36000,
    },
    {
      trainerId: "tr_003", trainerName: "Rahul Verma",
      membersOnboarded: 19, activeMembers: 15, renewals: 8, commissionEarned: 28500,
    },
    {
      trainerId: "tr_004", trainerName: "Sneha Kapoor",
      membersOnboarded: 15, activeMembers: 12, renewals: 6, commissionEarned: 22500,
    },
    {
      trainerId: "tr_005", trainerName: "Vikrant Yadav",
      membersOnboarded: 11, activeMembers: 9, renewals: 4, commissionEarned: 16500,
    },
  ];
};
