/**
 * authService.ts
 *
 * All authentication API calls live here. Components never call fetch directly.
 * When the real backend is ready, only this file needs to change.
 */

import { delay } from "../utils/delay";
import type { AuthResponse, OTPVerifyPayload, User } from "../types";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_TRAINER: User = {
  id: "usr_trainer_001",
  name: "Manish Singh",
  phone: "9999988888",
  role: "trainer",
  gyms: [
    { id: "gym_001", name: "FitZone Koramangala", location: "Bangalore" },
    { id: "gym_002", name: "FitZone Indiranagar", location: "Bangalore" },
  ],
};

const MOCK_OWNER: User = {
  id: "usr_owner_001",
  name: "Priya Mehta",
  phone: "8888877777",
  role: "owner",
  gyms: [
    { id: "gym_001", name: "FitZone Koramangala", location: "Bangalore" },
    { id: "gym_002", name: "FitZone Indiranagar", location: "Bangalore" },
  ],
};

const MOCK_MEMBER: User = {
  id: "usr_member_001",
  name: "Ravi Kumar",
  phone: "7777766666",
  role: "member",
  memberId: "mem_001",
  gyms: [
    { id: "gym_001", name: "FitZone Koramangala", location: "Bangalore" },
  ],
};

const MOCK_SUPER_ADMIN: User = {
  id: "usr_superadmin_001",
  name: "AnyFeast Admin",
  phone: "9000000000",
  email: "admin@anyfeast.io",
  role: "super_admin",
  gyms: [],
};

// Map phone → mock user (simulates DB lookup)
const MOCK_USER_MAP: Record<string, User> = {
  "9999988888": MOCK_TRAINER,
  "8888877777": MOCK_OWNER,
  "7777766666": MOCK_MEMBER,
  "9000000000": MOCK_SUPER_ADMIN,
};

// The only valid OTP accepted in the mock
const VALID_OTP = "123456";

// ─── Service Methods ──────────────────────────────────────────────────────────

/**
 * Sends an OTP to the user's phone/email.
 * In production: POST /api/auth/otp/send
 */
export const sendOtp = async (contact: string): Promise<{ success: boolean }> => {
  await delay(1000);

  const isKnownContact = Object.keys(MOCK_USER_MAP).includes(contact);
  if (!isKnownContact) {
    throw new Error("No account found with this phone number.");
  }

  console.log(`[AuthService] OTP sent to ${contact}: ${VALID_OTP}`);
  return { success: true };
};

/**
 * Verifies the OTP and returns user + token on success.
 * In production: POST /api/auth/otp/verify
 */
export const verifyOtp = async (
  payload: OTPVerifyPayload
): Promise<AuthResponse> => {
  await delay(1200);

  if (payload.otp !== VALID_OTP) {
    throw new Error("Invalid OTP. Please try again.");
  }

  const user = MOCK_USER_MAP[payload.contact];
  if (!user) {
    throw new Error("User not found.");
  }

  return {
    user,
    token: `mock_jwt_${user.id}_${Date.now()}`,
  };
};

/**
 * Validates the stored token (called on app boot).
 * In production: GET /api/auth/me with Authorization header.
 */
export const getMe = async (token: string): Promise<User> => {
  await delay(500);

  // Extract userId from our fake token format
  const parts = token.split("_");
  const userId = parts.slice(2, 5).join("_"); // "usr_trainer_001" or "usr_owner_001"

  const allUsers = Object.values(MOCK_USER_MAP);
  const user = allUsers.find((u) => u.id === userId);

  if (!user) throw new Error("Session expired. Please log in again.");
  return user;
};
