/**
 * PostLoginRedirect.tsx
 *
 * A router bridge: after verifyOtp succeeds we land here.
 * This component reads the freshly set user from AuthContext and decides
 * where to send them — avoiding conditional logic scattered across components.
 *
 * Decision tree:
 *   owner           → /owner/dashboard
 *   trainer, 1 gym  → auto-select gym → /trainer/dashboard
 *   trainer, n gyms → /gym-selection
 */

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useGym } from "../../context/GymContext";
import { Spinner } from "../../components/ui/Spinner";

export const PostLoginRedirect: React.FC = () => {
  const { user } = useAuth();
  const { selectGym } = useGym();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    if (user.role === "super_admin") {
      navigate("/admin/dashboard", { replace: true });
      return;
    }

    if (user.role === "owner") {
      navigate("/owner/dashboard", { replace: true });
      return;
    }

    if (user.role === "member") {
      navigate("/member/dashboard", { replace: true });
      return;
    }

    // Trainer flow
    if (user.gyms.length === 1) {
      selectGym(user.gyms[0]);
      navigate("/trainer/dashboard", { replace: true });
    } else {
      navigate("/gym-selection", { replace: true });
    }
  }, [user, navigate, selectGym]);

  return <Spinner fullPage label="Setting up your workspace…" />;
};
