/**
 * OtpPage.tsx
 *
 * Step 2 of authentication: OTP verification.
 *
 * - Reads `contact` from router location.state (set by LoginPage).
 * - Calls auth.login() which calls verifyOtp, then persists session.
 * - On success, navigates to the appropriate dashboard or gym-selection screen.
 * - Supports "Resend OTP" with a cooldown timer.
 */

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { sendOtp } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/Button";
import { OtpInput } from "../../components/ui/OtpInput";
import { ArrowLeft, ShieldCheck } from "lucide-react";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SEC = 30;

export const OtpPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Guard: if someone navigates here directly without a contact, go back
  const contact: string | undefined = (
    location.state as { contact?: string }
  )?.contact;

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SEC);
  const [isResending, setIsResending] = useState(false);

  // Countdown timer for resend
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  useEffect(() => {
    if (!contact) {
      navigate("/login", { replace: true });
    }
  }, [contact, navigate]);

  const handleVerify = async () => {
    if (otp.length < OTP_LENGTH) return;
    setError("");
    setIsLoading(true);

    try {
      await login(contact!, otp);

      // Post-login routing: service returns user via context
      // We re-read from context after login — check router-guard handles redirect
      // navigate is handled by the auth route redirect logic in App.tsx
      // But we do an explicit push here for clarity and UX responsiveness:
      navigate("/post-login", { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Verification failed.");
      setOtp("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!contact || isResending) return;
    setIsResending(true);
    setError("");
    try {
      await sendOtp(contact);
      setCooldown(RESEND_COOLDOWN_SEC);
      setOtp("");
    } catch {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  if (!contact) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-white px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <button
          onClick={() => navigate("/login")}
          className="mb-6 flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          {/* Icon */}
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
            <ShieldCheck className="h-6 w-6 text-indigo-600" />
          </div>

          <h2 className="mb-1 text-lg font-semibold text-gray-800">
            Enter verification code
          </h2>
          <p className="mb-6 text-sm text-gray-500">
            We sent a 6-digit code to{" "}
            <span className="font-medium text-gray-700">{contact}</span>.
          </p>

          {/* OTP boxes */}
          <div className="mb-6 flex flex-col gap-4">
            <OtpInput
              value={otp}
              onChange={setOtp}
              disabled={isLoading}
              error={!!error}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <p className="text-xs text-gray-400">
              Demo OTP:{" "}
              <span className="font-mono font-bold text-gray-600">123456</span>
            </p>
          </div>

          {/* Verify button */}
          <Button
            fullWidth
            isLoading={isLoading}
            disabled={otp.length < OTP_LENGTH}
            onClick={handleVerify}
          >
            Verify & Sign In
          </Button>

          {/* Resend */}
          <div className="mt-4 text-center">
            {cooldown > 0 ? (
              <p className="text-sm text-gray-400">
                Resend in{" "}
                <span className="font-medium text-gray-600">{cooldown}s</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={isResending}
                className="text-sm font-medium text-indigo-600 hover:underline disabled:opacity-50"
              >
                {isResending ? "Sending…" : "Resend OTP"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
