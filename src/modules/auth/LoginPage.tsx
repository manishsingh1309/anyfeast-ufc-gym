/**
 * LoginPage.tsx
 *
 * Step 1 of authentication: Collect phone number and dispatch OTP.
 *
 * Architecture decisions:
 * - sendOtp() called from here, NOT from the context. The context only handles
 *   full auth (verifyOtp). This keeps the OTP flow UI-adjacent. 
 * - We pass `contact` via router state to OtpPage so no shared mutable state.
 * - Form error is local UI state — it does not belong in any context.
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendOtp } from "../../services/authService";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Logo } from "../../components/ui/Logo";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [contact, setContact] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isValid = contact.trim().length >= 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setError("");
    setIsLoading(true);

    try {
      await sendOtp(contact.trim());
      // Navigate and pass contact so OtpPage knows who we're verifying
      navigate("/otp", { state: { contact: contact.trim() } });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 via-white to-accent-50/30 px-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="mb-8 flex flex-col items-center gap-4">
          <Logo variant="full" className="h-14 w-auto" />
          <div className="flex flex-col items-center gap-1">
            <p className="text-sm font-semibold text-gray-700">Gym Partner Portal</p>
            <p className="text-xs text-gray-400">Nutrition · Fitness · Growth</p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-card">
          <h2 className="mb-1 text-lg font-bold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mb-6 text-sm text-gray-400">
            Enter your registered phone number to receive an OTP.
          </p>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <Input
              label="Phone Number"
              type="tel"
              placeholder="e.g. 9999988888"
              value={contact}
              onChange={(e) => {
                setContact(e.target.value);
                setError("");
              }}
              error={error}
              disabled={isLoading}
              autoFocus
              autoComplete="tel"
              hint='Use "9999988888" (trainer) or "8888877777" (owner) for demo'
            />

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              disabled={!isValid}
            >
              Send OTP
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-gray-300">
          AnyFeast Gym Partner Portal · v0.1
        </p>
      </div>
    </div>
  );
};
