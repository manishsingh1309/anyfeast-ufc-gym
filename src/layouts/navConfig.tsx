import React from "react";
import {
  BarChart3,
  BookOpen,
  Building2,
  LayoutDashboard,
  Package,
  Settings,
  Tag,
  UserPlus,
  Users,
  Utensils,
  CreditCard,
  Shield,
} from "lucide-react";
import type { UserRole } from "../types";

export interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
}

export const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  super_admin: [
    { label: "Platform Overview", path: "/admin/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: "All Gyms", path: "/admin/gyms", icon: <Building2 className="h-4 w-4" /> },
    { label: "All Trainers", path: "/admin/trainers", icon: <Users className="h-4 w-4" /> },
    { label: "All Members", path: "/admin/members", icon: <UserPlus className="h-4 w-4" /> },
    { label: "Platform Analytics", path: "/admin/analytics", icon: <BarChart3 className="h-4 w-4" /> },
    { label: "Settings", path: "/admin/settings", icon: <Settings className="h-4 w-4" /> },
  ],
  trainer: [
    { label: "Dashboard", path: "/trainer/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: "My Members", path: "/trainer/members", icon: <Users className="h-4 w-4" /> },
    { label: "Onboard Member", path: "/trainer/onboard", icon: <UserPlus className="h-4 w-4" /> },
    { label: "Coupons", path: "/trainer/coupons", icon: <Tag className="h-4 w-4" /> },
    { label: "Nutrition Plans", path: "/trainer/nutrition", icon: <BookOpen className="h-4 w-4" /> },
    { label: "Switch Gym", path: "/gym-selection", icon: <Building2 className="h-4 w-4" /> },
    { label: "Settings", path: "/trainer/settings", icon: <Settings className="h-4 w-4" /> },
  ],
  owner: [
    { label: "Overview", path: "/owner/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: "License Pools", path: "/owner/licenses", icon: <Package className="h-4 w-4" /> },
    { label: "My Gyms", path: "/owner/gyms", icon: <Building2 className="h-4 w-4" /> },
    { label: "Trainers", path: "/owner/trainers", icon: <Users className="h-4 w-4" /> },
    { label: "Members", path: "/owner/members", icon: <UserPlus className="h-4 w-4" /> },
    { label: "Nutrition Plans", path: "/owner/nutrition", icon: <BookOpen className="h-4 w-4" /> },
    { label: "Analytics", path: "/owner/analytics", icon: <BarChart3 className="h-4 w-4" /> },
    { label: "Settings", path: "/owner/settings", icon: <Settings className="h-4 w-4" /> },
  ],
  member: [
    { label: "My Dashboard", path: "/member/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: "My Membership", path: "/member/membership", icon: <CreditCard className="h-4 w-4" /> },
    { label: "My Nutrition Plan", path: "/member/nutrition", icon: <Utensils className="h-4 w-4" /> },
    { label: "Settings", path: "/member/settings", icon: <Settings className="h-4 w-4" /> },
  ],
};

// Unused but kept for referencing the Shield icon
void Shield;
